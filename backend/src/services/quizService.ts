import prisma from '../lib/prisma';
import { AppError, notFoundTo404 } from '../middleware/errorHandler';

export const getQuizQuestions = async (courseId: string, week: number) => {
  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      week
    },
    include: {
      quizQuestions: true
    }
  });

  if (!moduleRecord) return null;

  const safeQuestions = moduleRecord.quizQuestions.map(({ correctAnswer, ...q }) => ({
    ...q
  }));

  return {
    courseId,
    week,
    questions: safeQuestions
  };
};

// Questions a topic quiz serves — and therefore the size of the graded set.
const TOPIC_QUIZ_SIZE = 5;

export const submitQuiz = async (userId: number, courseId: string, week: number, answers: Record<number, string>, topicId?: number) => {
  const questionIds = Object.keys(answers).map(id => parseInt(id));
  if (questionIds.length === 0) return null;

  // The claimed week must resolve to a real module of this course: progress is
  // written against that module, so an unknown week is a 404, never an upsert.
  const moduleRecord = await prisma.module.findFirst({
    where: { courseId, week },
    include: { _count: { select: { quizQuestions: true } } }
  });

  if (!moduleRecord) return null;

  // Use the course's real module count instead of a hardcoded 20 (issue #70).
  // A fixed /20 left short courses stuck at 25% (CADDED originally had 5 weeks;
  // both CADDED reseeds now run the full 20-week curriculum like any other course).
  const totalModules = await prisma.module.count({ where: { courseId } });
  const requiredWeeks = totalModules > 0 ? totalModules : 20;

  const questions = await prisma.quizQuestion.findMany({
    where: {
      id: { in: questionIds }
    },
    include: {
      topic: { select: { id: true, title: true } },
      module: { select: { courseId: true } }
    }
  });

  if (questions.length === 0) return null;

  // SECURITY (TASK 4 §J): ownership chain — every submitted question id must
  // resolve AND belong to a module of `courseId`. A user enrolled in C cannot
  // submit C++ questions (or a mixed bank) against courseId=C.
  const allResolved = questions.length === questionIds.length;
  const allOwnedByCourse = questions.every((q) => q.module.courseId === courseId);
  if (!allResolved || !allOwnedByCourse) {
    throw new AppError('Quiz submission contains questions that do not belong to this course.', 403);
  }

  // SECURITY: grade the quiz that was served, not the subset the client chose to
  // send. `totalQuestions` used to be answers.length, so one correct answer
  // scored 100 and passed the module (which then advanced ModuleProgress,
  // CourseProgress and every downstream gate). Unanswered questions now count as
  // wrong, matching what the quiz UI tells the student.
  let totalQuestions: number;

  if (topicId !== undefined) {
    // topicId must also belong to courseId and this week's module.
    const topicOwnership = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        module: { select: { courseId: true, week: true } },
        _count: { select: { quizQuestions: true } }
      }
    });
    if (!topicOwnership || topicOwnership.module.courseId !== courseId || topicOwnership.module.week !== week) {
      throw new AppError('Topic does not belong to this course/week.', 403);
    }
    if (!questions.every((q) => q.topicId === topicId)) {
      throw new AppError('Quiz submission contains questions that do not belong to this topic.', 403);
    }
    totalQuestions = Math.min(TOPIC_QUIZ_SIZE, topicOwnership._count.quizQuestions);
  } else {
    // A question from another week of the same course must not mark THIS week
    // complete (the course-level check above is not a module-level check).
    if (!questions.every((q) => q.moduleId === moduleRecord.id)) {
      throw new AppError('Quiz submission contains questions that do not belong to this week.', 403);
    }
    totalQuestions = moduleRecord._count.quizQuestions;
  }

  // A submission must never be able to shrink its own denominator to zero.
  if (totalQuestions < 1) return null;

  let correctCount = 0;
  const breakdown = questions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      text: q.text,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      // Per-section grouping for the results modal (issue #76)
      topicId: q.topicId ?? undefined,
      topicTitle: q.topic?.title ?? null
    };
  });

  // Capped at 100: a topic quiz may legitimately be answered with more questions
  // than the sample it served, which would otherwise report >100%.
  const score = Math.min(100, Math.round((correctCount / totalQuestions) * 100));
  const passed = score >= 60;

  const result = await prisma.quizResult.create({
    data: {
      userId,
      courseId,
      week,
      score,
      passed
    }
  });

  if (passed) {
    // SECURITY (#100): award XP for a passing submission only ONCE per
    // (user, course, week). Re-submitting an already-passed quiz used to farm
    // unlimited 100/150 XP. (QuizResult has no topicId, so week is the scope.)
    const alreadyPassed = await prisma.quizResult.findFirst({
      where: { userId, courseId, week, passed: true },
      select: { id: true },
    });

    const userRecord = await prisma.user.findUnique({ where: { id: userId } });
    if (userRecord && !alreadyPassed) {
      let xpToAward = 100;
      if (score === 100) {
        xpToAward += 50;
      }

      const currentBadges = userRecord.badges || [];
      const newBadges = [...currentBadges];

      if (score === 100 && !newBadges.includes('perfect_score')) {
        newBadges.push('perfect_score');
      }
      if (week === 1 && !newBadges.includes('week_1_master')) {
        newBadges.push('week_1_master');
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          points: userRecord.points + xpToAward,
          badges: newBadges
        }
      });
    }

    if (topicId) {
      // Create/Update TopicProgress
      await prisma.topicProgress.upsert({
        where: {
          userId_topicId: {
            userId,
            topicId
          }
        },
        update: {
          completed: true,
          quizPassed: true,
          quizScore: score
        },
        create: {
          userId,
          courseId,
          topicId,
          completed: true,
          quizPassed: true,
          quizScore: score
        }
      });

      // Verify if it is the last topic to mark module/course completion
      const topicRecord = await prisma.topic.findUnique({
        where: { id: topicId },
        include: {
          module: {
            include: {
              topics: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (topicRecord) {
        const topicsInModule = topicRecord.module.topics;
        const lastTopic = topicsInModule[topicsInModule.length - 1];

        if (lastTopic && lastTopic.id === topicId) {
          // Mark module-level progress as completed
          await prisma.moduleProgress.upsert({
            where: {
              userId_moduleId: {
                userId,
                moduleId: topicRecord.moduleId
              }
            },
            update: {
              completed: true,
              quizPassed: true,
              quizScore: score
            },
            create: {
              userId,
              courseId,
              moduleId: topicRecord.moduleId,
              completed: true,
              quizPassed: true,
              quizScore: score
            }
          });

          // Advance overall CourseProgress
          const currentProgress = await prisma.courseProgress.findUnique({
            where: {
              userId_courseId: {
                userId,
                courseId
              }
            }
          });

          const currentWeekCompleted = currentProgress?.weekCompleted || 0;

          if (week > currentWeekCompleted) {
            await prisma.courseProgress.upsert({
              where: {
                userId_courseId: {
                  userId,
                  courseId
                }
              },
              update: {
                weekCompleted: week,
                progress: Math.min(Math.round((week / requiredWeeks) * 100), 100),
                completed: week >= requiredWeeks
              },
              create: {
                userId,
                courseId,
                weekCompleted: week,
                progress: Math.min(Math.round((week / requiredWeeks) * 100), 100),
                completed: week >= requiredWeeks
              }
            });
          }
        }
      }
    } else {
      // Standard Module-level progress update (e.g. CADDED) — moduleRecord was
      // already resolved and validated against the claimed week above.
      if (moduleRecord) {
        await prisma.moduleProgress.upsert({
          where: {
            userId_moduleId: {
              userId,
              moduleId: moduleRecord.id
            }
          },
          update: {
            completed: true,
            quizPassed: true,
            quizScore: score
          },
          create: {
            userId,
            courseId,
            moduleId: moduleRecord.id,
            completed: true,
            quizPassed: true,
            quizScore: score
          }
        });
      }

      const currentProgress = await prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      const currentWeekCompleted = currentProgress?.weekCompleted || 0;

      if (week > currentWeekCompleted) {
        await prisma.courseProgress.upsert({
          where: {
            userId_courseId: {
              userId,
              courseId
            }
          },
          update: {
            weekCompleted: week,
            progress: Math.min(Math.round((week / requiredWeeks) * 100), 100),
            completed: week >= requiredWeeks
          },
          create: {
            userId,
            courseId,
            weekCompleted: week,
            progress: Math.min(Math.round((week / requiredWeeks) * 100), 100),
            completed: week >= requiredWeeks
          }
        });
      }
    }
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progresses: true,
      results: true
    }
  });

  return {
    result,
    score,
    passed,
    breakdown,
    updatedUser
  };
};

export const createQuizQuestion = async (moduleId: number, data: { text: string; options: string[]; correctAnswer: string }) => {
  const newQuestion = await prisma.quizQuestion.create({
    data: {
      moduleId,
      text: data.text,
      options: data.options,
      correctAnswer: data.correctAnswer
    }
  });
  return newQuestion;
};

export const updateQuizQuestion = async (questionId: number, data: { text?: string; options?: string[]; correctAnswer?: string }) => {
  return await notFoundTo404(prisma.quizQuestion.update({
    where: { id: questionId },
    data: {
      text: data.text,
      options: data.options,
      correctAnswer: data.correctAnswer
    }
  }), `Quiz question ${questionId} not found`);
};

export const deleteQuizQuestion = async (questionId: number) => {
  return await notFoundTo404(prisma.quizQuestion.delete({ where: { id: questionId } }), `Quiz question ${questionId} not found`);
};

export const getTopicQuizQuestions = async (topicId: number) => {
  const questions = await prisma.quizQuestion.findMany({
    where: { topicId }
  });

  if (questions.length === 0) return null;

  // Shuffle and take TOPIC_QUIZ_SIZE random questions to create a dynamic/randomized
  // question bank experience. The same constant is the graded denominator in submitQuiz.
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, TOPIC_QUIZ_SIZE);

  const safeQuestions = selected.map(({ correctAnswer, ...q }) => ({
    ...q
  }));

  const topicRecord = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      module: true
    }
  });

  return {
    courseId: topicRecord?.module.courseId || '',
    week: topicRecord?.module.week || 0,
    topicId,
    questions: safeQuestions
  };
};

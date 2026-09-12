import { Router } from 'express';
import prisma from '../lib/prisma';
import * as quizService from '../services/quizService';
import { requireEnrollment } from '../services/enrollmentService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { validate, quizSubmissionSchema, createQuestionSchema } from '../middleware/validation';

const router = Router();

// GET /api/quiz/questions/topic/:topicId - Fetch questions for a specific topic's quiz (omitting correct answers)
// Auth required: the question bank should not be enumerable without a session.
// TASK 4: the topic's owning course is resolved server-side and ACTIVE
// enrollment is required — a bare topicId is never treated as proof of course.
// NOTE: registered BEFORE the generic /:courseId/:week route below, otherwise Express
// would match "/questions/topic/517" as courseId="topic", week="517" and topic quizzes
// would always 404 (this was a live UI-breaking bug).
router.get('/questions/topic/:topicId', authenticateToken, async (req: any, res: any, next: any) => {
  try {
    const topicId = parseInt(req.params.topicId);

    // Ownership chain: topic → module → course.
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { module: { select: { courseId: true } } }
    });
    if (!topic) {
      return res.status(404).json({ message: 'Quiz for this topic not found' });
    }
    if (!(await requireEnrollment(req, res, topic.module.courseId))) return;

    const quizData = await quizService.getTopicQuizQuestions(topicId);

    if (!quizData) {
      return res.status(404).json({ message: 'Quiz for this topic not found' });
    }

    res.json(quizData);
  } catch (error) {
    next(error);
  }
});

// GET /api/quiz/questions/:courseId/:week - Fetch questions for a specific week's quiz (omitting correct answers)
// Auth required: the question bank should not be enumerable without a session.
// TASK 4: ACTIVE enrollment required for the course.
router.get('/questions/:courseId/:week', authenticateToken, async (req: any, res: any, next: any) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = parseInt(week);

    if (!(await requireEnrollment(req, res, courseId))) return;

    const quizData = await quizService.getQuizQuestions(courseId, weekNum);

    if (!quizData) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    res.json(quizData);
  } catch (error) {
    next(error);
  }
});

// POST /api/quiz/submit - Grade quiz submissions and update course progress
// SECURITY (#64): authenticated only — userId is taken from the verified JWT, never from the request body.
// SECURITY (TASK 4): the course must be one the user is ACTIVE-enrolled in, and the
// service rejects any answer key referencing questions outside that course.
router.post('/submit', authenticateToken, validate(quizSubmissionSchema), async (req: any, res: any, next: any) => {
  try {
    const { courseId, week, topicId, answers } = req.body;
    const weekNum = parseInt(week);
    const userIdNum = req.user.id; // from JWT, body userId is ignored
    const topicIdNum = topicId ? parseInt(topicId) : undefined;

    if (!(await requireEnrollment(req, res, courseId))) return;

    const submissionResult = await quizService.submitQuiz(userIdNum, courseId, weekNum, answers, topicIdNum);

    if (!submissionResult) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    res.json(submissionResult);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - POST /api/quiz/module/:moduleId/question (Add Quiz Question)
router.post('/module/:moduleId/question', authenticateToken, isAdmin, validate(createQuestionSchema), async (req: any, res: any, next: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { text, options, correctAnswer } = req.body;

    const newQuestion = await quizService.createQuizQuestion(moduleId, { text, options, correctAnswer });
    res.status(201).json(newQuestion);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - PUT /api/quiz/question/:questionId (Update Quiz Question)
router.put('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { text, options, correctAnswer } = req.body;

    const updatedQuestion = await quizService.updateQuizQuestion(questionId, { text, options, correctAnswer });
    res.json(updatedQuestion);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - DELETE /api/quiz/question/:questionId (Delete Quiz Question)
router.delete('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    await quizService.deleteQuizQuestion(questionId);
    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

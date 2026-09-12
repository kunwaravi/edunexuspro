import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { caddCivilSections } from './content/cadd_civil';
import { caddCivilTopicQuizzes } from './content/cadd_civil_topic_quizzes';
import { caddBimPracticeQuestions } from './content/cadd_bim_practice';

dotenv.config();

const prisma = new PrismaClient();

/**
 * Full-replace reseed for the CADD & BIM Foundation (Architecture/Visualization)
 * course (issue #93; repositioned from "CADDED Software (Civil/Architecture)"
 * per Wave-0 Decision 1-B — the course teaches CADD + architectural BIM, not
 * Civil 3D).
 *
 * Replaces the machine-generated template content (near-duplicate quizzes from
 * seed.ts) with the deep, hand-written GfG-style curriculum in content/cadd_civil.ts:
 *   - 20 modules (weeks) with original teaching topics covering AutoCAD,
 *     3ds Max, SketchUp, and Revit (Structural + Architecture) BIM workflows
 *   - Per-topic quiz questions attached to each topic (required by the
 *     frontend topic-lock flow — every topic must have its own quiz or the
 *     "Start Topic Quiz" 404s and locks all later topics)
 *   - Section-level chapter quizzes (module-level, no topicId)
 *
 * Modules themselves are preserved (so admin module edits + Challenge records
 * survive); only the leaf nodes (topics + quiz questions) for the CADDED_Civil
 * course are rebuilt, and the course title/description are synced to the
 * current positioning. Idempotent: safe to run multiple times.
 *
 * D1e: also seeds the CADD & BIM practice-arena set (category 'Design') when no
 * Design questions exist yet — skipped otherwise so admin edits survive.
 *
 * NOTE: the old 18-question final exam is deprecated (Wave-0 Decision 2-B);
 * it is NOT seeded here. The 156-item archive lives in docs/final-exam-archive/.
 */

const COURSE_ID = 'CADDED_Civil';

const COURSE_TITLE = 'CADD & BIM Foundation (Architecture/Visualization)';
const COURSE_DESCRIPTION =
  'Master CADD drafting, architectural visualization and structural BIM across AutoCAD, 3ds Max, SketchUp and Revit — from site & floor plans to 3D models, renders, rebar detailing and coordinated BIM sheet sets.';

async function main() {
  console.log('--- FULL RE-SEED: CADD & BIM Foundation (Architecture/Visualization) ---');

  // Ensure the course exists without clobbering admin edits; sync title/desc
  // on mismatch so a reseed propagates the current positioning (reseed only
  // set these on CREATE before, which left stale metadata behind).
  let course = await prisma.course.findUnique({ where: { id: COURSE_ID } });
  if (!course) {
    course = await prisma.course.create({
      data: {
        id: COURSE_ID,
        title: COURSE_TITLE,
        description: COURSE_DESCRIPTION,
        price: 699,
        isPublished: true,
      },
    });
    console.log(`Created Course: ${COURSE_ID}`);
  } else if (course.title !== COURSE_TITLE || course.description !== COURSE_DESCRIPTION) {
    course = await prisma.course.update({
      where: { id: course.id },
      data: { title: COURSE_TITLE, description: COURSE_DESCRIPTION },
    });
    console.log(`Updated Course ${COURSE_ID} title/description (repositioned).`);
  } else {
    console.log(`Course ${COURSE_ID} already exists (id ${course.id}).`);
  }

  let totalTopics = 0;
  let totalTopicQuizzes = 0;
  let totalChapterQuizzes = 0;

  for (const section of caddCivilSections) {
    const week = section.week;

    // Find-or-create the module (preserving id, so Challenge links stay valid).
    let moduleRecord = await prisma.module.findUnique({
      where: { courseId_week: { courseId: COURSE_ID, week } },
    });
    if (!moduleRecord) {
      moduleRecord = await prisma.module.create({
        data: {
          courseId: COURSE_ID,
          week,
          title: section.title,
          description: section.description,
        },
      });
    } else if (moduleRecord.title !== section.title || moduleRecord.description !== section.description) {
      moduleRecord = await prisma.module.update({
        where: { id: moduleRecord.id },
        data: { title: section.title, description: section.description },
      });
    }

    // Full-replace the leaf nodes for this module: old template topics +
    // quizzes are removed, new deep content is created.
    await prisma.quizQuestion.deleteMany({ where: { moduleId: moduleRecord.id } });
    await prisma.topic.deleteMany({ where: { moduleId: moduleRecord.id } });

    // Create topics and attach their per-topic quizzes (topic-lock flow).
    for (let i = 0; i < section.topics.length; i++) {
      const topic = section.topics[i];
      const topicRecord = await prisma.topic.create({
        data: {
          moduleId: moduleRecord.id,
          title: topic.title,
          text: topic.text,
          code: topic.code,
          note: topic.note,
          order: i,
        },
      });
      totalTopics++;

      const topicQuizzes = caddCivilTopicQuizzes[topic.title];
      if (!topicQuizzes) {
        console.warn(`  ⚠  No topic quiz map entry for: "${topic.title}" (week ${week})`);
        continue;
      }
      for (const q of topicQuizzes) {
        await prisma.quizQuestion.create({
          data: {
            moduleId: moduleRecord.id,
            topicId: topicRecord.id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          },
        });
        totalTopicQuizzes++;
      }
    }

    // Create the section-level chapter quiz (module-level, no topicId).
    for (const q of section.quizzes) {
      await prisma.quizQuestion.create({
        data: {
          moduleId: moduleRecord.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
        },
      });
      totalChapterQuizzes++;
    }

    console.log(
      `✅ Week ${week}: "${section.title}" → ${section.topics.length} topics, ` +
        `${section.quizzes.length} chapter quizzes`
    );
  }

  // D1e: seed the CADD & BIM practice set for the arena (category 'Design').
  // Skip when Design questions already exist so admin edits survive a reseed.
  const existingDesignCount = await prisma.practiceQuestion.count({
    where: { category: 'Design' },
  });
  if (existingDesignCount === 0) {
    for (const pq of caddBimPracticeQuestions) {
      await prisma.practiceQuestion.create({ data: pq });
    }
    console.log(`\nSeeded ${caddBimPracticeQuestions.length} Design practice questions (practice arena).`);
  } else {
    console.log(`\nDesign practice questions already exist (${existingDesignCount}). Skipping to preserve admin edits.`);
  }

  console.log(`\n--- CADDED_CIVIL RE-SEED COMPLETE ---`);
  console.log(`Modules rebuilt:   ${caddCivilSections.length}`);
  console.log(`Topics created:    ${totalTopics}`);
  console.log(`Topic quizzes:     ${totalTopicQuizzes} (per-topic, topic-lock flow)`);
  console.log(`Chapter quizzes:   ${totalChapterQuizzes} (module-level)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

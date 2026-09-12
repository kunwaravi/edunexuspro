/**
 * reseed_new_courses.ts — Task 5: create/update the 25 new courses and their
 * full content (modules → topics → topic quizzes → chapter quizzes).
 *
 * Follows the existing reseed architecture (see reseed_sql_full.ts):
 *  - Course row is upserted by id — metadata is synced, never duplicated.
 *  - Modules are find-or-created by (courseId, week) so ids stay stable.
 *  - Leaf nodes (topics + quiz questions) are fully rebuilt per module —
 *    safe because no progress data exists on brand-new courses.
 *  - Idempotent: running twice produces identical counts.
 *
 * PUBLISHING RULE (§8): a course is published ONLY once its content file
 * (`prisma/content/<slug>.ts`) exists and exports a non-empty SECTIONS array.
 * Courses with metadata but no content yet stay unpublished.
 *
 * Run: `npx ts-node --transpile-only prisma/reseed_new_courses.ts`
 */
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { ALL_CATEGORIES, NEW_COURSES, type NewCourseMeta } from './new_courses_catalog';
import type { Section, TopicQuizMap } from './content/types';

dotenv.config();
const prisma = new PrismaClient();

interface ContentModule {
  SECTIONS: Section[];
  TOPIC_QUIZZES: TopicQuizMap;
}

/** Dynamic require keeps authoring incremental: courses without a content file
 *  yet are created unpublished (never shown broken publicly). Follows the
 *  existing split convention: `<slug>.ts` (sections) + `<slug>_topic_quizzes.ts`
 *  (per-topic quiz map), exactly like content/sql.ts + content/sql_topic_quizzes.ts. */
function loadContent(slug: string): ContentModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sectionsMod = require(`./content/${slug}`);
    const sections: Section[] = sectionsMod.SECTIONS ?? [];
    if (!Array.isArray(sections) || sections.length === 0) return null;
    let topicQuizzes: TopicQuizMap = {};
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      topicQuizzes = (require(`./content/${slug}_topic_quizzes`).TOPIC_QUIZZES ?? {}) as TopicQuizMap;
    } catch {
      /* topic-quiz file optional per course (flagged below per missing topic) */
    }
    return { SECTIONS: sections, TOPIC_QUIZZES: topicQuizzes };
  } catch {
    return null;
  }
}

async function ensureCategories() {
  for (const cat of ALL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: { slug: cat.slug, name: cat.name, sortOrder: cat.sortOrder, description: null },
    });
  }
}

async function upsertCourse(meta: NewCourseMeta, hasContent: boolean): Promise<boolean> {
  const data = {
    slug: meta.slug,
    title: meta.title,
    shortTitle: meta.shortTitle,
    description: meta.description,
    shortDescription: meta.shortDescription,
    price: meta.price, // exact approved selling price — never a discount scheme
    difficulty: meta.difficulty,
    duration: meta.duration,
    language: meta.language,
    learningOutcomes: meta.learningOutcomes,
    prerequisites: meta.prerequisites,
    targetAudience: meta.targetAudience,
    tags: meta.tags,
    certificateAvailable: meta.certificateAvailable,
    featured: meta.featured,
    category: { connect: { slug: meta.categorySlug } },
    isPublished: hasContent, // §8: publish only when content exists
    status: hasContent ? 'PUBLISHED' : 'DRAFT',
  };
  const exists = await prisma.course.findUnique({ where: { id: meta.id }, select: { id: true } });
  if (exists) {
    await prisma.course.update({ where: { id: meta.id }, data });
    return false;
  }
  await prisma.course.create({ data: { id: meta.id, ...data } });
  return true;
}

async function rebuildCourse(meta: NewCourseMeta, content: ContentModule) {
  const sections = content.SECTIONS;
  let topics = 0;
  let topicQuizzes = 0;
  let chapterQuizzes = 0;

  for (const section of sections) {
    const moduleRecord = await prisma.module.upsert({
      where: { courseId_week: { courseId: meta.id, week: section.week } },
      update: { title: section.title, description: section.description },
      create: { courseId: meta.id, week: section.week, title: section.title, description: section.description },
    });

    // Full-replace the leaf nodes for this module (no progress exists on new courses).
    await prisma.quizQuestion.deleteMany({ where: { moduleId: moduleRecord.id } });
    await prisma.topic.deleteMany({ where: { moduleId: moduleRecord.id } });

    for (let i = 0; i < section.topics.length; i++) {
      const topic = section.topics[i];
      const topicRecord = await prisma.topic.create({
        data: {
          moduleId: moduleRecord.id,
          title: topic.title,
          text: topic.text,
          code: topic.code ?? null,
          note: topic.note,
          order: i,
        },
      });
      topics++;

      const qs = content.TOPIC_QUIZZES[topic.title];
      if (qs) {
        for (const q of qs) {
          await prisma.quizQuestion.create({
            data: { moduleId: moduleRecord.id, topicId: topicRecord.id, text: q.text, options: q.options, correctAnswer: q.correctAnswer },
          });
          topicQuizzes++;
        }
      } else {
        console.warn(`  ⚠ no topic quiz for "${topic.title}" (${meta.slug} w${section.week})`);
      }
    }

    for (const q of section.quizzes) {
      await prisma.quizQuestion.create({
        data: { moduleId: moduleRecord.id, text: q.text, options: q.options, correctAnswer: q.correctAnswer },
      });
      chapterQuizzes++;
    }
  }

  return { sections: sections.length, topics, topicQuizzes, chapterQuizzes };
}

async function main() {
  console.log('--- TASK 5: NEW COURSES RESEED ---');
  await ensureCategories();

  let created = 0;
  let updated = 0;
  let published = 0;
  let unpublished = 0;

  for (const meta of NEW_COURSES) {
    const content = loadContent(meta.slug);
    const isNew = await upsertCourse(meta, content !== null);
    if (isNew) created++;
    else updated++;

    if (!content) {
      unpublished++;
      console.log(`[skip] ${meta.id} (${meta.slug}) — no content yet, stays unpublished`);
      continue;
    }

    const r = await rebuildCourse(meta, content);
    published++;
    console.log(
      `[ok] ${meta.id} (${meta.slug}) ₹${meta.price} [${meta.categorySlug}] → ${r.sections} modules, ` +
        `${r.topics} topics, ${r.topicQuizzes} topic quizzes, ${r.chapterQuizzes} chapter quizzes`
    );
  }

  const counts = await prisma.$queryRaw`SELECT
    (SELECT count(*)::int FROM "Course") AS courses,
    (SELECT count(*)::int FROM "Module") AS modules,
    (SELECT count(*)::int FROM "Topic") AS topics,
    (SELECT count(*)::int FROM "QuizQuestion") AS questions`;
  console.log('\nsummary:', JSON.stringify(counts));
  console.log(`created=${created} updated=${updated} published=${published} unpublished=${unpublished}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

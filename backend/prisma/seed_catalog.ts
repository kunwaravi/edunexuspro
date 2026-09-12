/**
 * seed_catalog.ts — Phase 1: Dynamic Course Catalog & Category Foundation
 *
 * Idempotent seed:
 *  1. Upserts the 9 top-level categories by slug (safe to run repeatedly).
 *  2. Backfills each existing Course's `slug` (only if currently NULL) and
 *     connects it to its category by slug.
 *
 * Data-safety rules honoured here:
 *  - Course IDs are never renamed or recreated (lookups by existing id).
 *  - Course slug is only written when it is still NULL — never overwrites.
 *  - If a course's intended slug is already taken by ANOTHER course, a "-1"
 *    style suffix is appended so the unique index is never violated.
 *  - No metadata (title/description/difficulty/tags/prices) is invented;
 *    category descriptions are left NULL until real copy exists.
 *  - Run with: npx ts-node prisma/seed_catalog.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'computer-office', name: 'Computer & Office', sortOrder: 1 },
  { slug: 'programming', name: 'Programming', sortOrder: 2 },
  { slug: 'web-development', name: 'Web Development', sortOrder: 3 },
  { slug: 'systems-technology', name: 'Systems & Technology', sortOrder: 4 },
  { slug: 'ai-future-skills', name: 'AI & Future Skills', sortOrder: 5 },
  { slug: 'iot', name: 'IoT', sortOrder: 6 },
  { slug: 'embedded-systems', name: 'Embedded Systems', sortOrder: 7 },
  { slug: 'electronics', name: 'Electronics', sortOrder: 8 },
  { slug: 'cad-design', name: 'CAD & Design', sortOrder: 9 },
  { slug: 'iti-trade-training', name: 'ITI & Trade Training', sortOrder: 10 },
];

/** courseId -> { slug, categorySlug } backfill (task-spec mapping). */
const COURSE_MAP: Record<string, { slug: string; categorySlug: string }> = {
  C: { slug: 'c', categorySlug: 'programming' },
  'C++': { slug: 'cpp', categorySlug: 'programming' },
  Python: { slug: 'python', categorySlug: 'programming' },
  SQL: { slug: 'sql', categorySlug: 'programming' },
  WebDesign: { slug: 'web-design', categorySlug: 'web-development' },
  IoT: { slug: 'iot', categorySlug: 'iot' },
  Embedded: { slug: 'embedded', categorySlug: 'embedded-systems' },
  CADDED_Mech: { slug: 'cadded-mech', categorySlug: 'cad-design' },
  CADDED_Civil: { slug: 'cadded-civil', categorySlug: 'cad-design' },
};

async function upsertCategories() {
  for (const cat of CATEGORIES) {
    const existing = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: { slug: cat.slug, name: cat.name, sortOrder: cat.sortOrder, description: null },
    });
    console.log(`[category] ${cat.slug} -> id=${existing.id}`);
  }
}

/** Returns `base` if free, else `base-1`, `base-2`, ... */
async function freeSlug(base: string, ownerId: string): Promise<string> {
  let candidate = base;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await prisma.course.findFirst({
      where: { slug: candidate, NOT: { id: ownerId } },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${base}-${i}`;
    i += 1;
  }
}

async function backfillCourses() {
  for (const [courseId, mapping] of Object.entries(COURSE_MAP)) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      console.log(`[course] ${courseId} NOT FOUND — skipped (do not create new identity)`);
      continue;
    }
    const slug = course.slug ?? (await freeSlug(mapping.slug, courseId));
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        slug: course.slug ?? slug,
        category: { connect: { slug: mapping.categorySlug } },
      },
      select: { id: true, slug: true, categoryId: true, price: true },
    });
    console.log(`[course] ${courseId} -> slug=${updated.slug} categoryId=${updated.categoryId} price=${updated.price}`);
  }
}

async function main() {
  await upsertCategories();
  await backfillCourses();
  const counts = await prisma.$queryRaw`SELECT (SELECT count(*)::int FROM "Category") AS cats, (SELECT count(*)::int FROM "Course") AS courses`;
  console.log('summary:', JSON.stringify(counts));
}

main()
  .catch((e) => {
    console.error('seed_catalog failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

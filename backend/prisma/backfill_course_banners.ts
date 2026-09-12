/**
 * TASK 6 (revised) — Backfill Course.banner for every catalog course.
 *
 * Idempotent: sets `banner` to `/static/course-banners/<slug>.webp` only when
 * the matching licensed WebP asset exists in `backend/public/course-banners/`.
 * Courses without an asset keep banner NULL (frontend falls back to a category
 * visual). No other fields are touched.
 *
 * Run: `npx ts-node --transpile-only prisma/backfill_course_banners.ts`
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ASSET_DIR = path.resolve(__dirname, '../public/course-banners');

async function main() {
  const courses = await prisma.course.findMany({ select: { id: true, slug: true, banner: true } });
  let set = 0;
  let skipped = 0;

  for (const c of courses) {
    const slug = c.slug ?? c.id;
    const file = path.join(ASSET_DIR, `${slug}.webp`);
    if (!fs.existsSync(file)) {
      console.log(`SKIP  ${c.id} (slug=${slug}) — no banner asset`);
      skipped++;
      continue;
    }
    const banner = `/static/course-banners/${slug}.webp`;
    if (c.banner === banner) {
      console.log(`OK    ${c.id} — already set`);
      continue;
    }
    await prisma.course.update({ where: { id: c.id }, data: { banner } });
    set++;
    console.log(`SET   ${c.id} → ${banner}`);
  }

  console.log(`\nDone. banner set=${set}, unchanged=${courses.length - set - skipped}, skipped=${skipped}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exitCode = 1;
});

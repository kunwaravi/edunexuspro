/**
 * TASK 6 — Course Banner Cards + Share + Coming Soon · Test suite
 *
 * Validates (against the LIVE server http://localhost:5000 + local DB):
 *   1. GET /api/courses exposes banner + comingSoon for every course
 *   2. Every published course has its own banner asset (or fallback-ready)
 *   3. Banner WebP assets are actually served (HTTP 200 image/webp)
 *   4. Existing prices unchanged (25 exact Task-5 prices + 9×₹699 legacy)
 *   5. Course / module / topic / quiz counts unchanged (data safety)
 *   6. Coming Soon ON/OFF behavior via the admin PUT route (throwaway course)
 *   7. Banner URL admin update via the same PUT route
 *   8. Share: canonical /course/:slug resolves; frontend uses Web Share API
 *      + clipboard fallback, never the internal id when a slug exists
 *   9. Frontend card uses the banner, share button, and Coming Soon CTA
 *  10. No hardcoded banner/title/price metadata in frontend config
 *
 * Run: `npx ts-node --transpile-only tests/task6_banner_tests.ts` (server up).
 */
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRequiredEnv } from '../src/lib/env';

dotenv.config();

const prisma = new PrismaClient();
const BASE = 'http://localhost:5000/api';
const STATIC_BASE = 'http://localhost:5000';
const FRONTEND = path.resolve(__dirname, '../../frontend/src');
const ASSET_DIR = path.resolve(__dirname, '../public/course-banners');
const JWT_SECRET = getRequiredEnv('JWT_SECRET');

const tokenFor = (userId: number) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

// ── Task 5 price table (single source of truth — must be unchanged) ─────────
const NEW_PRICES: Record<string, number> = {
  MSWord: 499, MSExcel: 599, MSPowerPoint: 499, ComputerFundamentals: 399,
  Java: 699, JavaScript: 699, DSA: 799,
  HTMLCSS: 499, React: 699, NodeJS: 699, FullStackWeb: 999,
  Linux: 599, Networking: 699,
  Arduino: 599, ESP32: 699,
  EmbeddedC: 699, Microcontrollers: 699,
  BasicElectronics: 499, DigitalElectronics: 599, PCBDesign: 699,
  AutoCAD2D: 599, ThreeDCAD: 799,
  ITICOPA: 799, ITIElectrician: 899, ITIFitter: 899,
};
const LEGACY_IDS = ['C', 'C++', 'IoT', 'Embedded', 'WebDesign', 'Python', 'SQL', 'CADDED_Mech', 'CADDED_Civil'];
const NEW_IDS = Object.keys(NEW_PRICES);

const results: { name: string; pass: boolean; detail: string }[] = [];
const check = (name: string, pass: boolean, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const read = (rel: string) => fs.readFileSync(path.join(FRONTEND, rel), 'utf8');
const contains = (src: string, needle: string) => src.includes(needle);

async function api(method: string, path: string, token?: string, body?: any) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data: any = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, data };
}

async function main() {
  // ── 1. Catalog exposes banner + comingSoon for every course ───────────────
  const cat = await api('GET', '/courses');
  const courses: any[] = cat.data || [];
  check('1. GET /api/courses returns 34 courses with banner + comingSoon data',
    cat.status === 200 && courses.length === 34 &&
    courses.every((c) => typeof c.banner === 'string' && typeof c.comingSoon === 'boolean'),
    `${courses.length} courses, all with banner + comingSoon`);

  // ── 2. Every published course has its own banner asset ────────────────────
  // Asset path is derived from the API (banner), so it stays in sync with DB.
  const missingAssets = courses
    .filter((c) => !c.banner || !fs.existsSync(path.join(ASSET_DIR, path.basename(c.banner))))
    .map((c) => c.id);
  check('2. Every course has its own banner asset (no generic fallback needed)',
    missingAssets.length === 0, missingAssets.length ? `missing: ${missingAssets.join(',')}` : `${courses.length}/34 assets present`);

  // ── 3. Banner WebP assets are actually served ─────────────────────────────
  const samples = ['full-stack-web', 'ms-excel', 'web-design', 'arduino', '3d-cad'];
  const servedOk = [];
  for (const slug of samples) {
    const r = await fetch(`${STATIC_BASE}/static/course-banners/${slug}.webp`);
    servedOk.push(r.status === 200 && (r.headers.get('content-type') || '').includes('image/webp'));
  }
  check('3. Banner WebP assets served (HTTP 200 image/webp)', servedOk.every(Boolean), samples.join(', '));

  // ── 4. Prices unchanged ───────────────────────────────────────────────────
  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
  const priceOk = NEW_IDS.every((id) => byId[id]?.price === NEW_PRICES[id]) &&
    LEGACY_IDS.every((id) => byId[id]?.price === 699) &&
    courses.length === 34;
  check('4. Existing prices unchanged (25 spec prices + 9×₹699 legacy)', priceOk, 'all 34 exact');

  // ── 5. Content counts unchanged (data safety) ─────────────────────────────
  const [mCount, tCount, qCount] = await Promise.all([
    prisma.module.count(),
    prisma.topic.count(),
    prisma.quizQuestion.count(),
  ]);
  check('5. Course/module/topic/quiz counts unchanged (no content touched)',
    courses.length === 34 && mCount === 305 && tCount === 1205 && qCount === 6758,
    `course=${courses.length} module=${mCount} topic=${tCount} quiz=${qCount}`);

  // ── 6 + 7. Admin Coming Soon ON/OFF + banner update via throwaway course ──
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin fixture found.');
  const adminTok = tokenFor(admin.id);
  const tmpId = `T6_${Date.now()}`;

  let comingSoonPass = false;
  let comingSoonDetail = 'skipped';
  let bannerUpdatePass = false;
  let bannerUpdateDetail = 'skipped';
  let catCountAfter = courses.length;

  try {
    const created = await api('POST', '/courses', adminTok, {
      id: tmpId, title: 'Task Six Fixture Course', description: 'temp', price: 999,
    });
    if (created.status !== 200 && created.status !== 201) {
      comingSoonDetail = `create failed ${created.status}`;
    } else {
      // created with comingSoon=false by default + visible in catalog
      const before = await api('GET', `/courses?category=does-not-exist`); // no-op; use full list
      const fullList = await api('GET', '/courses');
      const tmpRow = (fullList.data || []).find((c: any) => c.id === tmpId);
      comingSoonPass = !!tmpRow && tmpRow.comingSoon === false;
      comingSoonDetail = `default false, visible in catalog=${!!tmpRow}`;

      // toggle ON
      const on = await api('PUT', `/courses/${tmpId}`, adminTok, { comingSoon: true });
      const listOn = await api('GET', '/courses');
      const tmpOn = (listOn.data || []).find((c: any) => c.id === tmpId);
      comingSoonPass = comingSoonPass && on.status === 200 && !!tmpOn && tmpOn.comingSoon === true;
      comingSoonDetail += ` | ON:${!!tmpOn && tmpOn.comingSoon === true}`;

      // toggle OFF (behaves normally again)
      const off = await api('PUT', `/courses/${tmpId}`, adminTok, { comingSoon: false });
      const listOff = await api('GET', '/courses');
      const tmpOff = (listOff.data || []).find((c: any) => c.id === tmpId);
      comingSoonPass = comingSoonPass && off.status === 200 && !!tmpOff && tmpOff.comingSoon === false;
      comingSoonDetail += ` | OFF:${!!tmpOff && tmpOff.comingSoon === false}`;

      // banner URL admin update + reflected in catalog
      const bUrl = '/static/course-banners/arduino.svg';
      const updB = await api('PUT', `/courses/${tmpId}`, adminTok, { banner: bUrl });
      const listB = await api('GET', '/courses');
      const tmpB = (listB.data || []).find((c: any) => c.id === tmpId);
      bannerUpdatePass = updB.status === 200 && !!tmpB && tmpB.banner === bUrl;
      bannerUpdateDetail = `banner=${tmpB?.banner} in catalog`;
    }
  } catch (e: any) {
    comingSoonDetail = `error: ${e.message}`;
  } finally {
    await api('DELETE', `/courses/${tmpId}`, adminTok).catch(() => { /* cleanup */ });
    await prisma.course.deleteMany({ where: { id: tmpId } }).catch(() => { /* cleanup */ });
    const after = await api('GET', '/courses');
    catCountAfter = (after.data || []).length;
  }

  check('6. Coming Soon ON/OFF controlled by admin (visible, toggle works)',
    comingSoonPass, comingSoonDetail);
  check('7. Admin can set banner URL (reflected in catalog API)', bannerUpdatePass, bannerUpdateDetail);
  check('7b. Catalog count restored after fixture cleanup', catCountAfter === 34, `${catCountAfter} courses`);

  // ── 8. Share — canonical /course/:slug route resolves ─────────────────────
  const detailSlug = await api('GET', '/courses/full-stack-web');
  check('8. Share URL target /course/full-stack-web resolves (canonical slug)',
    detailSlug.status === 200 && detailSlug.data?.id === 'FullStackWeb', `${detailSlug.status}`);

  const shareSrc = read('components/molecules/CourseShareButton.tsx');
  check('8b. Share uses Web Share API + clipboard fallback + canonical /course/ URL',
    contains(shareSrc, 'navigator.share') &&
    contains(shareSrc, 'navigator.clipboard') &&
    contains(shareSrc, '`${window.location.origin}/course/${slug || id || \'\'}`') &&
    contains(shareSrc, "addToast('Course link copied to clipboard.'"),
    'Web Share → clipboard → execCommand fallback chain');
  check('8c. Share button has accessible label', contains(shareSrc, 'aria-label={`Share ${courseTitle}`}'), 'aria-label present');

  // ── 9. Frontend card — banner, share, Coming Soon CTA ─────────────────────
  const bannerComp = read('components/molecules/CourseBanner.tsx');
  check('9. CourseBanner: lazy, object-cover, broken-image fallback',
    contains(bannerComp, 'loading="lazy"') && contains(bannerComp, 'object-cover') && contains(bannerComp, 'onError') && contains(bannerComp, 'setImgFailed'),
    'lazy + object-cover + onError → fallback');

  const cardSrc = read('components/molecules/CourseCard.tsx');
  check('9b. CourseCard renders banner + share + Coming Soon disabled CTA',
    contains(cardSrc, 'CourseBanner') && contains(cardSrc, 'CourseShareButton') &&
    contains(cardSrc, 'Coming Soon') && contains(cardSrc, 'Hourglass') &&
    contains(cardSrc, 'onAction?.(slug || id)'),
    'banner + share + coming-soon wiring');

  const homeSrc = read('pages/Home.tsx');
  const homeCardSrc = read('components/molecules/CourseCard.tsx');
  // MASTER-TASK UPDATE: the homepage's own card markup was replaced by the shared
  // CourseCard (the 34-card grid became a category grid + the Featured row), so
  // CourseBanner/CourseShareButton are asserted where they now live. Home still
  // proves it is wired to them by feeding the card the real banner + comingSoon.
  check('9c. Homepage card uses the new banner card + share button',
    contains(homeCardSrc, 'CourseBanner') && contains(homeCardSrc, 'CourseShareButton') &&
    contains(homeSrc, 'banner={course.banner}') &&
    contains(homeSrc, 'comingSoon={course.comingSoon}'),
    'Home wired to banner card');

  // ── 10. No hardcoded banner/title/price metadata in frontend config ───────
  const cfg = read('config/courses.ts');
  check('10. Presentation config carries no banner/comingSoon/title/price data',
    !contains(cfg, 'banner:') && !contains(cfg, 'comingSoon:') && !contains(cfg, 'title:') && !contains(cfg, 'price:'),
    'config/courses.ts stays presentation-only');

  await prisma.$disconnect();
  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length > 0) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} :: ${f.detail}`));
    process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });

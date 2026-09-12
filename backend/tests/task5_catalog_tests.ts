/**
 * TASK 5 — Homepage Dynamic Courses Section + 25 New Courses · Test suite
 *
 * Two layers:
 *   A) The 12 spec cases (§R) for the homepage course catalog, against the
 *      LIVE server (http://localhost:5000) plus static frontend source checks
 *      (the project has no browser harness — build + API smoke is the gate).
 *   B) TASK 5 part 2 — the 25 newly added courses: exact prices, category
 *      mapping, unique slugs, derived module counts, detail-by-slug/id,
 *      publish-only-complete, and backend Course.price → payment flow.
 *
 * Run: `npx ts-node --transpile-only tests/task5_catalog_tests.ts` (server up).
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
const FRONTEND = path.resolve(__dirname, '../../frontend/src');
const JWT_SECRET = getRequiredEnv('JWT_SECRET');

// ── TASK 5 part 2 expected data (single source of truth in the test) ────────
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
const NEW_CATEGORY: Record<string, string> = {
  MSWord: 'computer-office', MSExcel: 'computer-office', MSPowerPoint: 'computer-office', ComputerFundamentals: 'computer-office',
  Java: 'programming', JavaScript: 'programming', DSA: 'programming',
  HTMLCSS: 'web-development', React: 'web-development', NodeJS: 'web-development', FullStackWeb: 'web-development',
  Linux: 'systems-technology', Networking: 'systems-technology',
  Arduino: 'iot', ESP32: 'iot',
  EmbeddedC: 'embedded-systems', Microcontrollers: 'embedded-systems',
  BasicElectronics: 'electronics', DigitalElectronics: 'electronics', PCBDesign: 'electronics',
  AutoCAD2D: 'cad-design', ThreeDCAD: 'cad-design',
  ITICOPA: 'iti-trade-training', ITIElectrician: 'iti-trade-training', ITIFitter: 'iti-trade-training',
};
const CATEGORY_COUNTS: Record<string, number> = {
  programming: 7, 'web-development': 5, 'cad-design': 4, 'computer-office': 4,
  electronics: 3, 'embedded-systems': 3, iot: 3, 'iti-trade-training': 3,
  'systems-technology': 2,
};
const FEATURED_IDS = ['MSExcel', 'Java', 'DSA', 'FullStackWeb', 'Arduino'];

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
  // ── 1. Homepage loads courses from API (public, no auth) ───────────────
  const cat = await api('GET', '/courses');
  const courses: any[] = cat.data || [];
  check('1. Homepage catalog loads from public API', cat.status === 200 && Array.isArray(courses) && courses.length === 34, `${cat.status}, ${courses.length} courses`);
  check('1b. Home.tsx drives the section from useCourses (API), not a hardcoded array', contains(read('pages/Home.tsx'), 'useCourses(activeCategory)') && !contains(read('pages/Home.tsx'), 'setCourses(res.data)'), 'useCourses hook wired');

  // ── 2. Cards render API data (data contract: every displayed field exists) ──
  const REQUIRED = ['id', 'slug', 'title', 'description', 'category', 'difficulty', 'duration', 'moduleCount', 'certificateAvailable', 'featured', 'price', 'tags'];
  const missing = new Set<string>();
  courses.forEach((c) => REQUIRED.forEach((k) => { if (!(k in c)) missing.add(k); }));
  check('2. Catalog provides every field CourseCard displays', missing.size === 0, missing.size ? `missing: ${[...missing].join(',')}` : `12 fields present on all ${courses.length}`);

  // ── 3. Price comes from the API — 25 new exact prices + 9×₹699 legacy ──
  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
  const priceOk = courses.every((c) => typeof c.price === 'number') &&
    NEW_IDS.every((id) => byId[id]?.price === NEW_PRICES[id]) &&
    LEGACY_IDS.every((id) => byId[id]?.price === 699);
  check('3. New-course prices from API match spec; legacy stay ₹699', priceOk, `new prices verified, legacy=${LEGACY_IDS.map((id) => byId[id]?.price).join(',')}`);
  const noHardcodedPrice = !contains(read('config/courses.ts'), 'price:') && !contains(read('components/molecules/CourseCard.tsx'), '699') && !contains(read('pages/Home.tsx'), 'BASE_PRICE');
  check('3b. No hardcoded price/₹699 in card or presentation config', noHardcodedPrice, 'config + CourseCard + Home clean');

  // ── 4. Module count from API (derived, matches modules array) ───────────
  const modOk = courses.every((c) => typeof c.moduleCount === 'number' && c.moduleCount === (c.modules?.length ?? -1));
  const newModules5 = NEW_IDS.every((id) => byId[id]?.moduleCount === 5);
  check('4. Module count from API (moduleCount === modules.length)', modOk && newModules5, `new courses=5 modules each, legacy=${[...new Set(courses.map((c) => c.moduleCount))].join(',')}`);
  const cardSrc = read('components/molecules/CourseCard.tsx');
  const homeSrc = read('pages/Home.tsx');
  const noHardcoded20 = !contains(cardSrc, "'/20'") && !contains(homeSrc, "'/20'") && !contains(homeSrc, 'Week x/4');
  // MASTER-TASK UPDATE: the homepage no longer carries its own card markup — the
  // 34-card grid was replaced by a category grid + the Featured row, and every
  // course card on the page is now the shared CourseCard. The assertion still
  // proves the same thing (the count is API-driven and Home feeds it the API
  // value), just through the component that now owns the render.
  const apiDrivenCount = contains(cardSrc, '{moduleCount} Modules') && contains(homeSrc, 'moduleCount={course.moduleCount}');
  check('4b. Module count is API-driven ({moduleCount} Modules), no hardcoded "/20"/"Week x/4"', noHardcoded20 && apiDrivenCount, apiDrivenCount ? 'rendered from API field' : 'missing {moduleCount} render');

  // ── 5. Category filtering via GET /courses?category=<slug> ──────────────
  const countsOk = await (async () => {
    for (const [slug, expectCount] of Object.entries(CATEGORY_COUNTS)) {
      const r = await api('GET', `/courses?category=${slug}`);
      if (r.status !== 200 || !Array.isArray(r.data) || r.data.length !== expectCount) return `category=${slug} expected ${expectCount} got ${r.data?.length}`;
    }
    return true;
  })();
  check('5. Category filtering (server-side, real slugs, correct counts)', countsOk === true, countsOk === true ? Object.entries(CATEGORY_COUNTS).map(([s, n]) => `${s}=${n}`).join(' ') : String(countsOk));
  const pro = await api('GET', '/courses?category=programming');
  check('5b. Filtered rows all belong to the requested category', (pro.data || []).every((c: any) => c.category?.slug === 'programming'), (pro.data || []).map((c: any) => c.id).join(','));

  // ── 6. Featured — real API flag only (5 featured; never fabricated) ─────
  const featured = courses.filter((c) => c.featured).map((c) => c.id);
  check('6. Featured courses are exactly the 5 real API-flagged ones', featured.length === 5 && FEATURED_IDS.every((id) => featured.includes(id)) && featured.every((id) => FEATURED_IDS.includes(id)), `featured=${featured.join(',')}`);
  // MASTER-TASK UPDATE: same reason as 4b — the badge still renders only when the
  // API flag is true (CourseCard), and Home still feeds it the real flag.
  check('6b. Card renders a Featured badge only from API flag', contains(read('components/molecules/CourseCard.tsx'), 'featured &&') && contains(read('pages/Home.tsx'), 'featured={course.featured}'), 'wired, renders only when flag true');

  // ── 7. View All → /courses ──────────────────────────────────────────────
  check('7. Homepage View All CTA navigates to /courses', contains(read('pages/Home.tsx'), "navigate('/courses')"), 'Home has View All → /courses');
  check('7b. /courses route registered (public)', contains(read('App.tsx'), 'path="/courses"') && contains(read('App.tsx'), 'CoursesPage'), 'App.tsx routes CoursesPage');

  // ── 8. Card opens correct slug/id route ─────────────────────────────────
  check('8. CourseCard CTA prefers slug, falls back to id', contains(read('components/molecules/CourseCard.tsx'), 'onAction?.(slug || id)'), 'CourseCard slug||id');
  // MASTER-TASK UPDATE: Home's cards are the shared CourseCard; the slug||id
  // resolution lives there. Verified by asserting Home hands the card a slug and
  // consumes its action callback with the resolved value.
  check('8b. Homepage card navigates via slug||id', contains(read('pages/Home.tsx'), 'slug={course.slug}') && contains(read('pages/Home.tsx'), 'onAction'), 'Home card navigation');
  check('8c. /courses page navigates via slug||id', contains(read('pages/CoursesPage.tsx'), "navigate(`/course/${key}`)"), 'CoursesPage card navigation');

  // ── 9. Legacy /course/:id + slug both resolve; new courses too ──────────
  const byIdLegacy = await api('GET', '/courses/C');
  const bySlugLegacy = await api('GET', '/courses/c');
  const byIdNew = await api('GET', '/courses/MSExcel');
  const bySlugNew = await api('GET', '/courses/ms-excel');
  const byIdNew2 = await api('GET', '/courses/ThreeDCAD');
  const bySlugNew2 = await api('GET', '/courses/3d-cad');
  check('9. Legacy id /course/C resolves', byIdLegacy.status === 200 && byIdLegacy.data?.id === 'C', `${byIdLegacy.status}`);
  check('9b. Slug /course/c resolves to same course', bySlugLegacy.status === 200 && bySlugLegacy.data?.id === 'C', `${bySlugLegacy.status}`);
  check('9c. New course resolves by id AND slug (MSExcel + 3d-cad)', byIdNew.status === 200 && byIdNew.data?.id === 'MSExcel' && bySlugNew.status === 200 && bySlugNew.data?.id === 'MSExcel' && byIdNew2.status === 200 && byIdNew2.data?.id === 'ThreeDCAD' && bySlugNew2.status === 200 && bySlugNew2.data?.id === 'ThreeDCAD', `byId=${byIdNew.status} bySlug=${bySlugNew.status}`);

  // ── 10. API failure → no crash, clean fallback UI ───────────────────────
  check('10. Error state renders a small fallback (no raw error, no crash)', contains(read('pages/Home.tsx'), 'temporarily unavailable') && contains(read('pages/CoursesPage.tsx'), 'temporarily unavailable'), 'fallback card present');
  check('10b. Hook catches errors (setError, never throws)', contains(read('hooks/useCourses.ts'), 'try {') && contains(read('hooks/useCourses.ts'), 'setError('), 'try/catch in useCourses');

  // ── 11. Empty catalog / empty category ──────────────────────────────────
  const unknown = await api('GET', '/courses?category=does-not-exist');
  const emptyCat = await api('GET', '/courses?category=ai-future-skills');
  check('11. Empty categories → 200 [] (no crash)', unknown.status === 200 && Array.isArray(unknown.data) && unknown.data.length === 0 && emptyCat.status === 200 && Array.isArray(emptyCat.data) && emptyCat.data.length === 0, `${unknown.status}/${emptyCat.status} []`);
  check('11b. Clean empty state UI exists', contains(read('pages/Home.tsx'), 'No courses in this category yet') && contains(read('pages/CoursesPage.tsx'), 'No courses in this category yet'), 'empty state on Home + /courses');

  // ── 12. Mobile build valid (build gate) + no stale/new-parallel UI ──────
  const distIndex = fs.existsSync(path.resolve(__dirname, '../../frontend/dist/index.html'));
  check('12. Frontend build artifact present (tsc + vite build passed)', distIndex, 'dist/index.html exists');
  const srcAll = ['App.tsx', 'pages/Home.tsx', 'pages/CoursesPage.tsx', 'components/molecules/CourseCard.tsx', 'hooks/useCourses.ts'].map((f) => read(f)).join('\n');
  check('12b. No parallel card/grid components (spec §U)', !/[Cc]ourseCard2|CourseGridNew|NewCourseCatalog/.test(srcAll), 'no CourseCard2/GridNew/NewCatalog');

  // ── TASK 5 part 2 — the 25 new courses ───────────────────────────────────
  check('N1. Catalog has 34 courses — 25 new + 9 existing preserved', NEW_IDS.every((id) => byId[id]) && LEGACY_IDS.every((id) => byId[id]) && courses.length === 34, `${courses.length} courses`);

  const slugs = courses.map((c) => c.slug);
  check('N2. All course slugs are unique', new Set(slugs).size === slugs.length, `${slugs.length} unique slugs`);

  const catMismatch = NEW_IDS.filter((id) => byId[id]?.category?.slug !== NEW_CATEGORY[id]);
  check('N3. Every new course sits in its spec category', catMismatch.length === 0, catMismatch.length ? `wrong: ${catMismatch.join(',')}` : 'all 25 mapped');

  check('N4. Publish-only-complete: every catalog course has content modules', courses.every((c) => c.moduleCount > 0), `min modules=${Math.min(...courses.map((c) => c.moduleCount))}`);

  // ── N5. Backend Course.price reaches the payment flow ────────────────────
  // paymentService.createOrder reads `course.price` as basePrice (not the
  // client-supplied amount), then applies referral/coupon discounts. A fresh
  // user (zero referrals, no coupon) → order amount must equal the course
  // price from the DB. We send amount: 1 deliberately — if the server trusted
  // the client amount the order would be ₹1, not the real price.
  let paymentDetail = 'skipped';
  let paymentPass = false;
  let createdOrderId: string | null = null;
  let throwawayEmail = '';
  try {
    throwawayEmail = `task5_${Date.now()}@test.dev`;
    const reg = await api('POST', '/auth/register', undefined, {
      email: throwawayEmail, password: 'task5test123', name: 'Task Five', fatherName: 'Test', collegeName: 'Test College', branchName: 'ECE',
    });
    if (reg.status !== 200 && reg.status !== 201) {
      paymentDetail = `register failed ${reg.status}`;
    } else {
      const tok = reg.data?.token;
      const paymentCourse = 'FullStackWeb'; // ₹999
      const order = await api('POST', '/payments/create-order', tok, { courseId: paymentCourse, amount: 1 });
      createdOrderId = order.data?.orderId ?? null;
      paymentPass = order.status === 200 && order.data?.amount === NEW_PRICES[paymentCourse] && order.data?.courseId === paymentCourse;
      paymentDetail = `${order.status}, server amount=₹${order.data?.amount} (course price ₹${NEW_PRICES[paymentCourse]})`;
    }
  } catch (e: any) {
    paymentDetail = `error: ${e.message}`;
  }
  check('N5. Payment flow uses backend Course.price (client amount ignored)', paymentPass, paymentDetail);
  if (createdOrderId) {
    await prisma.payment.delete({ where: { id: createdOrderId } }).catch(() => { /* cleanup */ });
  }
  if (throwawayEmail) {
    await prisma.user.deleteMany({ where: { email: throwawayEmail } }).catch(() => { /* cleanup */ });
  }

  // ── Frontend cleanup (spec §Q) + TASK 5 wiring ───────────────────────────
  const cfg = read('config/courses.ts');
  check('Q. Presentation config carries no business data (difficulty/tags/category/desc/price)', !contains(cfg, 'difficulty:') && !contains(cfg, 'tags:') && !contains(cfg, 'category:') && !contains(cfg, 'desc:') && !contains(cfg, 'price:'), 'config/courses.ts cleaned');
  const home = read('pages/Home.tsx');
  check('Q2. Homepage has no hardcoded per-course content map (milestones/difficulty/tags)', !contains(home, 'milestones:') && !contains(home, 'courseMetadata'), 'coursePresentation is presentation-only');
  check('Q3. CourseCard no longer claims "Free to Learn"', !contains(read('components/molecules/CourseCard.tsx'), 'Free to Learn'), 'marketing claim removed');

  const cfgEntries = NEW_IDS.every((id) => contains(cfg, `id: '${id}'`));
  const homeEntries = NEW_IDS.every((id) => contains(home, `'${id}':`));
  check('Q4. All 25 new courses have presentation entries (config + Home)', cfgEntries && homeEntries, cfgEntries ? '25 ids in config/courses.ts' : 'MISSING config entries');

  await prisma.$disconnect();
  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length > 0) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} :: ${f.detail}`));
    process.exitCode = 1;
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });

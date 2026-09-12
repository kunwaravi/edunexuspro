# TASK 5 part 2 — 25 New Courses + Homepage Course Catalog · Report

> Date: 2026-08-16 · Project: EduNexus Pro · Branch: `master` (local)
> Status: **COMPLETE — not deployed, not pushed to git**
> This task: *"Add new courses and make them visible/useful on the homepage."*

---

## A. Scope

Added **25 new courses** with **exact prices** (no discounts / MRP / crossed-out prices anywhere) and full, usable starter content (5 modules × 4 topics each, substantive text, and per-topic quizzes — exactly 4 options / 1 correct, no placeholders, no duplicated content). The homepage **Courses** section (built in Task 5 part 1) is now fully populated by the same API — no hardcoded course data was introduced. Only **presentation** entries (icon, accent color, bento span) were added for the new course ids.

Constraints honoured:

- **No homepage redesign** — the existing bento/glass visual language was kept; only presentation entries appended.
- **No certificate UI changes.**
- **No payment logic changes** — payment flow was only **verified** to consume the new backend `Course.price` (see check N5: the server ignores the client-supplied amount and uses the DB price).
- **No enrollment security changes** — Task 4 security regression re-run: **17/17 PASS**.
- **No fake data** — no invented ratings, student counts, reviews, enrollments, or statistics. Featured flags are the 5 real API-flagged courses only.
- **No government accreditation/certification claims** — the three ITI courses are framed as *supplement / refresher* skill-builders; official trade certification is explicitly stated to remain with the recognised trade authority.

## B. The 25 New Courses (exact prices, spec-accurate)

| Course | Price | Category |
|---|---|---|
| MS Word | ₹499 | Computer & Office |
| MS Excel | ₹599 | Computer & Office |
| MS PowerPoint | ₹499 | Computer & Office |
| Computer Fundamentals | ₹399 | Computer & Office |
| Java | ₹699 | Programming |
| JavaScript | ₹699 | Programming |
| DSA | ₹799 | Programming |
| HTML & CSS | ₹499 | Web Development |
| React | ₹699 | Web Development |
| Node.js | ₹699 | Web Development |
| Full Stack Web Development | ₹999 | Web Development |
| Linux | ₹599 | Systems & Technology *(new category)* |
| Networking | ₹699 | Systems & Technology |
| Arduino | ₹599 | IoT |
| ESP32 | ₹699 | IoT |
| Embedded C | ₹699 | Embedded Systems |
| Microcontrollers | ₹699 | Embedded Systems |
| Basic Electronics | ₹499 | Electronics |
| Digital Electronics | ₹599 | Electronics |
| PCB Design | ₹699 | Electronics |
| AutoCAD 2D | ₹599 | CAD & Design |
| 3D CAD | ₹799 | CAD & Design |
| ITI COPA | ₹799 | ITI & Trade Training *(new category)* |
| ITI Electrician | ₹899 | ITI & Trade Training |
| ITI Fitter | ₹899 | ITI & Trade Training |

Existing **9 courses** unchanged at **₹699** each. Total published catalog: **34 courses**.

Every new course ships **5 modules × 4 topics** (meaningful titles, substantive text, code/note where relevant), **4 chapter quizzes per module** and **4 questions per topic** — 100 questions per course, 2,500 new questions in total, all 4 options / 1 correct answer.

## C. Backend

- **Content authoring** — `backend/prisma/content/<slug>.ts` (`SECTIONS`) + `<slug>_topic_quizzes.ts` (`TOPIC_QUIZZES` keyed by exact topic title, topic-lock flow), typed by `backend/prisma/content/types.ts`.
- **Metadata** — `backend/prisma/new_courses_catalog.ts`: 10 categories (incl. new `systems-technology` and `iti-trade-training`), `NEW_COURSES`, `COURSE_BY_ID`.
- **Orchestrator** — `backend/prisma/reseed_new_courses.ts`: idempotent upsert of courses/modules/topics/quizzes; **created=0 updated=25** on re-run; publishes only content-complete courses.
- **API** — unchanged Task 3/5 endpoints: `GET /api/courses`, `GET /api/courses?category=<slug>`, `GET /api/courses/:id` (id or slug). `moduleCount` derived from `_count.modules`.

## D. Frontend

- `frontend/src/config/courses.ts` — 25 new **presentation-only** entries (id, short label, icon, colors). No title/desc/syllabus/price/category/difficulty/tags copies.
- `frontend/src/pages/Home.tsx` — 25 new `coursePresentation` entries (icon/accent/colSpan) + matching `getGlowStyles` hover accents. Business data still comes exclusively from `useCourses(activeCategory)`.
- `/courses` page, `/course/:slug` detail, legacy `/course/:id`, payment, enrollment, learning, and quiz flows all work with the new courses via the existing API.

## E. Testing & Validation

| Gate | Result |
|---|---|
| `prisma validate` | ✅ PASS |
| Backend `tsc --noEmit` | ✅ PASS |
| Frontend `tsc --noEmit` | ✅ PASS |
| Frontend `vite build` | ✅ PASS |
| ESLint (changed files) | ✅ PASS |
| Catalog API smoke | ✅ PASS (34 courses) |
| **Task 5 catalog suite** (`backend/tests/task5_catalog_tests.ts`) | ✅ **34/34 PASS** |
| **Task 4 security regression** (`backend/tests/task4_security_tests.ts`) | ✅ **17/17 PASS** |
| Content consistency check (all 25 courses) | ✅ **problems = 0** (5 sections, 4 topics/section, 4 chapter quizzes/section, every quiz 4 options/1 correct-in-options, every topic quiz-locked, no spurious keys) |

The 34-check suite covers all 12 spec cases (§R) plus the Task 5 part 2 additions:

1. Homepage catalog loads from the public API — 34 courses — ✅
2. Cards render API data — full data contract present on all 34 — ✅
3. **Prices from API** — every new course matches its spec price; all 9 legacy stay ₹699; no hardcoded price/₹699/`BASE_PRICE` in card or presentation config — ✅
4. **Module count from API** — `moduleCount === modules.length` (new courses = 5 each); no `/20` / "Week x/4" hardcodes — ✅
5. Category filtering — `programming`→7, `web-development`→5, `cad-design`→4, `computer-office`→4, `electronics`→3, `embedded-systems`→3, `iot`→3, `iti-trade-training`→3, `systems-technology`→2; filtered rows all belong to the category — ✅
6. Featured = exactly the 5 real API-flagged courses (MS Excel, Java, DSA, Full Stack Web, Arduino); badge renders only from the flag — ✅
7. View All → `/courses` (route registered, public) — ✅
8. Card opens correct slug/id route (`slug || id` in CourseCard, Home, CoursesPage) — ✅
9. Legacy `/course/C` + `/course/c` resolve; new courses resolve **by id and slug** (e.g. `/courses/MSExcel`, `/courses/ms-excel`, `/courses/3d-cad`) — ✅
10. API failure → clean fallback UI, no crash — ✅
11. Empty categories (`does-not-exist`, seeded-but-empty `ai-future-skills`) → 200 `[]`, clean empty state — ✅
12. Build valid (tsc + vite build; `dist/index.html` present); no parallel card/grid components — ✅
- **N1** 34 courses = 25 new + 9 existing preserved — ✅
- **N2** all 34 slugs unique — ✅
- **N3** every new course in its spec category — ✅
- **N4** publish-only-complete: every catalog course has content modules (min = 5) — ✅
- **N5** **payment flow uses backend `Course.price`** — `POST /api/payments/create-order` with a deliberately wrong client amount (₹1) returned the real DB price (₹999) — the client amount is ignored; discount-adjusted amount is computed from `course.price` — ✅
- **Q/Q2/Q3** presentation config carries no business data; homepage has no hardcoded per-course content map; no "Free to Learn" claim — ✅
- **Q4** all 25 new course ids have presentation entries in `config/courses.ts` + `Home.tsx` — ✅

## F. Data Safety

Recorded before (part-1 baseline, 9 courses) and after the full seed. **User/payment/progress/certificate/enrollment data untouched — the only deltas are the intended new course content.**

| Entity | BEFORE | AFTER | Delta |
|---|---|---|---|
| Course | 9 | 34 | +25 (intended) |
| Module | 180 | 305 | +125 (5 × 25, intended) |
| Topic | 705 | 1205 | +500 (20 × 25, intended) |
| QuizQuestion | 4258 | 6758 | +2500 (100 × 25, intended) |
| Payment | 3 | 3 | 0 |
| CourseProgress | 1 | 1 | 0 |
| ModuleProgress | 1 | 1 | 0 |
| TopicProgress | 1 | 1 | 0 |
| CertificateRecord | 3 | 3 | 0 |
| Enrollment | 3 | 3 | 0 |

Idempotency: reseed re-run produced **created=0 updated=25** — safe to run repeatedly in CI/deploys.

## G. Deferred / Next Task

- **NOT deployed** to srv1616850; **NOT pushed** to git. Ready for the next `wrap_and_deploy.sh` run (no migration needed — the local DB is not Prisma-migration-managed; prod is migration-managed and unchanged).
- Task 6 has not been started.

---

## Files Changed (this part)

| File | Change |
|---|---|
| `backend/prisma/content/<slug>.ts` (25 files) | New — course `SECTIONS` (5 modules × 4 topics). |
| `backend/prisma/content/<slug>_topic_quizzes.ts` (25 files) | New — per-topic quizzes (4 Q/topic, topic-lock). |
| `backend/prisma/new_courses_catalog.ts` | New — 10 categories + 25-course metadata. |
| `backend/prisma/reseed_new_courses.ts` | New — idempotent content orchestrator. |
| `backend/prisma/content/types.ts` | New — shared content types. |
| `backend/tests/task5_catalog_tests.ts` | Updated — 9→34 course expectations + N1–N5, Q4 (34 checks). |
| `frontend/src/config/courses.ts` | Edited — 25 presentation entries added. |
| `frontend/src/pages/Home.tsx` | Edited — 25 `coursePresentation` + `getGlowStyles` entries. |
| `docs/task5-new-courses-homepage-report.md` | This report. |

## Endpoints

- **Used (existing, unchanged)**: `GET /api/courses`, `GET /api/courses?category=<slug>`, `GET /api/courses/:id` (id + slug), `POST /api/payments/create-order` (verified only).
- **Added**: none.

## Final Lines

NEW COURSES ADDED: 25 / EXISTING COURSES PRESERVED: 9 / NEW COURSE PRICES: as specified / EXISTING COURSE PRICE: ₹699 / HOMEPAGE COURSE SECTION: API-driven / HARDCODED COURSE PRICES: none / HARDCODED MODULE COUNTS: none

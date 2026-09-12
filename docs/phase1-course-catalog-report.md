# Phase 1 — Dynamic Course Catalog & Category Foundation · Report

> Scope: additive, backward-compatible, production-safe. Local dev DB (`nexus` on
> `localhost:5432`) is NOT Prisma-migration-managed → schema applied via
> `prisma db push` (never `migrate deploy` locally). Prod deploy applies the new
> migration via the on-container-start `migrate deploy`.
> Date: 2026-08-16 · Repo: `kunwaravi/edunexuspro` (master)

---

## A. Files changed

**Backend**
| File | Change |
|---|---|
| `backend/prisma/schema.prisma` | Added `Category` model + 18 additive `Course` fields (B). |
| `backend/prisma/migrations/20260816120000_add_course_catalog/migration.sql` | **New** — canonical additive migration for prod (`migrate deploy`). |
| `backend/prisma/seed_catalog.ts` | **New** — idempotent seed: 9 categories + course slug/category backfill. |
| `backend/src/services/courseService.ts` | `getAllCourses()` → `getCatalogCourses(categorySlug?)` with derived `moduleCount`; `getPublicCourseDetails()` resolves slug-or-id and returns full catalog field set. |
| `backend/src/routes/course.ts` | `GET /` catalog with `?category=` filter; new `GET /:slug` public detail (registered after `/public` + `/module/:week`). |

**Frontend**
| File | Change |
|---|---|
| `frontend/src/config/courses.ts` | Stripped `title`/`desc`/`descShort`/`syllabus` → **presentation-only** (icons/colors/titleShort/practiceCategory). |
| `frontend/src/hooks/useCourseDetail.ts` | Resolves canonical `Course.id` from slug-or-id; all downstream calls (progress/payments/modules/localStorage) keyed by canonical id. |
| `frontend/src/pages/Home.tsx` | Removed 227-line hardcoded `courseDetails` fallback; catalog 100% API-driven; `difficulty`/`tags` prefer DB when present; track count derived from `courses.length`; added catalog error card. |
| `frontend/src/pages/Dashboard.tsx` | `CourseCard` gets `totalWeeks={course.modules?.length}`. |
| `frontend/src/components/molecules/CourseCard.tsx` | New `totalWeeks?` prop; badge `Week {n}/{totalWeeks}` (removed `/4`). |
| `frontend/src/pages/CourseDetail.tsx` | Removed `/20`, `Week x/4`, `4-Week Immersion`, `weekNum*5`; all `id`-keyed API/lookup usages → canonical `courseKey`; `EnrollmentPanel` gets `price` prop; fallbacks use `titleShort`. |
| `frontend/src/components/organisms/EnrollmentPanel.tsx` | New `price?` prop; button text `(₹{price})` when known (removed hardcoded ₹699). |
| `frontend/src/pages/PayPage.tsx` | Removed `BASE_PRICE = 699`; price fetched from `/courses/:courseId/public`; canonical-id resolution for payment status/order/certificate links; graceful error if price fetch fails. |
| `frontend/src/pages/AdminDashboard.tsx` | Course titles + certificate-console dropdown API-driven (mount-fetch `/courses`, `titleShort`/id fallback). |

## B. Prisma / schema changes

- **New `Category`**: `id Int @id @default(autoincrement())`, `slug String @unique`, `name String`, `description String?`, `parentId Int?` self-relation (`CategoryTree`, `onDelete: SetNull`), `sortOrder Int @default(0)`, `isPublished Boolean @default(true)`, `createdAt`/`updatedAt`.
- **Additive `Course` fields** (all nullable or defaulted — zero effect on existing rows): `slug String? @unique`, `shortTitle?`, `shortDescription?`, `categoryId?`/`subcategoryId?` → two named `Category` relations (`CourseCategory`/`CourseSubcategory`, `onDelete: SetNull`), `courseType?`, `difficulty?`, `duration?`, `language?`, `instructor?`, `thumbnail?`, `banner?`, `status String @default("PUBLISHED")`, `certificateAvailable Boolean @default(true)`, `prerequisites/learningOutcomes/targetAudience/skillsGained/tags String[] @default([])`, `featured Boolean @default(false)`.
- **Unchanged**: `Course.id`, `Course.price` semantics, all payment/progress/certificate relations. `prisma validate` ✓.

> **Deviation note:** `slug` is nullable (spec says `slug @unique`). Required-slug would break all 11 existing `course.create` call sites (seed.ts + 9 reseed scripts + reseed_c_beginner.ts) on a fresh DB. Backfill fills all 9 slugs; admin-created courses without a slug keep working (list/detail still resolve by id). Backend-generated `GET /:slug` simply won't match a null slug.

## C. API changes

- **`GET /api/courses`** → published catalog; each course returns the spec field set incl. `moduleCount` (derived from `_count.modules`, never hardcoded) + `category {slug,name}`; supports **`?category=<slug>`** (e.g. `?category=programming` → C, C++, Python, SQL). Ordering: `featured desc, createdAt asc`.
- **`GET /api/courses/:slug`** (new) → public detail by slug **or legacy id**; returns catalog fields + `moduleCount` + modules with `topics [{id,title}]` only — **no `Topic.text/code/quiz`** for public users. Registered after `/public` and `/module/:week` so those win; 404s unknown courses.
- **`GET /api/courses/:courseId/public`** — kept; now also slug-or-id (Verify flow intact).
- No changes to auth'd module fetch, admin CRUD, payments, quiz, or certificate routes.

## D. Frontend changes

- `config/courses.ts` is now **presentation-only** — API is the single source of truth for title/desc/syllabus/price/category/module count.
- Home catalog, Dashboard cards, CourseDetail (duration, chapters, eligibility gates, deliverable unlock thresholds) all derive from API `modules.length` / `moduleCount`.
- Price flows from backend everywhere: CourseDetail → EnrollmentPanel `price`, PayPage fetches `/courses/:id/public` (removed `BASE_PRICE=699`); coupon ₹200 discount computed against live price.
- `/course/:id` route unchanged; visiting `/course/cpp` (slug) works via canonical-id resolution in `useCourseDetail` and `courseKey` in CourseDetail.
- No UI redesign; presentation metadata (colors/icons/tags) retained.

## E. Migration / seed changes

- **Migration** `20260816120000_add_course_catalog` generated by `prisma migrate diff` (canonical — matches schema exactly). Pure `ADD COLUMN` / `CREATE TABLE Category` / `CREATE UNIQUE INDEX` / 3 FKs. **Idempotent**: once recorded in `_prisma_migrations`, `migrate deploy` is a no-op on re-run. No drops, no data-loss ops.
- **Local apply**: `prisma db push --accept-data-loss` (the only warning is the new `Course_slug` unique index on an all-NULL column — Postgres allows multiple NULLs; no data at risk). Client regenerated.
- **Seed** `seed_catalog.ts`: upserts 9 categories by slug (Computer & Office, Programming, Web Development, AI & Future Skills, IoT, Embedded Systems, Electronics, CAD & Design, ITI & Trade Training — descriptions left NULL, no invented copy); backfills course slugs only when currently NULL, with `-1` suffix if a slug is taken by another course, and connects category by slug. Category→course mapping and slugs exactly per spec. **Ran twice — idempotent** (9 cats, 9 courses, no dupes, prices unchanged).

## F. Validation performed

1. `prisma validate` ✓
2. Backend `tsc --noEmit` ✓ (0 errors)
3. Frontend `tsc -b && vite build` ✓
4. Frontend `eslint` on all changed files: **0 issues** (full-repo run: 0 errors, 8 pre-existing warnings elsewhere)
5. Migration SQL = canonical `prisma migrate diff` output ✓
6. Local DB: new columns + `Category` table present; `Course` count **9**, prices **699**, `Module` **180** — all unchanged from pre-change baseline
7. Live endpoints (against running backend on :5000):
   - `GET /api/courses` → 9, each with `moduleCount:20`, `category {slug,name}`, no `text/code/quiz`
   - `?category=programming` → C, C++, Python, SQL · `?category=iot` → IoT · unknown → `[]`
   - `GET /api/courses/cpp` (slug) → C++, price 699, moduleCount 20 · `GET /api/courses/C++` (legacy id) ✓
   - `GET /api/courses/C/public` → 200, Verify flow intact
   - unknown slug → 404
8. Seed idempotency: double-run clean
9. Data safety: `User/Course/Module/Topic/QuizQuestion/QuizResult/CourseProgress/ModuleProgress/TopicProgress/Payment/CertificateRecord/AssignmentSubmission/ProjectSubmission` all preserved; only additive changes; `Category` = 9 new rows

## G. Remaining issues / assumptions

1. **Admin CMS visibility**: `GET /courses` now returns published courses only. Admin CMS edits by id (`PUT/DELETE`) still work, but a future unpublished course won't appear in the catalog or the admin dropdown. Pending an admin-only catalog endpoint — out of scope here.
2. **`getAllCourses()` removed** — only `routes/course.ts` referenced it; nothing else regressed.
3. **`prerequisites` field name**: schema + API use `prerequisites` (the spec's "prerequisites/requirements"). Frontend `CourseDetail` prerequisites card still shows its pre-existing static text; wiring it to `course.prerequisites` when populated is a follow-up.
4. **Category copy**: all 9 categories have `description = NULL` (no invented marketing copy). Fill when real copy exists.
5. **Slug route + legacy links**: existing `/course/C` links continue to work (id resolution). New slug URLs (`/course/c`) are supported. View-state (localStorage) remains keyed by the visited URL — `/course/c` and `/course/C` keep separate week-view state.
6. **CourseCard badge on Dashboard**: shows `/20` (real module count) for in-progress courses — accurate per DB; visual only, matches the "20 modules" data.
7. **Home trust metric**: "Tracks" now = `courses.length` (9 today); "1,250+ Accredited Students" and "100% Free & Verifiable" are pre-existing marketing copy — untouched (out of scope).
8. Not re-run: interactive browser E2E for this change (covered by build gates + API smoke; the m0XX harnesses target unrelated flows).
9. **Deploy**: push `master` → `wrap_and_deploy.sh`. Migration applies automatically on backend container start (`migrate deploy`). Seed `seed_catalog.ts` must be run once against prod (`docker exec edunexuspro-backend-1 npx ts-node prisma/seed_catalog.ts`) — it is safe/idempotent.

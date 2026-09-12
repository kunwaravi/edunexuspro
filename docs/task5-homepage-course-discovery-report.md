# TASK 5 — Homepage Dynamic Courses Section & Course Discovery · Report

> Date: 2026-08-16 · Project: EduNexus Pro · Branch: `master` (local)
> Status: **COMPLETE — not deployed, not pushed to git, 0 new courses**
> This task is specifically: *"Make the existing dynamic course catalog visible and usable from the homepage."*

---

## A. Scope

Connected the Task 3 catalog foundation to the homepage as a real, dynamic, production-ready **"Courses"** section, and added a full public catalog page at `/courses` for discovery. The catalog API (`GET /api/courses`) is the single source of truth for course data; the frontend carries **only presentation metadata** (icon, accent colors, grid spans).

- **No new courses added** (still exactly 9 seeded courses).
- **No backend changes** were needed — the Task 3 catalog API already supported category filtering, `featured` ordering, and all card fields.
- Quiz / progress / certificate architecture untouched.
- No payment logic changes; price rendered from the API.

## B. Homepage Courses Section (`frontend/src/pages/Home.tsx`)

Kept the existing homepage visual language (glass cards, gradient glows, amber accents, uppercase micro-labels — **no whole-page redesign**). Changes:

- **Header**: "COURSES" heading + subtitle + **"View All Courses"** button → navigates to `/courses`.
- **Category filter chips**: derived at runtime from the catalog response (distinct `category.slug` / `category.name` + "All") — real slugs, no hardcoded category names anywhere.
- **Course cards** (existing bento grid): each card now renders **only API data** — title, description, category name, price (₹ from API), module count, certificate availability, difficulty/duration/tags (rendered **only when non-empty** — authoring is the next task), featured badge (conditional on the API flag), plus presentation icon/accent from `config/courses.ts`. Syllabus modal ("Preview Syllabus") is driven by the API's module list.
- **States**: Skeleton grid while loading (existing `Skeleton` atom, no new UI library); small non-crashing error fallback with **Retry** (no raw backend errors surfaced); clean empty state ("No courses in this category yet") — never fabricates courses.
- **Card CTA** ("View Course") navigates via `slug || id`.

## C. API / Data Flow

- Single hook `frontend/src/hooks/useCourses.ts`:
  - `GET /api/courses` (or `?category=<slug>` for filtering) via the shared `api` client.
  - Derives the category chip list from the response (`deriveCourseCategories`).
  - Handles `loading` / `error` / `refetch`; calls the API once per filter change (no polling, no repeated fetches).
- **State management**: React context + local state only (no Redux / Zustand / React Query) — matches the existing architecture.
- **Endpoints used (existing, no new endpoint)**: `GET /api/courses`, `GET /api/courses?category=<slug>`. Public — no enrollment/auth checks on the public catalog (spec §N). `GET /api/courses/:id` resolves **both** legacy ids (`C`, `C++`) and slugs (`c`) for `/course/:slug` navigation (spec §H).

## D. Category & Featured Behavior

- Category filtering is **server-side** (`?category=<slug>`); the "All" chip refetches the unfiltered list. Verified counts: `programming` → 4 (C, C++, Python, SQL), `cad-design` → 2, `web-development` → 1, `iot` → 1, `embedded-systems` → 1.
- Category chips show **only published categories that actually have courses**. `computer-office` (a seeded category with 0 published courses) is intentionally absent until a course is assigned to it — "only published categories" enforced at the data level; the empty-state UI covers empty filters.
- **Featured**: the backend orders `featured desc` first; all 9 courses are currently `featured = false`, so the section falls back to normal published order. The frontend renders the "Featured" badge **only** from the API flag — nothing is fabricated.

## E. Testing & Validation

| Gate | Result |
|---|---|
| `prisma validate` | ✅ PASS |
| Backend `tsc` | ✅ PASS |
| Frontend `tsc -b` | ✅ PASS |
| Frontend `vite build` | ✅ PASS |
| ESLint (changed files) | ✅ PASS |
| Catalog API smoke | ✅ PASS (9 courses) |
| **Task 5 catalog suite** (`backend/tests/task5_catalog_tests.ts`) | ✅ **28/28 PASS** |
| **Task 4 security regression** (`backend/tests/task4_security_tests.ts`) | ✅ **17/17 PASS** |

The 28 Task 5 checks cover all 12 spec cases (§R) — API-level against the live server plus static source checks (no browser test harness exists in this project; build + API smoke is the established gate):

1. Homepage catalog loads from the public API (no auth) — ✅
2. Cards render API data — full data contract (id, slug, title, description, category, difficulty, duration, moduleCount, certificateAvailable, featured, price, tags) present on all 9 — ✅
3. Price from API (all ₹699, no hardcoded price / `BASE_PRICE` in card or config) — ✅
4. Module count from API (`moduleCount === modules.length`; rendered as `{moduleCount} Modules`, no `/20` / "Week x/4" hardcodes) — ✅
5. Category filtering (`?category=programming`→4, `cad-design`→2, `web-development`→1, `iot`→1, `embedded-systems`→1; filtered rows all belong to the category) — ✅
6. Featured fallback (no fake featured data; badge renders only from the API flag) — ✅
7. View All → `/courses` (button present; route registered and public) — ✅
8. Card opens correct slug/id route (`slug || id` in CourseCard, Home, and CoursesPage) — ✅
9. Legacy `/course/C` and `/course/C++` resolve; slug `/course/c` resolves to the same course — ✅
10. API failure → clean fallback UI, no crash (`try/catch` in hook, error card with Retry on both pages) — ✅
11. Empty category → 200 `[]`, clean empty-state UI — ✅
12. Mobile build valid (tsc + vite build; `dist/index.html` present) — ✅

Plus spec §Q/§U cleanup assertions: no parallel card/grid components (`CourseCard2` / `CourseGridNew` / `NewCourseCatalog`), presentation config carries no business data, "Free to Learn" marketing claim removed.

## F. Data Safety

Recorded before/after via `backend/prisma/verify_data_safety.ts`. **Identical — zero changes.**

| Entity | BEFORE | AFTER |
|---|---|---|
| Course | 9 | 9 |
| Module | 180 | 180 |
| Topic | 705 | 705 |
| Payment | 3 | 3 |
| CourseProgress | 1 | 1 |
| ModuleProgress | 1 | 1 |
| TopicProgress | 1 | 1 |
| CertificateRecord | 3 | 3 |
| Enrollment | 3 | 3 |

Enrollment integrity: 3 verified payments, 3 distinct (user, course) pairs, 3 enrollment rows, 3 ACTIVE, 0 duplicate pairs, 0 orphan FKs.

## G. Deferred / Next Task

- **Course authoring** (difficulty, duration, tags, `featured` flags, short titles/descriptions) — currently `NULL`/empty in the DB; the UI already renders them honestly when present.
- **Computer & Office category** stays absent from the filter until a course is assigned to it.
- No new endpoints, no schema changes — backend is untouched.

---

## Files Changed

| File | Change |
|---|---|
| `frontend/src/hooks/useCourses.ts` | Rewritten — shared catalog hook (category filter + chip derivation + loading/error/refetch). |
| `frontend/src/components/molecules/CourseCard.tsx` | Edited — catalog variant reads API fields (`price`, `moduleCount`, `category`, `difficulty`, `duration`, `tags`, `featured`, `slug`, `certificateAvailable`); removed "Free to Learn"; CTA uses `slug || id`. Dashboard variant untouched. |
| `frontend/src/pages/Home.tsx` | Edited — "COURSES" section rebuilt API-driven; category chips; states; View All → `/courses`; card CTA via `slug || id`; `coursePresentation` (icon/accent/colSpan only) replaces the hardcoded `courseMetadata`. |
| `frontend/src/pages/CoursesPage.tsx` | **New** — public `/courses` catalog page (all published, category filtering, cards, detail nav). |
| `frontend/src/App.tsx` | Edited — public `/courses` route registered (no ProtectedRoute, spec §N). |
| `frontend/src/components/Navbar.tsx` | Edited — "Courses" nav link (logged-in links, logged-out desktop + mobile). |
| `frontend/src/config/courses.ts` | Rewritten — presentation-only (icon/accent colors); business data (title/desc/price/category/difficulty/tags) removed. |
| `backend/tests/task5_catalog_tests.ts` | **New** — 28-check suite (spec §R + §Q/§U). |

## Endpoints

- **Used (existing)**: `GET /api/courses`, `GET /api/courses?category=<slug>`, `GET /api/courses/:id` (id + slug).
- **Added**: none.

## Behavioral Changes (what a user sees)

- Homepage "Courses" section is now the **live catalog** — prices, module counts, categories, syllabus all come from the API.
- New **"View All Courses"** path and **Courses** nav link → `/courses` full catalog with category filtering.
- Course cards link to `/course/<slug>` (legacy `/course/C`, `/course/C++` still work).
- No fake ratings/student counts/reviews/discounts; null/empty authoring fields simply don't render.

## Deployment Notes

- **NOT deployed** to srv1616850 — this is a local, build-verified change ready for the next `wrap_and_deploy.sh` run.
- **NOT pushed** to git.
- **0 new courses**; no DB writes (data-safety snapshot proves it).
- When deployed, no migration is needed — backend unchanged, catalog data already in place.

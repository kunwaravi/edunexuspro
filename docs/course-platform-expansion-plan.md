All three exploration agents have completed. I now have a complete, evidence-based picture of the codebase. Here is the full architecture & implementation plan.

---

# EDUNEXUS — MULTI-CATEGORY COURSE PLATFORM
## Architecture & Implementation Plan (Planning Only — No Code Changed)

> **Source of truth used:** live code in `/home/abhi/repo/edunexuspro` (frontend + backend + Prisma schema), plus `docs/architecture-baseline.md`, `docs/backend-audit.md`, `docs/frontend-deep-dive.md`, `docs/ui-ux-audit.md`, `docs/frontend-foundation-stabilization-report.md`, content-quality audits, and deployment memory. Where docs conflict with each other, both sides are quoted and a recommendation is given (see §2/§20). Nothing was modified.

---

## 1. EXECUTIVE SUMMARY

EduNexus today is a **single-catalog** training platform: 9 flat courses (C, C++, Python, SQL, WebDesign, IoT, Embedded, CADDED Mech/Civil), each with a `Course → Module(week) → Topic(lesson)` hierarchy, per-topic quiz questions, manual-UPI payment with admin verification, and admin-verified QR certificates. There is **no category model, no /courses discovery page, no dedicated course-preview page, no Enrollment table, and no server-side gating of premium lesson/quiz content** — any logged-in user can read all lesson text and scrape the entire quiz bank, and can forge quiz/progress/certificate-eligibility because the quiz grader scores only the subset of questions the client chooses to submit.

The goal is to expand EduNexus into a **multi-category, admin-managed course platform** — Training (Computer & Office, Programming, Web Dev, AI, IoT, Embedded, Electronics, CAD) plus ITI/Trade — where:

- The **database is the single source of truth** for courses, categories, prices, and completion.
- **Premium content is backend-enforced** (enrollment-gated), with safe public preview.
- **Quiz/progress integrity is server-enforced** (question-set ownership, real denominators, real completion conditions).
- Admins **manage categories/courses/modules/lessons/quizzes without editing React**.
- Certificates keep working **unchanged**.

This plan reuses ~80% of the existing platform and is **additive** — no existing record, route, or certificate behavior is destroyed. Prices are **not invented**: the only documented price in the project is the current flat **₹699** for all 9 courses; no approved price list for new courses exists, so all new-course prices are marked **PRICE TO BE CONFIRMED** pending your approval.

**Recommended implementation order** deliberately fronts the two P0 defects (access control + quiz/progress integrity) *before* mass catalog expansion, because shipping new paid categories on today's open-content backend would expose every new course's premium content and let completions be forged.

---

## 2. CURRENT ARCHITECTURE

| Layer                 | What exists [OBSERVED]                                                                                                                                                                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**          | React 19 + TypeScript + Vite + Tailwind v4 + react-router-dom 7 + Axios + Framer Motion. Context-only state (Auth/UI/Theme). 18 live pages + 1 dead (`RegisterPage.tsx`). Lazy pages in `<Suspense>`. Guards: `ProtectedRoute` / `AdminRoute`.                                      |
| **Backend**           | Express 5 + Prisma 6 + TypeScript. `src/index.ts` mounts **76 endpoints across 12 routers** under `/api/*`. JWT auth (1-day token, Bearer in `localStorage`), in-memory rate limiter, zod validation on key routes.                                                                 |
| **Database**          | PostgreSQL. Prisma schema (386 lines, **9 migrations**, latest `20260812120000_add_share_solution`). **No enums** (status/role are String w/ defaults). **No Category, no Enrollment, no Lesson, no Assignment definition, no CourseProject definition models.**                    |
| **Infra**             | Docker Compose (backend/frontend/db/redis), nginx TLS, `wrap_and_deploy.sh` → `root@srv1616850.hstgr.cloud`. Live site = GitHub **`master`** (currently `08aa995`). Local dev DB (`pg-local`, db `nexus`) is **NOT Prisma-migration-managed** — never run `migrate deploy` locally. |
| **Deploy invariants** | Never overwrite `.env`, never wipe DB volume, additive-only migrations, don't disturb co-tenants. Backend container runs `prisma migrate deploy` on start.                                                                                                                          |

**Key data hierarchy today:** `Course (id is a human slug like "C"/"C++") → Module (week 1..N) → Topic (text/code/note = the lesson) → QuizQuestion (moduleId/topicId)`. Progress at 3 levels: `CourseProgress`, `ModuleProgress`, `TopicProgress`. `Challenge`/`ChallengeProgress` (coding challenges), `Payment`, `CertificateRecord`, `AssignmentSubmission`, `ProjectSubmission`, `Project` (legacy, **unused**), `PracticeQuestion`/`PracticeAttempt`, `Discussion`/`ForumComment`, `Setting`, `ContactMessage`, `FinalExamQuestion` (**deprecated — no route serves it**).

### Document conflicts found (reported, not silently resolved)

1. **CADDED module count: 5 vs 20.** `architecture-baseline.md:410` says "9 courses, 20 modules each (CADDED 5)"; `backend-audit.md:17,58` says CADDED courses have 5 modules and the gates block them; the content audits say `cadd_mech`/`cadd_civil` each have 20 modules/80 topics. **Recommendation:** treat the *live DB* as authoritative — count modules dynamically everywhere (this plan's integrity fixes make fixed counts irrelevant). Verify live count before touching assignment/project gates.
2. **Live branch: master vs main.** `backend-audit.md:3` and deployment memory confirm **`master`**; one content audit says `main`. **Recommendation:** `master` is authoritative (verified in git + deployed). CI `.github` gating on `main` is stale.
3. **Endpoint count: 76 (index.ts mount) vs ~58 (baseline).** Counting difference only; 76 is current.
4. **Catalog quality score: 72.9 (7-criterion) vs 60.4 (12-dimension, "adopted").** The deeper 60.4 rubric is the adopted one; CADD Civil is the weakest (31, "Major Revamp").
5. **Course naming:** docs mix `CADDED` (DB ids) vs `CADD` (file slugs). DB ids are authoritative.
6. **Frontend module denominators disagree** (`/20` in `CourseDetail.tsx`, `Week x/4` in `CourseCard.tsx`, real `weeks.length` in the API, `6-8` in config). All will be driven from API data.

---

## 3. CURRENT COURSE SYSTEM

- **9 courses**, all `price: 699`, all `isPublished: true`: C, C++, IoT, Embedded, WebDesign ("Web Design & Frontend Development"), Python, SQL, CADDED_Mech, CADDED_Civil.
- Deep GfG-style content reseeded live: per course ~20 modules, 65–80 topics, ~320 topic quiz questions, 158–160 chapter quizzes, distinct 15–18-question final exam (deprecated). (~177k words, 4,414 course questions across catalog.)
- **Content model** is `Course → Module (week) → Topic`, quizzes hang off module or topic. No lesson/assignment/project *definition* models (submissions exist; weekly deliverables are implicit in the frontend).
- **Discovery:** the only catalog is a hardcoded bento section on `Home` (with a `coursesConfig` array) — there is **no `/courses` page, no category page, no search/filter**. `GET /api/courses` returns course + module metadata only.
- **Course data is duplicated 4× in the frontend** (single-source-of-truth violation):
  1. `frontend/src/config/courses.ts` — `coursesConfig` (9 tracks, categories `'Programming' | 'Electronics' | 'Mechanical' | 'Design'`, colors, syllabus).
  2. `frontend/src/pages/Home.tsx` — inline `courseDetails` + `courseMetadata` + mock leaderboard.
  3. `frontend/src/pages/Dashboard.tsx` — `courseMetadata` + `skills` array.
  4. `frontend/src/pages/PracticeArena.tsx` — `codingTemplates` (language exercises).
- **Hardcoded 20-module assumptions** (all drift risks): `project.ts:52` blocks final project until 20 modules passed; `assignment.ts:49` maps week→module via `weekNum * 5`; `quizService.ts:35` falls back to 20; `CourseDetail.tsx:1385/1388/1413/1499` uses `/20` and `>= 20`; `CourseCard.tsx:146` shows `Week x/4`; `Certificate.tsx:34` says "all 4 weeks"; `About.tsx:47` says "4-Week". `src/lib/businessRules.ts` is **dead code** (weeklyProgressIncrement 25, maxWeeks 4 — legacy).

---

## 4. CURRENT PAYMENT/ENROLLMENT FLOW

- **No gateway SDK.** Manual **UPI proof + admin verification** flow:
  `PayPage → POST /payments/create-order {courseId, coupon?}` → server computes price from `Course.price` (client `amount` is **ignored** — good) with referral (50%)/coupon (capped 50%) discount → `Payment` row `INITIATED` → student pays via UPI (env `VITE_UPI_ID`) → `POST /payments/verify` (ownership-checked IDOR fix) → `PENDING` → admin verifies in AdminDashboard → `VERIFIED`.
- **Enrollment is implicit:** "enrolled" == `Payment.status === 'VERIFIED'` for (userId, courseId). **No `Enrollment` table.**
- **Access control is inconsistent [P0]:** the full lesson endpoint `GET /courses/:courseId/module/:week` and the quiz endpoints/submit/challenges/assignments/projects require **only authentication, not enrollment**. Only forum *posting* and certificate *generation* check `VERIFIED` payment.
- **Payment weaknesses:** `transactionId` never written (UPI reference replay risk); `/payments/verify` lacks a state-machine guard; `create-order` not idempotent; unknown `courseId` → FK 500; admin actions not audited.
- **Pricing duplication:** `PayPage.tsx:26` `BASE_PRICE=699` + frontend coupon map; `EnrollmentPanel.tsx:80` hardcoded "₹699"; `AdminDashboard.tsx` course-creation default price **999** (drift vs charged 699).

---

## 5. CURRENT CERTIFICATE FLOW

- `GET /certificate/:courseId` (self) → `certificateService.generateCertificate` requires **both** (for non-admin): course completion (`progress.completed || weekCompleted >= module.count`) **and** a `VERIFIED` Payment (else 402). Admin bypasses both.
- Credential: unguessable `NEX-<random64>-<COURSEKEY>`, persisted as `CertificateRecord` with `verificationStatus PENDING|VERIFIED` (admin-controlled, issue #101) + `verifiedAt`.
- Public `GET /certificate/verify/:credentialId` (rate-limited 20/min): `VERIFIED` → full data+PII; `PENDING`/legacy-guessable → no PII.
- UI (`Certificate.tsx`, `Verify.tsx`) is **user-mandated HARD NO-TOUCH**. QR value = text credential ID. Admin "Direct Certificate Access Console" opens `/certificate?courseId=&userId=`.
- **Conclusion for this plan:** the certificate backend is already correctly gated and dynamic on module count — it needs **no redesign**. New courses only need an eligibility flag (`certificateAvailable`) so certificateService can honor it.

---

## 6. PROPOSED INFORMATION ARCHITECTURE

```
ALL COURSES (/courses)
   └─ Category → Subcategory (optional) → Course → Module → Topic (Lesson) → Quiz / Assignment / Project / Challenge
```

- **Category (top level, 9):** Computer & Office · Programming · Web Development · AI & Future Skills · IoT · Embedded Systems · Electronics · CAD & Design · ITI & Trade Training.
- **One shared, dynamic Course Detail page** (`/course/:slug`) for every course — no per-course hardcoded pages.
- **Learning area stays inside the enrolled course** (existing `CourseDetail` pattern) rather than inventing a separate `/learn` tree, per "reuse existing architecture" and the existing routing conventions (`/course/:id`, `/quiz/:courseId/:week/:topicId`, `/dashboard`).
- **Nav complexity kept low:** a top-level category strip on `/courses` + Home, with subcategories only where they earn their place (ITI trades, and optionally within Training).

Rationale: your proposed tree nests Computer & Office / Programming / Web Dev / AI / IoT / Embedded / Electronics / CAD under "Training". Flattening to 9 top-level categories matches the §5 discovery model, keeps URLs short (`/courses/programming`), and avoids a 3-level nav on mobile. **ITI is kept distinct** (it is a training *trade* domain, not a computer course).

---

## 7. CATEGORY RECOMMENDATION

Recommendation on which items are **categories / subcategories / courses / bundles / future**:

| Item                                                                                                     | Verdict                                                                                                                     | Why                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| All Courses                                                                                              | Aggregate view (virtual)                                                                                                    | It's the union of all categories, implemented as `/courses` with no category filter or as "All".                                                      |
| Training                                                                                                 | **Drop as a nav category**                                                                                                  | Adds a needless nesting level; the 8 sub-groups work better as top-level categories. (Kept as a *label* if you prefer the tree — see Open Questions.) |
| Computer & Office                                                                                        | **Category**                                                                                                                | MS Word/Excel/PPT etc. are distinct courses.                                                                                                          |
| MS Office Complete                                                                                       | **Bundled course** (single course, module groups per app) in MVP; real "bundle = multiple courses" is out of scope          | Simplest correct model; no bundle entity needed now.                                                                                                  |
| Programming / Web Development / AI & Future Skills / IoT / Embedded Systems / Electronics / CAD & Design | **Categories**                                                                                                              | Each will hold multiple courses.                                                                                                                      |
| C, C++, Python, Java, MS Excel, HTML & CSS, React, Arduino, ESP32, AutoCAD, Electrician, …               | **Courses**                                                                                                                 | Leaf units students buy.                                                                                                                              |
| ITI / Trade Training                                                                                     | **Category** with each trade (Electrician, Fitter, Welder, COPA, Electronics Mechanic, Draughtsman, …) as a **subcategory** | A trade can hold multiple training programs; keeps ITI distinct from computer courses (your §27).                                                     |
| "AI Fundamentals", "Generative AI", "Prompt Engineering"                                                 | **Future courses** (define category now, add courses as content matures)                                                    | No content exists; don't create empty shells.                                                                                                         |
| IoT Projects / Embedded Projects / Electronics Projects                                                  | **Not separate courses in MVP**                                                                                             | Projects are *components* of courses (module-level project), not standalone courses.                                                                  |

**Existing 9 courses re-map cleanly:** C, C++, Python, SQL → **Programming**; WebDesign → **Web Development**; IoT → **IoT**; Embedded → **Embedded Systems**; CADDED_Mech → **CAD & Design**; CADDED_Civil → **CAD & Design**. (WebDesign currently sits under "Programming" in `config/courses.ts` — re-mapping it to Web Development is a correction, not a break.)

---

## 8. INITIAL COURSE CATALOG (MVP)

**Do NOT create 100+ courses.** Recommended MVP ≈ **11–13 courses** = the 9 existing (re-categorized, content already deep) + 2–4 new. New-course content is only created after the architecture is stable (Phase 11–12).

| Group                | Existing (keep)           | New (recommended)                                                     | Why / learner / level / duration / cert / modules / price                                                                                   |
| -------------------- | ------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Computer & Office    | —                         | **Computer Fundamentals** · **MS Excel Complete**                     | Highest-demand, lowest-cost entry; beginner→advanced; ~15h; cert yes; 8 modules; **PRICE TO BE CONFIRMED**.                                 |
| Programming          | C, C++, Python            | (Java or DSA deferred)                                                | Existing content is deep and already paid for; add Java/DSA in Phase 11 only if approved.                                                   |
| Web Development      | WebDesign                 | **HTML & CSS** (reuse WebDesign module seeds as a first-cut skeleton) | Beginner; ~10h; cert yes; 6 modules; **PRICE TO BE CONFIRMED**.                                                                             |
| AI & Future Skills   | —                         | none in MVP (category scaffold only)                                  | No vetted content yet.                                                                                                                      |
| IoT                  | IoT                       | —                                                                     | Existing.                                                                                                                                   |
| Embedded Systems     | Embedded                  | —                                                                     | Existing.                                                                                                                                   |
| Electronics          | —                         | **Basic Electronics** (1)                                             | Bridges to IoT/Embedded; beginner; ~12h; cert yes; 8 modules; **PRICE TO BE CONFIRMED**.                                                    |
| CAD & Design         | CADDED_Mech, CADDED_Civil | —                                                                     | Existing (Civil needs the already-flagged re-scope before promotion).                                                                       |
| ITI / Trade Training | —                         | none in MVP (category + subcategories scaffold)                       | Content strategy comes later; **no govt-accreditation claims** (EduNexus certificate ≠ official ITI cert unless you confirm accreditation). |

**Price rule applied:** existing 9 keep the platform's ₹699. Every new course's `price` field is **PRICE TO BE CONFIRMED** and its course is created in `DRAFT` (unpublished) until the owner approves a price — no invented numbers.

---

## 9. COURSE DATA MODEL

**Existing `Course`:** `id String @id` · `title` · `description` · `price Int @default(699)` · `isPublished Boolean` · timestamps. *(id doubles as the URL slug today — e.g. `/course/C`.)*

**Proposed field audit against your checklist:**

| Field                                                  | Verdict                          | Action                                                                                                                                                                                                                                      |
| ------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                                   | EXISTS                           | Keep (String PK, e.g. "C"). Do not migrate to numeric — every URL/record/payment references it.                                                                                                                                             |
| `slug`                                                 | **MISSING**                      | Add `String @unique`. Backfill `slug = existing id` (identity-safe). Public URLs move to `/course/:slug`; old `/course/:id` keeps working via redirect/compat.                                                                              |
| `title`, `description`                                 | EXISTS                           | Keep.                                                                                                                                                                                                                                       |
| `shortTitle` / `shortDescription`                      | **MISSING**                      | Add nullable (used by cards/catalog).                                                                                                                                                                                                       |
| `categoryId`                                           | **MISSING**                      | Add FK → `Category` (backfill 9 courses per §7).                                                                                                                                                                                            |
| `subcategoryId`                                        | **MISSING**                      | Add nullable FK → `Category` (self-referencing) for ITI trades / optional nesting.                                                                                                                                                          |
| `thumbnail`, `banner`                                  | **MISSING**                      | Add nullable URL strings (stored URL; images hosted separately).                                                                                                                                                                            |
| `price`                                                | EXISTS                           | **Authoritative source.** Keep `Int`.                                                                                                                                                                                                       |
| `level`                                                | **MISSING**                      | Add nullable String (`Beginner/Intermediate/Advanced` or free text).                                                                                                                                                                        |
| `duration`                                             | **MISSING**                      | Add nullable String or Int-hours (display only; not used for gates).                                                                                                                                                                        |
| `moduleCount`                                          | **NOT REQUIRED as stored field** | Derive from `module.count(courseId)` — storing it is a denormalization drift risk.                                                                                                                                                          |
| `certificateAvailable`                                 | **MISSING**                      | Add `Boolean @default(true)` — gate for `certificateService` eligibility.                                                                                                                                                                   |
| `status`                                               | **NEEDS MODIFICATION**           | Add `String @default("PUBLISHED")` (`DRAFT\|PUBLISHED\|ARCHIVED`); backfill existing → `PUBLISHED`. Keep `isPublished` for now or fold into it — plan: add `status`, keep `isPublished` for backward compat, map `PUBLISHED = isPublished`. |
| `featured`                                             | **MISSING**                      | Add `Boolean @default(false)` for Home/All-Courses highlights.                                                                                                                                                                              |
| `tags`                                                 | **MISSING**                      | Add `String[] @default([])`.                                                                                                                                                                                                                |
| `learningOutcomes` / `requirements` / `targetAudience` | **MISSING**                      | Add `String[] @default([])` (frontend renders as lists).                                                                                                                                                                                    |
| `createdAt/updatedAt`                                  | EXISTS                           | Keep.                                                                                                                                                                                                                                       |

**Module:** existing `id/courseId/week/title/description/timestamps` — the `week` **is** the order. Verdict: **EXISTS with minor modification** — add `status` (optional) and treat `week` as `order` in API responses; **do not rename the column** (migration risk for zero benefit). No new Module fields needed.

**Topic (== Lesson):** existing `id/moduleId/title/text/code/note/order` — `text`+`code` are the premium lesson body. Verdict: **NEEDS MODIFICATION** — add `isPreview Boolean @default(false)` (controls public preview) and optional `duration Int?`. **Do NOT create a separate `Lesson` model** — Topic is the lesson; introducing a parallel model duplicates content.

**Quiz:** only `QuizQuestion` exists (moduleId/topicId, text, options, correctAnswer). Verdict: **NEEDS MODIFICATION** — add `explanation String?` (content audits flag its absence) and **add server-side rules** (passing score, expected question set) to `businessRules.ts` rather than a new `Quiz` entity. A `Quiz` grouping entity is optional and **NOT REQUIRED for MVP**.

**Assignment:** `AssignmentSubmission` exists (submission side) but **no Assignment definition**. Verdict: **MISSING** — add a lightweight `Assignment` model (`id, courseId, moduleId?, title, description, weekNumber/order, submissionType, passingRequirement`) so admins can author them and the backend can drop the hardcoded `weekNum*5` mapping.

**Project:** `Project` model exists but is **legacy/unused**, and `ProjectSubmission` exists. Verdict: **NEEDS MODIFICATION** — add `courseId` to a project *definition* (or a small `CourseProject` model) so the final-project gate derives its required module count from data, replacing the hardcoded 20. Prefer repurposing `Project` (add `courseId`, `requiredModuleCount`) over a duplicate model.

**Enrollment:** **MISSING.** See §16.

---

## 10. CONTENT MODEL

Mapping your desired hierarchy onto existing tables (no duplicates):

```
CATEGORY        →  NEW Category model
COURSE          →  Course (extended per §9)
MODULE          →  Module (week)
TOPIC/CHAPTER   →  Topic  (the lesson: title, text, code, note, isPreview, order)
LESSON          →  Topic (same object — no separate model)
LEARNING MATERIAL → Topic.text/.code/.note (+ any uploaded asset URL)
QUIZ            →  QuizQuestion (topic-level or chapter/module-level), rules in businessRules.ts
ASSIGNMENT      →  NEW Assignment definition (authoring) + existing AssignmentSubmission
PROJECT         →  Project (repurposed with courseId) + existing ProjectSubmission
MODULE COMPLETION  → ModuleProgress (completed + quizPassed)
COURSE COMPLETION  → CourseProgress (completed, derived from actual module count)
CERTIFICATE     → CertificateRecord + certificateService (UNCHANGED)
```

The only *new* content entities needed: **Category**, **Assignment** (definition), **Enrollment**; plus a **project definition link** and the small field additions in §9. Everything else maps 1:1 to existing tables — this keeps content creation and migration cheap.

---

## 11. PRICING ARCHITECTURE

**Rule honored:** only approved EduNexus selling price, no market price / crossed-out / fake discount / "was ₹X now ₹Y". 

- **Authoritative source = `Course.price` in the DB.** Frontend never owns a price.
- **New endpoint:** `GET /payments/checkout/:courseId` returns `{courseId, title, price}` so `PayPage` renders server values only. (This was already flagged as backlog BE-09 / M-018 — this plan implements it.)
- **Coupons move to the DB `Setting` store** (machine-readable map, editable without deploy, auditable), replacing the frontend coupon map and the hardcoded codes in `paymentService`. Discount cap (50%) and the no-auto-verify guarantee stay.
- **Remove frontend pricing duplication:** `PayPage.tsx` `BASE_PRICE` + coupon map, `EnrollmentPanel.tsx` "₹699" hardcode, and fix `AdminDashboard.tsx` course-creation default (999 → server-driven).
- **Existing courses:** keep ₹699. **New courses:** `status=DRAFT` + price **PRICE TO BE CONFIRMED** — never published with an unapproved price. The ₹599 in your example is **Not confirmed in current project** (the platform's only documented price is ₹699) — confirm the approved price list before Phase 11.

---

## 12. ADMIN ARCHITECTURE

Keep the existing single `AdminDashboard.tsx` (8 tabs) as the console — no full rewrite. **Extend the "Course Syllabus CMS" tab** (and add a small "Categories" section) so admins can manage the catalog without touching React:

- **Categories:** create / edit / archive / reorder / set visibility (new backend CRUD + simple admin UI built on existing `Tabs/Table/Dialog/Select` primitives).
- **Courses:** create / edit / archive / publish-draft / set all §9 fields (title, short description, category, subcategory, thumbnail/banner URL, level, duration, cert availability, outcomes, requirements, audience, tags, featured, price, slug).
- **Modules:** create / edit / reorder / archive.
- **Lessons (topics):** create / edit / reorder / set preview flag / duration.
- **Quizzes:** create / edit questions / **set passing score** (moves into `Setting`/`businessRules`) / add explanation.
- **Assignments & Projects:** create / edit / set requirements (new models).
- **Prioritized for MVP (Phase 4):** Categories + Course extended fields + Module/Lesson reorder + preview flag + question explanation. Quiz passing-score, assignments/projects authoring, and featured/tags are Phase-4.5/backlog. *(Currently the CMS has a blank-correct-answer bug — `AdminDashboard.tsx:535` calls the student endpoint which strips `correctAnswer`; part of Phase 4.)*

---

## 13. FRONTEND ARCHITECTURE

**Route plan (follows existing conventions; new pages built on existing primitives):**

| Route                            | Action                    | Notes                                                                                                                                                                                                                                                                                   |
| -------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` Home                         | MODIFY                    | Catalog section becomes API-driven from `/courses`; remove `courseDetails`/`courseMetadata`; keep hero/trust metrics.                                                                                                                                                                   |
| `/courses`                       | **NEW**                   | All Courses: category filter chips, search, level filter, sort, featured, pagination (server-side). Uses existing `Card`, `Button`, `Select`, `Badge`, `PageContainer`, `Skeleton`, `EmptyState`.                                                                                       |
| `/courses/:categorySlug`         | **NEW**                   | Single dynamic category page (no per-category components): title, description, course grid, search/filter within category.                                                                                                                                                              |
| `/course/:slug`                  | **REPLACE** `/course/:id` | Public **Course Detail/Preview**: breadcrumb, hero, outcomes, syllabus preview, requirements, audience, level, duration, module count, cert availability, **price (server)** + Enroll Now. Premium topics hidden unless `isPreview` (or enrolled). Old `/course/:id` → compat redirect. |
| `/course/:id` (learning area)    | KEEP                      | Enrolled learning stays inside CourseDetail's existing 3-view state machine. Fix `/20`, `Week x/4` literals → API-driven.                                                                                                                                                               |
| `/quiz/:courseId/:week/:topicId` | KEEP                      | Quiz UI unchanged; backend integrity fixes behind it.                                                                                                                                                                                                                                   |
| `/dashboard`                     | MODIFY                    | "My Courses" + Continue Learning already exist; remove hardcoded `courseMetadata`; progress already comes from `user.progresses[]`.                                                                                                                                                     |
| `/pay/:courseId`                 | MODIFY                    | Server-driven price/checkout; remove `BASE_PRICE` + coupon map.                                                                                                                                                                                                                         |
| `/admin`                         | MODIFY                    | Extend CMS + add Categories section.                                                                                                                                                                                                                                                    |
| `/certificate`, `/verify`        | **LEAVE UNTOUCHED**       | HARD NO-TOUCH.                                                                                                                                                                                                                                                                          |

**Reuse (existing components):** `Card`, `Button`, `Badge`, `Dialog`, `Tabs`, `Select`, `Table`, `Input`, `PageContainer`, `Skeleton`, `Spinner`, `CourseCard` (parameterized), `SyllabusManager`, `EnrollmentPanel`, `ProgressMap`, `ErrorBoundary`, `UIContext` toasts/confirm.

**Create (new):** `CourseCard` v2 (fully API-driven), `CategoryChip`/`CategoryStrip`, `CourseGrid`, `CourseDetailPreview` (public section), `SearchSortBar`, `useCategories`, `useCourseCatalog` (query/filter), `useCourseBySlug`, `useEnrollment` hooks; a couple of `AdminCategoryManager`/`AdminCourseForm` components.

**Consolidate (single source of truth):** delete/stop-importing `config/courses.ts` (or reduce to a small category→color/icon *presentation* map kept in sync by API), `Home.tsx` `courseDetails`/`courseMetadata`, `Dashboard.tsx` `courseMetadata`/`skills`, `PracticeArena.tsx` `codingTemplates` (move to backend content). Everything course-shaped comes from the API.

**State:** stay on Context API (`AuthContext`/`UIContext`/`ThemeContext`); enrollment state = `user.progresses` + a new `useEnrollment` that calls `GET /payments/status/:courseId` (existing). No Redux/React-Query unless you choose to add it later.

---

## 14. BACKEND ARCHITECTURE

**Reuse (no change):** payment verify ownership check, admin auth (`isAdmin`), certificate service, forum-enrollment gate pattern, `GET /courses` catalog list.

**Modify:**
- `routes/course.ts:35` + `courseService.getModuleByWeek` — **enrollment-gate** the full-lesson endpoint (see §16); keep public detail endpoint returning syllabus + preview topics + price.
- `routes/quiz.ts` (13/30/49) + `quizService` — **enrollment-gate + integrity** (§17).
- `routes/challenge.ts` (16/36/48/78) — enrollment-gate; stop setting `quizPassed` without a quiz.
- `routes/assignment.ts:49` / `routes/project.ts:52` — derive required module count from `module.count({ where: { courseId } })` instead of `20` / `weekNum*5`.
- `paymentService` — coupons from `Setting` store; `transactionId` written from UPI reference; idempotent `create-order`; state-machine guard on verify.
- `businessRules.ts` — revive as the single home for `passingScoreThreshold`, `moduleCompletionRules`, `certificateEligibility` (today it's dead code).
- `src/index.ts` — mount new routers.

**Create:**
- `routes/category.ts` + `categoryService` — public `GET /categories`, `GET /categories/:slug`; admin CRUD.
- `GET /courses` extended with `?category=&search=&level=&sort=&page=&featured=` (server-side filtering/pagination) + `GET /courses/:slug` public detail.
- `GET /my-courses` (enrolled list) or reuse `/dashboard` data.
- `middleware/enrollment.ts` (`requireEnrollment(courseId)`) — the single gate reused by course/quiz/challenge/assignment/project/forum.
- `GET /payments/checkout/:courseId`.
- `routes/assignment` + `routes/project` definition authoring (admin), if the new models land in MVP.
- **No duplicate endpoints** for anything an existing route already covers.

---

## 15. DATABASE PLAN

**CURRENT → REQUIRED → REASON → MIGRATION RISK** (all additive; no destructive change):

| Change                                                                                                                                                                                                                                                                                                                                                                                  | Reason                                                                                                                             | Risk                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| NEW `Category` (`id`, `slug @unique`, `name`, `description`, `parentId?` self-FK, `sortOrder`, `isActive`, `thumbnail?`, timestamps)                                                                                                                                                                                                                                                    | Taxonomy backbone.                                                                                                                 | Low. New table.                                                     |
| `Course.categoryId → Category` (+ `subcategoryId?`), index on `categoryId`                                                                                                                                                                                                                                                                                                              | Course↔category relation.                                                                                                          | Low; nullable FK backfill.                                          |
| `Course.slug @unique` (backfill = existing id)                                                                                                                                                                                                                                                                                                                                          | Stable public URLs.                                                                                                                | Low; identity-safe backfill.                                        |
| `Course` new fields: `shortTitle?`, `shortDescription?`, `thumbnail?`, `banner?`, `level?`, `duration?`, `certificateAvailable Boolean @default(true)`, `status String @default("PUBLISHED")`, `featured Boolean @default(false)`, `tags String[] @default([])`, `learningOutcomes String[] @default([])`, `requirements String[] @default([])`, `targetAudience String[] @default([])` | Course detail/preview + admin management.                                                                                          | Low–Med (new columns w/ defaults; backfill status PUBLISHED).       |
| NEW `Enrollment` (`id`, `userId`, `courseId`, `status`, `enrolledAt`, `source`, `@@unique([userId,courseId])`, index on courseId) — **optional, recommended**                                                                                                                                                                                                                           | Single enrollment check point; explicit record; audit. Backfill from `Payment.status='VERIFIED'` + existing `CourseProgress` rows. | Med (backfill must be idempotent; see §16 for lighter alternative). |
| `Topic.isPreview Boolean @default(false)`, `Topic.duration Int?`                                                                                                                                                                                                                                                                                                                        | Public preview model.                                                                                                              | Low.                                                                |
| `QuizQuestion.explanation String?`                                                                                                                                                                                                                                                                                                                                                      | Content audit requirement.                                                                                                         | Low.                                                                |
| NEW `Assignment` definition (`courseId`, `moduleId?`, `title`, `description`, `weekNumber/order`, `submissionType`, `requiredForCompletion`)                                                                                                                                                                                                                                            | Admin-authored deliverables; kills `weekNum*5`.                                                                                    | Low.                                                                |
| `Project.courseId` + `Project.requiredModuleCount?` (repurpose legacy model)                                                                                                                                                                                                                                                                                                            | Data-driven final-project gate.                                                                                                    | Low; legacy rows unused.                                            |
| `Payment.transactionId` actually written                                                                                                                                                                                                                                                                                                                                                | UPI replay prevention.                                                                                                             | Low (additive write; unique already present).                       |
| Indexes: `Course(status,isPublished,featured,categoryId)`, `Category(parentId,sortOrder)`, `Topic(moduleId, isPreview)`, `Enrollment(userId,courseId)`                                                                                                                                                                                                                                  | Query perf at scale.                                                                                                               | None.                                                               |

**Existing-data compatibility:** all existing courses/records/payments/certs untouched. Backfill runs: create 9 categories → assign 9 courses → `slug = id` → `status='PUBLISHED'` → (optional) Enrollment from VERIFIED payments. **Local dev DB:** apply via targeted psql / `prisma db push` (NEVER `migrate deploy` locally). **Prod:** committed additive migration applied by container-start `migrate deploy`. Backup DB first (`backup_db.sh`).

---

## 16. ENROLLMENT & ACCESS CONTROL

**Design:** the backend is the gate — no reliance on frontend state.

- Add `requireEnrollment(courseId)` middleware: allows `ADMIN`, allows `user` with `Enrollment.status='ACTIVE'` (or, under the lighter alternative, `Payment.status='VERIFIED'`), else 403. Reuse the exact pattern already proven at `forum.ts:146–154` and `certificateService.ts:94–106`.
- **Gated (currently open — fix):** `GET /courses/:courseId/module/:week` (full lesson text/code), `GET /quiz/questions/...` (both), `POST /quiz/submit`, challenge GET/run/complete, assignment/project submit + peer solutions. (Forum posting already gated.)
- **Public (no login):** `GET /courses`, `GET /courses/:slug` (detail: syllabus outline, outcomes, price, preview topics only — **no premium `text`/`code`/quiz bank**), `GET /categories`.
- **Preview rule:** `Topic.isPreview` topics are visible on the public detail page; everything else is premium. `GET /courses/:slug` must never include quiz `correctAnswer` or full topic bodies for non-enrolled users (server-side strip, same as today's student endpoint already strips `correctAnswer`).
- **Admins bypass gates** (today's convention).
- **Enrollment model decision:** recommended — explicit `Enrollment` table (backfilled), single check, auditable, survives even if a payment row is ever adjusted. Lighter alternative — keep implicit (VERIFIED payment) and just centralize the check in middleware. **Choose in Open Questions.**

---

## 17. PROGRESS & QUIZ INTEGRITY

The audit's two P0 exploits are fixed by server-side validation (this is the plan's highest-priority engineering):

1. **Scoring denominator exploit** (`quizService.submitQuiz`): the server grades only `questions` the client submitted. **Fix:** fetch questions by `id IN (submittedIds)` **AND `moduleId` (and `topicId` when claimed)** bound to the claimed course; require `answers.length === expectedCount` (the module's real question count, or the server-side sample size); `totalQuestions = expectedCount`, not `submittedCount`. Pass threshold from `businessRules.passingScoreThreshold` (default 60). **Any mismatch → 400.**
2. **Progress identity exploit:** question fetch currently has no course/module/topic filter, so a client can claim any course/week/topic while submitting question IDs from anywhere. **Fix:** server resolves the claimed module by `{courseId, week}` (or topic → its module → its course), verifies every submitted question ID belongs to that module/topic, and writes progress only for the *resolved* ownership chain — never from body-supplied IDs alone.
3. **Ownership chain enforced at every write:** Enrollment(course) → Module(course) → Topic(module) → Question(module/topic). Validate course ownership, module ownership, topic ownership, question ownership, expected question set, quiz rules, passing score, completion conditions.
4. **Completion conditions derive from data:** `required = module.count({courseId})`; `CourseProgress.completed` set only when all modules passed — kills the `/20` hardcodes.
5. **`challengeService` stops setting `quizPassed` without a quiz** (`challengeService.ts:151`); challenges mark challenge-progress only.
6. **Don't echo `correctAnswer` in the submit `breakdown`** to submitters (currently leaked at `quizService.ts:59`); reveal only on a completed/retake-review flow if desired.
7. **Wrap `submitQuiz` in a transaction** (10+ queries, currently non-transactional) and make the XP award atomic (the daily-challenge path at `practiceService.ts:108` already shows the atomic pattern).

---

## 18. CERTIFICATE INTEGRATION

- **No redesign, no UI changes.** `certificateService.generateCertificate` already derives `requiredWeeks = module.count(courseId)` and requires a VERIFIED payment — it is already dynamic on module count.
- **New:** `course.certificateAvailable` gate — if false, certificate route returns a clean 403 "this course does not offer a certificate". Admin-issued certs (Direct Certificate Access Console) remain available to admins regardless (today's admin bypass).
- **Verify** after changes: the `GET /certificate/verify/:id` flow, `PENDING`/`VERIFIED` behavior, and rate limit must be byte-identical (covered by existing prod smoke + m-series harness).
- **New courses** get certificates automatically once completion + VERIFIED payment + `certificateAvailable` all hold — no per-course certificate code.

---

## 19. SECURITY RISKS (relevant existing issues → fix plan)

| Risk                                                                                      | Where                                           | Fix                                                              |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| Premium lesson + quiz bank readable by any logged-in user                                 | `course.ts:35`, `quiz.ts:13,30`, `challenge.ts` | `requireEnrollment` middleware (§16).                            |
| Quiz score/progress forgeable (denominator + identity)                                    | `quizService.ts:29-282`                         | §17 integrity fixes.                                             |
| Correct answers leaked in submit breakdown                                                | `quizService.ts:59`                             | Strip from response (§17).                                       |
| `Payment.transactionId` never written → UPI replay                                        | `paymentService`                                | Write from UPI reference; enforce unique.                        |
| `/payments/verify` no state-machine guard; `create-order` not idempotent                  | `paymentService`                                | Add guards.                                                      |
| Reset token returned in API body; `/auth/me` leaks caller's own reset/verification tokens | `authService`, `/auth/me`                       | (Pre-existing P0 — include in Phase 9 sweep, low effort.)        |
| Rate limiter in-memory + proxy IP miskeying                                               | `rateLimiter.ts`                                | Trust-proxy + store options (Phase 9).                           |
| No CSP/security headers                                                                   | backend                                         | Helmet/CSP (Phase 9); reduces `localStorage` token XSS exposure. |
| Stored XSS in forum; unvalidated assignment/project `fileUrl` served to peers             | `forum.ts`, assignment/project routes           | Sanitize server-side; validate URL scheme/host (Phase 9).        |
| Admin can promote role with no confirm/audit                                              | `AdminDashboard.tsx`                            | Confirm dialog + audit log (Phase 4).                            |
| Course data/pricing duplicated in frontend                                                | §3/§11                                          | API-driven consolidation (§13).                                  |

---

## 20. MIGRATION STRATEGY

1. **Nothing destructive.** All changes additive columns/models; existing rows backfilled with identity-safe values (`slug = id`, `status = PUBLISHED`, categories created fresh).
2. **Compatibility first:** old URLs (`/course/C`) keep resolving (redirect to slug), existing `/quiz/:courseId/:week/:topicId` paths unchanged, `GET /courses` response shape kept superset-compatible so old frontend code keeps working during the transition.
3. **Rollout in slices:** (a) schema+migrations additive → (b) backend gates + integrity (no UI change) → (c) new discovery/detail pages served behind routes, old routes preserved → (d) frontend dedup + pricing SOOT → (e) admin catalog mgmt → (f) content.
4. **Deploy** via existing `wrap_and_deploy.sh` (backs up DB first), on GitHub `master`, container-start `migrate deploy` applies migrations. Local DB via psql/db-push.
5. **Certificate backend and UI untouched** throughout (hard no-touch).

---

## 21. IMPLEMENTATION PHASES

Your phase list is sound; two reorderings are **strongly recommended** because today's backend ships open premium content and forgeable completions — secure the platform *before* scaling it:

| Phase  | Scope                                       | Notes                                                                                    |
| ------ | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **0**  | Audit + architecture                        | ✅ this report                                                                           |
| **1**  | Course/category **data architecture**       | Models, backfills, seeds for categories (no live catalog yet)                            |
| **2**  | **Database/schema changes**                 | §15, additive migration; local psql first, prod via deploy                               |
| **3**  | **Access control (moved earlier)**          | `requireEnrollment` middleware + gate lesson/quiz/challenge/assignment/project endpoints |
| **4**  | **Quiz/progress integrity (moved earlier)** | §17 fixes — the P0s                                                                      |
| **5**  | Backend catalog APIs                        | `GET /categories`, filtered `GET /courses`, `GET /courses/:slug`, `/payments/checkout`   |
| **6**  | Admin course management                     | Categories section + extended course CMS + fix blank-answer bug                          |
| **7**  | Public course discovery                     | `/courses` + `/courses/:categorySlug`                                                    |
| **8**  | Course detail/preview                       | `/course/:slug` public page, preview topics, server price                                |
| **9**  | Learning experience                         | dynamic module counts, dashboard dedup, `Week x/4` fix                                   |
| **10** | Certificate integration                     | `certificateAvailable` gate only (verify unchanged)                                      |
| **11** | Initial course catalog                      | 9 re-categorized + approved new courses (prices confirmed)                               |
| **12** | Detailed educational content                | New-course content + fix CADD Civil identity                                             |
| **13** | Testing + QA                                | §23                                                                                      |
| **14** | Production rollout                          | wrap_and_deploy, prod smoke, M-series report                                             |

(If you prefer your original order, Phase 3–4 can sit at 7–9 — but shipping new paid categories before gating them is not recommended.)

---

## 22. FILE IMPACT MAP

**FILES TO CREATE**
- Backend: `prisma/migrations/<ts>_course_platform/<migration>`, `src/routes/category.ts`, `src/services/categoryService.ts`, `src/middleware/enrollment.ts`, `src/routes/checkout.ts` (or fold into payment), `src/services/catalogService.ts`, Assignment/Project definition routes+services, new content seed helper `prisma/content/categories.ts`.
- Frontend: `src/pages/Courses.tsx`, `src/pages/CategoryPage.tsx`, `src/components/molecules/CourseCardV2.tsx` (or refactor), `src/components/molecules/CategoryChip.tsx`, `src/components/molecules/CourseGrid.tsx`, `src/components/organisms/CourseDetailPreview.tsx`, `src/components/organisms/SearchSortBar.tsx`, `src/hooks/useCategories.ts`, `src/hooks/useCourseCatalog.ts`, `src/hooks/useCourseBySlug.ts`, `src/hooks/useEnrollment.ts`, `src/components/organisms/admin/AdminCategoryManager.tsx`, `AdminCourseForm.tsx`.

**FILES TO MODIFY**
- Backend: `backend/prisma/schema.prisma`, `backend/src/index.ts` (mount new routers), `backend/src/routes/course.ts`, `backend/src/services/courseService.ts`, `backend/src/routes/quiz.ts`, `backend/src/services/quizService.ts`, `backend/src/routes/challenge.ts`, `backend/src/services/challengeService.ts`, `backend/src/routes/assignment.ts`, `backend/src/routes/project.ts`, `backend/src/services/paymentService.ts`, `backend/src/lib/businessRules.ts`, `backend/src/middleware/rateLimiter.ts` (Phase 9), `backend/src/middleware/validation.ts`.
- Frontend: `frontend/src/App.tsx` (routes), `frontend/src/api/index.ts`, `frontend/src/pages/Home.tsx` (dedup), `frontend/src/pages/Dashboard.tsx` (dedup), `frontend/src/pages/CourseDetail.tsx` (module-count + public/premium split), `frontend/src/pages/PayPage.tsx` (server price), `frontend/src/pages/AdminDashboard.tsx` (CMS extend), `frontend/src/components/molecules/CourseCard.tsx` (denominator), `frontend/src/components/organisms/EnrollmentPanel.tsx` (price), `frontend/src/config/courses.ts` (deprecate→API).

**FILES TO REVIEW (read, likely no change)**
- `backend/src/routes/forum.ts` (reuse gate pattern), `backend/src/services/certificateService.ts` (verify eligibility only), `backend/src/routes/certificate.ts`, `frontend/src/pages/Certificate.tsx`, `frontend/src/pages/Verify.tsx`, `frontend/src/pages/About.tsx` (copy), `frontend/src/pages/ChallengeListPage.tsx`, `frontend/src/pages/PracticeArena.tsx`.

**FILES TO LEAVE UNTOUCHED**
- Certificate backend gating, `Certificate.tsx`, `Verify.tsx`, payment ownership/verify core, `docker-compose*.yml`, `Dockerfile*`, `nginx/`, `wrap_and_deploy.sh`, `deploy.sh`, `backup_db.sh`, `setup-server.sh`, `.env`, deployment/CI configs, co-tenant infra. *(Each proposed modification above has a stated reason — see §15/§16/§17.)*

---

## 23. TESTING PLAN

- **Backend:** NEW unit tests (jest config exists but zero tests today) — quiz integrity (denominator, ownership, count enforcement), enrollment middleware (403/200 paths), catalog query filters/pagination, assignment/project dynamic gates, checkout pricing, certificate eligibility.
- **Database:** additive migration applies on a backup DB; backfill idempotency; local psql + `prisma migrate diff` clean (schema-drift skill).
- **Payment:** create-order idempotency, verify state-machine, transactionId uniqueness, coupon from Settings, no-auto-verify preserved.
- **Enrollment/access:** non-enrolled → 403 on lesson/quiz/challenge/assignment/project; preview topics visible; admin bypass.
- **Progress/quiz:** forge attempts (wrong IDs, subset, cross-course) → 400; valid completion advances progress correctly for 5/8/10/15/20-module courses.
- **Certificate:** unchanged verify flow regression; `certificateAvailable=false` → 403; admin issuance intact.
- **Admin:** category CRUD, course field save, reorder, publish/draft, blank-answer bug fixed.
- **Frontend:** component tests for CourseCardV2/CategoryChip/CourseDetailPreview; E2E via the existing **M-series Playwright harness pattern** (write-free, DB-snapshot proof, responsive 375/768/1024/1440, a11y, prod-smoke variant).
- **Responsive/a11y:** mobile/tablet/desktop; keyboard nav, focus states, ARIA on new controls.

---

## 24. ROLLBACK PLAN

- **DB:** additive-only means rollback = `DROP` the new columns/models in a reverse migration (no existing data loss); DB backup taken before deploy (`backup_db.sh`) for a full restore if ever needed.
- **App:** every change ships incrementally; the risky backends (gates/integrity) can be reverted by redeploying the prior `master` commit — old routes/URLs still resolve.
- **Feature-level kill-switches:** new `/courses`/category routes are additive; if a defect slips, the old `Home` catalog still renders (it stays intact until the dedup phase) and old `/course/:id` stays live.
- **Certificate/payment:** untouched surfaces — no rollback surface.

---

## 25. OPEN QUESTIONS (require product-owner confirmation)

1. **Pricing:** No approved price list exists in the project (only ₹699 flat today; your example's ₹599 is not in any doc/code). What is the approved price standard for new courses?
2. **Access model:** explicit `Enrollment` table (recommended) vs keep implicit "VERIFIED payment" check centralized in middleware?
3. **Preview policy:** allow per-topic public previews (`isPreview`), or fully hide all lesson content until enrolled?
4. **Category shape:** flat 9 top-level categories (recommended) vs the nested Training→… tree from your spec?
5. **Implementation order:** confirm front-loading access-control + integrity (Phases 3–4) before catalog expansion?
6. **MVP new courses:** which 2–4 new courses to approve (Computer Fundamentals, MS Excel, HTML & CSS, Basic Electronics — my recommendation)?
7. **Bundles:** is "MS Office Complete" a single bundled course (recommended) or a real multi-course bundle later?
8. **CADD Civil:** re-scope/rebrand the civil track (content audit says identity failure) before or after the platform expansion?
9. **ITI:** confirm EduNexus certificate only (no government accreditation claims) for ITI/trade courses.
10. **WebDesign re-map:** OK to move WebDesign from "Programming" to "Web Development"?

---

**Status: PLANNING ONLY — no files modified, no code written, nothing deployed.**

This is the complete plan. Per your instruction, I'm waiting for your approval before any implementation. The four decisions that most shape the architecture are #1 (pricing), #2 (enrollment model), #3 (preview policy), and #5 (phase order) — let me know those whenever you're ready, or approve the plan as-is and I'll take the recommended defaults.
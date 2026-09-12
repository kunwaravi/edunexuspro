# EduNexus Pro — Universal Course Architecture & Content Authoring Standard

> **Version:** 1.0 (2026-08-16) · **Status:** Planning / Architecture — implementation-ready, NOT yet implemented
> **Source of truth:** live code in `/home/abhi/repo/edunexuspro` (frontend, backend, `backend/prisma/schema.prisma`, `backend/prisma/content/`, reseed scripts) + `docs/` audits. No code, schema, database, seed, or content was modified in producing this document.
> **Evidence labels:** ✅ CONFIRMED (directly supported by existing source/code) · 🔶 PROPOSED (recommended architecture based on analysis) · ⚪ UNKNOWN (cannot be determined without additional information)
> **Companion:** `docs/course-platform-expansion-plan.md` (Task-1 platform expansion plan). This document is the deeper *content/course-standard* layer; where both apply, decisions here are consistent with that plan.

---

## 1. Executive Summary

EduNexus Pro is a working, production ed-tech platform with a **single shared content spine**: `Course → Module(week) → Topic(lesson)` with quiz questions attached to topics/modules, three-level progress tracking, manual-UPI purchase with admin verification, and admin-verified QR certificates. Today it ships **9 courses** (C, C++, Python, SQL, WebDesign, IoT, Embedded, CADDED Mech, CADDED Civil) whose deep hand-written content lives in flat files under `backend/prisma/content/` and is loaded by one-off `reseed_<course>_full.ts` scripts.

This standard defines **one universal architecture** that all future courses — programming, office skills, web, systems/technology, and ITI/vocational — will share, without separate course systems. Its core decisions:

- **Catalog** = flat top-level **categories** (with optional nested subcategories), **not** a forced nested "Training → …" tree.
- **Course** = the canonical entity; **Module** = the canonical structural unit (the DB `week` column stays as the ordering integer; "Week" becomes an optional display label); **Topic** = the canonical lesson.
- **Assessment** = **one** quiz system (`QuizQuestion` at topic- and module-level) plus a final assessment, an assignment layer, a project/capstone layer, and the existing challenge/practice layers — all **optional per course**.
- **Completion** is strictly separated from **progress** and from **certificate eligibility**; all counts derive from live module data, killing today's hardcoded `/20` and `Week x/4` assumptions.
- **Price** lives only on `Course.price`; no market price / crossed-out / fake-discount concepts are introduced. New-course prices remain **PRICE TO BE CONFIRMED** (the only documented price in the project is the flat ₹699 for existing courses).
- **Content authoring** standardizes a minimal, additive per-course package, fixes the fragile "topic quiz map keyed by exact topic title" coupling, and keeps everything backward-compatible with C/C++ and the existing catalog.

Nothing here requires replacing working systems; every change is additive and migration-friendly.

---

## 2. Current Architecture Findings

### 2.1 Platform
| Area | Finding |
|---|---|
| Frontend | ✅ React 19 + TS + Vite + Tailwind v4 + react-router-dom 7; Context-only state (Auth/UI/Theme); 18 live pages. Routes: `/`, `/course/:id`, `/quiz/:courseId/:week[/:topicId]`, `/dashboard`, `/pay/:courseId`, `/certificate`, `/verify`, `/admin`, `/practice/arena`, `/course/:id/challenges`, `/challenges/:id`. |
| Backend | ✅ Express 5 + Prisma 6; 76 endpoints / 12 routers under `/api/*`; JWT (1-day, Bearer + `localStorage`); in-memory rate limiter; zod on key routes. |
| Database | ✅ PostgreSQL, 9 additive migrations (latest `20260812120000_add_share_solution`). **No enums** (status/role are Strings). **No Category, no Enrollment, no Assignment-definition, no Lesson model.** |
| Deploy | ✅ Docker Compose + nginx; `wrap_and_deploy.sh` → `srv1616850.hstgr.cloud`; live = GitHub `master` (currently `08aa995`); container-start `prisma migrate deploy`. Local dev DB not migration-managed (psql only). |

### 2.2 Course model (Prisma `schema.prisma`)
- ✅ `Course { id String @id /* "C", "C++", … */ · title · description · price Int @default(699) · isPublished · createdAt/updatedAt }`
- ✅ `Module { id · courseId · week Int /* unique per course */ · title · description }` — **`week` is the ordering int and display "week".**
- ✅ `Topic { id · moduleId · title · text (markdown lesson body) · code? · note? · order }` — **Topic IS the lesson.**
- ✅ `QuizQuestion { id · moduleId · topicId? · text · options String[] · correctAnswer }`
- ✅ Progress: `CourseProgress` (`@@unique[userId,courseId]`, `weekCompleted`, `progress`, `completed`), `ModuleProgress` (`@@unique[userId,moduleId]`, `completed`, `quizPassed`, `quizScore`), `TopicProgress` (`@@unique[userId,topicId]`, `completed`, `quizPassed`, `quizScore`).
- ✅ `Payment { id · userId · courseId · transactionId? @unique · amount · status INITIATED→PENDING→VERIFIED|FAILED · reference? }` — **de-facto enrollment: "enrolled" == `status === 'VERIFIED'`. No `Enrollment` table.**
- ✅ `CertificateRecord { id uuid · userId · courseId · verificationCode @unique · verificationStatus PENDING|VERIFIED · verifiedAt? }`
- ✅ `AssignmentSubmission`, `ProjectSubmission` (submission side only — **no assignment/project definition models**).
- ✅ `Project { title · category · difficulty · description · documentation · codeSnippet? · schematicUrl? }` — **legacy, no relations, unused.**
- ✅ `Challenge / ChallengeProgress` (coding challenges), `PracticeQuestion / PracticeAttempt` (practice arena), `Discussion / ForumComment`, `Setting`, `ContactMessage`.
- ⚪ `FinalExamQuestion { courseId · text · options · correctAnswer }` — model exists but is **inert**: `seed.ts:949` "The FinalExamQuestion table is left inert; the interactive-challenge [engine replaced it]". No code creates or serves final-exam rows.

### 2.3 Content files & loaders (`backend/prisma/content/`, `backend/prisma/`)
- ✅ **Pattern (e.g. `c.ts`):** `CTopic { title · text · code · note }`, `CQuiz { text · options[4] · correctAnswer }`, `CSection { week · title · description · topics[] · quizzes[] }`, exported as `cSections`.
- ✅ **Per-topic quiz file (e.g. `c_topic_quizzes.ts`):** a map keyed by the **exact topic title** → quiz list. ⚠️ Fragile: renaming a topic silently drops its quiz.
- ✅ **Reseed script (e.g. `reseed_c_full.ts`):** find-or-create course (id `"C"`, price 699) → find-or-create modules by `courseId_week` (preserving ids so admin edits + Challenge links survive) → **delete + recreate leaf nodes** (topics + quiz questions) → attach per-topic quizzes + chapter quizzes. Idempotent. Comment claims a "real 15-question final exam" but **no final-exam rows are created** (see 2.2 ⚪).
- ✅ C course now: 20 modules, 65 topics, ~260 topic quizzes, 158 chapter quizzes (per docs audits).
- ✅ Loader coupling: the frontend **topic-lock flow requires every topic to have its own quiz** — missing per-topic quiz 404s "Start Topic Quiz" and locks all later topics.

### 2.4 Access / integrity (critical findings, from `docs/backend-audit.md`, verified in code)
- ✅ Premium lesson text/code (`GET /courses/:courseId/module/:week`), quiz banks, quiz submit, challenges, assignments/projects are **auth-only, NOT enrollment-gated**. Only forum *posting* and certificate *generation* check `VERIFIED` payment.
- ✅ `submitQuiz` grades only the **client-submitted subset** (`totalQuestions = questions.length`), no course/module/topic ownership filter, no count check → a single correct answer yields `score=100, passed=true`; progress can be forged for any claimed course/week/topic.
- ✅ Hardcoded counts: `project.ts` blocks final project until 20 modules; `assignment.ts` maps `weekNum*5`; `quizService.ts` falls back to 20; frontend shows `/20`, `Week x/4`, "all 4 weeks". `src/lib/businessRules.ts` is dead code.

### 2.5 Doc conflicts (reported, not silently resolved)
1. **CADDED module count 5 vs 20** — baseline says "CADDED 5", reseeds build 20, audits disagree. ⚪ Live DB is authoritative; never assume a fixed count.
2. **Live branch master vs main** — deployment memory + git confirm **`master`** (content audit saying `main` is wrong; CI gating on `main` is stale).
3. **Endpoint count 76 vs ~58** — 76 current (counting difference).
4. **Catalog quality 72.9 vs 60.4** — the deeper 60.4 rubric is adopted; CADD Civil is the weakest (31, "Major Revamp").
5. **CADDED (DB ids) vs CADD (file slugs)** — DB ids authoritative.

---

## 3. Architectural Principles

1. ✅ **Reuse the existing spine.** `Course → Module → Topic → QuizQuestion` already works end-to-end; extend, don't replace.
2. 🔶 **One hierarchy for every course type.** No parallel content systems for programming vs office vs ITI.
3. 🔶 **Additive-only migrations.** New columns/models with defaults; backfills identity-safe. Existing C/C++ records, payments, progress, certificates untouched.
4. 🔶 **Database is the single source of truth.** Course/category/pricing data consumed via API; frontend static course arrays removed.
5. 🔶 **Backend enforces access & completion.** No frontend-state gating; server validates ownership chains.
6. 🔶 **Counts derive from data.** Module counts, completion conditions, denominators never hardcoded.
7. 🔶 **Optionality is presence-driven.** A course has assignments/projects/challenges/final assessment *only if it defines them*; the platform renders what exists.
8. 🔶 **YAGNI.** No new entities, fields, or assessment systems without a concrete requirement.
9. ✅ **Backward compatibility.** Old URLs/routes keep working; `Course.id` (String PK) stays the stable identity.
10. 🔶 **Certificate & payment surfaces are inviolable** unless the product owner explicitly approves a change.

---

## 4. Catalog Taxonomy

### 4.1 The four distinct concepts (explicit definitions)
| Concept | Definition |
|---|---|
| **Catalog Category** | A public grouping node for courses (slug, name, description, parent, sort order, visibility). A filter/path, NOT a content entity. |
| **Course** | A purchasable learning program with price, syllabus, assessments, and (optionally) a certificate. |
| **Module** | The canonical structural unit inside a course (a coherent block of lessons). |
| **Topic** | The canonical lesson — one unit of learning with content, optional quiz, optional practice. |

### 4.2 Recommended taxonomy
`docs/course-platform-expansion-plan.md` already evaluates the proposed nested tree (`ALL COURSES → TRAINING → …`) and recommends **flat top-level categories**. This standard adopts that decision:

```
ALL COURSES  (/courses)   ← union of all categories; category is a filter, not a separate tree root
│
├── Computer & Office        (Computer Fundamentals, MS Word, MS Excel, MS PowerPoint, …)
├── Programming              (C, C++, Python, Java, JavaScript, DSA, …)
├── Web Development          (HTML & CSS, React, Node.js, Full Stack, …)
├── AI & Future Skills       (AI Fundamentals, Generative AI, Prompt Engineering, …)   [future]
├── IoT                      (IoT Fundamentals, Arduino, ESP32, …)
├── Embedded Systems         (Embedded C, Microcontrollers, …)
├── Electronics              (Basic Electronics, Digital Electronics, PCB, …)
├── CAD & Design             (AutoCAD, 2D/3D CAD, …)
└── ITI & Trade Training     (subcategory per trade: Electrician, Fitter, COPA, Welder,
                               Electronics Mechanic, Draughtsman, …)
```

- 🔶 **Why flat:** matches the discovery model ("All Courses + category navigation"), keeps URLs short (`/courses/programming`, `/courses/iti/electrician`), avoids a 3-level mobile nav, and needs only one `Category` table.
- 🔶 **Subcategories:** only where they earn their place — **ITI trades** (each trade is a subcategory that can hold multiple programs) and optionally within Computer & Office later. General courses do not need a subcategory level in MVP.
- ✅ **Existing 9 courses re-map:** C/C++/Python/SQL → Programming; WebDesign → Web Development (correction: currently filed under "Programming" in `config/courses.ts`); IoT → IoT; Embedded → Embedded Systems; CADDED Mech & Civil → CAD & Design.

---

## 5. Universal Course Hierarchy

```
CATEGORY  (optional SUB-CATEGORY)
  └── COURSE            Course, price, syllabus outline, assessments config
        └── MODULE      canonical unit (DB: Module.week = ordering int)
              ├── TOPIC (lesson)         → optional Topic Quiz  (QuizQuestion, topicId set)
              ├── Topic Quiz              → per-lesson assessment
              └── Module / Chapter Quiz   → QuizQuestion, moduleId set (no topicId)
        └── ASSIGNMENT (optional)        → AssignmentSubmission
  └── FINAL ASSESSMENT (optional)        → FinalExamQuestion (revive) — course-level
  └── PROJECT / CAPSTONE (optional)      → ProjectSubmission
  └── CHALLENGES (optional)              → Challenge / ChallengeProgress (existing)
  └── PRACTICE (optional)                → PracticeQuestion / PracticeAttempt (existing)
```

- ✅ **Confirmed by existing code.** The hierarchy below `Course` is exactly what ships today.
- 🔶 **Assessment/practical layers are optional presence-driven additions**, not new parallel content systems.

---

## 6. Course Entity Standard

Per-field verdict against the current `Course` model (`id`, `title`, `description`, `price`, `isPublished`, timestamps):

| Field | Verdict | Reason |
|---|---|---|
| `id` | ✅ EXISTING (keep) | String PK ("C"), referenced by payments/progress/certs/URLs. Do not migrate to numeric. |
| `slug` | 🔶 PROPOSED (`@unique`, backfill = existing id) | Stable public URL (`/course/c`); id stays as internal identity. |
| `title` | ✅ EXISTING | |
| `shortTitle` | 🔶 PROPOSED (nullable) | Course card / header. |
| `subtitle` | 🔶 PROPOSED (nullable) | Hero tagline. (May fold into `shortDescription`.) |
| `description` | ✅ EXISTING | |
| `shortDescription` | 🔶 PROPOSED (nullable) | Course card. |
| `categoryId` | 🔶 PROPOSED (FK → Category, backfill) | Taxonomy link. |
| `subcategoryId` | 🔶 PROPOSED (nullable FK → Category) | ITI trades / optional nesting. |
| `courseType` | 🔶 PROPOSED (nullable String, informational) | See §7 — metadata, not behavior. |
| `difficulty` / `level` | 🔶 PROPOSED (nullable String) | `Beginner/Intermediate/Advanced`. |
| `duration` | 🔶 PROPOSED (nullable String or Int hours) | Display only; never used for gates. |
| `language` | 🔶 PROPOSED (nullable String, default "English") | Informational. |
| `instructor` | 🔶 PROPOSED (nullable String) | Display only (no instructor account model exists). |
| `thumbnail` / `banner` | 🔶 PROPOSED (nullable URL strings) | Stored URL; images hosted separately. |
| `price` | ✅ EXISTING (authoritative) | `Int` on Course. Server recomputes from this. |
| `originalPrice` / `displayPrice` / MRP | ⛔ NOT NEEDED | Existing architecture has no market-price concept; pricing rule forbids crossed-out/fake discounts. |
| `enrollmentStatus` | 🔶 PROPOSED — as **derived**, not stored | `Enrollment.status` (see §17); never a Course column. |
| `publicationStatus` | 🔶 PROPOSED (`status` String, `DRAFT\|PUBLISHED\|ARCHIVED`, backfill `PUBLISHED`) | Publish control; kept additive beside existing `isPublished`. |
| `certificateAvailable` | 🔶 PROPOSED (`Boolean @default(true)`) | Certificate eligibility gate (§16). |
| `prerequisites` / `requirements` | 🔶 PROPOSED (`String[]`) | Detail page. |
| `learningOutcomes` | 🔶 PROPOSED (`String[]`) | "What You'll Learn". |
| `targetAudience` | 🔶 PROPOSED (`String[]`) | "Who This Course Is For". |
| `skillsGained` | 🔶 PROPOSED (`String[]`) | May reuse `tags`. |
| `tags` | 🔶 PROPOSED (`String[]`) | Search/filter/future. |
| `featured` | 🔶 PROPOSED (`Boolean @default(false)`) | Home / All-Courses highlight. |
| `moduleCount` | ⛔ NOT NEEDED as stored field | Derive from `module.count(courseId)` — stored copies drift. |
| `rating` / `studentCount` | ⛔ NOT NEEDED | No ratings/enrollment-count model exists; do not fabricate. |
| `createdAt/updatedAt` | ✅ EXISTING | |

**Rationale:** every proposed column is nullable or defaulted and additive; nothing existing changes meaning.

---

## 7. Course Types

🔶 **Decision: no behavior-driving course-type enum.** Proposed `courseType` is an informational String on `Course` (values like `COURSE`, `TRAINING`, `CERTIFICATION`, `ITI TRADE`, `SKILL COURSE`, `WORKSHOP` — free-form), because none of the candidate types genuinely fork structure/assessment/certificate/duration/pricing/completion in the existing architecture:

- **Structure** → same `Module → Topic` everywhere.
- **Assessment** → same optional `QuizQuestion` (+ final/assignment/project layers).
- **Certificate** → `certificateAvailable` flag, not type.
- **Duration / price / completion** → data, not type.

**What actually differentiates a course is its content presence:** whether it defines assignments, a project, challenges, a practice category, a final assessment, and its module count. Type is a **label**; `category` + `tags` + presence drive behavior. (If the product owner later wants genuinely different behavior per type — e.g. ITI "training" with a different completion rule — that becomes a per-course rule flag, not a new entity.)

---

## 8. Module Standard

- ✅ **Canonical internal concept = `Module`.** The existing `Module` model (`courseId`, `week Int` unique-per-course, `title`, `description`) is the unit.
- 🔶 **"Week" is an optional display concept.** The DB column stays `week` (rename = migration risk for zero benefit); the API/UI may render "Module 4", "Week 4", or "Trade Unit 4" via a per-course display label (from `Course.tags`/metadata), but the architecture never assumes a calendar week.
- 🔶 **Proposed additions:** `Module.learningOutcomes String[]` (optional), `Module.status` (optional, for draft modules). **No renumbering, no `order` duplicate** — `week` already orders modules; API maps `week → order`.
- 🔶 **Module counts are always derived** (`module.count({where:{courseId}})`); no `/20` anywhere.
- **Works for all course types:** Programming → "Module 1: Variables"; MS Excel → "Module 1: Spreadsheet Basics"; ITI Electrician → "Trade Unit 1: Electrical Safety" (display label only).

---

## 9. Lesson/Topic Standard

- ✅ **`Topic` IS the lesson.** Existing fields: `title`, `text` (markdown body), `code?`, `note?`, `order`, `moduleId`.
- 🔶 **Proposed fields:**
  | Field | Verdict | Why |
  |---|---|---|
  | `learningOutcomes String[]` | 🔶 PROPOSED (REQUIRED by authoring standard) | §10 objectives. |
  | `isPreview Boolean @default(false)` | 🔶 PROPOSED | Public preview model (content gating). |
  | `duration Int?` | 🔶 PROPOSED | Display. |
  | `contentType String?` | 🔶 PROPOSED | `reading\|code\|video\|practical\|diagram` — lets UI render per-type without forcing fields. |
  | `keyPoints`, `commonMistakes`, `practice`, `resources` | 🔶 PROPOSED — as one optional `meta Json?` | Rich authoring without a column explosion; absent for simple lessons. |
  | `examples` | ✅ COVERED | `code` + inline markdown in `text`. |
- **REQUIRED vs OPTIONAL vs COURSE-TYPE-SPECIFIC** (authoring standard, §21): title/content/note required; `code` required for programming & systems, optional elsewhere; `isPreview`/duration optional; `meta` optional. **Do not force every field on every course.**

---

## 10. Learning Objective Standard

- ✅ Gap confirmed by audits: *"No explicit per-topic objectives exist."*
- 🔶 **Three levels, all OPTIONAL in schema but REQUIRED by the authoring standard for new content:**
  - **Course-level:** `Course.learningOutcomes[]` — "By the end of this course…".
  - **Module-level:** `Module.learningOutcomes[]`.
  - **Lesson-level:** `Topic.learningOutcomes[]` — "By the end of this lesson, the learner should be able to: …".
- 🔶 **Format:** 3–6 measurable verbs ("explain", "implement", "compare", "debug"), no unmeasurable "understand X deeply".
- 🔶 **Assessment alignment (lightweight, not over-engineered):** each topic quiz should exercise ≥1 of its topic's outcomes; each chapter quiz ≥1 module outcome; the final assessment covers the course outcomes. Enforced by the **quality gate** (§22), not by new machinery. No auto-generated mapping required.

---

## 11. Practical Learning Standard

- ✅ Existing practical surfaces: `Challenge`/`ChallengeProgress` (coding), `PracticeQuestion`/`PracticeAttempt` (arena MCQs), `CodePlayground` + `POST /sandbox/run`, `AssignmentSubmission`, `ProjectSubmission`, Wokwi links in content.
- 🔶 **Universal practical layer — one canonical mapping, all OPTIONAL per course:**

```
COURSE
  ├── MODULE → TOPIC → Lesson-level practice   (Topic.meta.practice / PracticeQuestion arena)
  ├── MODULE → ASSIGNMENT                       (new Assignment definition → AssignmentSubmission)
  └── COURSE → PROJECT / CAPSTONE               (Project repurposed + requiredModuleCount → ProjectSubmission)
```

- 🔶 **Ownership of each element:** practice → lesson; assignment → module (or course); project/capstone → course. A course has each only if it defines it.
- 🔶 **New definitions needed (additive):** an `Assignment` model (courseId, moduleId?, title, description, weekNumber/order, submissionType, requiredForCompletion) and giving `Project` a `courseId` + `requiredModuleCount?` (repurpose the unused legacy table). Submissions reuse existing tables unchanged.

---

## 12. Assessment Standard

- ✅ **One quiz system.** `QuizQuestion` (moduleId, topicId?, text, options[4], correctAnswer) already supports topic (lesson) quizzes and module (chapter) quizzes. No second quiz system.
- 🔶 **Canonical assessment levels (presence-driven):**
  1. **Lesson/Topic Quiz** (existing; `topicId` set) — required for topic-lock flow; per-lesson mastery.
  2. **Module/Chapter Quiz** (existing; no `topicId`) — module mastery.
  3. **Final Assessment** (revive `FinalExamQuestion`, currently inert) — course mastery; optional per course.
  4. **Assignment** (new) — submitted, admin-reviewed.
  5. **Project/Capstone** (repurposed `Project`) — submitted, admin-reviewed.
  6. **Challenges / Practice Arena** (existing) — optional enrichment.
- 🔶 **Proposed field additions to `QuizQuestion`:** `explanation String?` (required for answers in review); `difficulty String?` optional. **NOT adding:** marks, attempt-rules, question-pool, randomization-config fields — rules live in `businessRules.ts` (revive it as the single rules home: `passingScoreThreshold` (currently hardcoded 60), sample sizes, attempt policy), and randomization is server-side shuffle (currently a no-op `slice(0,5)`).
- 🔶 **Final assessment decision:** revive `FinalExamQuestion` (model + intended seeding already exist) and serve it via one new endpoint + submission, instead of creating a new assessment entity. Marked P1 in the expansion plan; keep the model, add the route/service + per-course enablement.

---

## 13. Assignment Standard

- 🔶 **New `Assignment` definition model** (authoring side), because today only `AssignmentSubmission` exists and deliverables are hardcoded in the frontend (`weekNum * 5`).
  - Fields: `id`, `courseId` (FK), `moduleId?` (FK), `title`, `description`, `submissionType` (`file\|link\|text`), `weekNumber/order`, `requiredForCompletion Boolean @default(false)`, `createdAt`.
- 🔶 **Submission:** reuse `AssignmentSubmission` unchanged.
- 🔶 **Gates:** assignment unlock derives from actual module data (pass required module quizzes), not `weekNum*5`. Submission requires enrollment.
- **Works across types:** programming → code submission; MS Word → document file; ITI Electrician → practical task checklist + photo/PDF.

---

## 14. Project/Capstone Standard

- 🔶 **Repurpose the unused legacy `Project` table** as the course-capstone definition: add `courseId` (FK), `requiredModuleCount Int?`, `instructions` (reuse `documentation`), keep `title`/`description`/`difficulty`/`category`; `codeSnippet`/`schematicUrl` remain optional.
- 🔶 **Submission:** reuse `ProjectSubmission` unchanged (title, description, sourceCodeUrl, reportUrl, githubUrl, status PENDING/APPROVED/REJECTED, shareSolution).
- 🔶 **Gate:** `requiredModuleCount` from course data (default = all modules), fixing the hardcoded-20 bug (`project.ts:52`). Enrollment required.
- 🔶 **Optional per course** — a course without a capstone simply has no project tab (today's UI already conditionally renders project/assignment tabs).

---

## 15. Progress & Completion Standard

🔶 **Three deliberately separate concepts:**

| Concept | Definition | Stored where |
|---|---|---|
| **PROGRESS** | Continuous measure of how much content is consumed/quizzed (0–100, derived from modules done / total modules). | `CourseProgress.progress`, `weekCompleted` (derived). |
| **COMPLETION** | Boolean: every required element is done. | `CourseProgress.completed` (derived, server-computed). |
| **CERTIFICATE ELIGIBILITY** | Completion AND `Payment.status=VERIFIED` AND `certificateAvailable=true` (AND admin issuance verification). | Computed at issuance (`certificateService`). |

- 🔶 **Canonical completion policy (MVP):** `Course` is **completed** when:
  1. Every module's required topics are completed and each module's chapter (and per-topic) quizzes are passed — i.e., `ModuleProgress.quizPassed === true` for **all** modules (`module.count({courseId})`), AND
  2. If a final assessment is enabled → final assessment passed, AND
  3. If `requiredForCompletion` assignments/project exist → submitted and approved.
- ✅ The completion **count** must never be a hardcoded constant (fix `project.ts:52`, `assignment.ts:49`, `quizService.ts:35`, frontend `/20` and `Week x/4`).
- 🔶 **Integrity:** completion is only advanced server-side after validating the ownership chain (enrollment → module → topic → question) and the real question set (§12, expansion-plan §17). Frontend state is never trusted.

---

## 16. Certificate Standard

- ✅ **Keep the existing certificate system unchanged** (user-mandated no-touch UI: `Certificate.tsx`, `Verify.tsx`; backend gating already correct).
- 🔶 **Eligibility chain (canonical):**

```
Course → Enrollment → Learning Progress → Required Assessments → Completion
   → Certificate Eligibility (completion + VERIFIED payment + certificateAvailable)
   → CertificateRecord created (PENDING) → admin verifies → VERIFIED + verifiedAt
   → public verification endpoint returns full data for VERIFIED, no PII for PENDING
```

- 🔶 **Decision — course-level configurable + automatic + admin-issued:**
  - `course.certificateAvailable` decides whether a course *offers* a certificate (course-level config).
  - Generation is automatic (existing `GET /certificate/:courseId` behavior) once eligibility holds.
  - Issuance status is admin-controlled (`PENDING → VERIFIED`, existing issue-#101 flow).
  - Final assessment, if enabled, is part of the completion gate (§15).
- 🔶 **Only change:** `certificateService` honors `certificateAvailable` (clean 403 when false). No UI change.

---

## 17. Pricing & Enrollment Standard

### 17.1 Pricing
- ✅ **`Course.price Int` is the authoritative selling price.** Server recomputes order amounts from it (client `amount` already ignored).
- ⛔ **No market price / MRP / crossed-out / "was ₹X now ₹Y" / fake percentage discount** — the existing architecture has none, and the pricing rule forbids introducing them. Only the approved selling price is shown.
- 🔶 **Display source:** new `GET /payments/checkout/:courseId` returns `{courseId, title, price}`; `PayPage`/`EnrollmentPanel`/cards render server values only (removes `BASE_PRICE=699`, FE coupon map, "₹699" hardcode, AdminDashboard default-999 drift).
- 🔶 **Coupons:** move to DB `Setting` store (auditable, no-deploy changes); discount cap (50%) and no-auto-verify behavior stay.
- 🔶 **New-course pricing:** price is **PRICE TO BE CONFIRMED** — courses created `DRAFT`, published only with an approved price. (Existing 9 keep ₹699.)

### 17.2 Enrollment
- 🔶 **Separate *purchase* from *access*.** Introduce an `Enrollment` record (`id`, `userId`, `courseId`, `status ACTIVE|SUSPENDED|EXPIRED`, `enrolledAt`, `source`, `@@unique[userId,courseId]`) as the canonical "has access" check, **backfilled from `VERIFIED` payments + existing `CourseProgress`** (idempotent). This is additive; `Payment` remains the money/audit record.
- ✅ **Purchase flow unchanged:** Course card → detail → Enroll Now → login if needed → order → UPI → proof → admin verify → `Payment VERIFIED` → `Enrollment ACTIVE` → learning unlocked.
- 🔶 **Free courses:** supported later via `price=0` + immediate enrollment (MVP: keep the admin-verify flow for all orders). **Certificate fees:** ⛔ NOT NEEDED (no fee concept; access is included in purchase).

---

## 18. Course Card Standard

🔶 **Course card content (only what the backend can provide):**

```
[ Thumbnail / Banner ]
Course Title
Short description (shortDescription)
Category · Difficulty
Duration
Certificate indicator   (when certificateAvailable)
Price (server value)    ·  [ View Course ] / [ Enroll / Buy ]
```

- ⛔ **No fake statistics.** Rating/student count are NOT displayed — no ratings/enrollment-count model exists.
- ✅ **Component:** reuse `CourseCard` (molecules), parameterized by API data; delete hardcoded `Week x/4` denominator and per-course color metadata drift (drive colors/icons from a small API-synced presentation map).

---

## 19. Course Detail Architecture

🔶 **Canonical public detail page (`/course/:slug`) — architecture only:**

```
Breadcrumb (All Courses → Category → Course)
Hero      → thumbnail/banner, title, subtitle, difficulty, duration, module count (derived),
            category, price (server), [ Enroll Now ]  (→ /pay/:courseId)
Overview  → full description
What You'll Learn      → Course.learningOutcomes
Course Content         → syllabus preview: modules + topic titles (no premium bodies)
Requirements           → prerequisites / requirements
Who This Course Is For → targetAudience
Skills You'll Gain     → skillsGained / tags
Practical Work         → assignments / challenges / practice presence (counts)
Project / Capstone     → project presence + requirements
Certificate            → certificateAvailable + eligibility explanation
FAQ                     → optional (only if content exists)
```

- ✅ **Public vs premium:** non-enrolled users see syllabus outline + preview topics (`Topic.isPreview`) only; premium `text`/`code` and the quiz bank are stripped server-side. Enrolled users keep today's learning area (CourseDetail's existing 3-view state machine).
- ✅ **No UI redesign in this task** — this is the information architecture the (existing-design) page will render.

---

## 20. Learning Experience Architecture

- ✅ **Reuse existing learning UI** (`CourseDetail` syllabus/reader, `SyllabusManager`, `ProgressMap`, `Quiz`, `CodePlayground`, challenges).
- 🔶 **Universal elements:**
  - **Prev/Next lesson navigation** within a module (existing topic-reader prev/next).
  - **Progress indicator** — from `CourseProgress.progress`/derived module ratio (server-computed; fix the `/20` and `Week x/4` displays).
  - **Module completion** — topic quizzes passed → module unlocked (existing topic-lock flow).
  - **Quiz** — per-topic + per-chapter (existing).
  - **Assignment / Project tabs** — rendered only when the course defines them.
  - **Notes / resources** — optional, presence-driven (`Topic.meta`).
  - **Completion state** — "Course Completed" banner + certificate CTA when eligible.
- 🔶 **Optional elements:** challenges, practice arena link, resources, per-type content rendering (`Topic.contentType`).

---

## 21. Content Authoring Standard

🔶 **Minimum content package per new course.** REQUIRED = blocks that must exist; RECOMMENDED = strongly advised; OPTIONAL = course-type-specific.

### 21.1 Course package
| Block | Level |
|---|---|
| Course metadata (id/slug, title, shortTitle, description, shortDescription, categoryId, difficulty, duration, thumbnail/banner URL, price [approved], certificateAvailable) | REQUIRED |
| `learningOutcomes` (course-level, 3–6 measurable) | REQUIRED |
| `requirements` (prerequisites) | REQUIRED |
| `targetAudience` | REQUIRED |
| `tags` | RECOMMENDED |
| `courseType` label | OPTIONAL |

### 21.2 Module package
| Block | Level |
|---|---|
| title, description, week/order | REQUIRED |
| `learningOutcomes` (module-level, 2–4) | RECOMMENDED |

### 21.3 Lesson (Topic) package
| Block | Level |
|---|---|
| title | REQUIRED |
| `text` — substantive markdown teaching body (GfG-style depth) | REQUIRED |
| `learningOutcomes` ("By the end of this lesson…", 1–3) | REQUIRED |
| `note` — real-world / exam takeaway | REQUIRED |
| `code` + runnable example | REQUIRED for programming/systems; OPTIONAL otherwise |
| `isPreview` (1 preview topic per module max) | OPTIONAL |
| `contentType`, `duration` | OPTIONAL |
| keyPoints / commonMistakes / practice / resources (in `meta`) | OPTIONAL |
| Topic quiz (4 options, exactly 1 correct, tied to the topic) | REQUIRED (topic-lock flow) |

### 21.4 Quiz standard
| Block | Level |
|---|---|
| text, options[4], correctAnswer | REQUIRED |
| `explanation` (why the answer is correct) | RECOMMENDED |
| Code-trace / application questions per module | RECOMMENDED |
| Distinct questions — no near-duplicates (the seed.ts template-dedup problem) | REQUIRED |

### 21.5 Assignment / Project / Final Assessment
| Block | Level |
|---|---|
| Assignment: title, description, submissionType, module/weekNumber, requiredForCompletion | REQUIRED when course defines assignments |
| Project: title, description/instructions, requiredModuleCount, submission rubric | REQUIRED when course defines a capstone |
| Final assessment: 10–20 questions covering course outcomes, distinct per course | REQUIRED when course enables final assessment |

---

## 22. Course Quality Standard

🔶 **Severity levels (content):**
- **P0 — Critical:** incorrect answers/keys, unanswerable questions, content exposure or grading that mis-teaches, unsafe instructions (e.g. wrong struct-size, unanswerable SQL items, revoked services taught as current, identity-failure courses).
- **P1 — High:** structural gaps that block learners (no objectives, dead final exam, hardcoded-count gates, missing topic quizzes that lock topics).
- **P2 — Medium:** quality/depth issues (shallow topics, near-duplicate quizzes, no explanations, broken/unverifiable links).
- **P3 — Low:** polish (styling, minor copy, formatting).

🔶 **Reusable checklist (derived from the C/CAD/IoT audits):**
1. Technical accuracy (verified by an expert pass; P0 if wrong).
2. Lesson depth (GfG-style: explanation + example + note per topic).
3. Curriculum progression (module ordering, prerequisites within the course).
4. Learning objectives present at course/module/lesson levels (§10).
5. Practical learning (code/practice/assignment/project presence matching the course type).
6. Assessment alignment (quiz tests ≥1 objective; final covers course outcomes).
7. Quiz correctness (exactly one correct key, distinct questions, valid options).
8. Final assessment coverage + uniqueness.
9. Project quality (clear rubric, requiredModuleCount correct).
10. Certificate alignment (eligibility rules honored).
11. Industry relevance (current tools/services — no retired APIs taught as current).
12. Beginner experience (first module sets up environment; no assumptions).
13. Outdated content (version attribution, library/framework versions).
14. Duplicate content (zero cross-course / within-course duplicate questions; no near-template repeats).

---

## 23. Repository/Data Organization

### 23.1 CURRENT STRUCTURE (✅ confirmed)
```
backend/prisma/
  content/
    <course>.ts              ← CSection/CTopic/CQuiz inline (e.g. c.ts, cpp.ts, …)
    <course>_topic_quizzes.ts ← map keyed by EXACT topic title → quiz list
  reseed_<course>_full.ts     ← one importer per course (delete+recreate leaf nodes)
  seed.ts                     ← original template-based seeding (mostly superseded)
```
**Pain points:** topic-quiz map keyed by title (rename → silent quiz loss); per-course bespoke reseed scripts; final exam claimed but never created; metadata (price etc.) embedded in scripts.

### 23.2 PROPOSED STRUCTURE (🔶 — least disruptive, additive)
```
backend/prisma/content/
  <course>_course.ts         ← course metadata (title, description, price[TBC], categoryId, level, duration, cert, outcomes, requirements, audience, tags, thumbnail)
  <course>_modules.ts        ← sections (rename/keep <course>.ts; add module learningOutcomes)
  <course>_topic_quizzes.ts  ← KEEP, but key by `${week}:${topicIndex}` (stable) OR move quizzes inline into the topic object
  <course>_final_exam.ts     ← optional final assessment
  <course>_assignments.ts    ← optional assignments
  <course>_projects.ts       ← optional capstone
  categories.ts              ← seed data for the category tree
  loadCourseContent.ts       ← ONE shared, idempotent importer (replaces per-course reseed scripts)
```

### 23.3 WHY
- Existing files stay importable (no content rewrite); new courses follow the same convention.
- A single loader centralizes module-preserving, leaf-rebuild behavior currently duplicated across 10 scripts.
- Stable topic keys remove the title-rename fragility.
- Metadata moves out of scripts into one course-metadata file (single source for the catalog).

---

## 24. Existing Course Compatibility

- ✅ **No existing course is broken:** additive schema only; `Course.id` unchanged; existing modules preserved by loaders; payments/progress/certificates untouched.
- 🔶 **C and C++** keep their current ids, prices, modules, topics, quizzes; the *loaders* are standardized behind `loadCourseContent.ts` without rewriting content files in Phase 1.
- 🔶 **Re-mapping risk (WebDesign → Web Development category)** is display-level only; route/compat preserved.
- ✅ **URLs:** existing `/course/:id` keeps working (redirect/compat to `/course/:slug`).

---

## 25. Migration Strategy

🔶 **Phased, additive, never forced:**
- **Phase 1 — Preserve:** snapshot existing content/prices; verify no loader changes alter DB rows; keep modules intact.
- **Phase 2 — Normalize metadata:** create Category tree; backfill `categoryId`, `slug=id`, `status=PUBLISHED`, `certificateAvailable=true`; move price out of scripts into `<course>_course.ts` (values unchanged).
- **Phase 3 — Add objectives:** add optional columns; populate course-level outcomes first (cheap), module/lesson-level lazily per content refresh.
- **Phase 4 — Practical layer:** add Assignment/Project definitions; backfill only where existing deliverables are documented; fix gates (`weekNum*5`, hardcoded 20) to data-driven.
- **Phase 5 — Normalize assessments:** add `explanation`; revive final assessment for courses that opt in; fix quiz grading integrity (server-side denominators/ownership) before any expansion.
- **Phase 6 — Course-specific gaps:** address audit findings per course (SQL P0 item, CADD Civil identity re-scope, IoT retired services, C final-exam Q8, WebDesign missing `position`/`z-index`).
- **Compat rule:** if the current system already satisfies a requirement, do not force the change.

---

## 26. Validation Against Future Course Types

🔶 Architecture validated against 15 example courses (Category → Course → Modules → Lessons → Assessments → Practical → Certificate):

| # | Course | Category | Modules → Lessons | Assessments | Practical | Certificate |
|---|---|---|---|---|---|---|
| 1 | C Programming | Programming | 20 mod → topic lessons w/ code | topic+chapter quizzes; final (opt) | code examples, challenges, project | ✅ |
| 2 | C++ | Programming | modules → lessons w/ code | same | challenges, project | ✅ |
| 3 | Python | Programming | modules → lessons w/ code | same | challenges, CLI mini-projects | ✅ |
| 4 | MS Word | Computer & Office | modules → guided lessons (screenshots) | topic+chapter quizzes | document exercises, assignment | ✅ |
| 5 | MS Excel | Computer & Office | modules → lessons (workbooks) | same | spreadsheet tasks, project (workbook) | ✅ |
| 6 | MS PowerPoint | Computer & Office | modules → lessons | same | deck build, assignment | ✅ |
| 7 | Computer Fundamentals | Computer & Office | modules → lessons (no code) | topic+chapter quizzes | practical tasks (files, browser) | ✅ |
| 8 | Web Development | Web Development | modules → lessons w/ code+demo | same | coding challenges, capstone site | ✅ |
| 9 | IoT | IoT | modules → lessons w/ code+schematic | same | Wokwi labs, challenges, capstone | ✅ |
| 10 | Embedded Systems | Embedded Systems | modules → lessons w/ code | same | simulator labs, capstone | ✅ |
| 11 | Linux | Systems & Technology | modules → lessons w/ commands | same | terminal labs, assignment | ✅ |
| 12 | Networking | Systems & Technology | modules → lessons (diagrams) | same | config labs, project | ✅ |
| 13 | ITI COPA | ITI & Trade Training | trade units → lessons (no code) | unit quizzes | practical tasks, trade assignment | EduNexus cert ✅ (no govt claims) |
| 14 | ITI Electrician | ITI & Trade Training | trade units → lessons (safety/procedure) | unit quizzes | practical checklists, trade project | EduNexus cert ✅ (no govt claims) |
| 15 | ITI Fitter | ITI & Trade Training | trade units → lessons | unit quizzes | practical tasks, trade project | EduNexus cert ✅ (no govt claims) |

**Conclusion:** every case is the same `Module → Topic → (optional) Assessment/Practical` spine; differences are data presence (code field, challenges, assignments, project, final assessment) and category — no new course system is needed.

---

## 27. Open Questions

1. ⚪ **Approved price list** — no approved prices exist in the project (flat ₹699 today; example ₹599 not in any code/doc). What is the price standard for new courses?
2. ⚪ **Preview policy** — allow per-topic public previews (`isPreview`) or fully hide lesson content until enrolled?
3. ⚪ **Enrollment model** — confirm explicit `Enrollment` table (recommended) vs keep implicit `VERIFIED`-payment check in middleware.
4. ⚪ **ITI accreditation** — confirm EduNexus certificate only (no government ITI certification claims) unless verified accreditation exists.
5. ⚪ **Final assessment** — confirm revival of `FinalExamQuestion` (recommended) as the canonical final assessment.
6. ⚪ **Bundles** — "MS Office Complete" as a single bundled course (recommended) vs a real multi-course bundle later.
7. ⚪ **WebDesign category** — OK to move WebDesign from Programming to Web Development?
8. ⚪ **CADD Civil** — re-scope/rebrand the civil track (audit: identity failure) before or after platform expansion?
9. ⚪ **`meta Json` vs explicit columns** for keyPoints/commonMistakes/practice/resources (recommended: `meta Json?`).
10. ⚪ **Course display labels** — confirm per-course "Module/Week/Trade Unit" label config is worth the (small) machinery now.

---

## 28. Final Architecture Decision

| Decision | Current State | Final Recommendation | Reason | Impact |
|---|---|---|---|---|
| Taxonomy shape | No Category model; 4-value hardcoded union in FE config | Flat top-level `Category` table (+ optional subcategory for ITI trades) | Matches discovery model; short URLs; minimal nav | New model + backfill |
| Course identity | `id` String PK used as URL | Keep `id`; add `slug @unique` (backfill = id) | Stable public URLs; identity untouched | Additive column |
| Course metadata | title/description/price/isPublished only | Add shortTitle/shortDescription/category/subcategory/difficulty/duration/language/instructor/thumbnail/banner/status/featured/tags/learningOutcomes/requirements/targetAudience/skills/certificateAvailable | Detail page + admin management + cards | Additive nullable/default columns |
| Market/MRP pricing | None exists | **Do not introduce**; `Course.price` is the only price | Pricing rule; backend recomputes | None |
| Course types | None | Informational `courseType` String; behavior from content presence + category | Type doesn't fork behavior; YAGNI | Additive column |
| Module canonical unit | `Module.week` ordering int | Keep `week` column; "Week" = optional display label; counts derived | Rename = risk, zero benefit | None (UI label) |
| Lesson | `Topic` = lesson (title/text/code/note/order) | Keep as the lesson; add learningOutcomes/isPreview/duration/contentType + optional `meta` | Objectives + preview + per-type rendering | Additive |
| Objectives | None | Course/Module/Topic `learningOutcomes String[]` (required by authoring std) | Audit gap; assessment alignment | Additive + content |
| Quiz system | One `QuizQuestion` system | Keep ONE system; add `explanation`; rules in revived `businessRules.ts`; server-side shuffle | No duplicate systems | Additive |
| Final assessment | `FinalExamQuestion` inert | Revive + serve it (optional per course) | Model exists; no new entity | New route/service |
| Assignments | Submissions only; deliverables hardcoded (`weekNum*5`) | New `Assignment` definition model; data-driven gates | Authoring + correctness | New model |
| Project/Capstone | Legacy `Project` unused; gate hardcoded 20 | Repurpose with `courseId` + `requiredModuleCount` | Data-driven gate | Model change (legacy table) |
| Progress vs Completion vs Cert | `CourseProgress` fields; cert gate exists | Separate concepts; completion derived from module data + optional assessments; cert = completion + VERIFIED payment + certificateAvailable + admin verify | Integrity + correctness | Logic + flags |
| Certificate | Existing system (no-touch) | Keep; honor `certificateAvailable` only | Don't break working cert flow | One gate check |
| Enrollment | Implicit via VERIFIED payment | Explicit `Enrollment` table, backfilled | Single gate; free courses later; audit | New model |
| Pricing display | FE hardcoded (BASE_PRICE 699, coupon map) | `GET /payments/checkout/:courseId`; coupons in `Setting` | Single source of truth | API + FE cleanup |
| Content package | Flat `<course>.ts` + `<course>_topic_quizzes.ts` (title-keyed) + per-course reseed | Standardized package + `categories.ts` + one `loadCourseContent.ts`; quizzes keyed by week:index | Remove title-coupling; one importer | Refactor (additive) |
| Access control | Lesson/quiz/challenge/project NOT enrollment-gated | `requireEnrollment` middleware on all premium endpoints | P0 security (expansion-plan §16) | Middleware + routes |
| Quiz/progress integrity | Client-subset grading; no ownership filter | Server-validated question sets + ownership chain + derived counts | P0 integrity (expansion-plan §17) | quizService |
| Hardcoded counts | `/20`, `Week x/4`, `weekNum*5`, fallback 20 | All derived from `module.count` | Variable-length courses | Backend + FE |
| Ratings/student counts | None | Not displayed (no model) | No fake stats | None |

---

*End of document. This is an architecture/authoring standard — no application code, Prisma schema, database, seed file, course content, or UI was modified to produce it.*

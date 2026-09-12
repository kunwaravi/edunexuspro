# EduNexus Pro — Content Source & Pipeline Audit

**Audit date:** 2026-08-13
**Audited commit:** local `master` @ `862800b` (5 commits ahead of `origin/master`; content files are as-committed at `d5ca6a4`, the same content that is deployed to production)
**Method:** Full read of the Prisma schema, all 18 content files (~19k lines), 10 reseed scripts, `seed.ts`, all backend routes/services/lib, the frontend data layer and student/admin pages, plus live probing of the production API (`https://edunexus.kibm.in`). Read-only — nothing was modified.
**Confidence labels:** ✅ CONFIRMED (verified in code/data) · 🔶 INFERRED (strongly suggested) · ⚪ UNKNOWN (insufficient evidence)

---

## 1. Executive Summary

EduNexus Pro's educational content is **database-driven at runtime**, with a single active supply chain:

> `backend/prisma/content/*.ts` (deep hand-written curriculum, 9 courses) → `reseed_*_full.ts` scripts → **PostgreSQL** → Express services (`courseService`, `quizService`, `practiceService`, `challengeService`) → REST API → React hooks → student pages.

The DB is the **only** runtime source of truth — confirmed by reading the code and by probing the live API (9 courses × 20 modules, deep per-topic content served from the DB).

However, the repository contains **four generations of content infrastructure**, three of which are dead but still present and misleading:

| # | Source | Status | Size |
|---|---|---|---|
| 1 | `backend/src/lib/curriculumData.ts` | ✅ CONFIRMED **dead** (imported by nothing) | 1,664 lines |
| 2 | `backend/prisma/seed.ts` course-loop (template generators) | ✅ CONFIRMED **dead** (all 9 courses skipped) | 1,113 lines |
| 3 | `backend/prisma/cadded_curriculum.json` | ✅ CONFIRMED **dead** (reachable only from dead seed code) | 304 KB |
| 4 | `backend/prisma/content/*.ts` + `reseed_*_full.ts` | ✅ CONFIRMED **LIVE** | ~19k lines |

**Most consequential findings (detail in §22):**

- **P0 — Premium content is not actually protected.** Module lesson text, quiz questions, practice questions and challenges are served to *any authenticated user* with **no enrollment/payment check** server-side. The paywall exists only in the frontend UI. Certificate and course-forum are the only payment-gated endpoints. (`routes/course.ts:35`, `routes/quiz.ts:13,30,49`, `routes/practice.ts:12`)
- **P0 — Quiz grading is forgeable.** Submission grading loads questions by arbitrary question IDs with **no scope check against `courseId`/`week`/`topicId`**, and the denominator is the number of submitted rows — one client can submit a single question and pass any module at ≥60%. (`quizService.ts:28-67`)
- **P1 — Quiz XP/badge awards are unreachable dead code.** `QuizResult` is created *before* the "already passed" guard query, so the guard always matches the fresh row and the XP/`perfect_score`/`week_1_master` block never runs. (`quizService.ts:69-89`)
- **P1 — The "Final Exam" is seeded but never served.** `FinalExamQuestion` (15–18 questions/course) is written by every reseed, but **no route or service reads it**. Certificates never require it; it is marketing copy only. (`schema.prisma:302`, no references in `src/`)
- **P1 — Practice Arena has exactly 5 questions.** `seed.ts` seeds 5 `PracticeQuestion` rows (4 Programming, 1 Electronics) and there is **no admin CRUD** to add more. The arena is effectively empty. (`seed.ts:1027-1073`, `routes/practice.ts`)
- **P1 — Hardcoded "20" module assumptions.** Project-submission gate hardcodes 20 modules; CourseDetail hardcodes "20 Chapters", "4-Week Immersion", `weekNum * 5`. These are latent bugs if course structure ever drops below 20 (they happen to be correct for the current live state where every course has 20 modules).
- **P2 — Duplicate course metadata across 5 locations** (DB, `seed.ts`, `frontend/src/config/courses.ts`, `Home.tsx` `courseDetails`, `Home.tsx` `courseMetadata`) with drift risk; admin-CMS-created courses are invisible in config-driven UI surfaces.
- **P2 — Reseed scripts silently destroy per-topic progress.** Topics are delete-and-recreated with new IDs, cascade-deleting `TopicProgress` (`onDelete: Cascade`). Module progress survives because module IDs are preserved.

**Key architectural conclusion (§19):** The platform *does* have a genuine content-authoring path — the Admin "Course Syllabus CMS" — but it is partial (no course/module *update* UI, no practice/challenge editing, quiz-answer editing is broken, analytics are fake) and it **competes with the reseed scripts** as a second authoring path with no reconciliation between them.

---

## 2. Content Architecture Overview

```
                    ┌─────────────────────────────────────────────────────────┐
                    │  SOURCES (4 generations)                                │
                    │ 1. curriculumData.ts ......... DEAD (no imports)        │
                    │ 2. seed.ts generators ........ DEAD (all courses skipped)│
                    │ 3. cadded_curriculum.json .... DEAD (dead-code only)    │
                    │ 4. content/*.ts ............ LIVE ──► reseed_*_full.ts  │
                    └─────────────────────────────────────────────────────────┘
                                          │  (write)
                                          ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │  POSTGRES DB (runtime source of truth)                 │
                    │  Course → Module(=week) → Topic(lesson) → QuizQuestion │
                    │  ├ FinalExamQuestion (seeded, never served)            │
                    │  ├ Challenge (11, week-1 only)                         │
                    │  ├ PracticeQuestion (5 total)                          │
                    │  ├ Progress models (Topic/Module/Course/Challenge)     │
                    │  └ QuizResult, AssignmentSubmission, ProjectSubmission │
                    └─────────────────────────────────────────────────────────┘
                                          │  (read)
                                          ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │  SERVICES → ROUTES → REST API                          │
                    │  courseService, quizService, practiceService,          │
                    │  challengeService, challengeRunnerService,             │
                    │  certificateService, sandboxService                    │
                    └─────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                    ┌─────────────────────────────────────────────────────────┐
                    │  FRONTEND (React 19, axios, react-markdown + GFM)      │
                    │  useCourses / useCourseDetail / useQuiz → pages        │
                    │  + duplicate metadata (config/courses.ts, Home.tsx)    │
                    │  + hardcoded enrichment (diagrams, anti-patterns, ...) │
                    └─────────────────────────────────────────────────────────┘
```

**Content hierarchy (DB):** `Course` (string PK) → `Module` (autoincrement id, `@@unique([courseId, week])`, i.e. **a module *is* a week**) → `Topic` (the leaf "lesson": `title`, `text` (markdown), `code?`, `note?`) → `QuizQuestion`. There is **no `Lesson` model**; `Topic` is the lesson. ✅ CONFIRMED (`schema.prisma:85-151`)

**Four distinct question systems** (§6): `QuizQuestion` (dual-purpose), `FinalExamQuestion`, `PracticeQuestion`, `Challenge`. They share no model, no seed, and no serving logic.

---

## 3. Course Catalog Source of Truth

**Answers to the ten questions:**

1. **Where are courses originally created?** Three places have "course definitions": the DB itself (seeded), `seed.ts` `coursesList` (lines 12-114), and `content/*.ts` (via reseeds). The **active** creation path is the reseed scripts' find-or-create (`reseed_c_full.ts:29-154`) and the Admin CMS (`POST /api/courses`). ✅ CONFIRMED
2. **Where are courses persisted?** `Course` table, `id String @id` (custom keys `C`, `C++`, `IoT`, `Embedded`, `WebDesign`, `Python`, `SQL`, `CADDED_Mech`, `CADDED_Civil`). ✅ CONFIRMED
3. **Which source is used at runtime?** The **DB only**. `courseService.getAllCourses()` does `prisma.course.findMany` with no static content merge (`courseService.ts:3-21`). ✅ CONFIRMED (verified live: `GET /api/courses` returns 9 courses × 20 modules straight from Postgres)
4. **Does the frontend maintain its own copy?** Yes — `frontend/src/config/courses.ts` (9 courses: titles, difficulty, tags, colors, syllabus one-liners) and `Home.tsx` `courseDetails`/`courseMetadata` (9 courses + milestone text). These are **metadata/outline duplicates**, not full curriculum. ✅ CONFIRMED
5. **Are there multiple course representations?** Yes, five: DB, `seed.ts` list, `content/*.ts` sections, `config/courses.ts`, `Home.tsx` maps. ✅ CONFIRMED
6. **Which wins?** The DB wins at runtime. `Home.tsx` merges API courses with hardcoded `courseMetadata` (tags/difficulty/colors/milestones have **no** backend counterpart), and only uses its hardcoded `courseDetails` catalog if the API returns zero courses (`Home.tsx:640`). ✅ CONFIRMED
7. **Can an administrator modify course metadata?** Partially. Admin CMS supports **create** (`POST /courses`) and **delete** (`DELETE /courses/:id`), but the frontend **never calls** the existing `PUT /courses/:courseId` — so course *update* is not reachable from the UI. ✅ CONFIRMED (`AdminDashboard.tsx:404-453`, `course.ts:65`)
8. **Does modifying a DB course automatically update frontend presentation?** Titles/descriptions do (they are read from the API). Tags/difficulty/colors/milestones do **not** — they come from hardcoded frontend maps keyed by course id. A CMS-created course is **invisible** in the Home catalog cards, CourseCard syllabus, and certificate-console dropdown (all `coursesConfig`-driven). ✅ CONFIRMED
9. **Can frontend fallback data become stale?** Yes. `config/courses.ts` was last materially changed 2026-06-26 (CADDED additions); `Home.tsx` fallback is a parallel copy. They already diverge from DB module titles (e.g. C module 1 "C Foundations & Environment Setup" vs DB "Introduction to C & Environment Setup"). ✅ CONFIRMED
10. **Courses visible in one source but absent in another?** Currently no course-count mismatch (all sources hold the same 9 ids), but the **contents** of the modules differ between DB and frontend outlines. A CMS-created course would appear in DB but nowhere in the frontend config. ✅ CONFIRMED

### COURSE SOURCE-OF-TRUTH TABLE

| Course | DB | Seed (`seed.ts`) | Frontend Config (`config/courses.ts`) | Frontend Hardcoded (`Home.tsx`) | API Runtime Source | Admin Editable | Conflicts |
|---|---|---|---|---|---|---|---|
| C | ✅ live (20 mod) | ✅ list, but **skipped** | ✅ (6-row syllabus) | ✅ (week-by-week + milestones) | DB | create/delete (no update UI) | module titles differ between DB & frontend |
| C++ | ✅ live (20 mod) | ✅ list, **skipped** | ✅ (8-row) | ✅ | DB | same | same |
| IoT | ✅ live (20 mod) | ✅ list, **skipped** | ✅ (8-row) | ✅ | DB | same | same |
| Embedded | ✅ live (20 mod) | ✅ list, **skipped** | ✅ (8-row) | ✅ | DB | same | same |
| WebDesign | ✅ live (20 mod) | ✅ list, **skipped** | ✅ (7-row) | ✅ | DB | same | same |
| Python | ✅ live (20 mod) | ✅ list, **skipped** | ✅ (8-row) | ✅ | DB | same | same |
| SQL | ✅ live (20 mod) | ✅ list, **skipped** | ✅ (8-row) | ✅ | DB | same | same |
| CADDED_Mech | ✅ live (20 mod) | ✅ list, **skipped** (legacy JSON = 5 weeks) | ✅ (8-row) | ✅ | DB | same | docs claim 5 modules; live & content = 20 |
| CADDED_Civil | ✅ live (20 mod) | ✅ list, **skipped** (legacy JSON = 5 weeks) | ✅ (8-row) | ✅ | DB | same | same |

---

## 4. Course → Module → Topic Structure

| Hierarchy level | DB model | PK / identifier | Parent | Creation source | Runtime API | Frontend consumer | Admin editor | Seed dependency |
|---|---|---|---|---|---|---|---|---|
| Course | `Course` (`schema.prisma:85`) | `id String` (custom key) | — | reseed find-or-create + admin CMS | `GET /api/courses`, `GET /:courseId/public` | Home, Dashboard, CourseDetail, AdminDashboard | create/delete; **no update UI** | reseed `_full.ts` |
| Module (= week) | `Module` (`:102`) | `id Int`, `@@unique([courseId, week])` | Course (`onDelete: Cascade`) | content sections / admin CMS | `GET /api/courses/:courseId/module/:week` | CourseDetail (SyllabusManager, ProgressMap) | create/delete; **no update UI** | reseed (id preserved) |
| Topic (lesson) | `Topic` (`:120`) | `id Int` | Module (`onDelete: Cascade`) | content files / admin CMS WYSIWYG | same module endpoint (returns topics) | CourseDetail topic reader (ReactMarkdown) | ✅ full CRUD + reorder | reseed (delete & recreate) |
| Lesson | **none** | — | — | — | — | — | — | — |

✅ CONFIRMED: "week" and "module" are the **same thing** — one module per week per course (`@@unique([courseId, week])`, `courseService` returns `{week, title, description}` as the module shape).

- **Topic IDs are NOT stable.** Every reseed deletes all topics per module and recreates them, so `Topic.id` changes on each reseed. `TopicProgress` (which references `topicId`) is cascade-deleted. ✅ CONFIRMED (`reseed_c_full.ts:79-114`, `schema.prisma:130`)
- **Module IDs ARE stable across reseeds** (find-or-create preserves the id so `Challenge` links stay valid). ✅ CONFIRMED (`reseed_c_full.ts:70-75`)
- **Course structure is NOT dynamically generated** — it is static data from the content files, applied by reseeds, then editable via the CMS. ✅ CONFIRMED
- **Ordering is DB-driven**: topics ordered by `order asc` in the module endpoint; modules by `week asc` in `getAllCourses`. ✅ CONFIRMED
- **The frontend does NOT carry its own syllabus** for rendering the reader — `SyllabusManager`/`ProgressMap`/CourseDetail chapter list are fed from `GET /courses` (module list) and `GET /courses/:courseId/module/:week` (topics). The frontend's `config/courses.ts` syllabus is used only for marketing cards/fallbacks, not the reader. ✅ CONFIRMED

---

## 5. Learning Material Sources

### 5.1 Theory
- **Stored in the DB** as `Topic.text` (markdown) + `Topic.note` (exam-oriented note). ✅ CONFIRMED
- Authored in `backend/prisma/content/*.ts` as `CTopic { title, text, code, note }` (e.g. `content/c.ts:12-31`), applied via reseeds; also editable via the Admin CMS WYSIWYG topic editor (`PUT /api/courses/topic/:topicId`). ✅ CONFIRMED
- **API:** `GET /api/courses/:courseId/module/:week` returns `topics[]` with full `text/code/note` (authenticated only). ✅ CONFIRMED (`courseService.ts:23-66`)
- **Renderer:** CourseDetail topic reader renders `topic.text` through `react-markdown` + `remark-gfm` with DOMPurify sanitization (`CourseDetail.tsx:1017-1021`). ✅ CONFIRMED
- **Not** hardcoded in React for the reader; not read from `curriculumData.ts` (dead) or `config/courses.ts`. ✅ CONFIRMED
- Legacy/other theory text: `curriculumData.ts` topics (dead), `seed.ts` template generators incl. Hinglish/industry-case boilerplate (dead loop), `cadded_curriculum.json` (dead).

### 5.2 Code examples
- **Storage:** `Topic.code` (string) in the DB; the `code` field in content files is **required** for the deep content, but DB `code String?` is nullable (legacy template topics set null). ✅ CONFIRMED
- **API:** delivered inside the module-detail payload; rendered in CodePlayground with `initialCode = topic.code` (`CourseDetail.tsx:1114-1117`). ✅ CONFIRMED
- **Editable:** yes — CodePlayground is a plain `<textarea>`; language mapped `cpp/c/python/javascript` → sandbox. ✅ CONFIRMED (`CodePlayground.tsx:13-20,124-129`)
- **Executable:** yes — `POST /api/sandbox/run` runs in a child process (no Docker): gcc/g++/python/node, `ulimit` caps, `unshare -n` best-effort network isolation, 3s runtime kill (`sandboxService.ts:111-169`). ✅ CONFIRMED
- **Reuse in assignments/quizzes:** no. Examples are per-topic; assignments are file uploads (see 5.4); quiz questions are MCQs with no code field in `QuizQuestion`. ✅ CONFIRMED

### 5.3 Practical Exercises
- There is **no DB model** for hands-on exercises/labs/mini-projects. "Practical" content exists as: (a) markdown text inside some `Topic.text` bodies (e.g. "Lab Task" blocks in legacy seed.ts content), (b) **hardcoded `codingTemplates`** in `PracticeArena.tsx:32-48` (3 C/C++/IoT exercises with expected output, rendered in "Interactive Coding Mode"), and (c) `Challenge` rows (interactive code tasks). ✅ CONFIRMED
- No admin editor, no seed file, no API for exercise definitions. The PracticeArena coding mode is entirely hardcoded client-side. ✅ CONFIRMED

### 5.4 Assignments
- **There is no assignment-content model.** `AssignmentSubmission` (`schema.prisma:247-263`) stores only the student's uploaded file (`fileUrl`, `fileName`), status, feedback, `shareSolution`. There is no "assignment definition" (instructions, task text, grading rubric) anywhere in the DB or seed. ✅ CONFIRMED
- Assignment titles students see are **hardcoded** in `Dashboard.tsx:447-469` ("Binary System & Bitwise Macros", "Modular Pointers & Array Logic", "Hardware Structs & Register Mapping", "Embedded OS Implementation"). ✅ CONFIRMED
- Submission API: `POST /api/assignments/submit` (gate: `ModuleProgress.quizPassed` for module `week = weekNum * 5` — a hardcoded 20-week formula, `assignment.ts:49-67`); evaluation via `PUT /api/assignments/admin/evaluate/:id` (approve → +20 XP). ✅ CONFIRMED
- Data flow: student upload → `AssignmentSubmission` upsert (keyed `userId_courseId_weekNumber`, reset to PENDING) → admin queue → approve/reject → XP. ✅ CONFIRMED

### 5.5 Projects
- **`Project` model** (`schema.prisma:169-180`) — title/category/difficulty/description/documentation/codeSnippet/schematicUrl — is a catalog that is **never read or written by any route or service** (dead). ✅ CONFIRMED
- The actual project feature is `ProjectSubmission` (`:265-284`): student submits title/description/sourceCodeUrl/reportUrl. **No project definition content exists** (no requirements/milestones/evaluation-criteria tables). ✅ CONFIRMED
- Submission gate: non-admin must have **≥20 modules** with `quizPassed: true` (hardcoded 20, `project.ts:48-57`); evaluation via admin queue (+100 XP on approval). ✅ CONFIRMED
- Frontend "Deliverables" checklist and unlock rule are hardcoded: `[1,2,3,4]` and `requiredModule = weekNum * 5` (`CourseDetail.tsx:1259-1261`). ✅ CONFIRMED

---

## 6. Quiz & Question Bank Architecture

**Four distinct question systems — they share nothing.**

| System | Model | Storage | Question structure | How assigned to course/module/topic | Serving endpoint |
|---|---|---|---|---|---|
| **Chapter/week quiz** | `QuizQuestion` (`topicId = null`) | `moduleId` required | `text, options String[], correctAnswer` — **no explanation, difficulty, category** | belongs to a `Module`; module belongs to a course+week | `GET /api/quiz/questions/:courseId/:week` |
| **Per-topic quiz** | `QuizQuestion` (`topicId` set) | `moduleId` + `topicId` | same | belongs to a `Topic` (via topicId) | `GET /api/quiz/questions/topic/:topicId` |
| **Final exam** | `FinalExamQuestion` | `courseId` | same | course-level | **NONE — no route reads it** |
| **Practice arena** | `PracticeQuestion` | standalone (no relations) | `text, options, correctAnswer, explanation?, difficulty, category` | category only (`Programming`/`Electronics`) | `GET /api/practice/questions?category=` |
| **Challenges** | `Challenge` | `courseId`+`moduleId` | `description/instructions` (markdown), `seedCode`, `solutionCode`, `testCode` (JS assertions) | module for ordering/progress; unique `[courseId, dashedName]`, `[moduleId, order]` | `GET /api/challenges/...`, `POST /:id/run-test` |

✅ CONFIRMED — `QuizQuestion` is **dual-purpose**: the same table holds chapter quizzes (topicId null) and topic quizzes (topicId set), distinguished only by the nullable FK. Reseed scripts write both (`reseed_c_full.ts:102-127`).

**Question assignment:** Quiz questions are assigned to a module via `moduleId` (chapter) or topic via `topicId` (topic quizzes). The `*_topic_quizzes.ts` files are `Record<topicTitle, quiz[]>` maps; topic titles exactly match the main file's topic titles (verified per course). ✅ CONFIRMED

**Question selection (§ delivery):**
- Chapter quiz: **FIXED — all questions of the module, DB order, no limit** (`quizService.ts:4-26`).
- Topic quiz: **RANDOM 5 per request** via biased in-memory shuffle `[...questions].sort(() => 0.5 - Math.random()).slice(0, 5)` (`quizService.ts:329-357`). Duplicates within a response impossible; the same question can recur across requests.
- Practice: **FIXED — all questions in the category** (`routes/practice.ts:20-29`).
- Daily challenge: **deterministic per date** — `hashString(date) % total` index into the whole `PracticeQuestion` table, same for all users that day (`practiceService.ts:41-65`).

**Submission & grading:**
- `POST /api/quiz/submit` payload `{courseId, week, topicId?, answers{questionId: answer}}`; `userId` from JWT (body ignored). Grading = exact-string match on `correctAnswer`; `score = round(correct / totalQuestions * 100)`; `passed = score >= 60` (hardcoded). ✅ CONFIRMED (`quizService.ts:49-67`)
- **P0:** question IDs are **not scoped** to the submitted course/week/topic — grading loads `findMany({ id: { in: questionIds } })` and `totalQuestions = questions.length`, so a client can submit 1 question and pass. ✅ CONFIRMED
- Pass → `QuizResult.create` always; then (only if passed) `TopicProgress`/`ModuleProgress`/`CourseProgress` upserts. XP/badge award is **unreachable** (see §22 P1-2). ✅ CONFIRMED
- **Answers/explanations exposure:** chapter/topic/practice question-bank GETs strip `correctAnswer`/`explanation` server-side. But the **submit responses include `correctAnswer`** (`quizService.ts:51-63`) and practice submit includes `correctAnswer` + `explanation` (`routes/practice.ts:67-82`) — post-submission reveal (reasonable, but it means correct answers ARE transmitted to the client on every submit). ✅ CONFIRMED

**Seed/reseed question sources (see §6 inventory in §7 of this doc's source):** seed.ts generators (dead), content files (live). Live counts per course: **20 modules, 65-80 topics, 4-8 topic-quiz questions per topic (~260-320/course), ~160 chapter quizzes, 15-18 final-exam questions** (computed from content files; matches live DB where every course has 20 modules).

---

## 7. Practice Arena

- **Question source:** the standalone `PracticeQuestion` table — **NOT** the course quiz bank. ✅ CONFIRMED (distinct model, distinct seed, distinct endpoint)
- **Bank size:** exactly **5** seeded questions (4 Programming, 1 Electronics) — `seed.ts:1027-1073`. No admin CRUD route exists, so the arena cannot grow through the UI. ✅ CONFIRMED
- **Selection:** all questions in the selected category, fixed order, no limit, no difficulty/topic filter (despite `difficulty`/`topic` columns existing). ✅ CONFIRMED (`routes/practice.ts:20-29`)
- **Grading:** `POST /api/practice/submit` — grades all questions in the category (unanswered = wrong); `accuracy = correct/total*100`; **points = improvement over previous best × 10**; writes `PracticeAttempt`; awards `bug_hunter` badge. ✅ CONFIRMED (`routes/practice.ts:42-148`)
- **Progress effects:** `User.points` (+ XP per new correct), `User.badges`. **No course/module/topic progress impact.** ✅ CONFIRMED
- **Daily challenge:** same `PracticeQuestion` table, deterministic per-date single question, 10 XP + 50 on 7-day streaks; atomic double-submit guard. ✅ CONFIRMED (`practiceService.ts`)

**Answer to the audit's question:** Practice Arena uses a **separate content system** from course quizzes — different table (`PracticeQuestion` vs `QuizQuestion`), different selection, different XP math, zero linkage to course progress.

---

## 8. Daily Challenges

Two distinct features share the name "daily":
1. **Practice daily question** (`GET /practice/daily`) — deterministic per-date `PracticeQuestion` pick; streak + XP. (§7)
2. **`Challenge` rows** ("Daily Challenges" per-course in the Challenge tab) — interactive code tasks, **not date-rotated**; they are a fixed ordered set per module. ✅ CONFIRMED (`challengeService.ts:5-51`)

**Challenge pipeline:** `challengeSeedData.ts` (11 challenges: 6 HTML, 3 Python, 2 SQL — **week 1 of only 3 courses**) → idempotent `challenge.upsert` by `[courseId, dashedName]` in seed.ts → DB `Challenge` → `GET /api/challenges/course/:courseId` (list, no instructions/seed/test), `GET /api/challenges/:id` (full, `solutionCode` stripped) → `POST /:id/run-test` executes user code against `testCode` assertions in the sandbox; pass → auto `completeChallenge`. ✅ CONFIRMED
- Completion: sequential gate (previous challenge in module first), +10 XP once; when **all** published challenges in a module are done, `ModuleProgress.upsert({completed, quizPassed: true})` (no quiz score) and advances `CourseProgress`. ✅ CONFIRMED
- **Independent of course quizzes** — reuses course content only via module association. ✅ CONFIRMED

---

## 9. Final Exam

- **Model:** `FinalExamQuestion` (`schema.prisma:302-313`), course-level, `text/options/correctAnswer`.
- **Seeded:** every reseed deletes and recreates 15-18 per course (`reseed_c_full.ts:136-146`). The legacy seed.ts generator created 50 templates (now dead).
- **Served:** **NEVER.** No route, service, or frontend fetch references `FinalExamQuestion`. ✅ CONFIRMED (`grep` over `src/` = zero hits)
- **Progress impact:** none. Certificates require passing all module quizzes + payment — **a final exam is never required**. The "Final Exam" exists only as marketing copy ("passed the final examinations" — `EnrollmentPanel.tsx:59`) and syllabus text.
- **Verdict:** the final-exam question bank is **seeded-but-never-served dead content** (§18), and the advertised "exam" is an unimplemented product promise (§22 P2).

---

## 10. Admin / CMS Pipeline

Admin surface = single `AdminDashboard.tsx` (2,654 lines) with tabs: transactions, **cms** (Course Syllabus CMS), users, referrals, analytics, messages, settings, review.

| Content Type | Admin Can Create | Admin Can Edit | Admin Can Delete | DB Storage | Seed Required | Runtime Editable |
|---|---|---|---|---|---|---|
| Course | ✅ `POST /courses` (id/title/desc/price) | ❌ (PUT route exists, UI never calls it) | ✅ `DELETE /courses/:id` | Course | no | ✅ via CMS |
| Module (week) | ✅ `POST /courses/:id/module` | ❌ (PUT route exists, UI never calls it) | ✅ `DELETE /courses/module/:id` | Module | no | ✅ via CMS |
| Topic (lesson) | ✅ `POST /courses/module/:id/topic` | ✅ `PUT /courses/topic/:id` (+reorder) | ✅ `DELETE /courses/topic/:id` | Topic | no | ✅ genuine WYSIWYG |
| Quiz question | ✅ `POST /quiz/module/:id/question` | ⚠️ **broken**: editor cannot see existing `correctAnswer` (bank endpoint strips it) → edit overwrites blindly | ✅ `DELETE /quiz/question/:id` | QuizQuestion | no | partial |
| Practice question | ❌ | ❌ | ❌ | PracticeQuestion | seed (5 rows) | ❌ |
| Challenge | ❌ | ❌ | ❌ | Challenge | seed (11 rows) | ❌ |
| Assignment content | ❌ (no content model) | ❌ | ❌ | — | — | ❌ |
| Project content | ❌ (no content model) | ❌ | ❌ | — | — | ❌ |
| Assignment/Project submissions | — | ✅ status only (`PUT /admin/evaluate/:id`) | ❌ | Assignment/ProjectSubmission | no | ✅ |
| Certificates | console opens `/certificate?...` (admin bypass) | ✅ verify/unverify | ❌ | CertificateRecord | no | ✅ |
| Payments | ❌ | ✅ verify/fail | ✅ | Payment | no | ✅ |
| Users | ❌ | ✅ (name/college/branch/role/dates) | ✅ | User | no | ✅ |
| Contact settings | — | ✅ | — | Setting | seed (5 rows) | ✅ |

**Verdict:** a **genuine but partial CMS**. The course/module/topic/question CRUD hits real endpoints backed by Prisma — a real editorial layer for the DB. But: course/module **update** is unreachable; practice questions and challenges are not editable at all; assignment/project content has no definition model; the quiz-question editor cannot display the existing correct answer; the **Analytics tab is 100% fake hardcoded data** (`AdminDashboard.tsx:1820-1915`); and the "Embedded Infographic Upload Sandbox" is a labeled mock that performs no upload (`AdminDashboard.tsx:709-725`).

**If an admin edits educational content today:** topics/questions/quiz-question text/options/answer changes persist to the DB and are served immediately to students (next module-detail fetch). But a subsequent **reseed of that course deletes and replaces all topics + questions from the content files, silently discarding those admin edits** — the reseed scripts have no preservation guard (unlike the legacy seed.ts path). ✅ CONFIRMED (§13)

---

## 11. Frontend Content Consumption

| Page | API endpoints | Hook/function | Renders | Fallback/hardcoded content |
|---|---|---|---|---|
| Home | `GET /courses`, `GET /practice/leaderboard/public` | `useCourses` | hero, bento catalog, syllabus modal, Hall of Fame | **full hardcoded 9-course catalog** (`courseDetails`, l.21-247) if API empty; **hardcoded milestones/tags/colors** merged over API courses (`courseMetadata`, l.249-495); **fabricated mock Hall-of-Fame students** on API failure (l.663-669); trust metrics (l.874-885) |
| Dashboard | `GET /courses`, `GET /practice/daily`, `POST /practice/daily/submit`, `GET /practice/leaderboard` | `useCourses` | progress, daily challenge, skill radar, milestone cards, leaderboard | **hardcoded milestone assignment titles** (l.447-469); hardcoded skill labels + fallback floors (l.167-178); badge-label map; "Specialized Track"/college fallbacks |
| CourseDetail | `GET /courses`, `GET /payments/status/:id`, `GET /courses/:id/module/:week`, assignments/projects/forum APIs | `useCourseDetail` | chapter list, topic reader (ReactMarkdown), quizzes, forum, project tab | **hardcoded anti-pattern code blocks** (l.27-106), **hardcoded SVG "Concept Visualized" diagrams** (l.422-521), "4-Week Immersion" + "Prerequisites" meta cards (l.624-635), simulator callouts/URLs (l.839-881), **"20 Chapters" / "Eligible ≥ 20"** (l.1238-1241), deliverables `[1,2,3,4]` + `weekNum*5` unlock (l.1259-1261), "5-question quiz ≥60%" copy (l.1143-1145), fallback title/desc from `config/courses.ts` (l.207-209) |
| Quiz | `GET /quiz/questions/topic/:id` or `GET /quiz/questions/:courseId/:week`, `POST /quiz/submit` | `useQuiz` | question radios, results modal | **no hardcoded questions**; 300s hardcoded timer |
| PracticeArena | `GET /practice/questions?category=`, `POST /practice/submit` | inline | MCQ practice + coding mode | **hardcoded `codingTemplates`** (3 exercises, l.32-48) + exercise descriptions (l.385-402); 900s timer; "10 XP per correct" copy |
| Certificate | `GET /certificate/:courseId` | inline | credential | **hardcoded "Vinayak Singh, CEO & Co-Founder" signature** (l.457-461); grade→text map; placeholder admin preview |
| AdminDashboard | ~30 admin endpoints (§10) | inline | 8 tabs | **fake analytics** (l.1820-1915); `coursesConfig`-driven certificate dropdown |
| PayPage | `POST /payments/create-order`, `/verify` | inline | UPI/coupon checkout | **client-side coupon table** + `BASE_PRICE = 699` hardcoded (l.26, 92-112) |
| EnrollmentPanel | none (navigates to `/pay`) | — | preview cert + price | **hardcoded ₹699** (l.80), **fake preview cert "DATE: 2026-05-29" / "GRADE: A+"** (l.42-43), generic "C & Embedded tracks" copy on every course (l.39) |

**Critical answer — "API content exists BUT frontend displays something else":** the syllabus/topic-reader content is genuinely API-driven; the divergence is in **enrichment and fallback layers**: Home's whole catalog fallback + milestone overlay, CourseDetail's anti-patterns/diagrams/20-chapter strings, PracticeArena's coding exercises, Dashboard's milestone titles, EnrollmentPanel's fake certificate preview, Certificate's hardcoded human signature. ✅ CONFIRMED

---

## 12. Duplicate Sources of Truth

### CONTENT DUPLICATION MATRIX

| Content | Source A | Source B | Source C | Source D | Runtime Winner | Drift Risk |
|---|---|---|---|---|---|---|
| Course catalog | DB (`Course`) | `seed.ts` `coursesList` (dead) | `config/courses.ts` | `Home.tsx` `courseDetails` | **DB** (A) | HIGH — frontend outlines differ from DB module titles |
| Module outline | DB (`Module`) | `content/*.ts` sections | `config/courses.ts` syllabus rows | `Home.tsx` week-by-week | **DB** | HIGH |
| Course metadata (tags/difficulty/colors/milestones) | **only frontend** (`config/courses.ts`, `Home.tsx` `courseMetadata`) | — | — | — | frontend constants | n/a (no backend equivalent) |
| Topic lesson text | DB (`Topic.text`) | `content/*.ts` | `curriculumData.ts` (dead) | `cadded_curriculum.json` (dead) | **DB** | HIGH between live content & dead copies |
| Quiz questions | DB (`QuizQuestion`) | `content/*.ts` + `*_topic_quizzes.ts` | `curriculumData.ts` `quizzes` (dead) | seed.ts generators (dead) | **DB** | dead copies diverge freely |
| Final exam Qs | DB (`FinalExamQuestion`) | `content/*.ts` `*FinalExam` | seed.ts generator (dead) | — | **DB, but never served** | n/a |
| Practice Qs | DB (`PracticeQuestion`, 5 rows) | seed.ts hardcode | — | — | DB | n/a |
| Challenges | DB (`Challenge`) | `challengeSeedData.ts` | — | — | DB | LOW (upsert by dashedName) |
| Project definitions | `Project` model (dead) | hardcoded frontend deliverables | — | — | **none** | n/a |
| Assignment titles | hardcoded `Dashboard.tsx` | — | — | — | frontend constant | n/a |
| Course price | DB (`Course.price` = 699) | `PayPage` `BASE_PRICE = 699` | `EnrollmentPanel` ₹699 | paymentService default 699 | DB (backend), but **frontend hardcodes it** | HIGH if price changes |

**Why duplicates exist:** the platform evolved through 4 content generations (§13) without removing the superseded sources; the frontend shipped its own marketing metadata before the DB became the single runtime source (commit `f4f1097` "dynamically fetch homepage and course detail pages from database", 2026-07-08).

**Which wins / enforcement:** the DB wins for everything the student actually reads. The frontend constants win for presentation metadata. The dead sources win nothing. **The canonical source is NOT enforced** — nothing prevents an editor from editing `config/courses.ts` and creating a silent mismatch with the DB (in fact several already exist).

---

## 13. Content Creation Workflows

**Four generations confirmed from git history and code:**

1. **Gen 1 — hardcoded prototype** (`curriculumData.ts`, last touched 2026-05-30): 4 courses × 5 modules × 3 topics, 20 questions/course. Now dead.
2. **Gen 2 — relational seed + template generator** (`seed.ts`, evolved 2026-05-30 → 2026-07-02): 9 courses, machine-generated quizzes (10/module), 50 final-exam templates, Hinglish/industry-case text. **Now dead** — the course loop is skipped for all 9 courses (seed.ts:816-851) to stop it overwriting the upgraded curriculum.
3. **Gen 3 — CADDED ChatGPT-parse** (`cadded_curriculum.json`, 2026-07-02): loaded only by the now-dead seed loop. **Dead.**
4. **Gen 4 — deep hand-written content** (`content/*.ts`, committed 2026-08-12 in `e93391e`): the live pipeline.

**Confirmed workflows:**

### Workflow A — Seed/Reseed based (the active authoring path for bulk content)
```
Author edits content/<course>.ts & <course>_topic_quizzes.ts
→ run reseed_<course>_full.ts (npm run seed:<course>:full)
→ DB (delete & recreate topics + quiz questions + final exam; modules preserved)
→ API → student
```
✅ CONFIRMED (`backend/package.json:11-19` reseed scripts; docs `architecture-baseline.md:768`)

### Workflow B — Admin CMS based (the active path for incremental edits)
```
Admin edits via AdminDashboard CMS
→ POST/PUT/DELETE /api/courses|/quiz endpoints
→ service → Prisma → DB
→ API retrieval → student
```
✅ CONFIRMED (all CMS mutations map to real endpoints, §10)

**No reconciliation exists between A and B** — an admin edit is silently destroyed by the next reseed of that course, and a CMS-created course is invisible in config-driven UI. ✅ CONFIRMED

There is **no confirmed AI-generation workflow** and **no staging/approval workflow** for content.

---

## 14. Content Versioning

- **No content versioning of any kind.** No history tables, no audit trail, no soft-delete, no editorial review states. ✅ CONFIRMED
- **Editing without losing history:** impossible — CMS edits overwrite in place; reseeds delete-and-recreate leaf nodes. The previous topic text/questions are gone.
- **Question IDs:** stable only until the next reseed of that course (QuizQuestion rows are deleted & recreated; `id Int` autoincrement will mint new ids). Topic IDs change on every reseed. Module IDs survive. ✅ CONFIRMED
- **Course structure after enrollment:** can change at any time via CMS or reseed. Existing `QuizResult` (course+week, no topic) survives; `TopicProgress` is cascade-deleted on reseed; `ModuleProgress` survives while module ids hold.
- **Content changes auditable?** No. `createdAt`/`updatedAt` exist on content models, but there is no editor identity and no history.
- **What happens to progress when modules/topics change:** module-count derived logic (certificate, quizService) adapts to the new count; per-topic progress is lost if topics are reseeded. `CourseProgress.progress` is a snapshot written at quiz time and is **never recomputed** when the module count changes. ✅ CONFIRMED

---

## 15. Content Access & Entitlement

### CONTENT ACCESS MATRIX

| Content | Public | Authenticated | Enrolled | Paid | Admin | Enforcement Location |
|---|---|---|---|---|---|---|
| Course list + module metadata | ✅ | ✅ | — | — | ✅ | — |
| Course public syllabus (module desc + **topic titles + IDs**) | ✅ | ✅ | — | — | ✅ | — (`GET /api/courses/:id/public`) |
| **Module lesson content (text/code/note)** | ❌ | ✅ **no enrollment/payment check** | ❌ | ❌ | ✅ | **frontend UI only** (`course.ts:35`) |
| **Quiz questions** | ❌ | ✅ **no enrollment/payment check** | ❌ | ❌ | ✅ | auth only (`quiz.ts:13,30`) |
| **Quiz grading/progress** | ❌ | ✅ **no enrollment/payment check** | ❌ | ❌ | ✅ | auth only (`quiz.ts:49`) |
| **Practice questions/daily** | ❌ | ✅ **no enrollment/payment check** | ❌ | ❌ | ✅ | auth only (`practice.ts:12,151`) |
| **Challenges** | ❌ | ✅ **no enrollment/payment check** | ❌ | ❌ | ✅ | auth only (`challenge.ts`) |
| Certificate generation | ❌ | ✅ | ✅ (course completion) | ✅ **VERIFIED payment** | ✅ bypass | **backend** (`certificateService.ts:84-107`) |
| Forum course posts | ❌ | ✅ | — | ✅ VERIFIED payment | ✅ bypass | backend (`forum.ts:146-154`) |
| Assignment submit | ❌ | ✅ | — | — | ✅ bypass | backend — gated on quizPassed only (`assignment.ts:49-67`) |
| Project submit | ❌ | ✅ | — | — | ✅ bypass | backend — gated on ≥20 modules passed (`project.ts:48-57`) |
| Peer solutions | ❌ | ✅ (must have APPROVED own submission) | — | — | — | backend (`assignment.ts:210-217`, `project.ts:195-202`) |

**Key finding:** the "premium" content students pay for — all lesson text, all quiz questions, practice, challenges — is **protected only by authentication, not by enrollment/payment**. The paywall is a frontend UX (EnrollmentPanel) with **no server-side counterpart** for content endpoints. A logged-in user (including a free/never-paid account) can pull the entire curriculum and question banks directly from the API. ✅ CONFIRMED

---

## 16. Content → Assessment → Progress Pipeline

```
Topic.read → Topic quiz (5 random, ≥60%) → TopicProgress{completed, quizPassed, quizScore}
  → (if last topic in module) ModuleProgress{completed, quizPassed, quizScore}
  → CourseProgress{weekCompleted = week, progress = round(week/requiredWeeks*100), completed = week>=requiredWeeks}
  → Challenge completion (10 XP) / all-challenges-in-module → ModuleProgress{quizPassed:true} (no score)
  → ALL modules done + Payment VERIFIED → CertificateRecord (PENDING → admin verify → VERIFIED)
  → Assignment submit gate: ModuleProgress.quizPassed for week = weekNum*5 (hardcoded formula)
  → Project submit gate: ≥20 modules quizPassed (hardcoded 20)
```
✅ CONFIRMED (quizService.ts:114-282, challengeService.ts:143-188, certificateService.ts:84-107, assignment.ts:49-67, project.ts:48-57)

**DB fields updated per stage:** `QuizResult` (create: userId/courseId/week/score/passed) → `User.points`/`badges` (intended but unreachable, §22) → `TopicProgress` (upsert) → `ModuleProgress` (upsert) → `CourseProgress` (upsert: `weekCompleted`, `progress`, `completed`) → `CertificateRecord` (create) → `User` cert dates.

**Hardcoded assumptions baked into progress:** pass threshold 60 (`quizService.ts:67`); `requiredWeeks` fallback 20 when a course has 0 modules (`quizService.ts:35`, `certificateService.ts:88,243`, `challengeService.ts:164`); topic-quiz size 5 (`quizService.ts:338`); project gate 20 (`project.ts:52`); assignment gate `weekNum*5` (`assignment.ts:50`); frontend "20 Chapters"/"≥20" (`CourseDetail.tsx:1238,1241`); frontend "4-Week Immersion" (`CourseDetail.tsx:626`); legacy `businessRules.ts` `maxWeeks: 4` (dead). ✅ CONFIRMED

---

## 17. Content Integrity Issues

Evidence — not fixes:

1. **Question IDs not scoped to course/week/topic in grading** — a submission can reference questions from any module of any course. `quizService.ts:37` loads by ID only. **P0.**
2. **Denominator = submitted rows** — passing threshold is computed against the questions the client chose to send, enabling single-question passes. `quizService.ts:48-67`. **P0.**
3. **`QuizResult.week`/`courseId` trust the client body** for course/week (though userId is from JWT). `quiz.ts:49-56`. A client can write QuizResult rows for arbitrary courses/weeks. **P1.**
4. **`TopicProgress`/`ModuleProgress`/`CourseProgress` only advance on `passed`**, but because grading is not scoped (§1-3), passing is achievable without the intended prerequisites. **P1.**
5. **Challenges write `ModuleProgress.quizPassed = true` with no quiz** (`challengeService.ts:173-179`) — completing 3 week-1 challenges can mark a module quiz-passed, satisfying assignment gates. **P1.**
6. **`Course.isPublished` is never consulted** — no course route filters on it (`courseService.ts`), so unpublishing does nothing. **P2.**
7. **Schema/migration drift:** 8 models have no `CREATE TABLE` migration (`Project`, `Discussion`, `ForumComment`, `PracticeQuestion`, `PracticeAttempt`, `CertificateRecord`, `ContactMessage`, `Setting`); `QuizQuestion.options`/`FinalExamQuestion.options` created as `TEXT` but schema declares `TEXT[]`; orphaned `User.weekCompleted` column in init migration; schema-only User/QuizResult columns. **P2.**
8. **`FinalExamQuestion` is a seeded-but-unserved question set** — the "final exam" students are promised never happens. **P2.**
9. **Zero-question topic quiz** → the topic endpoint returns 404 and the UI can show a blank quiz state (matches a previously-documented P0 in the frontend). `quizService.ts:349-357`, `Quiz.tsx`.
10. **Frontend/backend copy drift:** "5-question quiz ≥60%" hardcoded vs topic-quiz size really being ≤5 (small topics return fewer than 5). `CourseDetail.tsx:1143-1145`.
11. **Hardcoded 20-format gates vs DB-derived counts** — latent breakage if a course has ≠20 modules. (§16)
12. **Content file inconsistencies:** all topic titles match their quiz-map keys (verified) — good. `c.ts` has 65 topics vs ~80 for the others (per-course variance, not a defect per se).
13. **Docs-vs-code contradictions** (from cross-reference): CADDED "5 modules" claim vs content files defining 20; "reseed guards preserve admin edits" vs reseeds deleting unconditionally; "Wokwi/Hinglish enrichment for IoT/Embedded" present only in dead seed.ts, absent from live content; "passing threshold lives in `businessRules.ts`" vs it being dead code. ✅ CONFIRMED contradictions — left unreconciled per audit rules.

---

## 18. Orphaned / Dead Content

### CONFIRMED DEAD

| Item | Evidence |
|---|---|
| `backend/src/lib/curriculumData.ts` (1,664 lines, 4 courses, 80 questions) | imported by nothing (`grep` over repo = 0 refs outside the file & dist artifacts) |
| `backend/src/lib/businessRules.ts` (13 lines) | exported, imported nowhere |
| `backend/prisma/seed.ts` course-generation loop + generators (`generateModuleQuizzes`, `generateFinalExamQuestions`, `generateTopicQuizzes`, `getDynamicTopicsForModule`) | all 9 courses `continue`-skipped (seed.ts:816-851) |
| `backend/prisma/cadded_curriculum.json` (304 KB) | only loaded from `getDynamicTopicsForModule` (dead) |
| `backend/prisma/reseed_c_beginner.ts` | superseded by `reseed_c_full.ts`; not wired to any npm script |
| `FinalExamQuestion` table (15-18 questions × 9 courses in live DB) | no route/service reads it |
| `Project` model (`schema.prisma:169-180`) | no `prisma.project` usage anywhere in `src/` |
| `backend/dev.db`, `backend/prisma/dev.db` (SQLite leftovers) | stale (May 29 / Jun 1), datasource is PostgreSQL |
| Legacy `QuizQuestion`/`TopicProgress` id-churn | n/a (behavior) |
| `CourseProgress.weekCompleted // "0 to 4"` comment | stale comment (schema.prisma:59) |

### POSSIBLY UNUSED

| Item | Notes |
|---|---|
| `PracticeAttempt` history | written on every submit, but **no endpoint reads it** — data accrues invisibly |
| `PracticeQuestion.topic` / `.difficulty` | stored, never used as filters |
| `QuizResult.accuracy` / `grade` | columns exist, never written by `submitQuiz` |
| `User.grade` | default "N/A", written by admin edits only |
| `Topic.code` nullability | legacy template topics had null; deep content always sets it |
| Challenge `challengeType` values beyond the 11 seeded | model supports HTML/CSS/JS/Python/SQL, only week-1 HTML/Python/SQL seeded |
| `settings`/`Setting` rows | only contact settings consumed |

---

## 19. Content Management Capability Assessment

This is an **architecture/editorial-capability audit, not a curriculum judgment.**

| Capability | Current state |
|---|---|
| Rewrite lessons | ✅ via Admin CMS topic editor (persists), or content file + reseed |
| Add examples | ✅ topic editor (code + text fields) — but no structured "example" type |
| Add questions | ✅ CMS chapter-question create; ⚠️ cannot see existing answers when editing; ❌ no practice-question editing |
| Update explanations | ❌ `QuizQuestion`/`FinalExamQuestion` have **no explanation field**; `PracticeQuestion` does but is un-editable |
| Restructure modules | ⚠️ module create/delete only — no update, no reorder UI; ordering is DB `week` |
| Introduce difficulty levels | ❌ only `PracticeQuestion` has `difficulty`; course quiz questions have none; no difficulty model |
| Add learning objectives | ❌ no field anywhere (`Topic.text` could hold them ad hoc) |
| Add prerequisites | ❌ no field; frontend hardcodes "Basic Logic Foundations" (`CourseDetail.tsx:634`) |
| Add practical exercises | ❌ no model; PracticeArena coding mode is hardcoded; assignments have no definition model |
| Add assessments | ❌ no assessment template; the "final exam" is dead; assignments are file-drop with manual grading |
| Version content | ❌ none |
| Review content | ❌ none |
| Approve content | ❌ none (challenges have `isPublished` but no admin toggle; courses have `isPublished` but it's ignored) |
| Publish content | ⚠️ `isPublished` exists but is not enforced |

**Bottom line:** the platform can **edit existing lesson text and quiz questions**, but cannot structurally extend the curriculum (objectives, prerequisites, difficulty, exercises, assessments, exams, versioning). Content governance (review/approve/publish/audit) is absent. The two authoring paths (CMS vs reseed) are uncoordinated.

---

## 20. Complete Data-Flow Diagrams

```
COURSE CATALOG
content/<course>.ts ──► reseed_<course>_full.ts ──► Course DB ──► courseService.getAllCourses()
   ──► GET /api/courses ──► useCourses() / useCourseDetail() ──► Home / Dashboard / CourseDetail / AdminDashboard

TOPIC CONTENT (theory/code)
content/<course>.ts topics[] ──► reseed (Topic rows) ──► DB
   ──► courseService.getModuleByWeek() ──► GET /api/courses/:courseId/module/:week
   ──► useCourseDetail.fetchModuleDetails() ──► CourseDetail topic reader (ReactMarkdown + CodePlayground)

WEEK (CHAPTER) QUIZ
content/<course>.ts quizzes[] ──► reseed (QuizQuestion, topicId=null) ──► DB
   ──► quizService.getQuizQuestions() ──► GET /api/quiz/questions/:courseId/:week
   ──► useQuiz() ──► Quiz.tsx ──► POST /api/quiz/submit ──► quizService.submitQuiz()
   ──► grade (≥60) ──► QuizResult + Topic/Module/CourseProgress

TOPIC QUIZ
content/<course>_topic_quizzes.ts ──► reseed (QuizQuestion, topicId set) ──► DB
   ──► quizService.getTopicQuizQuestions() (shuffle, take 5) ──► GET /api/quiz/questions/topic/:topicId
   ──► useQuiz() ──► Quiz.tsx ──► POST /api/quiz/submit ──► progress

PRACTICE ARENA
seed.ts practiceQuestions[] (5 rows) ──► PracticeQuestion DB ──► GET /api/practice/questions?category=
   ──► PracticeArena.tsx ──► POST /api/practice/submit ──► grade + PracticeAttempt + XP/badge
   (coding mode = hardcoded codingTemplates, NOT from API)

DAILY CHALLENGE
practiceService.getDailyChallenge() ──► hashString(date) % count ──► PracticeQuestion
   ──► GET /api/practice/daily ──► Dashboard ──► POST /api/practice/daily/submit ──► streak + XP

CODE CHALLENGES
challengeSeedData.ts ──► seed.ts upsert ──► Challenge DB ──► challengeService ──►
   GET /api/challenges/course/:courseId | /:id ──► CourseDetail challenges tab
   ──► POST /api/challenges/:id/run-test ──► challengeRunnerService (sandbox) ──► pass → ChallengeProgress + XP + ModuleProgress

PROJECT
(no content model) ──► ProjectSubmission ──► POST /api/projects/submit (gate: ≥20 modules passed)
   ──► admin queue ──► PUT /api/projects/admin/evaluate/:id (+100 XP)

ASSIGNMENT
(no content model) ──► AssignmentSubmission ──► POST /api/assignments/submit (gate: quizPassed for weekNum*5)
   ──► admin queue ──► PUT /api/assignments/admin/evaluate/:id (+20 XP)

FINAL EXAM
content/<course>.ts *FinalExam ──► reseed ──► FinalExamQuestion DB ──► ??? (NO ROUTE — dead end)

CERTIFICATE
CourseProgress.completed + Payment VERIFIED ──► certificateService.generateCertificate()
   ──► GET /api/certificate/:courseId ──► Certificate.tsx
   ──► CertificateRecord (PENDING) ──► admin verify ──► VERIFIED ──► /api/certificate/verify/:credentialId
```

---

## 21. Final Source-of-Truth Matrix

| Content Domain | Actual Source of Truth | Storage | Creation Method | Runtime API | Frontend Consumer | Admin Editable | Seed Dependent | Duplicate Sources | Risk |
|---|---|---|---|---|---|---|---|---|---|
| Courses | **DB** (`Course`) | Postgres | reseed find-or-create / CMS create | `GET /api/courses`, `/:id/public` | Home, Dashboard, CourseDetail, AdminDashboard | create/delete (no update UI) | yes (initial) | seed.ts list, config/courses.ts, Home.tsx (all drift-prone) | module titles drift across copies |
| Course metadata (tags/diff/colors/milestones) | **frontend constants** | TS files | hand-edited | none | Home, AdminDashboard, CourseCard | no | no | Home.tsx × config/courses.ts | UI shows data DB doesn't hold |
| Modules | **DB** (`Module`) | Postgres | reseed / CMS | module endpoints | CourseDetail | create/delete (no update UI) | yes | content sections, config outlines | reseed rewrites titles |
| Topics (lessons) | **DB** (`Topic`) | Postgres | reseed / CMS WYSIWYG | module endpoint | CourseDetail reader | ✅ full CRUD | yes | content files, dead copies | reseed destroys admin edits + TopicProgress |
| Theory text | **DB** (`Topic.text`) | Postgres (markdown) | reseed / CMS | module endpoint | ReactMarkdown reader | ✅ | yes | content/*.ts | dead copies diverge |
| Code examples | **DB** (`Topic.code`) | Postgres | reseed / CMS | module endpoint | CodePlayground | ✅ | yes | content/*.ts | — |
| Assignments | **none (no content model)** | — | — | submit/evaluate only | Dashboard hardcoded titles | ❌ | no | Dashboard.tsx hardcode | task titles fabricated in UI |
| Projects | **none (no content model)**; `Project` model dead | — | — | submit/evaluate only | CourseDetail hardcoded deliverables | ❌ | no | `Project` model (dead) + frontend | gate hardcodes 20 |
| Chapter quiz questions | **DB** (`QuizQuestion`, topicId null) | Postgres | reseed / CMS | `GET /quiz/questions/:courseId/:week` | Quiz.tsx | ✅ (answer-edit broken) | yes | content/*.ts | forgable grading |
| Topic quiz questions | **DB** (`QuizQuestion`, topicId set) | Postgres | reseed | `GET /quiz/questions/topic/:id` | Quiz.tsx | ❌ (no topic-scoped admin route) | yes | *_topic_quizzes.ts | random 5, no exhaustion |
| Final exam questions | **DB** (`FinalExamQuestion`) | Postgres | reseed | **none** | none | ❌ | yes | content/*.ts | **dead end** |
| Practice questions | **DB** (`PracticeQuestion`, 5 rows) | Postgres | seed.ts only | `GET /practice/questions` | PracticeArena | ❌ | yes | seed.ts | arena effectively empty |
| Daily challenge | **DB** (`PracticeQuestion`) | Postgres | seed.ts | `GET /practice/daily` | Dashboard | ❌ | yes | — | date-rotation only |
| Challenges | **DB** (`Challenge`, 11 rows) | Postgres | seed.ts upsert | challenge endpoints | CourseDetail | ❌ | yes | challengeSeedData.ts | week-1 only; quizPassed write |
| Answers | **DB** (`correctAnswer` on 3 models) | Postgres | reseed/seed/CMS | stripped on fetch, returned on submit | Quiz/practice UI | quiz ✅ (broken), practice ❌ | yes | content files | exposure via submit response |
| Explanations | **only `PracticeQuestion`** (5 rows) | Postgres | seed.ts | submit response | PracticeArena | ❌ | yes | — | none for quiz/final |
| Progress rules | **DB + code** (threshold 60 hardcoded; counts derived) | code | — | — | — | — | — | duplicated in 4 services | module-count drift |
| Assessment rules | **code** (project=20, assignment=weekNum*5, grade map) | code | — | — | — | — | — | `businessRules.ts` (dead) | stale hardcodes |

---

## 22. Critical Findings — P0/P1/P2/P3

### P0 — Critical (incorrect grading / content exposure / data integrity)

**P0-1 · Premium lesson content is served to any authenticated user (no enrollment/payment gate)**
- Evidence: `routes/course.ts:35` (`GET /:courseId/module/:week` → `authenticateToken` only); contrast `certificateService.ts:84-107` and `forum.ts:146-154` which do enforce payment. Live-verified: full syllabus (topic titles+IDs) is public at `GET /api/courses/:id/public`.
- Impact: the paid curriculum — all theory, code, quiz banks — is freely readable by any free account via the API. The paywall is cosmetic.
- Affected: all learning content. Confidence: ✅ CONFIRMED.

**P0-2 · Quiz grading is forgeable (question IDs unscoped, denominator = submitted rows)**
- Evidence: `quizService.ts:37` `findMany({ where: { id: { in: questionIds } } })`; no `courseId`/`week`/`topicId` filter; `totalQuestions = questions.length`; `passed = score >= 60` (`:66-67`). `quiz.ts:49-56` accepts client `courseId`/`week`.
- Impact: a student can submit 1 arbitrary (or correct) question ID and pass any module, mint `QuizResult`, advance `Topic/Module/CourseProgress`, and unlock assignments/projects/certificates. Incorrect grading & progress.
- Confidence: ✅ CONFIRMED.

**P0-3 · Quiz XP/badges are unreachable dead code (gamification broken)**
- Evidence: `quizService.ts:69` creates `QuizResult`; `:83` then queries `alreadyPassed` on `{userId, courseId, week, passed: true}` — the just-created row always matches; `:89` `if (userRecord && !alreadyPassed)` never true. The +100/+150 XP and `perfect_score`/`week_1_master` badges never fire.
- Impact: no quiz XP, no quiz-derived badges; dashboard points/leaderboards undercount. This was intended as the #100 anti-farming fix but over-corrected.
- Confidence: ✅ CONFIRMED (direct read + trace).

### P1 — High (maintainability, consistency, course delivery)

**P1-1 · Final exam is seeded but never served**
- Evidence: `FinalExamQuestion` (`schema.prisma:302`), reseeded 15-18/course (`reseed_c_full.ts:136-146`), zero references in `src/`; certificate requires module quizzes + payment only (`certificateService.ts:84-107`).
- Impact: students are promised "final examinations" (frontend copy) that never happen; the bank is dead weight and a maintenance hazard.
- Confidence: ✅ CONFIRMED.

**P1-2 · Practice Arena has exactly 5 questions and no way to add more**
- Evidence: `seed.ts:1027-1073` (5 rows); no admin CRUD for `PracticeQuestion` (route catalog); `GET /practice/questions` returns all-in-category.
- Impact: the arena is effectively empty; MCQs repeat instantly; the fCC-style 100+ question target is unattainable through the platform.
- Confidence: ✅ CONFIRMED.

**P1-3 · Reseed scripts silently destroy admin edits and per-topic progress**
- Evidence: `reseed_c_full.ts:79-114` `deleteMany` + recreate topics/questions; `TopicProgress` `onDelete: Cascade` (`schema.prisma:130`); no preservation guard in reseeds (only the dead seed.ts loop had one).
- Impact: any reseed discards CMS topic edits and wipes per-topic progress. Latent data loss.
- Confidence: ✅ CONFIRMED.

**P1-4 · Hardcoded "20" and "4-Week" assumptions in gates and UI**
- Evidence: project gate `>= 20` (`project.ts:48-57`); assignment `weekNum * 5` (`assignment.ts:49-57`); `CourseDetail.tsx:626` ("4-Week Immersion"), `:1238/:1241` (≥20 / "20 Chapters"), `:1261` (`weekNum * 5`); docs claim CADDED = 5 modules while content/live = 20.
- Impact: latent breakage for any course ≠20 modules; contradictory marketing copy ("4-Week") on a 20-module platform. Currently "works" only because every live course has 20 modules.
- Confidence: ✅ CONFIRMED.

**P1-5 · Challenge completion writes `ModuleProgress.quizPassed` without any quiz**
- Evidence: `challengeService.ts:173-179`.
- Impact: completing week-1 challenges (3 tasks) can mark a module quiz-passed and satisfy assignment gates — progress semantics corrupted.
- Confidence: ✅ CONFIRMED.

**P1-6 · Course/quiz/assignment gates trust client-supplied course/week**
- Evidence: `quiz.ts:49-56`; `assignment.ts:37-42`; `project.ts:38-42` (bodies carry courseId/week; only userId comes from JWT).
- Impact: writes can target arbitrary courses/weeks; combined with P0-2, progress integrity is weak.
- Confidence: ✅ CONFIRMED.

### P2 — Medium (duplication, tech debt, scalability)

- **P2-1 · Five-way course-metadata duplication with drift.** DB vs `config/courses.ts` vs `Home.tsx courseDetails` vs `courseMetadata` vs `seed.ts` list. CMS-created courses invisible in config-driven surfaces. ✅ CONFIRMED
- **P2-2 · Four generations of content code co-exist**, three dead (`curriculumData.ts`, seed loop, `cadded_curriculum.json`) — misleading for editors. ✅ CONFIRMED
- **P2-3 · Schema/migration drift:** 8 models without CREATE TABLE; `options` TEXT vs TEXT[]; orphaned `User.weekCompleted`. ✅ CONFIRMED
- **P2-4 · `Course.isPublished` ignored** by all read paths. ✅ CONFIRMED
- **P2-5 · Admin CMS gaps:** no course/module update UI; quiz-answer edit blank; no practice/challenge editing; analytics fake; mock upload sandbox. ✅ CONFIRMED
- **P2-6 · Duplicated progress/XP logic** in 4 services with divergent details (challenge writes quizPassed w/o score; practice XP differs). `businessRules.ts` dead. ✅ CONFIRMED
- **P2-7 · Quiz answer exposure in submit responses** (`correctAnswer` returned in breakdown) — reasonable UX, but means answers transit to the client; combine with forgeable grading. ✅ CONFIRMED
- **P2-8 · Hardcoded frontend enrichment can contradict live content** — CourseDetail "5-question quiz" copy, anti-patterns, diagrams, simulators, fake certificate preview (date/grade/₹699/human signature). ✅ CONFIRMED
- **P2-9 · Home mock Hall-of-Fame** fabricates named students on API failure. ✅ CONFIRMED

### P3 — Low (cleanup/documentation)

- **P3-1 · `reseed_c_beginner.ts` unwired/legacy.** ✅ CONFIRMED
- **P3-2 · Stale comments:** `CourseProgress.weekCompleted // 0 to 4`; "20 files" vs 18 content files; `Certificate.tsx` "4 weeks" copy. ✅ CONFIRMED
- **P3-3 · Local SQLite dev.db leftovers.** ✅ CONFIRMED
- **P3-4 · Local master 5 commits ahead of origin; uncommitted UI/auth work in the working tree** — content files unaffected. ✅ CONFIRMED
- **P3-5 · `backend-audit.md` vs `architecture-baseline.md` contradict each other** on where the passing threshold lives. ✅ CONFIRMED

---

## 23. Unknowns / Questions Requiring Confirmation

- ⚪ **Live DB row-level state** could not be queried directly (Postgres on VPS; no local DB running). Runtime facts were confirmed via the live API surface instead. The memory (2026-08-12) documents the live reseed state and is consistent with the API probe.
- ⚪ **Whether the live DB matches migrations exactly** — 8 tables have no `CREATE TABLE` migration, so their creation path (likely `prisma db push` on the VPS) is undocumented. The live API returning data from `PracticeQuestion`, `Challenge`, `CertificateRecord`, `Discussion` etc. proves those tables exist; the schema-vs-migration gap remains unconfirmed in production.
- ⚪ **Actual production QuizResult / progress rows** — the memory states 423 QuizResult rows, 0 TopicProgress rows; not re-verified here.
- ⚪ **Admin enrollment/read behavior at runtime** — CMS flows were verified by code; not exercised in a browser.
- ⚪ **The "10 courses" claim for `config/courses.ts`** from one sub-audit — direct count shows **9** (discrepancy resolved in favor of 9).
- ⚪ **Whether any external monitor sees `curriculumData.ts`** — confirmed dead in `src/`; dist artifacts compile it but nothing requires it.

---

## 24. Audit Conclusion

EduNexus Pro's content is **architecturally sound at the core**: a clean `Course → Module(week) → Topic(lesson) → QuizQuestion` hierarchy, a single DB runtime source of truth, deep hand-written content for all 9 courses, and a genuine (if partial) admin CMS. The student-facing lesson reader, quiz engine, practice arena, challenges, and certificates are all genuinely DB-backed and mostly API-driven.

But the supply chain has four structural problems that a content roadmap must confront:

1. **Entitlement is not enforced** on the learning content (P0-1) — the thing students pay for is freely readable by any logged-in account.
2. **Grading and progress integrity are weak** (P0-2, P0-3, P1-5, P1-6) — scoring can be gamed, quiz XP is dead, and challenge completion can fake module completion.
3. **There are two uncoordinated authoring paths** (CMS vs reseed) that overwrite each other, and per-topic progress is silently destroyed on reseed (P1-3).
4. **The platform outgrew its scaffolding**: dead code (`curriculumData.ts`, the seed loop, `cadded_curriculum.json`), duplicated metadata across five locations, hardcoded "4-week / 20-module" assumptions, an unserved final exam, and a 5-question practice arena.

The content itself was **not** judged here — that is deliberately deferred to the next phase. What this audit establishes is *where every piece of content comes from, who creates it, how it reaches students, which sources are authoritative, where duplicates and inconsistencies live, what content systems exist, and what is missing*. That evidence base is the foundation for the upcoming **Content Improvement & Curriculum Modernization Roadmap**.

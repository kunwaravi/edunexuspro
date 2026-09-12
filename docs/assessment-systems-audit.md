# EduNexus Pro — Assessment Systems Audit (STEP 7 & 8)

**Phase:** Content Quality & Curriculum Audit (MASTER PLAN v1.0), Steps 7–8
**Audit-only:** nothing modified — reads of `backend/src`, `backend/prisma`, and `frontend/src` only.
**Date:** 2026-08-14

---

## 1. Scope, method, coverage

This audit covers **every assessment-adjacent subsystem** in the platform and how much of it students can actually reach, plus the projects/assignments infrastructure.

**Read in full:**
- `backend/src/services/quizService.ts`, `routes/quiz.ts`
- `backend/src/services/practiceService.ts`, `routes/practice.ts`
- `backend/src/services/challengeService.ts`, `challengeRunnerService.ts`, `routes/challenge.ts`
- `backend/src/routes/project.ts`, `routes/assignment.ts`
- `backend/src/services/sandboxService.ts` (security model, header comment + wrapper)
- `backend/prisma/schema.prisma` (assessment models)
- `backend/prisma/seed.ts` (course skip logic + template generators), `challengeSeedData.ts`, reseed script headers (`reseed_cpp_full.ts`, `reseed_cadd_mech_full.ts`)
- `frontend/src/api/index.ts` + **endpoint-usage sweep** across `frontend/src` (keyword → file map)

**Coverage disclosure / evidence labels:**
- ✅ CONFIRMED — read directly from code/seed, cited by `file:line`.
- 🔶 INFERRED — reasonable reading not directly verifiable (e.g., live-DB state, deployment).
- ⚪ UNKNOWN — requires external verification (prod DB, running instance).
- **Deployment caveat:** code audited is the local repo (master). Per the Phase-1 deployment-state finding, the live site runs GitHub `main`, which can drift from this tree. Backend/route findings are ✅ against this tree; live parity is ⚪.
- No DB was queried; seeding counts come from the seed scripts and content files (all counted read-only in STEP 2).

---

## 2. Assessment-system inventory

Six distinct systems exist. Only three are reachable by students through the UI.

| # | System | Backend | Frontend usage | Content volume | Status |
|---|--------|---------|----------------|----------------|--------|
| 1 | Week / chapter quizzes | `routes/quiz.ts`, `quizService.getQuizQuestions` | `Quiz.tsx`, `CourseDetail.tsx`, `AdminDashboard.tsx` | 1,438 questions | ✅ **LIVE** |
| 2 | Topic quizzes (per-topic, 4 each) | `quizService.getTopicQuizQuestions` | same quiz UI | 2,820 questions | ✅ **LIVE** (randomization no-op) |
| 3 | Practice bank + daily challenge | `routes/practice.ts`, `practiceService.ts` | `PracticeArena.tsx`, `Dashboard.tsx` (daily) | DB table, explanations present | ✅ **LIVE** |
| 4 | Interactive auto-graded coding challenges | `routes/challenge.ts`, `challengeRunnerService.ts` | **none** — only `About.tsx` marketing copy | 11 seeded blocks | 🔴 **UI-ORPHANED** |
| 5 | Final exam questions | `FinalExamQuestion` model + seeding | **none** — zero refs in `backend/src` and `frontend/src` | 156 questions | 🔴 **DEAD CONTENT** |
| 6 | Projects / assignments submission | `routes/project.ts`, `routes/assignment.ts` | `ProjectStatusCard.tsx`, `CourseDetail.tsx`, `AdminDashboard.tsx` | no content-defined briefs | ✅ **LIVE** (see §4) |

Total question count: 1,438 + 2,820 + 156 = **4,414 quiz/final-exam questions** + an unmeasured practice table.

---

## 3. STEP 7 — Question-system findings

### 3.1 Week quizzes — served with no randomization at all
`getQuizQuestions` returns every question for a module in DB order, options untouched, no shuffle (`quizService.ts:17-19`). Students retaking a week quiz see identical order and option layout every time → pattern-learning on retakes. ✅
Options are never shuffled in **any** quiz path (`quizService.ts` and `quizService.ts:336-338`). ✅

### 3.2 Topic quizzes — the "randomized bank" is a no-op
`getTopicQuizQuestions` shuffles the bank then `slice(0, 5)` (`quizService.ts:336-338`). Every topic bank has **exactly 4** questions (STEP 2 inventory, 100% of 705 topics). `slice(0,5)` on 4 elements returns all 4 — the shuffle is pointless and there is no dynamic bank. The "randomized question bank experience" described in the comment does not exist. ✅

### 3.3 Grading is exact-string match, with no explanation capacity
All grading compares `userAnswer === q.correctAnswer` — an exact string compare against the stored option text (`quizService.ts:52`). The `QuizQuestion` model has `{ text, options[], correctAnswer }` and **no explanation field** (`schema.prisma:137-151`). So across **4,414** chapter/topic/final-exam questions there is no feedback content — the post-submit breakdown reveals right/wrong and the correct answer (`quizService.ts:54-64`) but never *why*. The `PracticeQuestion` model *does* carry an optional `explanation` (`schema.prisma:218`), which is returned in the practice breakdown (`routes/practice.ts:79`) — evidence the platform can do feedback, it just wasn't applied to course quizzes. ✅

### 3.4 XP / badge economy
- Pass threshold: **60%** (`quizService.ts:67`).
- XP: 100 base, +50 for a perfect score (`quizService.ts:90-93`).
- Badges: `perfect_score` (any perfect), `week_1_master` (**week 1 only**), `bug_hunter` (any practice correct) (`quizService.ts:98-103`, `routes/practice.ts:117-119`). There is no badge or bonus for finishing any *other* week — the gamification curve front-loads week 1 and is flat thereafter. ✅

### 3.5 XP-award is a non-atomic read-then-write (race)
The once-per-week guard is `findFirst` then `user.update` (`quizService.ts:83-112`) — two concurrent first-pass submissions can both pass the guard and double-award 100–150 XP. Notably, the **daily challenge** path in the same codebase solves exactly this with an atomic `updateMany` WHERE-guard (`practiceService.ts:108-121`). So the pattern is known and applied in one place, not the other. ✅ Severity P2 (XP farming under concurrency; integrity of the points economy, not content).

### 3.6 The interactive Challenge system — built, seeded, invisible
This is the most sophisticated assessment code in the platform:
- **Sandboxed runner:** user code executes in a separate child Node process via `sandboxService` — `ulimit -v/-t/-f`, wall-clock + CPU caps, process-group SIGKILL, `unshare -n` network isolation (`sandboxService.ts:10-24`). ✅
- **Assertion-based grading** for HTML/CSS/JS/Python/SQL, with per-assertion pass/fail, output capture, and a `__EDUNEXUS_RESULTS__` marker (`challengeRunnerService.ts:116-158`). ✅
- **Server-side completion:** auto-records only when *all* assertions pass (`routes/challenge.ts:50-56`); a hardcoded `/complete` bypass for graded challenges was closed (`routes/challenge.ts:82-99`, issue #100). ✅
- **Sequential gating** (previous challenge must be complete first) and XP +10, with module/course progress advancement (`challengeService.ts:93-203`). ✅
- **Seed:** "Phase 1. Only module/week 1 of WebDesign, Python and SQL get interactive challenges." (`challengeSeedData.ts:1-3`). Total seeded blocks: **WebDesign 6 + Python 3 + SQL 2 = 11** (`challengeSeedData.ts:234-238`). ✅
- **But the frontend never calls it.** `frontend/src` references "challenge(s)" only in `About.tsx` (marketing sentence) and `Dashboard.tsx` (the *daily practice* challenge, a different system, issue #74). There is no page, route, or component consuming `api/challenges/*`. ✅

**Consequence:** a secure, rate-limited, auto-graded coding-assessment engine exists, is wired end-to-end in the backend, and is seeded for 11 week-1 exercises — yet **no student can reach it through the UI**. Same dead-pattern as the final exam, at much higher implementation cost. This is the single largest under-utilised asset in the platform.

### 3.7 Final exam — confirmed dead content
- `FinalExamQuestion` model exists (`schema.prisma:302-313`); 156 questions are seeded across the 9 courses (STEP 2 inventory; reseed scripts replace per-course banks, e.g. `reseed_cadd_mech_full.ts:138-142`).
- **Zero references to `finalExam` in `backend/src` or `frontend/src`** (grep, 2026-08-14). No route serves it. ✅
- Bonus: before the reseed upgrade, the *old* `seed.ts` template generated **50 near-identical** boilerplate final-exam questions per course ("Which of the following is true concerning the core execution parameters of {course} systems under load?" — `seed.ts:206-226`). All 9 courses are now skipped from that path (`seed.ts:800-868`) and owned by their reseed scripts, so the live final-exam banks are the hand-written ones — but the 156 questions remain unreachable. ✅

---

## 4. STEP 8 — Projects & assignments

### 4.1 Project submission/evaluation — LIVE, but free-form
- Student submits `title, description, sourceCodeUrl, reportUrl, githubUrl`; admin approves/rejects with feedback; **+100 XP on APPROVED** (`routes/project.ts:38-91`, `169-184`). Peer-solutions browser gated on own approval (`routes/project.ts:189-231`). ✅
- **No content-defined brief or rubric is used.** The C++ course describes a capstone with a 7-point rubric in the *content* (`content/cpp.ts:923-926`), but the submission route accepts arbitrary metadata and never references any rubric or project prompt. The "capstone" a student must produce is never specified by the platform beyond prose. ✅
- **Hardcoded 20-module gate:** students must pass all 20 modules' quizzes before submitting (`routes/project.ts:48-56`). `quizService` was refactored to a *dynamic* module count (issue #70, `quizService.ts:34-35`) and even notes "CADDED courses have 5 weeks"; the project gate was **not** updated to match and still hard-requires 20. For any course that ever has ≠20 modules (or a 5-week CADDED), the final project becomes permanently un-submittable. Currently all 9 seeded courses have 20 modules, so this is latent, not breaking. ✅ / 🔶 (live course-module counts)

### 4.2 Assignment submission/evaluation — LIVE, gated by a fragile heuristic
- 4 weekly assignments; gate maps **assignment week N → module 5N** (`routes/assignment.ts:49-56`). This silently assumes exactly 20 modules *and* that module 5N is the natural "end of assignment week N." Content never defines such a mapping — the reseed courses have 4 topics/module and the old template courses 6 topics/module; nothing states module 5 = assignment 1. ✅
- **No file upload endpoint exists** (no multer/busboy/upload anywhere in `backend/src`); submissions default to `fileUrl = '/uploads/mock_' + fileName` (`routes/assignment.ts:79,88`). Assignments are file *names* + optional URLs, not stored artifacts. The `mock_` prefix strongly suggests the upload path is aspirational. ✅
- +20 XP on APPROVED (`routes/assignment.ts:179-184`). ✅

### 4.3 No content-defined assignment or project briefs anywhere
None of the 9 content files define per-week assignment prompts or project specs; the `Project` model (`schema.prisma:169-180`) is a separate showcase entity not tied to courses. The submission systems are generic envelopes: **the "what to do" never comes from the curriculum.** This corroborates the C++ deep-audit finding (P1: no in-content graded practical work) at the infrastructure level — for all 9 courses, not just C++. ✅

---

## 5. Critical findings (ranked)

| ID | Sev | Finding | Evidence |
|----|-----|---------|----------|
| A7-1 | **P1** | Final-exam questions (156) are dead content — no route, no UI, zero code refs. Summative assessment is absent from the entire platform. | grep result; `schema.prisma:302`; reseeds |
| A7-2 | **P1** | Interactive challenge engine is UI-orphaned: sandboxed auto-grader + 11 seeded exercises unreachable by students. Highest-cost under-utilisation. | `challengeSeedData.ts:1-3`; `frontend` usage map |
| A8-1 | **P1** | No content-defined assignment/project briefs or rubrics are referenced by the submission systems — "projects" are self-authored URL envelopes; the C++ capstone rubric is decorative. | `routes/project.ts:38-91`; `content/cpp.ts:923` |
| A7-3 | **P2** | Topic-quiz "randomization" is a no-op (`slice(0,5)` on 4-question banks); week quizzes aren't shuffled at all; option order never shuffled. | `quizService.ts:336-338`, `17-19` |
| A7-4 | **P2** | 4,414 course questions carry no explanation field — answer reveal gives correct answer but no learning feedback. | `schema.prisma:137-151` |
| A8-2 | **P2** | Hardcoded 20-module gates (project) and `week*5` module mapping (assignment) contradict the dynamic-module fix (#70); latent break for any ≠20-module course. | `routes/project.ts:48-56`; `routes/assignment.ts:49-56`; `quizService.ts:34-35` |
| A7-5 | **P2** | Non-atomic XP-award guard in `submitQuiz` — concurrent submissions can double-award (the daily-challenge path already solved this atomically). | `quizService.ts:83-112` vs `practiceService.ts:108-121` |
| A8-3 | **P3** | Assignment uploads are mock-path metadata; no real file storage. | `routes/assignment.ts:79,88` |
| A7-6 | **P3** | Badge/gamification curve is front-loaded (week-1 badge only); no recognition for completing later weeks. | `quizService.ts:101-103` |

---

## 6. Impact on the rubric (all 9 courses)

- **E. Assessment Quality (15%):** structurally capped by 3.7/4.3 — recall-only MCQ mix (per C++ sample), no explanations, no option randomization, and no reachable summative or coding assessment. The challenge engine *is* the mechanism to lift E (scenario-based, application-level, auto-graded) — currently invisible.
- **D. Practical Learning (20%):** projects/assignments exist as *infrastructure* but contribute ~0 to curriculum quality while no briefs or rubrics bind them to content. The only auto-graded practice (challenges) is unreachable.
- **F. Learning-Objective Alignment (10%):** no objectives exist to align (C++ P1 finding), so no assessment can demonstrate alignment; the 60%-pass quiz is the only completion gate.

---

## 7. Feed to the improvement roadmap

Candidates for the Phase 4 improvement waves (pending master gap matrix):
1. **Make challenges reachable** (frontend challenge page + wiring) — turns the most expensive assessment asset live with no content rewrite, using the existing 11 seeds as the pattern.
2. **Give the final exam a route or cut it** — either serve it (post-course summative, certificate gating) or remove the dead table.
3. **Bind project/assignment briefs + rubrics to content** (per-course specs; surface the C++ capstone rubric).
4. **Add explanation support** to `QuizQuestion` (schema + content + UI) and true option/question randomization; fix `slice(0,5)` to an actual draw or document it as "serve all 4."
5. **De-duplicate module-count logic** (dynamic helper shared by quiz/project/assignment gates).

*(Audit-only — none of the above was implemented. All changes remain proposals for the post-audit phase.)*

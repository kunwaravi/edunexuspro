# EduNexus Pro — Wave 0 Decision & Execution Package (Approval-Ready)

**Phase:** Wave 0 — convert the completed deep-scan into approval-ready decisions for the three highest-leverage items.
**Mode:** PLANNING ONLY — no code, database, content, curriculum, package, migration, or deployment change. The sole deliverable is this decision package.
**Sources:** the 9 per-course deep audits + independent second-pass validation + `catalog-synthesis.md` (all in `docs/content-deep-audit/`), re-verified against the live local Postgres `nexus` DB and `backend/src`/`frontend/src`.
**Date:** 2026-08-14

**Evidence labels:** [CONFIRMED] directly verified (DB query / `file:line` / grep) · [INFERRED] strong multi-source conclusion · [UNKNOWN — NOT VERIFIED] not verifiable with available data · [RECOMMENDATION] suggested, not a fact.

---

## 1. Executive Summary

The deep-scan is complete: catalog adopted score **60.4/100**, 9/9 course reports, independent second-pass validation, DB inspected, **no implementation performed**. Three decisions now gate all downstream remediation:

1. **CADD Civil (31/100 — Major Revamp):** the only course with an identity failure. Recommend **OPTION B — reposition honestly**; Option A (build a real Civil 3D track) is only justified by a funded civil business case that the audit found no evidence of.
2. **Final Exam (156 dead questions):** recommend **OPTION B — deprecate/remove**, with the 156 items archived and the interactive-challenge engine designated as the future summative vehicle. Option A (wire it) is viable only if a product summative is an explicit goal — and then only after validating every one of the 156 keys.
3. **Interactive Challenges (built, seeded, UI-orphaned):** recommend **APPROVE wiring** — the platform's only auto-graded application-level assessment exists end-to-end in the backend; only a frontend page is missing. Highest ROI, lowest risk of any catalog item.

All three can be decided independently now; execution order is D3 → D2 → D1 (see §7). Nothing in this package is implemented.

---

## 2. Current Audit Baseline

[CONFIRMED] — live `nexus` Postgres inventory, re-verified by all audit agents:

| Course (DB id) | Adopted | Modules | Topics | Topic Qs | Module Qs | Final Qs | Challenges | Band |
|---|---|---|---|---|---|---|---|---|
| Web Design | 78 | 20 | 80 | 320 | 160 | 15 | 6 | Strong |
| CADD Mech | 69 | 20 | 80 | 320 | 160 | 18 | 0 | Needs Improvement |
| Embedded | 69 | 20 | 80 | 320 | 160 | 18 | 0 | Needs Improvement |
| IoT | 63.5 | 20 | 80 | 320 | 160 | 18 | 0 | Needs Improvement |
| C++ | 61 | 20 | 80 | 320 | 160 | 18 | 0 | Weak |
| Python | 60.5 | 20 | 80 | 320 | 160 | 18 | 3 | Weak |
| Core C | 57 | 20 | 65 | 260 | 158 | 15 | 0 | Weak |
| SQL | 55 | 20 | 80 | 320 | 160 | 18 | 2 | Weak |
| **CADD Civil** | **31** | 20 | 80 | 320 | 160 | 18 | 0 | **Major Revamp** |
| **Catalog total** | **60.4** | 180 | 705 | 2,820 | 1,438 | **156** | **11** | |

Systemic facts relevant to all three decisions [CONFIRMED]: no learning-objective layer (9/9); no graded practical track; final exam dead (zero refs in `backend/src`+`frontend/src`); challenge engine UI-orphaned (zero `api/challenges/*` consumers in `frontend/src`); no `QuizQuestion.explanation` field; topic-quiz randomization a no-op; hardcoded 20-module gates; stale "Hinglish" DB descriptions (6 courses).

---

## 3. Decision 1 — CADD Civil

### 3.1 Audit finding (baseline)
- [CONFIRMED] Identity failure: course id `CADDED_Civil`, DB title **"CADDED Software (Civil/Architecture)"**; **12 of 20 weeks are architecture/structural BIM** (Revit Structure + Architecture, 3ds Max, SketchUp); **AutoCAD Civil 3D is never taught** — named only at `cadd_civil.ts:64,108`.
- [CONFIRMED] **Zero practical learning**: no exercises, datasets, or starter files; practice route returns **400 for any category other than `Programming`/`Electronics`** (`routes/practice.ts:16-17,51-52`); 0 challenges; 0 course-scoped projects (`Project` has no `courseId`).
- [CONFIRMED] 11 confirmed code/API defects (OSMODE 4133 comment, `NewLevel(3.6)` feet-as-meters, `AddView` void-return misuse, `ROOF_SLOPE` on a Floor, no-op ternary, `StairsRun.CreateStraightRun` missing `Document`, `RampRun`/`RunTreadsCount` concept mix, wrong `NewFamilyInstance` overload, V-Ray 2.x string, un-attributed rebar "07" key).
- [CONFIRMED] Topic quizzes are hidden for `CADDED_` in the UI yet still seeded; 320 topic questions leak into 24-question weekly mixed quizzes.
- [CONFIRMED] Only the prose quality is a strength (Content Quality ≈ 8/15 in second-pass). Score 31/100; P0×2, P1×4, P2×5, P3×4.
- [UNKNOWN — NOT VERIFIED] Whether a funded civil-jobs market or civil-domain authorship is available to support a build.

### 3.2 OPTION A — BUILD / RE-SCOPE INTO A REAL CIVIL TRACK
- **What changes required:** replace ~12 of 20 weeks of architecture/structural BIM with genuine Civil 3D workflows (survey data → alignments → profiles → corridors → grading → pipes/utilities → civil annotation → site plans), plus Civil 3D datasets, exercises, assignment briefs, and a civil capstone with rubric. Fix all 11 code/API defects or replace with civil-relevant examples. Add explicit software-version attribution.
- **Retain:** W1–W2 AutoCAD/civil fundamentals [CONFIRMED civil-leaning], general CADD drafting concepts, the course shell + quiz infrastructure, the 18 final-exam items (post-validation), portfolio/conclusion structure.
- **Rewrite:** the 12 architecture/structural weeks → civil equivalents.
- **Remove:** Revit Structure/Architecture deep content, 3ds Max/SketchUp content, C# Revit-API examples, architecture-flavored quizzes (incl. items testing untaught MIRROR / 1.0 diffuse multiplier [CONFIRMED]).
- **Add:** Civil 3D lessons + datasets, exercises, assignment/project briefs, civil capstone rubric, version attribution, civil-specific practice content.
- **Estimated scope:** Very High — the largest single content effort in the catalog (≥12 weeks rewritten + datasets + assessments).
- **Dependencies:**
  - *Technical:* extend the practice-route whitelist (`routes/practice.ts`) for civil categories; bind project briefs to `Project`/`ProjectSubmission`; reseed pipeline.
  - *Curriculum:* a Civil 3D module ordering; prerequisite mapping.
  - *Content:* civil-domain author; a named, current Civil 3D version; legally usable sample datasets.
  - *Assessment:* rebuild topic/module question banks for the civil weeks (existing ones are architecture-flavored).
  - *Project:* a civil deliverable spec (survey→design→drafting package) with rubric.
- **Risks:** high cost; risk of re-creating "CAD-in-the-abstract" (the exact defect the deep-scan flagged); Civil 3D licensing/data acquisition; author-expertise availability; long cycle.
- **Expected quality after implementation:** 65–75 [INFERRED] — only if practice + LO + assessment infra (Waves 3–4) also land; otherwise 45–55.
- **Effort:** Very High.

### 3.3 OPTION B — REPOSITION / RESHAPE THE EXISTING COURSE HONESTLY — ✅ IMPLEMENTED 2026-08-14 (reposition/rescope, verified end-to-end)
- **What changes required:** rename/re-describe the course to match what it actually teaches (CADD + BIM/Architecture foundation: AutoCAD, Revit, 3ds Max, SketchUp) — DB `title`/`description`, `frontend/config/courses.ts`, any marketing copy; align the W20 promise; fix the 11 code/API defects against the *actual* scope; add a practice layer for **this** scope (still required to clear P0-02); add software-version attribution; stop the hidden-topic-quiz leak.
- **Retain:** the substantial, current architecture/structural BIM content (12/20 weeks), AutoCAD/Revit/3ds Max/SketchUp coverage, quiz infrastructure, final-exam items (post-validation).
- **Rewrite:** course title/description/positioning only; the 11 code defects.
- **Remove:** "Civil" branding/claims that the curriculum does not support; civil-flavored passing mentions.
- **Add:** hands-on exercises + briefs/rubrics for the BIM scope; version attribution.
- **Estimated scope:** Medium (positioning + defect fixes + practice add-on).
- **Dependencies:**
  - *Technical:* extend practice-route whitelist for the course's categories; description reseed (reseed only sets on CREATE [CONFIRMED]); course metadata edit.
  - *Curriculum:* none structural — repositioning, not restructuring.
  - *Assessment:* fix the defective items; the banks remain architecture-scoped (now honest).
  - *Project:* a BIM capstone brief + rubric for the actual scope.
- **Risks:** low technical; reputational risk if renaming away from "Civil" is communicated poorly; potential loss of any civil-positioned marketing. Does not solve a *civil* skills gap if one exists in the market.
- **Expected quality after implementation:** 55–65 [INFERRED] — identity honesty + defect fixes + practice-to-scope + (needed) infra waves.
- **Effort:** Medium.

#### Implementation record (2026-08-14) — all sub-tasks verified end-to-end
- **D1a — Metadata repositioned:** reseeded the DB `Course` row to `CADD & BIM Foundation (Architecture/Visualization)` (title/description updated on mismatch — the reseed previously only set these on CREATE [CONFIRMED-D1a]); synced `frontend/src/config/courses.ts` (title, titleShort, `category: 'Design'`, tags, desc/descShort) and `Home.tsx` catalog + milestone. Zero old-title references remain in live code (`backend/src`, `frontend/src`, `backend/prisma`).
- **D1b — 11 code/API defects fixed + version attribution:** `content/cadd_civil.ts` — OSMODE 167 (End+Mid+Cen+Int+Perp), Revit level via `ConvertToInternalUnits(3.6, DUT_METERS)`, slope offset units fix, `Viewport.Create` sheet placement, `NewSlopeArrow` roof slope, dead material ternary removed, rebar shape-family attribution (default metric `"07"` stirrup), `NewFamilyInstance` door, V-Ray 6 renderer, `CreateStraightRun(doc, stairs.Id, …)`, ramp-path run note + `TaskDialog`. Banner names Revit 2024 / AutoCAD 2024 / 3ds Max 2024 (V-Ray 6) / SketchUp 2024 as illustrative teaching code. All 11 verified present in the reseeded DB.
- **D1c — Quiz hygiene + rebar attribution:** `cadd_civil.ts` + `cadd_civil_topic_quizzes.ts` — absurd distractors replaced (`Feet and inches`, `Ambient, global and bounce`, `Pass if drawn to scale`, `Showing the stair in yellow with a warning`), section-plane quiz keyed to the SECTIONPLANE answer, rebar shape stems attributed to Revit's default metric shape families. Verified: all four old distractors are zero in the DB, new values present.
- **D1d — Hidden-topic-quiz leak stopped:** removed every `CADDED_` special-case in `CourseDetail.tsx` (topic-lock bypass, hidden topic-quiz card, next-topic gate, `Done & Go to Quiz` label). Both CADDED courses have 80/80 topics with per-topic quizzes in the DB, so the uniform lock/quiz flow now applies with no dead ends. Stale `quizService.ts` "5 weeks" comment updated (both CADDED reseeds run the full 20-week curriculum).
- **D1e — Practice layer (clears P0-02):** `practice.ts` whitelist extended to `Design` (questions + submit); 13 CADD/BIM practice questions seeded from new `content/cadd_bim_practice.ts` (AutoCAD, Revit Arch + Structural/rebar, 3ds Max/V-Ray, SketchUp, BIM fundamentals); per-course sidebar "Practice" entry added (`practiceCategory` in `courses.ts` → SyllabusManager link to `/practice/arena?category=Design`); arena coding-mode hidden for non-coding categories so a Design learner never sees the C/C++/IoT templates; BIM capstone brief + rubric added (`docs/content-deep-audit/cadd-bim-capstone-brief.md`, survey → site plan → massing/render → Revit model → structural rebar → coordinated sheets) and the W20 module description now points at it.
- **Verification (local `nexus` DB):** `npm run seed:caddcivil:full` → `Updated Course … (repositioned)`, 20 modules / 80 topics / 320 topic quizzes / 160 chapter quizzes / 13 Design practice questions. Backend `tsc` (project config) + prisma-file compile, frontend `tsc -b`, and full `vite build` all clean. DB spot-checks confirm the new title, all 11 fixed code blocks, the corrected quizzes, and the capstone W20 description.
- **Out of scope (unchanged):** LO layer, graded-practical-track build, course-gap content. Propagation to the live site requires a commit/push of the working tree (not done — per standing instruction).

### 3.4 Recommendation
**[RECOMMENDATION] OPTION B.** The audit provides no evidence of a funded civil requirement or civil-author availability; it provides strong evidence that the architecture/BIM content is substantial, internally consistent with the DB title, and worth preserving. B is the honest, low-risk path that clears both P0s. A should be treated as a *separate, deliberately-scoped project* undertaken only if the owner has a real civil business case — not as a Wave 1 fix. **Owner decision required; this is the hard gate for every CADD Civil remediation item.**

---

## 4. Decision 2 — Final Exam

### 4.1 Audit finding (baseline)
- [CONFIRMED] 156 questions exist (`FinalExamQuestion`, `schema.prisma:302-313`; fields: `id/courseId/text/options/correctAnswer` — **no explanation field**): C 15, WebDesign 15, seven other courses 18 each. Hand-written and distinct (reseed scripts replace the old template banks).
- [CONFIRMED] **Dead content**: zero references in `backend/src` and `frontend/src` — no route, no UI, nothing serves it.
- [CONFIRMED] **Gates nothing**: certificates are admin-verified (issue #101) and require module-quiz completion + payment; progress is quiz-driven. No dependency exists.
- [CONFIRMED] **Unvalidated keys**: proven wrong in Core C (DB `QuizQuestion` 473 — struct/union sizes, correct option present but unkeyed). Coverage gaps: C exam covers 12/20 weeks; C++ omits W2/W13/W18/W20; CADD Civil items test untaught MIRROR (636) and 1.0-diffuse-multiplier (638).
- [CONFIRMED] No live duplication (never served); no unique assessment function today.

### 4.2 OPTION A — WIRE AND SERVE THE FINAL EXAM
- **Backend work:** new route + service: `GET /api/courses/:courseId/final-exam` (questions WITHOUT keys), `POST .../submit` (server-side grading, score + per-item result), optional attempt record. Reuse patterns from `quizService` but never return keys pre-submit.
- **Frontend work:** exam page (question stepper, submit, result view), navigation from course detail, post-exam state.
- **Database work:** no schema change strictly required; optionally an exam-attempt table for records. `FinalExamQuestion` stays.
- **Scoring requirements:** server-side scoring; per-course exam; score = correct/total.
- **Question-selection logic:** serve all per-course questions, or sample N (with seed for reproducibility); the banks are small (15–18) so sampling is optional.
- **Randomization:** shuffle question order + option order server-side (the platform currently shuffles nothing [CONFIRMED]).
- **Pass criteria:** product decision (e.g., 60%, mirroring quizzes [INFERRED]).
- **Feedback requirements:** [CONFIRMED] `FinalExamQuestion` has no explanation field — reuse the challenge/`PracticeQuestion` pattern (which has `explanation` [CONFIRMED]) or accept right/wrong-only. Right/wrong-only fails the catalog's own feedback standard (S5).
- **Certificate/progression implications:** currently none. **Wiring the exam to certificates would change the admin-verified certificate flow — a product decision**, not an implementation detail.
- **Security/integrity concerns:** **validate all 156 keys before serving** (proven-wrong key exists [CONFIRMED]); keys must never reach the client pre-submit; rate-limiting/anti-replay; question-bank exposure on a paid product; client can scrape 156 items on retakes.
- **Effort:** Medium-High. **Risk:** Medium (unvalidated items).

### 4.3 OPTION B — DEPRECATE / REMOVE THE DEAD SYSTEM — ✅ IMPLEMENTED 2026-08-14 (deprecate + archive, verified)
- **Safely removable [CONFIRMED]:** the 9 reseed final-exam bank blocks; the `FinalExamQuestion` table (or leave inert); the (already-skipped) template generator in `seed.ts`; any docs referencing the exam.
- **Dependencies to check before removal:** [CONFIRMED] zero code refs — verify no admin UI, no route, no report references (deep-scan + greps: none). [UNKNOWN — NOT VERIFIED] any third-party tooling/reporting that queries the table outside `backend/src`/`frontend/src`.
- **Historical content:** [RECOMMENDATION] archive the 156 questions to `docs/` or a JSON snapshot (cheap, preserves the work for a future validated summative).
- **Replacement summative needed:** [RECOMMENDATION] yes — designate the **interactive-challenge engine** (Decision 3) as the summative vehicle, per the audit's own conclusion that it is the superior auto-graded mechanism. If a recall MCQ summative is later wanted, it should be rebuilt validated (with explanations), not resurrected.
- **Effort:** Low.

**Implementation record (2026-08-14):**
- **Archived** all 156 `FinalExamQuestion` rows (9 courses: C 15, C++ 18, CADDED_Civil 18, CADDED_Mech 18, Embedded 18, IoT 18, Python 18, SQL 18, WebDesign 15) to `docs/final-exam-archive/final-exam-questions.json` — valid JSON, full row fidelity (id, courseId, text, options, correctAnswer, createdAt, updatedAt). Counts match the audit exactly.
- **Removed final-exam seeding** from all 9 `backend/prisma/content/*.ts` (interface + banner + `export const XFinalExam` array) and all 9 `reseed_*_full.ts` scripts (import, `deleteMany`+`create` block, log line).
- **Removed `generateFinalExamQuestions()`** and the seeding block from `seed.ts`, replaced with a deprecation comment pointing at the archive and the challenge engine as replacement summative.
- **Left the `FinalExamQuestion` table + Prisma model inert** — no migration in Wave 1 (constraint); the table simply holds archived rows. Historical `migration.sql` untouched.
- **Zero-ref verification:** no final-exam references remain in `backend/src` or `frontend/src`; the only surviving mentions are the inert schema model, historical migration SQL, decision-pack prose, and legitimate "Final Exam Prep" review-week module titles in sql course content (real content, not the exam bank).
- **Verification:** `tsc` on all 19 prisma scripts + `tsc -b` on backend src both EXIT 0; `git diff --stat` shows the deletions (c.ts −134, webdesign.ts −128, python.ts −127, seed.ts −44).
- Next (approved order): **D1** — reposition/rescope CADD Civil (Option B) — ✅ **COMPLETE 2026-08-14**, see §3.3 implementation record.

### 4.4 Recommendation
**[RECOMMENDATION] OPTION B.** The exam performs no current function, is unvalidated with a proven-wrong key, has no certificate/progress dependency, and the platform owns a superior summative mechanism. **OPTION A is correct only if the owner explicitly wants a product summative now** — and then it must validate all 156 items and should reuse challenge-style auto-grading rather than shipping the raw recall-MCQ bank. **Owner decision required.**

---

## 5. Decision 3 — Interactive Challenges

### 5.1 Current state (all [CONFIRMED])
- **Backend capability:** full challenge subsystem — model (`Challenge`, `schema.prisma:346-370`), routes `challenge.ts` (`GET /course/:courseId`, `GET /counts`, `GET /:id`, `POST /:id/run-test`, `POST /:id/complete`; **all `authenticateToken`**; `run-test` rate-limited 15/min/IP), service (`challengeService.ts`: sequential gating, XP +10, module/course progress), runner (`challengeRunnerService.ts:116-158`: assertion grading, per-assertion pass/fail, stdout capture), sandbox (`sandboxService.ts:10-24`: child process, `ulimit -v/-t/-f`, wall-clock + CPU caps, process-group SIGKILL, `unshare -n` network isolation). Auto-records completion only on all-pass (`challenge.ts:50-56`); the `/complete` bypass is closed (issue #100); `solutionCode` is stripped server-side (`challengeService.ts:66`).
- **Challenge data:** 11 seeds, all week 1 — WebDesign 6, Python 3, SQL 2 (`challengeSeedData.ts:1-3,234-238`). 0 challenges on the other 6 courses.
- **Frontend reachability:** none. "challenge" appears in `frontend/src` only in About.tsx marketing copy and the Dashboard daily-practice widget (a different system). No page/route/component calls `api/challenges/*`.

### 5.2 Gaps to close (wiring plan)
- **Missing routes/components:** a per-course challenge list page; a challenge editor/runner view; a Run Tests action; a results panel (per-assertion pass/fail + captured stdout); completion→progress UI refresh (module/course + XP); navigation from the course curriculum.
- **Auth/enrollment requirements:** auth is enforced [CONFIRMED]. Course **enrollment** gating is [UNKNOWN — NOT VERIFIED] platform-wide (the C audit flagged no enrollment/payment gate); wire the challenge pages to the same enrollment model as the rest of the course content — do not introduce a new gate.
- **Grading/progress implications:** backend already handles grading + progress; the UI must reflect completion (refresh `moduleProgress`/`courseProgress`, XP, sequential unlock).
- **Security considerations:** the sandbox is the security boundary (already hardened); keep `run-test` server-side and rate-limited; never expose `solutionCode`; confirm `testCode` exposure is intended (FCC-style challenges may show tests — product decision).
- **Estimated implementation scope:** Medium — **frontend-only** for the 11 existing seeds; no backend change required.
- **Expected learning-value improvement:** adds the platform's first auto-graded **application-level** assessment; lifts Practical + Assessment dimensions for the 3 seeded courses and establishes the pattern for all 9; directly addresses systemic gaps S2/S4 [INFERRED from audit].

### 5.3 Minimum Viable Wiring Plan — ✅ IMPLEMENTED 2026-08-14 (frontend-only, verified end-to-end)
1. Challenge list: route `/courses/:courseId/challenges` → `GET /course/:courseId`; render blocks + completion state + sequential locks.
2. Challenge view: render description/instructions/`seedCode`; code editor; **Run Tests** → `POST /:id/run-test`.
3. Results: render per-assertion pass/fail + captured stdout; on all-pass show success.
4. Progress: after all-pass, refresh module/course progress + XP in the UI.
5. Navigation: link from `CourseDetail` curriculum to the course's challenges.
6. (Post-MVP, [RECOMMENDATION]) expand seeds beyond week 1; add challenges to the remaining 6 courses.

**Implementation record (2026-08-14):**
- New `ChallengeListPage` at `/course/:id/challenges` → `GET /api/challenges/course/:courseId`; renders blocks, per-challenge completion state, and sequential locks. (Route param follows the codebase's `/course/:id` convention rather than the plan's `/courses/:courseId`.)
- New `ChallengeRunnerPage` at `/challenges/:challengeId` → `GET /api/challenges/:id`; renders description + instructions (markdown), seedCode editor (SQL starts blank — seedCode there is DB bootstrap, not the answer), **Run Tests** → `POST /api/challenges/:id/run-test`; renders per-assertion pass/fail + captured stdout; on all-pass shows success and calls `refreshUser()` to sync XP + module/course progress.
- Sidebar navigation: `SyllabusManager` "Challenges" entry (with `completed/total` badge) driven by `GET /api/challenges/counts`, shown only for courses that have challenge content (WebDesign, Python, SQL).
- No backend changes. `tsc`, `eslint`, and `vite build` all pass. Live smoke-tested against the running API: list/counts/single shapes match; correct solution → `passed:true 4/4`, XP +10, `ChallengeProgress` row created; wrong code → `passed:false` with per-test messages and **no** completion write.
- Next (approved order): **D2** — deprecate/archive the final exam.

---

## 6. Cross-Decision Dependencies

| From → To | Dependency | Type |
|---|---|---|
| D2 (deprecate) → D3 (wire) | If the final exam is removed, challenges become the de-facto summative. Choosing D3 later contradicts D2-B's "replacement needed" note only if a summative is wanted now. | Logical coherence |
| D1 (either option) → D2/D3 | CADD Civil gains no challenges/exam changes until its scope is fixed; its 18 exam items are in limbo until D2. | Sequencing |
| D3 → D1 practice | The practice-route whitelist fix (needed for D1 practice) is separate from challenge wiring; D3 does not depend on D1. | Independent |
| D1 + D2 → Wave 1 content | CADD Civil defect fixes and the 156-item fate gate the Wave 1 content-correction tranche. | Execution |
| D1/D2/D3 → LO layer (Wave 3) | None of the three decisions require the LO layer; all are independent of the content-model change. | Independent |

[INFERRED] No decision in this package blocks another at the *decision* stage; the dependencies are execution-order and logical-coherence only.

---

## 7. Recommended Order of Execution

1. **D3 — Wire challenges (APPROVE).** Highest ROI, lowest risk, frontend-only, independent. Begin immediately after approval.
2. **D2 — Deprecate final exam (APPROVE).** Low-effort hygiene (archive + remove); removes dead data and the proven-wrong-key liability.
3. **D1 — CADD Civil reposition (OPTION B).** Medium effort; unblocks the only Major-Revamp course and the CADD Civil Wave 1 content fixes.
4. Then **Wave 1 content correctness** (SQL 11477, C 473, Python/C++/Embedded/CADD item defects) — content-file + reseed, no code.
5. Then **Wave 2 assessment infrastructure** (explanations + randomization + dynamic gates).
6. Then **Waves 3–5** (LO layer, graded practical track, course gap content) per the synthesis roadmap.
7. **Re-score** at the end to measure movement (Wave 6).

---

## 8. Effort vs Impact Matrix

| Decision | Option | Effort | Impact | Risk | Recommendation |
|---|---|---|---|---|---|
| D1 CADD Civil | A — Build civil track | Very High | High (if funded) | High | Only if business case exists |
| D1 CADD Civil | **B — Reposition honestly** | Medium | Medium-High | Low | **Recommended** |
| D2 Final Exam | A — Wire & serve | Medium-High | Medium | Medium (unvalidated) | Only if summative is a goal |
| D2 Final Exam | **B — Deprecate/archive** | Low | Medium (hygiene) | Low | **Recommended** |
| D3 Challenges | **Approve wiring** | Medium | High | Low | **Recommended** |

---

## 9. Risks

1. **D1-A cost overrun / abstract-CAD recurrence** — mitigated by choosing B absent a business case.
2. **D1-B brand confusion** — communicate the reposition; "Civil" removed from an architecture course is a marketing decision, not a content one.
3. **D2-A shipping unvalidated items** — a proven-wrong key exists [CONFIRMED]; any wiring must be preceded by full 156-item validation.
4. **D2-B losing the summative concept** — mitigated by designating challenges (D3) as the summative vehicle.
5. **D3 sandbox escapes** — existing mitigations (ulimit, unshare, caps, rate limit) [CONFIRMED]; keep run-test server-side; treat as a security boundary during code review.
6. **Enrollment/payment gating absent** [CONFIRMED platform-wide, from C audit] — any assessment wiring rides on an un-gated product; flag for product attention regardless of these decisions.
7. **Deployment drift** — live product runs GitHub `main`, local is `master` [CONFIRMED, Phase-1 finding]; all implementation must branch from `main`.
8. **Reseed discipline** — content/reseed changes must be idempotent and DB-verified; descriptions only update on CREATE [CONFIRMED].

---

## 10. Open Questions (owner)

1. **D1:** Is there a funded civil-jobs market or civil-domain author available? (If no → B is definitive.)
2. **D2:** Does the product want a learner-visible summative assessment now? (If yes → reconsider A with validation.)
3. **D3:** Should challenge content be expanded beyond week 1 / to the other 6 courses in Wave 2? (Approved as MVP either way.)
4. **Product:** Should certificate issuance remain admin-verified, or become assessment-gated (quiz/exam/challenge)? (Affects D2 only if A.)
5. **Product:** Is the missing enrollment/payment gate in scope for remediation? (Platform-wide integrity item surfaced by the Core C audit.)

---

## 11. Approval Checklist

- [x] D1 option selected — **B (reposition/rescope honestly)**
- [x] D2 option selected — **B (deprecate/archive)**
- [x] D3 approved — **wire challenges into learner frontend**
- [ ] Implementation base confirmed: **GitHub `main`** (not local `master`)
- [ ] 156 final-exam items archived (D2-B)
- [ ] Reseed/idempotence policy confirmed for all content changes
- [ ] Scope confirmed: no LO layer, no graded-practical-track build, no course gap content in Wave 0/1
- [ ] Non-goals confirmed: no package installs, no migrations, no deploys during Wave 1
- [x] Owner sign-off recorded (2026-08-14)

---

## OWNER APPROVAL — RECORDED 2026-08-14

- **CADD Civil** → **OPTION B — Reposition/rescope honestly** ✅
- **Final Exam** → **OPTION B — Deprecate/archive** ✅
- **Interactive Challenges** → **APPROVE — wire into learner frontend** ✅

**Execution order:** **D3** (wire challenges) → **D2** (final-exam deprecation/archive) → **D1** (CADD Civil repositioning).

Wave 1 implementation is now authorized to begin in that order. As of this record, no content, code, database, curriculum, or deployment has been changed.

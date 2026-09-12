# EduNexus Pro — Wave 1 Decision & Remediation Specification

**Purpose:** convert Wave 1 audit findings into an **implementation-ready decision and remediation specification**.
**Mode:** AUDIT / PLANNING ONLY — no code, content, database, or schema modified. No fixes implemented.
**Source:** the completed Content Quality & Curriculum Audit (master report `content-quality-audit-master-report.md`, `assessment-systems-audit.md`, and the 9 per-course audits). No findings invented beyond the audit; all extrapolation is labelled 🔶/⚪.
**Date:** 2026-08-14
**Companion gate:** Wave 1 Implementation & Content Correction must **not** start until the decisions in §§4–6 are approved by the owner.

---

## 1. Executive Summary

Wave 1 is the correctness + assessment-infrastructure tranche of the audit's improvement roadmap. It contains **4 P0 findings**, **17 P1 findings**, and the **3 decision-critical items** the owner must resolve before implementation can begin: **CADD Civil identity, the final exam's fate, and the interactive-challenge engine**. A fourth item (IoT retired services) is confirmed and scoped but not decision-critical.

**Key facts that make Wave 1 tractable:**

- **Two P0 defects are pure content-file corrections** (SQL unanswerable item, C wrong final-exam answer) — no code, no migration, just the content file + a reseed.
- **The highest-ROI Wave 1 item is not a content rewrite** — it is *wiring the already-built, already-seeded interactive challenge engine into the frontend*. The backend, sandboxed autograder, and 11 seed challenges exist today (§6).
- **CADD Civil and the Final Exam are the only true decision gates.** Everything else proceeds independently once their decisions are made.
- **Deployment base:** per the Phase-1 deployment-state finding, the live site runs GitHub `main` (ahead of local `master`). All implementation must branch from **GitHub `main`**, not this local tree. This spec's citations are to the audit's files, which are the live content source.

**Count:** 21 unique findings (4 P0 + 17 P1), 3 decision gates, 1 decision-blocked content area, 18 immediate defect rows.

---

## 2. P0 Findings

Format per finding: **Finding · Course/System · Severity · Evidence · Current behavior · Educational impact · Technical dependency · Confidence · Recommended decision.**

### P0-01 — CADD Civil is not a civil curriculum
- **Course/System:** cadd_civil (CADDED_Civil)
- **Severity:** P0
- **Evidence:** ✅ `cadd_civil.ts:64,108` — AutoCAD Civil 3D (alignments, profiles, corridors, grading, pipes) named only in passing; 12 of 20 weeks are architecture/structural (Revit Structure + Architecture, 3ds Max, SketchUp). Full audit: `content-quality-audit-cadd_civil.md` §A.
- **Current behavior:** a course titled *Civil* teaches architectural/structural BIM workflows.
- **Educational impact:** a learner enrolling for civil drafting/survey workflows receives no civil content — the core promise is unmet for the entire course.
- **Technical dependency:** none at the code level; a decision (§4) determines whether this becomes a curriculum build or an honest re-scope.
- **Confidence:** ✅ CONFIRMED (full read).
- **Recommended decision:** **BLOCKED — owner decision required** (§4). Cannot be remediated as a defect; it is a scope decision.

### P0-02 — CADD Civil has zero hands-on practice
- **Course/System:** cadd_civil
- **Severity:** P0
- **Evidence:** ✅ full-file search in `content-quality-audit-cadd_civil.md` — no exercises, assignments, projects, or datasets in `cadd_civil.ts` or `cadd_civil_topic_quizzes.ts`; W20 "portfolio" referenced with no briefs behind it.
- **Current behavior:** students answer 160 chapter + 320 topic MCQs and nothing else; no practical deliverable exists.
- **Educational impact:** criterion D collapses to 3.0; the course cannot produce a job-ready drafter. Sensitivity noted: D=2 ⇒ total 59 → Major Revamp.
- **Technical dependency:** none at the code level; requires content build (or re-scope removes the obligation).
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **BLOCKED — follows P0-01.** If re-scope chosen, "zero practice" is remediated against the new scope; if build chosen, practice content is part of the build.

### P0-03 — SQL W10 topic quiz item is unanswerable
- **Course/System:** sql
- **Severity:** P0 (blocking a topic-lock gate)
- **Evidence:** ✅ `sql_topic_quizzes.ts:260` — the stem asks "Which command evolves the schema…" but the option `ALTER TABLE` is not among the answer choices; the keyed option is the phrase from the stem.
- **Current behavior:** the question cannot be answered correctly; it sits on a topic-quiz gate.
- **Educational impact:** a learner on this topic faces an impossible item — a hard failure point and a demoralizing, invalid gate.
- **Technical dependency:** content-file correction (`sql_topic_quizzes.ts`) + re-run `reseed_sql_full.ts` to propagate; no migration, no code change.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix — rewrite the item** (valid stem/options/key, add explanation). Part of the immediate-defect table (§8, D01).

### P0-04 — C final-exam Q8 has a factually wrong key
- **Course/System:** c
- **Severity:** P0 (wrong answer on a certification item)
- **Evidence:** ✅ `c.ts:2122-2129` — struct `{int x}` keyed larger than union `{int y; char z}`; a compiled probe confirms both are 4 bytes, contradicting the course's own union rule (`c.ts:1377`).
- **Current behavior:** the exam answers `struct A is larger` when sizes are equal.
- **Educational impact:** a student is told a false fact in the "Certification Prep" assessment; the answer-reveal actively teaches an error.
- **Technical dependency:** content-file correction (`c.ts`) + re-run `reseed_c_full.ts`; no migration.
- **Confidence:** ✅ CONFIRMED (compiled probe).
- **Recommended decision:** **Fix — correct key/options** (or rewrite the item so sizes differ, e.g., struct with two members). D02.

---

## 3. P1 Findings

Format: **Finding · Evidence · Current behavior · Impact · Dependency · Confidence · Recommended decision.**

### P1-01 — No learning-objective layer (all 9 courses)
- **Evidence:** ✅ topic model exposes only `{title, text, code, note}` (`cpp.ts:12-17`); F capped at 3.0–4.0 across the catalog (§12 master report).
- **Current behavior:** week `description` fields state coverage, not outcomes; no objectives→assessment map.
- **Impact:** alignment is unverifiable; F is structurally capped for every course.
- **Dependency:** content-model change + 705-topic content pass (Wave 3). Not a Wave 1 defect — a catalog standard.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Defer to Wave 3** (LO layer). Do not attempt in Wave 1.

### P1-02 — No graded practical track (all 9 courses)
- **Evidence:** ✅ §14 master report; submission routes accept arbitrary metadata (`routes/project.ts:38-91`); C++ capstone rubric (`cpp.ts:923-926`) never referenced.
- **Current behavior:** projects/assignments are URL envelopes with no content-defined briefs or rubrics; no course has assessed practice.
- **Impact:** D capped; capstones are prose narratives.
- **Dependency:** content build + (optionally) binding to submission flow (Wave 4). Not a Wave 1 defect.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Defer to Wave 4.** Not blocked by any decision.

### P1-03 — Final exam (156 questions) is dead content
- **Evidence:** ✅ zero refs to `finalExam` in `backend/src` or `frontend/src` (grep, 2026-08-14); `FinalExamQuestion` model exists (`schema.prisma:302-313`); seeded by reseed scripts.
- **Current behavior:** 156 hand-written questions are served to no one.
- **Impact:** no summative assessment anywhere in the product; exam questions unvalidated (never student-exercised).
- **Dependency:** **owner decision** (§5) — Wire (routing + UI + validation) or Deprecate (remove table + seed code).
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **BLOCKED — owner decision required** (§5).

### P1-04 — Interactive challenge engine is UI-orphaned
- **Evidence:** ✅ `challengeSeedData.ts:1-3` (11 seeds: WebDesign 6, Python 3, SQL 2, week 1 only); full backend (`routes/challenge.ts`, `challengeService.ts`, `challengeRunnerService.ts`, `sandboxService.ts`); **no frontend consumer** — "challenge(s)" appears in `frontend/src` only in About.tsx marketing copy.
- **Current behavior:** a sandboxed, rate-limited, assertion-graded coding-assessment engine exists end-to-end but no student can reach it.
- **Impact:** the platform's only application-level auto-graded assessment is invisible; E and D are artificially capped.
- **Dependency:** frontend wiring only (§6); no content rewrite required to make the 11 seeds reachable.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix — wire into frontend** (Wave 2, but highest-ROI item; see §6). Recommend confirming scope with owner (§4 decision C).

### P1-05 — IoT teaches retired cloud services
- **Evidence:** ✅ `iot.ts:681` Google Cloud IoT (retired 2023-08-16); `iot.ts:732` Azure Time Series Insights (retired 2025-03). Both web-verified by the IoT auditor. Context: passing mentions in current lists (W15 platform spectrum; W16 TSDB family).
- **Current behavior:** students are told these are viable platform choices.
- **Impact:** learners may build on retired services or are misled about the current ecosystem; credibility damage.
- **Dependency:** content-file edits (`iot.ts`) + `reseed_iot_full.ts`; does **not** affect surrounding lessons or quizzes (surrounding content — ThingsBoard, AWS IoT Core, InfluxDB, TimescaleDB — is current).
- **Confidence:** ✅ CONFIRMED (mentions), ⚪ (quiz cross-reference — none cited; see §7).
- **Recommended decision:** **Fix — replace with current alternatives or remove the names** (D17, D18).

### P1-06 — SQL capstone EXCLUDE DDL is non-runnable
- **Evidence:** ✅ `sql.ts:890-891` `tsrange(starts_at, ends_at)` on `timestamptz` columns — must be `tstzrange`; both EXCLUDE examples need unmentioned `CREATE EXTENSION btree_gist` for int equality (`sql.ts:808`).
- **Current behavior:** the capstone's exclusion-constraint example fails to execute as written.
- **Impact:** a learner's capstone attempt errors at the DDL step.
- **Dependency:** content-file correction (`sql.ts`) + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D19, added below the six spec'd groups as a confirmed P1 item — see §8 note).

### P1-07 — SQL TRUNCATE mis-taught
- **Evidence:** ✅ `sql.ts:467` (hedged lesson), `sql.ts:479` + `sql_topic_quizzes.ts:267` (quizzes assert TRUNCATE is not rollback-able; false for PostgreSQL).
- **Current behavior:** learners are tested on a factually wrong transactional claim.
- **Impact:** teaches an error that matters in production data operations.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D20).

### P1-08 — Embedded xPSR/PRIMASK error
- **Evidence:** ✅ `embedded.ts:321` claims xPSR contains "interrupt mask (PRIMASK)". Per ARMv7-M, PRIMASK is a separate special register, not an xPSR field.
- **Current behavior:** lesson teaches an incorrect register model.
- **Impact:** students misread the exception architecture — a foundational embedded error.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED (auditor states confirmed against spec).
- **Recommended decision:** **Fix** (D03).

### P1-09 — Embedded STM32F4 clock tree out-of-spec
- **Evidence:** ✅ `embedded.ts:102` "APB1 (÷2=64 MHz)" exceeds the F4's 42 MHz APB1 limit; `embedded.ts:411` TIM2 1 ms example assumes a non-default 16 MHz timer clock.
- **Current behavior:** the taught clock tree and timer math are out-of-spec for the target part.
- **Impact:** hardware exercises won't behave as taught on real F4 hardware.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D04).

### P1-10 — CADD Mech: no software-version attribution anywhere
- **Evidence:** ✅ full-file search — zero version strings for AutoCAD/SolidWorks/CATIA (V5-vs-V6)/CNC control.
- **Current behavior:** command and API claims cannot be verified against a named version.
- **Impact:** currency and correctness unverifiable; students can't match their installed software.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D10).

### P1-11 — CADD Mech SolidWorks VBA errors
- **Evidence:** ✅ `cadd_mech.ts:356` `AddMate5(0,…)` commented "0 = concentric" but `swMateType_e` defines 0 = Coincident (5 = Concentric); `cadd_mech.ts:412` `AddCustomProperty "Wall","2"` passed off as a global variable. 🔶 SW API enum (external check).
- **Current behavior:** copy-paste VBA that does the wrong thing or errors.
- **Impact:** hands-on learners hit broken automation examples.
- **Dependency:** content-file + reseed; external verification of enum values before correcting (⚪).
- **Confidence:** ✅/🔶.
- **Recommended decision:** **Fix** (D07, D08).

### P1-12 — CADD Mech `code` field over-promises
- **Evidence:** ✅ header claims "real, working, copyable" but weeks 16–20 are pseudo-workflows; SW/CATIA macros reference undefined objects (`cadd_mech.ts:804,811,839,888,895,937,951; 258,454`).
- **Current behavior:** examples labeled working are not runnable.
- **Impact:** trust erosion; learners stuck on non-functional examples.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D09).

### P1-13 — CADD Civil `code` field at wrong altitude
- **Evidence:** ✅ Revit weeks ship full C# Revit-API programs (`cadd_civil.ts:581,587,625,819`); AutoCAD weeks use AutoLISP defuns instead of the command sequences the prose teaches — contradicts header's "real, working tool/code example" promise (`cadd_civil.ts:6`).
- **Current behavior:** drafting students receive code they cannot run or whose level mismatches the audience.
- **Impact:** the practical path is broken at the wrong altitude.
- **Dependency:** content-file + reseed; but **the right fix depends on the CADD Civil identity decision** (§4).
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **BLOCKED pending §4 decision** (D16).

### P1-14 — C toggle idiom contradicted
- **Evidence:** ✅ `c_topic_quizzes.ts:92` keys `~` as the toggle operator; `c.ts:273` teaches `^` as THE toggle idiom for embedded work.
- **Current behavior:** an ambiguous topic-lock question tests an answer the course didn't teach.
- **Impact:** students penalized for using what the course itself taught.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D21).

### P1-15 — C `%f`/`%lf` printf distinction backwards
- **Evidence:** ✅ `c.ts:337-339`.
- **Current behavior:** lesson inverts the printf conversion-specifier guidance.
- **Impact:** students learn a wrong I/O rule.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D22).

### P1-16 — Python async/await absent
- **Evidence:** ✅ zero grep matches; the course's stated next step is Flask/FastAPI (`python.ts:1631`).
- **Current behavior:** modern Python async is entirely missing from a course aimed at web scripting.
- **Impact:** learners meet an unexplained wall at the documented next step.
- **Dependency:** content-file + reseed (add content). Not a defect to "fix" — a gap (Wave 5).
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Defer to Wave 5** (gap content), not a Wave 1 correction.

### P1-17 — Python flawed assessment items + runnability defects
- **Evidence:** ✅ `python.ts:341-344` (W4 chapter Q4 has two logically identical correct options); `python.ts:423-426` (W5 chapter Q4 keys the non-idiom correct, scores `if my_list:` wrong); `python.ts:320` (undefined `age`/`user` → NameError), `python.ts:1037-1038` (self-import `greeting`), `python.ts:1536` (undefined `format_summary`).
- **Current behavior:** two ambiguous items + three non-runnable examples in an otherwise-excellent course.
- **Impact:** learners penalized for idiomatic code; copy-paste examples error.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D23–D25).

### P1-18 — C++ bare-metal context violation
- **Evidence:** ✅ `cpp.ts:919` uses `std::cout` in the placement-new bare-metal snippet (week's own doctrine: `-fno-exceptions`, no OS).
- **Current behavior:** the flagship low-level example mixes in a hosted I/O stream.
- **Impact:** teaches a pattern that won't link on a bare-metal target.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D26).

### P1-19 — C++ garbled topic-quiz stem
- **Evidence:** ✅ `cpp_topic_quizzes.ts:93` — malformed stem "`` `auto v[0]` in `std::vector<int> v;` … ``".
- **Current behavior:** a topic-lock question reads as a typo.
- **Impact:** comprehension barrier on a gate.
- **Dependency:** content-file + reseed.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Fix** (D27).

### P1-20 — WebDesign `position`/`z-index` absent
- **Evidence:** ✅ `webdesign.ts:634` — appears only as a Tailwind utility name and quiz distractors; W18 modals require it.
- **Current behavior:** a core CSS concept is untaughable when needed.
- **Impact:** students can't complete the modal lesson with understanding.
- **Dependency:** content-file + reseed (add content). Gap, Wave 5.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Defer to Wave 5** unless blocking W18 (then Wave 1 mini-add).

### P1-21 — WebDesign ES modules / JS objects & classes not taught
- **Evidence:** ✅ `webdesign.ts:1630` — JS capped before the W20 React recommendation; objects appear only as literals (`webdesign.ts:885`).
- **Current behavior:** the W20 React recommendation rests on untaught modern JS.
- **Impact:** learners hit the "modern JS" wall at the course's own capstone suggestion.
- **Dependency:** content-file + reseed (add content). Gap, Wave 5.
- **Confidence:** ✅ CONFIRMED.
- **Recommended decision:** **Defer to Wave 5.**

---

## 4. CADD Civil Decision

**Evidence basis:** `content-quality-audit-cadd_civil.md` (§A, §D, §F, §H, §P) and master report §17/§21.

**What the course currently teaches (✅):** 20 weeks; AutoCAD command basics early (with AutoLISP rather than command sequences), then **12 of 20 weeks are architectural/structural BIM** — 3ds Max, SketchUp, Revit Structure + Architecture (incl. full C# Revit-API code examples). No Civil 3D workflows anywhere; **zero exercises, assignments, projects, or datasets**.

**What its title/position implies:** the course ID is `CADDED_Civil`; the promise is civil drafting (and, by ecosystem position beside CADDED_Mech, mechanical CADD). The audit's section A reads the positioning as "civil" — and finds it unfulfilled.

**Civil competencies missing (✅ from audit):** alignments, profiles, corridors, grading, pipes/utilities, survey data, civil-specific annotation/dimensioning, Civil 3D workflows, site plans.

**Scope problem or content-gap problem:** this is **a scope problem, not a content-gap problem.** A content gap is "X is missing from an otherwise-correct scope." Here the *identity* is wrong: 12/20 weeks deliver a different discipline. You cannot "fill the gap" — you must first decide what the course *is*. (RULE 9: PRESENT-BUT-WRONG-SCOPE ≠ missing content.)

### OPTION A — Build a genuine Civil track
- **Educational impact:** delivers on the civil promise; produces civil-job-relevant learners; high value if the market segment is civil/architecture-drafting job placement.
- **Approximate scope:** large — replace or repurpose ~12 weeks; add Civil 3D toolset content, datasets, and a capstone; **requires the P0-02 practice build** (exercises, datasets, project briefs). Estimate: the largest single content effort in the catalog.
- **Dependencies:** a current software target (AutoCAD Civil 3D version) named explicitly (P1-10-style attribution); an author with civil domain expertise; access to Civil 3D.
- **Risk:** high cost; risk of building "CAD-in-the-abstract" again (P1-13 wrong-altitude trap); needs a versioned, verifiable toolchain.
- **Implementation complexity:** high (content + datasets + capstone + practice).
- **Recommendation:** choose A **only if** civil drafting is a real, funded market for this platform. If chosen, it is a Wave 5 program, not a Wave 1 fix, and should be run as a new-course build with the Future Content Standard (§24 master report) applied.

### OPTION B — Re-scope/rebrand the course honestly
- **Educational impact:** the course becomes honest about what it is — CADD + BIM/Architecture foundation (AutoCAD, 3ds Max, SketchUp, Revit) — so learners' expectations and the catalog position match the content. Fastest path to a defensible course; preserves the existing high-value BIM content.
- **Approximate scope:** small-to-medium — rename/redescribe the course (title, description, DB `title`/`description`), align W20 promise, fix the wrong-altitude examples to the *new* scope, add the missing practice layer to *this* scope (still required for P0-02).
- **Dependencies:** owner sign-off on new name/position; content edits + reseed; updating any marketing/pricing copy that references "civil".
- **Risk:** low; the risk is *reputational* (a course branded "Civil" that isn't) vs. a build risk.
- **Implementation complexity:** low-to-medium.
- **Recommendation:** **B is the evidence-based default.** The audit provides no evidence of a funded civil requirement or civil-author availability; it provides strong evidence the BIM/architecture content is substantial and current. Re-scoping is the honest, low-risk path; A should be a *separate, deliberately-scoped* project only if the business case exists. **Owner must choose; this decision is the hard gate for every CADD Civil item (P0-01, P0-02, P1-13, D16).**

---

## 5. Final Exam Decision

**Evidence basis:** `assessment-systems-audit.md` §2/§3.7; master report §13.

**Where the questions exist (✅):** `FinalExamQuestion` table (`schema.prisma:302-313`); 156 questions (per-course counts §6 master report); **hand-written, distinct** — the reseed scripts replaced the old template banks (`reseed_cadd_mech_full.ts:138-142` and siblings).

**Reachable? (✅):** no. Zero references to `finalExam` in `backend/src` and `frontend/src`. No route, no UI, no component.

**Backend support (✅):** the table + seeding exist; **no service/route** serves or grades it. Admin CRUD for final-exam questions was not found in `routes/` (only quiz CRUD at `routes/quiz.ts:69-103`).

**Frontend support (✅):** none.

**Does progress/certification depend on it? (✅):** no. Progress is driven by module/topic quiz passes (`quizService.submitQuiz` → `moduleProgress`/`courseProgress`); certificates are admin-verified via `CertificateRecord` (issue #101), not exam-gated.

**Does it duplicate other systems? (✅/🔶):** no live duplication — the questions are never served, so they can't collide with chapter/topic quizzes at runtime; content-wise the final exams cover the same learning material (recall MCQs), i.e., **no unique assessment function** is being performed today.

### OPTION A — Wire the final exam into the product
- New backend route + service (fetch-without-keys; grade; record), frontend exam page, progress/certificate gating optional.
- **Requires first validating the questions** — 156 items have never been student-exercised; the C P0-04 proves final-exam keys can be wrong. A wiring effort on unvalidated items ships known-risk content.
- If a *summative* is a product goal, the audit evidence (§13) says the **challenge engine is the better vehicle** (auto-graded, application-level) than a 156-question recall MCQ.

### OPTION B — Deprecate/remove as an assessment concept
- Remove the `FinalExamQuestion` table + seeding (or leave table inert and cut seeding); remove reseed-exam blocks; document the decision.
- Zero product surface today depends on it (✅). Removes dead data + maintenance; eliminates the "unvalidated final answers" risk.
- If the owner later wants a summative, it can be rebuilt properly (challenge-based) rather than resurrecting unvalidated MCQ banks.

**Recommendation (evidence-only):** **OPTION B.** The exam performs no current function, is unvalidated, carries proven-wrong keys (P0-04), and the platform already owns a superior summative mechanism (the challenge engine). **OPTION A is the right choice only if the owner explicitly wants a product summative now — and then it should reuse the challenge grader, not ship the raw MCQ bank.** This decision gates the fate of the 156 questions and any routing work.

---

## 6. Interactive Challenge Decision

**Evidence basis:** `assessment-systems-audit.md` §3.6; `challengeSeedData.ts`, `challengeService.ts`, `challengeRunnerService.ts`, `routes/challenge.ts`, `sandboxService.ts`.

**Current engine (✅):** fCC-style challenge model (`Challenge`, `schema.prisma:346-370`) with a **sandboxed test runner** — user code + assertions execute in a separate child process (`sandboxService.ts:10-24`: `ulimit -v/-t/-f`, wall-clock + CPU caps, process-group SIGKILL, `unshare -n` network isolation), not Node's `vm`.

**Seeded content (✅):** 11 blocks, all week 1 — WebDesign 6 (HTML basics), Python 3, SQL 2 (`challengeSeedData.ts:234-238`). Header explicitly "Phase 1."

**Sandbox/autograder capability (✅):** assertion-based per-assertion pass/fail; types HTML/CSS/JavaScript/Python/SQL; output capture; length-capped; rate-limited endpoint (15 runs/min/IP, `routes/challenge.ts:24-51`).

**Backend/API (✅):** `GET /course/:courseId` (blocks + completion), `GET /counts`, `GET /:id`, `POST /:id/run-test` (server-side grading, auto-records only on all-pass), `POST /:id/complete` (blocked for graded challenges). Sequential gating + XP +10 + module/course progress advancement (`challengeService.ts:93-203`).

**Frontend reachability (✅):** **none.** No page, route, or component consumes `api/challenges/*`. Only About.tsx marketing copy and Dashboard's *daily practice* widget (a different system) match "challenge."

**Current student experience:** challenges do not exist from a student's point of view.

**Missing integration points (🔶 from code inspection):** (1) a frontend page/component that lists a course's challenge blocks and renders a challenge; (2) a code editor input wired to `run-test`; (3) rendering of per-assertion results + user stdout; (4) completion→progress UI (the backend already records progress; the UI must refresh/reflect it); (5) navigation from the course curriculum to challenges; (6) optional expansion of seeds beyond week 1.

**Why this is potentially the highest ROI item in Wave 1 (🔶 assessment, grounded):** the expensive, security-sensitive 80% of the feature (sandbox, grading, completion, XP, progress, sequential gating) is **already built and tested in backend**. The remaining work is frontend wiring + content expansion. It is the platform's **only application-level, auto-graded assessment** — the audit's §13 explicitly identifies it as the mechanism that would lift E (scenario-based, coding-level) and D (genuine practice) for every course that uses it. Nothing else in Wave 1 converts as much existing investment into student-visible value.

**Implementation dependency map (as specified — do not implement now):**

```
Challenge content (11 seeds; seedChallengeBlocks in seed.ts)
        ↓  already seeded to DB
API (routes/challenge.ts: course/:courseId, /:id, /:id/run-test, /:id/complete)
        ↓  exists, secure, rate-limited
UI (challenge list per course + challenge editor + Run Tests button)   ← MISSING
        ↓
Execution (sandboxService child process; ulimit/unshare)                ← exists
        ↓
Grading (assertion runner; auto-record on all-pass)                     ← exists
        ↓
Feedback (per-assertion pass/fail + captured stdout rendered to student) ← MISSING (UI)
        ↓
Progress (completeChallenge → module/course progress + XP; UI refresh)   ← backend exists, UI missing
```

**Recommendation:** **wire the existing engine into the frontend** as Wave 1/Wave 2 (owner confirms scope in decision C). It is independent of the CADD Civil and Final-Exam decisions and can proceed immediately once approved.

---

## 7. IoT Remediation Scope

**Confirmed retired/outdated services (✅):**

| Service | Location | Week / Topic | Current claim | Why problematic | Replacement requirement |
|---|---|---|---|---|---|
| Google Cloud IoT (Core) | `iot.ts:681` | W15 · "What an IoT Cloud Platform Does" | Listed as a current "full IoT platform" choice (platform-spectrum list) | Retired 2023-08-16; a learner selecting it builds on a dead service | Replace with a current equivalent (e.g., drop from list, or substitute a live platform) or remove the name |
| Azure Time Series Insights | `iot.ts:732` | W16 · "Time-Series Databases & Data Pipelines" | Listed under "Managed" TSDBs | Retired 2025-03; documented as a current managed option | Replace with a current managed TSDB (e.g., Azure Data Explorer / Time Series Insights successor, or drop) or remove the name |

**Effect on surrounding lessons/examples/questions (🔶):** both are **passing mentions inside current lists** — the surrounding content (ThingsBoard, AWS IoT Core, Azure IoT Hub, Balena in W15; InfluxDB, TimescaleDB, Prometheus in W16) is current and unaffected. Replacement is a **one-line-per-instance edit**. **No quiz item was cited by the audit as referencing either service** — verify before/with the edit (⚪), but the cited prose context strongly indicates minimal blast radius.

**Scope decision for the owner:** choose replacement platforms or simple removal. Either satisfies the fix. Recommendation: **remove the names** (least risk, no new claims to verify) or replace with a *current, verifiable* alternative; do not introduce a new unverified claim (RULE 5 applies to the fix too).

---

## 8. Immediate Defect Remediation Table

Fix Types — CONTENT · QUESTION · ANSWER · EXPLANATION · API/COMMAND · CURRICULUM · PRODUCT/ROUTING · SCOPE DECISION.
Dependency — content fix ⇒ "content file + `reseed_<course>_full.ts` + re-seed (no migration, no code change)"; other as noted.

| ID | Course | Issue | Severity | Evidence | Fix Type | Dependency | Priority |
|---|---|---|---|---|---|---|---|
| D01 | sql | W10 topic item unanswerable (`ALTER TABLE` absent) | P0 | `sql_topic_quizzes.ts:260` | QUESTION | content + reseed | P0 |
| D02 | c | Final Q8 struct-vs-union wrong key | P0 | `c.ts:2122-2129` | ANSWER | content + reseed | P0 |
| D03 | embedded | xPSR/PRIMASK claim wrong | P1 | `embedded.ts:321` | CONTENT | content + reseed | P1 |
| D04 | embedded | APB1 64 MHz + TIM2 clock assumption | P1 | `embedded.ts:102,411` | CONTENT | content + reseed | P1 |
| D05 | embedded | Defective `sum()` disassembly | P1 | `embedded.ts:187` | CONTENT | content + reseed | P1 |
| D06 | embedded | SysTick taught w/o ENABLE | P2 | `embedded.ts:244` | CONTENT | content + reseed | P2 |
| D07 | cadd_mech | SW `AddMate5(0,…)` enum mismatch | P1 | `cadd_mech.ts:356` | API/COMMAND | content + reseed; ⚪ verify enum | P1 |
| D08 | cadd_mech | `AddCustomProperty` misuse | P1 | `cadd_mech.ts:412` | API/COMMAND | content + reseed | P1 |
| D09 | cadd_mech | `code` over-promise (weeks 16–20) | P1 | `cadd_mech.ts:804,811,839,…` | CONTENT | content + reseed | P1 |
| D10 | cadd_mech | No software-version attribution | P1 | full-file search | CONTENT | content + reseed | P1 |
| D11 | cadd_civil | OSMODE 4133 comment vs actual snaps | P1 | `cadd_civil.ts:71` | API/COMMAND | content + reseed | P1 |
| D12 | cadd_civil | `NewLevel(3.6)` labeled meters is feet | P1 | `cadd_civil.ts:587` | API/COMMAND | content + reseed | P1 |
| D13 | cadd_civil | `ROOF_SLOPE` applied to a Floor | P1 | `cadd_civil.ts:845` | API/COMMAND | content + reseed | P1 |
| D14 | cadd_civil | `AddView` assigned to return value | P2 | `cadd_civil.ts:713` | API/COMMAND | content + reseed | P2 |
| D15 | cadd_civil | No-op `? mat : mat` ternary | P3 | `cadd_civil.ts:889` | CONTENT | content + reseed | P3 |
| D16 | cadd_civil | `code` at wrong altitude (C# Revit API to drafting students) | P1 | `cadd_civil.ts:581,587,625,819` | CURRICULUM | **BLOCKED — §4 decision** | P0 |
| D17 | iot | Google Cloud IoT listed current (retired 2023) | P1 | `iot.ts:681` | CONTENT | content + reseed | P1 |
| D18 | iot | Azure TSI listed current (retired 2025) | P1 | `iot.ts:732` | CONTENT | content + reseed | P1 |
| D19 | sql | Capstone EXCLUDE DDL non-runnable (`tsrange`→`tstzrange`; missing `btree_gist`) | P1 | `sql.ts:890-891,808` | API/COMMAND | content + reseed | P1 |
| D20 | sql | TRUNCATE rollback mis-taught | P1 | `sql.ts:467,479`; `sql_topic_quizzes.ts:267` | CONTENT | content + reseed | P1 |
| D21 | c | Toggle `~` vs taught `^` | P1 | `c_topic_quizzes.ts:92` vs `c.ts:273` | ANSWER | content + reseed | P1 |
| D22 | c | `%f`/`%lf` printf backwards | P1 | `c.ts:337-339` | CONTENT | content + reseed | P1 |
| D23 | python | W4 chapter Q4 two identical correct options | P1 | `python.ts:341-344` | QUESTION | content + reseed | P1 |
| D24 | python | W5 chapter Q4 keys non-idiom | P1 | `python.ts:423-426` | ANSWER | content + reseed | P1 |
| D25 | python | Runnable-code defects (NameError, self-import, undefined) | P1 | `python.ts:320,1037-1038,1536` | CONTENT | content + reseed | P1 |
| D26 | cpp | `std::cout` in bare-metal placement-new | P1 | `cpp.ts:919` | CONTENT | content + reseed | P1 |
| D27 | cpp | Garbled topic-quiz stem | P1 | `cpp_topic_quizzes.ts:93` | QUESTION | content + reseed | P1 |

> **Note on scope:** the spec explicitly listed six defect groups; rows **D19–D27** are the additional **confirmed P1** findings from the same audits (master report §21 items 10–17) and are included so the remediation table is complete — they carry the same evidence standard. If the owner prefers a strict six-group table, these remain in §3 and must not be dropped.

**Fix-Type pattern check:** every row above is a content-file correction (reseed-able) except D16 (CURRICULUM, decision-blocked). **No row requires a code change.** That means Wave 1 content remediation is a low-risk, high-confidence tranche.

---

## 9. Dependency Map

Only confirmed or clearly-inferred dependencies (🔶 where inferred).

```
CADD Civil scope decision (P0-01)                      ← SCOPE DECISION
   ├─ affects curriculum content (P0-02 practice, P1-13 D16 wrong-altitude)
   ├─ affects project structure (capstone/briefs for the chosen scope)
   └─ affects assessments (final-exam & quizzes for the chosen scope)

Final Exam decision (P1-03)                            ← SCOPE DECISION
   ├─ affects 156 FinalExamQuestion rows (route-or-remove)
   ├─ affects backend routing (new route) / seed code (removal)
   └─ potential effect on certification/progress ONLY if wired (currently none)

Interactive Challenge wiring (P1-04)                  ← INDEPENDENT (can proceed)
   ├─ depends on existing challenge API (exists, secure)
   ├─ frontend integration (MISSING)
   ├─ grading/feedback rendering (MISSING)
   └─ progress integration/UI refresh (backend exists)

Learning-objective layer (P1-01)                       ← INDEPENDENT (Wave 3, catalog-wide)
   └─ content model change + 705 topics

Graded practical track (P1-02)                         ← INDEPENDENT (Wave 4)
   └─ briefs + rubrics; optional binding to submission flow

Item-level defects (D01–D27 except D16)                ← INDEPENDENT (content + reseed)
IoT retired services (D17–D18)                         ← INDEPENDENT (content + reseed)
```

**Inference rule respected:** no dependency asserted that the audit does not support. CADD Civil and Final Exam are the only true decision gates; everything else is either independent or blocks *only itself*.

---

## 10. Recommended Execution Order

### DECISION TASKS (owner — block everything gated below)
| ID | Task | Blocks | Priority |
|---|---|---|---|
| DEC-1 | Choose CADD Civil: **Build civil track** vs **Re-scope/rebrand** (§4) | P0-01, P0-02, D16, all CADD Civil gap content | P0 |
| DEC-2 | Choose Final Exam: **Wire** vs **Deprecate/remove** (§5) | 156 questions, exam routing/removal | P0 |
| DEC-3 | Confirm interactive-challenge wiring is in Wave 1 scope (§6) | Frontend challenge UI | P0 |

### IMPLEMENTATION TASKS (start immediately — none blocked)
| ID | Task | Priority |
|---|---|---|
| IMP-1 | Correct D01, D02 (P0 content fixes: SQL item, C final Q8) | P0 |
| IMP-2 | Correct D03–D05, D07–D13, D17–D27 (all P1 content/API fixes) | P1 |
| IMP-3 | Correct D06, D14, D15 (P2/P3 polish) | P2 |
| IMP-4 | Wire interactive-challenge UI (after DEC-3) | P1 |
| IMP-5 | Dynamic module-count gates for project/assignment (P2 from master report §21-22) | P2 |
| IMP-6 | Replace/remove IoT services (D17–D18 — also in IMP-2; listed for visibility) | P1 |

### CONTENT REWRITE TASKS (post-Wave-1, per roadmap)
| ID | Task | Wave |
|---|---|---|
| CRW-1 | Learning-objective layer (all 705 topics) | Wave 3 |
| CRW-2 | Graded practical track (exercises, briefs, rubrics, assessed capstones) | Wave 4 |
| CRW-3 | Course gap content (async, window fns, z-index/ES modules, LoRaWAN, security, Civil 3D/version attribution) | Wave 5 |
| CRW-4 | CADD Civil build or re-scope (depends on DEC-1) | Wave 5 |

---

## 11. Definition of Done

Measurable criteria per Wave 1 item (pattern example included as specified).

### Content fixes (D01–D27, IMP-1..3)
- **D01 (SQL W10 item):** stem rewritten so a valid option answers it; exactly one correct option present and keyed; the correct option matches the course's teaching (RULE 16); no duplicate/contradictory item remains in the W10 topic bank; `reseed_sql_full.ts` re-run; the topic's 4-question bank intact (lock flow unaffected); item verified answerable in the quiz flow.
- **D02 (C final Q8):** key and options corrected so the keyed answer is factually right (or item rewritten so struct/union sizes differ); verified by compile check; no other item's key touched; reseed `c`.
- **D03–D05 (Embedded):** claims corrected to ARMv7-M / STM32F4 reality; disassembly replaced with genuine `arm-none-eabi-gcc` output; reseed `embedded`; lessons' surrounding text consistent (no contradiction introduced).
- **D07–D10 (CADD Mech):** `AddMate5` enum verified (⚪ → resolve) and corrected; `AddCustomProperty` fixed or removed; weeks 16–20 `code` fields either made runnable or re-labeled honestly; a named software+version appears where commands are taught; reseed `cadd_mech`.
- **D11–D15 (CADD Civil):** OSMODE value matches its comment; `NewLevel` units correct; `ROOF_SLOPE`/`AddView`/ternary fixed; reseed `cadd_civil`; **note: D16 (wrong altitude) is BLOCKED — its DoD waits on DEC-1.**
- **D17–D18 (IoT):** both service names removed or replaced with current, verifiable alternatives (RULE 5); no surrounding text/quizzes contradicted; reseed `iot`.
- **D19–D27 (remaining P1):** each corrected per its evidence; each course re-seeded; per-item: **item is answerable, correct answer verified, explanation verified if applicable, existing quiz flow still works, no duplicate/contradictory question remains.**

### Cross-cutting content-fix DoD (applies to every D-row)
- The 4-question-per-topic invariant is preserved (topic-lock safe).
- No item is introduced that duplicates another (within-course and cross-course dup checks re-run clean — /tmp checker).
- The reseed for that course is idempotent and completes with no orphaned keys (title↔key 1:1 preserved).
- The change is based on **GitHub `main`** (deployment base), not local `master`.

### Decision-item DoD
- **DEC-1 (CADD Civil):** an owner decision is recorded (Option A or B); the resulting work enters the roadmap as a scoped project with its own DoD (A: civil track + datasets + capstone + practice; B: rename/re-describe + fix wrong-altitude examples + add practice for the new scope). "No decision" is not a completion state.
- **DEC-2 (Final Exam):** a recorded decision; if **Deprecate**, `FinalExamQuestion` seeding is removed (or table left inert with no seed), no route/UI added, doc updated; if **Wire**, the new route/UI ship only after the 156 items pass an item-validation pass (unique correct option present; key matches teaching; no wrong keys like P0-04).
- **DEC-3 (Challenges):** a recorded decision; if **Wire**, the UI makes the 11 seeds reachable end-to-end: list → editor → Run Tests → per-assertion feedback → progress reflected in the curriculum UI → XP/points visible; verified against `GET /course/:courseId`, `POST /:id/run-test` on a staging instance.

### Infrastructure DoD (IMP-4, IMP-5)
- Challenge UI: challenge page reachable from each of the 3 seeded courses' curriculum; a run-test round-trip succeeds with the existing backend; no new backend code required.
- Module-count gates: project/assignment gates use the same dynamic module count as `quizService` (#70 pattern); no course is hard-blocked from submission; behavior unchanged for the current 20-module courses.

---

## 12. Items Blocked by Decisions

| Item | Blocked by | Status |
|---|---|---|
| P0-01 CADD Civil identity | DEC-1 | BLOCKED |
| P0-02 CADD Civil practice build | DEC-1 | BLOCKED (decision defines scope) |
| P1-13 / D16 CADD Civil wrong-altitude code | DEC-1 | BLOCKED |
| CADD Civil gap content (Civil 3D, version attribution) | DEC-1 | BLOCKED |
| P1-03 Final exam (156 questions) | DEC-2 | BLOCKED |
| Final-exam routing/removal | DEC-2 | BLOCKED |
| Interactive-challenge UI wiring | DEC-3 (confirm-only) | READY-TO-GO (independent) |
| All content fixes D01–D15, D17–D27 | none | **NOT BLOCKED — can start** |
| LO layer, graded practicals, gap content | none (roadmap waves) | NOT BLOCKED |

---

## 13. Implementation Handoff Checklist

For the implementer of "Wave 1 Implementation & Content Correction" (which must **not** start until DEC-1/2/3 are approved):

- [ ] Base the working branch on **GitHub `main`** (live deployment source; local `master` lags it).
- [ ] For each content fix: edit the **content file** (`backend/prisma/content/<course>.ts` / `<course>_topic_quizzes.ts`), then run the matching **reseed script** (`reseed_<course>_full.ts`) against a staging DB; verify idempotence.
- [ ] Preserve the **4-question-per-topic invariant** and the title↔key 1:1 map after every topic-quiz change.
- [ ] Re-run the read-only duplication checker after edits: within-course and cross-course question duplicates must remain **0**.
- [ ] Do not touch the Prisma schema for any D-row (all are content-only). Schema changes belong to Wave 3 (LO field) and are out of scope.
- [ ] Apply **RULE 5** to any new claim introduced by a fix (especially D17–D18 replacements).
- [ ] For D07/D11–D13, resolve the ⚪ external verifications (SW enum, Civil API behavior) before/with the edit — do not guess.
- [ ] After fixes, run a smoke pass on the affected courses' quiz flow (fetch without keys, submit, grade) and the topic-lock progression.
- [ ] Do **not** begin Wave 3/4 content (LO layer, graded practicals) or the CADD Civil build in this wave.

---

## 14. Final Recommendation

1. **Approve the three decisions this week** — DEC-1 (CADD Civil: **re-scope/rebrand is the evidence-based default**; build only on a real business case), DEC-2 (Final Exam: **deprecate/remove** — it serves no current function and carries proven-wrong keys; revisit only as a challenge-based summative), DEC-3 (Challenges: **wire the existing engine** — highest ROI, lowest risk of anything in the catalog).
2. **Run IMP-1/IMP-2 immediately** — the P0/P1 content corrections (D01–D05, D07–D13, D17–D27) are content-file-only, low-risk, reseed-able, and independently verifiable. They remove every known wrong fact and every unanswerable gate in the catalog.
3. **Wire the challenge UI (IMP-4)** as the flagship Wave 1 product change — it converts already-built, already-secured infrastructure into the platform's first real application-level assessment.
4. **Lock the gates:** Wave 1 Implementation must not start until the owner records decisions DEC-1/2/3; and Wave 3/4 content work stays out of Wave 1's scope.

**Net effect if executed:** every confirmed wrong fact corrected, every unanswerable gate fixed, retired services removed, the platform's strongest assessment asset made student-visible, and zero architectural risk — with the two genuinely large questions (CADD Civil, final exam) resolved by decision rather than by drift.

---

*This specification is an audit/planning deliverable. Nothing was implemented, and no content, code, database, or schema was modified. The next task — "Wave 1 Implementation & Content Correction" — must not begin until the owner approves the Wave 1 decisions (DEC-1/2/3).*

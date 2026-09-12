# EduNexus Pro — Catalog Synthesis & Cross-Course Analysis

**Phase:** Master Curriculum & Content Deep-Scan — cross-course synthesis (final deliverable of the 9 independent course audits).
**Audit-only:** nothing modified — reads of the live `nexus` Postgres DB, `backend/prisma/content/*`, reseed scripts, `backend/src`, `frontend/src`, and the 9 per-course deep-audit reports. One synthesis file written.
**Date:** 2026-08-14
**Source:** 9 independent per-course deep audits (`docs/content-deep-audit/<course>-deep-audit.md`) + 3 independent second-pass scoring validations.

---

## 1. Headline

The EduNexus Pro catalog is a **Needs-Improvement / Weak** catalog on the mandated 12-dimension rubric. Every course audit and both validation passes independently converged on the same diagnosis: **the written content is materially better than the curriculum architecture, assessment, and feedback systems around it.** The catalog is under-delivered by its own platform — the single most actionable fact in this audit.

**Catalog score (adopted, mean of independent first-pass + second-pass): 60.4 / 100.**

---

## 2. Course Score Comparison (independent-validated)

| Rank | Course | First-pass | Second-pass | Adopted | Band | Confidence |
|---|---|---|---|---|---|---|
| 1 | Web Design | 78 | 78 | **78** | Strong | HIGH |
| 2 | CADD Mechanical | 68 | 70 | **69** | Needs Improvement | HIGH facts / MED-HIGH scoring |
| 3 | Embedded Systems | 70.5 | 68 | **69** | Needs Improvement | HIGH |
| 4 | IoT | 64 | 63 | **63.5** | Needs Improvement | HIGH |
| 5 | C++ | 61 | 61 | **61** | Needs Improvement / Weak | MED-HIGH |
| 6 | Python | 61 | 60 | **60.5** | Weak | MED-HIGH |
| 7 | Core C | 58 | 56 | **57** | Weak | MEDIUM |
| 8 | SQL | 56 | 54 | **55** | Weak | MED-HIGH |
| 9 | CADD Civil | 31 | 31 | **31** | Major Revamp | MED-HIGH |

**Strongest course:** Web Design (78) — best-written, most accurate content in the catalog; the report's verdict is "under-delivered by the platform," not "needs rewriting."

**Weakest course:** CADD Civil (31) — the only course in a decision-required failure state: identity failure + zero practical infrastructure.

**Rubric note:** the previous 12-criterion audit averaged **72.9**. The drop is rubric-driven, not content regression — every first-pass agent that lowered a score explained the delta in terms of the new rubric's standalone Learning-Objectives and Feedback dimensions (where the whole catalog scores ~1–3/10), and the second-pass agents independently confirmed the direction. Several agents noted their components map to ~70–72 on the prior weights.

---

## 3. Independent Second-Pass Validation Results

Three independent evaluators re-scored all 9 courses from the source (not inheriting first-pass numbers). **Verification quality was high:**

- **Agreements (5):** Web Design 78 ✓, C++ 61 ✓, CADD Civil 31 ✓ (with the P0s independently confirmed, not inherited), CADD Mech 70 (+2, raising LO/Practical), IoT 63 (−1).
- **Downward adjustments (3):** Core C 56 (−2), Python 60 (−1), SQL 54 (−2), Embedded 68 (−2.5).
- **Cross-course normalisation issues the second-pass caught in the first pass:** Embedded was given LO 5.0 for *zero* explicit LOs while SQL/IoT got 2.0 — an internal inconsistency (corrected down); Core C exam-coverage was miscounted as "13 of 20 weeks" when the correct figure is **12/20** (8 weeks omitted, including W12); CADD Mech report says "478 questions" but the verified count is **498** (documentation typo only).
- **First-pass findings independently verified as WRONG:**
  1. *Prior audit + wave1-decision-spec.md:* "AddMate5 5 = Concentric" → actually **0=Coincident, 1=Concentric, 5=Distance, 8=Symmetry, 10=Gear** (CADD Mech; the spec's proposed fix direction was itself incorrect).
  2. *Prior audit:* `0x40021000` "invalid on F4" → actually **GPIOE base on F4** (RCC on F1); real defect is an unannotated cross-family magic number (P3).
  3. *Prior audit:* btree `IS NULL` claim "Correct" → **incorrect**; a btree index serves `WHERE col IS NULL` (verified live Bitmap Index Scan).
- **Minor citation fix:** the ESP8266 "~50 KB usable" quiz item is at `iot.ts:302`, not `iot_topic_quizzes.ts:173` (substance — the 80 KB lesson vs 50 KB quiz inconsistency — is real).

**Bottom line:** the first-pass scores are well-calibrated; the adopted scores above incorporate every second-pass adjustment.

---

## 4. Common Systemic Problems (all 9 courses)

| # | Problem | Evidence basis | Affects |
|---|---|---|---|
| S1 | **No learning-objective layer** — topic model exposes only `{title, text, code, note}`; no objectives at course/module/topic level; no objectives→assessment map | every course audit; schema (`Topic`) | 9/9 — LO & LO-Alignment dims capped at ~2–5/15 |
| S2 | **No graded practical track** — practice = MCQs only; challenges UI-orphaned; practice-route whitelist rejects CADD categories; no content-defined briefs/rubrics bound to submission routes | every audit; `routes/practice.ts`, `routes/project.ts:38-91` | 9/9 — Practical dims 1–8/10 |
| S3 | **Final exam (156 Qs) is dead content** — zero refs in `backend/src`+`frontend/src`; no route/UI; gates nothing (certificates need module quizzes + payment) | every audit; `schema.prisma:302` | 9/9 — no summative assessment anywhere |
| S4 | **Interactive challenge engine is UI-orphaned** — full sandboxed autograder + 11 seeds, no frontend consumer | WebDesign/Python/SQL audits; `frontend` usage map | 3 seeded courses (feature for all) |
| S5 | **Score-without-learning feedback** — `QuizQuestion` has no `explanation` field; 4,414 course questions give right/wrong only; `PracticeQuestion` proves the platform can do better | all audits; `schema.prisma:137-151` vs `:218` | 9/9 — Feedback dims 1–3/5 |
| S6 | **Topic-quiz "randomization" is a no-op** — `slice(0,5)` on 4-question banks; week quizzes unshuffled; options never shuffled | `quizService.ts:336-338` | 9/9 |
| S7 | **Hardcoded module gates** — project gate `completedCount < 20`, assignment gate `week*5`, contradicting the dynamic-module fix (#70) | `routes/project.ts:48-56`, `routes/assignment.ts:49-56` | 9/9 (latent until a course ≠20 modules) |
| S8 | **Stale/contradictory DB metadata** — course `description` retains legacy seed strings ("…in Hinglish") on 6+ courses while content is all-English; reseed only sets description on CREATE | C, C++, SQL, Python, WebDesign, IoT audits | 6/9 |
| S9 | **Non-atomic XP-award guard** — concurrent first-pass quiz submissions can double-award XP (daily-challenge path already solved this atomically) | `quizService.ts:83-112` vs `practiceService.ts:108-121` | 9/9 (P2, integrity of points economy) |

---

## 5. Course-Specific Problems (highest-value per course)

| Course | Distinct problem cluster |
|---|---|
| **CADD Civil** | Identity failure (titled Civil/Architecture, 12/20 weeks are architecture/structural BIM, Civil 3D never taught); zero practical infrastructure (practice route 400s for CADD); 11 confirmed code/API defects; topic quizzes hidden for `CADDED_` yet still seeded and leaking 24-Q mixed weekly quizzes |
| **SQL** | P0 unanswerable topic-lock item (DB 11477); capstone EXCLUDE DDL non-runnable (`tsrange`/`tstzrange`, missing `btree_gist`); TRUNCATE transactionality mis-taught; window functions/CTEs have **no dedicated lesson** |
| **Core C** | Final-exam Q8 wrong key (DB 473); toggle `~` vs taught `^` (DB 8980); `%f`/`%lf` inverted; exam covers only 12/20 weeks; 3 latent product-integrity P0s reported |
| **Python** | 3 live wrong-grading items (DB 10864, 10888 + ~23 self-answering options); 3 crashing snippets + self-import anti-pattern; false PEP-8 "single quotes" claim; phantom `re`/regex promise |
| **C++** | Q11920 has multiple valid answers; `std::ranges::fold_left` mislabeled C++20 (it's C++23); `std::cout` in bare-metal placement-new; garbled stem 11793; register addresses un-attributed |
| **Embedded** | xPSR/PRIMASK wrong (`embedded.ts:321`); APB1 ÷2=64 MHz out of spec (42 MHz max); SysTick ENABLE omitted; TIM2 1 ms assumes non-default clock; defective `sum()` disassembly; 45 flippant distractors (~9% of bank) |
| **IoT** | 2 retired services taught as current (Google Cloud IoT, Azure TSI); W12 blocking-WiFi loop contradicts own anti-pattern lesson; ~23 absurd/template distractors; `analogRead()` Uno-scoped in ESP32 course |
| **CADD Mech** | `AddMate5` enum reversed + `AddCustomProperty` misuse; "Working, copyable" header vs 10 pseudo code fields; no software version named anywhere; final exam genuinely 100% application-level (asset) |
| **Web Design** | `position`/`z-index` never taught though W18 modals need it; ES modules/objects absent though W20 recommends React; unterminated HTML comment; dangling "closures" cross-ref |

---

## 6. Duplicated Issues (cross-course repeats)

- **Duplicate content:** ~15 duplicate option-set pairs (topic↔module) in WebDesign; near-duplicate falsiness items in Python (DB 10843/10844); repeated `.sort()` ×3 and `res.ok` ×3 in WebDesign. **No course has exact-duplicate question *texts*** (all 9 DB integrity checks: 0 duplicate texts).
- **Repeated structural claims:** "Hinglish" description on 6 courses; "5-question quiz" UI label vs 4-question reality; "4–5 sub-topics" header overclaims (actual 2–4) on multiple courses.
- **Shared defect pattern:** flippant/comedic distractors recur across Embedded (~45), IoT (~23), CADD Mech (~7), CADD Civil (several).
- **Legitimate repetition (not defects):** week-level conceptual reinforcement (e.g., register/bitmask practice in C/Embedded) is pedagogically sound and should not be conflated with harmful duplication.

---

## 7. Technical Debt Affecting Content Delivery

1. Reseed scripts update descriptions only on CREATE → legacy/stale DB metadata persists (S8).
2. `QuizQuestion` schema lacks explanation; grading is exact-string compare (`quizService.ts:52`) — any future fix requires schema + content + UI changes.
3. Randomization is cosmetic (S6); UI label promises 5-question topic quizzes.
4. Hardcoded 20-module gates (S7) — latent break for any non-20-module course.
5. Topic-lock is frontend-only for `CADDED_` courses while 320 topic questions per CADD course still seed and leak into weekly quizzes (24-Q mixed bags).
6. Superseded legacy files persist: `reseed_c_beginner.ts` (older curriculum), old template final-exam generator in `seed.ts` (all courses now skipped from it).
7. No upload endpoint for assignments (`/uploads/mock_` prefix); submission is URL metadata.
8. Live deployment runs GitHub `main`, which drifts from local `master` — all remediation must branch from `main`.

---

## 8. Assessment-System Gaps

| System | Status | Gap |
|---|---|---|
| Week/chapter quizzes (1,438 Q) | LIVE | no shuffling; no explanations |
| Topic quizzes (2,820 Q) | LIVE | randomization no-op; 1 P0 + ~8 P1 defective items catalog-wide |
| Practice bank + daily challenge | LIVE | generic bank (no course binding); route whitelist excludes CADD |
| Interactive challenges (11 seeds) | UI-ORPHANED | highest-value dead asset |
| Final exam (156 Q) | DEAD | no route/UI; unvalidated keys (proven-wrong in C) |
| Projects/assignments | LIVE but free-form | no content-defined briefs/rubrics; hardcoded gates; no file upload |
| Certificates | ADMIN-VERIFIED | not assessment-gated; exam irrelevant to certification |

---

## 9. Curriculum Architecture Patterns

- **Uniform 20-module / 80-topic skeleton** (C is 65 topics) with 4 topics/module, 8 chapter questions, 4 topic questions each — a consistent, navigable structure, but rigid and untied to content length (topic depth ranges ~100–180 words in SQL vs ~347 in Embedded).
- **Two genuinely well-architected arcs:** Embedded (Cortex-M→clocking→RTOS, uniform depth) and CADD Mech (AutoCAD→SolidWorks→CATIA→CNC→integrated project, 5-phase). The CADD Mech final exam is the only 100% application/analysis-level assessment in the catalog.
- **Progression errors:** IoT teaches Arduino code 3 weeks before Arduino; Web Design recommends React before teaching ES modules; Python's documented next step (Flask/FastAPI) is untaught (no async/await); SQL has zero window-function/CTE lessons in a 20-week course.
- **Repeated lesson anti-patterns:** blocking loops banned in one module then used in another (IoT W8 vs W12); register/API claims without datasheet or version attribution (C++ :906-913, CADD Mech, Embedded magic numbers).

---

## 10. Industry Relevance Comparison

| Tier | Courses | Basis |
|---|---|---|
| Current + job-relevant | Embedded (RTOS/STM32), Web Design (Tailwind/React path), Python (pandas/requests/pytest/pyproject), SQL (PG) | modern toolchains, few obsolete references |
| Mostly current, attribution gaps | CADD Mech (no SW/CATIA version named), C/C++ (bare-metal + toolchain, register claims un-attributed) | version-less API claims |
| Currency defects | IoT (2 retired services), CADD Civil (V-Ray 2.x, cross-family magic numbers) | retired/deprecated tech taught as current |

No course teaches wholesale-obsolete content; the retired-service problem is **2 named services in 2 lessons**, and both are passing mentions inside otherwise-current lists.

---

## 11. Practical Learning Comparison

| Rating | Courses |
|---|---|
| MODERATE–STRONG | Embedded (8/10 — the only course with genuinely buildable practice), Web Design (7/10 incl. 6 challenges), IoT (6/10) |
| LOW–MODERATE | CADD Mech (5.5/10 — runnable AutoLISP/G-code but ungraded), C (5.5/10), Python (5/10), C++ (5/10), SQL (5/10) |
| NONE | CADD Civil (1/10 — structurally zero) |

**Every course is capped below its potential by S2** (challenges orphaned, no briefs/rubrics, no assessed building).

---

## 12. Global P0 Issue Register

| ID | Course/System | Finding | Evidence | Status |
|---|---|---|---|---|
| G-P0-1 | CADD Civil | Identity failure: titled "Civil/Architecture", 12/20 weeks are architecture/structural BIM, Civil 3D never taught | `cadd_civil.ts:64,108`; module titles; cadd_civil-deep-audit.md §22 | DECISION REQUIRED (build civil vs re-scope) |
| G-P0-2 | CADD Civil | Zero practical learning: no exercises/datasets/briefs; practice route 400s for CADD categories | practice whitelist; 0 challenges; §13 | BLOCKED on G-P0-1 |
| G-P0-3 | SQL | Unanswerable topic-lock item: keyed answer = stem's phrase; `ALTER TABLE` absent from options | DB `QuizQuestion` 11477; sql-deep-audit §12 | FIXABLE (content) |
| G-P0-4 | Core C | Final-exam Q8 wrong key: struct/union both 4 bytes; correct option present but unkeyed | DB 473; compile probe; c-deep-audit §8 | LATENT (exam dead); P0 if exam wired |
| G-P0-5 | Platform | Three latent integrity P0s reported by the Core C audit: forgeable quiz grading; no enrollment/payment gate; XP dead-code guard | c-deep-audit.md §24 | PRODUCT-LEVEL; outside content scope |

---

## 13. Global P1 Issue Register (recurring across courses)

| ID | System | Finding | Courses |
|---|---|---|---|
| G-P1-1 | Final exam | 156 questions dead content; no summative assessment in the product | 9/9 |
| G-P1-2 | Challenges | Engine + 11 seeds UI-orphaned; highest-value asset unused | 3 seeded |
| G-P1-3 | LOs | No learning-objective layer anywhere | 9/9 |
| G-P1-4 | Practice | No graded practical track; no briefs/rubrics bound to submission | 9/9 |
| G-P1-5 | Feedback | No explanations on 4,414 course questions | 9/9 |
| G-P1-6 | Randomization | Topic-quiz randomization no-op; UI promises 5-Q quizzes (4 actual) | 9/9 |
| G-P1-7 | Gates | Hardcoded 20-module project gate + `week*5` assignment mapping | 9/9 (latent) |
| G-P1-8 | IoT | Google Cloud IoT (retired 2023-08-16) taught current | IoT |
| G-P1-9 | IoT | Azure Time Series Insights (retired 2025-03) taught current | IoT |
| G-P1-10 | CADD Mech | SW `AddMate5` enum reversed + `AddCustomProperty` misuse | CADD Mech |
| G-P1-11 | CADD Mech | "Working, copyable" promise vs 10 pseudo code fields; no version attribution | CADD Mech |
| G-P1-12 | CADD Civil | 11 confirmed code/API defects (OSMODE, NewLevel, ROOF_SLOPE, AddView, etc.) | CADD Civil |
| G-P1-13 | Embedded | xPSR/PRIMASK wrong; APB1 ÷2=64 MHz out of spec | Embedded |
| G-P1-14 | SQL | Capstone EXCLUDE DDL non-runnable; TRUNCATE transactionality mis-taught | SQL |
| G-P1-15 | C | Toggle `~` contradicts taught `^`; `%f`/`%lf` inverted; exam covers 12/20 weeks | C |
| G-P1-16 | C++ | Q11920 multiple valid answers; `fold_left` mislabeled C++20; `cout` in bare-metal | C++ |
| G-P1-17 | Python | 3 wrong-grading items + 3 crashing snippets + self-import anti-pattern | Python |
| G-P1-18 | Web Design | `position`/`z-index` and ES modules/objects untaught but required by W18/W20 | Web Design |

*(Full per-course P0/P1/P2/P3 registers live in each course report; the above are the catalog-global items.)*

---

## 14. Recommended Improvement Waves

Each wave's DoD and decision gates are already specified in `docs/wave1-decision-spec.md`; the deep-scan adds the items below.

**Wave 0 — Decisions (owner, gates everything):**
- CADD Civil: **Build civil track** vs **Re-scope/rebrand** (evidence-backed default: re-scope; build only on a funded civil business case).
- Final exam: **Wire** vs **Deprecate** (evidence-backed default: deprecate; revisit only as a challenge-based summative).
- Challenges: **confirm wiring** into the frontend (highest-ROI item in the catalog).

**Wave 1 — Correctness (no code, content-file + reseed):** fix G-P0-3, G-P0-4, G-P1-8…-18 item defects (SQL 11477; C exam key + toggle + `%f`; Python 3 items + snippets; C++ 11920 + fold_left + cout; Embedded ARM/clock/API fixes; CADD Mech VBA + attribution; CADD Civil code defects (post-decision); IoT service replacements).

**Wave 2 — Assessment infrastructure:** wire challenges UI; serve-or-cut final exam; add `explanation` to `QuizQuestion` (schema + content + UI); real randomization + option shuffle; dynamic-module gates; assignment upload.

**Wave 3 — LO layer:** content-model change + objectives for 705 topics + objectives→assessment map.

**Wave 4 — Graded practical track:** content-defined briefs + rubrics per course; bind to project/assignment/challenge flows.

**Wave 5 — Course gap content:** window functions/CTEs (SQL); async/await (Python); `position`/`z-index` + ES modules (Web Design); LPWAN + security (IoT); preprocessor/ISR-safe C++ (C++); civil-track or rebrand build (CADD Civil, post-decision).

**Wave 6 — Independent re-scoring:** after Waves 1–2, re-run the deep-scan on the 12-dimension rubric to measure movement.

---

## 15. Biggest Unknowns / Missing Evidence

1. **Live-site parity** — code audited is local `master`; the live product runs GitHub `main` (4+ commits ahead). Route/frontend findings are verified against this tree; live parity is `[UNKNOWN]`.
2. **DB provenance** — the local `nexus` DB is seeded and matches the files exactly, but it is not necessarily the production VPS DB; production record-level drift is `[UNKNOWN]`.
3. **External API verification** — SolidWorks `swMateType_e` enum (resolved by second-pass), Revit API overloads, Civil 3D behavior, and rebar-standard claims (CADD Civil "07" key) require vendor/spec confirmation; several marked `[UNKNOWN — NOT VERIFIED]` in-course.
4. **Register/magic-number attribution** — STM32F4 addresses in C++/Embedded lack datasheet citations; GPIOE-vs-RCC resolution for `0x40021000` done, others open.
5. **No student telemetry** — zero rows in Course/Module/TopicProgress, QuizResult, CertificateRecord in the local DB → no behavioral evidence for difficulty/retention/journey claims (all journey analysis is structural).
6. **Psychometrics** — question difficulty is judged heuristically; no item-analysis data exists.

---

## 16. Audit Completion Summary

| Metric | Status |
|---|---|
| Courses audited | **9/9** |
| Reports created | **9/9** (`docs/content-deep-audit/*-deep-audit.md`) |
| Cross-course synthesis | **YES** (this document) |
| Database inspected | **YES** — live local `nexus` Postgres (23 tables), per-course counts and sampled rows re-verified by all agents |
| Assessment systems inspected | **YES** — 6 systems (chapter/topic quizzes, practice, challenges, final exam, projects/assignments, certificates) |
| Independent second-pass validation | **YES** — 3 independent evaluators, 9 courses re-scored from source; 2 prior-audit errors corrected |
| Implementation performed | **NO** — audit-only throughout |

**1. Top 10 systemic findings:**
1. No learning-objective layer anywhere (9/9).
2. No graded practical track; the only auto-grader (challenges) is UI-orphaned (9/9).
3. Final exam (156 Qs) is dead content — no summative assessment in the product (9/9).
4. Score-without-learning: no explanations on 4,414 course questions (9/9).
5. Topic-quiz randomization is a no-op (9/9).
6. Hardcoded 20-module gates contradict the dynamic-module fix (9/9, latent).
7. Stale "Hinglish" DB metadata contradicts all-English content (6/9).
8. Retired cloud services taught as current (IoT).
9. Flirtatious/filler distractors recur in 4 courses (~75 items).
10. Certificate path ignores all summative assessments (admin-verified only).

**2. Top 10 course-specific findings:**
1. CADD Civil identity failure + zero practical (P0) — 31/100, Major Revamp.
2. CADD Mech AddMate5 enum defect — and the prior audit's proposed fix was wrong.
3. SQL unanswerable topic-lock item (11477) + non-runnable capstone DDL + TRUNCATE mis-taught.
4. Core C wrong final-exam key (473) + toggle contradiction + inverted `%f`/`%lf` + 12/20 exam coverage.
5. Python 3 live wrong-grading items + 3 crashing snippets + self-import.
6. Embedded xPSR/PRIMASK + APB1 64 MHz + SysTick ENABLE + disassembly + 45 joke distractors.
7. Web Design position/z-index + ES modules absent though required by its own W18/W20.
8. C++ Q11920 multi-answer + fold_left mislabel + cout-in-bare-metal.
9. IoT retired services + W8-vs-W12 blocking-loop contradiction.
10. CADD Mech final exam = only 100% application-level assessment in the catalog (asset to preserve).

**3. P0 issues:** G-P0-1 CADD Civil identity (decision), G-P0-2 CADD Civil zero practice (decision-blocked), G-P0-3 SQL 11477 (fix), G-P0-4 C final-exam key 473 (latent→P0 if wired), G-P0-5 three latent platform-integrity P0s (Core C audit).

**4. P1 issues:** 18 global (G-P1-1…18) — see §13; ~90 course-local P1s in the per-course registers.

**5. Highest-ROI improvement opportunities:**
1. **Wire the challenge engine into the frontend** (existing sandbox + 11 seeds; converts the most expensive dead asset into the platform's first auto-graded application-level assessment).
2. **Content-only defect fixes (Wave 1):** all P0/P1 item defects are content-file + reseed, no code — low risk, high trust.
3. **Add explanation + randomization to quizzes** (schema + content + UI; lifts Feedback and Assessment across all 9).
4. **Serve-or-cut the final exam** (removes dead data or adds a summative; decision required).
5. **Resolve CADD Civil identity** (unblocks the only Major-Revamp course).

**6. Biggest unknowns:** live `main` parity; prod-DB drift; external vendor/API verification (SolidWorks, Revit, Civil 3D, rebar standards); zero student telemetry; no item-analysis.

**7. Recommended next phase:** Wave 0 decisions (CADD Civil, final exam, challenges) → Wave 1 content correctness → Wave 2 assessment infrastructure → re-scoring at Wave 6. **Nothing is to be implemented until the owner approves the Wave 1 decisions and this audit's improvement candidates.**

---

## 17. Final Verdict

The catalog's **content writers did their job; the curriculum-engineering layer did not.** Content quality (13–15/15 achievable) and technical accuracy are the strongest dimensions, but Learning Objectives, Feedback, Practical, and Assessment are structurally capped for every course. CADD Civil is the only course that is *fundamentally mis-scoped*; every other course is **repairable-in-place** without a rewrite. The path to 75+ catalog-wide runs through the assessment/feedback/objective infrastructure (Waves 2–4), not through editorial rewrites — a materially different (and more tractable) conclusion than the raw score drop suggests.

*Audit-only. No content, seed file, DB record, schema, or source code was modified. All improvement candidates remain unapproved until the owner reviews.*

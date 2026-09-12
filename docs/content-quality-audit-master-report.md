# EduNexus Pro — Content Quality & Curriculum Audit — MASTER REPORT

**Phase 2 of 2 | MASTER PLAN v1.0 | Audit-only — no content, code, schema, seed, API, or data modified.**
**Date:** 2026-08-14
**Companion docs:** `content-source-audit.md` (Phase 1), `content-quality-audit-<course>.md` ×9, `assessment-systems-audit.md` (STEP 7–8).

---

## 1. Executive Summary

The EduNexus Pro curriculum is a **large, original, structurally sound catalog**: 9 courses, 180 modules, 705 topics, **4,414 course questions**, 156 final-exam questions, ~177k words, with **zero within-course duplicate question texts and zero cross-course duplicate questions** across all 4,318 independently-written items. No course is broken structurally — every topic has exactly 4 quiz questions and the topic-lock flow is sound.

Against the audit rubric the catalog scores **72.9/100 average → "Needs Improvement"**:

- **Strong (2):** WebDesign **84**, Embedded **82**
- **Needs Improvement (4):** Python **77.3**, CADD Mechanical **76**, C++ **72**, IoT **71**
- **Weak (3):** C **67.3**, SQL **63.5**, CADD Civil **63**

The weaknesses are **not random** — they concentrate in four systemic gaps that drag every course down regardless of its subject depth:

1. **No learning-objective layer** — topics carry `{title, text, code, note}` only; criterion F is structurally capped for all 9 courses.
2. **No graded practical track** — lessons teach hands-on, but there are no assessed exercises, assignment briefs, or project rubrics bound to content. Capstones are prose narratives.
3. **Assessment infrastructure is half dead** — the 156-question final exam has **no route and no UI**; the platform's most advanced assessment engine (sandboxed auto-graded coding challenges) is **UI-orphaned**; course questions have **no explanation field** and **no option randomization**.
4. **Curriculum-identity and currency issues in specific courses** — CADD Civil is titled *civil* but teaches architecture/BIM (P0); IoT presents two **retired cloud services as current** (P1).

Item-level quality is a mix of **excellent** (Python: only 5 minor accuracy slips across 80 topics; WebDesign: zero confirmed errors, answer keys clean) and **breaking** (SQL: an unanswerable topic-quiz item; C: a factually wrong final-exam answer; CADD Civil: confirmed command/API defects). Technical accuracy on the programming courses is otherwise high — the deep audits verified the *hard* claims (forwarding references, `if constexpr`, `from_chars`, ARM/STM32 register idioms, SQL NULL semantics) and found genuine slips only at the margins.

**Catalog health distribution:** 0 Excellent · 2 Strong · 4 Needs Improvement · 3 Weak · 0 Major Revamp (CADD Civil sits 4 points above the Major-Revamp boundary and one rubric-judgment swing from it).

---

## 2. Scope, Constraints & Audit-Only Compliance

Governing spec: the user-provided **"EduNexus Pro — CONTENT QUALITY & CURRICULUM AUDIT MASTER PLAN v1.0"** (32 sections). The following constraints from the plan are **verbatim and were respected throughout**:

- ❌ No modification of: source code, database, Prisma schema, seed files, course content, questions, answers, explanations, APIs, frontend, backend, CMS, production data.
- ❌ No fixes performed while auditing.
- ❌ No silent rewriting of content.
- ❌ No assumption of what the curriculum "should" be without evidence.
- ❌ **FINAL RULE: no content rewriting until this audit is complete.**

**Compliance record:** the only files written during this phase are the audit deliverables themselves under `docs/` (`content-quality-audit-*.md` ×9, `assessment-systems-audit.md`, and this report). Temporary analysis scripts were written to `/tmp` (outside the repo) and executed read-only. No content/seed/schema/service file was opened for writing.

---

## 3. Method, Rubric & Evidence Standard

**Method** (per plan STEP 2–6): read-only inventory counter (TS, `/tmp`) → master inventory → rubric definition → full deep audit of the representative course (C++) → methodology validation → fan-out of one auditor per remaining course using the same rubric → cross-cutting audits of assessment systems and projects/assignments (STEP 7–8) → synthesis (STEP 9–15).

**Rubric (locked, weights, 0–5):**

| Criterion | Wt | 5 = | 3 = |
|---|---|---|---|
| A. Curriculum Architecture | 15% | complete, logically-ordered coverage | coherent sequence, gaps |
| B. Technical Accuracy | 15% | all claims verified, attributed | mostly correct, minor slips |
| C. Lesson Quality | 15% | exemplary clarity/scope/examples | clear, adequate depth |
| D. Practical Learning | 20% | code-first + graded exercises/projects/rubrics | some hands-on |
| E. Assessment Quality | 15% | multi-level, scenario-based, valid, quality distractors | aligned valid MCQs |
| F. LO Alignment | 10% | explicit per-topic objectives mapped to assessments | implicit alignment only |
| G. Industry Relevance | 5% | current, grounded in real artifacts | current and relevant |

Bands: 90–100 Excellent · 80–89 Strong · 70–79 Needs Improvement · 60–69 Weak · <60 Major Revamp.

**Evidence standard:** every conclusion is labeled ✅ CONFIRMED (read/cited) · 🔶 INFERRED · ⚪ UNKNOWN/external. RULE 4 (no "bad" without evidence), RULE 5 (no "outdated" without verification), RULE 7 (no length penalty), RULE 9 (missing ≠ present-but-weak), RULE 16 (assessment quality vs what was taught). Conflicts are reported, never papered over.

---

## 4. Coverage Disclosure

- **Content (STEP 4–6):** all 9 courses were audited. **8 of 9 were full-read end-to-end by their auditors** (SQL, IoT, WebDesign, Embedded, C, CADD Mech, CADD Civil, and the C++ representative) — coverage exceeded the 20%-sampling protocol in every case; one course (Python) was read per the protocol plus spot-checks (titles 80/80; weeks 1/7/14/20 + W11/W16 topics full-read; all quizzes and final exam read). This is disclosed per-course in each doc's coverage line.
- **Assessment infrastructure (STEP 7–8):** full read of quiz/practice/challenge/project/assignment services, routes, schema models, seed files, challenge seed data, sandbox security model, and a frontend endpoint-usage sweep.
- **Not covered:** production database contents, live-deployment parity (the live site runs GitHub `main`, which can drift from this tree — see §26), admin CMS screens in depth, certificate/payment flows.

---

## 5. Content Source & Pipeline (STEP 1) — summary

Full detail in `content-source-audit.md`. Relevant findings carried forward:

- **Live source of truth:** `backend/prisma/content/*.ts` (18 files) → reseed scripts (`reseed_*_full.ts`) → PostgreSQL → services → REST API → frontend. All 9 courses are deep hand-written content; `seed.ts` skips all 9 so the old template generators never overwrite them (`seed.ts:800-868`).
- **Content hierarchy:** Course (string PK) → Module (=week) → Topic (title/text/code/note) → QuizQuestion (`topicId=null` = chapter quiz; `topicId` set = topic quiz). Final-exam questions live in a separate `FinalExamQuestion` table.
- **DB course IDs differ from file slugs** (`C`, `C++`, `WebDesign`, `Python`, `SQL`, `IoT`, `Embedded`, `CADDED_Mech`, `CADDED_Civil` vs `c`, `cpp`, …) — relevant to any tooling.
- **Final exam is not served** (see §13).

---

## 6. Master Content Inventory (STEP 2)

Counted read-only (script `/tmp/content-inventory.ts`, output `/tmp/content-inventory-output.json`).

| Course | Modules | Topics | Med. words/topic | Chapter Q | Topic Q | Final Exam Q |
|---|---|---|---|---|---|---|
| c | 20 | 65 | 145 | 158 | 260 | 15 |
| cpp | 20 | 80 | 277 | 160 | 320 | 18 |
| iot | 20 | 80 | 286 | 160 | 320 | 18 |
| embedded | 20 | 80 | 348 | 160 | 320 | 18 |
| sql | 20 | 80 | 149 | 160 | 320 | 18 |
| python | 20 | 80 | 226 | 160 | 320 | 18 |
| webdesign | 20 | 80 | 208 | 160 | 320 | 15 |
| cadd_mech | 20 | 80 | 305 | 160 | 320 | 18 |
| cadd_civil | 20 | 80 | 307 | 160 | 320 | 18 |
| **Total** | **180** | **705** | — | **1,438** | **2,820** | **156** |

- 100% of topics carry a `code` field and a `note` field; every topic has exactly 4 topic-quiz questions (0 missing — topic-lock flow structurally safe).
- Total: **177,241 words**, **1,109,310 characters**, **4,414 course questions**.
- Outliers: **c** (65 topics, shallowest at median 145 words), **sql** (median 149 words), **embedded** (deepest, 348), **webdesign** (15 final-exam q) and **c** (15 final-exam q).

---

## 7. Audit Rubric Definition (STEP 3)

Locked as §3. Anchors were validated against the C++ deep audit and confirmed to produce defensible, evidence-backed scores (STEP 5). The rubric is the instrument all per-course docs use; their Section Q tables show the full weighted math.

---

## 8. Representative Deep Audit — C++ (STEP 4)

`docs/content-quality-audit-cpp.md`. **72/100 → Needs Improvement.** 100% of `cpp.ts` (20 weeks, 80 topics, 160 chapter quizzes, 18 final-exam) and 100% of `cpp_topic_quizzes.ts` (320 questions) read, plus serving logic in `quizService.ts`. Critical findings: no LO layer (P1), dead final exam (P1), no graded practical (P1), `std::cout` in a bare-metal context (P2, `cpp.ts:919`), garbled topic-quiz stem (P2), register addresses without datasheet attribution (P2, ⚪), topic-quiz randomization no-op (P2). Verified-correct items recorded in §E of that doc (forwarding refs, `if constexpr`, `from_chars`, `.at()` exceptions, integer-division truncation, strncpy null omission, iterator invalidation, virtual-from-ctor dispatch, etc.).

---

## 9. Scoring-Methodology Validation (STEP 5)

The methodology is **validated**: (a) structural metrics (inventory) + (b) full-read of a representative course + (c) read-only duplication scripts produce evidence-labeled scores that discriminate cleanly between courses (84 → 63 range) and isolate the same four systemic gaps repeatedly — a sign the rubric is measuring real properties, not noise. The duplication scripts additionally proved the catalog's question-writing is original (see §18). The one protocol risk — scoring unread topics — was neutralized because the fan-out auditors exceeded the sampling protocol and read ~100% of every course.

---

## 10. Remaining Courses — Audits & Scorecards (STEP 6)

Each course has a full A–R audit doc. Scorecards (weighted totals):

| Course | A | B | C | D | E | F | G | **/100** | Band |
|---|---|---|---|---|---|---|---|---|---|
| WebDesign | 4.0 | 4.0 | 5.0 | 5.0 | 4.0 | 4.0 | 5.0 | **84** | Strong |
| Embedded | 5.0 | 4.0 | 5.0 | 4.0 | 4.0 | 4.0 | 4.0 | **82** | Strong |
| Python | 4.5 | 4.5 | 4.0 | 3.75 | 3.75 | 3.5 | 5.0 | **77.3** | Needs Improvement |
| CADD Mech | 4.0 | 3.5 | 4.5 | 4.0 | 4.0 | 3.5 | 5.0 | **76** | Needs Improvement |
| C++ | 4.0 | 4.0 | 4.5 | 3.5 | 3.5 | 3.0 | 4.0 | **72** | Needs Improvement |
| IoT | 4.0 | 4.0 | 4.0 | 3.5 | 3.5 | 3.0 | 4.5 | **71** | Needs Improvement |
| C | 3.5 | 4.0 | 3.5 | 3.25 | 3.25 | 3.5 | 4.5 | **67.3** | Weak |
| SQL | 4.0 | 3.0 | 3.0 | 3.5 | 3.0 | 3.0 | 4.5 | **63.5** | Weak |
| CADD Civil | 3.0 | 4.0 | 4.0 | 3.0 | 3.0 | 3.0 | 3.0 | **63** | Weak |

**Catalog average: 72.9 → Needs Improvement.** Two courses sit within one rubric-judgment of a band boundary (CADD Civil 63, with a sensitivity note that D=2 ⇒ 59/Major Revamp; C 67.3 just under the 70 boundary).

---

## 11. Cross-Course Comparison (STEP 10)

**Architecture (A) — strong everywhere (3.0–5.0):** every course is a coherent 20-week progression with 4 topics/week; only CADD Civil (3.0) and C (3.5) scored below 4. CADD Civil's low A is driven by identity (civil-promise vs BIM-content, §17).

**Lesson quality (C) — the catalog's strength:** 4.0–5.0 across 8 of 9; only SQL (3.0) and C (3.5) are dragged down by thin lessons vs. title promise (RULE 7 — scope judgment, not a length penalty).

**Practical learning (D) — the catalog's structural ceiling:** 3.0–5.0, but every 5 or 4 is earned by *hands-on teaching* (WebDesign 5, Embedded 4, CADD Mech 4), **not by graded deliverables** — no course's D reflects assessed practice (§14).

**Assessment (E) — 3.0–4.0:** valid and aligned MCQs everywhere, but recall-dominated, explanation-less, unrandomized (§13). CADD Civil (3.0) additionally has absurd distractors and final-exam items testing untaught material.

**LO alignment (F) — 3.0–4.0, structurally capped:** best-in-class is implicit alignment only (WebDesign/Embedded 4.0); no course has explicit objectives.

**Industry relevance (G) — high (3.0–5.0):** the strongest criterion; WebDesign/Python/CADD Mech scored 5.0. IoT's 4.5 is contaminated by two retired services (§19).

**Consistency note:** question-format conventions are uniform (4 options, one correct), but *answer-key strength* varies sharply — Python/WebDesign keys verified clean; C, SQL, and CADD Civil each contain at least one factually wrong or unanswerable key (§15–16).

---

## 12. Learning-Objective Alignment Matrix (STEP 9)

No course defines learning objectives. The topic model (`cpp.ts:12-17`) exposes only `title/text/code/note`; week `description` fields state *coverage* ("we cover X"), not *outcomes* ("you will be able to X"). Alignment is therefore implicit: quiz questions are written against the lesson that precedes them, but nothing formalizes or verifies the mapping.

| Course | F score | Implicit alignment evidence | Explicit objectives | Objectives→assessment map |
|---|---|---|---|---|
| WebDesign | 4.0 | chapter/topic quizzes track lessons closely; answer keys verified | ✗ | ✗ |
| Embedded | 4.0 | quizzes map cleanly to week content | ✗ | ✗ |
| Python | 3.5 | good, minor misalignment (W4/W5 items) | ✗ | ✗ |
| CADD Mech | 3.5 | adequate, some items test adjacent material | ✗ | ✗ |
| C | 3.5 | adequate; final exam misses 7/20 weeks | ✗ | ✗ |
| C++ | 3.0 | implicit; no map | ✗ | ✗ |
| IoT | 3.0 | implicit; some items test concepts not taught | ✗ | ✗ |
| SQL | 3.0 | implicit; one unanswerable item | ✗ | ✗ |
| CADD Civil | 3.0 | weak; final exam tests untaught MIRROR/values | ✗ | ✗ |

**Matrix result:** 0/9 courses satisfy F at the 5-level. This is the highest-leverage single fix available to the catalog.

---

## 13. Question-Systems Audit (STEP 7)

Full detail in `assessment-systems-audit.md`. Six systems, three reachable:

| System | Qty | Status |
|---|---|---|
| Week/chapter quizzes | 1,438 | ✅ LIVE — no shuffle, no option shuffle, no explanations |
| Topic quizzes | 2,820 | ✅ LIVE — "randomization" is a no-op (`slice(0,5)` on 4-question banks, `quizService.ts:336-338`) |
| Practice bank + daily challenge | DB | ✅ LIVE — explanations present; atomic XP guard |
| Interactive coding challenges | 11 seeds | 🔴 **UI-orphaned** — backend + sandboxed runner complete; **no frontend consumer** |
| Final exam | 156 | 🔴 **Dead** — zero refs in `backend/src` and `frontend/src` |
| Projects/assignments | — | ✅ LIVE as submission envelopes (see §14) |

Key cross-cutting facts (all ✅):
- `QuizQuestion` has **no explanation field** (`schema.prisma:137-151`) → 4,414 course questions provide right/wrong + correct answer but never *why*. `PracticeQuestion` does have `explanation` (`schema.prisma:218`) — the platform already knows how.
- Options are never shuffled in any path; week quizzes aren't shuffled at all.
- Grading is exact-string compare (`quizService.ts:52`).
- XP: 60% pass, 100 base + 50 perfect, once per week (non-atomic guard — race exists, `quizService.ts:83-112`; the daily-challenge path solves it atomically, `practiceService.ts:108-121`).
- The **interactive challenge engine** is the most sophisticated assessment asset (sandboxed subprocess, `ulimit`/`unshare -n`, assertion grading, rate-limited, server-side auto-completion) and it is invisible to students. Highest-value infrastructure currently wasted.

---

## 14. Projects & Assignments Audit (STEP 8)

- **Both subsystems exist and are live** (submit → admin evaluate → XP on APPROVED; +100 for projects, +20 for assignments; peer-solution browsers gated on approval).
- **But nothing in the curriculum drives them:** no content file defines per-week assignment briefs or project specs; the submission routes accept arbitrary metadata (`routes/project.ts:38-91`). The C++ capstone's 7-point rubric (`cpp.ts:923-926`) is decorative — never referenced by the route.
- **Gates are hardcoded to 20 modules** (`routes/project.ts:48-56`; `routes/assignment.ts:49-56` maps assignment week N → module 5N) — contradicts the dynamic-module-count fix in `quizService` (issue #70, `quizService.ts:34-35`). Latent break for any ≠20-module course.
- **No file-upload endpoint exists**; assignments default to `/uploads/mock_<file>` (`routes/assignment.ts:79,88`).

**Bottom line:** the platform has the *machinery* of practical assessment but not the *content* — no briefs, no rubrics, no deliverables. This is why D is capped across the catalog.

---

## 15. Technical-Accuracy Findings (all courses)

Sorted by severity. All ✅ CONFIRMED unless labeled.

**Wrong / broken (must fix):**
- **C — final-exam Q8** (`c.ts:2122-2129`): struct `{int x}` vs union `{int y; char z}` keyed "struct is larger"; both are 4 bytes (compiled probe; contradicts course's own union rule `c.ts:1377`).
- **SQL — capstone EXCLUDE DDL non-runnable** (`sql.ts:890-891`): `tsrange` on `timestamptz` columns → must be `tstzrange`; both EXCLUDE examples need unmentioned `CREATE EXTENSION btree_gist` (`sql.ts:808`).
- **SQL — TRUNCATE mis-taught** (`sql.ts:467,479`; `sql_topic_quizzes.ts:267`): quizzes assert non-transactional/rollback-able; false for PostgreSQL.
- **Embedded — xPSR/PRIMASK** (`embedded.ts:321`): PRIMASK is a separate ARMv7-M special register, not an xPSR field.
- **Embedded — APB1 64 MHz** (`embedded.ts:102`): exceeds STM32F4's 42 MHz APB1 limit; TIM2 example assumes non-default 16 MHz timer clock (`embedded.ts:411`).
- **CADD Civil — command/API defects** (`cadd_civil.ts:71,587,713,845,889`): OSMODE 4133 comment vs actual snap set; `NewLevel(3.6)` labeled meters is feet; `AddView` assigned to a return value; `ROOF_SLOPE` on a Floor; no-op ternary.
- **CADD Mech — SolidWorks VBA** (`cadd_mech.ts:356,412`): `AddMate5(0,…)` commented "concentric" but 0 = Coincident; `AddCustomProperty` treated as a variable. 🔶 (SW API enum, external check).

**Date/currency (RULE 5-verified):**
- **IoT — Google Cloud IoT** (`iot.ts:681`, retired 2023-08-16) and **Azure Time Series Insights** (`iot.ts:732`, retired 2025-03) taught as current. ✅ web-verified.

**Accuracy slips (P2):**
- **C++:** `std::cout` in bare-metal placement-new snippet (`cpp.ts:919`); register addresses without MCU/datasheet attribution (`cpp.ts:906,912-913`, ⚪); "GCC 9+" framing (`cpp.ts:69`).
- **C:** `%f`/`%lf` printf distinction taught backwards (`c.ts:337-339`); `malloc(0)` answer over-asserted; toggle keyed `~` vs course's `^` idiom (`c_topic_quizzes.ts:92` vs `c.ts:273`).
- **Embedded:** defective disassembly (`embedded.ts:187`, uninitialized loop register); SysTick taught without ENABLE (`embedded.ts:244` vs correct `SysTick_Config()` at `:429`); magic `0x40021000` (`embedded.ts:141`).
- **IoT:** W12 blocking `while(WiFi.status()…)` (`iot.ts:547`) is the exact anti-pattern the course flags (`iot.ts:395`).
- **WebDesign:** unterminated HTML comment in W15 example (`webdesign.ts:1207`); dead cross-reference (`webdesign.ts:871`).

**Clean (no confirmed errors):** **Python** (5 minor issues incl. a PEP 8 nit; zero Python-2-era content) and **WebDesign** (answer keys verified across all layers, zero errors).

---

## 16. Assessment-Item Quality Findings (all courses)

- **Broken/unanswerable:** **SQL** W10 topic quiz — "Which command evolves the schema…" has no valid option (`sql_topic_quizzes.ts:260`, P0). **C** final Q8 (§15). **CADD Civil** final Q3/Q5 test untaught material (`cadd_civil.ts:927,929`).
- **Ambiguous / double-answer:** **Python** W4 chapter Q4 has two logically identical correct options (`python.ts:341-344`); W5 chapter Q4 keys the non-idiom `if len(my_list) > 0:` correct while `if my_list:` would be scored wrong (`python.ts:423-426`). **C** toggle item (§15).
- **Garbled stem:** **C++** `` `auto v[0]` in `std::vector<int> v;` … `` (`cpp_topic_quizzes.ts:93`, P2).
- **Weak distractors (low discrimination):** **IoT** ("look bigger", "it is Tuesday", "they are pretty"), **Embedded** ("the logo", "a poem", "a resignation letter", "toasts the pin"), **CADD Civil** ("Nautical miles", "Red, green and blue", "A sound alarm") — P2/P3, 20+ citations across docs.
- **Cognitive level:** uniformly recall/application MCQ; no scenario-based or multi-step items except the (orphaned) challenges. RULE 16 — assessed against what each course taught, the MCQs are mostly aligned, which is why E floors at 3.0–4.0 rather than lower.
- **Coverage:** **C** final exam omits 7 of 20 weeks (W2/4/5/6/7/8/20) — "Certification Prep" claim unsupported (`c.md` §P).
- **Redundancy within a course:** **WebDesign** `.sort()` and `res.ok` each appear 3× across chapter/topic/final layers; falsy and `5==="5"` near-verbatim 2× (`webdesign.ts:929` ↔ `webdesign_topic_quizzes.ts:1078` ↔ `webdesign.ts:1740`) — P2.

---

## 17. Missing vs Weak Content (RULE 9)

**CONTENT MISSING (absent, severity-tagged):**
- **All courses:** explicit learning objectives (§12); graded exercises; assignment/project briefs & rubrics (§14); reachable summative assessment (§13); question explanations (§13).
- **CADD Civil (P0):** AutoCAD Civil 3D workflows (alignments, profiles, corridors, grading, pipes) — named only at `cadd_civil.ts:64,108`; 12/20 weeks are architecture/structural. Also: zero datasets, zero hands-on assets.
- **SQL (P1):** window functions & CTEs — zero `WITH` content, passing mentions only (`sql.ts:291,375`).
- **Python (P1):** async/await — zero grep matches, though the course's stated next step is Flask/FastAPI (`python.ts:1631`).
- **WebDesign (P1):** CSS `position`/`z-index` (absent, yet W18 modals need it, `webdesign.ts:634`); ES modules and JS objects/classes (capped before the W20 React recommendation, `webdesign.ts:1630`).
- **C++ (P2):** preprocessor, unit testing, concurrency/threading.
- **Embedded (P2):** watchdog, MPU, CAN; security reduced to one CERT/SEI line (`embedded.ts:771`).
- **IoT (P2):** LoRaWAN/NB-IoT/LTE-M named as central (`iot.ts:69-70,109,125`) but join/OTAA/duty-cycle never taught.
- **C (P2):** depth on recursion/call-stack/sorting (summary level in a course titled "Deep").
- **CADD Mech (P1):** software-version attribution (none anywhere — blocks currency verification); CAM depth beyond G-code basics.

**CONTENT PRESENT BUT WEAK:**
- **C** and **SQL** lessons at median 145/149 words vs. the "deep" framing and SQL's own header claim of ~250–300 words (`sql.ts:4`) — RULE 7 scope judgment.
- **CADD Mech/Civil** `code` fields: headers promise "real, working, copyable" examples but weeks 16–20 are pseudo-workflows; Revit weeks ship full C# Revit-API programs a drafting student can't run (`cadd_civil.ts:581,587,625,819`) — wrong-altitude examples.

---

## 18. Redundancy & Duplication Findings

Read-only script (`/tmp/content-dup-check.ts`) across all 9 content files:
- **Chapter ↔ topic quiz text overlap: 0** in every course. ✅
- **Within-course duplicate question texts: 0** in every course. ✅
- **Cross-course duplicate question texts: 0** (all 4,318 chapter+topic items are original). ✅
- **One shared topic title** across courses — "Comparison & Logical Operators" (Python + WebDesign) — verified to hold **distinct** content (Python `==`/`is`/`and` vs JS `===`/`&&`/`||`). Not duplication.
- **Within-course item redundancy** exists at the *concept* level (WebDesign `.sort()`/`res.ok` 3×) — P2, see §16.

**Conclusion:** the catalog is genuinely original. Redundancy is a minor issue; the risk it protects against (copied question banks) is not present.

---

## 19. Outdated-Content Verification

RULE 5 applied: nothing was labeled "outdated" without verification.
- **CONFIRMED outdated (taught as current):** IoT — Google Cloud IoT (`iot.ts:681`, retired 2023-08-16) and Azure Time Series Insights (`iot.ts:732`, retired 2025-03). ✅ web-verified by the IoT auditor.
- **Dated framing:** C++ "GCC 9+" recommendation (`cpp.ts:69`) — anachronistic, not wrong.
- **No Python-2-era content** in Python (✅ verified clean).
- **CADD software-version state is unverifiable** because no version is ever named (§17) — a ⚪ that blocks currency determination for both CADD courses.
- **ARM/STM32 register addresses** (C++ `0x40020C14`/`0x40011004`/`0x40011000`, Embedded `0x40021000`) are plausible but unattributed to a datasheet — ⚪ pending external check.

---

## 20. Master Gap Matrix (STEP 11)

Rows = catalog-level gaps confirmed by ≥1 full-read audit. Cell = ✓ present · ⚠ partial/weak · ✗ absent · — n/a.

| Gap | C++ | C | SQL | Python | IoT | Emb | WD | CADD-M | CADD-C |
|---|---|---|---|---|---|---|---|---|---|
| Explicit learning objectives | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| In-content graded exercises | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Assignment briefs | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Project brief + rubric (assessed) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Reachable summative exam | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Question explanations | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Option/real item randomization | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Technical accuracy clean (no P0/P1) | ⚠ | ✗ | ✗ | ✓ | ⚠ | ✗ | ✓ | ✗ | ✗ |
| Modern-topic coverage | ⚠ | ⚠ | ✗ | ✗ | ⚠ | ⚠ | ✗ | ⚠ | ✗ |
| Security content | ⚠ | ⚠ | — | — | ⚠ | ✗ | — | — | — |
| Standards/datasheet/version attribution | ⚠ | ⚠ | ⚠ | ✓ | ⚠ | ⚠ | ✓ | ✗ | ✗ |
| Curriculum-identity coherence | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Distractor quality (no absurd fillers) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ⚠ | ✗ |
| Hands-on practice in lessons | ⚠ | ⚠ | ⚠ | ✓ | ⚠ | ✓ | ✓ | ✓ | ✗ |

(✓/✗ per the per-course audit docs; ⚠ = present but weak/partial per RULE 9.)

**Reading of the matrix:** the left four columns (objectives → explanations → randomization → summative) are **catalog-uniform failures** — they are infrastructure/standard problems, not per-course content problems. The right half is per-course content debt. This split shapes the roadmap (§23): fix the uniform layer once, then course-specific gaps.

---

## 21. Critical-Findings Backlog P0–P3 (STEP 12)

**P0 — blocks learners / actively wrong (fix first):**
1. **CADD Civil — curriculum identity:** course titled *civil*; Civil 3D never taught; 12/20 weeks are architecture/structural BIM (`cadd_civil.md`; `cadd_civil.ts:64,108`). *Decision required: rename/re-scope vs. build the civil track.*
2. **CADD Civil — zero practice:** no exercises/assignments/projects/datasets in either file (P0 in that audit).
3. **SQL — unanswerable item:** W10 topic quiz keyed to a phrase not among the options (`sql_topic_quizzes.ts:260`). Blocks that topic-lock gate.
4. **C — wrong final-exam key:** struct vs union size (§15). Wrong answer on a certification item.

**P1 — systemic / material:**
5. No learning-objective layer, any course (§12).
6. No graded practical track, any course (§14).
7. Final exam (156 q) dead content (§13).
8. Interactive challenge engine UI-orphaned (§13).
9. IoT — retired cloud services taught as current (`iot.ts:681,732`).
10. SQL — capstone DDL non-runnable (`sql.ts:890-891,808`); TRUNCATE mis-taught (`sql.ts:467,479`).
11. Embedded — xPSR/PRIMASK (`embedded.ts:321`); APB1 64 MHz (`embedded.ts:102`).
12. CADD Mech — no software-version attribution; SW VBA errors (`cadd_mech.ts:356,412`); `code`-field over-promise (weeks 16–20).
13. CADD Civil — code at wrong altitude (C# Revit API for drafting students); OSMODE/NewLevel/ROOF_SLOPE defects.
14. C — toggle `~` vs `^` contradiction (`c_topic_quizzes.ts:92` vs `c.ts:273`); `%f/%lf` backwards (`c.ts:337`).
15. Python — async/await absent (`python.ts:1631` context); two flawed items (`python.ts:341-344,423-426`); runnability NameError/self-import (`python.ts:320,1037-1038,1536`).
16. C++ — `std::cout` bare-metal (`cpp.ts:919`); garbled stem (`cpp_topic_quizzes.ts:93`).
17. WebDesign — `position`/`z-index` absent (`webdesign.ts:634`); ES modules/objects not taught (`webdesign.ts:1630`).

**P2 — quality (representative subset):**
18. Topic-quiz "randomization" no-op + no option shuffle (§13).
19. No explanations on 4,414 questions (§13).
20. Distractor quality (IoT, Embedded, CADD Civil — §16).
21. Lesson depth vs "deep" promise (C, SQL).
22. Hardcoded 20-module gates (project/assignment) vs #70 dynamic fix (§14).
23. Non-atomic XP-award race (`quizService.ts:83-112`).
24. Embedded SysTick ENABLE omission + defective disassembly (`embedded.ts:244,187`).
25. IoT W12 blocking-loop anti-pattern (`iot.ts:547` vs `:395`).
26. WebDesign broken HTML comment + dead cross-ref (`webdesign.ts:1207,871`).
27. C++/Embedded register addresses without datasheet (`cpp.ts:906,912`; `embedded.ts:141`) ⚪.

**P3 — polish:**
28. Assignment `mock_` fileUrl default (`assignment.ts:79,88`); front-loaded badge curve (`quizService.ts:101-103`); C++ "GCC 9+" framing (`cpp.ts:69`); typo "GIMPEL" (`embedded.ts:276`); CADD Civil no-op ternary / stirrup shape code 07 vs BS 8666 33 (⚪).

---

## 22. Impact × Effort Matrix (STEP 13)

Impact = effect on rubric score & learner outcomes. Effort = content+code+review cost.

| Initiative | Impact | Effort | Priority | Wave |
|---|---|---|---|---|
| Wire challenge UI (frontend consumes existing engine) | High | **Low** | 1 | 2 |
| Fix P0 items + factual errors (§15/21) | High | **Low** | 1 | 1 |
| Decide final-exam fate (route it or remove it) | Medium | **Low** | 2 | 2 |
| Add explanations to quiz items | Medium | Medium | 2 | 2 |
| Real item/option randomization | Medium | **Low** | 2 | 2 |
| Dynamic module-count gates (project/assignment) | Low | **Low** | 3 | 1 |
| Replace retired IoT services + LoRaWAN topic | Medium | Medium | 2 | 5 |
| LO layer for all courses (standard + per-course) | **High** | High | 2 | 3 |
| Graded practicals + briefs + rubrics per course | **High** | High | 2 | 4 |
| CADD Civil identity decision + build/rename | **High** | High | 2 | 5 |
| Modern-topic gaps (async, window fns, z-index, …) | Medium | Medium | 3 | 5 |
| Attribution pass (datasheets/versions/standards) | Medium | Medium | 3 | 5 |
| Future-content standard + QA gate | High | Medium | 3 | 6 |

**Fast wins (Low effort, High/Medium impact) are concentrated in Waves 1–2.** The two High-impact/High-effort items (LO layer, graded practicals) are the structural ones that permanently move the catalog out of "Needs Improvement."

---

## 23. Content Improvement Roadmap — Waves 1–6 (STEP 14)

> **Gate:** nothing in Waves 1–6 is executed until this audit and the owner's review are complete (FINAL RULE). Waves are proposals, not performed changes.

- **Wave 1 — Blocking & correctness (Low effort, highest risk-reduction).** Fix all P0 items (SQL unanswerable, C final Q8, CADD Civil identity decision); all confirmed P1 technical errors (IoT retired services, Embedded xPSR/APB1, SQL EXCLUDE/TRUNCATE, CADD Mech SW VBA, C toggle/`%f`, Python flawed items, C++ bare-metal cout); dynamic module-count gates.
- **Wave 2 — Assessment infrastructure (Low-Medium effort).** Frontend wiring for the existing challenge engine (biggest ROI in the catalog — the hard part is already built); final-exam route-or-remove decision; add `explanation` to `QuizQuestion` (schema + content + UI) and surface it post-submit; real randomization (fix `slice(0,5)`; shuffle options; shuffle week quizzes).
- **Wave 3 — Learning-objective layer (catalog standard).** Extend the topic model with per-topic objectives; write measurable objectives for all 705 topics (highest effort of the phase); add the objectives→assessment map; verify each quiz item's alignment (this is the F fix).
- **Wave 4 — Graded practical track.** Per-module exercises with briefs; assignment briefs for weeks 1–4; project briefs + rubrics per course; bind the C++ capstone rubric (already written) to the submission flow; make capstones actually assessed (using the challenge runner where it fits).
- **Wave 5 — Course-specific gap content.** SQL window functions/CTEs; Python async; WebDesign position/z-index + ES modules; IoT LoRaWAN/NB-IoT + replace retired services; C preprocessor/testing/concurrency + depth on recursion/sorting; Embedded security/watchdog/MPU/CAN; CADD version attribution + CAM depth; CADD Civil identity resolution + Civil 3D content or honest re-scope.
- **Wave 6 — Future content standard + QA gate.** Adopt §24 as the mandatory standard; add automated item-validity checks (unique correct option present, key matches teaching, runnability, explanation present, attribution present) to the content pipeline; enforce in the QA/review process.

---

## 24. Future Content Standard (STEP 15)

A mandatory spec for all new or rewritten content (proposal for the owner's adoption):

1. **Objectives-first:** every topic declares a measurable outcome ("You will be able to …") that is testable by its quiz; every item maps back to an objective.
2. **Every quiz item carries:** a correct option that is genuinely present, plausible quality distractors (no absurd fillers), and an explanation field ("why this is correct / why not").
3. **Randomization is real:** option order shuffled at serve-time; item banks ≥6 where a "random draw" is claimed.
4. **Code is verified runnable:** every `code` field executes against its stated toolchain/version; no undefined variables, no self-imports, no copy-paste-breaking comments; examples matched to the audience's skill level (no C# Revit API to drafting beginners).
5. **Attribution is mandatory:** MCUs/registers cite a datasheet; CADD commands cite the software and version; SQL claims are dialect-scoped; standards (BS/ISO/ASME/ARM) are named.
6. **Currency gate (RULE 5):** any named service/platform/standard must be verified non-retired at write time and re-verified at review time.
7. **Practical deliverables are bound:** every module's practice maps to a brief; every course has a graded capstone with a rubric; nothing described in prose is unassessed.
8. **Coverage self-check:** every week contributes to the final exam (or the final exam is cut); no week is exam-invisible.
9. **Auditability:** each content file carries a header with intended depth, audience, and versioning, matching the actual content (fixes the "claims deep, is thin" pattern).

---

## 25. Beginner Experience & Industry Relevance

**Beginner experience:** no course has an explicit prerequisites section (noted in CADD Mech/Python audits). The low-threshold languages (WebDesign, Python) are structured as gentle ramps and scored highest overall; the "deep" systems courses (C, SQL) read as *reference* rather than *pedagogy* at median ~145 words/topic, which a beginner would find thin. The code-first style (every topic has a code block) is a genuine strength for hands-on learners. **Verdict:** beginner ramp is good where courses were written for beginners; weak where courses claim depth without scaffolding.

**Industry relevance (G = catalog high point):** WebDesign/Python/CADD Mech scored 5.0 — modern ecosystems (Tailwind, ES202x, typing/ruff/mypy/pytest/pyproject, pandas, Revit/AutoCAD/SolidWorks/CATIA breadth) are taught. The drags are **currency** (IoT retired services) and **attribution** (CADD versions, register datasheets). **Verdict:** content is current and job-relevant; the credibility risks are the un-attributed and retired claims, not the topic selection.

---

## 26. Unknowns & External Verification Required

- **⚪ Live-deployment parity:** the live site runs GitHub `main` (per Phase-1 finding, 4+ commits ahead of local master). All code-level conclusions are ✅ against this tree; live parity is unverified.
- **⚪ Production DB state:** seeded counts vs. live DB; whether admin edits have drifted topics/quizzes; CADDED module count in prod (a stale comment in `quizService.ts:33` claims "5 weeks" — current content is 20; the live value determines whether the hardcoded gates are latent or active).
- **⚪ External technical checks pending:** SolidWorks `swMateType_e` enum values (`cadd_mech.ts:356`); stirrup shape code 07 vs BS 8666 33 (`cadd_civil.ts`); STM32F4 register-address → datasheet mapping (`cpp.ts:906,912`; `embedded.ts:141`); ARMv7-M xPSR/PRIMASK (auditor states confirmed against spec, cite kept).
- **⚪ Retired-service dates:** IoT Google Cloud IoT / Azure TSI — web-verified by auditor; dates re-checked for the report.
- **⚪ Challenge/final-exam reachability on live deploy:** frontend grep is this tree; if the live bundle contains challenge pages not in this branch, the "UI-orphaned" finding narrows to this tree.
- **⚪ Admin CMS capability:** whether admins can edit final-exam/challenge/practice content (AdminDashboard reviewed only at endpoint-usage level).
- **⚪ Assessment feedback quality:** no instrument measures learning gains; "quiz passes" are the only completion signal.

---

## 27. Conclusion & Recommended Next Phase

**What the audit established (all evidence-backed):** a large, original, structurally sound curriculum whose **architecture, lesson quality, and industry relevance are genuine strengths**, dragged down by **four catalog-uniform gaps** (no objectives, no graded practical track, dead/orphaned assessment infrastructure, no feedback/explanations) and a **specific set of per-course defects** — including two P0-class problems (CADD Civil's identity mismatch, and unanswerable/wrong answer keys in SQL and C) and one currency failure (IoT retired services).

**Recommended sequence for the owner:**
1. **Review** this report and the 10 per-course docs (each is a scored A–R audit with line-cited evidence).
2. **Decide the two scope questions first:** (a) CADD Civil — build the civil track or re-scope honestly; (b) the final exam — route it or remove it. Both are cheap to decide, expensive to defer.
3. **Approve Wave 1** (correctness + P0 fixes — low effort, high risk reduction), then **Wave 2** (assessment infrastructure — the challenge-engine wiring is the single highest-ROI change in the catalog).
4. **Fund Waves 3–4** (LO layer + graded practical track) as the structural lifts that move the catalog average past 80. Waves 5–6 then close course-specific gaps and lock in the standard.
5. **Adopt the Future Content Standard (§24)** as the QA gate for everything new.

**Audit complete. No content was modified. The FINAL RULE holds: no content rewriting begins until the owner reviews and approves a wave plan derived from this report.**

---

*This report and all companion docs are audit deliverables. They are inputs to decision-making, not changes. All proposed fixes are proposals pending owner approval.*

# CADD Mechanical (CADDED_Mech) — Independent Deep-Scan Audit Report

**Course:** CADDED Software (Mechanical) — `CADDED_Mech`
**Auditor:** Lead Curriculum Quality Auditor (independent)
**Date:** 2026-08-14
**Scope:** Read-only deep-scan of the database (primary source of truth), the content pipeline files, and cross-reference against prior context docs. **Audit-only — nothing was modified.** Recommendations only.

**Sources of truth (priority order):**
1. **DATABASE (primary)** — local Postgres `nexus` DB via `/tmp/nexus-psql.sh` (read-only), course id `CADDED_Mech`.
2. **Content pipeline files** — `backend/prisma/content/cadd_mech.ts`, `backend/prisma/content/cadd_mech_topic_quizzes.ts`, `backend/prisma/reseed_cadd_mech_full.ts`.
3. **Contextual evidence (re-verified, not trusted blindly)** — `docs/content-quality-audit-cadd_mech.md`, `docs/assessment-systems-audit.md`, `docs/content-quality-audit-master-report.md`, `docs/wave1-decision-spec.md`, `docs/content-source-audit.md`.

**Evidence labels:** `[CONFIRMED]` directly verified (file:line or DB query), `[INFERRED]` strong conclusion, `[UNKNOWN — NOT VERIFIED]` cannot verify, `[RECOMMENDATION]` suggestion only.
**Severity:** P0 critical / P1 high / P2 medium / P3 low.

---

## 1. Executive Summary

The CADD Mechanical course is a genuinely strong, hand-written 20-week mechanical-CAD/CNC curriculum covering AutoCAD (weeks 1–4), SolidWorks (5–8), CATIA (9–12), CNC G-code/M-code (13–16), and an integrated multi-part project with production documentation, GD&T and BOM (17–20). It contains **478 assessment questions** (320 topic-level, 160 module-level, 18 final-exam), all hand-authored with valid keys, sound distractors, and a final exam that is **100% application/analysis level** — an unusually high-quality assessment bank for this platform.

The database is **fully consistent** with the content files: all counts match exactly, no content drift was found.

However, the course has four P1 problems that cap its quality:

1. **SolidWorks VBA code fields contain confirmed API errors** (week 7: `AddMate5` mate-type comments reversed; `"type 8 = gear"` is wrong — 8 is Symmetry, Gear is 10; week 8: `AddCustomProperty` is misused to create a "global variable"). A student who copies these into SolidWorks will get wrong mates or a compile error.
2. **The header over-promises.** The interface declares `code: string; // Working, copyable example` but 10 of 80 code fields are explicitly labeled `pseudo` (workflow checklists, not code), and the SolidWorks/CATIA snippets are non-standalone fragments referencing undefined objects (`swModel`, `swAssy`).
3. **The final exam (18 questions) is dead content** — no route serves it, no UI surfaces it, and the certificate gate does not require it.
4. **No software version/edition is ever named** — yet the course teaches AutoCAD, SolidWorks and CATIA, whose commands and APIs vary heavily by version; the CATIA weeks implicitly teach V5 (CATScript, GSD) without saying so.

Structural gaps (P2): no explicit learning objectives or prerequisites anywhere; the capstone winch project is narrative-only with no formal brief or rubric; `QuizQuestion` has no explanation field (score-without-learning feedback); no hands-on graded practical is reachable (challenge engine is UI-orphaned, project submission is a generic envelope).

**Independent score: 68/100.** This deliberately does **not** inherit the prior audit's 76/100; it is recomputed fresh. I additionally correct a factual error that propagated through the prior audit and `wave1-decision-spec.md`: the prior documents claim `swMateType_e` defines **"5 = Concentric"** — independent verification of the SolidWorks API shows **0 = Coincident, 1 = Concentric, 5 = Distance, 8 = Symmetry, 10 = Gear**. The prior audits' proposed correction direction for the `AddMate5` finding was therefore itself wrong.

---

## 2. Course Metadata

| Field | Value | Evidence |
|---|---|---|
| Course id | `CADDED_Mech` | `[CONFIRMED]` DB query `SELECT id,title FROM "Course" WHERE id='CADDED_Mech'` |
| Title | CADDED Software (Mechanical) | `[CONFIRMED]` DB + `reseed_cadd_mech_full.ts:40` |
| Description | "Master AutoCAD, SolidWorks, CATIA, CNC Programming, and mechanical drafting systems." | `[CONFIRMED]` DB + `reseed_cadd_mech_full.ts:42` |
| Price | 699 | `[CONFIRMED]` `reseed_cadd_mech_full.ts:43` |
| isPublished | true | `[CONFIRMED]` `reseed_cadd_mech_full.ts:44` |
| Modules (weeks) | 20 | `[CONFIRMED]` DB `SELECT count(*) FROM "Module" WHERE "courseId"='CADDED_Mech'` → 20 |
| Topics | 80 (4 per module) | `[CONFIRMED]` DB + `cadd_mech.ts` |
| Topic-quiz questions | 320 (16 per module) | `[CONFIRMED]` DB |
| Module/chapter-quiz questions | 160 (8 per module) | `[CONFIRMED]` DB |
| Final-exam questions | 18 | `[CONFIRMED]` DB `SELECT count(*) FROM "FinalExamQuestion" WHERE "courseId"='CADDED_Mech'` → 18 |
| Interactive challenges | 0 | `[CONFIRMED]` DB join `Challenge`→`Module` for this course → 0 |

**Software taught (with version attribution):** AutoCAD, SolidWorks, CATIA — **none state a version.** `[CONFIRMED]` full-file grep of `cadd_mech.ts` for `20\d{2}|V5|V6|3DEXPERIENCE|R20x|Release` found no version attribution; the only "CAD version" string is a quiz distractor (`cadd_mech_topic_quizzes.ts:509`).

---

## 3. Content Inventory

All counts are **CONFIRMED against the live database** and independently re-checked against the content files.

| Item | Task-prompt expected | DB verified | Content file | Match |
|---|---|---|---|---|
| Modules | 20 | 20 | 20 sections | ✅ |
| Topics | 80 | 80 | 80 (4/module) | ✅ |
| Topic-quiz questions | 320 | 320 | 80 groups × 4 | ✅ |
| Module-quiz questions | 160 | 160 | 20 modules × 8 | ✅ |
| Final-exam questions | 18 | 18 | 18 (`caddMechFinalExam`) | ✅ |
| Challenges | 0 | 0 | 0 | ✅ |

Per-module DB check (week, topic count, topic-quiz count, module-quiz count): all 20 weeks return `4 / 16 / 8`. `[CONFIRMED]` SQL aggregate over `Module`/`Topic`/`QuizQuestion`.

**DB-vs-file discrepancies:** **NONE found.** Topic titles, module titles/descriptions, per-topic text/code/note, and question banks match between DB and `cadd_mech.ts` / `cadd_mech_topic_quizzes.ts` (full read of both files + DB spot-checks of weeks 2, 7, 8, 13, 14, 17, 20). Zero duplicate question texts across the 478 questions. `[CONFIRMED]`

---

## 4. Curriculum Structure

The 20-week arc is a coherent, phased design:

| Phase | Weeks | Theme | Modules |
|---|---|---|---|
| 1 | 1–4 | AutoCAD drafting | Workspace/Units/Layers; 2D Draw & Edit; Dimensions/Annotation/Plotting; Blocks/Templates/Productivity |
| 2 | 5–8 | SolidWorks parametrics | Sketching & Constraints; Extrude/Revolve/Loft; Assemblies & Mates; Configurations & Design Tables |
| 3 | 9–12 | CATIA surface & product | Sketcher & Part Design; Surfaces; Generative Shape Design (GSD); Draft Analysis & Product Engineering |
| 4 | 13–16 | CNC programming | Axis Systems; G-code & Canned Cycles; M-code & Machine Control; Toolpath Planning & Simulation |
| 5 | 17–20 | Integrated project & documentation | Multi-part Assembly Project; Production Drawings & GD&T; BOM & Documentation; Final Submission & Review |

`[CONFIRMED]` `cadd_mech.ts` section list (weeks 1–20) and DB module titles.

**Structure quality:** The phase ordering is pedagogically sound — each tool builds on drafting fundamentals, then on parametrics, then on manufacturing, and the capstone integrates everything. There is no orphaned content and no obvious missing prerequisite week. The one structural criticism is that the project is confined to a narrative thread across weeks 17–20 rather than being a formally specified deliverable (see §14).

---

## 5. Module-by-Module Analysis

See **MODULE SCORECARD** table below for per-week numeric scores. Narrative highlights:

- **Weeks 1–4 (AutoCAD):** The strongest and most accurate block. AutoLISP examples are genuinely runnable in most cases (`cadd_mech.ts:55,62,69,76,104,111,118,125`). Concrete part examples (gasket, cover plate, hex bolts) ground every command. The common-mistake pedagogy (freeze vs. off; block-insert vs. raw copy-paste) is excellent.
- **Weeks 5–8 (SolidWorks):** Prose is accurate and well-paced (DOF, mate strategy, configurations). **The code fields are the weak point** — the `AddMate5` and `AddCustomProperty` findings in §8.
- **Weeks 9–12 (CATIA):** Prose correctly reflects the CATIA V5 workflow (Sketcher constraints count, Part Design pads/pockets, GSD trim/join/fillet, draft analysis). Code fields are CATScript fragments (`cadd_mech.ts:447`) — illustrative, not standalone. **The version is never named** despite the content being V5-specific.
- **Weeks 13–16 (CNC):** Highly accurate G-code/M-code teaching. Feed/speed math is correct (12 mm end mill, 300 m/min, 4 flutes, 0.08 mm/tooth → ~7950 RPM, ~2540 mm/min; `cadd_mech.ts:663`). Safe-startup and post-processor content is genuinely industry-grade. Minor defects in §8/§12.
- **Weeks 17–20 (Project & documentation):** GD&T (feature control frames, datum order, stack-up) and BOM/revision content is accurate and professional. The winch project thread gives continuity, but is never formalised into a brief (see §14).

---

## 6. Topic-by-Topic Findings

Full per-topic detail for all 80 topics is enumerated in the content files; the key qualitative findings by topic cluster:

- **Week 2, "The Essential Draw Commands: Line, Polyline, Circle, Arc"** — prose and code disagree on the slot-end geometry (§8, defect CADD-12). `[CONFIRMED]` `cadd_mech.ts:103-104`
- **Week 7, "Standard Mates: Coincident, Concentric, Distance"** — prose is correct; code comment reverses the mate-type enum. `[CONFIRMED]` `cadd_mech.ts:355-356`
- **Week 7, "Advanced Mates & Mechanical Constraints"** — prose correctly describes Gear mate as needing a ratio; code claims `type 8 = gear`. `[CONFIRMED]` `cadd_mech.ts:363`
- **Week 8, "Global Variables & Equations"** — prose explains the Equations dialog correctly; code uses `AddCustomProperty` to "Add the driving variable", which is the wrong API. `[CONFIRMED]` `cadd_mech.ts:409-412`
- **Week 14, "G00, G01, G02/G03: Motion Commands"** — prose is accurate except the "G02 over 360 degrees errors" phrasing; the code's arc-centre comment is wrong. `[CONFIRMED]` `cadd_mech.ts:698-699`
- **Weeks 16–20 code fields** — 7 of the 10 `pseudo` workflows live here (`cadd_mech.ts:804,811,839,888,895,937,951`). `[CONFIRMED]`

---

## 7. Content Chunk Summaries

- **Total teaching chunks (topics):** 80, each with a structured `text` (GfG-style Markdown with `##` sections, a "Concrete Example", and usually a "Common Mistake"/"Why It Matters" block), a `code` field, and a one-line `note`.
- **Average topic text length:** substantial (roughly 400–700 words); the course is text-heavy with worked examples rather than video/asset-based.
- **Code field distribution:** 80 code fields — ~30 AutoLISP (weeks 1–4), ~24 VBA (weeks 5–8), ~10 CATScript (weeks 9–12), ~16 G-code/pseudo (weeks 13–20). `[INFERRED]` from full-file read.
- **Note fields:** 80 short industry takeaways, consistently high quality (e.g., "Real shops mirror geometry to guarantee symmetry…", "peck or break").
- **Assessment chunks:** 80 topic-quiz groups × 4 = 320; 20 module quizzes × 8 = 160; 1 final exam × 18. All MCQ, 4 options, single key.

**Assessment of the chunking:** The topic/chunk boundary is clean — each topic is a self-contained teaching unit keyed by exact title into the topic-quiz map (`cadd_mech_topic_quizzes.ts`). No chunk was found to be empty, duplicate, or mismatched with its quiz key. `[CONFIRMED]`

---

## 8. Technical Accuracy Findings

### 8.1 SolidWorks API — confirmed errors (P1)

| # | Location | Claim in content | Verified truth | Severity |
|---|---|---|---|---|
| A | `cadd_mech.ts:356` | `AddMate5(0, ...)` with comment `' Mate type 0 = concentric; repeat with type 1 for coincident.` | `swMateType_e`: **0 = Coincident, 1 = Concentric** — the comment has the two reversed. A student following the comment to add a "concentric" mate passes `0` and gets a **coincident** mate. | P1 |
| B | `cadd_mech.ts:363` | `AddMate5(8, 0, False, 0, 0.5, 0, ...)` with comment `' type 8 = gear; 0.5 = ratio` | **8 = Symmetry, 10 = Gear.** Also, `0.5` is in the `DistanceAbsUpperLimit` position, not a ratio field, and the call passes 11 args vs. the 15-parameter `AddMate5` signature (`MateType, Align, Flip, Distance, DistanceAbsUpperLimit, DistanceAbsLowerLimit, GearRatioNumerator, GearRatioDenominator, Angle, AngleAbsUpperLimit, AngleAbsLowerLimit, ForPositioningOnly, LockRotation, Options, Error`). | P1 |
| C | `cadd_mech.ts:412` | `swModel.AddCustomProperty "Wall", "2"` with comment `' Add the driving variable` | `AddCustomProperty` writes a **file custom property** (BOM/description data), it does **not** create a global variable. The equation `Overall-Length = "Inside-Length" + 2 * Wall` would fail to resolve `Wall`. The correct approach is the Equations dialog / `AddGlobalVariable` API. | P1 |
| D | `cadd_mech.ts:349` | "Fix the first component to the origin" | The snippet only *selects* the component; it never sets it fixed (e.g., `AddComponent5`'s `SetComponentFixed` param or a Fix call). Comment overstates what the code does. | P2 |

**Enum verification note:** The prior audit, `wave1-decision-spec.md`, and `content-source-audit.md` all repeated "5 = Concentric". Independent verification against the SolidWorks API (`swMateType_e`) is **0 = Coincident, 1 = Concentric, 5 = Distance, 8 = Symmetry, 10 = Gear**. The prior correction direction was wrong. `[CONFIRMED]` (API constant values cross-verified via SolidWorks API reference)

### 8.2 AutoCAD / CNC / GD&T accuracy

- **AutoCAD weeks:** accurate. System variables (`DIMTXT`, `DIMDEC`, `DIMASZ`, `DIMPOST`, `OSMODE` bit-mask 63) and commands (`MVIEW`/`1/2XP`, `ATTEXT` CSV, `.dwt` workflow) are all correct. `[CONFIRMED]`
- **CNC weeks:** accurate. G00 dog-leg, IJK vs R ambiguity, G17/G18/G19 plane selection, G81–G89 semantics, G80 cancel, M98/M99/L repeat, Fanuc Macro B (`#500+` common variables), safe-line `G90 G21 G40 G80 G49`, and post-processor dialect concept — all correct. `[CONFIRMED]`
- **GD&T week 18:** accurate — feature control frame interpretation, MMC, datum order matching setup, tolerance stack-up math (3×10.00 ±0.05 → 30.00 ±0.15 worst case). `[CONFIRMED]`

### 8.3 Minor accuracy defects (P3)

- `cadd_mech.ts:699` — `G02 X100 Y20 I0 J20 ; clockwise arc, centre at (80,40)` — tracing from start (80,0) with I0 J20 gives centre **(80,20)**, not (80,40). Comment wrong; the arc geometry itself is valid.
- `cadd_mech.ts:698` — "A G02 over 360 degrees errors" is imprecise: a complete 360° arc is legal with IJK on most Fanuc/ISO controls; an arc simply cannot *exceed* 360°. Phrase as "a single arc cannot exceed 360°; a full circle uses IJK with matching start/end."
- `cadd_mech.ts:103-104` — Week-2 slot-end polyline: prose describes `A` + `@40<90` (a semicircular end from (80,0) to (80,40), centre (80,20)); the code `"A" "CE" "@0,20" "@0,-20"` draws from the same start with centre (80,20) but an endpoint that returns to the start — it does not produce the described slot end.

---

## 9. Learning Objective Audit

**Finding: there are no explicit learning objectives anywhere in the course.**

- The content interface defines only `{ title, text, code, note }` (`cadd_mech.ts:14-19`). No objectives, outcomes, or "by the end of this topic you will…" statements exist at course, module, or topic level. `[CONFIRMED]`
- No prerequisites are stated (no "requires AutoCAD basics" or "assumes metric drafting").
- **Impact:** students cannot self-assess against stated goals; assessments cannot be audited against LOs; the "LO Alignment" rubric item is structurally capped.
- **Mitigating factor:** each topic's `text` opens with a purpose sentence and the module descriptions in the DB are outcome-flavored (e.g., "Build and refine geometry:…"). Implicit LOs exist and are mostly clear, but they are never made explicit.

**Score: 3/10.**

---

## 10. LO → Content → Practice → Assessment Matrix

Because no explicit LOs exist, this matrix states the **implicit learning outcome** per phase and maps it to content, hands-on practice (code fields), and assessment.

| Phase | Implicit outcome ("The learner can…") | Content evidence | Practice (code) | Assessment |
|---|---|---|---|---|
| 1 — AutoCAD (W1–4) | Set up a standards-based drawing environment, produce and edit accurate 2D mechanical geometry, dimension/plot it, and reuse content via blocks/templates | W1–4 topics | AutoLISP command sequences (`cadd_mech.ts:55,69,153,174,202`) | 16 topic-quiz + 8 module-quiz per week; keys valid |
| 2 — SolidWorks (W5–8) | Build parametric parts, constrain assemblies, and manage part families via configurations/equations | W5–8 topics | VBA fragments (`cadd_mech.ts:251,300,356,398`) — **contain API errors (§8)** | Per-week banks; module-quiz keys valid |
| 3 — CATIA (W9–12) | Model parts and class-A surfaces in CATIA and validate manufacturability (draft, thickness) | W9–12 topics | CATScript fragments (`cadd_mech.ts:447`) | Per-week banks; valid keys |
| 4 — CNC (W13–16) | Write, verify, and post-process safe G-code/M-code programs | W13–16 topics | Runnable G-code examples + pseudo CAM workflows (`cadd_mech.ts:699,706,762`) | Per-week banks + code-trace questions; valid keys |
| 5 — Project & doc (W17–20) | Plan, document, and release a multi-part product (GD&T, BOM, revision control, review) | W17–20 topics | Pseudo templates/checklists (`cadd_mech.ts:839,888,937,951`) | Per-week banks; final exam (18, all high-order) |

**Alignment verdict:** topic quizzes are keyed to exact topic titles (100% of 80 topics have a 4-question bank — `[CONFIRMED]` DB has 320 topic-quiz rows, 4 per topic), so **content → assessment alignment is structurally strong**. The weakness is that there are no explicit LOs to align *to* and the final exam is unreachable (§21).

---

## 11. Assessment Audit

**Inventory of assessment systems touching this course:**

| System | Count | Reachable? | Evidence |
|---|---|---|---|
| Topic quizzes (per topic) | 320 | ✅ Live (topic-lock flow) | `routes/quiz.ts` `getTopicQuizQuestions`; `CourseDetail.tsx` |
| Module/week quizzes | 160 | ✅ Live | `routes/quiz.ts` `getQuizQuestions` |
| Final exam | 18 | ❌ **Dead content** — zero refs in `backend/src` and `frontend/src`; no route/UI; certificate gate does not require it | `assessment-systems-audit.md:42,80-83`; `certificateService.ts` |
| Interactive challenges | 0 for this course (11 platform-wide) | ❌ UI-orphaned platform-wide | `challengeSeedData.ts:1-3`; frontend usage map |
| Project submission | 1 envelope per user | ✅ Live (free-form) | `routes/project.ts:38-91` |

**Quality of the live quiz banks:**
- All 478 questions have exactly 4 options and one valid key. `[CONFIRMED]`
- Keys are distributed across option positions and are unambiguous in the vast majority of cases (one edge-case in §12).
- The **final exam is exceptional**: all 18 items are application/analysis level (e.g., "A finished wall comes out 0.3 mm undersize… fix is G41/G42", "feature control frame: position Ø0.2 MMC ABC", "three parts at 20.00 ±0.1 stack to 60.00 ±0.3… best fix") — zero pure-recall items. `[CONFIRMED]` `cadd_mech.ts:1024-1043`
- The **module quizzes** (8/week) are tool-specific and include CNC code-trace items — stronger than the platform average.

**Structural weaknesses (platform-wide, apply here):**
- `QuizQuestion` has **no explanation field** (`schema.prisma:137-151`) → the post-submit breakdown reveals right/wrong and the correct answer but never *why* (`quizService.ts:54-64`). Score-without-learning. `[CONFIRMED]`
- Topic-quiz "randomization" is a no-op: `getTopicQuizQuestions` shuffles then `slice(0,5)` on a 4-question bank returns all 4; option order never shuffled (`quizService.ts:336-338`, `17-19`). Retakers see identical order. `[CONFIRMED]`
- Pass threshold 60%, XP 100 base +50 perfect — gamification is front-loaded (week-1 badge only). `[CONFIRMED]` `quizService.ts:67,90-103`

**Assessment Quality score: 7/10** — the banks themselves are excellent, but the absence of explanations, of reachable summative assessment, and of real randomization caps the score.

---

## 12. Question-Level Defects

See the **QUESTION AUDIT** table at the end of this report for the full register. Summary:

- **1 ambiguous-key edge case (P3):** Week 14 module quiz `'Which G-code is MODAL and stays active until replaced?'` options `['G01','M06','G28','G80']`, key `G01` (`cadd_mech.ts:719`). **G80 is also a modal G-code** (canned-cycle-cancel group, Fanuc group 09). The intended answer is clearly G01, but a student who has internalised the modal-group concept can reasonably argue G80. Fix: replace the G80 distractor with a non-modal code (e.g., G04) or reword to "motion-group modal."
- **~7 flippant/unprofessional distractors (P3):** `'Crash'` (`cadd_mech_topic_quizzes.ts:490`), `'A chat message'` (:507), `'Renamed final2'` (:510), `'The centre of the sky'` (:345), `'The sketch is colourful'` (:515), and `'test.sldprt on the desktop'` / `'Untitled-5.sldprt'` (`cadd_mech.ts:1016`). None create ambiguity (they are obviously wrong), but they undercut the professional register of a CAD certification-prep course.
- **No duplicate question texts** across all 478 questions. `[CONFIRMED]`

**Question Quality score: 4/5.**

---

## 13. Practical Learning Audit

- The course is **strong on practical *teaching***: every topic has a worked "Concrete Example," the CNC weeks include real G-code to type and trace, and the AutoLISP/VBA/CATScript fields invite hands-on experimentation.
- **But there is no graded hands-on practical.** The interactive challenge engine (sandboxed auto-grader, 11 seeded blocks platform-wide) is UI-orphaned — no student can reach it (`assessment-systems-audit.md:69-78`). This course has 0 seeded challenges. `[CONFIRMED]`
- There is **no CAD-file submission or model-verification** mechanism; the project submission route accepts `{ title, description, sourceCodeUrl, reportUrl, githubUrl }` metadata only (`routes/project.ts:38-91`). `[CONFIRMED]`
- **No software-access guidance** — the course never tells students how to obtain AutoCAD/SolidWorks/CATIA (student/trial licenses), which is a real barrier for a paid CAD course. `[CONFIRMED]` grep for trial/student/download terms returned no guidance.

**Practical Learning score: 5/10.**

---

## 14. Project Audit

- The **winch** project is a coherent, industry-credible capstone: BOM-first planning (base plate, side frames, drum, shaft, crank, bearings, bolts), interface contracts (Ø20 H7/g6, 4×M6), modelling order, tolerance stack-up, GD&T, drawing set, BOM, revision control, design review, and final transmittal. `[CONFIRMED]` `cadd_mech.ts:835-1008`
- **However it is narrative-only.** There is no formal brief (no objective statement, dimensions of the deliverable, acceptance criteria, or timeline), no rubric, and the platform's `ProjectSubmission` is a generic envelope that never references any course brief or rubric. `[CONFIRMED]` `routes/project.ts:38-91`; `assessment-systems-audit.md:91,100`
- The 20-module submission gate (`routes/project.ts:48-56`) currently works (this course has 20 modules) but is hardcoded and contradicts the dynamic-module refactor (`quizService.ts:34-35`). `[CONFIRMED]`

**Project Quality score: 3/5.**

---

## 15. Industry Relevance Audit

This is a genuine strength:

- **Certifications** mapped explicitly: Autodesk Certified Professional: AutoCAD, SolidWorks CSWA/CSWP, CATIA Associate/Professional, ASME Y14.5 GDTP, NIMS. `[CONFIRMED]` `cadd_mech.ts:1006`
- **Standards** woven throughout: ISO 7200 title blocks, ASME Y14.5 GD&T, ISO metric tolerance classes (H7/g6), ANSI drawing practices. `[CONFIRMED]`
- **Real manufacturing workflows:** post-processor dialects (Fanuc/Siemens/Heidenhain/Haas/Mazak), safe-line startup, single-block dry runs, peck-drilling rules ("peck or break"), tolerance stack-ups, revision control, transmittal sheets, waterjet DXF export at 1:1. `[CONFIRMED]`
- **Career framing** (drafter → designer → tooling → CAM/CNC → Class-A surfacer) is realistic and recruiter-aligned.

**Industry Relevance score: 5/5.**

---

## 16. Obsolete / Deprecated Technology Audit

- **AutoCAD:** content references Design Center, Tool Palettes, and "Content Explorer" (a modern feature) — all current. Nothing obsolete. `[CONFIRMED]`
- **SolidWorks:** API examples use current method families (`AddMate5`, `FeatureExtrusion2`, `FeatureRevolve2`, `InsertProtrusionBlend5`, `ConfigurationManager`). Method *names* are current-era; the usage errors are in arguments/comments, not deprecation. `[CONFIRMED]`
- **CATIA:** content is **CATIA V5** (CATScript, Generative Shape Design, Part Design workbench). V5 remains widely used in industry, but Dassault's current platform is **3DEXPERIENCE/V6** — the course should say it teaches V5 and note the platform relationship. `[CONFIRMED]` (`cadd_mech.ts:447` CATScript; no version label)
- **CNC:** Fanuc Macro B, M98/M99 subprograms, and RS-274 G-code are still the dominant industry standard. Nothing deprecated. `[CONFIRMED]`
- **Conclusion:** no deprecated technology is taught; the only issue is unlabeled version context (CADD-4).

---

## 17. Duplication Audit

- **Zero duplicate question texts** across 478 questions. `[CONFIRMED]` full read + DB check.
- **No topic-content duplication** between weeks — each week covers distinct material; the winch thread is a repeated *example subject*, not duplicated content (it appears as a concrete example in many weeks, which is pedagogically intentional and beneficial). `[CONFIRMED]`
- **No duplication between the deep curriculum and the old template seed:** the reseed is full-replace (`reseed_cadd_mech_full.ts:79-82` deletes old topics/quizzes; `:138` deletes old final-exam rows), and `seed.ts` skips CADDED courses (`seed.ts:800-868`). `[CONFIRMED]`
- **Cross-course:** this course is the only mechanical-CAD curriculum; no overlap with C++/Python/SQL/IoT/Embedded/WebDesign/Civil content. `[INFERRED]`

**Duplication verdict: clean.**

---

## 18. Consistency Audit

- **Internal naming consistency:** Topic-quiz keys use **exact** topic titles — 100% of 80 topics resolve to a quiz group (the reseed logs a warning if a topic is missing a map entry; none fired). `[CONFIRMED]` DB 320 topic-quiz rows across 80 topics.
- **Units:** consistent metric usage throughout (mm, m/min), with G20/G21 explained. `[CONFIRMED]`
- **Terminology:** "module" vs "week" is used interchangeably (a platform-wide convention); the DB field is `week`, titles say "week N". Not a content error.
- **Prose/code mismatch:** the Week-2 slot-end mismatch (§8.3) is the one concrete internal inconsistency. `[CONFIRMED]`
- **DB-vs-file consistency:** fully consistent (§3).

---

## 19. Feedback Audit

- **Content-level feedback:** excellent — every topic has worked examples and "Common Mistake" blocks that anticipate learner errors. `[CONFIRMED]`
- **Assessment-level feedback:** weak. `QuizQuestion` has no explanation field, so the platform shows right/wrong + the correct option but never *why* (`schema.prisma:137-151`, `quizService.ts:54-64`). The practice-bank model *does* have `explanation` (`schema.prisma:218`), proving the capability exists and simply wasn't applied to course quizzes. `[CONFIRMED]` `assessment-systems-audit.md:59`
- **No hints, no partial credit, no worked solutions on the wrong-answer path.**

**Feedback/Learning Support score: 3/5.**

---

## 20. Student Journey Audit

- **Onboarding:** no prerequisites stated; week 1 correctly starts from absolute basics (units, layers, grid/snap/ortho). A complete beginner can start. But no "how to get the software" guidance (§13).
- **Progression:** linear and locked via the topic-lock flow — every topic must have a quiz or later topics 404 (`reseed_cadd_mech_full.ts:18-20`). The 4-topics-per-week cadence is realistic.
- **Mid-course:** weeks 5–8 require SolidWorks access; weeks 9–12 CATIA. A student without both packages stalls. The platform provides no VM/trial path.
- **Completion gate:** certificates require all modules completed + verified payment, but **not** the final exam or project (`certificateService.ts`). So a student can earn the certificate without touching the capstone or the summative exam — the two highest-value items. `[CONFIRMED]`
- **Ending:** week 20 correctly closes the loop (design review, transmittal, certification roadmap) — a strong finish, if only it were bound to a real deliverable.

---

## 21. Assessment Reachability Audit

| Assessment | Reachable in UI? | Evidence |
|---|---|---|
| Topic quizzes | ✅ Yes | `CourseDetail.tsx`, `/api/quiz/questions/topic/:topicId` |
| Week quizzes | ✅ Yes | `CourseDetail.tsx`, `/api/quiz/questions/:courseId/:week` |
| Final exam (18) | ❌ No route, no UI | zero `finalExam` refs in `backend/src` + `frontend/src`; `assessment-systems-audit.md:42,80-83` |
| Challenges (0 here) | ❌ UI-orphaned platform-wide | `assessment-systems-audit.md:69-78` |
| Project submission | ✅ Yes (generic envelope) | `CourseDetail.tsx`, `routes/project.ts` |

**Consequence:** the course's best assessment asset — the 18-question, 100% high-order final exam — is **unreachable dead content**, and the certificate does not require it. For a course whose week quizzes are recall-to-application MCQ, the missing summative is a real gap.

---

## 22. Scope / Identity Audit

- **Course identity:** coherent — "CADDED Software (Mechanical)" accurately describes the content. `[CONFIRMED]` DB title + description.
- **Docs-vs-content discrepancy (pre-existing, cross-cutting):** `docs/content-source-audit.md:113` claims the platform "has 5 modules"; the live/content reality is **20 modules** for CADDED courses. This is a documentation error, not a content error, but it has fed the hardcoded 20-module gate assumptions (`routes/project.ts:48-56`). `[CONFIRMED]` (prior audit; verified DB = 20)
- **CATIA version unlabeled:** the course teaches CATIA V5 workflows without stating "V5" (§16). `[CONFIRMED]`
- **Scope creep check:** the course stays within mechanical CAD/CNC; it does not drift into electronics or civil. `[CONFIRMED]`

---

## 23. Scorecard + Confidence

### Weighted rubric (independent, recomputed — does not inherit the prior 76)

| Dimension | Weight | Score | Rationale |
|---|---|---|---|
| Curriculum Architecture | 10 | 8.0 | Coherent 5-phase arc, clean topic boundaries, strong progression |
| Learning Objectives | 10 | 3.0 | No explicit objectives or prerequisites anywhere |
| Content Quality | 15 | 13.0 | GfG-grade prose, worked examples, common-mistake pedagogy |
| Technical Accuracy | 15 | 10.0 | SolidWorks VBA errors; otherwise excellent (AutoCAD/G-code/GD&T) |
| Practical Learning | 10 | 5.0 | Practical teaching but no reachable graded hands-on work |
| Assessment Quality | 10 | 7.0 | Excellent banks; no explanations, no summative, no real randomization |
| Question Quality | 5 | 4.0 | Sound keys/distractors; 1 ambiguous + ~7 flippant items |
| LO Alignment | 5 | 3.0 | Content↔quiz alignment strong, but no LOs to align to |
| Difficulty Progression | 5 | 4.0 | Clear basics→advanced ramp, final exam is high-order |
| Industry Relevance | 5 | 5.0 | Certifications, ISO/ASME, real machining workflows |
| Project Quality | 5 | 3.0 | Great narrative capstone; no formal brief/rubric, generic envelope |
| Feedback/Learning Support | 5 | 3.0 | Strong in-content support; no explanation fields on quizzes |
| **Total** | **100** | **68** | |

### Module scorecard (0–100, weighted by Content 40% / Accuracy 30% / Practical 15% / Assessment 15%)

| Week | Module | Content | Accuracy | Practical | Assessment | Overall |
|---|---|---|---|---|---|---|
| 1 | AutoCAD Workspace, Units & Layers | 92 | 94 | 80 | 88 | 90 |
| 2 | 2D Drawing & Editing Commands | 90 | 86 | 78 | 86 | 86 |
| 3 | Dimensions, Annotations & Plotting | 90 | 92 | 78 | 88 | 88 |
| 4 | Blocks, Templates & Drafting Productivity | 92 | 92 | 78 | 88 | 89 |
| 5 | SolidWorks Sketching & Constraints | 88 | 84 | 70 | 86 | 83 |
| 6 | Parametric Features: Extrude, Revolve & Loft | 88 | 84 | 70 | 86 | 83 |
| 7 | SolidWorks Assemblies & Mates | 88 | 62 | 66 | 84 | **75** |
| 8 | Configurations & Design Tables | 86 | 70 | 66 | 84 | 78 |
| 9 | CATIA Sketcher & Part Design | 86 | 82 | 64 | 86 | 81 |
| 10 | CATIA Surface Creation & Editing | 86 | 82 | 64 | 86 | 81 |
| 11 | Generative Shape Design Studio | 86 | 82 | 64 | 86 | 81 |
| 12 | Draft Analysis & Product Engineering | 88 | 84 | 66 | 86 | 83 |
| 13 | CNC Axis Systems & Coordinate Frames | 90 | 94 | 80 | 90 | 90 |
| 14 | G-Code Commands & Canned Cycles | 90 | 84 | 80 | 88 | 86 |
| 15 | M-Code & Machine Control | 90 | 92 | 80 | 90 | 89 |
| 16 | Toolpath Planning & Simulation | 86 | 86 | 74 | 88 | 84 |
| 17 | Multi-Part Assembly Project | 84 | 82 | 70 | 86 | 82 |
| 18 | Production Drawings & GD&T | 90 | 92 | 74 | 90 | 88 |
| 19 | Bill of Materials & Documentation | 88 | 88 | 70 | 84 | 84 |
| 20 | Final Submission & Design Review | 86 | 84 | 66 | 84 | 81 |

**Confidence:** **High** on all inventory claims (direct DB/file verification); **Medium-high** on scoring (inherently judgmental). The weighted-total band I am confident in is **66–72**; the P1 SolidWorks VBA errors are confirmed facts, not opinions, and are the single biggest accuracy deduction.

### Divergence from prior audit
Prior `docs/content-quality-audit-cadd_mech.md` scored 76/100. I score **68/100**. Primary deltas: (a) I do not credit "learning objectives" (absent) as highly; (b) I weight the confirmed SolidWorks VBA errors as a P1 accuracy problem; (c) the final-exam dead-content finding is upgraded to **P1 for this course** (the prior assessment-systems audit lists it P1 platform-wide; the master report under-weights it). I also **correct the prior audits' factual error** about `swMateType_e` (§8.1).

---

## 24. P0/P1/P2/P3 Issue Register

| ID | Severity | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| CADD-1 | **P1** | `cadd_mech.ts:356,363` | SolidWorks `AddMate5` code fields: comment reverses Coincident/Concentric; "type 8 = gear" wrong (8=Symmetry, 10=Gear); ratio arg in wrong position; 11 args vs 15-param signature | `[CONFIRMED]` API enum `swMateType_e`: 0=Coincident, 1=Concentric, 5=Distance, 8=Symmetry, 10=Gear | Students copying the code get the wrong mate type or a compile error; erodes trust in the "copyable" promise | Rewrite both code blocks against the correct enum and full `AddMate5` signature; verify in a real SolidWorks macro |
| CADD-2 | **P1** | `cadd_mech.ts:9,17` + `:804,811,839,860,888,895,937,951,958,993` | Header promises "Working, copyable example" but 10 code fields are `pseudo` checklists and SolidWorks/CATIA snippets are non-standalone fragments referencing undefined `swModel`/`swAssy` | `[CONFIRMED]` full-file read; grep "pseudo" = 10 | Mismatch between promise and delivery for weeks 5–12 and 16–20 | Relabel the interface contract to "illustrative / pseudo where noted"; or complete the VBA/CATScript into runnable macros |
| CADD-3 | **P1** | Final exam; `certificateService.ts` | 18-question, 100% high-order final exam is dead content — no route, no UI, not required for certificate | `[CONFIRMED]` zero `finalExam` refs in `backend/src`+`frontend/src`; `assessment-systems-audit.md:80-83` | Summative assessment is absent; certificate granted without demonstrating capstone or exam | Serve the final exam post-course and gate the certificate on it (or explicitly cut it) |
| CADD-4 | **P1** | all weeks (esp. 9–12) | No software version/edition named; CATIA content implicitly teaches V5 (CATScript, GSD) | `[CONFIRMED]` full-file grep; `cadd_mech.ts:447` | CAD APIs/commands vary by version; students on the wrong version get confused | Add a version matrix (AutoCAD release, SolidWorks year, CATIA V5) at course start and per phase |
| CADD-5 | **P2** | `cadd_mech.ts:14-19` | No explicit learning objectives, prerequisites, or outcomes at any level | `[CONFIRMED]` interface has only title/text/code/note | Learners can't self-assess; LO-alignment dimension uncapped | Add per-topic/module objective lines and a course-level outcomes section |
| CADD-6 | **P2** | `cadd_mech.ts:835-840`; `routes/project.ts:38-91` | Winch capstone is narrative-only: no formal brief, rubric, or acceptance criteria; submission is a generic metadata envelope | `[CONFIRMED]` `assessment-systems-audit.md:91,100` | Capstone quality is unmeasurable; grading is subjective | Author a project brief + rubric and bind `ProjectSubmission` to it |
| CADD-7 | **P2** | `schema.prisma:137-151` | `QuizQuestion` has no explanation field → score-without-learning feedback on all 478 questions | `[CONFIRMED]` `assessment-systems-audit.md:59`; `quizService.ts:54-64` | Students see right/wrong but never why | Add optional `explanation` to `QuizQuestion` (pattern exists on `PracticeQuestion`) and populate for high-value items |
| CADD-8 | **P2** | platform challenge UI; course has 0 challenges | No reachable hands-on graded practical; challenge engine UI-orphaned | `[CONFIRMED]` `challengeSeedData.ts:1-3`; frontend usage map; DB challenge count 0 | Practical dimension unassessed despite heavy practical content | Wire the challenge engine into the UI and seed CADD exercises |
| CADD-9 | **P3** | `cadd_mech_topic_quizzes.ts:490,507,510,345,515`; `cadd_mech.ts:1016` | ~7 flippant/unprofessional distractors ("Crash", "A chat message", "The centre of the sky", "final2.sldprt on the desktop", …) | `[CONFIRMED]` read | Undercuts professional register; not ambiguous but tonal | Replace with plausible-but-wrong professional distractors |
| CADD-10 | **P3** | `cadd_mech.ts:719` | "Which G-code is MODAL…" key G01; G80 distractor is also modal (group 09) | `[CONFIRMED]` read | Edge-case two-correct-answers | Swap G80 → G04 or restrict wording to the motion group |
| CADD-11 | **P3** | `cadd_mech.ts:699` | G02 comment says "centre at (80,40)"; actual centre (80,20) | `[CONFIRMED]` trace | Confuses a student debugging the arc | Fix the comment |
| CADD-12 | **P3** | `cadd_mech.ts:103-104` | Week-2 slot-end polyline prose vs code mismatch | `[CONFIRMED]` read | Code doesn't produce the described geometry | Align code to prose (`A @40<90` / centre (80,20) endpoint (80,40)) |
| CADD-13 | **P3** | `cadd_mech.ts:698` | "A G02 over 360 degrees errors" — imprecise; a full 360° arc is legal with IJK | `[CONFIRMED]` | Minor wording; could mislead | Rephrase: "an arc cannot exceed 360°; use IJK for a full circle" |
| CADD-14 | **P3** | all weeks | No software access/licensing guidance (student/trial licenses) for AutoCAD/SolidWorks/CATIA | `[CONFIRMED]` grep | Real barrier for paid CAD course | Add a "Get the software" page (edu licenses, trials) |

**Counts: P0 = 0 · P1 = 4 · P2 = 4 · P3 = 6.**

---

## 25. Recommended Improvement Opportunities

Ranked, audit-only proposals:

1. **Fix the SolidWorks VBA code (CADD-1)** — highest-ROI accuracy fix; 4 weeks of content currently carry broken API examples.
2. **Make the final exam live and certificate-gating (CADD-3)** — turns the best assessment asset from dead content into the course's summative proof.
3. **Add explicit learning objectives + prerequisites (CADD-5)** — unlocks the LO-alignment dimension and improves self-assessment.
4. **Author a formal capstone brief + rubric and bind the submission route to it (CADD-6)** — makes the winch project gradeable and portfolio-ready.
5. **Add `explanation` support to quizzes (CADD-7)** — the practice bank already proves the pattern; extend it to course quizzes.
6. **Add a version/licensing matrix (CADD-4, CADD-14)** — one page at course start: which AutoCAD/SolidWorks/CATIA versions, how to obtain edu licenses.
7. **Relabel the `code` contract honestly (CADD-2)** — split "runnable example" from "pseudo-workflow" so the header promise is true.
8. **Wire the challenge engine into the UI (CADD-8)** — with CADD-specific seeds (e.g., G-code trace, AutoLISP output), the platform's most expensive asset goes live.
9. **Clean the flippant distractors (CADD-9)** and fix the modal question (CADD-10) in a content pass.
10. **De-duplicate the module-count logic** (project gate, assignment week→module map) against the dynamic `quizService` helper (`routes/project.ts:48-56`, `routes/assignment.ts:49-56`, `quizService.ts:34-35`).

---

## 26. Unknowns / Missing Evidence

- `[UNKNOWN — NOT VERIFIED]` **Live-deployment parity.** All route/code findings are against the local `master` tree; the live site runs GitHub `main`, which may drift. Content findings (DB + content files) are against the local `nexus` DB and repo.
- `[UNKNOWN — NOT VERIFIED]` **Whether any of the SolidWorks VBA snippets were ever executed.** They read as hand-written, never-compiled fragments; no test harness exists.
- `[UNKNOWN — NOT VERIFIED]` **Learner-facing analytics** (average completion, quiz pass rates) that would validate difficulty calibration — no data was available.
- `[INFERRED]` **CATIA version = V5** — inferred from CATScript + GSD + workbench terminology; never stated in content.
- `[INFERRED]` Cross-course duplication — no overlap found by reading; a full cross-course diff of all 9 content files was not run.

---

## 27. Final Verdict

**Score: 68/100 (P2 band) — "Good content, structurally weak delivery."**

The CADD Mechanical course contains some of the best-written technical teaching on this platform: accurate AutoCAD and CNC instruction, professional GD&T and BOM content, a genuinely industry-aligned certification/career layer, and an assessment bank (478 questions) whose keys are valid and whose final exam is entirely application/analysis level. The database is fully consistent with the content files — no drift, no duplication, no inventory shortfall.

It is held back from the top band by four confirmed P1 issues: broken SolidWorks VBA examples, an over-promising `code` contract, a dead (unreachable) final exam, and missing software-version attribution — plus structural P2 gaps (no learning objectives, no formal capstone brief/rubric, no quiz explanations, no reachable hands-on grading).

**Recommendation: release-ready only after the P1 code/accuracy and final-exam reachability items are addressed.** The P2 structural items are the correct focus for the post-audit improvement phase. This audit changed nothing; all findings are recommendations.

---

## MODULE SCORECARD

(Embedded above in §23 — Week | Module | Content | Accuracy | Practical | Assessment | Overall, all 20 weeks.)

---

## QUESTION AUDIT

| QID | Location | Question | Issue | Severity | Recommended fix |
|---|---|---|---|---|---|
| Q-1 | `cadd_mech.ts:719` | Which G-code is MODAL and stays active until replaced? `[G01, M06, G28, G80]` key G01 | G80 is also modal (group 09) — edge-case two-correct | P3 | Replace G80 with G04 (dwell, non-modal) or scope wording to the motion group |
| Q-2 | `cadd_mech_topic_quizzes.ts:490` | "…a LINKED BOM will…" — distractor `'Crash'` | Flippant distractor | P3 | Replace with "Change a row" / "Lose formatting" |
| Q-3 | `cadd_mech_topic_quizzes.ts:507` | "One product is delivered as…" — distractor `'A chat message'` | Flippant distractor | P3 | Replace with a plausible-wrong option |
| Q-4 | `cadd_mech_topic_quizzes.ts:510` | "Old revision PDFs should be…" — distractor `'Renamed final2'` | Flippant distractor | P3 | Replace with "Stored on the network drive" |
| Q-5 | `cadd_mech_topic_quizzes.ts:345` | "Part zero on a mill is usually placed at…" — distractor `'The centre of the sky'` | Flippant distractor | P3 | Replace with "The top-left corner of the stock" |
| Q-6 | `cadd_mech_topic_quizzes.ts:515` | "The gate at the sketch stage is…" — distractor `'The sketch is colourful'` | Flippant distractor | P3 | Replace with "The sketch has no constraints" |
| Q-7 | `cadd_mech.ts:1016` | File-naming question — distractors `'test.sldprt on the desktop'` / `'Untitled-5.sldprt'` | Flippant (tests bad practice, but tonal) | P3 | Acceptable; optionally soften to "final2.sldprt in one folder" only |
| Q-8 | all banks | 478 questions, no explanations | `QuizQuestion` has no explanation field | P2 | Add `explanation` to schema + content; populate for application/analysis items |

*Question-Quality dimension: 4/5. No incorrect keys found; one ambiguous edge case (Q-1); ~7 tonal distractors.*

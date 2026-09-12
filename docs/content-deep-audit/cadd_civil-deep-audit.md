# CADD Civil — Independent Deep-Scan Audit Report

| Field | Value |
|---|---|
| **Course (DB id)** | `CADDED_Civil` |
| **Course title (DB)** | "CADDED Software (Civil/Architecture)" |
| **Audit role** | Lead Curriculum Quality Auditor (independent) |
| **Audit date** | 2026-08-14 |
| **Audit type** | Full deep-scan, read-only |
| **Coverage** | 20/20 modules full-read (80/80 topics, 320 topic-quiz + 160 chapter-quiz + 18 final-exam questions read end-to-end in source and cross-checked against the live Postgres `nexus` DB) |
| **Sources** | Local Postgres `nexus` DB (primary), `backend/prisma/content/cadd_civil.ts`, `backend/prisma/content/cadd_civil_topic_quizzes.ts`, `backend/prisma/reseed_cadd_civil_full.ts`, `backend/src/routes/*`, `backend/src/services/*`, `frontend/src/pages/Quiz.tsx`, `frontend/src/hooks/useQuiz.ts`, `frontend/src/pages/CourseDetail.tsx`, `frontend/src/config/courses.ts`, `backend/prisma/schema.prisma`, contextual docs |
| **Evidence labels** | `[CONFIRMED]` directly verified · `[INFERRED]` reasonable inference · `[UNKNOWN — NOT VERIFIED]` gap · `[RECOMMENDATION]` recommendation only |
| **Overall score** | **31 / 100 — MAJOR REVAMP** (prior audit: 63/100 Weak — see §23 for rubric difference) |
| **Confidence** | **MEDIUM-HIGH** (full read + DB cross-check; some Revit API / rebar-standard claims depend on external reference knowledge) |

> **Non-negotiable constraint honoured:** this audit is **read-only**. No product content, seed file, database record, source code, or schema was modified. The only file written is this report. All recommendations are suggestions pending approval.

---

## 1. Executive Summary

CADD Civil (`CADDED_Civil`, titled "CADDED Software (Civil/Architecture)") is a 20-week, 80-topic survey of five industry-standard tools — AutoCAD Civil (W1–4), 3ds Max (W5–8), SketchUp/LayOut (W9–12), Revit Structure (W13–16), and Revit Architecture (W17–20). Its prose is professional and genuinely instructional, and the tool selection is career-relevant. However, the deep scan exposes fundamental problems:

1. **Identity failure (P0).** The course is titled *Civil*, but only W1–W4 are civil (and even those are site-plan drafting, not Civil 3D). 12 of 20 weeks teach architecture / structural BIM. No Civil 3D alignment/profile/corridor/grading/pipe content exists anywhere.
2. **Zero practical learning infrastructure (P0).** No exercises, no assignments, no datasets, no project briefs, no course-specific practice content. The `code` field is the only hands-on material, and much of it is at the wrong altitude for the intended learner (full C# Revit API programs for drafting students).
3. **Orphaned and hollow assessment/project systems (P1).** The 18-question final exam is unreachable from any route or UI and does not gate anything; the project flow has 0 records globally and no course linkage; topic quizzes are hidden for CADDED courses and their topic-lock is bypassed.
4. **11 confirmed technical/API defects (P1).** Concentrated in the Revit C# `code` blocks (feet-vs-metres, void-return misuse, wrong API overloads, roof-only parameter on a Floor, a no-op ternary, an outdated V-Ray renderer string).
5. **Question-quality floor (P2).** Absurd distractors ("Nautical miles", "Red, green and blue", "A sound alarm", "Auto-correct"), a misleading `SECTION` answer key, and final-exam items testing untaught material.

On the 100-point deep-audit rubric this course scores **31/100 — MAJOR REVAMP**. It is the weakest course in the catalog, below even the prior audit's 63/100 (which used a different, looser rubric). The strengths (writing quality, tool breadth, coherent 20-week structure) are real but are outweighed by the identity, practical-learning, technical-accuracy, and assessment-system gaps.

---

## 2. Course Metadata

`[CONFIRMED]` — from the live `nexus` DB (`Course` table):

| Field | Value |
|---|---|
| `id` | `CADDED_Civil` |
| `title` | "CADDED Software (Civil/Architecture)" |
| `description` | "Master AutoCAD Civil, 3DS Max rendering, Google SketchUp, and Revit BIM systems." |
| `price` | 699 |
| `isPublished` | `t` |
| `createdAt` / `updatedAt` | 2026-08-09 |

The `Course` table has only 7 columns (`id`, `title`, `description`, `price`, `isPublished`, `createdAt`, `updatedAt`). **There is no category, level, or cover-image column in the DB** — that metadata lives only in the frontend config. `[CONFIRMED]`

`[CONFIRMED]` — frontend catalog entry (`frontend/src/config/courses.ts`): category `Civil`, tags `['AutoCAD Civil','3DS Max','Google SketchUp','Revit']`, and an **8-item consolidated syllabus** that does not match the 20-week DB structure (§18). The DB title contains "Civil/Architecture", the description names AutoCAD Civil first, yet the delivered content is dominated by architecture/BIM.

---

## 3. Content Inventory

All counts independently verified against the live DB (`[CONFIRMED]`). File counts match DB counts exactly.

| Item | DB count (CADDED_Civil) | Expected | Status |
|---|---|---|---|
| Modules (weeks) | 20 | 20 | ✅ |
| Topics | 80 (4 per module) | 80 | ✅ |
| Topic-quiz questions | 320 (4 per topic, 16 per module) | 320 | ✅ |
| Chapter (module) quiz questions | 160 (8 per module) | 160 | ✅ |
| Final-exam questions | 18 (DB ids 634–651) | 18 | ✅ |
| Challenges | **0** (11 globally, all in WebDesign/SQL/Python) | 0 | ✅ |
| Projects | **0 globally** (CADD Civil has none) | — | ✅ |
| Practice questions | **0 for CADD** (5 globally: Electronics 1, Programming 4) | — | ✅ |

`[CONFIRMED]` — every one of the 80 topics has exactly 4 `QuizQuestion` rows with `topicId` set; every module has exactly 8 rows with `topicId IS NULL`. The reseed script (`backend/prisma/reseed_cadd_civil_full.ts`) rebuilds topics + quizzes + final exam from the two content files; counts agree with the files line-for-line.

`[INFERRED]` — the "topic-quiz questions also leak into the chapter quiz" behaviour (§21) means a student who takes the weekly chapter quiz is actually exposed to 24 questions (16 topic + 8 chapter), so the 320 topic questions are partially reachable — but the intended per-topic quiz UI is hidden for CADDED courses.

---

## 4. Curriculum Structure

The course is a 20-week × 4-topic scaffold across five tools:

| Weeks | Tool | Focus |
|---|---|---|
| 1–4 | AutoCAD Civil | units/layers, site plans, residential floor plans, sections/elevations/plotting |
| 5–8 | 3ds Max | modeling, materials/texturing, lighting, rendering/post-production |
| 9–12 | SketchUp + LayOut | core modeling, components/groups, extensions/workflow, layout/presentation |
| 13–16 | Revit Structure | basics, structural elements/detailing, reinforcement/schedules, documentation/sheets |
| 17–20 | Revit Architecture | levels/grids/walls, doors/windows/families, floors/roofs/stairs, schedules/sheets/coordination |

`[CONFIRMED]` — structure is internally coherent and tool-progressive (each tool builds on the prior). However:

- **Civil identity is only 4/20 weeks**, and W3–W4 are residential architecture (floor plans, elevations), not civil engineering. `[CONFIRMED]`
- **No Civil 3D**: the course never teaches alignments, profiles, corridors, grading, pipe networks, or Civil 3D surfaces — the actual civil workflow. Civil 3D is named only twice (W1–W2 topic text). `[CONFIRMED]`
- **Tool-hopping without integration**: five tools in twenty weeks with no cross-tool project that carries a design from survey → model → BIM. `[INFERRED]`
- **No prerequisites or module learning objectives** anywhere in the scaffold. `[CONFIRMED]`

---

## 5. Module-by-Module Analysis

### MODULE SCORECARD

Scoring: **Structure** (4-topic coherence, progressive depth, 1–5) · **Accuracy** (prose + code correctness, 1–5) · **Civil relevance** (fidelity to the "Civil" promise, 1–5).

| Week | Module title | Structure | Accuracy | Civil rel. | Notes |
|---|---|---|---|---|---|
| 1 | AutoCAD Civil: Units, Layers & Site Setup | 4 | 4 | 4 | Strong drafting-foundations prose. OSMODE 4133 comment/bit mismatch (§8-D1). |
| 2 | Site Plan Drawing & Dimensioning | 4 | 4 | 5 | Closest to a civil module; boundary/setback/dimension concepts. |
| 3 | Residential Floor Plans | 4 | 4 | 2 | Architecture. |
| 4 | Sections, Elevations & Plotting | 4 | 4 | 2 | Architecture/construction-drawing. |
| 5 | 3ds Max Modeling for Architecture | 4 | 4 | 1 | |
| 6 | Materials & Texturing | 4 | 4 | 1 | |
| 7 | Lighting Fundamentals | 4 | 4 | 1 | |
| 8 | Rendering & Post-Production | 4 | 3 | 1 | `V_Ray_Adv_2_10_03()` dated V-Ray 2.x string (§8-D10). |
| 9 | SketchUp Core Modeling Tools | 4 | 4 | 1 | |
| 10 | Components, Groups & Organization | 4 | 4 | 1 | |
| 11 | Extensions & Workflow | 4 | 3 | 1 | Pseudo-workflow code at W11. |
| 12 | Layout & Presentation | 4 | 4 | 1 | |
| 13 | Revit Structure Basics | 4 | 3 | 3 | `NewLevel(3.6)` feet-vs-metres (§8-D2). |
| 14 | Structural Elements & Detailing | 3 | 3 | 3 | `INSTANCE_OFFSET_POS_PARAM` no conversion (§8-D3); rebar 07 (§8-D8); `NewFamilyInstance(wall, along, doorType)` (§8-D9). |
| 15 | Reinforcement & Schedules | 3 | 3 | 3 | Rebar shape-code claims 07/28/33 un-attributed (§8-D8). |
| 16 | Documentation & Sheets | 4 | 3 | 3 | `sheet.AddView` void-return misuse (§8-D5). |
| 17 | Revit Architecture: Levels, Grids & Walls | 4 | 4 | 2 | `UnitUtils.ConvertToInternalUnits` correctly used at line 757 — the one correct pattern. |
| 18 | Doors, Windows & Families | 4 | 3 | 2 | `NewFamilyInstance(wall, along, doorType)` type mismatch (§8-D9); window instance repeats it. |
| 19 | Floors, Roofs & Stairs | 4 | 2 | 2 | `ROOF_SLOPE` on a Floor (§8-D6); `StairsRun.CreateStraightRun` missing `Document` (§8-D11); `RampRun`/`RunTreadsCount` concept mix (§8-D12). |
| 20 | Schedules, Sheets & Coordination | 4 | 4 | 2 | No-op ternary (§8-D7) is here. |

**Module-level verdict:** W1–W2 are the only modules that earn the course's civil title. W13–W20 (Revit) are architecturally plausible but carry the majority of the confirmed code defects and are pitched above the drafting-student audience.

---

## 6. Topic-by-Topic Findings

All 80 topics have `text` (prose), `code` (tool-specific), and `note` fields. `[CONFIRMED]` — per-tool `code` language: AutoLISP/`.scr` (W1–4), MAXScript (W5–8), Ruby API (W9–12), C# Revit API (W13–20).

**Highlights per band:**

- **W1–W4 (AutoCAD):** prose is the strongest band — genuinely useful drafting pedagogy (OSMODE, LIMITS, MLINE, HATCH, section marks, layer discipline). Code is simple AutoLISP/script, appropriate for the audience. Defect D1 (OSMODE comment) is the only code defect here.
- **W5–W8 (3ds Max):** solid materials/PBR/lighting prose. D10 (V-Ray 2.x string) is the currency defect. Post-production prose (W8) is excellent.
- **W9–W12 (SketchUp/LayOut):** clean, well-scoped, beginner-appropriate. Scenes/styles/section-planes explanations are accurate. Code is Ruby API, lightly used.
- **W13–W16 (Revit Structure):** prose is conceptually right, but the C# code blocks are where defects cluster (D2, D3, D5, D8, D9). The rebar-shape claims (07 = stirrup, 28/33 = hooks) are presented as fact with **no standard cited** (`[UNKNOWN — NOT VERIFIED]` whether the intended standard is BS 8666 or ACI 315; the "07" key in questions 13994/14008 is not universally true).
- **W17–W20 (Revit Architecture):** levels/grids/walls prose is accurate (and line 757 shows the correct `ConvertToInternalUnits` pattern — the gold standard the rest of the file fails to follow). D6, D11, D12 cluster in W19; D7 in W20.

`[RECOMMENDATION]` — topics would benefit from a per-topic "By the end of this topic you can…" statement and a "try it" exercise hook; neither exists today.

---

## 7. Content Chunk Summaries

Chunk type analysis across the file (`[CONFIRMED]`, sampled and spot-verified):

| Chunk | Volume (typical) | Assessment |
|---|---|---|
| **Text** | ~200–350 words/topic, headers + bold terms + "The Workflow" closer | Consistently high quality, professional register, accurate prose. Strongest asset. |
| **Code** | 8–15 lines/topic | Quality collapses in the Revit band (W13–20): 11 confirmed defects, pseudo-workflows, non-runnable fragments (`Document doc = ...;`, undefined hosts, `/* ... */` placeholders). |
| **Note** | 1–2 sentences | Generally accurate; the rebar note (`cadd_civil.ts:676`) repeats the un-attributed 07 claim. |
| **Quiz (chapter + topic)** | 8 + 16 per week | Mostly valid MCQs; distractors range from good (realistic plan-check scenarios) to absurd (§12). |
| **Final exam** | 18 | 2 items test untaught material (Q3/Q5); reachability is zero (§21). |

`[INFERRED]` — the "chunk" model is code-first (every topic has a code block), which is a strength for hands-on learners *when the code runs*. In the Revit band the code does not run as written, so the strength becomes a liability.

---

## 8. Technical Accuracy Findings

### Confirmed defects (`[CONFIRMED]`, all re-verified at source line and, where applicable, in DB)

| # | Location | Defect | Detail |
|---|---|---|---|
| D1 | `cadd_civil.ts:71` | OSMODE comment mismatch | `(setvar "OSMODE" 4133)` commented "End+Mid+Cen+Int+Perp". 4133 = Parallel(4096)+Intersection(32)+Center(4)+Endpoint(1). **Midpoint(2) is NOT set** and **Perpendicular(128) is NOT set** — comment claims Mid and Perp that the value does not include. |
| D2 | `cadd_civil.ts:587` | Feet-vs-metres | `doc.Create.NewLevel(3.6)` commented "create a level at elevation 3.6 m". Revit's `NewLevel` takes **internal feet**; 3.6 is 3.6 ft ≈ 1.1 m, not 3.6 m. Line 757 shows the correct `UnitUtils.ConvertToInternalUnits(e, DUT_METERS)` pattern. |
| D3 | `cadd_civil.ts:625` | Missing unit conversion | `INSTANCE_OFFSET_POS_PARAM.Set(-0.5)` commented "embed 0.5 m below". No `ConvertToInternalUnits`; -0.5 is internal feet ≈ -0.15 m. |
| D4 | `cadd_civil.ts:713` | Void-return misuse | `ElementId placed = sheet.AddView(plan.Id);` — `ViewSheet.AddView` returns **void** in the Revit API; the assignment does not compile. |
| D5 | `cadd_civil.ts:845` | Wrong parameter on Floor | `floor.get_Parameter(BuiltInParameter.ROOF_SLOPE).Set(0.02)` — `ROOF_SLOPE` is a roof-only parameter; on a `Floor` the correct parameter is `FLOOR_SLOPE` (or a slope arrow). |
| D6 | `cadd_civil.ts:889` | No-op ternary | `Material m = w.GetMaterialArea(true, true) > 0 ? mat : mat;` — both branches yield `mat`; the conditional is dead code and the result is unused. |
| D7 | `cadd_civil.ts:669,675` + quiz keys 13994/14008 | Rebar shape "07 = stirrup" presented as universal fact | Shape codes differ by standard (BS 8666, ACI 315, Revit's own shape families). The content states "07 stirrup … 28 and 33 standard 90°/180° hooks" with **no standard cited** and then tests it in two quizzes. `[CONFIRMED]` as an attribution gap; the numeric claim itself is `[UNKNOWN — NOT VERIFIED]` against a named standard. |
| D8 | `cadd_civil.ts:775` | Wrong overload | `doc.Create.NewFamilyInstance(wall, along, doorType)` passes `(Wall, double, FamilySymbol)` — no such public overload; the intended call is `NewFamilyInstance(XYZ, FamilySymbol, Wall, Level, StructuralType)` (the window example at line 801 shows the correct `(wall, location, windowType)` pattern, making D9 self-inconsistent within the same file). |
| D9 | `cadd_civil.ts:373` | Outdated renderer string | `renderers.current = V_Ray_Adv_2_10_03()` — a V-Ray **2.x** renderer class (~2012). No V-Ray version is ever stated elsewhere, so a learner cannot tell this is a decade-old API. |
| D10 | `cadd_civil.ts:857` | Missing `Document` argument | `StairsRun.CreateStraightRun(stairs, new XYZ(...), ...)` — the actual API is `StairsRun.CreateStraightRun(Document, ElementId stairsElementId, XYZ, XYZ, double)`; the `Document` first argument is omitted. |
| D11 | `cadd_civil.ts:863` | Ramp/stair concept mix | `RampRun.CreateStraightRun(ramp, ...)` — no such `RampRun` type exists in the public Revit API (ramps are created via `Ramp.Create` + sketch/`RampPath`); `rr.RunTreadsCount` mixes stair terminology onto a ramp. |

### Correct patterns that make the defects worse (`[CONFIRMED]`)
- `cadd_civil.ts:757` correctly converts metres → internal feet for `Level.Create`. The file *knows* the right idiom and fails to apply it at D2/D3.
- Window placement at `cadd_civil.ts:801` correctly passes `(wall, location, windowType)` while the door just above it (D9) does not.

### Prose accuracy
`[CONFIRMED]` — no factually wrong prose claims were found in the W1–W12 or structural-detail prose. The errors are concentrated in the executable/attribution layer, which matters because the code blocks are framed as "real, working, copyable" examples.

---

## 9. Learning Objective Audit

**Verdict: NO learning objectives exist.** `[CONFIRMED]`

- No `LearningObjective` table in the schema; no LO column on `Topic`/`Module`.
- The content files (`cadd_civil.ts`, `cadd_civil_topic_quizzes.ts`) contain no "By the end of this topic you will be able to…" or equivalent statements.
- No module outcomes, no prerequisites, no skill taxonomy (Bloom/KSA) anywhere.

Impact: the course cannot be held to measurable outcomes; §10 LO→assessment alignment cannot be established except by inference; the "Curriculum Architecture" and "LO Alignment" rubric criteria score near zero.

---

## 10. LO → Content → Practice → Assessment Matrix

Because **no LOs exist**, this matrix is reconstructed *by inference* from topic titles and quiz intent. `[INFERRED]` — treat as a best-effort map, not a verified claim.

| Band | Inferred outcome | Content | Practice | Assessment |
|---|---|---|---|---|
| W1–2 AutoCAD Civil | Configure units/layers/snaps; draw a dimensioned site plan with setbacks | ✅ Strong | ❌ None | ✅ Chapter quiz valid |
| W3–4 | Draft residential plans, sections, elevations, hatch + annotate | ✅ Strong | ❌ None | ✅ Valid; one misleading key (§12 Q2) |
| W5–8 3ds Max | Model, texture, light, render + post-produce a building | ✅ Strong prose | ❌ None | ⚠️ Recall-heavy; final Q5 tests untaught formulation |
| W9–12 SketchUp | Model with groups/components; present via LayOut scenes | ✅ Strong | ❌ None | ✅ Valid |
| W13–16 Revit Structure | Model structure, rebar, schedules, sheets | ⚠️ Prose right, code broken | ❌ None | ⚠️ Rebar-shape keys un-attributed |
| W17–20 Revit Arch | Levels/grids/walls, families, floors/roofs/stairs, sheets | ⚠️ Prose right, code broken | ❌ None | ⚠️ Q3 tests untaught MIRROR |

**Gap pattern:** content→quiz alignment is broadly acceptable; **practice is entirely missing** in every row; final-exam rows for the 3ds Max and Revit bands include untaught items (§12).

---

## 11. Assessment Audit

`[CONFIRMED]` — mechanics:
- **Quiz format:** 4 options, single correct answer, uniform across topic quizzes, chapter quizzes, and the final exam.
- **Chapter quiz:** `getQuizQuestions` returns the module's **entire** `quizQuestions` set — i.e. **24 questions/week** (16 topic + 8 chapter) presented as one quiz. Students cannot distinguish topic vs chapter items in the UI. `[CONFIRMED]`
- **Topic quiz:** `getTopicQuizQuestions` shuffles and `slice(0, 5)` — with only 4 questions per topic it returns all 4 in random order. `[CONFIRMED]`
- **Pass bar:** 60%. **Timer:** 300 s fixed. **Grading:** server-side, per-week module progress on `topicId` undefined (module quiz). `[CONFIRMED]`
- **No explanation shown to students** on any assessment — the results modal reports only correct/incorrect (Quiz.tsx / ExamResultsModal). `[CONFIRMED]`

**Strengths:** some genuinely good scenario items (final exam Q1 municipal plan-check; Q4 setback-line convention; Q16 viewport 1:100-vs-1:200 sheet error) that test professional judgment, not recall.

**Weaknesses:** recall-dominated; no randomization within the fixed 4-per-topic pool; no explanations; 24-question mixed chapter quiz dilutes the "topic" signal; final exam tests untaught material and is unreachable (§21); topic quizzes are UI-hidden for CADDED (§21).

---

## 12. Question-Level Defects

### QUESTION AUDIT — defective items (individually listed with DB id)

| DB id | Type | Text | Defect | Severity |
|---|---|---|---|---|
| 13683 | Topic quiz | "A building 0.2 m inside its required setback will…" | Distractor **"Auto-correct"** is nonsensical (`topic_quizzes.ts:52`) | P2 |
| 13725 | Topic quiz | "The command that creates a section cut through a building in AutoCAD is…" | Answer key **`SECTION`** is misleading — `SECTION` is a 3D-solid sectioning command, not the standard plan section-cut workflow (`SECTION`/`SECTIONPLANE` in Model Space; most drafters use section marks + `SECTIONPLANE`). A learner following the course's own section-mark pedagogy (W4) would not key `SECTION` (`topic_quizzes.ts:92`) | P3 |
| 13805 | Topic quiz | "The three lights in a classic three-point setup are…" | Distractor **"Red, green and blue"** (light colour, not positions) (`topic_quizzes.ts:176`) | P2 |
| 13994 | Topic quiz | "The rebar shape code for a rectangular stirrup is…" | Key **"07"** is un-attributed to any standard; not universally true (BS 8666 vs Revit shape families vs ACI) (`topic_quizzes.ts:363`) | P2 |
| 14008 | Chapter quiz | "The rebar shape code for a rectangular stirrup/tie is…" | Same un-attributed "07" key (`cadd_civil.ts:695`) | P2 |
| 14106 | Chapter quiz | "Revit flags a stair violation (like an over-high riser) by…" | Distractor **"A sound alarm"**; actual warning colour in the answer key ("Showing the stair in yellow") is only partially accurate — Revit shows a warning badge and the element in a warning colour (`cadd_civil.ts:873`) | P2 |
| 13669 | Chapter quiz | "Which UNITS convention is typical for a metric civil/site plan…?" | Distractor **"Nautical miles"** is absurd (`cadd_civil.ts:76`) | P3 |
| 636 | Final exam | "The workflow that guarantees the two halves of a symmetric floor plan are bit-identical is…" | Correct answer tests **MIRROR**, which is **never taught** in the curriculum (grep of both content files finds MIRROR only as this answer and as a distractor at `cadd_civil.ts:165`) | P2 |
| 638 | Final exam | "In 3ds Max, the 1.0 diffuse value that lets a map show through…" | Tests the **"1.0 diffuse multiplier"** concept, which is never taught (W6 teaches diffuse maps qualitatively; the specific amount-multiplier framing is absent) | P2 |

### Healthy items (summarized)
`[CONFIRMED]` — the remaining **479** quiz/final-exam questions are structurally valid (single unambiguous correct answer, relevant topic alignment). Distractor quality varies: the majority use plausible-but-wrong technical options (e.g. final exam Q16 "Correct"/"Unimportant"/"Fixed by the printer"); a subset (~8–10 items) uses the absurd distractors sampled above.

---

## 13. Practical Learning Audit

**Verdict: ZERO graded or structured practical learning.** `[CONFIRMED]`

- No `PracticeQuestion` rows reference CADD content; the practice arena route (`backend/src/routes/practice.ts`) **only accepts categories `Programming` and `Electronics`** and 400s otherwise — CADD practice is impossible in the existing arena. `[CONFIRMED]`
- No assignments table/route used by this course; no datasets, DWG/RVT starter files, exercise briefs, or hand-in artifacts anywhere in the content files. `[CONFIRMED]`
- The `code` blocks are the only hands-on content; in the Revit band they are non-runnable fragments pitched above a drafting student (full C# Revit-API programs with undefined `doc`/`host` placeholders). `[CONFIRMED]`
- No sandbox/compiler integration for the CADD tools (AutoCAD/3ds Max/SketchUp/Revit cannot be exercised in-browser). `[CONFIRMED]`

Impact: a learner can complete all 20 modules and a certificate without ever producing a drawing. This is the second P0.

---

## 14. Project Audit

**Verdict: the project system is hollow for this course.** `[CONFIRMED]`

- `Project` table: **0 rows globally**; the schema has no `courseId` on `Project`, so no project can be course-scoped even if one were created.
- The submit route (`backend/src/routes/project.ts`) hard-requires `completedCount >= 20` quizPassed modules before submission. CADD Civil has exactly 20 modules, so the gate is reachable — but there are **no project briefs** in the content, and nothing in the CADD files describes a project deliverable.
- No project is part of certificate gating (§20).

Impact: the "Project" feature is a dead-end for CADD Civil; the course's own deliverables (a completed site plan, a rendered building, a Revit model set) exist only as an unwritten expectation.

---

## 15. Industry Relevance Audit

`[CONFIRMED]` — the **tool set** is genuinely industry-relevant: AutoCAD, 3ds Max, SketchUp, and Revit are the current CAD/BIM market leaders, and the W1–W4 drafting discipline (layers, linetypes, plotting conventions) matches real office practice.

`[CONFIRMED]` — relevance is undermined by:
- **No Civil 3D** — the one tool a "civil" drafter actually uses for alignments/corridors/grading/pipes. The course's civil promise is unfulfilled (§22).
- **No software-version attribution anywhere.** No "AutoCAD 202x", no "Revit 202x", no V-Ray version. `[UNKNOWN — NOT VERIFIED]` whether content reflects 2018 or 2026 APIs — the V-Ray 2.x string (D10) suggests a 2012-era snapshot.
- **Wrong-altitude code** — Revit C# API examples are aimed at a programmer/BIM-developer, not the drafting-student persona the course targets.

---

## 16. Obsolete / Deprecated Technology Audit

`[CONFIRMED]` — one confirmed dated reference: `V_Ray_Adv_2_10_03()` (V-Ray 2.x, ~2012, `cadd_civil.ts:373`).

`[INFERRED]` — several Revit API usages in the content correspond to older API generations (e.g. `DisplayUnitType`/`DUT_METERS` is the pre-2022 enum; the post-2021 API uses `UnitTypeId`). Because no version is stated, the whole Revit band's API currency is `[UNKNOWN — NOT VERIFIED]`. Line 757 uses the older `DisplayUnitType` idiom while line 811 (window tag) uses modern `Reference`/`TagMode` idioms — a mixture that cannot all be current for a single Revit release.

---

## 17. Duplication Audit

`[CONFIRMED]` — two near-identical rebar-shape questions exist:
- Topic quiz 13994 "The rebar shape code for a rectangular stirrup is…" (key "07")
- Chapter quiz 14008 "The rebar shape code for a rectangular stirrup/tie is…" (key "07")

Both are presented in the same module (W15), and because chapter quizzes surface all 24 module questions (§11), a student can see both in one sitting. `[CONFIRMED]`

`[INFERRED]` — topic-quiz content is fully duplicated *into* the chapter quiz (16 + 8), so 2/3 of every chapter quiz is a re-presentation of topic questions. This is systematic duplication by design (the 24-question mixed quiz), not an accidental copy.

---

## 18. Consistency Audit

`[CONFIRMED]` discrepancies:
1. **DB title vs content:** "Civil/Architecture" — content is mostly architecture/structural (§22).
2. **Frontend syllabus vs DB structure:** `frontend/src/config/courses.ts` exposes an **8-item consolidated syllabus** while the DB/course detail is 20 weeks. A catalog-visible structure that disagrees with the actual course is a navigation/expectation inconsistency.
3. **Frontend topic-quiz gating:** `CourseDetail.tsx` hides the topic-quiz card for `CADDED_` and bypasses topic-lock for `CADDED_`, yet the backend still serves `/quiz/questions/topic/:topicId` and the reseed comment insists per-topic quizzes are "required by the frontend topic-lock flow". The frontend and the content-pipeline comment disagree about whether topic quizzes are used.
4. **Stale code comment:** `quizService.ts:33` says "CADDED courses have 5 weeks" — CADDED_Civil has **20** modules. The dynamic `module.count` logic is correct; the comment is wrong.
5. **Code-field self-contradiction:** D9 (door placement) is wrong while the identical window placement two topics later (line 801) is correct.
6. **Version-consistency:** mixed old/new Revit API idioms across the Revit band (D2/D10 vs line 757/801).

---

## 19. Feedback Audit

**Verdict: no learning feedback exists.** `[CONFIRMED]`

- `QuizQuestion` has **no `explanation` column** (unlike `PracticeQuestion`, which does — but no CADD practice content exists).
- The quiz results modal reports only per-question correct/incorrect; no rationale, no "why the right answer is right", no link back to the topic.
- No hints, no worked examples with feedback, no review loop for failed quizzes beyond "retake".
- The `note` field in content is the closest thing to feedback, but it is static content, not assessment feedback.

---

## 20. Student Journey Audit

`[CONFIRMED]` — the intended journey (as built):

1. Browse catalog (frontend `courses.ts`) → course detail shows 20 weeks, topic cards hidden for CADDED topic quizzes.
2. Read topic text/code → mark topic complete ("Done & Go to Quiz" for CADDED bypasses the topic quiz).
3. Take the **weekly chapter quiz** (24 questions, 60% to pass) → module progress advances.
4. Repeat × 20 → `CourseProgress.completed = week >= 20`.
5. Pay (VERIFIED) → certificate. `certificateService` requires `weekCompleted >= 20` + verified payment; **no final exam, no project** (`[CONFIRMED]`).

**Journey defects:**
- The **final exam is not on the journey** at all — 18 questions exist in the DB and are never presented, never graded, never gated (§21). `[CONFIRMED]`
- The **topic quiz is not on the journey** for CADDED learners — hidden in the UI and lock-bypassed; its 320 questions instead surface inside the weekly 24-question quiz. `[CONFIRMED]`
- **No practice, no project, no feedback** anywhere on the path. `[CONFIRMED]`
- Certificate can be earned with a bare 60% across 20 quizzes and no demonstration of an integrated skill. `[CONFIRMED]`

---

## 21. Assessment Reachability Audit

| Assessment | Seeded | Reachable in UI? | Gates anything? | Evidence |
|---|---|---|---|---|
| Chapter quiz (160) | ✅ | ✅ `/quiz/:courseId/:week` | ✅ module progress (60%) | `[CONFIRMED]` |
| Topic quiz (320) | ✅ | ⚠️ Hidden for CADDED; reachable only indirectly as 2/3 of chapter quiz | ❌ bypassed | `[CONFIRMED]` CourseDetail lines for `CADDED_`; quizService topic route exists but UI doesn't call it for CADDED |
| **Final exam (18)** | ✅ | ❌ **No route, no UI** | ❌ | `[CONFIRMED]` — grep of all backend routes (assignment, auth, certificate, challenge, contact, course, forum, payment, practice, project, quiz, sandbox) and frontend (App.tsx routes, useQuiz, Quiz.tsx) finds **no final-exam consumer** |
| Practice (0 for CADD) | ❌ | — | — | `[CONFIRMED]` — practice route 400s for any category except Programming/Electronics |
| Project (0) | ❌ | ⚠️ route exists | ❌ | `[CONFIRMED]` — 0 Project rows; not course-scoped |

**Key finding:** the 18-question final exam is **dead content** — it was seeded, matches the source file, but is unreachable by any code path and contributes nothing to completion or certification. This is the strongest single "content integrity" defect in the assessment layer.

---

## 22. Scope / Identity Audit

**Verdict: the course does not deliver what its title promises.** `[CONFIRMED]`

- DB title: "CADDED Software (Civil/Architecture)"; description leads with "AutoCAD Civil".
- Only W1–W4 are civil, and W3–W4 are residential architecture. **Civil 3D — the defining tool of civil drafting — is never taught.** Alignments, profiles, corridors, grading, surfaces, pipe networks: absent.
- 12/20 weeks (W5–W12, W17–W20) are 3D visualization and architectural/structural BIM.
- A learner wanting "civil" skills receives a general CADD + architecture/visualization survey. A learner wanting "architecture" receives only 8/20 weeks of it.

`[RECOMMENDATION]` — the decision the master report flags as P0 remains open: **re-name/re-scope the course honestly, or build the civil track** (Civil 3D workflows). This audit does not choose — it requires a decision before remediation.

---

## 23. Scorecard + Confidence

### Scoring rubric (as specified for deep audits — 0–100, no inflation)

| Criterion | Weight | Score | Justification (see §) |
|---|---|---|---|
| Curriculum Architecture | 10 | 5 | Coherent 20-week scaffold, but identity mismatch (civil title vs BIM content) and tool-hopping with no integrating project |
| Learning Objectives | 10 | 1 | No LOs exist at all (§9) |
| Content Quality | 15 | 8 | Prose is genuinely strong; code/practice layer is weak; absurd distractors embedded |
| Technical Accuracy | 15 | 5 | 11 confirmed API/command defects, mostly in the Revit band; prose largely accurate |
| Practical Learning | 10 | 1 | Zero practice infrastructure (§13) |
| Assessment Quality | 10 | 4 | Valid format, some excellent scenario items; recall-heavy, no explanations, mixed 24-q chapter quiz, un-attributed keys |
| Question Quality | 5 | 1 | Absurd distractors; untaught final-exam items; misleading SECTION key (§12) |
| LO Alignment | 5 | 1 | No LOs to align to (§10) |
| Difficulty Progression | 5 | 2 | Tool bands progress logically; question difficulty is flat recall |
| Industry Relevance | 5 | 2 | Tools are market-leading; no Civil 3D, no version attribution, dated V-Ray reference |
| Project Quality | 5 | 0 | No briefs, no course-scoped projects, 0 records (§14) |
| Feedback / Learning Support | 5 | 1 | No explanations/hints/feedback on any assessment (§19) |
| **Total** | **100** | **31** | **MAJOR REVAMP** |

### Confidence: MEDIUM-HIGH
- **HIGH on content coverage** — all 80 topics and all 498 questions read end-to-end and cross-checked against the live DB; all inventory counts verified; all prior-audit technical claims re-verified at source.
- **MEDIUM on scoring precision** — band placement (Major Revamp vs Weak) is robust, but exact sub-scores are judgment calls; Revit API overload and rebar-standard claims depend on external reference knowledge (`[UNKNOWN — NOT VERIFIED]` where noted).
- **The 31 vs prior 63 gap is a rubric difference, not a contradiction.** The prior 63 used a 6-criterion catalog rubric; this deep-audit rubric adds separate LO, feedback, project, and practice criteria on which CADD Civil scores ~0–1. On the prior rubric this course would still be "Weak".

---

## 24. P0 / P1 / P2 / P3 Issue Register

| ID | Sev | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| R-1 | **P0** | Whole course (`cadd_civil.ts`; DB title) | Course titled/described as Civil, but 12/20 weeks are architecture/structural BIM; Civil 3D never taught | DB title; W5–12/17–20 content; Civil 3D named only at `:64,:108` | Civil learners get a general CADD+architecture survey; catalog credibility damaged | Decision: rename/re-scope honestly OR build a real civil track (Civil 3D alignments/profiles/corridors/grading/pipes) |
| R-2 | **P0** | Whole course | Zero practical learning: no exercises, datasets, starter files, or practice content; practice route rejects CADD categories | `PracticeQuestion` counts; `practice.ts` category whitelist; content files have no exercise fields | Learners can pass all 20 modules + earn a certificate without producing a single drawing | Add per-topic "try it" briefs, datasets, and a course-linked deliverable; extend practice arena with a CADD category |
| R-3 | **P1** | Final exam (18 q, DB 634–651) | Final exam is unreachable — no backend route, no frontend consumer, no gating | grep of all routes + App.tsx + useQuiz/Quiz.tsx | 18 seeded questions are dead content; final assessment has no learning value | Wire a final-exam route + UI, or gate certificate on it; if intentional, remove from seed |
| R-4 | **P1** | `cadd_civil.ts` code field | 11 confirmed technical/API defects (D1–D11) | Lines 71, 587, 625, 713, 845, 889, 669/675, 373, 775, 857, 863 | Learners copy non-working code; API misinformation | Fix per D-table; add a "verified in Revit/AutoCAD x.y" note per code block; or lower the code-field promise to "illustrative" |
| R-5 | **P1** | `CourseDetail.tsx` / `quizService.ts` | Topic quizzes hidden for CADDED + topic-lock bypassed, yet 320 topic questions seeded and 2/3 of each chapter quiz is topic content | CourseDetail `CADDED_` gates; reseed comment claims topic-lock requirement | Topic-level assessment is unreachable as designed; weekly quiz is a confusing 24-item mixed bag | Either expose topic quizzes for CADDED or stop seeding them; make chapter quiz return only chapter questions |
| R-6 | **P1** | `Project` system | No project briefs, no course-scoped projects, 0 Project rows; submit gate hard-requires 20 modules | `project.ts`; `Project` schema (no courseId); content files | Project feature is a dead end for CADD Civil; no integrated deliverable | Add course-scoped project briefs; make the 20-week cap dynamic; consider making project part of certification |
| R-7 | **P2** | Whole course | No learning objectives, no prerequisites | No LO table/column/statement anywhere | Cannot measure outcomes or align assessment | Add per-module/per-topic LOs; publish prerequisites |
| R-8 | **P2** | Quiz items 13683, 13805, 14106, 13669 and ~4 more | Absurd distractors (Auto-correct, Red/green/blue, sound alarm, Nautical miles) | DB ids; source lines | Low discrimination; undermines assessment credibility | Replace absurd distractors with plausible technical errors |
| R-9 | **P2** | Quiz items 13994, 14008; `cadd_civil.ts:674-676` | Rebar shape code "07" presented/tested with no standard cited | DB ids; note at `:676` | Wrong or ambiguous answers for students in non-BS8666 regions | Cite the standard (BS 8666 / ACI / Revit shape families) or remove the numeric key |
| R-10 | **P2** | Final exam 636, 638 | Final exam tests untaught material (MIRROR; 1.0 diffuse multiplier) | DB ids; grep shows MIRROR/diffuse-multiplier never taught | Final exam cannot be a fair capstone | Align final-exam items to taught content or teach the missing concepts |
| R-11 | **P2** | Whole course | No software-version attribution; V-Ray 2.x string present | No version named anywhere; `:373` | Blocks currency verification; dated API surface | State versions per tool; update V-Ray reference or remove |
| R-12 | **P3** | `quizService.ts:33` | Stale comment "CADDED courses have 5 weeks" | Source | Misleads maintainers; CADDED_Civil is 20 weeks | Update/remove comment |
| R-13 | **P3** | `courses.ts` (8-item syllabus) vs DB (20 weeks) | Catalog structure disagrees with actual course | Frontend config vs Module table | Expectation mismatch in catalog UI | Regenerate syllabus from DB or align manually |
| R-14 | **P3** | Topic quiz 13725 | "SECTION" key is misleading for a plan-section workflow | DB id; W4 pedagogy | Confuses learners on a core command | Re-key to `SECTIONPLANE` or the W4-taught workflow |
| R-15 | **P3** | `Course` table | No category/level/cover columns; metadata is frontend-only | Schema | Tooling/DB-driven catalog views break | Add columns or formalize frontend config as source of truth |

**Counts: P0 = 2 · P1 = 4 · P2 = 5 · P3 = 4 (15 total).**

---

## 25. Recommended Improvement Opportunities (non-blocking)

1. **Rename/rescope first (R-1)** — every other content decision depends on the identity decision.
2. **Fix the code field in the Revit band (R-4)** — 9 of the 11 defects are in W13–W20; a single pass by someone with a current Revit API reference closes most of the accuracy gap.
3. **Add a "verified" convention** — every `code` block states the software + version it was verified against; anything not verified is labeled illustrative (this also resolves R-9, R-11).
4. **Close the assessment loop** — either surface topic quizzes and the final exam, or remove them from the seed (R-3, R-5).
5. **Introduce one integrated capstone project** — a survey point set → AutoCAD site plan → SketchUp massing → Revit model/sheet set would tie the five tools together and give the "Project" feature real content (R-6).
6. **Add LOs + per-question explanations** (R-7, and feedback criterion) — the cheapest high-yield pedagogical upgrade.
7. **Distractor hygiene sweep** — replace the ~10 absurd distractors with plausible errors (R-8).

---

## 26. Unknowns / Missing Evidence

- `[UNKNOWN — NOT VERIFIED]` — the rebar shape-code claims (07/28/33) have no named standard; correctness is indeterminate without one.
- `[UNKNOWN — NOT VERIFIED]` — the Revit API generation targeted by the content; D2/D10 use older idioms, 801 uses newer ones — a single authoritative Revit version would resolve which are wrong.
- `[UNKNOWN — NOT VERIFIED]` — which 3ds Max version the MAXScript targets; V-Ray 2.x string suggests age.
- `[UNKNOWN — NOT VERIFIED]` — whether any admin UI exposes the 18 `FinalExamQuestion` rows for manual review (no route found; admin console not audited).
- `[UNKNOWN — NOT VERIFIED]` — actual learner completion/certificate telemetry for this course (QuizResult/CertificateRecord counts not enumerated per course).
- `[INFERRED]` — topic-question → chapter-question duplication is systematic by design; no explicit intent comment confirms it beyond the reseed header.

---

## 27. Final Verdict

**MAJOR REVAMP — 31/100 (MEDIUM-HIGH confidence).**

CADD Civil is a well-written, well-sequenced *general CADD + architecture-visualization* survey wearing a *civil* title. Its prose is among the strongest in the catalog, and its tool selection is industry-relevant. But the course fails its own identity promise (no Civil 3D, only 4 civil weeks), delivers **zero practical or project learning**, ships **11 confirmed code/API defects** in the only hands-on material it has, and runs an assessment layer in which the **18-question final exam is completely unreachable** and topic quizzes are hidden by design. It is the weakest course in the catalog, and it sits squarely in Major-Revamp territory — not because of prose quality, but because of what the course claims to be, what it asks learners to do, and what it actually verifies.

Prior audit: 63/100 "Weak" (different, looser rubric). This independent deep scan places it at 31/100 on the deep-audit rubric — **a substantially larger gap than any other course in the catalog**.

---

## Improvement Candidates — NOT YET APPROVED

The following are candidate improvement actions derived from this audit. **None are approved, none are implemented, and none may be implemented without the user's decision.**

| Candidate | Ties to | Effort | Notes |
|---|---|---|---|
| **Identity decision (rename vs build civil track)** | R-1, P0 | High | Gate for all other civil-content work; requires a product decision first |
| Civil 3D content module(s) or honest re-scope of title/description/syllabus | R-1, R-13 | High | If renamed, update DB title, description, frontend syllabus, tags |
| Revit-band code fix pass (D1–D11) with per-block version attestation | R-4, R-9, R-11 | Medium | 9/11 defects are in W13–W20; single focused pass |
| Assessment reachability fix: wire final-exam route/UI OR de-seed; expose or de-seed topic quizzes | R-3, R-5 | Medium | Also fixes the 24-question mixed chapter quiz |
| Per-topic practice briefs + one integrated capstone project | R-2, R-6 | High | Datasets (point file, DWG, RVT) required |
| LO scaffolding + question explanations + distractor hygiene | R-7, R-8, R-12, R-14 | Medium | Highest pedagogical yield per effort |
| Metadata normalization (DB category/level/cover columns) | R-15 | Low | Enables DB-driven catalog |

— End of audit report. **No product content, seed file, database record, source code, or schema was modified.** The only file written is this report.

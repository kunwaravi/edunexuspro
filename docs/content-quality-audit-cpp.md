# EduNexus Pro — Content Quality Audit · C++ & OOP for Embedded Systems

**Phase:** Content Quality & Curriculum Audit (MASTER PLAN v1.0) · **STEP 4** — representative-course deep audit
**Course:** `cpp` — "C++ & OOP for Embedded Systems"
**Source of truth (live):** `backend/prisma/content/cpp.ts` (20 sections, 80 topics, 160 chapter quizzes, 18 final-exam questions) + `backend/prisma/content/cpp_topic_quizzes.ts` (80×4 = 320 topic-quiz questions)
**Evidence labels:** ✅ CONFIRMED (read directly in source) · 🔶 INFERRED (reasonable reading, not verified) · ⚪ UNKNOWN / NEEDS EXTERNAL VERIFICATION
**Audit-only.** No content, code, schema, or data was modified. All read-only.

Companion docs: `docs/content-source-audit.md` (pipeline/inventory baseline).

---

## A. Overview

The C++ course is the modal exemplar of the catalog: identical to 8 of 9 courses in shape (20 modules, 80 topics, 4 topics/module, 160 chapter quizzes, 320 topic quizzes, 18 final-exam questions) — the lone outlier being `c` (65 topics, ~145-word median lessons). It is positioned as an embedded-systems-oriented C++ sequence ("C++ & OOP for Embedded Systems"), running from "why C++" (W1) to a bare-metal capstone (W20).

## B. Course Structure

| Metric | Value | Evidence |
|---|---|---|
| Modules (weeks) | 20 | `cpp.ts:39-940` |
| Topics | 80 (exactly 4/week) | inventory, all sections |
| Median lesson length | 277 words (min 183 / max 367) | inventory |
| Topics with code | 80 / 80 (100%) | inventory |
| Topics with note | 80 / 80 (100%) | inventory |
| Chapter quizzes | 160 (8/week) | inventory |
| Topic quizzes | 320 (exactly 4/topic) | `cpp_topic_quizzes.ts:20-540` |
| Final exam | 18 questions | `cpp.ts:942-961` |

**Sequence (all 20 weeks, from `cpp.ts`):**
1 Introduction & compilation model → 2 C++ vs C, namespaces, syntax → 3 types, const/constexpr, auto → 4 operators & precedence → 5 iostream & formatting → 6 conditionals & switch → 7 loops → 8 functions → 9 arrays & std::array → 10 strings → 11 classes & access → 12 constructors, destructors, RAII → 13 inheritance & composition → 14 polymorphism & vtables → 15 operator overloading & friend → 16 templates & concepts → 17 STL containers & iterators → 18 algorithms & smart pointers → 19 move semantics & modern C++ → 20 bare-metal project + capstone.

**Structural integrity:** ✅ CONFIRMED the ordering is a legitimate pedagogical climb (types → control flow → functions → classes → RAII → polymorphism → templates → STL → modern idioms → embedded capstone). No orphan topics; every topic is gated by an exactly-4-question topic quiz (`cpp_topic_quizzes.ts` keys match every topic title; inventory reports topicsMissingQuiz = 0 for all 9 courses).

## C. Learning Objectives

- **No explicit per-topic objectives exist.** Topics expose only `{title, text, code, note}` (`cpp.ts:12-17`); sections expose `{week, title, description, topics, quizzes}` (`cpp.ts:25-31`). There is no "By the end of this topic you will be able to…" layer, no Bloom's taxonomy tags, and no learning-objectives table anywhere in the content file.
- The one-line `description` per section (e.g., `cpp.ts:46-47`) functions as an informal intent statement, not a measurable objective.
- **No objectives → assessment mapping exists.** Alignment is implicit: quizzes test what lessons teach (verified, see §J), but nothing declares which objective a given question measures, and nothing maps objectives to the capstone.
- **Severity:** P1 structural gap. This is not a per-course defect — it is a catalog-wide authoring convention — but it directly caps the F criterion (10%) for every course.

## D. Lesson Quality

**Strengths (all ✅ CONFIRMED by full read of 80 topics):**
- Prose is consistently clear, confident, and well-organized (bold-led claims, then mechanism, then "why it matters"). Example: the four-stage compilation model is taught once with a one-line mnemonic per stage (`cpp.ts:56-59`) and reinforced by 2 quizzes + 4 topic quizzes.
- Every topic has a compileable-looking code snippet and a 1-line `note` that distills the lesson (`code`/`note` fields present on 80/80 topics).
- Pitfalls are taught explicitly and honestly (signed/unsigned trap `cpp.ts:141`, dangling-else `cpp.ts:276`, iterator invalidation `cpp.ts:783`, missing volatile `cpp.ts:912`). This is real instructional craft.
- Worked examples match the prose: e.g., the brace-init narrowing claim is immediately demonstrated (`cpp.ts:108`).
- Appropriate scope per RULE 7: median 277 words is dense but not padded; no lesson is a wall of text, none is a stub (min 183 words).

**Weaknesses:**
- 🔶 The embedded narrative is unevenly enforced in week 20 (see §E finding W20-1): a host-style snippet using `std::cout` appears inside the bare-metal week.
- 🔶 A few topics front-load a large concept list (e.g., W19 "Modern C++ Features to Use Daily" catalogs C++11→20 features in one topic, `cpp.ts:878-881`) — good as a reference, heavy as a lesson.

## E. Technical Accuracy

Verified against current C++17/20 semantics across the full read. Representative ✅ CONFIRMED-correct items:
- Forwarding references: `T&&` deduced → `T&` for lvalues / `T&&` for rvalues; `std::forward` casts to rvalue only when deduced as such (`cpp.ts:872-875`; quiz `cpp_topic_quizzes.ts:503,505`).
- `if constexpr` discards the un-taken branch at compile time (`cpp.ts:738-740`; quiz :427).
- `std::from_chars` is exception-free and locale-independent (`cpp.ts:468`).
- Guaranteed copy elision (C++17) for returning locals (`cpp.ts:474`; quiz :487).
- `.at()` throws `std::out_of_range` on a missing map key (`cpp.ts:777`; quiz :448).
- `-1 < 0u` is false (signed→unsigned conversion) (`cpp.ts:141`; quiz :169).
- Integer division truncates toward zero; `-7 % 2 == -1` (`cpp.ts:147`; quiz :82).
- Brace-init refuses narrowing (`cpp.ts:108`; quiz :61).
- `strncpy` can silently omit the null terminator (`cpp.ts:456`; quiz :259).
- Vector reallocation invalidates all iterators (`cpp.ts:783`; quiz :454).
- `std::unordered_map` requires `std::hash<K>`; `std::map` requires `operator<` (`cpp.ts:777`; quiz :445-446).
- A virtual call from a constructor dispatches to the base version (`cpp.ts:636`; quiz :363).
- A throw from a destructor during unwinding calls `std::terminate` (`cpp.ts:552`; quiz :317).
- Members initialise in declaration order (`cpp.ts:546`; quiz :310).
- `volatile` is not a concurrency lock (`cpp.ts:912`; quiz :526).

**Issues found (3):**

**E-1 · W20 bare-metal/host context mixing — P2, ✅ CONFIRMED**
`cpp.ts:919` (Placing Objects at Fixed Addresses) shows:
```cpp
alignas(alignof(int)) unsigned char mem[sizeof(int) * 4];
int* a = new (mem + 0) int(10);
std::cout << *a << " " << *b << "\n";   // hosted std::cout in the bare-metal week
```
This is the same week whose doctrine is `-fno-exceptions -fno-rtti`, "no heap", "no OS calls" (`cpp.ts:906-908`), and the topic's own note says "Placement new constructs at a fixed address without allocating" (`cpp.ts:920`). On a real freestanding MCU toolchain with `-fno-exceptions`, `std::cout` typically does not exist. The snippet is a host-style demonstration presented under a bare-metal topic — internally inconsistent and un-compileable on the toolchain the course teaches.

**E-2 · Garbled quiz stem — P2, ✅ CONFIRMED**
`cpp_topic_quizzes.ts:93`:
```
'`auto v[0]` in `std::vector<int> v; auto x = v[0];` produces…'
```
The leading `` `auto v[0]` in `` is leftover/garbled text. The rest of the question (auto copies) is fine, but the stem as shipped is broken.

**E-3 · Register addresses without datasheet attribution — P2 (pedagogical), 🔶/⚪**
`cpp.ts:906-907` uses `0x40020C14` for an LED; `cpp.ts:912-913` uses `0x40011004`/`0x40011000` for UART. These match plausible STM32F4 addresses (GPIOB ODR, USART1 DR/SR), but the course never identifies the MCU, reference manual, or datasheet, and no pin/bit is mapped. A bare-metal course teaching magic addresses with no attribution prevents students from verifying or generalising. 🔶 INFERRED plausible / ⚪ UNKNOWN exact target — requires external verification against an ST datasheet to call correct or not. Not flagged as "wrong" (RULE 4/5).

## F. Practical Learning

- ✅ Code-first pedagogy: 80/80 topics carry code; examples are overwhelmingly runnable and embedded-flavoured (register bit ops `cpp.ts:192-194`, `volatile` polling `cpp.ts:913`, RAII lock guard `cpp.ts:553`).
- ✅ W20 capstone is a genuine, well-scoped project (system clock: RTC + buttons + LCD) with a 7-point certification rubric (`cpp.ts:923-926`).
- ❌ **No in-content graded practice exists.** Practice = quizzes only (pass/fail, 60% threshold per `quizService.ts:67`). There is no exercise-with-solution layer, no coding checkpoints, no feedback beyond the correct answer, and no autograding hook in the content.
- ❌ The capstone is *described*, not *assessed*: the certification rubric is prose (`cpp.ts:924`) with no deliverable, submission, or evaluation wired to it in the content. (Platform-level Assignment/Project submission entities exist in the DB — this audit covers the course content; the platform wiring is STEP 8.)
- RULE 9 note: D is docked for what is MISSING (graded exercises), not for what is present — the present content is strong.

## G. Assignments

**None defined in the content.** `cpp.ts` contains only sections/topics/quizzes/final-exam; there is no assignment array, prompt, or rubric. ✅ CONFIRMED. (Catalog-wide expectation to verify for the other 8 courses in STEP 6.)

## H. Projects

One project artifact in-content: the W20 capstone "system clock" (`cpp.ts:923-925`), with requirements (no heap, 8 KB RAM / 64 KB flash), a module split (clock/button/lcd), and a written review checklist. It is a strong *design document* but not a graded deliverable (see §F). ✅ CONFIRMED.

## I. Quiz Quality

**Volume & format:** 480 questions total (160 chapter + 320 topic) + 18 final-exam. Every question is 4-option, exactly 1 correct (`cpp_topic_quizzes.ts:14-18`; `cpp.ts:19-23`). Every topic has exactly 4 topic questions (inventory: min=max=avg=4 across all 9 courses).

**Uniqueness (script-checked, read-only):**
- Chapter-vs-topic quiz text overlap: **0** across all 9 courses ✅ — the warning in `cpp_topic_quizzes.ts:9-11` is honoured.
- Within-course duplicate question texts: **0** (all courses).
- Cross-course duplicate question texts: **0** (all 9 courses) — original writing, no shared question bank.
- Cross-course duplicate topic *titles*: **1** ("Comparison & Logical Operators", python+webdesign) — verified distinct content (Python vs JS operators). ✅ Not duplication.

**Distractor quality:** ✅ Predominantly plausible, non-overlapping, unambiguous corrects. Spot-checked: the "UB" family (precedence, `arr[i++] + arr[i++]`), the stream-manipulator family, and the ownership family (unique/shared/weak) all have clean single corrects and credible distractors. The garbled stem E-2 is the one hygiene defect found.

**Cognitive level:** Solid recall + comprehension, moderate application (predict-output, pick-the-operator, debug-the-snippet), minimal analysis/evaluation (almost no bug-hunting-from-a-snippet, no design/justify questions). E.g., W4's "Which expression is undefined behaviour?" (`cpp.ts:214`) is genuinely application-level; the majority are definitional. Final exam is 18 recall/application one-liners.

**Runtime finding:** `getTopicQuizQuestions` shuffles and `slice(0,5)` ("dynamic/randomized question bank", `quizService.ts:336-337`) — but every topic has exactly 4 questions, so the randomization is a **no-op**: the same 4 questions are served every time. ✅ CONFIRMED. The feature exists in code but cannot function against the current bank size.

**Dead content:** the 18-question final exam is never served at runtime (no route serves course-level final exams) — established in `docs/content-source-audit.md`. As an artifact it exists; as a summative assessment it is inert. P1 for the assessment story.

## J. Assessment Alignment

- **Quizzes ↔ lessons:** ✅ Strong. Verified across all 20 weeks — quiz questions test content explicitly taught in the same week (e.g., W1 quiz tests the 4 pipeline stages taught in `cpp.ts:57`; W7 quiz tests the `continue`-in-`while` infinite-loop trap taught in `cpp.ts:339`; W17 quiz tests iterator invalidation taught in `cpp.ts:783`). No question expects un-taught material (RULE 16 satisfied for C++).
- Minor: W2's chapter quiz asks "The RAII pattern means…" (`cpp.ts:127`) while RAII's full treatment is W12 — but RAII is explicitly introduced in W2 (`cpp.ts:96`), so this is an acceptable advance-organizer, not a misalignment.
- **Final exam ↔ course:** Partial. The 18 exam items sample most weeks but under-represent advanced content (templates, move semantics, containers, operator overloading, lambdas) and contain no integrative/scenario item. As a "final exam" for a 20-week course it is too thin (18 MCQs).

## K. Industry Relevance

✅ CONFIRMED the course teaches current C++17/20 practice: `std::string_view`, `std::from_chars`, `if constexpr`, concepts, `std::span`, `operator<=>`, ranges, `make_unique/shared`, modern idioms. The embedded framing (memory-mapped registers, `volatile`, placement new, `-fno-exceptions`) matches the platform's embedded audience. CMake + clangd workflow (`cpp.ts:69`) is current. 🔶 Minor: "you want GCC 9+" (`cpp.ts:69`) is a 2019-era minimum — dated-but-safe in 2026, not wrong. ⚪ Register addresses lack datasheet grounding (§E-3).

## L. Beginner Experience

✅ Layered, empathetic teaching: W1 starts from "why", each week names the common bug, and the "first error, not last" toolchain advice (`cpp.ts:69`) is exactly right for novices. Brace-init `{}` and `-Wshadow`/`-Wall` habits are instilled early. 🔶 The volume is demanding (4 topics/week ≈ 1,100 words + 12 quiz questions/week) — a committed learner's course, not a casual one; no adaptive difficulty or remediation path exists in content (a platform concern, not content).

## M. Missing Content (RULE 9 — CONTENT MISSING, with severity)

| Gap | Severity | Note |
|---|---|---|
| Preprocessor & header guards (include guards, `#pragma once`, macro hygiene) — only incidental mentions | P2 | Essential for any real C++ codebase; header-only template rule is taught but guards are not |
| Testing & debugging (unit tests, asserts, gdb, sanitizers) — only a W20 checklist line | P2 | Practical competence story is thin without it |
| Concurrency (std::thread, atomics, mutex) — absent | P2 | Defensible for bare-metal focus, but the title is "C++ & OOP", not "Embedded C++" |
| Exceptions as a feature (try/catch, exception safety guarantees) — taught only as "avoid on MCU" | P2/P3 | A general C++ gap; the embedded framing justifies omission |
| Interrupts / ISR-safe C++ — absent | P3 | Capstone (RTC/buttons) implies them |
| Linker script / memory-map depth — one shallow mention in W20 | P3 | WEAK-PRESENT, not missing |
| Debugging of embedded (openocd/st-flash flows) | P3 | WEAK-PRESENT |

## N. Redundant Content

✅ Within-course redundancy is minimal. W19 "Modern C++ Features to Use Daily" (`cpp.ts:878-881`) and W20 "Final Project & Certification Review" (`cpp.ts:923-927`) restate earlier topics — but as deliberate spaced-repetition/review, which RULE 7-style guidance does not penalise. Cross-course duplication of *questions* is zero (script-checked); the single shared title is not duplicated content (§I). Cross-course *topic* duplication cannot be ruled out without reading the other 8 courses — assigned to STEP 6.

## O. Outdated Content

✅ No factually outdated C++ content found. 🔶 Only "dated recommendation": `g++ --version` "you want GCC 9+" (`cpp.ts:69`). Nothing obsolete; no removed-standard features taught as current.

## P. Critical Findings (ranked for this course)

1. **P1 — No learning-objective layer and no objectives→assessment map** (caps criterion F for every course). §C.
2. **P1 — Assessment story is incomplete:** final exam is 18 recall MCQs and is *dead content* (never served); no summative assessment actually runs. §I, §J.
3. **P1 — No in-content graded practical work;** the strong capstone is described, not assessed; practice is quiz-only with no feedback loop. §F, §H.
4. **P2 — W20 bare-metal/host context mixing** (`std::cout` in the placement-new snippet). §E-1.
5. **P2 — Garbled topic-quiz stem** (`cpp_topic_quizzes.ts:93`). §E-2.
6. **P2 — Register addresses without datasheet attribution.** §E-3.
7. **P2 — Topic-quiz "randomization" is a runtime no-op** (4-question banks vs `slice(0,5)`). §I.
8. **P2/P3 — Content gaps:** preprocessor/guards, testing/debugging, concurrency. §M.

## Q. Rubric Score

| Criterion (weight) | Score /5 | Weighted | Key evidence |
|---|---|---|---|
| A. Curriculum Architecture (15%) | 4.0 | 0.600 | Coherent 20-week climb; minor gaps (§M) |
| B. Technical Accuracy (15%) | 4.0 | 0.600 | Verified sound; 3 issues (E-1..E-3) |
| C. Lesson Quality (15%) | 4.5 | 0.675 | Excellent prose/examples; two density notes |
| D. Practical Learning (20%) | 3.5 | 0.700 | Code-first + capstone, but no graded practice |
| E. Assessment Quality (15%) | 3.5 | 0.525 | High volume, clean uniqueness, low cognitive ceiling, dead final |
| F. LO Alignment (10%) | 3.0 | 0.300 | Implicit alignment only; no objective layer |
| G. Industry Relevance (5%) | 4.0 | 0.200 | Current C++17/20, embedded-real |
| **Total** | **3.60/5** | **3.600 → 72/100** | **Band: Needs Improvement (70-79)** |

Scores are evidence-labelled per §A-§O; fractional precision reflects verified granularity, not false certainty (RULE 4/5).

## R. Recommended Future Actions (feed into STEP 14 Waves)

1. Add an explicit per-topic learning-objective field + map each quiz question and the capstone to objectives (raises F, ~+0.5-1.0). *Wave: authoring-standard change, all 9 courses.*
2. Raise assessment cognitive level: add code-reading/analysis questions to chapter quizzes; convert the final exam into a served, scenario-based summative (raises E, ~+0.5). *Wave: assessment layer.*
3. Add graded practical exercises per week (small programming tasks + rubric) and wire the capstone into the existing Assignment/Project submission subsystem (raises D, ~+0.5). *Wave: practical layer.*
4. Fix the two concrete defects (E-1 snippet, E-2 stem) and add datasheet attribution for register addresses (B, G).
5. Add content gaps with highest leverage first: header guards + a testing/debugging topic (M).

Estimated ceiling after 1-4: ~3.9-4.1/5 ≈ 78-82/100 → **Strong** band.

# EduNexus Pro — Content Quality Audit · C & Systems Programming

**Phase:** Content Quality & Curriculum Audit (MASTER PLAN v1.0) · **STEP 4** — representative-course deep audit
**Course:** `c` — "C & Systems Programming — Deep GfG-Style Curriculum (issue #92)"
**Source of truth (live):** `backend/prisma/content/c.ts` (20 sections, 65 topics, 158 chapter quizzes, 15 final-exam questions) + `backend/prisma/content/c_topic_quizzes.ts` (65×4 = 260 topic-quiz questions)
**Evidence labels:** ✅ CONFIRMED (read directly in source, with file:line) · 🔶 INFERRED (reasonable reading, not verified) · ⚪ UNKNOWN / NEEDS EXTERNAL VERIFICATION
**Audit-only.** No content, code, schema, or data was modified. The only file written is this audit doc.

Companion docs: `docs/content-quality-audit-cpp.md` (sibling deep audit) · `docs/content-source-audit.md` (pipeline/inventory baseline).

---

## A. Overview

The C course is the catalog's **outlier**: unlike the modal shape (20 modules × 4 topics = 80 topics), it carries **20 modules but only 65 topics** (avg 3.3/week, range 2–4) with the **shallowest lessons in the catalog** (median 145 words/topic, range 96–193; sibling C++ course median is 277). It is positioned as a systems/embedded-oriented C sequence ("Deep GfG-Style Curriculum") running from "Why C" (W1) to a capstone + certification-prep week (W20).

**Coverage disclosure (honest):** because the course is small, I read **100% of both source files** — all 20 weeks' prose/code/notes and all 158 chapter quizzes in `c.ts` (2,182 lines), all 65 topic-quiz keys and 260 questions in `c_topic_quizzes.ts` (447 lines), and all 15 final-exam questions. Coverage: **titles 65/65, full prose 65/65 topics, chapter quizzes 158/158, topic quizzes 260/260, final exam 15/15.** The protocol minimum (4 full weeks + 3 extra topics) was exceeded; no conclusions below are based on unread content. Every topic title in `c.ts` has an exactly-4-question key in `cTopicQuizzes` (no missing/extra keys — no topic-lock risk, which would be a P0).

**Overall verdict:** accurate, current, and well-written prose with working code on every topic and a strong systems/embedded frame — but the thinnest lessons in the catalog (RULE 7 scope judgment), sparse weeks, no graded practical layer, and two confirmed assessment errors (one in the final exam). Weighted score **67.25/100 → Weak band** (§Q).

---

## B. Course Structure

| Metric | Value | Evidence |
|---|---|---|
| Modules (weeks) | 20 | `c.ts:33-2048` |
| Topics | 65 (avg 3.3/week; range 2–4) | all sections |
| Median lesson length | 145 words (min 96 / max 193) | inventory (given) |
| Topics with code | 65 / 65 (100%) | all sections |
| Topics with note | 65 / 65 (100%) | all sections |
| Chapter quizzes | 158 (7–8/week; W1 and W5 have 7, all others 8) | `c.ts` per-section |
| Topic quizzes | 260 (exactly 4/topic) | `c_topic_quizzes.ts:17-447` |
| Final exam | 15 questions | `c.ts:2060-2181` |

**Sequence (one line per week, all 20 weeks from `c.ts`):**
1. Introduction to C & Environment Setup — Why C Still Matters in 2026 · The Compilation Pipeline: Source to Binary · Setting Up: Compiler, Editor, and Terminal · Anatomy of a C Program
2. C Basics: Tokens, Keywords, Identifiers, Comments — Tokens: The Smallest Meaningful Units · Keywords: The Reserved Words · Identifiers: Naming Your Variables and Functions · Comments: Documenting Code for Humans
3. Variables, Data Types & Operators — Primitive Data Types and Their Sizes · Declaring and Initialising Variables · Arithmetic, Relational & Logical Operators · Bitwise Operators and Operator Precedence
4. Input/Output & Format Specifiers — printf: Formatted Output · scanf: Reading Formatted Input · Character & String Input: getchar, gets vs fgets
5. Decision Making: if-else, switch — if, else and the else-if Ladder · The Ternary Operator (?:) · switch-case: Multi-way Branching
6. Loops: for, while, do-while — The while Loop · The do-while Loop: Always Runs Once · The for Loop: Init, Condition, Update · break, continue, and Nested Loops
7. Functions — Why Functions? Reusable, Testable Code · Parameters, Arguments & Pass-by-Value · Return Values and void · The Call Stack: How Calls Really Work
8. Scope, Storage Classes & Recursion — Local vs Global Scope · Storage Classes: auto, register, static, extern · Recursion: Functions Calling Themselves
9. Arrays (1D, 2D, Multi-dimensional) — One-Dimensional Arrays · Two-Dimensional Arrays (Matrices) · Passing Arrays to Functions & Array Bounds
10. Strings & String Library Functions — What a C String Really Is · String Library Functions: strcpy, strcat, strcmp, strlen · Reading Strings Safely: fgets, and Common Bugs
11. Pointers & Pointer Arithmetic — Addresses and the Address-of Operator & · Dereferencing: *ptr and the Null Pointer · Pointer Arithmetic: ptr + 1 Skips sizeof(type) · Pointers as Function Arguments: The Swap Pattern
12. Pointers & Arrays / Strings — Array Names Are Pointers to the First Element · Pointer to Array vs Array of Pointers · Pointer Strings vs Character Arrays
13. Dynamic Memory Allocation (malloc, calloc, realloc, free) — The Heap vs the Stack · malloc, calloc, realloc — and sizeof · Memory Leaks and Dangling Pointers
14. Structures & Unions — Structures: Grouping Related Data · Member Access: dot (.) vs arrow (->) · typedef and Unions
15. File Handling — Opening and Closing Files: fopen and fclose · Writing and Reading Formatted Data · Binary Files: fread and fwrite
16. Preprocessor & Macros — The Preprocessor: #include and #define · Function-Like Macros and Their Dangers · Header Guards and Conditional Compilation
17. Linked Lists — Why Linked Lists Exist · Inserting at the Head: The O(1) Win · Traversal, Search, and Deletion
18. Stacks & Queues — The Stack: LIFO · The Queue: FIFO
19. Sorting & Searching Algorithms — Linear Search and Binary Search · The Simple Sorts: Bubble, Selection, Insertion · Merge Sort and Quick Sort: O(n log n)
20. Capstone Project + Certification Prep — Designing a Complete C Project · Debugging and Testing Like a Professional · Final Revision Checklist for the Exam

**Sparse weeks (outlier status):** only 6 weeks carry the full 4 topics (W1, W2, W3, W6, W7, W11); 13 weeks carry 3; **W18 (Stacks & Queues) carries only 2 topics** — the thinnest week in the catalog. 🔶 The header comment claims "Each section carries 4–5 deep sub-topics" (`c.ts:4`) — actual range is 2–4, so the stated design intent is not met. The sequence itself is a legitimate pedagogical climb (tokens → types → I/O → control flow → functions → arrays → pointers → heap → structs → files → preprocessor → DS → algorithms → capstone) with no orphan topics; the sparse weeks are a density weakness, not a coherence weakness.

---

## C. Learning Objectives

- **No explicit per-topic objectives exist.** Topics expose only `{title, text, code, note}` (`c.ts:12-17`); sections expose `{week, title, description, topics, quizzes}` (`c.ts:25-31`). There is no "By the end of this topic you will be able to…" layer, no Bloom's taxonomy tags, no objectives table. ✅ CONFIRMED.
- The one-line `description` per section (e.g., `c.ts:40-41`) functions as an informal intent statement, not a measurable objective. W20's "Final Revision Checklist" (`c.ts:1968-1970`) is the closest the course comes to stating intended outcomes — it lists 13 competencies, but as a revision list, not as objectives.
- **No objectives → assessment mapping exists.** Alignment is implicit (quizzes test what lessons teach — verified, §J), but nothing declares which objective a question measures, and nothing maps objectives to the capstone.
- **Severity: P1 structural gap** (catalog-wide authoring convention, same as the C++ course — caps the F criterion for every course).

---

## D. Lesson Quality

**Strengths (all ✅ CONFIRMED by full read of 65 topics):**
- Prose is precise, confident, and well-organized: bold-led claim → mechanism → "why it matters" → explicit pitfall. E.g., the four-stage pipeline is taught once with a per-stage mnemonic (`c.ts:53`) and reinforced by 2 chapter + 4 topic quizzes; pass-by-value is nailed with a "modifies the COPY" worked example (`c.ts:651`).
- Every topic carries a compileable-looking code snippet and a one-line `note` distilling the lesson. Spot-checked code is correct (e.g., pointer-arithmetic walk `c.ts:1060`, swap `c.ts:1067`, circular queue `c.ts:1795`).
- Pitfalls are taught explicitly and honestly: `if (x = 5)` trap (`c.ts:443`), dangling else (`c.ts:443`), `gets()` removed in C11 (`c.ts:351`), `strcpy` overflow (`c.ts:958`), string-literal mutation UB (`c.ts:965`), `realloc` temp-pointer gotcha (`c.ts:1270`), array bounds (`c.ts:851`). Real instructional craft.

**Weaknesses (RULE 7 — scope judgment, not a length penalty):**
- **Median 145 words/topic is TOO THIN to actually teach several of the stated topics.** The content is accurate but compressed; complex topics read as summaries, not lessons. Flagged as under-developed for the title:
  - **"Recursion: Functions Calling Themselves"** (`c.ts:763-767`, ~130 words): factorial only; no trace, no Fibonacci, no recursion-vs-iteration cost walkthrough beyond "stack frames and call overhead". A major exam area taught at gloss level.
  - **"The Call Stack: How Calls Really Work"** (`c.ts:663-667`, ~150 words): no frame diagram (unavailable in text), no illustration of the "returning `&local` is a bug" consequence beyond one line — the most abstract concept in W7 gets the least scaffolding.
  - **"Merge Sort and Quick Sort: O(n log n)"** (`c.ts:1883-1887`, ~150 words for TWO sorts): quicksort shows only the Lomuto partition, not the recursion; no merge code, no worked trace; the code block only has partition (`c.ts:1886`), so neither sort is actually shown complete.
  - **"The Heap vs the Stack"** and **"Memory Leaks and Dangling Pointers"** (`c.ts:1261-1279`): adequate overviews but thin on failure modes for a topic that is the #1 professional-C pain point.
  - **"Binary Files: fread and fwrite"** (`c.ts:1480-1484`, ~120 words): portability/padding/endianness is a single sentence.
- **No exercises-with-solutions inside lessons.** Practice = quizzes only (see §F/§G).
- 🔶 The "Deep" branding (`c.ts:2`) overstates: the course is a broad, accurate survey, not a deep treatment. The depth lives in the pitfall-mention style, not in multi-step worked problems.

---

## E. Technical Accuracy

Verified against current C11/C17/C23 semantics, UB rules, pointer semantics, and the standard library, across the full read. Representative ✅ CONFIRMED-correct items:

- C17 with C23 ratified recently is cited as current (`c.ts:46`) — accurate as of 2026.
- `int main(void)` textbook-safe; `void main()` non-standard (`c.ts:69`). Correct.
- Compilation pipeline (preprocess → compile → assemble → link) and `undefined reference` = linker error (`c.ts:53`). Correct.
- C90 has 32 keywords; C99 adds `_Bool`, `_Complex`, `_Imaginary`, `inline`, `restrict` (`c.ts:155`). Correct.
- Identifier rules incl. "first 63 chars significant" and `_`-at-file-scope reserved (`c.ts:162`). Correct per C99+.
- Reading an uninitialised local is UB; globals/`static` are zero-initialised (`c.ts:257`). Correct.
- `sizeof` is an operator, not a function (`c.ts:252`). Correct.
- `gets()` was removed from C11 (`c.ts:351`). Correct — no pre-C99 relic taught as current.
- `a[i]` ≡ `*(a+i)`, `i[a]` legal; array name not a modifiable lvalue (`c.ts:1158`). Correct.
- Passing arrays decays to pointer; `sizeof(arr)` inside a function returns pointer size (`c.ts:865`). Correct.
- `malloc` uninitialised / `calloc` zeroed / `realloc` failure leaves original untouched / `free` then NULL (`c.ts:1270-1278`). Correct.
- Union size = largest member; `sp->m` ≡ `(*sp).m` (`c.ts:1372`, `c.ts:1377`). Correct.
- `mid = lo + (hi - lo)/2` avoids overflow of `(lo + hi)/2` (`c.ts:1871`). Correct.
- Macro `SQUARE(3+2)` → 11 without parens; `SQ(x++)` double-evaluates (`c.ts:1580`). Correct.
- Bubble/insertion stable, selection typically unstable; insertion O(n) best on nearly-sorted (`c.ts:1878`). Correct.
- `register` is a hint the compiler may ignore; cannot take its address (`c.ts:758`). Correct.

**Issues found (5):**

**E-1 · Final exam Q8 teaches an incorrect fact — P1, ✅ CONFIRMED (and verified by compiling)**
`c.ts:2122-2129`:
```
'struct A { int x; }; union B { int y; char z; };' — which is typically larger?
options: 'struct A', 'union B', 'They are always equal', 'Impossible to say'
correctAnswer: 'struct A'
```
Per the course's own rule "union = size of largest member" (`c.ts:1377`, reinforced by topic quiz `c_topic_quizzes.ts:330`) and struct sizing, `struct A` is `sizeof(int)` and `union B` is `max(sizeof(int), sizeof(char)) = sizeof(int)` — they are **equal**, not "struct A larger". I compiled a probe: both are 4 bytes. The correct option offered is **"They are always equal"**, and the exam marks the wrong one. This directly contradicts the course's own teaching (RULE 16 — assessed against what was taught).

**E-2 · Topic-quiz "toggle" answer contradicts the course's own register idiom — P1, ✅ CONFIRMED**
`c_topic_quizzes.ts:92`: "Which operator toggles (flips) the bits it is applied to?" → correctAnswer `~`.
But the course note teaches "`|` to set, `&~` to clear, **`^` to toggle**" as "THE embedded skill" (`c.ts:273`). `~` flips all bits; `^` toggles mask-selected bits. The question is genuinely ambiguous and internally inconsistent with the course's own terminology — a student who learned the note's "`^` to toggle" mnemonic is marked wrong. Because topic quizzes are the lock-gate (per `c_topic_quizzes.ts:2-8`), this ambiguity is high-impact.

**E-3 · `%lf` vs `%f` for `printf` — P2 (misleading simplification), ✅ CONFIRMED against C99 7.19.6.1**
`c.ts:337-339` teaches "`%f` — float (promoted to double)" and "`%lf` — double", and chapter quiz Q1 answers `%lf` for "correctly prints a double" (`c.ts:358-361`; topic quiz `c_topic_quizzes.ts:98`). In `printf`, variadic promotion means `%f` **already** expects a `double`, and `%lf` is also valid and identical to `%f`. The `%f`/`%lf` distinction the course teaches is the *scanf* distinction, applied to printf. This is a very common textbook simplification, but as written it implies `%f` cannot print a double, which is wrong.

**E-4 · Final exam `malloc(0)` answer overstates — P2, ✅ CONFIRMED against C11 7.22.3.4**
`c.ts:2112-2119`: "What does `malloc(0)` with no failure check most dangerously hide?" correctAnswer: "It returns a valid pointer to zero bytes — a NULL check may not catch logic issues." The standard makes the behavior **implementation-defined** (may return NULL *or* a unique non-null pointer). The answer states the glibc behavior as a universal fact. Borderline, but as a final-exam "correct" answer it is over-assertive.

**E-5 · Two minor imprecisions — P3**
- `c.ts:46`: "Python, Java, Node.js and even **Rust's precursor** are implemented in C." Rust is self-hosted; its original bootstrap compiler was in OCaml. "Rust's precursor" is unclear/imprecise. 🔶 INFERRED — no external verification attempted.
- `c.ts:456` (switch topic): "No `continue`/variable declarations directly in a case without braces in older standards." In C, `continue` is a loop construct (irrelevant inside switch except via an enclosing loop), and variable declarations *are* permitted directly under a `case` label. The sentence is a muddled simplification. 🔶 INFERRED.

**Currency observation (P3):** W2's keyword taxonomy ("32 classic + 5 conditional") is the C90/99 model; C23 (cited as current in W1) promotes `bool`, `true`, `false`, `nullptr`, `alignas`, `alignof`, `static_assert`, `thread_local`, `typeof` to keywords. Not "wrong" for a fundamentals course, but slightly dated given the course's own C23 claim.

---

## F. Practical Learning

- ✅ **Code-first pedagogy:** 65/65 topics carry code; examples are overwhelmingly runnable and embedded-flavoured (register bit ops `c.ts:271-273`, `fgets` newline-strip `c.ts:352`, circular queue `c.ts:1795`, ASan build `c.ts:1964`).
- ✅ **Safety discipline taught as a skill:** buffer bounds (`c.ts:851`, `c.ts:965`), `malloc` NULL-check + `free`/NULL (`c.ts:1277`), `realloc` temp-pointer (`c.ts:1270`), "read the FIRST error line" (`c.ts:60`), `-Wall -Wextra` and sanitizers (`c.ts:1963-1964`).
- ❌ **No in-content graded practice exists.** Practice = quizzes only. There is no exercise-with-solution layer, no coding checkpoints, no autograding hook. RULE 9: this is CONTENT MISSING, not present-but-weak.
- ❌ **The capstone is described, not assessed:** W20 gives a design methodology, four project ideas, and a skeleton (student-record manager header stub `c.ts:1957`) but **no deliverable spec and no rubric** (unlike the C++ course, which has a 7-point rubric).
- RULE 9 note: D is docked for what is MISSING (graded exercises, assessed project), not for what is present — the present practical content is strong.

---

## G. Assignments

**None defined in the content.** `c.ts` contains only sections/topics/quizzes/final-exam; there is no assignment array, prompt, solution, or rubric. ✅ CONFIRMED. W20's "Classic capstone ideas" (`c.ts:1956`) are suggestions, not assignments.

---

## H. Projects

One project artifact in-content: the W20 capstone guidance (`c.ts:1954-1958`) — a 6-stage design method (requirement → design → layout → implementation → testing → documentation), four project ideas (student marks, library/inventory, expression evaluator, grade report), and a `Student`-record skeleton with a menu-loop comment. It is a strong *design how-to* but **not a defined project deliverable** — no acceptance criteria, no module breakdown to build, no rubric, no submission flow. ✅ CONFIRMED. Weaker than the C++ course's capstone (which has requirements, module split, and a rubric).

---

## I. Quiz Quality

**Volume & format:** 433 questions total (158 chapter + 260 topic) + 15 final-exam. Every question is 4-option, exactly 1 correct (`c.ts:19-23`; `c_topic_quizzes.ts:11-15`). Every topic has exactly 4 topic questions; all 65 keys match topic titles (no lock risk).

**Uniqueness (script-checked per the master-plan baseline):**
- Cross-course duplicate question texts: **0** (given) — original writing, no shared bank.
- Within-course duplicate question texts: **0** (given) — but near-duplicate *concepts* recur (see §N).

**Distractor quality:** ✅ Predominantly plausible and non-overlapping (e.g., the swap-function family `c.ts:1100-1106`, the pointer-arithmetic `p+1` family `c.ts:1094-1097`, the macro-expansion family `c_topic_quizzes.ts:362-365`). Two genuine defects found:
- The **E-2 toggle ambiguity** (`c_topic_quizzes.ts:92`) — ambiguous correct, contradictory to course note.
- The **E-1 final-exam struct/union wrong answer** (`c.ts:2128`).

**Cognitive level:** Solid recall + comprehension, moderate application (predict-output traces are frequent and well-chosen — e.g., `for (i=0;i<5;i++) if(i==2) continue` → `0134` at `c_topic_quizzes.ts:159`; nested-break trace `c.ts:559`), minimal analysis/evaluation (almost no bug-hunting-from-a-snippet, no design/justify items). The course's own W20 advice — "trace questions are guaranteed" (`c.ts:1970`) — is honored; the *final exam* does not carry as much trace weight as the course suggests it should.

**Dead content:** the 15-question final exam is never served at runtime (no route serves course-level final exams — established in `docs/content-source-audit.md`). As an artifact it exists; as a summative assessment it is inert.

---

## J. Assessment Alignment

- **Chapter/topic quizzes ↔ lessons:** ✅ Strong (RULE 16 satisfied for what the quizzes cover). Every quiz question I read tests content explicitly taught in the same or an adjacent week: W1 quizzes test the 4 pipeline stages taught at `c.ts:53`; W3 quizzes test integer-division truncation taught at `c.ts:257`; W11 quizzes test the swap pattern taught at `c.ts:1067`; W16 quizzes test macro precedence taught at `c.ts:1580`. No question expects un-taught material.
- **Final exam ↔ course: partial — coverage gap.** The 15 final-exam items cover 13 of 20 weeks and **omit 7 weeks entirely**: W2 (tokens/keywords/comments), W4 (printf/scanf), W5 (if/switch), W6 (loops), W7 (functions), W8 (scope/recursion), W20 (capstone/debugging). For a 20-week course whose W20 promises "Certification Prep," a final that never tests loops, conditionals, or functions (and contains only one trace-style item) is under-representative. Coverage map: W1(Q2), W3(Q1), W9(Q3), W10(Q5,Q6), W11(Q4), W12(Q6), W13(Q7), W14(Q8), W15(Q9), W16(Q10,Q15), W17(Q11), W18(Q12), W19(Q13,Q14).

---

## K. Industry Relevance

✅ CONFIRMED strong for the platform's systems/embedded audience: register bit manipulation (`c.ts:271-273`), buffer-safety mindset (`c.ts:349-353`, `c.ts:957-967`), manual memory management (`c.ts:1261-1279`), file I/O (`c.ts:1459-1484`), linked structures (`c.ts:1674-1699`), complexity analysis (`c.ts:1862-1888`), and a modern tooling week with `gdb` + AddressSanitizer (`c.ts:1962-1965`). The intro explicitly targets hardware engineers (4 KB RAM MCU framing, `c.ts:46`). No dated toolchain advice found (the C++ course had a "GCC 9+" note; C course's tooling is current). ⚪ W20 register-address-style specifics are absent here (the C course doesn't hardcode MCU addresses, so no datasheet-attribution gap exists — a point in its favor versus the C++ course).

---

## L. Beginner Experience

✅ Layered, empathetic ramp: W1 starts from "why C still matters," walks setup (apt/Xcode/WSL/Code::Blocks/godbolt, `c.ts:60`), and gives "read the first error line" advice that is exactly right for novices. Pitfalls are named per week. 🔶 The sparse weeks cut both ways: less volume per week is gentler, but the *thin lessons* mean complex ideas (recursion, call stack, sort internals) arrive with little worked-example scaffolding — a beginner is more likely to memorize than understand those topics. No adaptive difficulty or remediation path exists in content (platform concern).

---

## M. Missing Content (RULE 9 — CONTENT MISSING vs PRESENT-BUT-WEAK, severity-tagged)

| Gap | Severity | Note |
|---|---|---|
| **Function pointers** (callbacks, `qsort` comparator) — entirely absent | **P2** | A GfG staple, a common C exam topic, and load-bearing for the embedded/event-driven audience; the title says "Deep GfG-Style" |
| **Trees / binary search trees** — absent | **P2** | "Deep" branding implies DS depth; course stops at linked list / stack / queue |
| **Graded exercises with solutions** per topic/week — absent | **P2** | See §F/§G |
| **Capstone deliverable + rubric** — absent (only design advice + ideas) | **P2** | Weaker than C++ course's assessed capstone |
| **Final-exam coverage of W2/W4/W5/W6/W7/W8/W20** — absent items | **P2** | See §J |
| **Bit-fields, `volatile` in embedded depth, endianness, struct padding/alignment** — only a quiz mention | **P2/P3** | WEAK-PRESENT, not missing; relevant to the embedded framing |
| **Multi-file build / makefiles** — mentioned, not taught | **P3** | WEAK-PRESENT (`c.ts:1956` mentions header/.c layout) |
| **`const` correctness, `void*`, pointer casts** — only incidental | **P3** | WEAK-PRESENT |
| **`ctype.h`/`math.h`/`string.h` breadth beyond str* family** | **P3** | WEAK-PRESENT |

---

## N. Redundant Content

✅ Within-course *question-text* duplication is zero (given). 🔶 **Concept-level recurrence is noticeable:** the string-literal-mutation UB fact appears in four assessment surfaces — W10 topic quiz (`c_topic_quizzes.ts:289`), W12 topic quiz (`:288-291`), W12 chapter quiz (`c.ts:1204-1212`), and final exam Q6 (`c.ts:2102-2109`). The `for(;;)`-is-infinite fact appears in both W6 chapter quiz (`c.ts:575`) and W6 topic quiz (`c_topic_quizzes.ts:152`); `calloc`-zeroes in both W13 chapter quiz (`c.ts:1284`) and W13 topic quiz (`c_topic_quizzes.ts:303`). Some overlap between chapter and topic quizzes is by design (two delivery surfaces), and spaced repetition of UB rules is defensible; this is mild, not a defect.

---

## O. Outdated Content

✅ **No factually outdated C content found.** The course is current: C17/C23 cited (`c.ts:46`), `gets()` correctly flagged as removed in C11 (`c.ts:351`), `void main()` correctly flagged non-standard (`c.ts:69`), "all declarations at top" correctly called obsolete (`c.ts:257`). No Turbo-C/pre-ANSI relics taught as current. 🔶 Only the W2 keyword-taxonomy currency note (§E) — a C23 nuance, not outdated content. (RULE 5 satisfied: nothing flagged "outdated" without verification.)

---

## P. Critical Findings (ranked)

1. **P1 — Final exam Q8 is factually wrong** (`c.ts:2122-2129`): `struct A { int x; }` vs `union B { int y; char z; }` are equal in size (both `sizeof(int)`; union = largest member per the course's own rule `c.ts:1377`), yet the marked answer is "struct A". Compiled probe confirms both = 4 bytes. The exam teaches the opposite of the lesson.
2. **P1 — Topic-quiz "toggle" answer contradicts the course's own idiom** (`c_topic_quizzes.ts:92` vs `c.ts:273`): question is ambiguous (`~` vs `^`), and the keyed answer contradicts the "`^` to toggle" mnemonic taught as THE embedded skill; high-impact because topic quizzes gate topic unlocks.
3. **P2 — Final-exam coverage gap:** 7 of 20 weeks have zero final-exam items (W2, W4, W5, W6, W7, W8, W20); the exam is under-representative for a course promising "Certification Prep" (§J).
4. **P2 — Lesson thinness (RULE 7 scope judgment):** median 145 words/topic is the shallowest in the catalog; recursion, the call stack, and the two O(n log n) sorts are taught at summary level, and the "Deep" title overstates depth (§D). Distinct from a length penalty — the issue is that complex topics lack the worked scaffolding their titles promise.
5. **P2 — No graded practical layer:** no exercises, no autograding, capstone is ideas + skeleton with no rubric or deliverable spec (§F/§G/§H).
6. **P2 — `printf` `%f`/`%lf` distinction taught backwards** (`c.ts:337-339`, quiz `c.ts:358-361`): the scanf distinction is applied to printf; `%f` already prints a double (§E-3).
7. **P3 — `malloc(0)` final-exam answer over-asserted** (`c.ts:2112-2119`): standard makes it implementation-defined (§E-4).
8. **P3 — Minor imprecisions:** "Rust's precursor is implemented in C" (`c.ts:46`); switch-case "no variable declarations without braces" rule (`c.ts:456`); header comment claims 4–5 topics/section vs actual 2–4 (`c.ts:4`).

---

## Q. Rubric Score

| Criterion (weight) | Score /5 | Weighted | Key evidence |
|---|---|---|---|
| A. Curriculum Architecture (15%) | 3.5 | 0.525 | Coherent 20-week climb; sparse weeks (2–4 topics), W18 has 2; header overclaims 4–5 (§B, §M) |
| B. Technical Accuracy (15%) | 4.0 | 0.600 | Verified sound & current; 2 confirmed errors (E-1 final Q8, E-2 toggle) + minor issues (§E) |
| C. Lesson Quality (15%) | 3.5 | 0.525 | Precise, pitfall-rich prose; but median 145 words — thin for complex topics (RULE 7) (§D) |
| D. Practical Learning (20%) | 3.25 | 0.650 | Code on 65/65, safety discipline, ASan/gdb; but no graded practice, capstone unassessed (§F) |
| E. Assessment Quality (15%) | 3.25 | 0.4875 | 433 items, clean distractors; 2 confirmed wrong/ambiguous; low cognitive ceiling; final has coverage gaps (§I) |
| F. LO Alignment (10%) | 3.5 | 0.350 | Quizzes align with lessons (RULE 16 OK); no objective layer; final omits 7 weeks (§C, §J) |
| G. Industry Relevance (5%) | 4.5 | 0.225 | Strong embedded/systems frame; current tooling; no hardcoded-address gap (§K) |
| **Total** | **3.36/5** | **3.3625 → 67.25/100** | **Band: Weak (60–69)** |

Math: (3.5×0.15)+(4.0×0.15)+(3.5×0.15)+(3.25×0.20)+(3.25×0.15)+(3.5×0.10)+(4.5×0.05) = 0.525+0.600+0.525+0.650+0.4875+0.350+0.225 = **3.3625/5 = 67.25/100**. Scores are evidence-labelled per §A–§O; fractional precision reflects verified granularity, not false certainty (RULE 4/5). Band sits just under the 70 "Needs Improvement" boundary; the two P1 assessment errors and the thin-lesson pattern are what hold it below 70.

---

## R. Recommended Future Actions (feed into STEP 14 Waves)

1. **Fix the two P1 assessment errors first** (cheapest, highest certainty): correct final-exam Q8's keyed answer (`c.ts:2128`) and re-word/re-key the bitwise-toggle topic quiz (`c_topic_quizzes.ts:92`) to resolve the `~`/`^` ambiguity. Add a regression note so bank edits don't reintroduce them.
2. **Deepen the thinnest high-stakes lessons (RULE 7):** add worked traces to Recursion (`c.ts:763`), The Call Stack (`c.ts:663`), and Merge/Quick Sort (`c.ts:1883`) — these are the topics where 145 words demonstrably under-teaches the title. Target +60–80 words with a second worked example each.
3. **Close the final-exam coverage gap:** add items sampling W2, W4, W5, W6, W7, W8 (and ideally a W20 project-scenario item) so the 15-question final actually covers the 20-week promise; optionally raise the exam to 20 questions. (Also resolves the "certification prep" mismatch.)
4. **Add the missing high-leverage topics:** function pointers and a binary-search-tree topic (with a `qsort`-comparator callback as the practical hook) to honor the "Deep GfG-Style" claim.
5. **Build a graded practical layer:** add per-week exercise-with-solution stubs and convert W20 into a defined capstone deliverable with a rubric (mirroring the C++ course's 7-point rubric), wired to the existing Assignment/Project subsystem.
6. **Add an explicit per-topic learning-objective field** and map quizzes/final/capstone to objectives (catalog-wide change; raises F).
7. **Tidy the P3 imprecisions:** fix the "Rust's precursor" line (`c.ts:46`), the switch-case declaration sentence (`c.ts:456`), the header's "4–5 sub-topics" claim (`c.ts:4`), and add a note in W4 clarifying that `%f` also prints a double in `printf`.

Estimated ceiling after 1–6: ~3.9–4.0/5 ≈ 78–80/100 → **Needs Improvement / Strong** boundary.

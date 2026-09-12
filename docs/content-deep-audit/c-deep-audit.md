# EduNexus Pro — Core C Course: Deep Curriculum Quality Audit

**Audit type:** Independent, evidence-based deep-scan (read-only).
**Course:** `C` — "C & Systems Programming for Hardware"
**Auditor:** Lead Curriculum Quality Auditor (independent re-audit — no prior scores inherited).
**Date:** 2026-08-14
**Compliance:** AUDIT-ONLY. No content, seed file, database record, source code, or schema was modified. The only file written is this report.

**Evidence labels:**
- `[CONFIRMED]` — directly verified via DB query (with row/id) or file read (with `file:line`).
- `[INFERRED]` — strong conclusion built from multiple confirmed pieces.
- `[UNKNOWN — NOT VERIFIED]` — cannot verify with available evidence.
- `[RECOMMENDATION]` — suggestion only, not a finding.

**Sources of truth (priority order used):**
1. Local Postgres `nexus` DB (via `/tmp/nexus-psql.sh`, read-only).
2. `backend/prisma/content/c.ts`, `backend/prisma/content/c_topic_quizzes.ts`, `backend/prisma/reseed_c_full.ts` (live content pipeline).
3. Contextual docs (re-verified, not trusted blindly): `docs/content-quality-audit-c.md`, `docs/assessment-systems-audit.md`, `docs/content-quality-audit-master-report.md`, `docs/wave1-decision-spec.md`, `docs/content-source-audit.md`.

---

## 1. Executive Summary

The Core C course is a **coherent, accurate, code-first, systems-flavoured C fundamentals sequence** whose main liabilities are structural, not factual: it has **no learning-objective layer**, **no graded practical track**, a **weak/unassessed capstone**, **no question feedback/explanations**, and **two confirmed assessment defects** — including one factually wrong answer on the (currently unserved) final exam. Lesson prose is precise, pitfall-rich, and current (C17/C23 framing, `gets()` correctly flagged as removed, modern tooling such as `gdb` and AddressSanitizer), but the **median lesson is ~145 words — the shallowest in the catalog** — so several high-stakes topics (recursion, the call stack, merge/quick sort) are taught at summary level despite the "Deep GfG-Style" branding.

Inventory is verified against the DB and matches the pipeline files exactly: **20 modules, 65 topics, 260 topic-quiz questions, 158 module-quiz questions, 15 final-exam questions, 0 challenges**. Two DB-vs-file metadata discrepancies were found (course description; frontend title/module drift).

**Independent score: 58/100 — "Major Revamp" boundary / low-60s Weak.** Confidence: **MEDIUM** (full file read + full DB verification, but no live-student exercise data and the final exam is unserved, so its severity is assessed as an artifact). The two assessment errors, the missing LO layer, and the absent graded/feedback layers are what hold the course below the prior 67.25 band; the content that *is* present is well above average.

---

## 2. Course Metadata (DB-sourced)

| Field | Value | Source |
|---|---|---|
| id | `C` | DB `Course` |
| title | C & Systems Programming for Hardware | DB `Course` |
| description | Learn the core foundations of procedural programming, memory allocations, and register masking. | DB `Course` |
| price | 699 | DB `Course` (matches `reseed_c_full.ts:41`) |
| isPublished | `true` | DB `Course` |

**[CONFIRMED] DB-vs-file discrepancy (course description).** The DB description (`Learn the core foundations…`) differs from the reseed's course-create description (`Master procedural programming, memory management, and systems-level C from first principles…`, `reseed_c_full.ts:38-43`). The reseed only *creates* the course when absent and never updates an existing description (`reseed_c_full.ts:33-48`), so the DB copy reflects an older/other source. Impact: catalog copy and marketing intent diverge; the DB description undersells the actual scope (it omits pointers, data structures, file I/O, and the capstone — all of which are taught).

**[CONFIRMED] Frontend title/module drift.** `frontend/src/config/courses.ts:30-50` titles the course "C & Systems Programming" (DB: "…for Hardware") and lists module 1 as "C Foundations & Environment Setup" (DB: "Introduction to C & Environment Setup"). This is a pre-existing 5-way metadata duplication pattern (DB vs `config/courses.ts` vs `Home.tsx` vs `seed.ts` list vs content files) — the DB wins at runtime; the frontend copies are presentation-only.

---

## 3. Content Inventory (DB counts)

Verified via `/tmp/nexus-psql.sh` on 2026-08-14. **All counts match the stated inventory and the content files.**

| Entity | Count | Evidence |
|---|---|---|
| Modules (weeks) | 20 | DB `SELECT COUNT(*) FROM "Module" WHERE "courseId"='C'` → 20 |
| Topics | 65 | DB join count → 65 |
| Topic-quiz questions (`QuizQuestion` with `topicId`) | 260 | DB → 260 (exactly 4 per topic × 65) |
| Module-quiz questions (`QuizQuestion` with `topicId IS NULL`) | 158 | DB → 158 |
| Final-exam questions (`FinalExamQuestion`) | 15 | DB → 15 |
| Challenges | 0 | DB `Challenge` join → 0 |
| **Total quiz questions** | **418** | DB → 418; all 418 texts distinct (`COUNT(DISTINCT text)` = 418) |

**Per-module breakdown (DB):**

| Wk | Module title | Topics | Module Qs | Topic Qs |
|---|---|---|---|---|
| 1 | Introduction to C & Environment Setup | 4 | 7 | 16 |
| 2 | C Basics: Tokens, Keywords, Identifiers, Comments | 4 | 8 | 16 |
| 3 | Variables, Data Types & Operators | 4 | 8 | 16 |
| 4 | Input/Output & Format Specifiers | 3 | 8 | 12 |
| 5 | Decision Making: if-else, switch | 3 | 7 | 12 |
| 6 | Loops: for, while, do-while | 4 | 8 | 16 |
| 7 | Functions | 4 | 8 | 16 |
| 8 | Scope, Storage Classes & Recursion | 3 | 8 | 12 |
| 9 | Arrays (1D, 2D, Multi-dimensional) | 3 | 8 | 12 |
| 10 | Strings & String Library Functions | 3 | 8 | 12 |
| 11 | Pointers & Pointer Arithmetic | 4 | 8 | 16 |
| 12 | Pointers & Arrays / Strings | 3 | 8 | 12 |
| 13 | Dynamic Memory Allocation (malloc, calloc, realloc, free) | 3 | 8 | 12 |
| 14 | Structures & Unions | 3 | 8 | 12 |
| 15 | File Handling | 3 | 8 | 12 |
| 16 | Preprocessor & Macros | 3 | 8 | 12 |
| 17 | Linked Lists | 3 | 8 | 12 |
| 18 | Stacks & Queues | 2 | 8 | 8 |
| 19 | Sorting & Searching Algorithms | 3 | 8 | 12 |
| 20 | Capstone Project + Certification Prep | 3 | 8 | 12 |
| **Total** | | **65** | **158** | **260** |

**Topic-lock safety:** every one of the 65 topics has exactly 4 attached quiz questions; DB check `SELECT COUNT(*) FROM "Topic" t WHERE NOT EXISTS (…)"Topic" id IN "QuizQuestion")` → **0** topics without questions. The frontend topic-lock gate (`GET /quiz/questions/topic/:topicId` → 404 on zero questions) is therefore safe. `[CONFIRMED]`

**Content sample — DB rows vs files match.** DB topic 966 text begins "C was created by Dennis Ritchie at Bell Labs in 1972…" matching `c.ts:46`; DB topic 994 (Recursion) and 1030 (Final Revision Checklist) match their file bodies. Question texts sampled from DB match `c.ts`/`c_topic_quizzes.ts` exactly. `[CONFIRMED]`

---

## 4. Curriculum Structure

The 20-week sequence is a **legitimate pedagogical climb**: environment/pipeline (W1) → tokens/keywords/identifiers/comments (W2) → types & operators (W3) → I/O (W4) → conditionals (W5) → loops (W6) → functions (W7) → scope/storage/recursion (W8) → arrays (W9) → strings (W10) → pointers (W11) → pointer-array equivalence (W12) → heap memory (W13) → structs/unions (W14) → file I/O (W15) → preprocessor (W16) → linked lists (W17) → stacks/queues (W18) → sorting/searching (W19) → capstone + exam prep (W20).

**Strengths `[CONFIRMED]`:**
- Every concept builds on the prior one; no orphan topics; no premature advanced topics in the early weeks.
- Pointers are given a full week (W11) before pointer-array interplay (W12) and heap allocation (W13) — a sound order.
- The course's own prerequisite logic is implicit but correct: dynamic memory (W13) presupposes pointers (W11); linked lists (W17) presuppose both.

**Weaknesses:**
- **Sparse weeks:** only 6 of 20 weeks carry 4 topics; 13 carry 3; W18 (Stacks & Queues) carries only **2**. The header comment claims "Each section carries 4–5 deep sub-topics" (`c.ts:4`) — actual range is **2–4**. `[CONFIRMED]` (P3 — metadata/design-intent mismatch).
- **No declared prerequisites** for the course or per-module (no field exists). `[CONFIRMED]`
- **Scope gaps vs. the "Deep GfG-Style" branding:** function pointers/callbacks, binary search trees, and multi-file/makefile builds are absent; bit-fields/`volatile`/endianness/struct-padding are only quiz-mentions. `[CONFIRMED]` (P2).

---

## 5. Module-by-Module Analysis

| Wk | Module | Topics | Verdict (evidence) |
|---|---|---|---|
| 1 | Introduction to C & Environment Setup | 4 | Strong opening: history, 4-stage pipeline, setup, program anatomy. Accurate (`c.ts:46-69`). |
| 2 | C Basics: Tokens, Keywords, Identifiers, Comments | 4 | Solid fundamentals; keyword taxonomy is C90-based (32 + conditional) — slightly dated vs. the course's own C23 claim (`c.ts:155`). |
| 3 | Variables, Data Types & Operators | 4 | Strong; bitwise/register framing is exactly right for the embedded audience (`c.ts:271-273`). |
| 4 | Input/Output & Format Specifiers | 3 | Good buffer-safety teaching; `%f`/`%lf` printf distinction taught backwards (`c.ts:337-339`) — see §8 TA-3. |
| 5 | Decision Making: if-else, switch | 3 | Pitfall-rich (dangling else, `if (x=5)`, fallthrough); switch-case declaration sentence muddled (`c.ts:456`) — see TA-5. |
| 6 | Loops: for, while, do-while | 4 | Complete; good trace questions (`c.ts:559` nested-break output). |
| 7 | Functions | 4 | Good; **Call Stack topic is thin** (~150 words, no frame trace) — see §7 W7T3. |
| 8 | Scope, Storage Classes & Recursion | 3 | **Recursion taught at gloss level** (factorial only, ~130 words) — see §7 W8T2. |
| 9 | Arrays (1D, 2D, Multi-dimensional) | 3 | Accurate; bounds-safety emphasis correct (`c.ts:851`). |
| 10 | Strings & String Library Functions | 3 | Strong; correct `strcmp`-not-`==` and literal-mutation-UB teaching (`c.ts:958-965`). |
| 11 | Pointers & Pointer Arithmetic | 4 | The heart of the course; accurate and well-sequenced; swap pattern canonical (`c.ts:1067`). |
| 12 | Pointers & Arrays / Strings | 3 | Correct `a[i]≡*(a+i)` and pointer-to-array vs array-of-pointers distinction (`c.ts:1158-1167`). |
| 13 | Dynamic Memory Allocation | 3 | Accurate (malloc/calloc/realloc/free, NULL-check, realloc temp-pointer, free→NULL); failure-mode depth thin — see §7 W13T3. |
| 14 | Structures & Unions | 3 | Correct (`.` vs `->`, `sp->m≡(*sp).m`, union=largest member); taught well. |
| 15 | File Handling | 3 | Accurate; binary-file portability is one sentence — see §7 W15T3. |
| 16 | Preprocessor & Macros | 3 | Excellent macro-precedence teaching (`c.ts:1580`); header guards + conditional compilation correct. |
| 17 | Linked Lists | 3 | Good; head-insert O(1), deletion prev-node relink, free-list save-next (`c.ts:1691-1699`). |
| 18 | Stacks & Queues | 2 | Thinnest week (2 topics); array impls correct; circular-queue explainer good (`c.ts:1795`). |
| 19 | Sorting & Searching Algorithms | 3 | **Merge/Quick taught at summary level** (~150 words for both sorts; quicksort shows only Lomuto partition) — see §7 W19T2. |
| 20 | Capstone Project + Certification Prep | 3 | Good design-methodology prose; **no deliverable spec, rubric, or assessed project** — see §14. |

---

## 6. Topic-by-Topic Findings

All 65 topics verified in files + DB row samples. **Healthy majority** (accurate, code-present, pitfall-taught) is summarized; only topics with findings are itemized.

- **W1T1 "Why C Still Matters in 2026"** (`c.ts:46`) — accurate C17/C23 framing; imprecise "Rust's precursor is implemented in C" line (Rust is self-hosted; bootstrap compiler was OCaml). P3. See TA-6.
- **W2T1 "Tokens"** (`c.ts:148`) — correct 6-kind taxonomy; good "3 vs \"3\"" distinction.
- **W2T2 "Keywords"** (`c.ts:155`) — correct C90 32 + conditional list; no C23 keyword update despite W1 citing C23. P3 currency note. See TA-7.
- **W4T1 "printf"** (`c.ts:337-339`) — `%f`/`%lf` guidance inverted for printf (scanf distinction). P2. See TA-3.
- **W5T3 "switch-case"** (`c.ts:456`) — "No `continue`/variable declarations directly in a case without braces in older standards" is a muddled simplification. P3. See TA-5.
- **W7T3 "The Call Stack"** (`c.ts:663-667`) — ~150 words; no frame trace/diagram; "returning `&local` is a bug" stated, not shown. P2 depth. See §7.
- **W8T2 "Recursion"** (`c.ts:763-767`) — ~130 words; factorial only; no trace, no Fibonacci, no cost walkthrough. P2 depth.
- **W13T3 "Memory Leaks and Dangling Pointers"** (`c.ts:1275-1279`) — correct rules; thin on debugging a real leak. P3 depth.
- **W15T3 "Binary Files"** (`c.ts:1480-1484`) — portability/padding/endianness compressed to one sentence. P3 depth.
- **W19T2 "Merge Sort and Quick Sort"** (`c.ts:1883-1887`) — ~150 words for two sorts; quicksort shows only the Lomuto partition (no recursion), merge sort has no code; neither complete example present. P2 depth.
- **W20T1 "Designing a Complete C Project"** (`c.ts:1954-1958`) — strong method; ideas + skeleton only, no rubric/deliverable. P2 (see §14).
- **W20T3 "Final Revision Checklist"** (`c.ts:1968-1970`) — excellent 13-point competency list; the closest the course gets to explicit outcomes (but a revision list, not objectives).

All other topics: `[CONFIRMED]` accurate, code-carrying, note-carrying, with no findings.

---

## 7. Content Chunk Summaries (W{week}.T{order} <title>)

Format: `W{week}.T{order}` = the topic at `order` in that week's DB rows. Summarized + analyzed, aggregated by week.

**Week 1 — Introduction to C & Environment Setup**
- **W1.T0 "Why C Still Matters in 2026"** — history/positioning, direct memory control, C17/C23 currency. Analysis: strong framing; minor imprecision (Rust line). Note field gives exam point (main entry).
- **W1.T1 "The Compilation Pipeline: Source to Binary"** — 4-stage pipeline with a per-stage mnemonic; `undefined reference` = linker error. Analysis: accurate, exam-friendly, reinforced by 2 chapter + 4 topic quizzes. Correct.
- **W1.T2 "Setting Up: Compiler, Editor, and Terminal"** — GCC/WSL/MinGW/godbolt; `-Wall -Wextra`; "read the first error line". Analysis: current, actionable, beginner-appropriate.
- **W1.T3 "Anatomy of a C Program"** — directives, main, statements, blocks, comments, case-sensitivity. Analysis: correct; `void main()` correctly flagged non-standard.

**Week 2 — C Basics**
- **W2.T0 "Tokens"**, **W2.T1 "Keywords"**, **W2.T2 "Identifiers"**, **W2.T3 "Comments"** — all four accurate (6 token kinds; 32 keywords + conditionals; identifier rules incl. leading-underscore reservation; non-nesting block comments). Analysis: sound; keyword list is C90-flavored (P3 currency).

**Week 3 — Variables, Data Types & Operators**
- **W3.T0 "Primitive Data Types"** — correct minimum-guarantees framing; AVR (2) vs x86 (4) int example correct; `int32_t` portability correct.
- **W3.T1 "Declaring and Initialising Variables"** — UB on uninitialized locals; globals/static zero-init; integer-division truncation correct.
- **W3.T2 "Arithmetic, Relational & Logical Operators"** — short-circuit correct; `printf("%d %d", i++, i++)` UB flagged.
- **W3.T3 "Bitwise Operators and Operator Precedence"** — register idioms `\|=`, `&~`, `^` correct and appropriately emphasized (note: `^` for toggle — see §8 TA-2 for the quiz contradiction).

**Week 4 — I/O & Format Specifiers**
- **W4.T0 "printf"**, **W4.T1 "scanf"**, **W4.T2 "getchar/gets vs fgets"** — `%f`/`%lf` printf inversion (TA-3); scanf `&` requirement correct; `gets()` removed in C11 correct; `fgets` newline-strip idiom correct.

**Week 5 — Decision Making**
- **W5.T0 "if/else ladder"** — `if (x=5)` and dangling-else pitfalls correct.
- **W5.T1 "Ternary"** — correct expression semantics; right-to-left binding noted.
- **W5.T2 "switch-case"** — fallthrough/default/case-constants correct; TA-5 declaration muddle.

**Week 6 — Loops**
- **W6.T0 "while"**, **W6.T1 "do-while"**, **W6.T2 "for"**, **W6.T3 "break/continue/nested"** — all correct; do-while trailing semicolon emphasized; nested-break trace correct (`(0,0)(0,1)(1,0)(1,1)…`).

**Week 7 — Functions**
- **W7.T0 "Why Functions"**, **W7.T1 "Pass-by-Value"**, **W7.T2 "Return Values and void"** — accurate; pass-by-value with "modifies the COPY" worked example is excellent.
- **W7.T3 "The Call Stack"** — conceptually right but thin (no frame diagram/trace; the most abstract W7 topic gets the least scaffolding). P2.

**Week 8 — Scope, Storage Classes & Recursion**
- **W8.T0 "Local vs Global"**, **W8.T1 "Storage Classes"** — correct (auto default, register hint, static persistence, extern declaration-not-definition, zero-init rules).
- **W8.T2 "Recursion"** — correct but gloss-level (factorial only). P2.

**Week 9 — Arrays**
- **W9.T0 "1D"**, **W9.T1 "2D"**, **W9.T2 "Passing & Bounds"** — correct; row-major, decay-to-pointer, `sizeof`-pointer trap, bounds UB.

**Week 10 — Strings**
- **W10.T0 "What a String Is"** — correct null-terminator, array vs literal, `'A'` vs `"A"`.
- **W10.T1 "str* functions"** — correct; `==`-compares-addresses trap emphasized.
- **W10.T2 "Safe reading"** — correct `fgets` guidance and common-bug list.

**Week 11 — Pointers & Pointer Arithmetic**
- **W11.T0 "Address-of"**, **W11.T1 "Dereference & NULL"**, **W11.T2 "Pointer Arithmetic"**, **W11.T3 "Swap pattern"** — all correct; NULL-check-before-deref emphasized; type-aware arithmetic (`p+1` = `sizeof(type)`) correct.

**Week 12 — Pointers & Arrays/Strings**
- **W12.T0 "Array Names Decay"** — correct `a[i]≡*(a+i)`, `i[a]` trivia, non-lvalue array name.
- **W12.T1 "Pointer-to-array vs array-of-pointers"** — correct inside-out reading rule.
- **W12.T2 "Pointer Strings vs Char Arrays"** — correct mutability distinction and `s=p` vs `p=s`.

**Week 13 — Dynamic Memory**
- **W13.T0 "Heap vs Stack"** — correct contrast table.
- **W13.T1 "malloc/calloc/realloc"** — correct (uninitialized vs zeroed, realloc temp-pointer, sizeof portability).
- **W13.T2 "Leaks and Dangling"** — correct rules; thin on debugging depth. P3.

**Week 14 — Structures & Unions**
- **W14.T0 "Structures"**, **W14.T1 "`.` vs `->`"**, **W14.T2 "typedef & Unions"** — all correct; union=largest-member rule matches TA-1's violation.

**Week 15 — File Handling**
- **W15.T0 "fopen/fclose"**, **W15.T1 "Formatted file I/O"**, **W15.T2 "Binary files"** — correct; binary portability caveat thin. P3.

**Week 16 — Preprocessor & Macros**
- **W16.T0 "#include/#define"** — correct text-substitution model; no-semicolon convention.
- **W16.T1 "Function-like macros"** — correct `SQUARE(3+2)=11` precedence and `x++` double-eval dangers.
- **W16.T2 "Header guards & conditional compilation"** — correct; `-DDEBUG` correct.

**Week 17 — Linked Lists**
- **W17.T0 "Why lists exist"**, **W17.T1 "Insert at head"**, **W17.T2 "Traverse/search/delete"** — correct; self-referential struct, O(1) head insert, prev-node relink, save-next-before-free.

**Week 18 — Stacks & Queues**
- **W18.T0 "Stack LIFO"**, **W18.T1 "Queue FIFO"** — correct array impls; overflow/underflow and circular-queue wrap covered.

**Week 19 — Sorting & Searching**
- **W19.T0 "Linear & Binary search"** — correct; sorted-precondition and `lo+(hi-lo)/2` overflow-avoidance correct.
- **W19.T1 "Simple sorts"** — correct complexities table; stability claims correct (bubble/insertion stable, selection typically unstable).
- **W19.T2 "Merge/Quick"** — P2 depth (both sorts in ~150 words; no merge code; quicksort = partition only).

**Week 20 — Capstone & Certification Prep**
- **W20.T0 "Designing a project"** — strong method + 4 ideas + skeleton; no rubric/deliverable. P2 (§14).
- **W20.T1 "Debugging & testing"** — excellent (`-Wall -Wextra -g`, ASan, test matrix, gdb).
- **W20.T2 "Revision checklist"** — 13 competencies; de-facto course outcomes.

**Aggregate analysis:** the course is **consistently accurate and well-written** across all 65 topics, with genuinely strong pitfall teaching and code-first delivery. The depth problem is concentrated in W7T3, W8T2, W19T2 (plus thin notes in W13/W15) — exactly the abstract/algorithmic topics where summary-level prose under-teaches. No topic is filler; none is factually wrong in its prose (the two wrong/ambiguous items are in the assessment layer, §8/§12).

---

## 8. Technical Accuracy Findings

Independent verification against C11/C17 semantics, UB rules, pointer/memory semantics, and the standard library. `[CONFIRMED]`-correct representative claims: 4-stage pipeline and linker-error attribution (`c.ts:53`); `int main(void)` standard / `void main()` non-standard (`c.ts:69`); uninitialized local UB + global/static zero-init (`c.ts:257`); `sizeof` is an operator (`c.ts:252`); `gets()` removed in C11 (`c.ts:351`); `a[i]≡*(a+i)` and non-modifiable array name (`c.ts:1158`); decay-to-pointer and `sizeof(arr)`=pointer-size in functions (`c.ts:865`); malloc uninitialized / calloc zeroed / realloc temp-pointer / free-then-NULL (`c.ts:1270-1278`); union size = largest member (`c.ts:1377`); `mid=lo+(hi-lo)/2` overflow avoidance (`c.ts:1871`); macro `SQUARE(3+2)→11` and `SQ(x++)` double-eval (`c.ts:1580`); bubble/insertion stable, selection typically unstable (`c.ts:1878`).

**Findings (severity-ranked):**

**TA-1 · Final-exam Q8 keyed answer is factually wrong — `[CONFIRMED]`, P1 (P0 if the exam is ever served).**
DB `FinalExamQuestion` id **473**: "`struct A { int x; }; union B { int y; char z; };` — which is typically larger?" Options `{struct A, union B, They are always equal, Impossible to say}`, keyed `struct A`. Independent compile probe: `sizeof(struct A)=4`, `sizeof(union B)=4` → **they are equal**, contradicting both reality and the course's own "union = size of largest member" rule (`c.ts:1377`, reinforced by topic quiz DB id 9211). The correct option *is offered* ("They are always equal") but marked wrong. This is the same finding as the prior audit (which called it P1; the Wave-1 spec escalated to P0-04). My independent severity: **P1** today because the final exam is unreachable dead content (no route/UI — §21); **escalates to P0** if the exam is wired without correction. Correction DIRECTION: re-key to "They are always equal" (verified correct), or rewrite the item so sizes differ (e.g., a two-member struct) to preserve a single defensible key.

**TA-2 · Topic-quiz "toggle" item contradicts the course's own idiom — `[CONFIRMED]`, P1.**
DB `QuizQuestion` id **8980** (topic "Bitwise Operators and Operator Precedence", topic gate): "Which operator toggles (flips) the bits it is applied to?" Options `{&, |, ^, ~}`, keyed `~`. The lesson note teaches "`|` to set, `&~` to clear, **`^` to toggle** — THE embedded skill" (`c.ts:273`; DB topic 977 note). `~` flips *all* bits of its operand; `^` toggles *mask-selected* bits. The item is ambiguous and internally inconsistent with the course's own terminology; a student applying the taught "`^` to toggle" idiom is marked wrong on a topic-lock gate. Correction DIRECTION: re-key to `^` with a stem that says "toggle selected bits with a mask", or re-word to "flips all bits of its operand" keyed `~`; align with the lesson's terminology.

**TA-3 · `printf` `%f`/`%lf` guidance taught backwards — `[CONFIRMED]`, P2.**
`c.ts:337-339` teaches "%f — float (promoted to double)" and "%lf — double", and chapter quiz DB id **9002** keys `%lf` for "Which format specifier correctly prints a `double`?" In `printf`, variadic promotion means `%f` already expects a `double`; `%lf` is a valid alias (C99+). The `%f`/`%lf` distinction the course teaches is the *scanf* rule. The quiz answer is not false (both work), but the lesson inverts the mental model. Correction DIRECTION: revise the lesson to state `%f` prints a `double` (and `%lf` is equivalent in `printf`), and keep the scanf-side distinction for input.

**TA-4 · Final-exam `malloc(0)` answer over-asserts — `[CONFIRMED]`, P3.**
DB id **472**: "What does `malloc(0)` with no failure check most dangerously hide?" keyed "It returns a valid pointer to zero bytes…". The C standard (C11 7.22.3) makes `malloc(0)` **implementation-defined** (may return NULL or a unique non-null pointer). The keyed answer states glibc behavior as universal. Correction DIRECTION: hedge to "implementation-defined — may return NULL or a unique pointer" or drop the item.

**TA-5 · Minor imprecisions — `[CONFIRMED]`, P3.**
- `c.ts:46`: "Python, Java, Node.js and even **Rust's precursor** are implemented in C." Rust is self-hosted (bootstrap compiler in OCaml). Unclear/imprecise.
- `c.ts:456`: "No `continue`/variable declarations directly in a case without braces in older standards." Muddled: `continue` is a loop construct; C99+ permits declarations under a `case` label (with scope spanning the switch). This conflates the C89 declaration-at-block-start rule.

**TA-6 · Keyword taxonomy currency (C90 model vs C23 claim) — `[CONFIRMED]`, P3.**
W2 teaches the 32 C90 keywords + 5 conditional ones (`c.ts:155`). W1 cites C23 as current (`c.ts:46`). C23 promotes `bool`, `true`, `false`, `nullptr`, `alignas`, `alignof`, `static_assert`, `thread_local`, `typeof` to keywords. Not "wrong" for a fundamentals course, but inconsistent with the course's own currency claim.

**TA-7 · W20 hand-trace has a typo — `[CONFIRMED]`, P3.**
`c.ts:1971` code block contains `printf("%zu\n\", sizeof(a) / sizeof(a[0]));` — a stray backslash inside the format string (`\n\"`). The code as written would not compile as-is (mismatched quote). This is in the W20 topic `code` field (copyable example). Correction DIRECTION: fix to `"%zu\n"`.

**Obsolescence scan:** no Turbo-C/pre-ANSI relics taught as current; `gets()` correctly flagged removed in C11 (`c.ts:351`); "all declarations at top" correctly called obsolete (`c.ts:257`); toolchain advice (gcc `-Wall -Wextra`, `gdb`, `-fsanitize=address`) is current. **No retired/deprecated technology is taught** (§16). `[CONFIRMED]`

---

## 9. Learning Objective Audit

- **No explicit per-topic or per-module objectives exist.** Topic model exposes `{title, text, code, note}` (`c.ts:12-17`); module exposes `{week, title, description, topics, quizzes}` (`c.ts:25-31`). No "By the end you will be able to…" layer, no Bloom tags, no objectives table. `[CONFIRMED]`
- Module `description` fields (e.g., `c.ts:40-41`) are **coverage statements**, not measurable outcomes.
- The closest artifact to outcomes is W20's "Final Revision Checklist" (`c.ts:1968-1970`), which lists 13 competencies — but as a revision list, not as pre-stated objectives.
- **No objectives→assessment map exists.** Alignment is implicit: quizzes test what adjacent lessons teach (verified in §10/§11), but nothing declares which objective a question measures, and nothing maps objectives to the capstone or final exam.
- **Severity: P1 structural gap** (catalog-wide; caps the LO and LO-Alignment criteria for every course). Same finding as the prior audit — independently confirmed here.

---

## 10. LO → Content → Practice → Assessment Matrix

No explicit LOs exist, so the matrix classifies **implicit** alignment. Classes defined for this audit:
- **A** — explicit LO + content + practice + assessment all present and aligned.
- **B** — explicit LO + content + assessment aligned, no practice.
- **C** — content + assessment aligned, no explicit LO, no graded practice (implicit alignment).
- **D** — content present, assessment absent/incomplete for that content.
- **E** — assessment misaligned/contradicts content (defective item).
- **F** — absent (neither content nor assessment).

| Week | Content taught | Practice (graded) | Module quiz | Topic quiz | Final exam item(s) | Class |
|---|---|---|---|---|---|---|
| W1 | ✓ | ✗ | ✓ (7) | ✓ | ✓ (Q2 pipeline) | **C** |
| W2 | ✓ | ✗ | ✓ (8) | ✓ | **✗ omitted** | **D** (module-level C) |
| W3 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q1 int div) | **C** |
| W4 | ✓ | ✗ | ✓ (8) | ✓ | **✗ omitted** | **D** |
| W5 | ✓ | ✗ | ✓ (7) | ✓ | **✗ omitted** | **D** |
| W6 | ✓ | ✗ | ✓ (8) | ✓ | **✗ omitted** | **D** |
| W7 | ✓ | ✗ | ✓ (8) | ✓ | **✗ omitted** | **D** |
| W8 | ✓ | ✗ | ✓ (8) | ✓ | **✗ omitted** | **D** |
| W9 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q3 indices) | **C** |
| W10 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q5 strcmp, Q6 literal) | **C** |
| W11 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q4 swap) | **C** |
| W12 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q6 p=s) | **C** |
| W13 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q7 malloc(0)) | **C** (E for Q7) |
| W14 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q8 struct/union — **defective**) | **E** |
| W15 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q9 fopen "w+") | **C** |
| W16 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q10 SQ, Q15 header guard) | **C** |
| W17 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q11 list head delete) | **C** |
| W18 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q12 stack) | **C** |
| W19 | ✓ | ✗ | ✓ (8) | ✓ | ✓ (Q13, Q14 search/sort) | **C** |
| W20 | ✓ | ✗ (capstone unassessed) | ✓ (8) | ✓ | **✗ omitted** | **D** |
| W3-T3 (bitwise) | ✓ (`^` toggle) | ✗ | ✓ | ✓ topic quiz id 8980 — **contradicts content** | — | **E** |

**Matrix reading:** 0 topics reach Class A; the entire course is Class C/D at best, with two Class E assessment defects (W14 final Q8, W3-T3 toggle item) that actively contradict taught content. **7 of 20 weeks have zero final-exam coverage** (W2, W4, W5, W6, W7, W8, W20) — the "Certification Prep" promise is unsupported by the exam (§11). `[CONFIRMED]`

---

## 11. Assessment Audit

**Volume & format:** 418 course questions (260 topic + 158 module) + 15 final-exam. Every question is 4-option, exactly one correct. DB `COUNT(DISTINCT text)` = 418 → **zero within-course duplicate question texts**. `[CONFIRMED]`

**Delivery reachability:** chapter quizzes served via `GET /quiz/questions/:courseId/:week` (all module questions, DB order, no shuffle — `quizService.ts:17-19`); topic quizzes via `GET /quiz/questions/topic/:topicId` (shuffle then `slice(0,5)` on 4-question banks → **no-op randomization**, returns all 4 — `quizService.ts:336-338`). Final exam **not served** (§21). `[CONFIRMED]`

**Grading:** exact-string compare against `correctAnswer` (`quizService.ts:52`); 60% pass threshold. **`QuizQuestion` has no `explanation` field** (`schema.prisma:137-151`) → the post-submit breakdown shows right/wrong + correct answer but never *why* (§19). `[CONFIRMED]`

**Quality:** distractors are predominantly plausible and non-overlapping (verified across the full read — e.g., swap-function family `c.ts:1100-1106`, pointer-arithmetic family `c.ts:1094-1097`, macro-expansion family `c_topic_quizzes.ts:362-365`). Cognitive level: solid recall/comprehension, moderate application (well-chosen code-trace items, e.g., `continue` trace → `0134` at `c_topic_quizzes.ts:159`), minimal analysis/evaluation (almost no bug-hunting-from-snippet, no design/justify items). `[CONFIRMED]`

**Coverage — final exam under-represents the course:** the 15 final items cover 13 of 20 weeks and omit **W2, W4, W5, W6, W7, W8, W20** — i.e., loops, conditionals, functions, strings I/O, scope/recursion, and the capstone/debugging week are never tested in the summative. Only one final item is a code-trace. For a 20-week course whose W20 promises "Certification Prep," the exam is not representative. `[CONFIRMED]` (P2)

---

## 12. Question-Level Defects (individually with DB id; healthy summarized)

**Defective items (2):**

| DB id | Layer | Stem | Keyed answer | Defect | Severity |
|---|---|---|---|---|---|
| **473** | Final exam Q8 | "`struct A { int x; }; union B { int y; char z; };` — which is typically larger?" | `struct A` | **Wrong key.** Both are 4 bytes (compile probe). Correct option "They are always equal" is present but not keyed. Contradicts lesson `c.ts:1377`. | P1 (P0 if exam wired) |
| **8980** | Topic quiz (W3-T3, gate) | "Which operator toggles (flips) the bits it is applied to?" | `~` | **Ambiguous + contradicts course idiom.** `^` is taught as "the toggle" idiom (`c.ts:273`); `~` flips all bits. A student using the taught mnemonic is marked wrong on a lock gate. | P1 |

**Healthy population (summarized):** the remaining 416 course questions + 14 final-exam items are **accurate, aligned, and well-formed** (verified by full-file read + DB sampling). Distractors are plausible; correct answers are genuinely correct (e.g., integer-division truncation, pointer arithmetic, macro precedence, swap pattern, `fgets` bounds, union size, header guards). No other wrong key or unanswerable stem found. No question-text duplication within the course. `[CONFIRMED]`

---

## 13. Practical Learning Audit

**Classification: MODERATE** (leaning LOW on the graded axis).

- **Code-first pedagogy `[CONFIRMED]`:** 65/65 topics carry a runnable-looking `code` block; many are embedded-flavoured (register bit ops `c.ts:271-273`, `fgets` newline-strip `c.ts:352`, circular queue `c.ts:1795`, ASan build `c.ts:1964`). The CodePlayground frontend lets students run `topic.code` against a sandbox (`content-source-audit.md` §5.2).
- **Safety discipline taught as a skill `[CONFIRMED]`:** buffer bounds, malloc NULL-check + free→NULL, realloc temp-pointer, "read the first error line", `-Wall -Wextra` + sanitizers.
- **No graded practice layer `[CONFIRMED]`:** practice = quizzes only. There are no in-content exercises with solutions, no autograded coding checkpoints in the C course (the platform's challenge engine exists but is UI-orphaned and seeded for WebDesign/Python/SQL only — not C; `challengeSeedData.ts:1-3`).
- **Capstone is described, not assessed `[CONFIRMED]`:** W20 gives design method, 4 ideas, and a skeleton — no deliverable spec, no rubric, no submission binding (§14).

---

## 14. Project Audit

- **One project artifact in-content:** W20 capstone guidance (`c.ts:1954-1958`) — a 6-stage design method, four project ideas (student marks, library/inventory, expression evaluator, grade report), and a `Student`-record skeleton with a menu-loop comment.
- **No defined deliverable `[CONFIRMED]`:** no acceptance criteria, no module breakdown to build, no rubric, no submission flow, no evaluation criteria. The platform's `ProjectSubmission` route accepts arbitrary `{title, description, sourceCodeUrl, reportUrl}` and evaluates manually (+100 XP on APPROVED, `routes/project.ts`) — it never references any course-specific brief or rubric.
- **Gate risk `[CONFIRMED]`:** project submission hard-requires **20** modules `quizPassed` (`routes/project.ts:49-55`) and assignments map week N → module `5N` (`routes/assignment.ts:49`) — hardcoded 20-module assumptions that contradict the dynamic module-count fix in `quizService` (issue #70) and would break for any ≠20-module course. Currently latent (C has exactly 20 modules).
- **Verdict:** the capstone adds real *design* value but **zero assessed/portfolio value** as written. Weaker than the sibling C++ course's rubric-carrying capstone.

---

## 15. Industry Relevance Audit

**Classification: STRONG for the systems/embedded audience.**

- Register bit manipulation (`c.ts:271-273`), buffer-safety mindset (`c.ts:349-353`, `c.ts:957-967`), manual memory management (`c.ts:1261-1279`), file I/O (`c.ts:1459-1484`), linked structures (`c.ts:1674-1699`), complexity analysis (`c.ts:1862-1888`), and a modern tooling week with `gdb` + AddressSanitizer (`c.ts:1962-1965`) are all current and directly relevant to embedded/systems roles. `[CONFIRMED]`
- Intro explicitly targets hardware engineers (4 KB RAM MCU framing, `c.ts:46`).
- No dated toolchain advice; no retired services taught. **No hardcoded MCU register addresses** in the C course (unlike the C++ sibling), so no datasheet-attribution gap here. `[CONFIRMED]`
- **Modest currency nit:** W2 keyword taxonomy is the C90/99 model while W1 cites C23 (P3, §8 TA-6).

---

## 16. Obsolete/Deprecated Technology Audit

- **No deprecated/retired technology is taught as current.** `[CONFIRMED]` — `gets()` correctly flagged removed in C11 (`c.ts:351`); `void main()` correctly flagged non-standard (`c.ts:69`); "all declarations at top" correctly called obsolete (`c.ts:257`). No Turbo-C/pre-ANSI relics.
- The only currency inconsistency is the C90 keyword taxonomy vs the C23 claim (P3, §8 TA-6).
- **Not applicable to the C course** are the retired-cloud-service issues found in IoT (Google Cloud IoT, Azure TSI) — those are in a different course.

---

## 17. Duplication Audit

- **Within-course question-text duplication: 0** — `[CONFIRMED]` (DB `COUNT(DISTINCT text)=418`).
- **Cross-course duplication: 0** — `[CONFIRMED]` per master-report §18 (all 4,318 chapter+topic items original); not re-scripted here but consistent with the verified distinctness.
- **Concept-level recurrence (mild, defensible):** the string-literal-mutation UB fact appears across 4 surfaces (W10 topic quiz, W12 topic quiz, W12 chapter quiz, final Q6); `for(;;)`-infinite in both W6 chapter and topic quizzes; `calloc`-zeroes in both W13 surfaces. **Harmless-to-legitimate**: chapter and topic quizzes are two delivery surfaces by design, and spaced repetition of high-value UB rules is pedagogically defensible. `[CONFIRMED]`
- **File-level dead duplicate:** `reseed_c_beginner.ts` is superseded by `reseed_c_full.ts` and unwired to any npm script (`content-source-audit.md` §18). It holds an older beginner curriculum (different topic titles) — a maintenance hazard, not runtime duplication. `[CONFIRMED]`

---

## 18. Consistency Audit

- **Format:** uniform 4-option/1-correct convention across all 418 course + 15 exam questions; every topic has exactly 4 topic questions. `[CONFIRMED]`
- **Voice/register:** consistent — bold-led claim → mechanism → "why it matters" → explicit pitfall, across all 65 topics. `[CONFIRMED]`
- **Terminology inconsistency (the notable exception):** "toggle" is taught as `^` in the lesson (`c.ts:273`) but keyed as `~` in the topic quiz (DB 8980) — a direct internal contradiction (§8 TA-2). `[CONFIRMED]`
- **Assessment style:** uniform MCQ-only; no free-response/multi-select variation. Consistent but narrow.
- **Metadata inconsistency:** header comment claims "4–5 deep sub-topics" vs actual 2–4 (`c.ts:4`); DB course description differs from reseed file description (§2). `[CONFIRMED]`

---

## 19. Feedback Audit

- **`QuizQuestion` has no `explanation` field** (`schema.prisma:137-151`) → across 418 course questions, the post-submit breakdown reveals right/wrong and the correct answer (`quizService.ts:54-64`) but **never why**. This is "score-without-learning" for the quiz layer. `[CONFIRMED]`
- **`PracticeQuestion` does carry `explanation`** (`schema.prisma:218`) and it is returned in the practice breakdown (`routes/practice.ts:79`) — proof the platform *can* do feedback; it was simply not applied to course quizzes.
- **Per-topic `note` field** is the main in-content learning support: a concise exam-oriented takeaway on every topic (65/65). Valuable, but it is a pre-study aid, not post-quiz remediation.
- **No hints, no remediation path, no next-steps** anywhere in the C content.
- **Severity: P2** (catalog-uniform; the platform gap — `QuizQuestion.explanation` — is the root cause).

---

## 20. Student Journey Audit

Discover → Enroll → Learn → Practice → Quiz → Feedback → Progress → Assignment → Project → Final → Certificate.

| Stage | Status (evidence) |
|---|---|
| Discover | Course appears in DB/API and Home catalog; but frontend metadata (title "C & Systems Programming", syllabus one-liners) drifts from DB (`config/courses.ts:30-50`). Marketing copy "4-Week Immersion" contradicts the 20-module reality (`CourseDetail.tsx:626`). |
| Enroll | PayPage/EnrollmentPanel hardcode ₹699 and a fake certificate preview; paywall is **frontend-only** — lesson + quiz content is served to any authenticated user with no enrollment/payment check (`routes/course.ts:35`, `routes/quiz.ts:13,30,49`). P0-1 from `content-source-audit.md` (infrastructure, not C-specific). |
| Learn | Topic reader renders DB `Topic.text/code/note` via ReactMarkdown + CodePlayground. Genuine, DB-backed. |
| Practice | No graded practice; CodePlayground sandbox lets students run `topic.code` ad hoc (unscored). |
| Quiz | Chapter quiz (all module Qs) and topic quiz (4 Qs served, lock-gated). Grading is exact-string; XP/badge award is **unreachable dead code** (`quizService.ts:69-89` — creates QuizResult before the already-passed guard, so the guard always matches). Infrastructure P0-3. |
| Feedback | Right/wrong + correct answer only; no explanations. |
| Progress | Topic/Module/Course progress upserts on ≥60% pass. Reseed destroys `TopicProgress` (topics delete-and-recreate) but preserves modules. |
| Assignment | 4 hardcoded assignment titles in Dashboard; gate = module `weekNum*5`; no content-defined briefs; uploads are mock-path metadata (`/uploads/mock_…`). |
| Project | Gate = 20 modules passed; no brief/rubric; +100 XP on APPROVED. |
| Final | **Does not exist for students** — `FinalExamQuestion` has no route/UI (§21). |
| Certificate | Requires all module quizzes + **verified payment**; admin verify flow; the certificate copy promises "final examinations" that never happen (`EnrollmentPanel.tsx:59`). |

**Journey verdict `[INFERRED]`:** the learn→quiz→progress spine works end-to-end from DB content; the practice, assignment, project, final, and feedback stages are either absent, unassessed, or infrastructure-only. A student can complete 20 weeks of quizzes and get a certificate without ever doing a graded practical task or a final exam — contradicting the marketing promise.

---

## 21. Assessment Reachability Audit

DB → Route → API → Frontend → Student, for each assessment artifact of the C course:

| Artifact | DB rows | Route/API | Frontend | Student-reachable? |
|---|---|---|---|---|
| Module (chapter) quizzes | 158 | `GET /quiz/questions/:courseId/:week` (`routes/quiz.ts:37`) | `Quiz.tsx` via `useQuiz` | ✅ **LIVE** |
| Topic quizzes | 260 | `GET /quiz/questions/topic/:topicId` (`routes/quiz.ts:18`) | `Quiz.tsx` | ✅ **LIVE** (randomization no-op) |
| Final exam | 15 | **none** — zero refs to `FinalExamQuestion` in `backend/src` and `frontend/src` (grep, 2026-08-14) | none | 🔴 **DEAD CONTENT** |
| Interactive coding challenges | 0 for C (11 total across WebDesign/Python/SQL) | `routes/challenge.ts` exists | **none** — only `About.tsx` marketing copy | 🔴 **UI-ORPHANED** (and no C seeds) |
| Practice arena | `PracticeQuestion` (5 rows, shared, not C-scoped) | `routes/practice.ts` | `PracticeArena.tsx` | ✅ **LIVE** but effectively empty (5 questions total) |
| Assignment/project submission | no content-defined briefs | `routes/assignment.ts`, `routes/project.ts` | Dashboard/CourseDetail | ⚠️ **LIVE as envelopes**, no curriculum binding |

**`[CONFIRMED]`:** the C course's final exam is confirmed dead content (this tree). The interactive challenge engine — the platform's only application-level auto-graded assessment — is UI-orphaned and, for the C course specifically, has **zero seeded challenges** anyway, so wiring it would require adding C challenge content first. Topic-quiz "randomization" is a no-op (`slice(0,5)` on 4-question banks, `quizService.ts:336-338`).

---

## 22. Scope/Identity Audit

- **Title (DB):** "C & Systems Programming for Hardware" — the content delivers a **general C fundamentals** course with a systems/embedded *flavor* (register bit ops, buffer safety, manual memory), **not** hardware/register-level programming per se. No MCU-specific programming, no datasheets, no register maps, no bare-metal C. The "for Hardware" is aspirational/positioning rather than descriptive of hands-on hardware content. `[CONFIRMED]` (P2 scope framing).
- **Description (DB):** "…procedural programming, memory allocations, and register masking" — accurate but under-inclusive (omits pointers, data structures, file I/O, algorithms, capstone). `[CONFIRMED]`
- **Internal branding overclaim:** "Deep GfG-Style Curriculum" header (`c.ts:2`) vs median ~145-word lessons and 2–4 topics/week → **overstates depth** (P2). The "Deep" claim is further undercut by missing function pointers, trees, and multi-file builds (§5).
- **No scope drift within taught content:** what is taught is taught well and coherently; the identity issue is *branding vs. actual depth*, not a wrong-discipline problem (contrast CADD Civil's identity failure). `[CONFIRMED]`

---

## 23. Scorecard + Confidence

Independent scoring (0–100, no inflation, no inheritance from the prior 67.25).

| Dimension | Max | Score | Key evidence |
|---|---|---|---|
| 1. Curriculum Architecture | 10 | 6.5 | Coherent 20-week climb; sparse weeks (avg 3.3, W18=2), header overclaims 4–5; no prerequisites; missing function pointers/trees |
| 2. Learning Objectives | 10 | 2.0 | No explicit objectives anywhere; descriptions are coverage statements; W20 checklist is the only de-facto outcome |
| 3. Content Quality | 15 | 10.0 | Precise, pitfall-rich, code-first prose; but median ~145 words — shallow for recursion/call-stack/sorts ("Deep" overclaim) |
| 4. Technical Accuracy | 15 | 11.5 | Verified sound & current on ~250 claims; 1 wrong final key (P1), 1 ambiguous gate key (P1), %f/%lf inverted (P2), malloc(0) over-asserted (P3), minor imprecisions (P3) |
| 5. Practical Learning | 10 | 5.5 | 65/65 code, safety discipline, gdb/ASan; **no graded exercises, no assessed project** |
| 6. Assessment Quality | 10 | 5.5 | 418 items, clean distractors, aligned; no explanations, no randomization, recall-dominated; final omits 7/20 weeks |
| 7. Question Quality | 5 | 3.5 | 418 distinct, well-formed; 2 defective items (final Q8 wrong key; toggle ambiguity) |
| 8. LO Alignment | 5 | 2.5 | Implicit alignment strong for quizzes; no formal map; final exam gap (7 weeks) and 2 contradict-content items |
| 9. Difficulty Progression | 5 | 3.0 | Intra-course ramp is sound; cognitive ceiling low (recall/apply, minimal analyze/evaluate); "industrial/advanced" claims exceed assessment depth |
| 10. Industry Relevance | 5 | 4.0 | Strong embedded/systems frame, current tooling, no retired tech; "for Hardware" framing over-claims |
| 11. Project Quality | 5 | 1.5 | Capstone = design advice + ideas + skeleton; no deliverable spec, no rubric, unassessed |
| 12. Feedback/Learning Support | 5 | 2.0 | No question explanations; right/wrong only; notes are pre-study aids; no remediation |
| **Total** | **100** | **58.0** | |

**Confidence: MEDIUM.** Basis: full read of all three pipeline files (100% of `c.ts` 2,182 lines, 100% of `c_topic_quizzes.ts` 447 lines, all of `reseed_c_full.ts`), full DB verification of counts and sampled rows, independent compile probe for TA-1, and independent route/frontend grep for reachability. **Limits:** the final exam is unserved so its severity is assessed as an artifact; no live student exercise data exists to validate difficulty; some infrastructure findings (P0 quiz-forgery, XP dead-code) are from `content-source-audit.md`/`assessment-systems-audit.md` and were re-verified at the route/service level but not live-tested.

**Comparison to the prior 67.25:** I agree with the prior audit on *substance* (the two assessment defects, thin lessons, no LO layer, no graded practice) and cite my own evidence for each. I score **lower (58)** because this rubric assigns more weight to the dimensions the course is structurally weakest in (Learning Objectives 10, Feedback 5, Project 5, Question Quality 5, Difficulty 5) and less to its strengths. If the LO layer, a graded capstone rubric, and question explanations were added, the same content would plausibly reach ~70-75.

---

## 24. P0/P1/P2/P3 Issue Register

| ID | Severity | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| C-A1 | **P0** (latent) | infra `routes/quiz.ts:49`, `quizService.ts:28-67` | Quiz grading forgeable: question IDs unscoped, denominator = submitted rows (single-question pass possible) | `quizService.ts:37,48-67`; `content-source-audit.md` §22 P0-2 | Progress/certificates can be gamed | Scope grading to course/week/topic; use server-side denominator |
| C-A2 | **P0** (latent) | infra `routes/course.ts:35`, `routes/quiz.ts:13,30,49` | Paid lesson + quiz content served to any authenticated user (no enrollment/payment gate) | `content-source-audit.md` §22 P0-1 | Paywall is cosmetic | Enforce entitlement server-side |
| C-A3 | **P0** (latent) | infra `quizService.ts:69-89` | Quiz XP/badge award is unreachable dead code (guard always matches the just-created QuizResult) | `quizService.ts:69-89`; `content-source-audit.md` §22 P0-3 | Points/leaderboards undercount; gamification broken | Move already-passed check before result creation (mirror daily-challenge atomic guard) |
| C-1 | **P1** | `c.ts:2122-2129`; DB `FinalExamQuestion` id **473** | Final-exam Q8 keyed "struct A larger" — both are 4 bytes (compile probe) | DB id 473; probe `sizeof(struct A)=4, sizeof(union B)=4`; `c.ts:1377` | Wrong answer on a certification item; teaches false fact (becomes P0 if exam wired) | Re-key to "They are always equal" or rewrite so sizes differ; reseed |
| C-2 | **P1** | `c_topic_quizzes.ts:92`; DB `QuizQuestion` id **8980** | Bitwise-toggle item keys `~`; lesson teaches `^` as the toggle idiom | `c.ts:273`; DB id 8980 | Ambiguous gate item; penalizes students using the taught idiom | Align key with lesson or re-word stem; reseed |
| C-3 | **P1** | whole course | No learning-objective layer; no objectives→assessment map | topic model `c.ts:12-17`; `schema.prisma` | LO/LO-Alignment criteria capped; alignment unverifiable | Add per-topic objectives + map (Wave 3, catalog-wide) |
| C-4 | **P1** | whole course | No graded practical track; capstone unassessed; project/assignment submission has no content briefs/rubrics | `c.ts:1954-1958`; `routes/project.ts:38-91` | Practical Learning capped; capstone has no portfolio value | Content build (Wave 4): briefs + rubrics + assessed deliverables |
| C-5 | **P1** | infra `FinalExamQuestion` | C final exam (15 Qs) is dead content — no route, no UI | grep: 0 refs in `backend/src`, `frontend/src`; `schema.prisma:302-313` | Summative assessment absent; exam questions unvalidated | Route-or-remove decision (§5 wave1-spec); if wired, validate all 15 first |
| C-6 | **P1** | infra `routes/project.ts:49-55`, `routes/assignment.ts:49` | Hardcoded 20-module / `week*5` gates contradict dynamic module count (issue #70) | `routes/project.ts:49-55`; `routes/assignment.ts:49` | Latent break for any ≠20-module course | Share the dynamic module-count helper |
| C-7 | **P2** | `c.ts:337-339`; DB id **9002** | `%f`/`%lf` printf distinction taught backwards (scanf rule applied to printf) | `c.ts:337-339`; DB id 9002 | Wrong I/O mental model | Correct the lesson; keep scanf-side note |
| C-8 | **P2** | `c.ts:663-667`, `c.ts:763-767`, `c.ts:1883-1887` | Call Stack, Recursion, Merge/Quick sort taught at summary level (~130-150 words) | full read | Complex topics under-taught vs "Deep" branding | Add worked traces/second examples |
| C-9 | **P2** | final exam coverage | 7/20 weeks absent from final exam (W2,W4,W5,W6,W7,W8,W20) | DB final list; §10 | "Certification Prep" unsupported | Add items sampling those weeks (or cut the promise) |
| C-10 | **P2** | `schema.prisma:137-151` | `QuizQuestion` has no explanation field → no feedback on 418 C questions | `schema.prisma:137-151`; `quizService.ts:54-64` | Score-without-learning | Add explanation field + content + UI (Wave 2) |
| C-11 | **P2** | `quizService.ts:336-338` | Topic-quiz "randomization" is a no-op (`slice(0,5)` on 4-question banks); no option shuffle anywhere | `quizService.ts:336-338,17-19` | Pattern-learning on retakes; false "randomized" claim | Real draw (bank ≥6) or document "serve all 4"; shuffle options |
| C-12 | **P2** | scope/branding | "C & Systems Programming for Hardware" + "Deep GfG-Style" over-claim actual depth (general C fundamentals, no hardware register programming) | `c.ts:2`; DB title; `c.ts:4` | Learner expectations mismatch | Re-scope title/description honestly or add hardware depth |
| C-13 | **P2** | content gaps | Function pointers/callbacks and binary search trees absent; bit-fields/volatile/endianness/padding only quiz-mentions | full read | "Deep" promise unmet; common C exam topics missing | Add function pointers + BST topics (Wave 5) |
| C-14 | **P2** | `reseed_c_full.ts:79-114` | Reseed deletes-and-recreates topics + questions, cascade-wiping `TopicProgress` and any admin edits | `reseed_c_full.ts:79-114`; `schema.prisma:130` | Silent per-topic progress loss; CMS edits discarded | Preserve-guard or document (infra P1-3 from source audit) |
| C-15 | **P3** | `c.ts:46`, `c.ts:456`, `c.ts:155` | Minor imprecisions: "Rust's precursor"; switch-case declaration muddle; C90 keyword taxonomy vs C23 claim | `c.ts:46,456,155` | Low | Tidy wording; add C23 keyword note |
| C-16 | **P3** | `c.ts:1971` | W20 hand-trace code block has stray `\"` typo (won't compile as shown) | `c.ts:1971` | Copy-paste example broken | Fix format string |
| C-17 | **P3** | `c.ts:4` | Header claims "4–5 deep sub-topics" per section; actual 2–4 | `c.ts:4` vs DB counts | Design-intent metadata mismatch | Correct header comment |
| C-18 | **P3** | `c.ts:2112-2119`; DB id **472** | `malloc(0)` final answer over-asserts glibc behavior as universal (implementation-defined) | DB id 472; C11 7.22.3 | Borderline over-assertion | Hedge or drop item |
| C-19 | **P3** | `reseed_c_beginner.ts` | Superseded beginner reseed file unwired (holds older curriculum) | `content-source-audit.md` §18 | Maintenance hazard | Remove or clearly mark deprecated |
| C-20 | **P3** | DB description / `config/courses.ts` | Course description + frontend title/module metadata drift from DB/reseed | §2 | Catalog copy inconsistency | Reconcile metadata sources |

---

## 25. Recommended Improvement Opportunities

1. **Fix the two P1 assessment defects first (lowest effort, highest certainty):** re-key final-exam Q8 (DB id 473) and resolve the toggle item (DB id 8980) against the lesson idiom; then re-run `reseed_c_full.ts`. `[RECOMMENDATION]`
2. **Decide the final exam's fate:** wire it (validating all 15 items first, since Q8 proves keys can be wrong) or remove it as an assessment concept (wave1 §5 recommends deprecate, reusing the challenge engine for a real summative). `[RECOMMENDATION]`
3. **Deepen the three thin high-stakes topics** (Call Stack W7T3, Recursion W8T2, Merge/Quick W19T2) with worked traces and a second example each. `[RECOMMENDATION]`
4. **Close the final-exam coverage gap** by adding items from the 7 omitted weeks, or trim the "Certification Prep" promise. `[RECOMMENDATION]`
5. **Add the high-leverage missing topics** — function pointers (with a `qsort` comparator hook) and a binary-search-tree topic — to honor the "Deep GfG-Style" claim. `[RECOMMENDATION]`
6. **Build a graded practical layer** (Wave 4): per-week exercises and a defined capstone deliverable with a rubric, wired to the existing Assignment/Project submission system; make the hardcoded 20-module gates dynamic first. `[RECOMMENDATION]`
7. **Add an `explanation` field to `QuizQuestion`** and surface it post-submit (Wave 2) — the single highest-leverage feedback fix for all 418 C questions. `[RECOMMENDATION]`
8. **Add an explicit per-topic learning-objective field** and map quizzes/final/capstone to objectives (Wave 3, catalog-wide). `[RECOMMENDATION]`
9. **Re-scope the course identity honestly** (title/description) to match actual depth, or add the promised hardware/register-level depth. `[RECOMMENDATION]`
10. **Tidy the P3 items:** Rust precursor line, switch-case sentence, C23 keyword note, W20 typo, header claim, `malloc(0)` hedge, and reconcile the metadata duplication. `[RECOMMENDATION]`

---

## 26. Unknowns / Missing Evidence

- `[UNKNOWN — NOT VERIFIED]` **Live deployment parity:** this audit ran against local `master` + the local `nexus` DB. Per `MEMORY.md`, the live site runs GitHub `main` (4+ commits ahead). Final-exam reachability and gate code are confirmed against this tree; live parity is unverified.
- `[UNKNOWN — NOT VERIFIED]` **Admin CMS drift:** whether live admin edits have modified C topics/quizzes beyond the content files (a reseed would have destroyed them, but no reseed event is timestamped here).
- `[UNKNOWN — NOT VERIFIED]` **External technical checks:** SolidWorks `swMateType_e` enum values are cited in the CADD Mech audit, not the C course; not needed for C. C-specific: none outstanding beyond the compile probe for TA-1.
- `[UNKNOWN — NOT VERIFIED]` **Student difficulty data:** no live attempt/score data exists to validate the difficulty curve or the "thin lesson" judgment empirically.
- `[INFERRED]` **Cross-course duplication = 0** (from master-report §18; the local DB check only covered within-course distinctness).

---

## 27. Final Verdict

**58/100 — Weak-to-Major-Revamp boundary (independent; prior 67.25 not inherited).** The Core C course is **structurally sound, accurate, and well-written** where content exists — the prose, code examples, pitfall teaching, and systems/embedded framing are above catalog average, and the assessment bank is large, original, and largely well-formed. It is held back by **catalog-uniform structural gaps** (no learning objectives, no graded practice, no feedback/explanations, dead final exam) and by **two confirmed assessment defects** (a factually wrong final-exam key and a self-contradicting topic-gate key). The "Deep" and "for Hardware" branding materially overstate the actual depth (median ~145-word lessons; general C, not register-level hardware programming).

**Independent validation note:** I re-verified every load-bearing claim against the DB and files and agree with the prior audit's substance (citing my own evidence for the two assessment defects, lesson thinness, no-LO, no-graded-practice, and final-exam coverage gap). I explicitly **disagree** with any reading that the course is near-70: on this rubric (which weights the structurally-absent layers more heavily), 58 is the honest score. The path to ~75 is concrete and mostly content-side: fix the two keys, add LOs + explanations + a graded capstone rubric, deepen three topics, and close the final-exam gap.

---

## Improvement Candidates — NOT YET APPROVED

Next phase decides **KEEP / FIX / REWRITE / RESTRUCTURE / REMOVE / ADD / MODERNIZE / DEPRECATE** for each. None implemented.

| Candidate | Current state | Suggested disposition |
|---|---|---|
| Final-exam Q8 (DB id 473) | Wrong key | **FIX** (re-key to "They are always equal" or rewrite so sizes differ) |
| Toggle topic quiz (DB id 8980) | Ambiguous, contradicts lesson | **FIX** (align key with `^`-toggle idiom or re-word stem) |
| `%f`/`%lf` printf lesson + quiz | Inverted guidance | **FIX** (correct lesson; quiz answer is defensible but clarify) |
| W7T3 Call Stack / W8T2 Recursion / W19T2 Merge-Quick | Summary-level | **REWRITE/ADD** (worked traces + second example) |
| Final exam as an assessment | Dead content, 7-week coverage gap | **DECISION**: DEPRECATE (recommended) or wire-with-validation |
| Learning-objective layer | Absent | **ADD** (Wave 3, catalog-wide) |
| `QuizQuestion.explanation` | Absent | **ADD** (schema + content + UI, Wave 2) |
| Graded practical track + capstone rubric | Absent/unassessed | **ADD/RESTRUCTURE** (Wave 4) |
| Function pointers / BST topics | Absent | **ADD** (Wave 5) |
| Course title/description "for Hardware"/"Deep" | Over-claims | **RESTRUCTURE** (re-scope honestly or add depth) |
| W20 code-block typo (`\n\"`) | Broken example | **FIX** |
| Header "4–5 sub-topics" claim | Wrong (2–4) | **FIX** |
| `reseed_c_beginner.ts` | Superseded/unwired | **DEPRECATE/REMOVE** |
| DB course description vs reseed description | Drift | **FIX** (reconcile) |
| Frontend `config/courses.ts` / `Home.tsx` C metadata | Drift from DB | **FIX** (single-source metadata) |
| Quiz randomization no-op / no option shuffle | False "random" | **FIX** (real draw + shuffle, infra) |
| Hardcoded 20-module / `week*5` gates | Latent break | **FIX** (dynamic module count, infra) |
| `malloc(0)` final answer | Over-asserted | **FIX** (hedge) |
| Keyword taxonomy currency (C90 vs C23) | Slightly dated | **MODERNIZE** (add C23 note) |

---

*Audit complete. Read-only; no content, seed, schema, or code was modified. The only file written is this report. All fixes are recommendations pending owner approval.*

# EduNexus Pro — Deep Content Audit · C++ & OOP for Embedded Systems

**Auditor role:** Lead Curriculum Quality Auditor (C++) — independent deep-scan audit
**Date:** 2026-08-14
**Scope:** AUDIT-ONLY. Read-only inspection of DB + content pipeline files + platform code + prior audits. No content, seed file, DB record, source code, or schema was modified. One new report file written.
**Evidence labels:** [CONFIRMED] directly verified (DB query / file:line) · [INFERRED] strong conclusion from multiple confirmed pieces · [UNKNOWN — NOT VERIFIED] cannot verify · [RECOMMENDATION] suggestion only.
**Severity:** P0 critical / P1 high / P2 medium / P3 low.

**Sources of truth (priority order):**
1. **Database** — local Postgres `nexus`, via `/tmp/nexus-psql.sh` (read-only).
2. **Content pipeline files** — `backend/prisma/content/cpp.ts`, `backend/prisma/content/cpp_topic_quizzes.ts`, `backend/prisma/reseed_cpp_full.ts`.
3. **Contextual evidence** — `docs/content-quality-audit-cpp.md`, `docs/assessment-systems-audit.md`, `docs/content-quality-audit-master-report.md`, `docs/wave1-decision-spec.md`, `docs/content-source-audit.md`. All prior claims re-verified against DB/content, never inherited.

---

## 1. Executive Summary

The C++ course is structurally the best-organised content in the catalog: a coherent 20-week pedagogical climb from "why C++" to a bare-metal capstone, 80/80 topics with original prose + working code + a 1-line note, 480 MCQ assessments with clean uniqueness, and no harmful duplication. Content prose is consistently accurate and well-taught.

However, the course is a **content island with an incomplete learning system**:

- **No learning-objective layer exists** — nothing states "by the end of this topic you can…", and no objectives→assessment map is possible. (P1)
- **The 18-question final exam is dead content** — no route or UI ever serves it (zero refs in `backend/src` and `frontend/src`), and it omits the embedded weeks that define the course identity (W2, W13, W18, W20 absent). (P1)
- **No graded practical work** — practice = pass/fail MCQs only; 0 interactive challenges seeded for C++; the strong W20 capstone is described, not assessed. (P1)
- **No feedback** — `QuizQuestion` has no explanation field; grading is exact-string match; students get right/wrong with no "why". (P1)
- **Assessment integrity defects** — one module-quiz question (DB id 11920) has multiple valid answers; one topic-quiz stem is garbled (DB id 11793). (P1/P2)
- **Technical accuracy is high but not perfect** — `std::ranges::fold_left` is labelled C++20 but is C++23; `std::cout` appears in a bare-metal placement-new snippet; register addresses lack datasheet attribution.

**Independent score: 61/100 (Weak-ish).** The prior audit scored 72/100 under a different 5-point weighted rubric; the difference is concentrated in dimensions this audit weights more heavily (Feedback 1/5, Learning Objectives 1.5/10, Practical Learning 5/10) — verified independently, not inherited.

---

## 2. Course Metadata (DB-sourced)

| Field | Value | Source |
|---|---|---|
| id | `C++` | DB `Course` |
| title | `C++ & OOP for Embedded Systems` | DB |
| description | `Migrate to object-oriented paradigms, generic templates, and RAII guidelines.` | DB `Course` |
| price | `699` | DB |
| isPublished | `true` | DB |
| Module count | 20 | DB |
| Topic count | 80 | DB |
| Topic-quiz questions | 320 | DB |
| Module-quiz questions | 160 | DB |
| Final-exam questions | 18 | DB |
| Challenges | 0 | DB |

**DB-vs-file discrepancy (metadata):** [CONFIRMED] The DB description (`Migrate to object-oriented paradigms…`) comes from `backend/prisma/seed.ts:27` and does **not** match the reseed script's intended description (`Architect high-performance OOP software structures, customized template classes, memory-mapped placement new, and low-overhead collections — with 20 deep sections and hands-on quizzes.`, `reseed_cpp_full.ts:40-42`). The reseed only sets the description on CREATE; since the course already existed, the legacy description persists. The DB is the live source of truth; the reseed file's create-branch is dead text.

---

## 3. Content Inventory

**Verification result: inventory matches the stated baseline exactly (20/80/320/160/18/0).**

DB queries (all `courseId='C++'`):
- Module: **20** [CONFIRMED]
- Topic: **80** (exactly 4 per module, `order` 0–3) [CONFIRMED]
- Topic-quiz questions: **320** (16/module = 4 topics × 4; DB per-week query confirms 16 topic + 8 module every week) [CONFIRMED]
- Module-quiz questions: **160** (8/module, `topicId IS NULL`) [CONFIRMED]
- Final-exam questions: **18** [CONFIRMED]
- Challenge: **0** [CONFIRMED] (catalog: WebDesign 6, Python 3, SQL 2)

| Entity | Count | Notes |
|---|---|---|
| Modules (weeks) | 20 | titles in §4 |
| Topics | 80 | 100% have `text`, `code`, `note` |
| Topic-quiz questions | 320 | exactly 4/topic |
| Module-quiz questions | 160 | exactly 8/week |
| Quiz questions total | 480 | no within-course text duplicates [CONFIRMED, DB GROUP BY] |
| Final-exam questions | 18 | dead content (§21) |
| Challenges | 0 | no interactive exercises |
| Practice questions (course-related) | 1 | global `PracticeQuestion` table has 5 rows; 1 tagged `C++ OOP` ("In C++, which keyword is used to allocate memory on the heap?") |

Topic text length (DB `LENGTH(text)`): grows from **~1,334 chars/week (W1)** to **~2,266 chars/week (W20)** — later weeks are ~1.7× denser (§4, §18).

---

## 4. Curriculum Structure

Sequence (all 20 weeks, DB + `cpp.ts`):

1 Introduction & Compilation Model → 2 C++ vs C, Namespaces, Syntax → 3 Variables, Data Types, Const/Constexpr → 4 Operators & Expressions → 5 Input/Output (iostream) → 6 Conditionals & Switch → 7 Loops → 8 Functions → 9 Arrays & std::array → 10 Strings → 11 Classes & Access Specifiers → 12 Constructors, Destructors & RAII → 13 Inheritance & Composition → 14 Polymorphism & Virtual Functions → 15 Operator Overloading & Friend → 16 Templates & Generic Programming → 17 STL Containers & Iterators → 18 STL Algorithms & Smart Pointers → 19 Move Semantics & Modern C++ → 20 Embedded C++ Project & Final Review.

**Architecture verdict:** [CONFIRMED] A legitimate pedagogical climb — types → control flow → functions → data structures → classes → RAII → OOP relationships → polymorphism → operators → templates → STL → modern idioms → bare-metal capstone. No orphan topics; every topic gated by an exactly-4-question topic quiz (all 80 topics have quizzes, DB `topics_with_q=4` for every week). Prerequisites are satisfied: no topic requires knowledge taught later, and advance organizers are rare and acceptable (e.g., W2 introduces RAII nominally; full treatment is W12).

**Structural gaps:**
- No topic on **preprocessor & header guards** (`#pragma once`, include guards, macro hygiene) despite teaching the header-only template rule. [CONFIRMED, absent from 80 topic titles]
- No topic on **testing/debugging** (unit tests, asserts, gdb, sanitizers) — only a W20 checklist line.
- No topic on **concurrency** (`std::thread`, atomics, mutex).
- No topic on **exceptions as a feature** (try/catch, exception guarantees) — taught only as "avoid on MCU".
- No topic on **ISR-safe C++ / interrupts**, despite the capstone implying them.
- **Module balance:** lesson length nearly doubles W1→W20; the hardest weeks (14–19: vtables, templates, move semantics) are also the longest, a cognitive-load concern for a self-paced platform.

---

## 5. Module-by-Module Analysis

See MODULE SCORECARD (end of §23). Highlights per module:

- **W1** (Introduction & Compilation): Excellent foundation. The 4-stage pipeline with command-per-stage mnemonics is exemplary. Code is correct. Quizzes aligned.
- **W2** (C++ vs C, Namespaces, Syntax): Strong. The FILE*/ifstream contrast and namespace-alias examples are clean. RAII mention is a valid advance organizer.
- **W3** (Types, Const/Constexpr, auto): Strong; fixed-width types, signed/unsigned trap, brace-init narrowing all taught honestly. *Contains defective quiz stem 11793.*
- **W4** (Operators): Strong; bitwise register idioms are embedded-relevant. `1 << 2 + 3` trap taught correctly.
- **W5** (I/O): Strong; fail-state recovery and `getline`+`ignore` pattern are exactly right.
- **W6** (Conditionals): Strong; dangling-else and `if (x=5)` taught.
- **W7** (Loops): Strong; `continue`-skips-increment trap in `while` is a genuine deep-teaching moment.
- **W8** (Functions): Good; pass-by-value/ref/const-ref decision rules correct. *Contains defective module-quiz question 11920.*
- **W9** (Arrays & std::array): Strong; decay, bounds, `.at()`, `[begin,end)` all taught.
- **W10** (Strings): Strong; `npos`, `stoi` partial-parse, `string_view` all current and correct.
- **W11** (Classes): Strong; invariants-via-private, `this`, chaining.
- **W12** (RAII, Rule of Three/Five): Strongest week; copy-and-swap, `=delete`, exception-safety framing all correct.
- **W13** (Inheritance & Composition): Strong; diamond problem, virtual inheritance costs, "prefer composition".
- **W14** (Polymorphism & vtables): Strong; vptr/vtable mechanics, virtual destructor rule, honest cost accounting.
- **W15** (Operator Overloading & friend): Good; stream chaining, friendship non-transitivity.
- **W16** (Templates & Concepts): Good conceptually; **code snippet references an undeclared `to_string_safe` template** (P3, §8); `if constexpr`, `std::is_integral_v` correct.
- **W17** (STL Containers): Strong; complexity table and container-choice decision guide.
- **W18** (Algorithms & Smart Pointers): Good; **`std::ranges::fold_left` mislabelled C++20 (it is C++23)** (P2, §8); smart-pointer ownership rules correct.
- **W19** (Move Semantics & Modern C++): Good; forwarding references, `std::move` vs `std::forward` correct; W19 topic is reference-heavy.
- **W20** (Embedded Capstone): Good intent; **`std::cout` in the bare-metal placement-new snippet is a host/embedded context violation** (P2, §8); capstone rubric is strong prose but not wired to any submission system (§14).

---

## 6. Topic-by-Topic Findings

All 80 topics have `text` + `code` + `note` [CONFIRMED, DB count 4/4/4 per week]. No topic is a stub; no topic is missing its quiz. Notable per-topic findings:

| Week | Topic | Finding | Severity |
|---|---|---|---|
| 3 | auto & Type Deduction | Quiz stem garbled: "`auto v[0]` in `std::vector<int> v; auto x = v[0];` produces…" — leading fragment is broken text (DB 11793; `cpp_topic_quizzes.ts:93`) | P2 |
| 8 | Function Declaration & Definition | Module quiz "Which two functions can be overloaded?" has **multiple valid answers** (DB 11920; `cpp.ts:393`) | P1 |
| 16 | Template Specialization | Code references `to_string_safe<bool>` with no primary template shown; generic `ToString` struct example is unrelated — snippet is incomplete/misleading (`cpp.ts:737-738`) | P3 |
| 18 | No-Overhead Loops with Algorithms | `std::ranges::fold_left` presented as "Ranges (C++20)" but `fold_left` is a **C++23** addition (`cpp.ts:834`) | P2 |
| 20 | Placing Objects at Fixed Addresses | Placement-new demo uses hosted `std::cout` under the `-fno-exceptions`, no-OS, no-heap bare-metal doctrine (`cpp.ts:919`) | P2 |
| 20 | Bare-Metal C++ on a Microcontroller | Register address `0x40020C14` and UART `0x40011000/04` given with **no MCU/datasheet attribution** — unverifiable by students (`cpp.ts:906-913`) | P2/P3 |

All other topics verified clean on technical accuracy and teaching quality (representative sample; §8, §11).

---

## 7. Content Chunk Summaries (W{week}.T{order} <title>)

All 80 chunks summarized (aggregated at module level; per-chunk quality is uniformly strong unless noted).

**W1 Introduction to C++ & Compilation Model**
- W1.T0 Why C++ Still Powers the World — strong zero-cost-abstractions narrative; code correct.
- W1.T1 The Compilation Pipeline — excellent; per-stage CLI mnemonics; "undefined reference = linking" correct.
- W1.T2 Your First C++ Program & main() — correct on `main` signatures, `void main()` ban, semicolons.
- W1.T3 Setting Up a C++ Toolchain — CMake/clangd workflow current; "GCC 9+" minimum dated-but-safe (P3).

**W2 C++ vs C, Namespaces, Basic Syntax**
- W2.T0 C++ vs C — accurate addition list; RAII example correct.
- W2.T1 Namespaces & std — `namespace a::b` (C++17) and aliases correct; header-leak warning correct.
- W2.T2 Variables & Init Styles — brace-init narrowing, `int d{}`, `-Wshadow` all correct.
- W2.T3 Comments, Formatting & Syntax — correct; "comment the WHY" guidance good.

**W3 Variables, Data Types, Const/Constexpr**
- W3.T0 Fundamental Data Types — min-size ladder correct; `-1 < 0u` false; `char` signedness implementation-defined.
- W3.T1 Integer & Floating-Point — overflow UB, `-7%2 == -1`, epsilon comparison all correct.
- W3.T2 const/constexpr — correct; prefer both over `#define`.
- W3.T3 auto & Type Deduction — correct on copy vs `const auto&`; quiz stem garbled (P2).

**W4 Operators & Expressions**
- W4.T0 Arithmetic & Assignment — promotion, compound assignment, div-by-zero UB correct.
- W4.T1 Relational, Logical & Bitwise — `(reg>>4)&1u`, short-circuit, shift-UB correct.
- W4.T2 Increment/Decrement — `arr[i++]+arr[i++]` UB, prefix preference correct.
- W4.T3 Operator Precedence — `1<<2+3==32`, `x&1==0` traps correct.

**W5 Input/Output**
- W5.T0 cout/cin — fail state, `>>` whitespace behavior correct.
- W5.T1 Formatting — `setw` one-shot, `setprecision` significant-digits-without-fixed correct.
- W5.T2 Reading Input Safely — `getline`+`ignore`, `clear()`, range-checking correct.
- W5.T3 File Streams — `if(!in)`, modes, `ios::binary`, RAII close correct.

**W6 Conditional Statements & Switch**
- W6.T0 if/else — dangling-else, bracing, `if(x=5)` correct.
- W6.T1 Ternary & Short-Circuit — only chosen side evaluated; `cond ? "s" : 42` ill-formed correct.
- W6.T2 switch — fall-through, `[[fallthrough]]`, braces-in-case, jump-table claim correct.
- W6.T3 Common Conditional Bugs — big-five bug list accurate.

**W7 Loops**
- W7.T0 for — off-by-one, signed/unsigned, `for(;;)` correct.
- W7.T1 while — zero-or-more, termination discipline correct.
- W7.T2 do-while — trailing semicolon, scope-in-condition, macro idiom correct.
- W7.T3 break/continue — `continue`-in-`while` infinite-loop trap correct and well taught.

**W8 Functions**
- W8.T0 Declaration & Definition — ODR, signatures correct.
- W8.T1 Parameters — value/ref/const-ref decision rules correct.
- W8.T2 Default Arguments & Overloading — defaults-trailing, ambiguity correct. **Module quiz 11920 defective.**
- W8.T3 Return Values — dangling-return, `[[nodiscard]]`, static locals correct.

**W9 Arrays & std::array**
- W9.T0 C-Style Arrays — bounds, decay, compile-time size correct.
- W9.T1 Multidimensional — row-major, flat indexing correct.
- W9.T2 std::array — `.at()`, size-in-type, zero-overhead correct.
- W9.T3 Iterating & Passing — `[begin,end)`, pass-by-const-ref correct.

**W10 Strings**
- W10.T0 C-Strings vs std::string — null-terminator, `strncpy` non-termination correct.
- W10.T1 std::string Operations — `npos`, `find_first_of`, prepend O(n²) correct.
- W10.T2 String Conversion — `stoi` throws, `from_chars` exception-free correct.
- W10.T3 String Performance — `string_view` lifetime rule correct.

**W11 Classes & Objects**
- W11.T0 Defining Classes — class/struct default access correct.
- W11.T1 Access Specifiers — invariants-via-private correct.
- W11.T2 Member Functions & this — `this` pointer, chaining correct.
- W11.T3 Constructors Basics — initialiser list, implicit-default removal correct.

**W12 Constructors, Destructors & RAII**
- W12.T0 Init Lists — declaration-order init, delegating ctors correct.
- W12.T1 Destructors — reverse-declaration-order, no-throw correct.
- W12.T2 RAII — correct and well motivated.
- W12.T3 Copy Constructors & Rule of Three/Five — double-free, `=delete`, copy-and-swap correct.

**W13 Inheritance & Composition**
- W13.T0 Basic Inheritance — construction order correct.
- W13.T1 Access & Inheritance Modes — public/protected/private inheritance correct.
- W13.T2 Composition vs Inheritance — decision question correct.
- W13.T3 Virtual Inheritance & Diamond — two-copies-of-base, most-derived-init correct.

**W14 Polymorphism & Virtual Functions**
- W14.T0 Virtual Functions — dynamic dispatch, `override` correct.
- W14.T1 Virtual Destructors — delete-through-base leak correct.
- W14.T2 Abstract Classes — pure virtual, interface idiom correct.
- W14.T3 Vtables Under the Hood — vptr-per-object, vtable-per-class, cost accounting correct.

**W15 Operator Overloading & friend**
- W15.T0 Basics — member vs free, golden rules correct.
- W15.T1 Overloading << and >> — free-function requirement, chain-return correct.
- W15.T2 friend — granted-not-taken, non-transitive correct.
- W15.T3 ==, < and Others — strict weak ordering, `std::tie`, spaceship correct.

**W16 Templates & Generic Programming**
- W16.T0 Function Templates — deduction, header-only rule correct.
- W16.T1 Class Templates — non-type params, code bloat correct.
- W16.T2 Template Specialization — most-specialized-wins, `if constexpr` correct; **snippet references undeclared `to_string_safe`** (P3).
- W16.T3 Variadic & Concepts — fold expressions, concepts correct.

**W17 STL Containers & Iterators**
- W17.T0 vector/list/deque — complexity claims correct.
- W17.T1 map/set/unordered — `operator<` vs `std::hash<K>`, `operator[]` inserts correct.
- W17.T2 Iterators — categories, invalidation correct.
- W17.T3 Choosing the Right Container — decision table correct.

**W18 STL Algorithms & Smart Pointers**
- W18.T0 The <algorithm> Toolbox — `nth_element` O(n), stable_sort correct.
- W18.T1 Lambda Expressions — captures, `std::function` cost correct.
- W18.T2 unique/shared/weak_ptr — ownership rules correct.
- W18.T3 No-Overhead Loops — inlining claim correct; **`std::ranges::fold_left` is C++23, labelled C++20** (P2).

**W19 Move Semantics & Modern C++**
- W19.T0 Lvalues/Rvalues & std::move — correct.
- W19.T1 Move Constructors — steal-and-disarm, `noexcept` correct.
- W19.T2 Perfect Forwarding — `T&&`+`std::forward` correct.
- W19.T3 Modern C++ Features to Use Daily — reference-like catalog; all feature/standard claims correct.

**W20 Embedded C++ Project & Final Review**
- W20.T0 Bare-Metal C++ — toolchain/startup correct; magic addresses un-attributed (P2/P3).
- W20.T1 Memory-Mapped I/O & volatile — correct; `volatile`-not-a-lock emphasized.
- W20.T2 Placement New — rules correct; **snippet uses hosted `std::cout`** (P2).
- W20.T3 Final Project & Certification Review — strong 7-point rubric; **described, not assessed** (P1, §14).

---

## 8. Technical Accuracy Findings

Independently verified correct claims (representative, all [CONFIRMED] via code read + DB text/quiz sample):
- Forwarding references `T&&` deduced → `T&`/`T&&`; `std::forward` casts to rvalue only when deduced as such.
- `if constexpr` discards un-taken branch at compile time.
- `std::from_chars` is exception-free and locale-independent.
- Guaranteed copy elision (C++17) for returning locals.
- `.at()` throws `std::out_of_range` on missing map key.
- `-1 < 0u` is false (signed→unsigned conversion).
- `-7 % 2 == -1` (truncation toward zero).
- Brace-init refuses narrowing.
- `strncpy` can silently omit the null terminator.
- Vector reallocation invalidates all iterators.
- `std::unordered_map` requires `std::hash<K>`; `std::map` requires `operator<`.
- Virtual call from a constructor dispatches to the base version.
- Throw from a destructor during unwinding → `std::terminate`.
- Members initialise in declaration order; destroyed in reverse.
- `volatile` is not a concurrency lock.
- `1 << 2 + 3 == 32`; `x & 1 == 0` parses as `x & (1==0)`.
- `std::to_string(3.14)` == `"3.140000"`; `std::stoi("123abc",&pos)` → 123, pos=3.
- `std::hex << std::showbase << 255` prints `0xff`.
- `std::ranges::fold_left` is **not** one of them (see TA-1).

**Technical accuracy defects:**

| ID | Location | Claim / Issue | Why suspicious | Evidence | Severity | Correction DIRECTION |
|---|---|---|---|---|---|---|
| TA-1 | `cpp.ts:834` (W18.T3), DB topic text | `std::ranges::fold_left(v \| std::views::transform(...), 0L)` presented as "Ranges (C++20)" | `std::ranges::fold_left` was added in **C++23** (P2322R6), not C++20. In C++20 the correct spelling is `std::accumulate` over a range, or a manual loop. Students compiling with `-std=c++20` will fail. | DB text contains "Ranges (C++20)" + `fold_left`; standard history | P2 | Change to a C++20-valid expression (e.g., `std::accumulate` over `v | std::views::transform(...)`) or relabel the snippet as C++23 |
| TA-2 | `cpp.ts:919` (W20.T2), DB topic code | Placement-new demo uses `std::cout << *a << ...` | Week's own doctrine is `-fno-exceptions -fno-rtti`, no heap, no OS (`cpp.ts:906-908`); `std::cout` is a hosted-stream construct typically absent on freestanding MCU toolchains. Internally inconsistent with the bare-metal topic. | DB `Topic.code` for W20.T2; prior audit E-1 | P2 | Replace `std::cout` with a `volatile` register write or a comment; keep the placement-new mechanics |
| TA-3 | `cpp_topic_quizzes.ts:93`, DB id 11793 (W3.T3) | Quiz stem: "`auto v[0]` in `std::vector<int> v; auto x = v[0];` produces…" | Leading "`auto v[0]` in" is leftover/garbled text; the intended question is about `auto x = v[0]` copying. | DB row 11793; prior audit E-2 | P2 | Rewrite stem to "In `std::vector<int> v; auto x = v[0];`, what is x?" |
| TA-4 | `cpp.ts:906-913` (W20.T0/T1) | Register addresses `0x40020C14` (LED), `0x40011000/04` (UART) with no MCU/datasheet | No target MCU, reference manual, or pin/bit map is ever identified; students cannot verify or generalise. Values are plausible STM32F4-style but un-attributed. | `cpp.ts` + DB; prior audit E-3 | P2/P3 | Name the MCU (e.g., STM32F4) + reference manual, or convert examples to a named register-map header |
| TA-5 | `cpp.ts:737-738` (W16.T2), DB topic code | Specialization example shows `template <> std::string to_string_safe<bool>(bool b)` but no primary `to_string_safe` template was ever declared (the only prior code is a `ToString` struct) | Snippet is incomplete; a reader cannot reproduce it. | DB `Topic.code` W16.T2 | P3 | Add the primary template declaration, or replace with a self-contained specialization example |
| TA-6 | `cpp.ts:69` (W1.T3) | "you want GCC 9+ so you can use C++17 features" | GCC 8+ already implements essentially all of C++17; GCC 9 is a safe-but-old minimum. Dated recommendation, not wrong. | `cpp.ts:69`; prior audit K | P3 | Bump to "GCC 11+ (or Clang 14+) for C++17/20" |
| TA-7 | Prior audit `content-quality-audit-cpp.md` §E-3 | Claims `0x40020C14` = "GPIOB ODR" | On STM32F4, GPIOB base = 0x40020400; 0x40020C00 is **GPIOD**. 0x40020C14 = GPIOD ODR (offset 0x14). The prior doc's chip attribution appears inaccurate. Since no MCU is identified in content, this stays UNKNOWN. | STM32F4 RM0090 register map (external knowledge) | P3 | Either attribute correctly or drop the specific chip claim |
| TA-8 | `cpp.ts:141` (W3.T0) | "bool … must be 1 byte minimum" | `sizeof(bool)` is implementation-defined by the standard; 1 is the universal practice but not mandated. Slight overstatement. | C++ standard | P3 | Say "typically 1 byte; implementation-defined" |
| TA-9 | `cpp.ts:165` (W3 chapter quiz) | Distractor `int8` | `int8` is not a real C++ type (`int8_t` is). Harmless as a distractor but sloppy. | DB quiz options | P3 | Use `int8_t` or remove |

---

## 9. Learning Objective Audit

[CONFIRMED — structural P1] **No learning-objective layer exists.**
- `CppTopic` exposes only `{title, text, code, note}` (`cpp.ts:12-17`); `CppSection` exposes `{week, title, description, topics, quizzes}` (`cpp.ts:25-31`).
- DB `Topic` model has no objective field; module `description` is a 1-line intent statement, not a measurable objective.
- No "By the end of this topic you will be able to…" text anywhere in the 80 topics.
- No Bloom's taxonomy tags; no objectives→assessment mapping table.
- Consequences: the LO→assessment alignment is implicit only; the "objectives not taught / taught-but-no-objective" audit cannot be performed formally. The course advertises skills (title/description) that have no declarative objectives.

Severity: P1 (catalog-wide authoring convention, but caps the Learning-Objectives and LO-Alignment criteria).

---

## 10. LO→Content→Practice→Assessment Matrix

Because no learning objectives are declared, the formal matrix cannot be built. Using the *de facto* implicit objectives (what each module teaches), the mapping is:

| Category | Count (topics) | Notes |
|---|---|---|
| A taught + practiced + assessed | 0 | No graded practice layer exists anywhere |
| B taught, not practiced | 80/80 | All topics are taught and quiz-assessed, but none have graded coding practice — every topic lands here for the "practice" leg |
| C taught, not assessed | ~0 | Every topic has a topic quiz; the W20 capstone is taught but not assessed |
| D assessed, under-taught | 0 | Quizzes test content explicitly taught in the same week (verified W1–W20 samples) |
| E assessed, outside objectives | 0 | No question expects un-taught material [CONFIRMED, sampled] |
| F missing entirely | 4+ | Preprocessor/header guards; testing/debugging; concurrency; exceptions-as-feature; ISR-safe C++ (all absent from content and assessments) |

Module-level: each week's 8 module-quiz + 16 topic-quiz questions map to that week's 4 topics (e.g., W1 pipeline quiz tests the 4 stages taught in W1.T1). The final exam samples 16/20 weeks; W2, W13, W18, W20 are unassessed by the exam (§11).

---

## 11. Assessment Audit

**Volume & format:** 480 quiz questions (320 topic + 160 module) + 18 final-exam. All 4-option, exactly 1 correct [CONFIRMED].

**Uniqueness:** [CONFIRMED] Within-course duplicate texts: 0 (DB GROUP BY). Topic-vs-module overlap: 0. Chapter-vs-topic overlap: 0 (`cpp_topic_quizzes.ts:9-11` honored).

**Alignment with lessons:** Strong — quizzes test content taught in the same week (verified samples across all 20 weeks). No out-of-scope questions found.

**Cognitive level:** Predominantly recall + comprehension; moderate application (predict-output, pick-the-operator, UB detection); minimal analysis/evaluation (no bug-hunting-from-a-snippet, no design/justify). Final exam is 18 recall/application one-liners.

**Final-exam coverage gap:** [CONFIRMED] The 18-question exam maps to W1,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12,W14,W15,W16,W17,W19. **Zero questions on W2 (namespaces), W13 (inheritance/composition), W18 (algorithms/lambdas/smart pointers), and — critically for a course titled "for Embedded Systems" — W20 (bare-metal/volatile/placement-new).**

**Randomization:** [CONFIRMED] `getTopicQuizQuestions` shuffles then `slice(0,5)` (`quizService.ts:337-338`); every topic has exactly 4 questions, so the "dynamic bank" serves the same 4 every time — a no-op. Frontend copy says "pass a **5-question** quiz" (`CourseDetail.tsx:1149`) but topics have 4. Week quizzes are served unshuffled in fixed order; option order is never shuffled (all paths).

**Grading:** exact-string match of `userAnswer === q.correctAnswer` (`quizService.ts:52`); pass threshold 60%; XP 100 (+50 perfect); week-1-only badge (`week_1_master`).

**No explanations:** `QuizQuestion` schema has no explanation field (`schema.prisma:137-151`); 480 C++ questions + 18 exam items carry zero feedback content.

**Key assessment defects:**
- Question 11920 (§12) has multiple valid answers.
- Question 11793 (§12) has a garbled stem.
- Final exam is dead content (§21).
- No summative assessment runs at all.

---

## 12. Question-Level Defects

**Individually defective items:**

| Question ID | Module/Topic | Status | Issue | Severity | Evidence | Recommendation |
|---|---|---|---|---|---|---|
| 11920 | W8 Function Declaration & Definition (module quiz) | DEFECTIVE | "Which two functions can be overloaded?" — correctAnswer `int f(int) and int f(double)`, but option D `void f() and int f(int)` is **also a legal overload pair** (different param lists). Option C `int f(int) and int f(int, int=0)` is also declarable (ambiguous to call). Only option A (same params, differing return type) is truly not overloadable. Two unambiguously valid answers → students answering D are marked wrong. | P1 | DB row 11920; `cpp.ts:393` | Rephrase stem to "Which pair **cannot** be overloaded?" (answer A), or replace D with a return-type-only trap |
| 11793 | W3 auto & Type Deduction (topic quiz) | DEFECTIVE | Garbled stem "`auto v[0]` in `std::vector<int> v; auto x = v[0];` produces…" — leading fragment is broken text | P2 | DB row 11793; `cpp_topic_quizzes.ts:93` | Rewrite stem; the intended answer (`int (a copy)`) is fine |

**Healthy population (statistical summary):** Of the 480 quiz questions + 18 final-exam items:
- 2 confirmed defective (above); 0 confirmed incorrect answers in a representative sample of ~60 across all 20 weeks + all 18 exam items (all correct keys verified).
- 0 within-course duplicate texts (DB GROUP BY).
- 100% are 4-option / single-key format.
- The remaining ~478 are structurally clean; full per-item verification of all 480 is not claimed (see §26).

---

## 13. Practical Learning Audit

**Classification: LOW (leaning MODERATE).**

- [CONFIRMED] Code-first pedagogy: 80/80 topics carry a working code snippet and 80/80 carry a distillation note.
- [CONFIRMED] No graded in-content practice: no exercise-with-solution layer, no coding checkpoints, no autograding hook in the content. Practice = pass/fail MCQs only (60% threshold).
- [CONFIRMED] 0 interactive challenges seeded for C++ (`Challenge` count = 0). The challenge engine is UI-orphaned platform-wide anyway (assessment-systems-audit §3.6).
- [CONFIRMED] `PracticeQuestion` table holds 5 rows globally; 1 tagged "C++ OOP" — a trivial recall item ("which keyword allocates memory on the heap?"). Not course-integrated.
- The W20 capstone is a genuine project *described* in prose, but there is no graded deliverable, submission wiring, or evaluation attached to the content (§14).

The present content is strong; the category is docked for what is **missing** (graded exercises, autograded coding tasks, verified build steps).

---

## 14. Project Audit

- **Project (in-content):** W20 capstone "system clock" (`cpp.ts:923-927`) — requirements (HH:MM:SS on LCD, settable via buttons, RTC persistence, constraints: no heap, 8 KB RAM, 64 KB flash), architecture (Clock/Button/Lcd classes, RAII, composition), build discipline (module-by-module, host-tested, `-O0` and `-O2`), and a 7-point certification rubric (encapsulation, RAII, const/constexpr, modern idioms, no leaks/UB, composition-over-inheritance, testing).
- **Strengths:** genuinely realistic embedded scope; clear deliverables; rubric items map to taught weeks (W3, W9, W11-14, W19, W20); excellent portfolio value *if it can be completed*.
- **Weaknesses (platform-level, corroborated):** [CONFIRMED] the project submission route (`routes/project.ts:38-91`) accepts arbitrary metadata (title/description/URLs) and never references any content-defined brief or rubric — the C++ capstone rubric is decorative. The route hard-requires **all 20 modules passed** (`routes/project.ts:54`) — a latent break for any course with ≠20 modules (dynamic-module fix exists in quizService but not here). No file upload endpoint; assignments default to mock paths (`routes/assignment.ts:79,88`).
- **Score:** content-side project is strong (3/5) but the assessment wiring is absent.

---

## 15. Industry Relevance Audit

- [CONFIRMED] Course teaches current C++17/20 practice: `std::string_view`, `std::from_chars`, `if constexpr`, concepts, `std::span`, `operator<=>`, ranges, `make_unique/shared`, structured bindings, init-if, guaranteed copy elision.
- [CONFIRMED] Embedded framing matches the target audience: memory-mapped registers, `volatile`, placement new, `-fno-exceptions -fno-rtti`, CMake + clangd workflow.
- [INFERRED] Minor datedness: "GCC 9+" (2019-era minimum); TA-1 mislabels a C++23 algorithm as C++20 — an employability-relevant currency slip.
- **Employability observation:** a learner who completes this content would be interview-competent in modern C++ fundamentals and embedded idioms — but the absence of graded coding practice means no portfolio evidence is produced unless the capstone is independently completed and submitted through the generic project route.

---

## 16. Obsolete/Deprecated Technology Audit

- No factually obsolete C++ content found [CONFIRMED].
- No removed-standard features taught as current; nothing deprecated presented as recommended.
- TA-6 ("GCC 9+") is a dated recommendation, not obsolete.
- `std::aligned_storage` is mentioned as deprecated in W20.T2 (`cpp.ts:918`) — correctly flagged as deprecated in the text ("use `alignas`"), which is accurate guidance.
- `std::bind`/`ptr_fun`/`auto_ptr` are never taught — good.

---

## 17. Duplication Audit

- [CONFIRMED] Within-course duplicate question texts: **0** (DB GROUP BY).
- [CONFIRMED] Cross-level overlap (topic-quiz vs module-quiz vs final-exam): **0**.
- [CONFIRMED] All 80 topic titles unique within course; no harmful content duplication.
- **Legitimate reinforcement (not penalised):** W19 "Modern C++ Features to Use Daily" and W20 "Final Project & Certification Review" deliberately restate earlier topics as spaced repetition/review — appropriate pedagogy.
- **Minor:** W2.T2 and W3.T3 both cover brace-init narrowing; W6 and W7 both teach short-circuit — intentional reinforcement, acceptable.

---

## 18. Consistency Audit

- **Terminology:** consistent (`brace-init`, `std::`, RAII, lvalue/rvalue, etc.) across all 20 weeks [CONFIRMED].
- **Voice/format:** uniform — bold-led claim → mechanism → "why it matters"; every topic ends with a 1-line `note`; every week has exactly 4 topics + 8 module quizzes + 4 topic quizzes/topic.
- **Assessment style:** uniform 4-option / single-correct everywhere.
- **Code style:** consistent modern C++ idioms; `-Wall -Wextra -std=c++17` is the recurring build mantra.
- **Standard-version consistency:** content mostly C++17 with C++20 feature mentions; TA-1 (C++23 `fold_left`) is the one standard-version slip.
- **Depth balance:** W1–W4 average ~1,300 chars/topic; W14–W20 average ~2,000+ chars/topic. Later weeks are ~1.7× denser — a consistent progression but a cognitive-load concern for self-paced learners.

---

## 19. Feedback Audit

- [CONFIRMED] `QuizQuestion` has **no explanation field** (`schema.prisma:137-151`). All 480 C++ quiz questions + 18 final-exam items carry zero feedback content.
- [CONFIRMED] Grading is exact-string match; post-submit breakdown reveals right/wrong + correct answer only (`quizService.ts:54-64`). No "why", no remediation, no next steps, no hints.
- [CONFIRMED] `PracticeQuestion` *does* carry `explanation` (`schema.prisma:218`) and the practice route returns it — but only 1 C++-tagged practice row exists ("In C++, which keyword is used to allocate memory on the heap?" with explanation "The 'new' operator dynamically allocates…").
- **Verdict:** score-without-learning is the norm for C++ quizzes. Feedback/Learning Support is the weakest dimension (1/5).

---

## 20. Student Journey Audit

Discover → Enroll → Learn → Practice → Quiz → Feedback → Progress → Assignment → Project → Final → Certificate

| Stage | Status | Evidence |
|---|---|---|
| Discover | OK — published course, 699 price, embedded-oriented description | DB `isPublished=true` |
| Enroll | OK — payment flow exists (platform) | `routes/payment.ts` |
| Learn | OK — 80 topics, prose+code+note | DB |
| Practice | WEAK — quiz-only; no graded exercises; 0 challenges | §13 |
| Topic Quiz | LIVE — 4 questions/topic, 60% pass; **frontend-only lock** (no backend enforcement) | `quizService.ts`; `CourseDetail.tsx:884` |
| Week Quiz | LIVE — 8 questions, fixed order, no shuffle | `getQuizQuestions` |
| Feedback | POOR — right/wrong only, no explanations | §19 |
| Progress | OK — CourseProgress/ModuleProgress/TopicProgress wired on pass | `quizService.ts:120-230` |
| Assignment | LIVE but generic — week→module 5N heuristic; mock file URLs; no briefs | `routes/assignment.ts:49-88` |
| Project | LIVE but generic — arbitrary metadata; hardcoded 20-module gate; no rubric | `routes/project.ts:48-56` |
| **Final** | **BROKEN — final exam (18 Q) is never served; no summative assessment runs** | §21 |
| Certificate | OK — `CertificateRecord` exists (1 record for C++ in DB); verified flow | DB |

**Journey broken at the final gate.** A student can pass all 20 weeks and submit a project, but no final exam/assessment is reachable, and the project gate is a hardcoded 20-module count. Also note: the DB shows 0 `QuizResult`/`TopicProgress`/`ModuleProgress` rows for C++ but 1 certificate — the dev DB is near-empty of activity, so journey telemetry cannot be validated from data.

---

## 21. Assessment Reachability Audit

| Assessment | DB → Service → Route → Frontend | Reachable? | Evidence |
|---|---|---|---|
| Topic quiz (320 Q) | `QuizQuestion` → `getTopicQuizQuestions` → `GET /api/quiz/questions/topic/:topicId` → `useQuiz.ts:15` → Quiz page (`/quiz/:courseId/:week/:topicId`) | ✅ LIVE | `quizService.ts:329`; `routes/quiz.ts:17`; `App.tsx:66` |
| Week quiz (160 Q) | `QuizQuestion` → `getQuizQuestions` → `GET /api/quiz/questions/:courseId/:week` → `useQuiz.ts:16` → Quiz page | ✅ LIVE | `routes/quiz.ts:37`; `App.tsx:65` |
| Final exam (18 Q) | `FinalExamQuestion` → **no service, no route** | 🔴 **DEAD** | grep of `backend/src` and `frontend/src` for `finalExam`/`FinalExam`: 0 hits; `schema.prisma:302` |
| Challenges (0 for C++) | — | 🔴 **NONE SEEDED**; engine UI-orphaned platform-wide | `Challenge` count=0; `challengeSeedData.ts:1-3` |
| Practice (5 global; 1 C++) | `PracticeQuestion` → practice route | 🟡 LIVE but trivial; not course-integrated | DB |
| Project/Assignment | `routes/project.ts`, `routes/assignment.ts` → `ProjectStatusCard.tsx`, `CourseDetail.tsx` | ✅ LIVE but generic envelopes | assessment-systems-audit §4 |

**Dead content confirmed for the final exam.** No backend route, no frontend route, no component. The 18 hand-written final-exam questions exist only as DB rows. This is the single most important reachability defect for C++.

---

## 22. Scope/Identity Audit

- **Title:** "C++ & OOP for Embedded Systems".
- **DB description:** "Migrate to object-oriented paradigms, generic templates, and RAII guidelines." (seed.ts:27) — this is a **generic C++ description with no embedded promise**, and it conflicts with the reseed file's intended embedded-heavy description (§2).
- **Actual content:** Weeks 1–19 are general C++/OOP with embedded-flavoured examples (bitwise registers W4, vtable cost on MCU W14, templates-for-embedded W16, smart pointers embedded note W18, modern C++ embedded caveat W19). Only W20 is genuinely bare-metal.
- **Verdict:** The "for Embedded Systems" identity is **under-delivered**. The course is really "C++ & OOP (with an embedded capstone)". This is defensible — general C++ is a prerequisite for embedded C++ — but the title overpromises, the DB description under-promises, and the final exam omits W20 entirely. Scope drift is moderate and directionally inconsistent.

---

## 23. Scorecard + Confidence

**Prior score (do not inherit): 72/100 (Weak-ish), rubric 3.60/5.** Independent re-score below.

| Dimension | Max | Score | Key evidence |
|---|---|---|---|
| Curriculum Architecture | 10 | **7.5** | Coherent 20-week climb; no prerequisite violations; gaps (preprocessor, testing, concurrency, ISR); density skew W14–20 |
| Learning Objectives | 10 | **1.5** | No objective layer anywhere; only 1-line module descriptions |
| Content Quality | 15 | **12.5** | Excellent prose/code/notes; 2 quiz defects, 1 heavy reference topic (W19) |
| Technical Accuracy | 15 | **11.5** | Many claims verified correct; TA-1..TA-9 defects |
| Practical Learning | 10 | **5.0** | Code-first but quiz-only; 0 challenges; capstone not assessed |
| Assessment Quality | 10 | **6.0** | High volume, clean uniqueness, aligned; recall-heavy, no feedback, dead final, no-op randomization |
| Question Quality | 5 | **3.0** | 2 confirmed defective (11920 P1, 11793 P2); sample clean |
| LO Alignment | 5 | **1.5** | Implicit alignment strong; no objectives to align formally |
| Difficulty Progression | 5 | **3.5** | Content climbs well; assessments plateau at recall/application |
| Industry Relevance | 5 | **4.0** | Modern C++17/20; one C++23 mislabel; GCC-9 minimum dated |
| Project Quality | 5 | **3.0** | Strong design + rubric; not wired to any assessment system |
| Feedback / Learning Support | 5 | **1.0** | No explanations on any quiz question; 1 trivial practice row |
| **TOTAL** | **100** | **60.5 → 61/100** | Band: **Weak-ish / Needs Improvement** |

**MODULE SCORECARD** (Content / Accuracy / Practice / Assessment / Progression, /5 each):

| Module | Content | Accuracy | Practice | Assessment | Progression | Overall | Confidence |
|---|---|---|---|---|---|---|---|
| W1 Introduction & Compilation | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W2 C++ vs C, Namespaces, Syntax | 4 | 4 | 2 | 4 | 4 | 3.8 | HIGH |
| W3 Types & Const/Constexpr | 4 | 4 | 3 | 3 | 4 | 3.7 | HIGH |
| W4 Operators & Expressions | 4 | 5 | 3 | 4 | 4 | 4.0 | HIGH |
| W5 Input/Output | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W6 Conditionals & Switch | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W7 Loops | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W8 Functions | 4 | 4 | 2 | 3 | 4 | 3.5 | MEDIUM |
| W9 Arrays & std::array | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W10 Strings | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W11 Classes & Access | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W12 RAII & Rule of 3/5 | 5 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W13 Inheritance & Composition | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W14 Polymorphism & vtables | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W15 Operator Overloading | 4 | 4 | 3 | 3 | 4 | 3.7 | HIGH |
| W16 Templates & Concepts | 4 | 3 | 3 | 4 | 4 | 3.7 | MEDIUM |
| W17 STL Containers | 4 | 4 | 3 | 4 | 4 | 4.0 | HIGH |
| W18 Algorithms & Smart Ptrs | 4 | 3 | 3 | 4 | 4 | 3.7 | MEDIUM |
| W19 Move Semantics & Modern C++ | 4 | 4 | 2 | 4 | 4 | 3.7 | HIGH |
| W20 Embedded Project & Review | 4 | 3 | 4 | 4 | 5 | 4.0 | MEDIUM |

**Confidence: MEDIUM-HIGH.** HIGH on inventory, structure, reachability, and the confirmed defects (all DB + file verified). MEDIUM on full per-item technical accuracy (sampled ~60 of 480; register addresses UNKNOWN without datasheet; not every one of 498 questions individually verified).

**Why the difference from the prior 72/100:** The prior audit used a 5-point weighted rubric (A–G) with different weights (Practical 20%, Assessment 15%). This audit uses the required 12-dimension/100-point rubric, which weights Feedback (5) and Learning Objectives (10) explicitly. The gap is concentrated exactly there. Where the prior audit and this audit agree (content quality, technical accuracy, quiz-to-lesson alignment), the evidence was independently re-verified and the agreement stands.

---

## 24. P0/P1/P2/P3 Issue Register

| ID | Severity | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| C-01 | P1 | Whole course (content files + schema) | No learning-objective layer; no objectives→assessment map | `cpp.ts:12-31`; DB Topic model; no objective field anywhere | Cannot demonstrate LO alignment; caps two score dimensions | Add per-topic objective field + map quizzes/capstone to objectives (authoring-standard change) |
| C-02 | P1 | `FinalExamQuestion` (18 rows) | Final exam is dead content — no route/UI serves it; zero code refs | grep of `backend/src` + `frontend/src` = 0 hits; `schema.prisma:302` | No summative assessment exists for the course | Serve the final exam (certificate gate) or remove the dead table |
| C-03 | P1 | Content files + `Challenge` table | No graded practical work: no exercises, 0 challenges for C++, capstone not assessed | `Challenge` count=0; `cpp.ts` has no practice/assignment arrays; `routes/project.ts:38-91` never references the rubric | Learners never produce/validate code; portfolio value unrealised | Wire the W20 rubric into project submission; add per-week graded exercises or seed challenges |
| C-04 | P1 | DB 11920; `cpp.ts:393` | Module quiz "Which two functions can be overloaded?" has multiple valid answers (D is legal; C arguably) | DB row 11920 options + key | Correct students marked wrong | Reword stem to "which pair cannot be overloaded" or replace option D |
| C-05 | P1 | `QuizQuestion` schema; all 480+18 questions | No explanation/feedback on any question; score-without-learning | `schema.prisma:137-151` | Retakes teach nothing; no remediation path | Add explanation support (schema+content+UI) |
| C-06 | P2 | DB 11793; `cpp_topic_quizzes.ts:93` | Garbled topic-quiz stem ("`auto v[0]` in …") | DB row 11793 | Confusing broken question ships to students | Rewrite stem |
| C-07 | P2 | `cpp.ts:834` (W18.T3) | `std::ranges::fold_left` labelled C++20 but is C++23 | DB text; standard history | Fails under `-std=c++20`; currency slip | Use C++20-valid expression or relabel |
| C-08 | P2 | `cpp.ts:919` (W20.T2) | Hosted `std::cout` in bare-metal placement-new snippet | DB topic code | Inconsistent with course's own `-fno-exceptions` no-OS doctrine | Replace with register write or comment |
| C-09 | P2 | `cpp.ts:906-913` (W20) | Register addresses with no MCU/datasheet attribution | DB; prior audit E-3 | Students cannot verify/generalise | Name MCU + reference manual |
| C-10 | P2 | `quizService.ts:337-338` + `CourseDetail.tsx:1149` | Topic-quiz "randomization" no-op (`slice(0,5)` on 4); UI says "5-question quiz" | `quizService.ts`; frontend copy | Misleading UX; no dynamic bank | Fix slice logic or copy; implement real randomization |
| C-11 | P2 | Content (absent topics) | Gaps: preprocessor/header guards, testing/debugging, concurrency, exceptions-as-feature, ISR-safe C++ | 80-topic title scan | Real-world C++ competence gaps | Add highest-leverage topics first (header guards, testing) |
| C-12 | P2 | DB `Course.description` vs `reseed_cpp_full.ts:40-42` | DB description is legacy seed.ts text; reseed create-description never applied | DB vs file | Advertised identity mismatch | Decide canonical description; update DB |
| C-13 | P2 | `routes/project.ts:48-56` | Hardcoded 20-module project gate vs dynamic-module fix | `project.ts:54` | Latent break for ≠20-module courses | Use dynamic module count |
| C-14 | P2 | `routes/assignment.ts:49-56` | Assignment week→module 5N heuristic assumes 20 modules | `assignment.ts` | Fragile mapping; no content-defined briefs | Derive from content or define mapping |
| C-15 | P2 | `CourseDetail.tsx:884` | Topic-lock enforced frontend-only; backend accepts any submission | Frontend lock logic; `submitQuiz` no prior-topic check | Lock bypassable via API | Enforce lock server-side |
| C-16 | P2 | Final exam content | Exam omits W2, W13, W18, W20 — including the embedded identity weeks | 18 exam items vs 20 weeks | Summative under-samples the course | Add items for missing weeks, esp. W20 |
| C-17 | P3 | `cpp.ts:69` | "GCC 9+" minimum dated | `cpp.ts:69` | Minor currency | Bump recommendation |
| C-18 | P3 | `cpp.ts:737-738` (W16.T2) | Specialization snippet references undeclared `to_string_safe` | DB topic code | Reproducibility | Complete the snippet |
| C-19 | P3 | Prior audit §E-3 | Prior doc says `0x40020C14` = "GPIOB ODR"; STM32F4 map indicates GPIOD | RM0090 (external) | Prior doc attribution inaccurate | Correct attribution or drop chip claim |
| C-20 | P3 | `cpp.ts:141` (W3.T0) | "bool must be 1 byte minimum" overstates standard | C++ standard | Minor | Soften wording |
| C-21 | P3 | `cpp.ts:165` (W3 quiz) | `int8` distractor not a real type | DB options | Minor hygiene | Use `int8_t` or drop |

P0: 0 · P1: 5 · P2: 11 · P3: 5 (as tabled).

---

## 25. Recommended Improvement Opportunities

1. **Add a learning-objective layer** (per-topic, measurable) and a per-question objective tag — the single highest-leverage content change (raises LO + LO-Alignment).
2. **Make the final exam live** or cut it; if live, expand it to cover W2/W13/W18/W20 and add scenario-based integrative items.
3. **Bind the W20 capstone rubric to the project submission system**; seed per-week graded exercises or make the challenge engine reachable (it exists, is secure, and is seeded for 3 courses).
4. **Add explanation content** to quizzes (schema + authoring + UI) and real question/option randomization; fix the `slice(0,5)` no-op and the "5-question" copy.
5. **Fix the concrete content defects:** TA-1 (fold_left), TA-2 (std::cout in bare-metal), 11920, 11793.
6. **Fill highest-leverage content gaps:** header guards/preprocessor, testing & debugging topic.
7. **Reconcile course metadata:** DB description vs intended description.
8. **De-duplicate module-count logic** (project/assignment/quiz gates) and enforce the topic-lock server-side.

---

## 26. Unknowns / Missing Evidence

- [UNKNOWN — NOT VERIFIED] Exact MCU for W20 register addresses; correctness of `0x40020C14`/`0x40011000/04` requires an ST datasheet and a named target. No chip is identified in content.
- [UNKNOWN — NOT VERIFIED] Live-deployment parity: the audited DB and repo are the local seed; the live site runs GitHub `main`, which may drift.
- [UNKNOWN — NOT VERIFIED] Full per-item correctness of all 498 questions: 2 confirmed defective; ~60 sampled clean; the remainder not individually re-derived.
- [UNKNOWN — NOT VERIFIED] Cross-course topic-text duplication: this audit covered C++ only; catalog-wide topic duplication is out of scope.
- [INFERRED] "Later weeks ~1.7× denser" is based on DB char-length; actual reading-time impact depends on markdown/code distribution.
- [UNKNOWN — NOT VERIFIED] Student-engagement telemetry: DB shows 0 QuizResult/TopicProgress/ModuleProgress rows for C++ — journey-stage behaviour cannot be measured from data.

---

## 27. Final Verdict

The C++ course contains the **best-written core content in the catalog** — accurate, modern, well-sequenced, and genuinely expert teaching. As a *content artifact* it is strong. As a *learning system* it is incomplete: no objectives, no feedback, no graded practice, no reachable summative assessment, and two defective assessment items. The platform-level assessment infrastructure (final exam, challenge engine, project/assignment envelopes) exists but is either dead, UI-orphaned, or unbound to this content.

**Independent score: 61/100 — Weak-ish / Needs Improvement.** Do not inherit the prior 72/100; the delta is rubric-weight-driven and concentrated in Feedback, Learning Objectives, and Practical Learning — all verified gaps. The path to **Strong (78+)** is clear and mostly non-content: serve the final exam, wire the capstone rubric, add explanation feedback, and add an objective layer. The pure-content fixes (TA-1, TA-2, 11793, 11920) are small, well-scoped edits.

**The course is KEEP-with-substantial-repair, not REWRITE.** The prose, code, and pedagogy should be preserved; the assessment/feedback/objective system around it needs building out.

---

## Improvement Candidates — NOT YET APPROVED

Next phase decides KEEP / FIX / REWRITE / RESTRUCTURE / REMOVE / ADD / MODERNIZE / DEPRECATE.

| ID | Candidate | Category | Rationale | Effort |
|---|---|---|---|---|
| I-01 | 20-module content core (prose/code/notes) | KEEP | Highest-quality asset in catalog | — |
| I-02 | W20 capstone rubric → bind to project submission | FIX | Turns described project into assessed project | M |
| I-03 | Final exam → route + UI + expand coverage (add W2/W13/W18/W20, scenario items) | FIX/ADD | Revives dead summative; fixes coverage gap | M |
| I-04 | Per-topic learning objectives + question→objective tags | ADD | Unlocks LO alignment; catalog-wide pattern | L |
| I-05 | `QuizQuestion` explanation field + authoring + UI reveal | ADD | Score-with-learning; platform-wide | L |
| I-06 | Fix 11920 (multiple valid answers) | FIX | Assessment integrity | S |
| I-07 | Fix 11793 garbled stem | FIX | Hygiene | S |
| I-08 | Fix TA-1 (`fold_left` → C++23 label or C++20 spelling) | FIX | Accuracy/currency | S |
| I-09 | Fix TA-2 (`std::cout` in bare-metal snippet) | FIX | Consistency | S |
| I-10 | Register-map attribution (name MCU + datasheet) | FIX | Verifiability | S |
| I-11 | Add header-guards/preprocessor topic; add testing/debugging topic | ADD | Real-world gaps | M |
| I-12 | Topic-quiz randomization real draw + fix "5-question" UI copy | FIX | UX/integrity | S |
| I-13 | Server-side topic-lock enforcement | FIX | Integrity | S |
| I-14 | Reconcile DB course description with intended identity | FIX | Scope/identity | S |
| I-15 | Dynamic module-count gates (project/assignment) | FIX | Latent break | S |
| I-16 | "GCC 9+" → modern minimum; W16 specialization snippet completion; W3 quiz `int8` distractor | FIX | Minor accuracy/hygiene | S |
| I-17 | Challenge engine → C++ week-1 seeds + frontend page | ADD/MODERNIZE | Highest-ROI practical asset (platform-wide) | L |

---

*Report ends. Audit-only — nothing was implemented. All proposals await the decision phase.*

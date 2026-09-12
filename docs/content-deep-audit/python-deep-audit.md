# EduNexus Pro — Python Course Deep-Scan Audit

**Phase:** Content Quality & Curriculum Audit (MASTER PLAN v1.0) — Deep-Scan, Course: `Python`
**Audit type:** INDEPENDENT, evidence-based, full-file + live-DB deep scan
**Audit-only:** nothing modified. Reads of `backend/prisma/content/python.ts`, `python_topic_quizzes.ts`, `reseed_python_full.ts`, `challengeSeedData.ts`, `seed.ts`, `backend/src` routes/services, `frontend/src`, and the live local Postgres `nexus` DB (read-only). One new file created: this report.
**Date:** 2026-08-14
**Auditor:** Lead Curriculum Quality Auditor

---

## Evidence labels used in this report

| Label | Meaning |
|---|---|
| [CONFIRMED] | Verified directly by file `file:line` or live-DB query / record id |
| [INFERRED] | Reasonable reading not directly verifiable (e.g., deployed-live parity) |
| [UNKNOWN — NOT VERIFIED] | Requires external verification not possible here |
| [RECOMMENDATION] | Proposal; not approved for implementation |

Severity: **P0** critical / **P1** high / **P2** medium / **P3** low.

---

## 1. Executive Summary

The Python course is the platform's most mature, best-architected curriculum: a 20-week arc that takes a beginner from `print()` to a packaged, pytest-tested CLI tool, with genuinely strong prose, concrete runnable examples, and industry-relevant tooling (pandas, requests + BeautifulSoup, argparse, pyproject.toml, pathlib). The content inventory matches the platform standard exactly (20 modules, 80 topics, 320 topic-quiz questions, 160 module-quiz questions, 18 final-exam questions, 3 challenges).

However, the deep scan — a full read of every content line plus live-DB verification — surfaces a materially worse defect profile than the prior audit (77.25/100) reported. The independent score is **61/100**. Key drivers of the gap:

1. **Three live assessment items are defective** and reachable by students today: W4 chapter Q4 has two logically identical correct answers (DB 10864); W5 chapter Q4 penalizes the correct idiomatic answer (DB 10888); W3 chapter quiz contains two near-identical falsiness questions (DB 10843/10844).
2. **Two student-facing code snippets crash with `NameError`** if run as shown (python.ts:320 W4 T4; python.ts:1536 W19 T2), and one teaches a self-import anti-pattern (python.ts:1037).
3. **Assessment infrastructure undermines learning**: 498 Python quiz questions carry no explanations; options are never shuffled; the "randomized" topic quiz is a no-op; the 18-question final exam is dead content (no route/UI); the sandboxed auto-graded challenge engine is seeded for 3 Python exercises but invisible to students.
4. **No formal learning objectives** exist anywhere in the content, so LO alignment cannot be demonstrated.
5. **Course metadata is stale and false**: DB description still claims the course is taught "in Hinglish," but every module/topic is written in English.

Strengths to preserve: the W18–W20 capstone (expenses CLI) is a model project spine; technical fundamentals (LEGB, chained comparisons, short-circuiting, float quirk, EAFP, dict/set patterns) are accurate; difficulty progression is excellent; industry tooling matches real Python practice.

---

## 2. Course Metadata (DB-sourced)

[CONFIRMED — live-DB query on `Course` where id='Python']:

| Field | Value |
|---|---|
| id | `Python` |
| title | `Python Programming & Scripting` |
| description | `Master Python syntax, data analysis, automation scripts, and file structures in Hinglish.` |
| price | `699` |
| isPublished | `true` |

**Discrepancy (DB vs content):** The DB description claims the course is delivered "in Hinglish," but the full content scan shows every module description and topic body is written in plain English. The stale string originates from the generic course seed (`seed.ts:71`). The Python reseed script intends a different description — `'Master Python from first principles to a shipped CLI tool…'` (`reseed_python_full.ts:36-45`) — but only sets it on the `create` branch; since the course already exists, the else branch merely logs and the DB keeps the old text. [CONFIRMED — `reseed_python_full.ts` create/else logic; DB value] This is both stale and factually false metadata shown to prospective students.

---

## 3. Content Inventory

### 3.1 DB counts (live DB, course `Python`)

| Item | DB count | Expected | Match |
|---|---|---|---|
| Modules | 20 | 20 | ✅ |
| Topics | 80 | 80 | ✅ |
| Topic-quiz questions (`topicId IS NOT NULL`) | 320 | 320 (4 × 80) | ✅ |
| Module-quiz questions (`topicId IS NULL`) | 160 | 160 (8 × 20) | ✅ |
| Final-exam questions (`FinalExamQuestion`) | 18 | 18 | ✅ |
| Challenges (`Challenge`) | 3 | 3 | ✅ |

[CONFIRMED — aggregate queries on `Module`, `Topic`, `QuizQuestion`, `FinalExamQuestion`, `Challenge` filtered to course `Python`.]

### 3.2 Per-module breakdown (DB-sourced)

| Week | Module title | Topics | Topic Qs | Module Qs | DB module id |
|---|---|---|---|---|---|
| 1 | Introduction to Python & Philosophy | 4 | 16 | 8 | 101 |
| 2 | Installing Python, IDEs & First Script | 4 | 16 | 8 | 102 |
| 3 | Variables & Basic Types | 4 | 16 | 8 | 103 |
| 4 | Operators & Expressions | 4 | 16 | 8 | 104 |
| 5 | Conditional Statements (if-elif-else) | 4 | 16 | 8 | 105 |
| 6 | Loops (for, while) & Comprehensions | 4 | 16 | 8 | 106 |
| 7 | Functions, Args & Scope | 4 | 16 | 8 | 107 |
| 8 | Lists & Tuples | 4 | 16 | 8 | 108 |
| 9 | Dictionaries & Sets | 4 | 16 | 8 | 109 |
| 10 | String Handling & File I/O | 4 | 16 | 8 | 110 |
| 11 | Exception Handling | 4 | 16 | 8 | 111 |
| 12 | Introduction to OOP in Python | 4 | 16 | 8 | 112 |
| 13 | Modules, Packages & Pip | 4 | 16 | 8 | 113 |
| 14 | Data Analysis with Pandas | 4 | 16 | 8 | 114 |
| 15 | Data Visualization with Matplotlib | 4 | 16 | 8 | 115 |
| 16 | Automating Files & Scripts | 4 | 16 | 8 | 116 |
| 17 | Web Scraping Basics | 4 | 16 | 8 | 117 |
| 18 | Project Planning (CLI Tool) | 4 | 16 | 8 | 118 |
| 19 | Building a CLI Python Tool | 4 | 16 | 8 | 119 |
| 20 | Packaging, Testing & Final Review | 4 | 16 | 8 | 120 |

Every topic has exactly 4 quiz questions; every module has exactly 8 quiz questions with `topicId IS NULL`. [CONFIRMED]

---

## 4. Curriculum Structure

The course is organized as a single 20-week linear track (no branching, no electives, no prerequisites modeled). The pedagogical arc is coherent and well-staged:

- **W1–W2 Foundation:** what Python is, the interpreter/REPL, environment setup, first script, error-reading mindset.
- **W3–W6 Language core:** variables/types, operators, conditionals, loops/comprehensions.
- **W7–W9 Data structures:** functions/scope, lists/tuples, dicts/sets.
- **W10–W11 Correctness:** strings/files, exception handling.
- **W12–W13 Abstraction:** OOP, modules/packages/pip.
- **W14–W17 Applied data:** pandas, matplotlib, file automation, web scraping.
- **W18–W20 Capstone:** plan → build → package/test a real CLI tool.

The capstone thread (an expenses CSV analysis CLI) is threaded through W18–W20 and is the single strongest structural element: requirements → design (loader/analysis/report split) → argparse orchestration → error boundary → pytest + packaging. This is genuinely project-based and industry-shaped. [CONFIRMED — full read]

**Structural weaknesses:**
- **OOP gets one module (W12)** for classes, `__init__`, `self`, inheritance, encapsulation, `@property` — far too compressed for the cognitive load OOP requires. [INFERRED from depth]
- **Async/await has zero coverage** anywhere in 1,800 lines (grep count = 0). For a 2026 Python course whose own W17 covers HTTP scraping and W14/15 cover data, the total absence of `asyncio`/`async def` is a modern-skill gap. [CONFIRMED — grep `async|await` = 0]
- **The pandas and matplotlib modules (W14, W15) are shallow** — 4 topics each cannot cover a real analysis workflow; the leap from W13 (stdlib) to W14 (DataFrame) is steep.
- **W20 T4 retroactively lists four projects** ("build a project from each section") that were never assigned or scaffolded in earlier weeks — a scope mismatch presented at course end. [CONFIRMED — python.ts W20 T4]

---

## 5. Module-by-Module Analysis

### MODULE SCORECARD (0–5 per dimension; independent assessment)

| Week | Module | Content | Tech. Accuracy | Assessment | Practical | Progression | Overall |
|---|---|---|---|---|---|---|---|
| 1 | Introduction to Python & Philosophy | 4 | 3 | 4 | 3 | 4 | 3.6 |
| 2 | Installing Python, IDEs & First Script | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 3 | Variables & Basic Types | 4 | 3 | 3 | 4 | 4 | 3.6 |
| 4 | Operators & Expressions | 4 | 3 | 2 | 4 | 4 | 3.4 |
| 5 | Conditional Statements (if-elif-else) | 4 | 4 | 2 | 4 | 4 | 3.6 |
| 6 | Loops (for, while) & Comprehensions | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 7 | Functions, Args & Scope | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 8 | Lists & Tuples | 4 | 3 | 3 | 4 | 4 | 3.6 |
| 9 | Dictionaries & Sets | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 10 | String Handling & File I/O | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 11 | Exception Handling | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 12 | Introduction to OOP in Python | 3 | 4 | 4 | 3 | 3 | 3.4 |
| 13 | Modules, Packages & Pip | 4 | 3 | 4 | 4 | 4 | 3.8 |
| 14 | Data Analysis with Pandas | 3 | 4 | 4 | 3 | 3 | 3.4 |
| 15 | Data Visualization with Matplotlib | 3 | 3 | 3 | 3 | 3 | 3.0 |
| 16 | Automating Files & Scripts | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 17 | Web Scraping Basics | 4 | 4 | 4 | 4 | 4 | 4.0 |
| 18 | Project Planning (CLI Tool) | 4 | 4 | 3 | 4 | 4 | 3.8 |
| 19 | Building a CLI Python Tool | 4 | 2 | 3 | 4 | 4 | 3.4 |
| 20 | Packaging, Testing & Final Review | 4 | 4 | 3 | 4 | 4 | 3.8 |

**Module-level highlights:**
- **W2, W9, W11, W16, W17 are the strongest modules** — practical, accurate, and immediately useful.
- **W19 is the weakest on technical accuracy** because the orchestration example (`python.ts:1536`) calls an undefined `format_summary`, so the module's central teaching snippet would crash if executed.
- **W15 (matplotlib)** carries the "`show` clears the figure" folk explanation, which is backend-dependent and misleading.
- **W12 (OOP)** is the largest depth/coverage gap: four pillars of OOP + `@property` + inheritance + encapsulation in one module is not learnable depth.

---

## 6. Topic-by-Topic Findings

80 topics reviewed (full read). Topic ids 1270–1349 (4 per week, in order). All 320 topic-quiz questions verified present (4/topic).

Notable per-topic findings:

| Week/Topic | Topic title (DB) | Finding |
|---|---|---|
| W1 T3 | Python in the Real World: Web, Data & Automation | Code sample's `count_domains()` is guarded by `if False` and never runs — dead demo code [CONFIRMED — python.ts:74]. |
| W3 T2 | Strings & f-Strings | **PEP 8 claim is false** — "PEP 8 suggests single quotes" (PEP 8 makes no such recommendation) [CONFIRMED — python.ts:230]. |
| W3 T4 | Booleans & None | `print(age := 18, age >= 18)  # True` — the inline comment is misleading; output is `18 True`, not `True` [CONFIRMED — python.ts:238]. |
| W4 T4 | Expression Evaluation & Operator Precedence | Runnable snippet `allowed = (age >= 18) and (user is not None)` references undefined `age`/`user` → **NameError if run** [CONFIRMED — python.ts:320, DB Topic 1285]. |
| W5 T4 | Ternary Expressions & Simple Guards | — (accurate; good walrus coverage) |
| W8 T2 | Tuples: Immutability & Unpacking | Topic quiz Q1 distractor D contains a **false statement**: `tuple(5,) is also fine` — `tuple(5)` raises `TypeError` [CONFIRMED — python_topic_quizzes.ts:697-701, DB 10949]. |
| W13 T1 | Modules & the import Statement | Code runs `import greeting` **inside the file that defines `greeting`** — a self-import that teaches a confusing pattern; the "another file" commentary is commented out [CONFIRMED — python.ts:1037-1038, DB Topic 1318]. |
| W13 T1 | Modules & the import Statement | Stdlib tour lists `re` with a pointer "Section 16", but **Section 16 never teaches regex** (0 regex mentions in the file); `datetime`, `statistics`, `urllib/http` are also listed but never taught [CONFIRMED — python.ts:1043ff; grep]. |
| W15 T1 | Plotting Basics: plt.plot & plt.show | Note claims "`show` clears the figure" — an oversimplified/backend-dependent statement [CONFIRMED — python.ts:1202; also module quiz option at 1239-1240]. |
| W19 T2 | Orchestrating the Pipeline (Main Flow) | Central example calls `print(format_summary(data))` with `format_summary` **never defined or imported** in the snippet → **NameError if run** [CONFIRMED — python.ts:1536]. |
| W20 T4 | Full Course Review & Next Steps | Retroactively lists 4 "build a project" suggestions never scaffolded earlier [CONFIRMED — python.ts W20 T4]. |

---

## 7. Content Chunk Summaries

Chunk ID scheme: `W{week}.T{order}` (order 0–3 per module, matching DB `Topic.order`). Full title list for all 80 chunks is in DB (queried 2026-08-14). Key structural facts:

- **Format:** every topic = `title` + `text` (markdown prose) + `code` (runnable snippet) + `note` (one-line takeaway), plus exactly 4 topic-quiz questions. Uniform, well-maintained structure.
- **Length/consistency:** prose is consistently 2–5 paragraphs; code samples are short, idiomatic, and comment-rich. Tone is consistent throughout (direct, example-first, beginner-appropriate).
- **Content-type distribution across the 80 chunks:** ~50% language fundamentals, ~15% data (pandas/matplotlib), ~15% tooling/automation, ~10% web (HTTP/BeautifulSoup/APIs), ~10% capstone planning/building/packaging. [INFERRED from full read]

---

## 8. Technical Accuracy Findings

**Accurate (verified):**
- Floor division semantics (`5 / 2` → 2.5 float; `//` floor) [CONFIRMED — python.ts W4 T1, W3 chapter Q4 DB 10840].
- Binary float quirk `0.1 + 0.2` → `0.30000000000000004` [CONFIRMED — DB 10839].
- `**` right-associativity (`2 ** 3 ** 2` → 512) [CONFIRMED — python.ts:320].
- Chained comparisons and short-circuit evaluation [CONFIRMED — python.ts:305-307].
- `is` vs `==`, use `is None` [CONFIRMED — python.ts:237].
- `bool` is a subclass of `int` (`True == 1`) [CONFIRMED — python.ts:237].
- Strings/tuples immutable; methods return new objects [CONFIRMED — python.ts:230, W8].
- LEGB scoping and `global` usage [CONFIRMED — W7 T4].
- EAFP vs LBYL philosophy [CONFIRMED — W11 T4].
- `groupby` semantics, `pathlib`, `argparse`, `pytest`, `pyproject.toml` all consistent with current Python 3.11+ practice [CONFIRMED].

**Inaccurate / misleading (see §24 Issue Register):**

| ID | Severity | Location | Defect |
|---|---|---|---|
| E-1 | P2 | python.ts:230 (W3 T2) | "PEP 8 suggests single quotes" — false; PEP 8 makes no such recommendation. |
| E-2 | P1 | python.ts:320 (W4 T4) | Undefined `age`, `user` → `NameError` if snippet run. |
| E-3 | P3 | python.ts:1202, 1239-1240 (W15 T1) | "`show` clears the figure" — oversimplified, backend-dependent. |
| E-4 | P3 | python.ts:6 (header) | Header claims "15-question final exam"; actual seed + DB = **18**. |
| E-5 | P1 | python.ts:1037-1038 (W13 T1) | Self-import `import greeting` inside the file that defines `greeting`. |
| E-5 | P1 | python.ts:1536 (W19 T2) | `format_summary` undefined → `NameError` if snippet run. |
| — | P2 | python_topic_quizzes.ts:697-701 (W8 T2) | Distractor D asserts `tuple(5,) is also fine` — false (`tuple(5)` raises `TypeError`). |

**Coverage gaps:** async/await absent; `re`/regex promised but never taught; `datetime`, `statistics`, `urllib` listed in stdlib tour but never demonstrated. [CONFIRMED — grep]

---

## 9. Learning Objective Audit

**No formal, explicit learning objectives exist** anywhere in the course content. The content file contains topic titles, prose, code, and notes — but no per-topic, per-module, or per-course "by the end of this you will be able to…" statements, no measurable success criteria, and no objective→assessment mapping. [CONFIRMED — full read of python.ts: zero LO declarations]

The *implicit* objectives (derivable from titles + assessment) are reasonable and Bloom-progressive: recall of syntax (W3–W5) → application in loops/functions (W6–W7) → analysis of data structures (W8–W9) → creating a tool (W18–W20). But implicit objectives are not auditable, not gradeable, and cannot be demonstrated as aligned to assessment.

**Score impact:** Learning Objectives = 3/10; LO Alignment = 2/5. This is the single largest score drag and is a course-wide (not Python-specific) structural gap.

---

## 10. LO → Content → Practice → Assessment Matrix

Because no formal LOs exist, this matrix maps *implicit* objectives against the verified content/assessment (representative rows; all items DB-verified).

| Implicit LO (derived) | Content (module/topic) | Practice (reachable?) | Assessment |
|---|---|---|---|
| Run a Python script and read a traceback | W1–W2 | Code samples (self-run; not graded) | W2 module quiz + topic quizzes |
| Use variables, ints, floats, strings, bools correctly | W3 | Code samples | W3 topic quizzes (16) + module quiz (8) |
| Reason about operator precedence and short-circuiting | W4 | Code samples | W4 quizzes (defective Q4: two correct answers, DB 10864) |
| Branch with if/elif/else and understand truthiness | W5 | Code samples | W5 quizzes (defective Q4: idiom penalized, DB 10888) |
| Loop with for/while and build comprehensions | W6 | Code samples | W6 quizzes |
| Define functions with defaults, *args/**kwargs, scope | W7 | Code samples | W7 quizzes |
| Choose list vs tuple; slice and unpack | W8 | Code samples | W8 quizzes (false distractor, DB 10949) |
| Use dicts/sets for counting & grouping | W9 | Code samples | W9 quizzes |
| Read/write files safely with `with` | W10 | Code samples | W10 quizzes |
| Handle and raise exceptions | W11 | Code samples | W11 quizzes |
| Write classes with __init__, inheritance, encapsulation | W12 | Code samples | W12 quizzes |
| Import modules, use stdlib, install with pip + venv | W13 | Code samples | W13 quizzes |
| Analyze tabular data with pandas | W14 | Code samples | W14 quizzes |
| Plot with matplotlib | W15 | Code samples | W15 quizzes |
| Automate files with pathlib/os/CSV/JSON | W16 | **File-organizer script (in-topic, ungraded)** | W16 quizzes |
| Scrape responsibly with requests + BeautifulSoup | W17 | **Price-monitor demo (in-topic, ungraded)** | W17 quizzes |
| Plan, build, test, package a CLI tool | W18–W20 | **Capstone CLI (prose brief only; no rubric, not auto-graded)** | W19–W20 quizzes; project submission gate |

**The only auto-graded practice artifacts** are the 3 Python interactive challenges (Hello World, Create a Variable, print() with Variables) — all seeded in W1 [CONFIRMED — Challenge DB ids 7,8,9] — and **all three are unreachable through the UI** (see §13, §21). Beyond them, "practice" is ungraded code samples embedded in topic prose.

---

## 11. Assessment Audit

**Assessment inventory (course Python):**

| System | Volume | Reachable? | Notes |
|---|---|---|---|
| Topic quizzes | 320 | ✅ via quiz UI | 4/topic; "randomization" is a no-op (`slice(0,5)` on a 4-item bank) |
| Module/chapter quizzes | 160 | ✅ via quiz UI | 8/module; served in DB order, never shuffled |
| Final exam | 18 | ❌ **dead content** | `FinalExamQuestion` seeded but zero route/UI refs |
| Interactive challenges | 3 | ❌ **UI-orphaned** | Backend + sandbox runner exist; no frontend consumer |
| Projects | 1 capstone | ✅ submission UI | Prose brief only; no rubric; 20-module hard gate |

**Assessment mechanics findings (all [CONFIRMED] — code + DB):**
- Grading is exact-string match `userAnswer === q.correctAnswer` against the option text (`quizService.ts:52`).
- No explanation field exists on `QuizQuestion` (`schema.prisma:137-151`); none of the 498 Python questions carry feedback content. Post-submit reveal shows right/wrong + correct answer, never *why*.
- Pass threshold 60%; XP 100 (+50 perfect); badge `week_1_master` front-loads W1 only (`quizService.ts:67,90-103`).
- Topic-quiz "randomization": `getTopicQuizQuestions` shuffles then `slice(0, 5)`; with 4-question banks this always returns all 4 — a documented no-op (`quizService.ts:336-338`).
- The 18 final-exam questions themselves are technically correct (verified one-by-one), but they are unreachable, making summative assessment nonexistent in practice.

---

## 12. Question-Level Defects

### QUESTION AUDIT — defective items (individually verified in live DB)

| DB id | Week / Quiz | Question text | Defect | Evidence |
|---|---|---|---|---|
| 10864 | W4 chapter Q4 | "The correct way to test 'age is between 18 and 60 inclusive of 18' is…" | **Two logically identical correct answers**: option A `18 <= age < 60` and option B `age >= 18 and age < 60` both express `[18, 60)`; grading accepts only B → correct students marked wrong | [CONFIRMED] DB 10864; python.ts:342-343 |
| 10888 | W5 chapter Q4 | "The idiomatic way to check if a list is empty is…" | **Penalizes the correct idiom**: option B `if my_list:` IS the idiomatic answer, but `correctAnswer` is the verbose self-answering option C (`if len(my_list) == 0 (also works, but if my_list: is the idiom)`); a student who knows the idiom is marked wrong | [CONFIRMED] DB 10888; python.ts:424-425 |
| 10843 | W3 chapter Q7 | "Which of these values is FALSY in Python?" | **Near-duplicate of Q8** in the same quiz (both test falsiness with near-identical stems); options `{1, True, "", "0"}` — only `""` is falsy, so it is internally valid but redundant | [CONFIRMED] DB 10843 |
| 10844 | W3 chapter Q8 | "Which of these values is falsy?" | **Near-duplicate of Q7**; options `{0, 42, True, "hello"}` — only `0` falsy; internally valid but redundant | [CONFIRMED] DB 10844 |
| 10949 | W8 topic Q1 (Tuples) | "Which creates a one-element tuple?" | **Distractor D contains a false statement**: `tuple(5,) is also fine but (5,) is the common form` — `tuple(5)` raises `TypeError`, so the "also fine" claim is wrong and misleading | [CONFIRMED] DB 10949; python_topic_quizzes.ts:697-701 |

### QUESTION AUDIT — healthy items (summarized)

| Bucket | Count | Assessment |
|---|---|---|
| Remaining topic-quiz questions | 315 | Internally valid (spot-verified across all 20 weeks); see systemic quality notes below |
| Remaining module-quiz questions | 156 | Internally valid |
| Final-exam questions | 18 | All technically correct (verified one-by-one) |

### Systemic question-quality pattern (all weeks)

A pervasive **"self-answering / annotated correct option"** pattern: the correct option is routinely the longest, carrying an explanation suffix — e.g. `0.30000000000000004 — binary float rounding`, `2.5 — division always returns a float`, `"" (empty string)`, `if len(my_list) == 0 (also works, but if my_list: is the idiom)`. [CONFIRMED — full read of python_topic_quizzes.ts + DB] Because grading compares against this exact annotated string, the *verbosity itself* is part of the answer; a student can identify the correct option by length/annotation, which reduces discrimination and lets pattern-matching replace knowledge. Some questions also leak the answer through the correct option wording (e.g., W5 Q4 includes "if my_list: is the idiom" inside the marked-correct option). This is a P2 question-quality concern across all 320 topic questions.

---

## 13. Practical Learning Audit

**In-course practical content:** nearly every topic embeds a runnable code snippet; W16 builds a file-organizer automation script in-topic; W17 builds a price-monitor scraper in-topic; W18–W20 build an expenses CLI end-to-end. The *breadth* of hands-on code is excellent.

**But graded/auto-evaluated practice is effectively absent:**
- The **only auto-graded coding practice** is the interactive Challenge system, seeded with exactly 3 Python exercises (ids 7–9, all in W1) — and **no frontend page or route consumes `api/challenges/*`** (grep of `frontend/src`; only `About.tsx` marketing copy mentions challenges) [CONFIRMED]. Students cannot reach them.
- There are **no in-topic auto-graded exercises** — no "try it", no test harness, no sandboxed submission for the ~76 topics beyond W1.
- The W16/W17 scripts and the W18–W20 capstone are **ungraded prose**; nothing verifies the student produced working code.
- No explicit per-week "assignment" content exists in the Python course (the platform's assignment submission route exists, but the Python content defines no assignment briefs) [CONFIRMED — assessment-systems audit; content files].

**Score impact:** Practical Learning = 5/10. The content is practical in spirit but the platform fails to capture or verify any of it.

---

## 14. Project Audit

The capstone is the expenses CSV analysis CLI tool, planned in W18, built in W19, tested/packaged in W20. This is a genuinely good project spine: real requirements (category/month totals), clean module split (loader/analysis/report), argparse, exit codes, pytest, `pyproject.toml`. [CONFIRMED — W18–W20 full read]

**Defects:**
1. **The submission system does not reference any brief or rubric.** Students submit `{title, description, sourceCodeUrl, reportUrl, githubUrl}`; the route never reads the content-defined brief (`routes/project.ts:38-91`). Nothing verifies the project matches the W18–W20 design. [CONFIRMED]
2. **Hardcoded 20-module gate** before project submission (`routes/project.ts:48-56`). Python has exactly 20 modules, so it is not currently breaking, but the gate is hard-coded and contradicts the dynamic-module refactor elsewhere (`quizService.ts:34-35`). [CONFIRMED / [INFERRED] for latent break]
3. **W20 T4 retroactively lists 4 additional projects** that were never assigned/scaffolded — presented as "next steps," this is aspirational scope, not an assessed project. [CONFIRMED — W20 T4]

**Project Quality score:** 3/5.

---

## 15. Industry Relevance Audit

Strong. The toolset taught matches what Python practitioners actually use: `pathlib`, `venv`+`pip`+`requirements.txt`, `requests`, `BeautifulSoup`, `pandas`, `matplotlib`, `argparse`, `pytest`, `pyproject.toml`, type hints. Responsible-scraping ethics, API-first patterns, and the `main()`/`run()` error-boundary structure mirror real CLI design. [CONFIRMED — full read]

**Gaps:** no `asyncio`/async ecosystem (a 2026 gap for FastAPI/aiohttp job roles); no `numpy` (pandas is introduced without its numeric foundation, which limits W14 depth); no git/GitHub workflow anywhere (students build a CLI but are never taught version control — a hard requirement for real Python roles). [CONFIRMED — grep: git/async absent]

**Industry Relevance score:** 4.5/5.

---

## 16. Obsolete/Deprecated Technology Audit

**Nothing obsolete is taught.** [CONFIRMED — full read]
- String formatting correctly prefers f-strings; `.format()` and `%` are mentioned *as legacy* rather than taught. [CONFIRMED — python.ts:230]
- `os.path` is mentioned but `pathlib` is the taught modern API. [CONFIRMED — W16 T1]
- No Python 2 remnants, no `urllib`-as-primary, no `print`-as-statement, no `xrange`. [CONFIRMED]
- `requirements.txt` is taught even though `pyproject.toml` (PEP 621) is also taught for packaging — a defensible dual approach.

Minor: the stdlib tour lists `urllib`/`http` as an alternative to `requests` but never demonstrates it; not obsolete, just dangling.

---

## 17. Duplication Audit

- **Within Python content:** the W3 chapter Q7/Q8 near-duplicate (DB 10843/10844, same falsiness concept, near-identical stems, same quiz) is the clearest intra-course duplication. [CONFIRMED]
- The W15 "show clears the figure" claim appears twice (topic note + module quiz correct option) — a *consistency* duplication of a questionable statement, not content duplication. [CONFIRMED]
- **Cross-course:** the standard-library tour (W13) and general Python idioms do not materially duplicate other courses (C, C++, IoT, SQL, WebDesign, CADD are separate languages/domains). No cross-course duplication of Python content found. [INFERRED — prior course audits]

---

## 18. Consistency Audit

- **Metadata vs content:** DB description says "in Hinglish" while all content is English — a high-visibility inconsistency. [CONFIRMED]
- **Header vs seed:** python.ts header says "15-question final exam"; the seed and DB contain 18. [CONFIRMED]
- **Cross-reference integrity:** W13 promises regex "Section 16"; Section 16 never teaches regex. [CONFIRMED]
- **Naming/style:** topic title casing, code-comment style, and note phrasing are highly consistent across all 80 topics. [CONFIRMED]
- **Grading consistency:** exact-string grading means any future option-text edit changes the correct-answer contract; the annotated-correct-option pattern is applied consistently but to the detriment of question quality. [CONFIRMED — quizService.ts:52]

---

## 19. Feedback Audit

- **Quiz feedback:** none beyond right/wrong + correct-answer reveal. No `explanation` field exists on `QuizQuestion` (schema), so none of the 498 Python quiz questions can explain *why*. [CONFIRMED]
- **Practice feedback:** the global `PracticeQuestion` bank *does* support `explanation` and returns it in the practice breakdown — evidence the platform can do feedback, but it isn't applied to course quizzes. [CONFIRMED — schema.prisma:218; routes/practice.ts:79]
- **Challenge feedback:** the sandboxed challenge runner produces per-assertion pass/fail — high-quality feedback — but is UI-orphaned for Python. [CONFIRMED]
- **Hints:** none in content.
- **Admin feedback:** project/assignment rejection feedback exists but is generic infrastructure, not content-bound. [CONFIRMED]

**Feedback/Learning Support score:** 1.5/5 — the single weakest dimension.

---

## 20. Student Journey Audit

**Entry:** W1–W2 assume zero programming knowledge and ramp gently; the REPL and error-reading mindset are taught before syntax depth. Excellent for a true beginner. [CONFIRMED]

**Middle:** W3–W13 form a coherent language-core spine. The W6 comprehension topic is the first real "aha difficulty" point; W12 (OOP) is the steepest single module. [INFERRED]

**Motivation/gamification:** XP (100, +50 perfect), badges front-loaded to W1 (`week_1_master`), 60% pass. The curve is flat after W1 — no recognition for completing W7/W14/W20. [CONFIRMED — quizService.ts:90-103]

**Gates/blockers:** topic-lock flow requires each topic quiz passed to progress (per the assessment-systems audit); project submission gated on all 20 modules passing. The final exam plays no role in the journey (dead content). Students can complete the course without ever taking a summative assessment.

**Finish:** W20 reviews and points to 4 aspirational projects; certificate flow is generic infra (not audited in depth here).

---

## 21. Assessment Reachability Audit

| Assessment asset | Backend | Frontend | Reachable by students? |
|---|---|---|---|
| Topic quizzes (320) | `quizService.getTopicQuizQuestions` | quiz UI (`Quiz.tsx`, `CourseDetail.tsx`) | ✅ |
| Module quizzes (160) | `getQuizQuestions` | same quiz UI | ✅ |
| Final exam (18) | **none** — zero refs in `backend/src` for `finalExam` | **none** | ❌ **dead content** [CONFIRMED] |
| Interactive challenges (3) | `routes/challenge.ts` + sandbox runner | **none** — zero consumer of `api/challenges/*` | ❌ **UI-orphaned** [CONFIRMED] |
| Projects | `routes/project.ts` | `ProjectStatusCard.tsx` | ✅ (gate = all 20 modules) |

**Consequence:** the platform's most expensive auto-graded assets — a sandboxed Python code runner and a hand-written final exam — are invisible to Python students. There is no reachable summative assessment and no reachable auto-graded coding practice.

---

## 22. Scope / Identity Audit

**Identity:** "Python from first principles to a shipped CLI tool" — the course knows what it is and delivers on that identity. [CONFIRMED]

**Scope control:** The curriculum is disciplined for 20 weeks — fundamentals → data → automation → tool. The two "extra-domain" modules (pandas/matplotlib, scraping) are relevant to the stated data/automation goal and keep a tight scope. W17's ethical-scraping module is a model of scope discipline.

**Scope creep / mismatch:**
- W20 T4's retroactive 4-project list exceeds what the course built.
- OOP is under-scoped relative to its importance (one module).
- No version control taught, yet students are asked to ship a "real tool" — the identity (shipped tool) slightly exceeds the taught skills.

**Scope/Identity score:** 4/5 (identity strong; minor end-of-course scope bleed).

---

## 23. Scorecard + Confidence

### Independent score (0–100) — NOT inherited from the prior 77.25

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Curriculum Architecture | 10 | 8.0 | Excellent 20-week arc; OOP/async under-covered |
| Learning Objectives | 10 | 3.0 | No explicit LO statements anywhere |
| Content Quality | 15 | 11.0 | Strong prose/examples; runnable-crash defects, dead code |
| Technical Accuracy | 15 | 10.0 | PEP 8 false claim, self-import, 2× NameError, `tuple(5,)` false distractor |
| Practical Learning | 10 | 5.0 | Code-rich, but no reachable auto-graded practice |
| Assessment Quality | 10 | 5.5 | Correct counts; no explanations, no shuffle, no summative |
| Question Quality | 5 | 3.0 | 2 live wrong-grading defects + false distractor + duplicates + self-answering pattern |
| LO Alignment | 5 | 2.0 | No LOs to align; recall-heavy assessment |
| Difficulty Progression | 5 | 4.0 | Excellent ramp; steep pandas/OOP steps |
| Industry Relevance | 5 | 4.5 | Modern toolchain; no async, no git |
| Project Quality | 5 | 3.0 | Strong capstone; no rubric binding, retroactive scope |
| Feedback/Learning Support | 5 | 1.5 | No explanations/hints; challenge feedback unreachable |
| **TOTAL** | **100** | **60.5 → 61** | |

### Confidence: **MEDIUM-HIGH**

- **High** confidence in all [CONFIRMED] items: full-file reads of both Python content files (1,800 + 1,820 lines), live-DB verification of inventory counts and each defective question, and reachability greps across `backend/src` and `frontend/src`.
- **Reduced** by: (a) the deployed live site runs GitHub `main`, which may drift from this local `master` tree and local DB — live parity is [UNKNOWN — NOT VERIFIED]; (b) score dimensions like "difficulty progression" are professional judgment, not countable evidence.

### Why the independent score (61) is materially below the prior audit (77.25)

The prior audit explicitly disclosed Python was read "per protocol + spot-checks, NOT full read" (master report). This deep scan reads everything and adds evidence the prior audit did not surface: 3 live defective assessment items (DB-verified), 2 runnable-crash snippets, the self-import anti-pattern, the false `tuple(5,)` distractor, the phantom `re`/stdlib references, the false "Hinglish" metadata, and the full weight of the assessment-infrastructure gaps (no explanations, no randomization, dead final exam, orphaned challenges). The score is not inflated per the audit mandate.

---

## 24. Issue Register

| ID | Severity | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| P-01 | **P1** | DB 10864 / python.ts:342-343 (W4 chapter Q4) | Two logically identical correct options (`18 <= age < 60` and `age >= 18 and age < 60`); grading accepts only the second | [CONFIRMED] DB query; file line | Correct students marked wrong on a live quiz; undermines assessment trust | Rewrite options so exactly one is correct; add explanation |
| P-02 | **P1** | DB 10888 / python.ts:424-425 (W5 chapter Q4) | Correct idiomatic answer `if my_list:` is marked wrong in favor of a verbose self-answering option | [CONFIRMED] DB query; file line | Penalizes students who know the idiom; forces pattern-matching | Set `correctAnswer` to the plain idiom; make other options clean distractors |
| P-03 | **P1** | python.ts:320 (W4 T4) | Runnable snippet references undefined `age`, `user` → `NameError` | [CONFIRMED] file line; DB Topic 1285 | Copy-paste teaching code crashes; beginner confusion | Define `age`/`user` before use (e.g., from `input()`) |
| P-04 | **P1** | python.ts:1536 (W19 T2) | Orchestration example calls undefined `format_summary` → `NameError` | [CONFIRMED] file line | Central capstone snippet crashes if run | Add `from report import format_summary` or inline a stub |
| P-05 | **P1** | python.ts:1037-1038 (W13 T1) | Self-import `import greeting` inside the file that defines `greeting` | [CONFIRMED] file line; DB Topic 1318 | Teaches a confusing non-pattern; the intended cross-file demo is commented out | Restructure to two clearly-separated files |
| P-06 | **P2** | Assessment infra (platform-wide) | 498 Python quiz questions have no explanation field; post-submit feedback is right/wrong only | [CONFIRMED] schema.prisma:137-151; quizService.ts:52-64 | No learning from mistakes | Add `explanation` to QuizQuestion + content + UI |
| P-07 | **P2** | Quiz randomization (platform-wide) | Topic-quiz "randomization" is a no-op; module quizzes and options never shuffled | [CONFIRMED] quizService.ts:336-338, 17-19 | Retakes = identical order → pattern learning | Real draw from a larger bank, or shuffle options; document "serve all 4" |
| P-08 | **P2** | Final exam (18 Qs) | Final-exam questions are dead content — no route/UI refs anywhere | [CONFIRMED] grep; schema.prisma:302-313 | No summative assessment exists for the course | Give final exam a route + certificate gating, or remove dead table |
| P-09 | **P2** | Challenges (3 Python) | Sandboxed auto-graded Python challenges are UI-orphaned — students can't reach them | [CONFIRMED] challengeSeedData.ts:1-3,136-184; frontend grep | Most expensive assessment asset is invisible | Build challenge UI + wiring; extend seeds beyond W1 |
| P-10 | **P2** | python.ts:230 (W3 T2) | "PEP 8 suggests single quotes" — false | [CONFIRMED] file line | Teaches an invented rule | Replace with the real PEP 8 guidance (consistency; escape/quote choice) |
| P-11 | **P2** | python_topic_quizzes.ts:697-701 (W8 T2 Q1) | Distractor D asserts `tuple(5,) is also fine` — false (`tuple(5)` raises TypeError) | [CONFIRMED] DB 10949; file line | Misinforms; false content in a live question | Replace distractor with a valid option |
| P-12 | **P2** | python.ts:1043ff (W13 T1) | Stdlib tour promises `re` (regex) "Section 16"; Section 16 never teaches regex; `datetime`/`statistics`/`urllib` also never demonstrated | [CONFIRMED] file lines; grep = 0 regex mentions | Dangling forward-reference; learners expect material that never comes | Add a regex topic or remove the promise |
| P-13 | **P2** | Course metadata (DB) | DB description still claims "in Hinglish"; all content is English; reseed only sets description on create | [CONFIRMED] DB query; seed.ts:71; reseed_python_full.ts:36-45 | False/misleading metadata on the course listing | Update description; make reseed upsert description |
| P-14 | **P2** | W3 chapter Q7/Q8 (DB 10843/10844) | Two near-identical falsiness questions in the same quiz | [CONFIRMED] DB query | Redundant assessment; wastes a question slot | Replace one with a different concept or reword |
| P-15 | **P2** | W20 T4 | Retroactively lists 4 projects never assigned/scaffolded | [CONFIRMED] file line | Scope mismatch at course end | Either scaffold the projects or reframe as optional next steps |
| P-16 | **P2** | routes/project.ts:48-56 | Hardcoded 20-module project gate contradicts dynamic-module refactor | [CONFIRMED] file lines; quizService.ts:34-35 | Latent break for any ≠20-module course; for Python currently OK | Share a dynamic module-count helper |
| P-17 | **P3** | python.ts:238 (W3 T4) | `print(age := 18, age >= 18)  # True` — comment misleading; output is `18 True` | [CONFIRMED] file line | Minor confusion in a walrus demo | Fix the inline comment |
| P-18 | **P3** | python.ts:74 (W1 T4) | `count_domains()` demo guarded by `if False`; function never executes | [CONFIRMED] file line | Dead code in a student-facing sample | Remove the guard or run it on sample input |
| P-19 | **P3** | python.ts:1202, 1239-1240 (W15 T1) | "show clears the figure" — oversimplified, backend-dependent | [CONFIRMED] file lines | Teaches a folk model of matplotlib | Rephrase: `savefig` before `show`; figures close with the window |
| P-20 | **P3** | python.ts:6 (header) | Header claims "15-question final exam"; actual is 18 | [CONFIRMED] file line + DB count | Stale documentation | Fix header |
| P-21 | **P3** | Quiz grading (platform-wide) | Exact-string grading `userAnswer === q.correctAnswer` ties correctness to option text verbatim | [CONFIRMED] quizService.ts:52 | Fragile if option text edited; note in content-maintenance docs | Grade by option index/id, or normalize strings |

**Counts:** P0 = 0 · P1 = 5 · P2 = 11 · P3 = 5.

---

## 25. Recommended Improvement Opportunities

1. **Fix the three live defective questions and the two crashing snippets first** (P-01…P-05) — they are reachable student-facing defects with a high trust cost per fix-hour.
2. **Add an `explanation` field to `QuizQuestion`** and author explanations for Python's 498 questions (P-06) — the single highest-leverage learning-quality improvement; the platform already supports explanations on `PracticeQuestion`.
3. **Turn the challenge engine and final exam on** (P-08, P-09): wire a challenge UI for the 3 existing Python exercises and extend seeding beyond W1; give the final exam a route and gate it on course completion. This converts the two most expensive dormant assets into the missing summative + auto-graded practice layers.
4. **Introduce explicit learning objectives** (per topic/module) with a visible LO→assessment mapping; this would lift both Learning Objectives (10) and LO Alignment (5) materially.
5. **Add a regex topic** (or remove the W13 promise) and consider a light async module to close the modern-skill gap.
6. **Fix metadata** (P-13): update the DB description to the reseed's intended English copy and make reseeding upsert descriptions.
7. **De-duplicate and de-annotate quiz options** (P-11, P-14, plus the systemic self-answering pattern) so correct answers are not identifiable by length.
8. **Update the project gate to a shared dynamic module-count helper** (P-16).

---

## 26. Unknowns / Missing Evidence

| Item | Status |
|---|---|
| Live deployed site parity with this local tree | [UNKNOWN — NOT VERIFIED] — live runs GitHub `main`; local master may differ; DB audited is local |
| Whether any student has actually hit the defective questions (10864/10888) in production | [UNKNOWN — NOT VERIFIED] — no production analytics access |
| Whether the stale "Hinglish" description affects enrollment | [UNKNOWN — NOT VERIFIED] — marketing impact not measurable |
| Per-question difficulty/IRT statistics for the 498 questions | [UNKNOWN — NOT VERIFIED] — no telemetry on item difficulty |
| Whether the "no-op randomization" was intended (serve-all-4) or a bug | [INFERRED] — comment implies a bank was intended; actual data has exactly 4/topic |

---

## 27. Final Verdict

**CONDITIONAL PASS (major defects must be fixed).**

The Python course is the platform's best-written curriculum — coherent, well-scoped, accurate on fundamentals, and industry-relevant — and its inventory is complete and consistent. It is held back from "good" by (a) five P1 student-facing defects (3 live wrong-grading assessment items, 2 crashing snippets, 1 self-import anti-pattern), (b) an assessment layer that provides no explanations, no randomization, no reachable summative exam, and no reachable auto-graded practice, and (c) the absence of any formal learning objectives, which caps both the Learning Objectives and LO-Alignment dimensions.

Independent score: **61/100** (confidence: medium-high). The prior audit's 77.25 is not inherited; the delta is explained by full-file reading surfacing defects that a spot-check audit could not see.

**Ship-blockers before the course can be called "good":** P-01, P-02, P-03, P-04, P-05. Everything else is an enhancement toward "excellent."

---

## Improvement Candidates — NOT YET APPROVED

*(Decision phase follows: each candidate → KEEP / FIX / REWRITE / RESTRUCTURE / REMOVE / ADD / MODERNIZE / DEPRECATE. Nothing here is implemented.)*

| # | Candidate | Type | Rationale (evidence-backed) |
|---|---|---|---|
| IC-1 | Fix DB 10864 (W4 Q4 two correct answers) | FIX | P-01; live wrong-grading |
| IC-2 | Fix DB 10888 (W5 Q4 idiom penalized) | FIX | P-02; live wrong-grading |
| IC-3 | Fix python.ts:320 undefined `age`/`user` | FIX | P-03; crashing snippet |
| IC-4 | Fix python.ts:1536 undefined `format_summary` | FIX | P-04; crashing snippet |
| IC-5 | Fix python.ts:1037 self-import | FIX | P-05; anti-pattern |
| IC-6 | Add `explanation` to QuizQuestion + author for 498 Python Qs | ADD | P-06; highest-leverage learning gain |
| IC-7 | Real quiz randomization (draw from bank / shuffle options) | FIX | P-07 |
| IC-8 | Wire final exam to a route + gate on completion, or REMOVE table | ADD / REMOVE | P-08 |
| IC-9 | Build challenge UI for 3 Python exercises; extend seeds past W1 | ADD | P-09 |
| IC-10 | Introduce explicit per-topic LOs + LO→assessment map | ADD | lifts Learning Objectives & LO Alignment |
| IC-11 | Add regex topic (or drop W13 promise) | ADD / FIX | P-12 |
| IC-12 | Consider async/await module; git/GitHub workflow | ADD | industry gap (2026) |
| IC-13 | Update DB description; reseed upsert metadata | FIX | P-13; false "Hinglish" claim |
| IC-14 | De-duplicate W3 Q7/Q8; replace false `tuple(5,)` distractor | FIX | P-11, P-14 |
| IC-15 | De-annotate/self-answering correct options across topic quizzes | REWRITE | systemic question-quality pattern |
| IC-16 | Deepen W12 OOP or RESTRUCTURE across 2 modules | RESTRUCTURE | coverage gap |
| IC-17 | Scaffold the 4 W20 projects or reframe as optional | FIX | P-15 |
| IC-18 | Replace hardcoded 20-module project gate with dynamic helper | FIX | P-16 |
| IC-19 | Correct W15 "show clears the figure" | FIX | P-19 |
| IC-20 | Fix W1 `if False` dead demo and W3 walrus comment | FIX | P-17, P-18 |

---

*Audit-only. No product content, seed file, database record, source code, or schema was modified. All findings verified read-only against the local `nexus` database and the repo tree; live-site parity remains unverified.*

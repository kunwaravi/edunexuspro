# EduNexus Pro — Content Quality Audit · Python Programming & Scripting

**Phase:** Content Quality & Curriculum Audit (MASTER PLAN v1.0) · **STEP 4** — representative-course deep audit
**Course:** `python` — "Python Programming & Scripting — Deep GfG-Style Curriculum"
**Source of truth (live):** `backend/prisma/content/python.ts` (20 sections, 80 topics, 160 chapter quizzes, 18 final-exam questions) + `backend/prisma/content/python_topic_quizzes.ts` (80×4 = 320 topic-quiz questions)
**Evidence labels:** ✅ CONFIRMED (read directly in source) · 🔶 INFERRED (reasonable reading, not verified) · ⚪ UNKNOWN / NEEDS EXTERNAL VERIFICATION
**Audit-only.** No content, code, schema, or data was modified. All read-only.

Companion docs: `docs/content-quality-audit-cpp.md` (same audit, C++ course); `docs/content-source-audit.md` (pipeline/inventory baseline).

---

## A. Overview

The Python course is the general-purpose member of the catalog: identical in shape to the C++ exemplar (20 modules, 80 topics, 4 topics/module, 160 chapter quizzes, 320 topic quizzes, 18 final-exam questions). It is positioned as a deep, self-study Python sequence running from "Why Python" (W1) to an installable, pytest-tested CLI tool (W20), with a data/web/automation middle arc (W14–W17). It is the catalog's most modern-ecosystem course: venv/pip, type hints, ruff/black/mypy, pytest, pyproject.toml, requests/BeautifulSoup, pandas/matplotlib, and argparse are all taught.

The course is technically strong and unusually current for a beginner track, but it shares the catalog-wide structural gaps: no learning-objective layer, no in-content graded exercises/assignments, and an assessment suite that is recall-heavy with a small number of genuine item defects. The single most distinctive weakness vs. the C++ course is a *deliberately retroactive* project portfolio (W20 lists four projects that are never assigned or scaffolded in their own weeks).

---

## B. Course Structure

| Metric | Value | Evidence |
|---|---|---|
| Modules (weeks) | 20 | `python.ts:39-1679` |
| Topics | 80 (exactly 4/week) | all sections, full read |
| Median lesson length | 226 words (min 193 / max 288) | inventory (given) |
| Topics with code | 80 / 80 (100%) | ✅ every topic has a `code` field |
| Topics with note | 80 / 80 (100%) | ✅ every topic has a `note` field |
| Chapter quizzes | 160 (8/week) | ✅ full read of all 20 quizzes arrays |
| Topic quizzes | 320 (exactly 4/topic) | `python_topic_quizzes.ts:20-1820`, full read |
| Final exam | 18 questions | `python.ts:1684-1800` (see E-4 for header-count mismatch) |

**Sequence (all 20 weeks, from `python.ts`):**
1 Introduction & Python philosophy → 2 Install, IDE & first script → 3 Variables & basic types → 4 Operators & expressions → 5 Conditionals (if/elif/else) → 6 Loops & comprehensions → 7 Functions, args & scope → 8 Lists & tuples → 9 Dictionaries & sets → 10 String handling & file I/O → 11 Exception handling → 12 OOP → 13 Modules, packages & pip → 14 Pandas → 15 Matplotlib → 16 File/script automation → 17 Web scraping → 18 Project planning (CLI) → 19 Building the CLI → 20 Packaging, testing & review.

**Structural integrity:** ✅ CONFIRMED a legitimate pedagogical climb (syntax → control flow → functions → containers → files/exceptions → OOP → modules → data → web → engineering). No orphan topics; every topic title has an exactly-4-question topic quiz key in `python_topic_quizzes.ts` (keys match titles exactly; the file header at `python_topic_quizzes.ts:8-11` documents the exact-title-key contract).

---

## C. Learning Objectives

- **No explicit per-topic objectives exist.** Topics expose only `{title, text, code, note}` (`python.ts:12-17`); sections expose `{week, title, description, topics, quizzes}` (`python.ts:25-31`). There is no "By the end of this topic you will be able to…" layer, no Bloom's taxonomy tags, and no objectives table anywhere. ✅ CONFIRMED by full read.
- The one-line `description` per section (e.g., `python.ts:46-47`) functions as an informal intent statement, not a measurable objective.
- **No objectives → assessment mapping exists.** Alignment is implicit: quizzes test what lessons teach (verified, see §J), but nothing declares which objective a given question measures, and nothing maps objectives to the project portfolio.
- **Severity:** P1 structural gap — catalog-wide authoring convention (identical finding to the C++ audit), but it directly caps the F criterion (10%) for every course.

---

## D. Lesson Quality

**Strengths (all ✅ CONFIRMED by full read of all 80 topics):**
- Prose is consistently clear, confident, and well-organized (bold-led claim, then mechanism, then "why it matters"). Examples: the `//`/`%` pairing mnemonic ("`a // b` answers 'how many full groups', `a % b` answers 'what is left over'", `python.ts:298`); the list-vs-tuple shortcut ("a list is a collection of things; a tuple is one thing with parts", `python.ts:647`).
- Every topic has a code sample and a 1-line `note` distilling the lesson. Notes are consistently actionable, not decorative.
- Pitfalls are taught explicitly and honestly: mutable default args (`python.ts:551`), `0.1 + 0.2` float quirk (`python.ts:223`), `b = a` copy trap (`python.ts:626`), `sort()` returning `None` (`python.ts:633`), `int(3.9)` truncation (`python.ts:313`), EAFP vs LBYL race (`python.ts:893`). This is real instructional craft.
- Scope is appropriate per RULE 7: median 226 words is dense but not padded; no lesson is a wall of text, none is a stub.
- Cross-references are used well ("Section 11", "Section 19") to build a growing dependency graph.

**Weaknesses:**
- 🔶 A handful of code samples are fragments or skeletons that would not run standalone, several without any guard: W4 T4 references undefined `age`/`user` (`python.ts:320`, §E-2); W13 T1 `import greeting` inside a file that is *itself* the module (`python.ts:1037-1038`, §E-5); W19 T2 calls undefined `format_summary` (`python.ts:1536`, §E-5). For a course whose pedagogy is "run the example", runnability is a quality lever.
- 🔶 W14–W15 (pandas/matplotlib) sample code uses `df["name"]`/`plt.show()` patterns correctly, but the W14 T1 text contains `df = pd.read_csv("students.csv")` presented as the load step without a real file in the running examples — an acceptable teaching abstraction, but the reader must supply data.
- Minor: W3 T4 code `print(age := 18, age >= 18)  # True` prints `18 True`; the inline comment "True" describes only the second value (`python.ts:238`). Cosmetic.

---

## E. Technical Accuracy

Verified against current Python 3 semantics (3.8–3.13 behavior) across the full read. Representative ✅ CONFIRMED-correct items:
- `-7 // 2 == -4` (floor toward −∞, not toward zero) (`python.ts:299`; topic quiz `python_topic_quizzes.ts:293-296`).
- `/` always returns float; `//` floors; `%` remainder (`python.ts:223`).
- `0.1 + 0.2 == 0.30000000000000004`; `decimal.Decimal("0.1") + Decimal("0.2")` exact (`python.ts:223-224`).
- `round(2.5) == 2` (banker's rounding to nearest even) (`python.ts:313`); `int(3.9) == 3` (truncate toward zero) (`python.ts:313`).
- `2 ** 3 ** 2 == 512` (** is right-associative) (`python.ts:320`).
- Truthiness: `False, None, 0, 0.0, "", [], (), {}, set()` falsy; `"0"`, `[0]`, `" "` truthy (`python.ts:385-387`).
- `bool` is a subclass of `int`; `True == 1`, `False == 0` (`python.ts:237`).
- Strings immutable; methods return new strings (`python.ts:230`).
- `range(5)` yields 0–4 (stop exclusive) (`python.ts:462`); `enumerate(start=...)`, `zip` stops at shortest (`python.ts:481-483`).
- Mutable-default trap; `*args` → tuple; `**kwargs` → dict (`python.ts:551-553`).
- LEGB resolution order (`python.ts:565`); assignment inside function creates local (`python.ts:566`).
- `b = a` aliases; `b = a[:]` shallow copy; `deepcopy` for nested (`python.ts:626-628`).
- `sort()` mutates and returns `None`; `sorted()` returns new list (`python.ts:633-635`).
- Tuple hashability for dict keys; `(5,)` one-element tuple (`python.ts:640-642`).
- Dict insertion-order preservation; `dict[key]` raises `KeyError`; `.get(key, default)`; `|` merge (3.9+) (`python.ts:707-716`).
- `Counter.most_common`, `defaultdict(list)` auto-create (`python.ts:729-731`).
- `f"{price:.2f}"`, `f"{name:>10}"`, `f"{0.8345:.1%}"`, `f"{42:05d}"`, `f"{score = }"` debug f-string (3.8+) (`python.ts:230, 797`).
- `with open(...)` auto-close; `encoding="utf-8"` explicit; `"w"` truncates, `"a"` appends, `"x"` exclusive-create (`python.ts:802-813`).
- Exception hierarchy: `ZeroDivisionError` ⊂ `ArithmeticError`; catching `Exception` catches subclasses; first `except` match wins (`python.ts:877-881`).
- `@property` read-only + setter validation; `_name` private-by-convention; `__name` name-mangling (`python.ts:961-964, 975`).
- `if __name__ == "__main__":` guard semantics (`python.ts:1036`).
- pandas boolean-mask filtering with `&` and per-condition parentheses (`python.ts:1132`); `df.isnull().sum()`; `groupby(...)[col].agg([...])`; `pivot_table` (`python.ts:1139-1141`).
- `plt.savefig` before `plt.show()`; `plt.style.use("seaborn-v0_8")` (current matplotlib; the legacy `"seaborn"` style is deprecated) (`python.ts:1200-1202, 1223`).
- `Path.glob` vs `rglob`; `/` path joining (`python.ts:1282-1284`).
- HTTP status semantics: 200/301-302/403/404/429/500 (`python.ts:1364`); `r.raise_for_status()`; `r.json()` (`python.ts:1378, 1385`).
- argparse: `required=True`, `type=float`, `action="store_true"`, auto `--help`, `sys.exit(2)` for usage errors (`python.ts:1527-1529`).
- pytest discovery (`test_*.py` / `test_*`), `@pytest.mark.parametrize` (`python.ts:1609-1611`).
- ruff/black/mypy/pytest toolchain (`python.ts:1617`); `pyproject.toml` `[project.scripts]`; `pip install -e .` editable install (`python.ts:1623-1626`).

**Issues found (5):**

**E-1 · PEP 8 quote recommendation is inaccurate — P3, ✅ CONFIRMED**
`python.ts:230` (W3 T3 "Strings & f-Strings") states: *"Use one style consistently (PEP 8 suggests single quotes)".* PEP 8's String Quotes section says single- and double-quoted strings are the same and explicitly makes **no recommendation** — it says "Pick a rule and stick to it." The claim as written is wrong. (Verified against PEP 8 text; external confirmation is possible via python.org/dev/peps/pep-0008.)

**E-2 · W4 T4 code sample has undefined variables — P2, ✅ CONFIRMED**
`python.ts:320` (W4 "Expression Evaluation & Operator Precedence") code block ends:
```python
# Parentheses say what you mean:
allowed = (age >= 18) and (user is not None)
print(allowed)
```
`age` and `user` are never defined in the snippet. If run as-is this raises `NameError`. The surrounding chapter topic does not define them. This is a runnable-example defect in a course whose pedagogy is "run the example".

**E-3 · "show clears the figure" is an oversimplification — P3, ✅ CONFIRMED / 🔶**
`python.ts:1202` (W15 T1) note and chapter quiz (`python.ts:1239-1240`) teach *"savefig must run BEFORE show() — show clears the figure."* The directive (savefig before show) is correct and standard, but the stated mechanism is a simplification: in modern matplotlib the figures are not necessarily destroyed by `plt.show()`; with non-interactive backends `show()` is effectively a no-op. Teaching "show clears the figure" risks confusing learners when they try `plt.savefig` after `show()` on a retained figure. Pedagogically safe, mechanically imprecise.

**E-4 · Header comment "15-question final exam" vs 18 actual — P3, ✅ CONFIRMED**
`python.ts:6` says *"Plus a 15-question final exam."* The shipped `pythonFinalExam` has 18 questions (`python.ts:1684-1800`, full read). Inventory (given) also reports 18. Minor documentation mismatch in the file's own header.

**E-5 · Two code samples would not run standalone — P2, ✅ CONFIRMED**
- `python.ts:1037-1038` (W13 T1 "Modules & the import Statement"): the code block defines `greeting.py` content and then runs `import greeting` / `greeting.hello("Avi")` *in the same file*. Executing that file as a script would either fail (if the file isn't named `greeting.py`) or import itself under a different module name than `__main__` — it does not cleanly demonstrate module import. The pedagogical intent is clear (two files), but the sample as shipped is not the two-file setup it claims.
- `python.ts:1536` (W19 T2 "Orchestrating the Pipeline"): code block calls `print(format_summary(data))` where `format_summary` is not defined; the inline comment says *"hypothetical clean output"*. The sample is a skeleton; it would raise `NameError` if run. (The *other* W19 T2 code block at `python.ts:1535` — with `load_expenses`, `total_by_category`, etc. — is a correct full-flow illustration, though it depends on the student's own modules from W18.)

RULE 4/5: no "outdated" claims are made anywhere in E beyond the verified PEP 8 nit; nothing is flagged as obsolete without a citation.

---

## F. Practical Learning

- ✅ Code-first pedagogy: 80/80 topics carry code, and examples are overwhelmingly runnable and idiomatic (walrus, comprehensions, f-strings, `dict.get`, `try/except`, `Counter`). Many snippets are directly usable in the REPL (`python.ts:53`, `python.ts:224`).
- ✅ The course is genuinely project-oriented in *intent*: W18–W20 build one coherent artifact (an expenses CLI) end-to-end — requirements → design → tasks → argparse → error strategy → manual test table → pytest → packaging.
- ❌ **No in-content graded practice exists.** Practice = quizzes only. There is no exercise-with-solution layer, no coding checkpoint, no "try this" prompt, and no feedback beyond the correct answer. A grep for exercise/practice/challenge/assignment terms returns only incidental prose. ✅ CONFIRMED.
- ❌ The W20 "project portfolio" (`python.ts:1631`) retroactively lists four projects (number-guessing game W5, dataset analysis W14-15, file organizer W16, price monitor W17, expenses CLI W18-20) — but none is *assigned* in its own week with a deliverable, starter file, or rubric. They are described as outputs the learner "now has", without having been set as tasks.
- RULE 9 note: D is docked for what is MISSING (a practice/assessment loop), not for the present content, which is strong.

---

## G. Assignments

**None defined in the content.** `python.ts` contains only sections/topics/quizzes/final-exam; there is no assignment array, prompt, rubric, or solution anywhere in either file. ✅ CONFIRMED by full read. (Identical catalog-wide finding to the C++ audit; the platform-level Assignment/Project submission subsystem is out of scope for this content audit — STEP 8.)

---

## H. Projects

One coherent project artifact is scaffolded in-content: the **expenses CLI** (W18–W20). It is the strongest project design in the catalog:
- W18 T1 requirements/user stories/MoSCoW with a `requirements.md` sample (`python.ts:1445-1448`).
- W18 T2 module split (loader/analysis/report/expenses) with typed signatures (`python.ts:1453-1455`).
- W18 T3 an 8-task breakdown with time estimates and concrete "done" checks (`python.ts:1460-1462`).
- W18 T4 testability design (pure core, injected deps, deterministic inputs) with a working `StringIO`-based test (`python.ts:1467-1469`).
- W19 argparse, orchestration, error messages, manual edge-case table (`python.ts:1527-1551`).
- W20 pytest, toolchain, pyproject.toml packaging (`python.ts:1609-1626`).

**Weaknesses (✅ CONFIRMED):**
- The actual code for the project is *fragmented*: W19 T2's illustrative snippet is explicitly hypothetical (§E-5), and there is no single assembled, runnable project file and no starter/final code. A self-study learner must reconstruct the pieces from prose across six topics.
- No deliverable/submission/assessment is wired to the project in content (see §F).

The other three "projects" (number game, dataset analysis, file organizer, price monitor) are only named retroactively in W20 T4 (`python.ts:1631`); the file-organizer and price-monitor do have full working code in their own weeks (`python.ts:1303-1305`, `python.ts:1378-1379`), but the number game and dataset analysis have no assignment prompt at all.

---

## I. Quiz Quality

**Volume & format:** 498 questions total (160 chapter + 320 topic + 18 final). Every question is 4-option, exactly 1 correct (`python.ts:19-23`, `python_topic_quizzes.ts:14-18`). Every topic has exactly 4 topic questions. ✅ CONFIRMED by full read.

**Uniqueness (given + spot-checked):**
- Cross-course duplicate question texts: **0** (given). Within-course duplicate question texts: **0** (given).
- Chapter-vs-topic quiz *text* overlap: **0** ✅ — the warning at `python_topic_quizzes.ts:9-11` is honored.
- ⚠️ However, near-duplicate *concepts* between chapter and topic quizzes in the same week do occur (see §N). Because the week endpoint returns topic + chapter questions together (`python_topic_quizzes.ts:9-11`), a student can be asked the "dynamically typed" and "falsy" facts twice in the same module in nearly identical wording.

**Distractor quality — mixed (🔶):**
- Strong distractors exist and are genuinely plausible: e.g., W1 chapter Q6 "Kernel development in C" as the non-Python domain (`python.ts:105-107`); W3 topic quiz `type(x)` vs `typeof(x)` vs `kind(x)` vs `class(x)` (`python_topic_quizzes.ts:219-222`).
- Many distractors are *absurd/filler* and make the correct answer trivially identifiable: "a music player", "a web browser", "Excel", "Photoshop", "a game engine", "a font" as editor options (`python_topic_quizzes.ts:135-154`); "it is written in English", "it has no variables" (`python_topic_quizzes.ts:23-27`); a large share of options are just `"an error"`, `"nothing"`, `"None"`. These under-exercise discrimination.

**Cognitive level (🔶, full read):** Majority are recall/definitional (Bloom L1); a solid minority are application/trace (predicting output), e.g., W6 topic Q3 `continue` trace (`python_topic_quizzes.ts:505-509`), W8 chapter slicing, and several final-exam items (loop sum, inheritance override, `sort()` mutation). Very few require composing code or multi-step reasoning; no scenario/integrative item exists in the chapter/topic banks.

**Item defects (✅ CONFIRMED):**

**I-1 · W4 chapter Q4 has two logically identical correct answers — P2, ✅ CONFIRMED** (`python.ts:341-344`)
Stem: *"The correct way to test 'age is between 18 and 60 inclusive of 18' is…"* Options: `18 <= age < 60` (A), `age >= 18 and age < 60 (chained is fine too)` (B, marked correct), `age > 18 and age <= 60` (C), `age between 18 60` (D). A and B are mathematically the same predicate ([18, 60)). A is also correct, so the item has two correct answers and the stem is ambiguous about the upper bound. A discriminating learner gets full marks for either; a test engine would mark A wrong.

**I-2 · W5 chapter Q4 answer key contradicts its own correct option — P2, ✅ CONFIRMED** (`python.ts:423-426`)
Stem: *"The idiomatic way to check if a list is empty is…"* Options: `if list == 0` (A), `if my_list:` (B), `if len(my_list) == 0 (also works, but if my_list: is the idiom)` (C), `if my_list is None` (D). The marked correct answer is **C**, but C's primary text is `len(my_list) == 0` — which the stem explicitly asks to avoid ("idiomatic"), and the parenthetical concedes the real idiom is `if my_list:`. A student who knows the material picks **B**, which the key would mark wrong. Scoring-vs-intent mismatch; the correct option should be B.

**I-3 · W3 chapter Q7 and Q8 are the same question — P3, ✅ CONFIRMED** (`python.ts:274-282`)
Q7: "Which of these values is FALSY in Python?" (answer `""`) and Q8: "Which of these values is falsy?" (answer `0`) test the identical concept in the same 8-question bank. The file header promises "8 distinct chapter quizzes" (`python.ts:5`); these two are not distinct.

**I-4 · Verbose, self-answering options — P3 (🔶)**
Several topic-quiz options embed the explanation *inside the option* and then mark that option correct, e.g. `python_topic_quizzes.ts:241-244` (`3 // 2 — but that is floor division, giving 1` as the only full-sentence option) and `python_topic_quizzes.ts:697-699` (`(5,)` vs `tuple(5,) is also fine but (5,) is the common form`). The correct answer is often the longest or the only one with a parenthetical, making the key self-evident.

---

## J. Assessment Alignment (RULE 16 — against what was actually taught)

- **Chapter/topic quizzes ↔ lessons:** ✅ Strong. Verified across the full read — questions test content explicitly taught in the same week (W1 quiz tests readability/REPL/Zen taught in W1 topics; W7 quizzes test defaults/`*args`/LEGB taught in W7; W14 quizzes test read_csv/head/describe/groupby taught in W14; W20 quizzes test pytest/mypy/pyproject taught in W20). No question requires un-taught material (except the I-1/I-2 defects which are within-taught facts, mis-keyed).
- **Final exam ↔ course:** ✅ Strong. All 18 items map to taught content: f-strings (W3/W10), slicing (W8), `range`/loop sum (W6), comprehension (W6), default param (W7), tuple-vs-list (W8), `dict.get` (W9), set union (W9), `strip().split()` (W10), `finally` (W11), inheritance override (W12), `__main__` guard (W13), pandas mask (W14), HTTP 429 (W17), `with open` (W10), `requests.get().json()` (W17), `sort()` mutation (W8), pure function (W18). Nothing is off-syllabus.
- **Coverage balance:** The 18-item final samples 13 of 20 weeks; omitted weeks (W2 install/editor, W5 conditionals, W7 *functions* as a group, W13 pip/venv, W15 plotting, W16 pathlib/os, W19 argparse, W20 packaging) are the more procedural ones. Acceptable for a summative MCQ; the C++ audit's "too thin" criticism applies equally here (18 MCQs for 20 weeks).

---

## K. Industry Relevance

✅ CONFIRMED — the strongest dimension of this course. The title list covers nearly the entire modern beginner-to-intermediate Python ecosystem:
- **Environments & packaging:** venv + pip + requirements.txt + pinning (`python.ts:1049-1053`); `pyproject.toml` + `[project.scripts]` + `pip install -e .` (`python.ts:1623-1626`).
- **Typing & tooling:** type hints `list[dict]`/`dict[str, float]` (3.9+ syntax), mypy, ruff, black, pytest, docstrings (`python.ts:1453, 1617-1619`).
- **Data stack:** pandas (read_csv, info/describe, mask filtering, groupby, pivot_table) and matplotlib (line/bar/hist/scatter, subplots, styles) (`python.ts:1117-1141, 1199-1223`).
- **Web data:** requests + BeautifulSoup + status codes + rate-limit etiquette + robots.txt + API-first doctrine (`python.ts:1364-1387`).
- **Automation:** pathlib, os/env vars, subprocess, CSV/JSON, shutil file organizer (`python.ts:1282-1305`).
- **Current language features:** f-string debug `=`, dict `|` merge, walrus, `list[str]`, `seaborn-v0_8`, `Path` — all 3.8–3.13-era. ✅ No Python-2-era syntax anywhere (`print` statement, `xrange`, `raw_input`, `.iteritems()` — none present).

**Gap:** async/await/asyncio is entirely absent (grep: zero matches). For a course that targets web backends (Flask/FastAPI is the recommended next step at `python.ts:1631`), async is a defensible omission at beginner level but a real gap for the stated "next step". Also absent: `dataclasses` (modern class boilerplate) — minor.

---

## L. Beginner Experience

✅ Generally excellent for a motivated beginner:
- Empathetic ramp: W1 starts with "why", W2 covers install/editor/errors before any serious syntax, and common beginner bugs are named in every early week ("read tracebacks bottom-up", `python.ts:155-157`).
- The REPL-first pedagogy (`python.ts:57-59`) is exactly right for novices; `print()` as a debugging tool is instilled early and reinforced through W20.
- 🟡 The volume is high but reasonable: 4 topics/week ≈ 900 words + 12 quiz questions/week. No adaptive difficulty or remediation path exists in content (platform concern, not content).
- 🔶 Two friction points for self-study beginners:
  1. **W13 pip/venv arrives late** and is prose-heavy — the terminal workflow (activate, `which python3`, `pip install -r`) is a real hurdle for true beginners and is covered before any third-party usage is needed (pandas is W14).
  2. **Multi-file imports (W18-20)** assume the student can manage a `loader.py`/`analysis.py`/`report.py` package layout and run from the right working directory; the course never explicitly teaches the module search path or "run from the project root" discipline. A beginner following the W19 orchestration snippet (`from loader import load_expenses`, `python.ts:1535`) can hit silent `ModuleNotFoundError` confusion.

---

## M. Missing Content (RULE 9 — CONTENT MISSING, with severity)

| Gap | Severity | Note |
|---|---|---|
| **Exercises/assignments layer** (no practice prompts, no solutions, no coding checkpoints) | P1 | Catalog-wide; the course *tells* learners to build four projects but never *assigns* them (§F, §H) |
| **async/await / asyncio** — zero coverage | P1/P2 | The course's own next step is Flask/FastAPI (`python.ts:1631`); modern Python web/IO is async-first. Defensible to defer, but it is the biggest modern-ecosystem hole |
| **Git version control** — only incidental mentions (editor terminal `python.ts:141`, set example `python.ts:722`, `.gitignore` `python.ts:1624`) | P2 | No lesson on init/commit/branch despite "professional toolchain" framing in W20 |
| **Regular expressions** — `re` is *listed* in the stdlib menu (`python.ts:1043`) with a forward-reference "Section 16" that never teaches it | P2 | PRESENT-BUT-MISSING: named, promised, not delivered |
| **`dataclasses`** (modern OOP boilerplate) | P2/P3 | Natural complement to W12 OOP and W20 typing story |
| **Debugging tools (`pdb`) and `logging` module** — only print-debugging is taught | P3 | `logging` appears only as a word in the decorator example prose (`python.ts:1057`) |
| **numpy** — mentioned only in W20 next-steps | P3 | Acceptable; course is explicitly pandas/matplotlib-scoped |
| **unittest** — pytest only | P3 | Acceptable modern choice |

---

## N. Redundant Content

- ✅ **Within-course duplicate question texts: 0** (given). Cross-course duplicate texts: 0 (given).
- ⚠️ **Near-duplicate concepts in the same module:**
  - W3 chapter Q7 & Q8 are the same "which value is falsy" question (§I-3), `python.ts:274-282`.
  - W3 topic quiz "Python is DYNAMICALLY typed" (`python_topic_quizzes.ts:209-212`) vs W3 chapter Q2 "Python is dynamically typed" (`python.ts:249-252`) — same fact, near-identical wording, both served together in W3.
  - Final exam Q14 (429 status, `python.ts:1766`) vs W17 chapter Q1 (`python.ts:1392`) vs W17 topic quiz Q3 (`python_topic_quizzes.ts:1475-1477`) — the same fact three times in near-identical wording.
  - Final exam Q2 (slicing, `python.ts:1691`) vs W8 chapter Q1 (`python.ts:654`) — same fact.
- 🔶 **Spaced reinforcement that is defensible (RULE 7-style, not penalized):** the `0.1 + 0.2` float quirk appears in W3 T2 text, W3 chapter Q3, and W3 topic Q3 — deliberate emphasis of a classic gotcha; the `//`/`%` behavior recurs across W4 text + chapter + topic quizzes. This is good pedagogy, not padding.
- **Cross-course topic duplication** cannot be ruled out without reading the other 8 courses — assigned to STEP 6. (Note: the C++ audit flags the single shared title "Comparison & Logical Operators" with python — verified distinct content there.)

---

## O. Outdated Content

- ✅ **No factually outdated Python content found.** No Python-2-era claims, no removed-standard features taught as current. The course is consistently Python 3.8+ and even current-3.13 (dict `|` merge, f-string `=`, `list[str]`, `ruff`, `seaborn-v0_8`, `pyproject.toml`).
- The only historical statement is deliberately historical and accurate: "some systems still ship `python` as version 2" (`python.ts:134`) and the `python` vs `python3` naming difference (`python.ts:124-126`).
- 🔶 Minor: W15 T1 "show clears the figure" is a mechanism simplification, not an obsolescence (§E-3). The header comment "15-question final exam" (`python.ts:6`) is a count error, not dated content (§E-4).

---

## P. Critical Findings (ranked for this course)

1. **P1 — No learning-objective layer and no objectives→assessment map** (caps criterion F for every course). §C. Same catalog-wide finding as the C++ audit.
2. **P1 — No in-content graded practical work.** Four projects are *named retroactively* in W20 (`python.ts:1631`) but never assigned, scaffolded, or assessed; practice is quiz-only with no feedback loop. §F, §G, §H.
3. **P1/P2 — async/await absent** from an otherwise current ecosystem course whose stated next step is Flask/FastAPI. §K, §M.
4. **P2 — Two flawed assessment items:** W4 chapter Q4 has two logically equivalent correct answers (`python.ts:341-344`); W5 chapter Q4's key marks a non-idiomatic compound option correct while the true idiom `if my_list:` would be marked wrong (`python.ts:423-426`). §I-1, §I-2.
5. **P2 — Runnability defects in three code samples** (`python.ts:320` NameError; `python.ts:1037-1038` self-import; `python.ts:1536` undefined `format_summary`). §E-2, §E-5.
6. **P2 — Distractor quality is uneven** (many absurd filler options) and near-duplicate topic/chapter items appear in the same week. §I, §N.
7. **P3 — Minor factual/documentation nits:** PEP 8 "suggests single quotes" is wrong (§E-1); "show clears the figure" is a simplification (§E-3); header claims a 15-question final that is 18 (§E-4).

---

## Q. Rubric Score

| Criterion (weight) | Score /5 | Weighted | Key evidence |
|---|---|---|---|
| A. Curriculum Architecture (15%) | 4.5 | 0.675 | Coherent, well-sequenced 20-week climb; no LO layer (P1) |
| B. Technical Accuracy (15%) | 4.5 | 0.675 | Verified sound against Python 3; 5 minor issues (E-1..E-5) |
| C. Lesson Quality (15%) | 4.0 | 0.600 | Excellent prose/notes/pitfall-teaching; a few runnability fragments |
| D. Practical Learning (20%) | 3.75 | 0.750 | Code-first + strong CLI-project arc, but no graded practice/assignments |
| E. Assessment Quality (15%) | 3.75 | 0.5625 | High volume, clean uniqueness, 2 flawed items, recall-heavy, mixed distractors |
| F. LO Alignment (10%) | 3.5 | 0.350 | Implicit alignment only; no objective layer |
| G. Industry Relevance (5%) | 5.0 | 0.250 | Modern ecosystem coverage (venv/pip, typing, tooling, data/web) is exemplary |
| **Total** | **3.86/5** | **3.8625 → 77.25/100** | **Band: Needs Improvement (70–79)** |

Weighted math: 4.5×0.15 = 0.675; 4.5×0.15 = 0.675; 4.0×0.15 = 0.600; 3.75×0.20 = 0.750; 3.75×0.15 = 0.5625; 3.5×0.10 = 0.350; 5.0×0.05 = 0.250. Sum = 3.8625 → ×20 = 77.25/100.

Scores are evidence-labelled per §A–§O; fractional precision reflects verified granularity, not false certainty (RULE 4/5).

---

## R. Future Actions

1. Add an explicit per-topic learning-objective field and map each quiz question and each project to objectives (raises F; ~+0.5–1.0). *Wave: authoring-standard change, all 9 courses.*
2. Add a graded practical layer: in-week programming exercises with solutions and a wired deliverable for the four named projects; assemble the expenses CLI into one runnable, tested reference project (raises D; ~+0.5). *Wave: practical layer.*
3. Fix the two flawed assessment items (W4 Q4 two-correct-answers; W5 Q4 key/intent mismatch) and tighten distractors (remove absurd filler options; raise cognitive level with more code-trace/application items) (raises E; ~+0.5). *Wave: assessment layer.*
4. Fix the three runnability defects (§E-2, §E-5) and the PEP 8 quote claim (§E-1) — small, high-value content edits. *Wave: correctness pass.*
5. Add highest-leverage missing topics: a git basics lesson and a regex topic (the `re` forward-reference at `python.ts:1043` promises it); consider an async/async-IO primer or explicitly frame it as an advanced next step (raises G, M). *Wave: content expansion.*

Estimated ceiling after 1–5: ~4.0–4.2/5 ≈ 80–84/100 → **Strong** band.

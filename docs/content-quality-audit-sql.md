# Content Quality Audit — `sql` Course

**Course:** Database Management & SQL (issue #90)
**Files audited:**
- `/home/abhi/repo/edunexuspro/backend/prisma/content/sql.ts` (946 lines)
- `/home/abhi/repo/edunexuspro/backend/prisma/content/sql_topic_quizzes.ts` (521 lines)
**Auditor role:** Content Quality & Curriculum Audit (MASTER PLAN v1.0) — **AUDIT ONLY, no content modified.**
**Date:** 2026-08-14

---

## A. Overview

The SQL course is a 20-week, 80-topic PostgreSQL-focused curriculum covering the full relational arc: database fundamentals → relational design → reads (SELECT/WHERE → filtering/sorting → aggregation → joins → subqueries) → normalization → DDL/DML → indexes → views/procedures/triggers → transactions/ACID → security → application integration (Node/Python/Prisma) → two projects (library mini-project, booking capstone). Each topic ships `{title, text, code, note}`; each week ships 8 chapter quizzes; each topic has a separate 4-question quiz in `sql_topic_quizzes.ts`; the file ends with an 18-question `sqlFinalExam`.

**Verified structural counts (already known, re-confirmed while reading):** 20 modules, 80 topics, 4 topics/module, median ~149 words/topic, 160 chapter quizzes (8/week), 320 topic-quiz questions (4/topic), 18 final-exam questions. Zero cross-course duplicate question texts (given; no internal exact duplicates found between chapter and topic quizzes either).

**Coverage statement (honest):** I read **100% of both files** — all 80 topics (text, code, note), all 160 chapter quizzes, all 320 topic-quiz questions, and all 18 final-exam questions. This exceeds the required protocol (full-read weeks 1, 7, 14, 20 + 2 extra topics). Consequently, **all content conclusions below are directly evidenced (✅ CONFIRMED)** unless marked otherwise. The 🔶 marker is reserved for subjective/scoping judgments (e.g., "too thin," "should be taught"), and ⚪ for anything requiring external verification.

**Overall verdict (weighted 63.5 / 100 — Weak band):** The course has a genuinely strong architecture, excellent industry grounding, and a large, mostly well-formed assessment bank. It is held back by (1) lessons that are materially shallower than the file's own "~250-300 words, deep" claim (~149 words median), (2) two real PostgreSQL technical defects in assessment/curriculum (a broken quiz item and a capstone schema type mismatch), (3) absence of window functions and CTEs as dedicated topics, and (4) no explicit learning objectives or hands-on assignment infrastructure. The sequence itself is sound and complete at the macro level; the execution is thin.

---

## B. Course Structure

One-line-per-week topic-title list (all titles verbatim from `sql.ts`):

- **W1 Introduction to Databases:** What Is a Database & Why We Need One · Databases vs Spreadsheets · DBMS vs RDBMS · The ACID Preview
- **W2 Relational Database Concepts:** Tables, Rows & Columns · Primary Keys: The Identity of a Row · Foreign Keys & Referential Integrity · Relationships: One-to-One, One-to-Many, Many-to-Many
- **W3 SQL Basics (SELECT, WHERE):** Anatomy of a SELECT Statement · Filtering with WHERE · NULLs: The Third State · Aliases & Computed Columns
- **W4 Data Filtering & Sorting:** IN, BETWEEN & LIKE · Boolean Logic: AND, OR, NOT · ORDER BY: Sorting Results · LIMIT, OFFSET & Pagination
- **W5 SQL Functions (Aggregate):** Aggregates: COUNT, SUM, AVG, MIN, MAX · DISTINCT: Unique Values · Scalar Functions: Strings & Numbers · Aggregates + NULLs: The Silent Skew
- **W6 Group By & Having Clauses:** GROUP BY: Aggregates per Bucket · HAVING vs WHERE · Grouping by Multiple Columns · Real-World: Monthly Revenue Report
- **W7 SQL Joins (Inner, Left, Right):** INNER JOIN: Only the Matches · LEFT JOIN: Keep Everything from One Side · Self-Joins: A Table Joining Itself · Choosing the Right Join
- **W8 Subqueries & Nested Queries:** Scalar Subqueries: One Value In · IN Subqueries: Membership Tests · Correlated Subqueries: Per-Row Evaluation · EXISTS: "Is There Any?"
- **W9 Database Design & Normalization:** Why Design the Schema Before Writing Queries · First Normal Form (1NF): Atomic Values · Second Normal Form (2NF): No Partial Dependencies · Third Normal Form (3NF): No Transitive Dependencies
- **W10 Table Creation & Altering:** CREATE TABLE & Choosing Data Types · Column Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT · ALTER TABLE: Evolving the Schema · DROP, TRUNCATE & DELETE: Removing Data
- **W11 Inserting & Updating Data:** INSERT: Adding Rows · UPDATE: Changing Rows · DELETE: Removing Rows · Upsert: ON CONFLICT
- **W12 Indexes & Performance:** What Is an Index & How It Works · Composite Indexes: Column Order Matters · Index Pitfalls: Functions, Leading Wildcards, Low Selectivity · EXPLAIN & Reading Query Plans
- **W13 Views & Stored Procedures:** Views: Saved Queries as Tables · Materialized Views: Snapshots · Stored Procedures & Functions · Triggers: Reactions to Changes
- **W14 Transactions & ACID Properties:** BEGIN, COMMIT & ROLLBACK · Atomicity & Consistency · Isolation Levels & the Dirty-Read Problem · Durability & Locks
- **W15 Database Security Basics:** SQL Injection: The #1 Database Attack · Parameterized Queries & Prepared Statements · Privileges: Least Privilege & GRANT/REVOKE · Backups, Encryption & Sensitive Data
- **W16 Connecting SQL to Python/Node:** Connecting from Node with node-postgres · Connecting from Python with psycopg2 · Connection Pooling: Don't Open a Connection per Request · ORMs & Prisma: SQL Without Hand-Written Strings
- **W17 Mini-Project: Library System Database:** Requirements & Entities for a Library · Building Tables with Correct Constraints · Seeding Data & the Queries That Run the Library · Testing Your Schema with Real Queries
- **W18 Schema Design Polish:** Design Review: Reading a Schema Like a Reviewer · UNIQUE, CHECK & Exclusion Constraints · Migrations: Versioned Schema Change · Handling Schema Changes Safely
- **W19 Query Optimizations:** Finding Slow Queries First · Index Strategy: Index What You Actually Query · Rewriting Queries: Less Data, Fewer Round-Trips · Caching & When to Give Up on a Query
- **W20 Final Project Submission:** The Project Brief: Design a Booking System · Advanced Queries the Booking System Needs · Reviewing Your Own Work Like a Senior Engineer · Final Exam Prep & Certification Review

**Sequential coherence check.** ✅ CONFIRMED (scan of all 80 titles): the sequence is a sound read-first pedagogy — fundamentals → relational concepts → read path (SELECT/WHERE → filters/sorts → aggregates → grouping → joins → subqueries) → design/normalization → DDL → DML → performance → views/procedures → transactions → security → application integration → projects → optimization → capstone. The ACID preview in W1 spirals correctly to a full week-14 treatment (explicitly framed as a preview, `sql.ts:71`).

Two structural observations:
1. 🔶 INFERRED — DDL is formally taught at W10 and DML (INSERT/UPDATE/DELETE) at W11, i.e., **after** eight weeks of reads. This is defensible (learners must query before they can verify writes) but unusual; a beginner is selecting from tables they haven't formally built until mid-course. Not an error.
2. ✅ CONFIRMED — The stated "modern SQL" tail of the arc is really "applications/optimization." **Window functions and CTEs (WITH) never get a dedicated topic** — window functions appear only as a passing "trick" (`sql.ts:291`) and a passing mention (`sql.ts:375`); CTEs appear nowhere. This is a curriculum gap for a "deep" 20-week course (see Section M).

---

## C. Learning Objectives

✅ CONFIRMED — **No explicit learning objectives exist.** The `SqlSection` data model is `{week, title, description, topics, quizzes}` (`sql.ts:31`); there is no objectives/outcomes field anywhere. Section `description` strings are the only goal-like text (e.g., "Read data with SELECT, filter it with WHERE, and handle NULLs and aliases," `sql.ts:137`). The W20 exam-prep topic lists what the exam covers (`sql.ts:907`) but not what a learner should be able to *do* per week.

🔶 INFERRED — Because objectives are absent, quiz alignment must be judged implicitly (see Section J). For a 20-week technical course this is a structural weakness: learners have no contract for "what should I be able to do by Friday?"

---

## D. Lesson Quality

**Format.** Every topic is a fixed shape: ~3 short prose paragraphs (concept → mechanics → pitfalls/application) + one `code` snippet + one real-world `note` (`sql.ts:51-55` is representative). Consistency is excellent across all 80 topics. ✅ CONFIRMED.

**Depth.** ✅ CONFIRMED (median ~149 words/topic, given) and the file's own header claims "**deep teaching topics (~250-300 words)**" (`sql.ts:4`). Actual depth is roughly **half** the claimed target — a documentation-vs-delivery mismatch. This is a scope judgment, not a length penalty:

- 🔶 INFERRED — Several genuinely hard topics are too thin to teach the stated title:
  - **EXPLAIN & Reading Query Plans** (`sql.ts:555`) — ~130 words with **no sample plan output shown**, even though the entire point is reading a plan bottom-up; a learner cannot recognize a Seq Scan from this lesson.
  - **Correlated Subqueries** (`sql.ts:373`) — ~125 words on a notoriously confusing concept; one example, no execution walk-through, no "why this is slow" worked analysis beyond a sentence.
  - **Isolation Levels & the Dirty-Read Problem** (`sql.ts:637`) — ~150 words compressing dirty read, READ COMMITTED, REPEATABLE READ, SERIALIZABLE, and phantom prevention; each is a chapter's worth of material.
  - **UNIQUE, CHECK & Exclusion Constraints** (`sql.ts:807`) — ~140 words on three constraint families including EXCLUDE, which is advanced.
  - **Caching & When to Give Up on a Query** (`sql.ts:863`) — reasonable but stops at cache-aside.
- 🔶 INFERRED — Conversely, some topics are adequate at this length because the concept is small (e.g., "DISTINCT: Unique Values" `sql.ts:235`; "DROP, TRUNCATE & DELETE" `sql.ts:467`). The thinness concentrates exactly where SQL beginners most need worked depth.

**Pedagogical craft.** ✅ CONFIRMED — Analogies are genuinely good ("index = book's index," `sql.ts:537`; "three Cs of Excel," `sql.ts:61`; "marketing segments are WHERE clauses," `sql.ts:193`). Pitfall emphasis is strong and correct (NULL, `= NULL` vs `IS NULL`, WHERE vs HAVING, INNER vs LEFT, COUNT(*) vs COUNT(col), float-for-money). **No lesson shows expected query output** — every code block is input-only, so a self-study beginner cannot verify they produced the right result. No in-lesson "try it" exercises exist.

**Lesson quality score:** **3.0 / 5** (adequate) — consistent, well-written, good analogies; but shallow depth on hard topics, no output verification, no in-lesson practice, and a header that over-promises depth.

---

## E. Technical Accuracy

Verified against current PostgreSQL (the course's stated engine) and SQL standards. Every claim below was read directly; the correctness judgment is the auditor's.

### Correct / accurate claims (sample of what was verified) ✅ CONFIRMED
- AND binds tighter than OR; `A OR B AND C` = `A OR (B AND C)` (`sql.ts:147`, `191`). Correct.
- BETWEEN is inclusive on both ends (`sql.ts:185`). Correct.
- LIKE case-sensitivity; PostgreSQL `ILIKE` (`sql.ts:185`). Correct.
- `NOT IN` with a NULL in the list returns no rows (`sql.ts:191`). Correct.
- NULLs sort last in ASC / first in DESC in PostgreSQL (`sql.ts:197`). Correct.
- Aggregates ignore NULLs except `COUNT(*)` (`sql.ts:229`, `247`). Correct.
- `DISTINCT` treats NULLs as equal (one NULL in output) (`sql.ts:235`). Correct.
- Non-aggregate SELECT columns must appear in GROUP BY (`sql.ts:273`). Correct (PostgreSQL enforces).
- `GROUP BY ROLLUP(state, city)` adds per-state subtotal rows (`sql.ts:285`). Correct.
- Scalar subquery returning >1 row errors; 0 rows yields NULL (`sql.ts:361`). Correct.
- `ADD COLUMN` with a constant DEFAULT is metadata-only/instant in PostgreSQL (`sql.ts:461`, `819`). Correct and a nice nuance.
- `SET a = b, b = a` swaps because assignments use original row values (`sql.ts:499`). Correct in PostgreSQL.
- `ON CONFLICT (col) DO UPDATE ... excluded` (`sql.ts:511`). Correct (Postgres 9.5+).
- A plain B-tree index does not serve `WHERE col IS NULL` in PostgreSQL; partial index needed (`sql.ts:549`). Correct.
- `LIKE 'abc%'` can use a B-tree index; `'%abc'` cannot (`sql.ts:549`). Correct.
- Composite index left-prefix rule (`sql.ts:543`). Correct.
- `EXPLAIN ANALYZE` actually executes (`sql.ts:555`). Correct.
- Views are unfolded by the optimizer; not a performance fix by themselves (`sql.ts:581`). Correct.
- `REFRESH MATERIALIZED VIEW CONCURRENTLY` needs a UNIQUE index (`sql.ts:587`). Correct.
- Trigger `EXECUTE FUNCTION` is modern Postgres 11+ syntax (`sql.ts:600`). Correct and current.
- PostgreSQL default isolation is READ COMMITTED; REPEATABLE READ prevents phantoms (beyond the SQL standard); SERIALIZABLE aborts on conflict with "could not serialize" (`sql.ts:637`). Correct.
- `tsrange`-family `EXCLUDE` machinery conceptually correct; W18 example internally consistent (`sql.ts:808`). Partially correct — see defect below.
- node-postgres `$1` placeholders; psycopg2 `%s` placeholders and the required `conn.commit()` (`sql.ts:713-721`). Correct.
- `current_date + 14` yields a DATE (`sql.ts:764`). Correct.

### Technical defects found ✅ CONFIRMED (all read directly)

1. **TRUNCATE transactionality mis-taught (assessment).** The W10 lesson text hedges correctly: TRUNCATE "cannot be part of a plain rollback **in some engines**" (`sql.ts:467`) — true of MySQL (implicit commit), **false of PostgreSQL**, which is this course's engine. But the assessments drop the hedge and assert the PostgreSQL-false version flatly:
   - Chapter quiz: "Which removal is transactional and rollback-able?" → correct answer `DELETE FROM … WHERE`, with TRUNCATE as a distractor (`sql.ts:479`).
   - Topic quiz: "TRUNCATE…" → the option "**is transactional**" is marked wrong (`sql_topic_quizzes.ts:267`).
   In PostgreSQL, `TRUNCATE` **is** transactional and rollback-able. RULE 4 (no "bad" without evidence): this is a concrete correctness error in shipped assessment content. **Severity: P1.**

2. **Capstone EXCLUDE schema type mismatch: `tsrange` on `timestamptz` columns.** W20 project brief declares `starts_at timestamptz not null` (`sql.ts:890`) then applies `EXCLUDE USING gist (resource_id WITH =, **tsrange(starts_at, ends_at)** WITH &&)` (`sql.ts:891`). `tsrange` is the range type over `timestamp` **without** time zone; constructing it from `timestamptz` arguments fails at DDL time ("function tsrange(timestamp with time zone, timestamp with time zone) does not exist"). It should be **`tstzrange`**. This is the centerpiece of the capstone (the note at `sql.ts:891` calls it the capstone's "centerpiece"), so the headline schema example is non-executable as written. **Severity: P1.**

3. **`EXCLUDE ... WITH =` on an integer column requires the `btree_gist` extension — never mentioned.** Both `EXCLUDE USING gist (room_id WITH =, ...)` (W18, `sql.ts:808`) and the W20 capstone (`sql.ts:891`) use equality on an `int` inside a GiST exclusion constraint. Without `CREATE EXTENSION btree_gist`, PostgreSQL raises "data type integer has no default operator class for access method gist." The course never mentions extensions. A student copying the capstone DDL verbatim will hit this. **Severity: P1** (bundled with defect 2 as "EXCLUDE examples not runnable as written").

4. **Minor portability overstatement.** W1 says "You write the same SELECT today and it runs against a local install or a cloud RDS instance with **zero changes**" and that the ideas transfer "to MySQL, SQLite, and **every SQL engine**" (`sql.ts:53`). SQL Server/MSSQL (TOP, no LIMIT), older MySQL versions, etc., contradict "zero changes / every engine." Minor, but an accuracy nit in week 1. **Severity: P3.**

5. **`serial` vs modern identity.** The course teaches `serial primary key` throughout (e.g., `sql.ts:66`, `104`). `serial` is not wrong, but PostgreSQL's documented recommendation for new applications is `GENERATED ... AS IDENTITY`. Missed modernity point, not an error. 🔶 INFERRED. **Severity: P3.**

No other dialect-specific claims are presented as universal: ILIKE, ON CONFLICT, EXCLUDE, pg_stat_statements, and EXECUTE FUNCTION are all framed as PostgreSQL features, which is the correct way to teach a Postgres-based course. ✅ CONFIRMED.

**Technical accuracy score:** **3.0 / 5** — the majority of the content is accurate and even pleasantly nuanced, but three genuine defects (TRUNCATE quiz error, capstone `tsrange`/`tstzrange` mismatch, missing `btree_gist`) sit in high-visibility spots (assessments and the capstone).

---

## F. Practical Learning

**Strengths.** ✅ CONFIRMED — the course is practically oriented for a content course:
- Every topic ships a `code` block (80/80 topics) — mostly short, runnable SQL or driver snippets.
- W16 is genuinely applied: node-postgres `Pool`, psycopg2 `conn.commit()` (including the "my script inserts nothing" bug), PgBouncer, `pd.read_sql`, and Prisma `$queryRaw` (`sql.ts:713-733`).
- W17 is a full mini-project (library) with requirements → DDL → seed → real feature queries → negative testing (`sql.ts:757-777`).
- W20 is a capstone (booking system) with deliverables ordered 1-5, including `generate_series` free-slot finding and `EXTRACT(EPOCH ...)` utilization math (`sql.ts:889-897`).
- Performance is taught with real tools: `pg_stat_statements`, `EXPLAIN ANALYZE`, `pg_stat_user_indexes` (`sql.ts:846-853`).

**Weaknesses.** ✅ CONFIRMED —
- **No environment setup lesson anywhere**: no "install PostgreSQL," no psql/Docker/PgAdmin, no sample database to practice against. A true beginner has no way to run any of the 80 code blocks.
- **No lesson shows expected output**; no verification feedback loop.
- Projects are described in prose, not scaffolded: no starter files, no seed SQL file, no test harness, no rubric beyond a prose checklist (`sql.ts:901`). "The evaluation is not 'did it run'" (`sql.ts:889`) is a philosophy, not a grading artifact.
- The two capstone EXCLUDE schemas are non-runnable as written (Section E defects 2-3), which directly undermines the practical payoff.

🔶 INFERRED — Practical learning is the strongest dimension of the course's *intent*, but execution stops at "worked examples + described projects." There is no hands-on assignment infrastructure, so a learner gets exposure, not verified practice.

**Practical learning score:** **3.5 / 5** — strong conceptual practicality and two well-designed projects, offset by no setup path, no output verification, and non-runnable capstone DDL.

---

## G. Assignments

✅ CONFIRMED — **There are no inter-week assignments or exercises.** The only per-week assessment is the 8-question chapter quiz (auto-graded, multiple-choice) plus the 4-question per-topic quiz. There are no "write a query that…" tasks, no problem sets, no code-graded labs, no solutions. The two projects (W17, W20) function as the course's only constructed-response work, and they are described rather than instrumented (no starter schema, no verification harness). For a skill where learning happens by writing SQL, this is a significant structural gap. 🔶 INFERRED severity: P2.

---

## H. Projects

- **W17 Mini-project — Library System** (`sql.ts:757-777`): requirements stated, entities/relationships enumerated, DDL with constraints (`unique isbn`, FK, `due_on default +14 days`, CHECK `returned_on >= borrowed_on`), seeding guidance, and 4 real queries (books-by-author, currently-borrowed, overdue, most-borrowed). Ends with a positive/negative testing methodology. ✅ CONFIRMED — well-scoped and realistic.
- **W20 Capstone — Booking System** (`sql.ts:889-903`): 5 ordered deliverables (ER sketch → schema → seed → queries → migrations), advanced queries (today's bookings, free slots via `generate_series`, utilization per week, cancellation trend), and a senior-engineer self-review checklist. ✅ CONFIRMED — ambitious and real-world.
- **Gaps:** No starter files, no expected-output fixtures, no automated checks; and the capstone's defining DDL (EXCLUDE) does not run as written (Section E, defects 2-3). 🔶 INFERRED — the projects are well-designed *on paper* but not executable/verifiable in their current form.

---

## I. Quiz Quality

**Volume & structure.** ✅ CONFIRMED — 160 chapter quizzes (8/week, 4 options, exactly 1 correct) + 320 topic-quiz questions (4/topic) + 18 final-exam questions. All questions have exactly one keyed correct answer and 3 distractors. No exact text duplicates between chapter and topic quizzes (verified while reading; the topic-quiz file header at `sql_topic_quizzes.ts:9` requires this).

**Distractor quality.** ✅ CONFIRMED — distractors are generally plausible and often diagnostic of real misconceptions:
- "A customer with zero orders appears in…" with INNER/LEFT/CROSS options (`sql.ts:342`).
- "NOT IN with a NULL in the list yields…" (`sql.ts:213`).
- "`WHERE city = NULL` matches…" (`sql.ts:167`).
- "In `DO UPDATE`, the incoming value is referenced as…" (`sql.ts:523`).
There are occasional weak/filler distractors (e.g., "a syntax error"/"too many indexes" in W19 topic quiz, `sql_topic_quizzes.ts:474`), but no pattern of nonsense options — **except the W10 defect below**.

**Defects found** ✅ CONFIRMED:
1. **P0 — Broken question, W10 topic quiz "ALTER TABLE: Evolving the Schema"** (`sql_topic_quizzes.ts:260`):
   > `text: "Which command evolves the schema without dropping data?"`
   > `options: ["query rows", "evolve the schema without dropping data", "insert rows", "run transactions"]`
   > `correctAnswer: "evolve the schema without dropping data"`
   The question asks for a **command**; the intended answer `ALTER TABLE` does not appear. The correct-answer string is literally the question's own wording, option 1 ("query rows") is not even a SQL command, and option 4 ("run transactions") is not an answer to "which command." This looks like a copy-paste slip from the lesson prose (`sql.ts:461`). A learner can "pass" without knowing ALTER TABLE, and a learner who knows the material is confused.
2. **P3 — Broken/awkward stem, W19 topic quiz** (`sql_topic_quizzes.ts:474`): text reads "A loop that fires one query per row is the…" with correct answer "an ORM loop that runs one query per row" — the stem "is the…" does not grammatically accept the answer ("is the an ORM loop…"). The stem should be "…is the N+1 problem." Functionally answerable but sloppy.

**Cognitive level.** 🔶 INFERRED — the bank skews heavily to **recall/recognition**: "Which makes text lowercase?" (`sql_topic_quizzes.ts:135`), "The relational model was invented by…" (`sql_topic_quizzes.ts:36`), "The course uses which database engine?" (`sql_topic_quizzes.ts:26`), "Which aggregate finds the smallest value?" (`sql_topic_quizzes.ts:123`). A solid minority are **application/understanding** items — the joins `IS NULL` pattern, the ₹50k marketing segment, `ON CONFLICT` atomicity, `generate_series` free slots, `EXTRACT(EPOCH)/3600` utilization — and these are the best questions in the bank. But the default level is single-fact recognition, which tests whether a student saw the lesson, not whether they can reason in SQL. For a course whose stated goal is to make learners "design and query a real database" (`sql.ts:909`), the assessment mix under-represents construction tasks.

**Assessment quality score:** **3.0 / 5** — large, well-formatted, mostly plausible-distractor bank with some genuinely excellent applied items, dragged down by one P0 broken question, one broken stem, and a recall-heavy cognitive profile.

---

## J. Assessment Alignment

✅ CONFIRMED — With the exceptions noted, quiz and exam questions map directly onto lesson content (RULE 16: judged against what was actually taught). Spot-checked across all 20 weeks:
- W1 chapter quiz Q7 (Durability) maps to W1 t4 (`sql.ts:83` ↔ `sql.ts:71`).
- W6 chapter quiz Q8 (ROW_NUMBER top-3 per month) tests a technique taught as a "trick" in W6 t4 (`sql.ts:304` ↔ `sql.ts:291`) — slightly beyond the core but taught.
- W12 chapter quiz Q4 (`WHERE LOWER(email)` defeats index) maps to W12 t3 (`sql.ts:564` ↔ `sql.ts:549`).
- W18 chapter quiz Q3 (CHECK status IN) maps to W18 t2 (`sql.ts:827` ↔ `sql.ts:807`).
- Final exam coverage is a faithful sample of the arc: ACID, 1NF, IN, HAVING, LEFT JOIN, correlated subquery, money-as-NUMERIC, 2NF, TRUNCATE, ON CONFLICT, index/function, materialized view, injection, trigger, BEGIN/COMMIT, pg_stat_statements, reproducibility (`sql.ts:926-943`). Notably it does **not** test window functions or CTEs — consistent with those never being taught.
- **Misalignments:** the P0 ALTER TABLE question (`sql_topic_quizzes.ts:260`) asks a question the lesson answers with "ALTER TABLE" but the quiz never offers it; the TRUNCATE questions (`sql.ts:479`, `sql_topic_quizzes.ts:267`) test a claim that contradicts PostgreSQL behavior the lessons otherwise teach correctly.

✅ CONFIRMED — Because explicit learning objectives are absent (Section C), alignment can only be checked content-to-content, which is good; objective-to-assessment alignment is unverifiable. This caps the criterion.

**Assessment alignment score:** **3.0 / 5.**

---

## K. Industry Relevance

✅ CONFIRMED — This is the course's strongest dimension. Nearly every topic carries a real-world `note` tied to recognizable systems: bank transfers/ACID (`sql.ts:73`), e-commerce carts and `RETURNING id` (`sql.ts:495`), loyalty campaigns as IN subqueries (`sql.ts:369`), leaderboards as `ORDER BY ... LIMIT` (`sql.ts:199`), onboarding emails as LEFT JOIN IS NULL (`sql.ts:325`), CFO revenue reports as `SUM` (`sql.ts:231`), PgBouncer and pool exhaustion outages (`sql.ts:727`), the N+1 ORM problem (`sql.ts:847`), injection at "real banks and governments" (`sql.ts:671`), compliance audit triggers (`sql.ts:601`), Stripe/Razorpay for payments (`sql.ts:687`), 3-2-1 backups (`sql.ts:689`). The course is explicitly Postgres-centric and even references this project's own Prisma stack (`sql.ts:733`), which is the right call for a backend bootcamp. W19's "measure before optimizing" (`sql.ts:845`) and W20's reproducibility-as-grade (`sql.ts:889`) mirror how real engineering teams operate. 🔶 INFERRED — no external data exists to verify employer-demand alignment, but content matches mainstream industry practice for SQL/Postgres roles.

**Industry relevance score:** **4.5 / 5.**

---

## L. Beginner Experience

✅ CONFIRMED — The ramp is gentle and well-motivated: W1 starts at "database vs text file vs spreadsheet" before any SQL (`sql.ts:53`, `59`). Analogies are consistently concrete (book index, three Cs, marketing segments). Pitfalls are taught explicitly rather than discovered painfully (NULL, `= NULL`, WHERE vs HAVING). Real-world notes give purpose to every lesson. The tone is encouraging ("Good luck — you've built a database and made it answer real questions," `sql.ts:907`).

🔶 INFERRED — Weaknesses for a beginner:
- **No setup guide** — the first thing a true beginner needs ("how do I install Postgres?") is absent (Section F).
- **Term load spikes early**: ACID is fully previewed in W1 t4 (`sql.ts:71`), and serializable isolation, exclusion constraints, and `pg_stat_statements` appear well before many learners can ground them; though each is a "preview" or advanced-aside, the density is high.
- The **P0 broken ALTER quiz item** (Section I) actively harms beginners: the correct answer is the question's own phrase, so it rewards skimming over understanding.
- **No expected outputs** means a beginner cannot self-check any example.

🔶 INFERRED — Overall the writing is beginner-friendly in tone but the scaffolding (setup, outputs, verification) that a beginner most depends on is missing.

---

## M. Missing Content (severity-tagged)

- **P1 — Window functions have no dedicated lesson.** Present only as a one-line "trick" (`ROW_NUMBER ... PARTITION BY`, `sql.ts:291`) and a passing "window functions solve this faster" aside (`sql.ts:375`). A 20-week "deep" SQL curriculum with a claim to modern coverage omits RANK/DENSE_RANK/ROW_NUMBER/SUM-over, which are among the most-used modern SQL features. Content **missing**, not present-but-weak. ✅ CONFIRMED (titles scan + full read).
- **P1 — Common Table Expressions (`WITH`) and recursive CTEs absent.** Zero mentions across both files (full read). CTEs are core to readable modern SQL and to hierarchy queries. **Missing.** ✅ CONFIRMED.
- **P1 — No environment setup / practice path.** No install/psql/Docker/sample-DB content anywhere (full read). A learner cannot execute any of the 80 examples. **Missing.** ✅ CONFIRMED.
- **P2 — No JSONB querying lesson.** JSONB is listed as a type (`sql.ts:449`) but no operators (`->`, `->>`, `@>`) or use-cases are taught. For a Postgres course, this is a notable omission. **Missing.** ✅ CONFIRMED.
- **P2 — No explicit learning objectives / outcomes** (Section C). **Missing.** ✅ CONFIRMED.
- **P2 — No hands-on assignments with solutions** (Section G). **Missing.** ✅ CONFIRMED.
- **P2 — No timezone/date deep-dive** beyond "store TIMESTAMPTZ in UTC" (`sql.ts:449`, `511`); the W20 capstone's `timestamptz`/`tsrange` bug (Section E) suggests the author did not fully develop this area. Present-but-weak → **missing-depth.** 🔶 INFERRED.
- **P3 — No NoSQL comparison beyond a passing "it depends"** (`sql.ts:67`). Acceptable for a SQL course; noted for completeness.
- **P3 — No `GENERATED AS IDENTITY`** (modernity note, Section E). Present-but-outdated-recommendation. 🔶 INFERRED.

---

## N. Redundant Content

- ✅ CONFIRMED — **W10 t4 "DROP, TRUNCATE & DELETE" (`sql.ts:467`) substantially overlaps W11 t3 "DELETE: Removing Rows" (`sql.ts:505`).** Both cover DELETE-vs-TRUNCATE, ON DELETE CASCADE/RESTRICT/SET NULL, and soft delete. The W10 topic even introduces `DELETE FROM ... WHERE` two weeks before the DML week formally teaches it. Moderate redundancy; merging or re-pointing W10 t4 to "drop/truncate only" would tighten the arc.
- ✅ CONFIRMED — The ACID preview (W1 t4) vs the full ACID week (W14) is a deliberate, explicitly-labeled spiral (`sql.ts:71`), so the overlap is intentional and acceptable.
- 🔶 INFERRED — Indexes appear in W12 (full) and W19 (strategy); this is complementary (what vs when), not redundant.
- 🔶 INFERRED — DISTINCT appears in W5 t2 and is re-mentioned in W6; minor, acceptable.

---

## O. Outdated Content

- ✅ CONFIRMED — **No content is verifiably outdated.** Syntax is current: `ON CONFLICT` (9.5+), `EXECUTE FUNCTION` (11+), `REFRESH ... CONCURRENTLY`, `pg_stat_statements`, `generate_series`, `CREATE INDEX CONCURRENTLY`. No deprecated commands are taught. Dates in examples are current (`sql.ts:903` uses `2026-08-12`). RULE 5 satisfied: nothing flagged as outdated without verification.
- 🔶 INFERRED — The only "age" note is `serial` vs `GENERATED ... AS IDENTITY` (Section E, P3): not outdated, but the modern recommendation is identity columns.
- ✅ CONFIRMED — The file header's claim of "~250-300 words" per topic (`sql.ts:4`) is **inaccurate relative to delivered content** (~149 median). This is a metadata mismatch, not outdated content.

---

## P. Critical Findings (ranked P0-P3)

1. **P0 — Broken assessment item in the W10 topic quiz.** "Which command evolves the schema without dropping data?" is answered with the phrase itself; `ALTER TABLE` is absent from the options (`sql_topic_quizzes.ts:260`). RULE 4 evidence: read directly. A shipped, auto-graded question that cannot test the intended skill.
2. **P1 — Capstone EXCLUDE schema is not runnable as written.** `tsrange(starts_at, ends_at)` applied to `timestamptz` columns (`sql.ts:890-891`) is a type mismatch — must be `tstzrange`. Same pattern in W18 (`sql.ts:808`). Additionally, `EXCLUDE USING gist (int_col WITH =, ...)` requires the `btree_gist` extension, which is never mentioned. The capstone's "centerpiece" (`sql.ts:891`) will not execute if copied verbatim. RULE 4 evidence: read directly; correctness vs PostgreSQL DDL semantics.
3. **P1 — TRUNCATE transactionality is mis-taught in assessments.** The lesson hedges correctly ("in some engines," `sql.ts:467`) but the chapter quiz (`sql.ts:479`) and topic quiz (`sql_topic_quizzes.ts:267`) assert TRUNCATE is not transactional/rollback-able — false for PostgreSQL, the course's own engine. RULE 4 evidence: read directly.
4. **P1 — Window functions and CTEs are absent from the curriculum.** Only passing mentions of window functions (`sql.ts:291`, `sql.ts:375`); zero `WITH`/CTE content. This undercuts the "modern SQL" arc and the "deep" claim for a 20-week course. RULE 4 evidence: 100% titles scan + full read.
5. **P2 — Lessons are ~half the claimed depth on exactly the hardest topics.** Header promises "~250-300 words" (`sql.ts:4`); median is ~149 (given). EXPLAIN (`sql.ts:555`), correlated subqueries (`sql.ts:373`), isolation levels (`sql.ts:637`), and exclusion constraints (`sql.ts:807`) are too thin to genuinely teach, and no lesson shows expected output. RULE 7 (scope judgment, not length penalty): flagged as present-but-too-thin. 🔶 INFERRED severity but ✅ CONFIRMED word counts.
6. **P2 — No learning objectives, no setup guide, no assignments.** (Sections C, F, G.) These are structural absences, each confirmed by full read.
7. **P3 — W19 topic quiz broken stem** ("A loop that fires one query per row is the…", `sql_topic_quizzes.ts:474`).
8. **P3 — Minor:** portability overstatement "zero changes / every SQL engine" (`sql.ts:53`); `serial` vs `GENERATED AS IDENTITY` modernity.

---

## Q. Rubric Score (weighted)

| Criterion | Weight | Score | Weighted | Evidence summary |
|---|---|---|---|---|
| A Curriculum Architecture | 15% | 4.0 | 0.600 | Coherent, well-sequenced arc + ACID spiral; docked for missing window functions/CTEs and read-before-write placement oddity |
| B Technical Accuracy | 15% | 3.0 | 0.450 | Mostly accurate and nuanced; docked for TRUNCATE quiz error, `tsrange`/`tstzrange` capstone bug, missing `btree_gist` |
| C Lesson Quality | 15% | 3.0 | 0.450 | Consistent format, strong analogies; ~149-word median vs 250-300 claim, no outputs, thin on hard topics |
| D Practical Learning | 20% | 3.5 | 0.700 | Two well-designed projects, real tools (EXPLAIN, pg_stat_statements, drivers); no setup path, no output verification, capstone DDL non-runnable |
| E Assessment Quality | 15% | 3.0 | 0.450 | Large, well-formed bank with good distractors; one P0 broken item, recall-heavy cognitive level |
| F Learning Objective Alignment | 10% | 3.0 | 0.300 | Strong content-to-content alignment; no explicit objectives to align to |
| G Industry Relevance | 5% | 4.5 | 0.225 | Excellent real-world grounding throughout (banking, e-commerce, pooling, Prisma, compliance) |
| **Total** | **100%** | — | **3.175 / 5** | **63.5 / 100** |

**Math:** (4.0×0.15) + (3.0×0.15) + (3.0×0.15) + (3.5×0.20) + (3.0×0.15) + (3.0×0.10) + (4.5×0.05) = 0.600 + 0.450 + 0.450 + 0.700 + 0.450 + 0.300 + 0.225 = **3.175** → **63.5%**.

**Health band: Weak (60–69).**

---

## R. Future Actions

Ranked by leverage; audit-only recommendations (no changes made):

1. **P0 fix first:** Rewrite the W10 topic-quiz ALTER TABLE item to offer `ALTER TABLE` as the correct answer (`sql_topic_quizzes.ts:260`).
2. **P1 fix:** Correct the TRUNCATE assessments to PostgreSQL truth — either rephrase to "TRUNCATE is transactional in PostgreSQL" or compare engines explicitly (`sql.ts:479`, `sql_topic_quizzes.ts:267`).
3. **P1 fix:** Make the capstone/W18 EXCLUDE examples executable: use `tstzrange` for `timestamptz` columns and add a `CREATE EXTENSION btree_gist` prerequisite line (`sql.ts:808`, `sql.ts:891`).
4. **P1 curriculum:** Add dedicated lessons (or fold into existing weeks) for **window functions** and **CTEs (WITH)**, including at least one recursive-CTE example — the two most consequential gaps in the "modern SQL" arc.
5. **P2 depth:** Expand the thinnest high-difficulty topics (EXPLAIN with a real sample plan, correlated subqueries with a worked trace, isolation levels, EXCLUDE constraints) and add expected query output to at least every code block.
6. **P2 scaffolding:** Add a Postgres environment-setup lesson (install/psql/Docker + a seed database) and per-week "write this query" exercises with solutions; add a verification harness for the W17/W20 projects.
7. **P2 governance:** Add explicit per-week learning objectives (the `description` field is a good anchor).
8. **P3 polish:** Fix the W19 topic-quiz stem (`sql_topic_quizzes.ts:474`), soften the "zero changes / every SQL engine" claim (`sql.ts:53`), and consider teaching `GENERATED ... AS IDENTITY` alongside `serial`.

---

*Audit-only. No course files were modified. The only file written is this audit document.*

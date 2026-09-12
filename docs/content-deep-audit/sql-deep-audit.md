# SQL Course — Lead Curriculum Quality Deep-Scan Audit

**Course:** `SQL` — Database Management & SQL
**Auditor role:** Lead Curriculum Quality Auditor (deep-scan, independent)
**Audit type:** AUDIT-ONLY — no content, seed, DB record, source, or schema modified. One new report file written.
**Date:** 2026-08-14
**Sources of truth (priority order):** (1) Local Postgres `nexus` DB via `/tmp/nexus-psql.sh` (read-only), (2) `backend/prisma/content/sql.ts`, `backend/prisma/content/sql_topic_quizzes.ts`, `backend/prisma/reseed_sql_full.ts`, `backend/prisma/challengeSeedData.ts`, (3) `docs/content-quality-audit-sql.md`, `docs/assessment-systems-audit.md`, `docs/content-quality-audit-master-report.md`, `docs/wave1-decision-spec.md`, `docs/content-source-audit.md`.

**Evidence labels:** `[CONFIRMED]` directly verified (file:line or DB query/id) · `[INFERRED]` strong conclusion from multiple confirmed pieces · `[UNKNOWN — NOT VERIFIED]` cannot verify · `[RECOMMENDATION]` suggestion only.
**Severity:** P0 critical / P1 high / P2 medium / P3 low.

---

## 1. Executive Summary

The SQL course is a 20-week, 80-topic PostgreSQL-centred curriculum spanning the full relational arc: fundamentals → relational design → read path (SELECT/WHERE → filtering/sorting → aggregates → grouping → joins → subqueries) → normalization → DDL → DML → indexes → views/procedures/triggers → transactions/ACID → security → application integration (Node/Python/Prisma) → a library mini-project → schema polish → query optimization → a booking capstone. The writing is consistently well-crafted, industry-anchored, and materially accurate — but it is held back by structural absences (no learning objectives, no environment setup path, no graded hands-on practice, no feedback), a documentation-vs-delivery depth mismatch (median 149 words/topic vs a 250–300 word header claim), four defective assessment items (one P0 that blocks a topic-lock gate), and three independently-verified PostgreSQL defects in the assessments and the capstone DDL (the capstone's centerpiece EXCLUDE constraint does not execute as written).

**Independent score: 56.0 / 100 (Weak band).** The prior audit scored 63.5/100 under a different 7-criterion rubric. Under the 12-dimension rubric mandated for this deep scan, the score is 56.0. I verified every load-bearing claim independently (full read of both content files + live PostgreSQL execution tests); I did not inherit the prior score.

**Top findings**
- **P0** — Unanswerable W10 topic-quiz item (DB `QuizQuestion.id=11477`): the keyed answer is the stem's own phrase; `ALTER TABLE` is not among the options.
- **P1** — Capstone EXCLUDE DDL non-runnable as written: `tsrange(starts_at, ends_at)` on `timestamptz` columns (function does not exist — must be `tstzrange`), and `EXCLUDE USING gist (int WITH =, …)` requires the unmentioned `btree_gist` extension (`sql.ts:808, 890-891`). Verified by live execution.
- **P1** — TRUNCATE transactionality mis-taught in assessments (DB `11482`, `11491`): PostgreSQL TRUNCATE **is** transactional and rollback-able (verified live); the keyed answers assert it is not.
- **P1** — Window functions and CTEs never get a dedicated lesson; a "modern SQL" gap for a 20-week deep course.
- **P1** — Practical learning is intended but not executable: no setup guide, no expected outputs, no scaffolded projects, the two seeded interactive challenges are UI-orphaned, and the practice bank contains **zero** SQL questions.

---

## 2. Course Metadata (DB-sourced)

`[CONFIRMED]` via `/tmp/nexus-psql.sh`:

| Field | Value |
|---|---|
| `id` | `SQL` |
| `title` | Database Management & SQL |
| `description` | Learn relational databases, SQL queries, joins, indexes, and schema design in Hinglish. |
| `price` | 699 |
| `isPublished` | `t` |

**Discrepancy note:** The DB `description` is the shorter original (`seed.ts`-era) string, not the reseed create-string (`reseed_sql_full.ts:41-42`), because the course row pre-existed and was preserved. The description advertises the course "in Hinglish," but 100% of the topic bodies are written in English (with Indian-context tokens like ₹, Aadhaar, Pune/Mumbai). This is a scope/identity mismatch (`Section 22`).

---

## 3. Content Inventory (DB-sourced)

`[CONFIRMED]` — all counts verified against the `nexus` DB. **They match the pre-supplied inventory exactly (no discrepancy).**

| Item | Count |
|---|---|
| Modules | 20 |
| Topics | 80 (4 per module) |
| Topic-quiz questions (`topicId` set) | 320 (4 per topic) |
| Module-quiz questions (`topicId` NULL) | 160 (8 per module) |
| Final-exam questions | 18 |
| Interactive challenges | 2 (both week 1, SQL type) |
| `Project`-table rows tied to SQL | 0 (see §14 — project briefs live only in prose) |
| `PracticeQuestion` rows categorized SQL | 0 (practice bank is 5 rows total, none SQL) |

Per-module breakdown (topics / topic-quiz Q / module-quiz Q): **every** module is identical — 4 / 16 / 8. Uniform, no module is unbalanced by volume.

---

## 4. Curriculum Structure

`[CONFIRMED]` — full title scan (all 80 topics, DB order) and full read of `sql.ts`.

**Sequence:** W1 Intro → W2 Relational concepts → W3 SELECT/WHERE → W4 filtering/sorting → W5 aggregates → W6 GROUP BY/HAVING → W7 joins → W8 subqueries → W9 normalization → W10 DDL → W11 DML → W12 indexes → W13 views/procedures/triggers → W14 transactions/ACID → W15 security → W16 app integration → W17 library mini-project → W18 schema polish → W19 optimization → W20 booking capstone.

**Strengths**
- Sound read-first pedagogy: a learner can query before being required to build (`[INFERRED]` defensible placement of DDL at W10).
- The W1 ACID preview spirals deliberately to the full W14 ACID week (`sql.ts:71`, `sql.ts:623`) — intentional and well-labelled reinforcement.
- Prerequisite logic is largely sound; later topics reference earlier ones (EXCLUDE in W18 is reused as the W20 capstone centerpiece, `sql.ts:891`).

**Weaknesses**
- **No dedicated window-function lesson and no CTE (`WITH`) lesson anywhere** (`[CONFIRMED]` full read; window functions appear only as one-line "trick"/aside at `sql.ts:291` and `sql.ts:375`; `WITH` appears zero times). For a course claiming deep, modern SQL this is the single largest curriculum gap.
- **No module carries prerequisites/objectives metadata** — nothing tells a learner what they must know before a week, or what they should be able to do after.
- **Premature advanced exposure** (`[INFERRED]`): serializable isolation, exclusion constraints, and `pg_stat_statements` appear before many beginners can ground them; each is hedged as "advanced/preview," but the density is high for a low-entry course.
- **No SQL-specific practice bank and no JSONB operator content** (see §13, §25).

---

## 5. Module-by-Module Analysis

Score scale 1–10 (8–10 strong, 5–7 adequate, <5 weak). Each judged on: content depth vs title, technical correctness, assessment alignment, practical value.

| Week | Module | Topics | Mod-Q | Topic-Q | Score | Notes |
|---|---|---|---|---|---|---|
| 1 | Introduction to Databases | 4 | 8 | 16 | 7.0 | Gentle, well-motivated ramp; ACID preview is a good hook. "Zero changes / every SQL engine" portability overstatement (`sql.ts:53`). |
| 2 | Relational Database Concepts | 4 | 8 | 16 | 7.5 | PK/FK/relationship shapes taught cleanly; M:N junction explained. |
| 3 | SQL Basics (SELECT, WHERE) | 4 | 8 | 16 | 7.5 | Correct NULL/`=` traps; solid. |
| 4 | Data Filtering & Sorting | 4 | 8 | 16 | 7.5 | IN/BETWEEN/LIKE, boolean precedence, keyset pagination — accurate and practical. |
| 5 | SQL Functions (Aggregate) | 4 | 8 | 16 | 7.5 | NULL-skew lesson is a genuine strength. |
| 6 | Group By & Having Clauses | 4 | 8 | 16 | 7.0 | Pipeline (WHERE→GROUP BY→HAVING→ORDER BY→LIMIT) taught explicitly; ROW_NUMBER "trick" is untaught-then-tested (see §12-1). |
| 7 | SQL Joins | 4 | 8 | 16 | 7.5 | Best taught week; row-multiplication warning is excellent. |
| 8 | Subqueries & Nested Queries | 4 | 8 | 16 | 6.5 | Correlated subqueries too thin for the difficulty (`sql.ts:373`, ~125 words, no worked trace). |
| 9 | Database Design & Normalization | 4 | 8 | 16 | 7.5 | 1NF/2NF/3NF with concrete anomalies — clear and correct. |
| 10 | Table Creation & Altering | 4 | 8 | 16 | 5.5 | Contains the P0 broken item (DB `11477`) and both TRUNCATE defects (DB `11482`, `11491`); lesson also states TRUNCATE "resets counters" — false for PG. |
| 11 | Inserting & Updating Data | 4 | 8 | 16 | 7.5 | RETURNING, ON CONFLICT, soft-delete — current and accurate. |
| 12 | Indexes & Performance | 4 | 8 | 16 | 6.5 | Strong composite/EXPLAIN content but the IS NULL index claim (`sql.ts:549`) is false for modern PG (verified live). |
| 13 | Views & Stored Procedures | 4 | 8 | 16 | 7.0 | Materialized views, CONCURRENTLY refresh, trigger EXECUTE FUNCTION — current syntax. |
| 14 | Transactions & ACID | 4 | 8 | 16 | 7.0 | Accurate isolation-level treatment; ~150 words is thin for the hardest week. |
| 15 | Database Security Basics | 4 | 8 | 16 | 7.5 | Injection, parameters, least privilege, 3-2-1 backups — excellent, current. |
| 16 | Connecting SQL to Python/Node | 4 | 8 | 16 | 7.5 | node-postgres, psycopg2 `conn.commit()`, PgBouncer, Prisma — genuinely applied. |
| 17 | Mini-Project: Library System | 4 | 8 | 16 | 7.0 | Well-scoped, realistic; prose-only (no starter files/harness). |
| 18 | Schema Design Polish | 4 | 8 | 16 | 5.5 | EXCLUDE example non-runnable without `btree_gist` (`sql.ts:808`); otherwise strong. |
| 19 | Query Optimizations | 4 | 8 | 16 | 6.5 | pg_stat_statements/EXPLAIN discipline good; W19 broken stem (DB `11686`). |
| 20 | Final Project: Booking System | 4 | 8 | 16 | 5.5 | Excellent brief; capstone EXCLUDE DDL non-runnable as written (`sql.ts:890-891`). |

---

## 6. Topic-by-Topic Findings

The 80 topics are uniform in shape: 3 short paragraphs (concept → mechanics → pitfalls) + one code block + one real-world note. `[CONFIRMED]` full read. Highlights of specific defects and strengths:

**Defective/notable topics**
- **W10 T3 "DROP, TRUNCATE & DELETE" (`sql.ts:467`)** — two factual errors for PostgreSQL: (a) TRUNCATE "resets counters" (false — needs `RESTART IDENTITY`, verified §8-5); (b) DROP TABLE "reversible only from a backup" (false within a transaction — PG DDL is transactional, verified §8-4). Also pre-teaches `DELETE FROM … WHERE` two weeks before the DML week.
- **W12 T3 "Index Pitfalls" (`sql.ts:549`)** — claims a normal index "does not speed `WHERE col IS NULL`" without a partial index. **False for modern PostgreSQL** (verified: plain btree index used for `IS NULL`, §8-6).
- **W18 T2 "UNIQUE, CHECK & Exclusion Constraints" (`sql.ts:807-808`)** — the `EXCLUDE USING gist (room_id WITH =, during WITH &&)` example errors without `btree_gist` (§8-3). ~140 words is thin for three constraint families including EXCLUDE.
- **W20 T1 "The Project Brief" (`sql.ts:890-891`)** — the capstone centerpiece DDL is non-executable: `tsrange` on `timestamptz` columns (§8-2) plus the same missing `btree_gist` (§8-3).
- **W8 T3 "Correlated Subqueries" (`sql.ts:373`)** — ~125 words, one example, no per-row execution trace; the hardest read topic is the thinnest.
- **W12 T4 / W14 T3** — EXPLAIN (`sql.ts:555`) and Isolation Levels (`sql.ts:637`) never show sample output/plan, so a self-study beginner cannot verify comprehension.

**Strengths** (representative) — `[CONFIRMED]`
- W1 T4 ACID preview (`sql.ts:71`), W5 T4 NULL-skew (`sql.ts:247`), W7 T4 join-selection mental test (`sql.ts:335`), W15 T1 injection (`sql.ts:669`), W19 T1 measure-first (`sql.ts:845`) are all excellent, correct, and industry-anchored.

**Depth check** — `[CONFIRMED]` DB query: median **149** words/topic, min 100, max 180. The file header claims "~250-300 words, deep" (`sql.ts:4`). Delivered depth is ~half the claimed target; the shortfall concentrates on exactly the hardest topics.

---

## 7. Content Chunk Summaries

Chunk ID = `W{week}.T{order}`. Each chunk was read in full; summaries below aggregate up to the module analysis in §5.

| Chunk | Title (verbatim) | Summary & analysis |
|---|---|---|
| W1.T0 | What Is a Database & Why We Need One | DB vs flat files; concurrency/querying/consistency/durability wins. Accurate. Slight portability overstatement ("every SQL engine"). |
| W1.T1 | Databases vs Spreadsheets | The "three Cs" framing is a strong mnemonic. Correct. |
| W1.T2 | DBMS vs RDBMS | Codd, keys, no-duplication rationale. Correct. |
| W1.T3 | The ACID Preview: Why Databases Don't Lose Money | Correct preview; properly deferred to W14. |
| W2.T0 | Tables, Rows & Columns | Correct mental model; types + NOT NULL. |
| W2.T1 | Primary Keys: The Identity of a Row | Composite PK, "store the ID not the data" — correct and clear. |
| W2.T2 | Foreign Keys & Referential Integrity | CASCADE/SET NULL/RESTRICT correctly contrasted. |
| W2.T3 | Relationships: 1:1, 1:M, M:N | Junction-table pattern correct. |
| W3.T0 | Anatomy of a SELECT Statement | Declarative framing; AS aliases. Correct. |
| W3.T1 | Filtering with WHERE | `=` vs `==`, case sensitivity, precedence, `IS NULL` — all correct. |
| W3.T2 | NULLs: The Third State | Correct NULL semantics; COUNT(*) vs COUNT(col). Strong. |
| W3.T3 | Aliases & Computed Columns | Correct; notes WHERE-alias limitation accurately. |
| W4.T0 | IN, BETWEEN & LIKE | BETWEEN inclusive; `%`/`_`; ILIKE; leading-wildcard performance. Correct. |
| W4.T1 | Boolean Logic: AND, OR, NOT | AND-binds-tighter; NOT IN + NULL trap. Correct. |
| W4.T2 | ORDER BY: Sorting Results | Correct default ASC; NULLs last in ASC (PG). Correct. |
| W4.T3 | LIMIT, OFFSET & Pagination | Keyset pagination taught; correct. |
| W5.T0 | Aggregates: COUNT, SUM, AVG, MIN, MAX | Correct NULL-ignoring semantics. |
| W5.T1 | DISTINCT: Unique Values | Correct; JOIN+DISTINCT vs EXISTS. |
| W5.T2 | Scalar Functions: Strings & Numbers | Correct; formatting-in-app guidance is right. |
| W5.T3 | Aggregates + NULLs: The Silent Skew | COALESCE/NULLIF — excellent, business-relevant. |
| W6.T0 | GROUP BY: Aggregates per Bucket | Non-aggregate-in-GROUP-BY rule correct. |
| W6.T1 | HAVING vs WHERE | Pipeline taught correctly; WHERE/HAVING stage distinction. |
| W6.T2 | Grouping by Multiple Columns | ROLLUP correct; high-cardinality caveat. |
| W6.T3 | Real-World: Monthly Revenue Report | DATE_TRUNC + GROUP BY alias works (verified §8-8); ROW_NUMBER "trick" taught once then tested (see §12-1). |
| W7.T0 | INNER JOIN: Only the Matches | Row-multiplication warning — excellent. |
| W7.T1 | LEFT JOIN: Keep Everything from One Side | IS-NULL "no orders" pattern correct. |
| W7.T2 | Self-Joins: A Table Joining Itself | Employee/manager; aliasing twice. Correct. |
| W7.T3 | Choosing the Right Join | Mental-test decision heuristic — strong. |
| W8.T0 | Scalar Subqueries: One Value In | >1-row errors, 0-row → NULL. Correct. |
| W8.T1 | IN Subqueries: Membership Tests | NOT IN + NULL → prefer NOT EXISTS. Correct. |
| W8.T2 | Correlated Subqueries: Per-Row Evaluation | Concept correct but too thin for its difficulty (§6). |
| W8.T3 | EXISTS: 'Is There Any?' | SELECT 1, early-exit. Correct. |
| W9.T0 | Why Design the Schema Before Writing Queries | Good design heuristics. |
| W9.T1 | First Normal Form (1NF) | Correct; junction fix. |
| W9.T2 | Second Normal Form (2NF) | Partial-dependency example correct. |
| W9.T3 | Third Normal Form (3NF) | Transitive dependency example correct. |
| W10.T0 | CREATE TABLE & Choosing Data Types | NUMERIC-for-money, TEXT-for-phone, TIMESTAMPTZ — correct. |
| W10.T1 | Column Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT | Correct (UNIQUE allows multiple NULLs in PG). |
| W10.T2 | ALTER TABLE: Evolving the Schema | Correct; metadata-only ADD COLUMN nuance. |
| W10.T3 | DROP, TRUNCATE & DELETE | Two PG errors (§6); overlap with W11.T2. |
| W11.T0 | INSERT: Adding Rows | RETURNING; COPY batching. Correct. |
| W11.T1 | UPDATE: Changing Rows | `SET a=b, b=a` swap correct; lock warning. |
| W11.T2 | DELETE: Removing Rows | Soft-delete; batched deletes. Correct; overlaps W10.T3. |
| W11.T3 | Upsert: ON CONFLICT | `excluded` reference correct; atomicity rationale. |
| W12.T0 | What Is an Index & How It Works | Book-index analogy; B-tree; selective columns. Correct. |
| W12.T1 | Composite Indexes: Column Order Matters | Left-prefix rule correct. |
| W12.T2 | Index Pitfalls | **IS NULL index claim false for PG** (§8-6); rest correct. |
| W12.T3 | EXPLAIN & Reading Query Plans | No sample plan shown — thin for its purpose (§6). |
| W13.T0 | Views: Saved Queries as Tables | Unfolded-by-optimizer correct. |
| W13.T1 | Materialized Views: Snapshots | CONCURRENTLY + UNIQUE index correct. |
| W13.T2 | Stored Procedures & Functions | Balanced app-vs-DB guidance; correct syntax. |
| W13.T3 | Triggers: Reactions to Changes | EXECUTE FUNCTION (PG11+) correct. |
| W14.T0 | BEGIN, COMMIT & ROLLBACK | Correct; short-transaction hygiene. |
| W14.T1 | Atomicity & Consistency | WAL; CHECK-at-commit. Correct. |
| W14.T2 | Isolation Levels & the Dirty-Read Problem | READ COMMITTED default correct; REPEATABLE READ phantom prevention correct for PG. Thin depth. |
| W14.T3 | Durability & Locks | Correct; deadlock detection. |
| W15.T0 | SQL Injection | Correct and forceful. |
| W15.T1 | Parameterized Queries & Prepared Statements | Correct across drivers; Prisma `$queryRaw` correct. |
| W15.T2 | Privileges: Least Privilege & GRANT/REVOKE | Correct. |
| W15.T3 | Backups, Encryption & Sensitive Data | pg_dump, 3-2-1, bcrypt, provider-held payments. Correct. |
| W16.T0 | Connecting from Node with node-postgres | Pool + $1 placeholders — correct. |
| W16.T1 | Connecting from Python with psycopg2 | `%s`, `conn.commit()` — correct and practical. |
| W16.T2 | Connection Pooling | PgBouncer; leak exhaustion — correct. |
| W16.T3 | ORMs & Prisma | Correct; ORM-for-CRUD + raw-SQL-for-10% guidance. |
| W17.T0 | Requirements & Entities for a Library | Realistic; authors↔books M:N. Correct. |
| W17.T1 | Building Tables with Correct Constraints | `current_date + 14` default works (verified §8-8). |
| W17.T2 | Seeding Data & the Queries That Run the Library | Real feature queries (overdue, most-borrowed). Strong. |
| W17.T3 | Testing Your Schema with Real Queries | Positive/negative testing methodology — strong. |
| W18.T0 | Design Review: Reading a Schema Like a Reviewer | Good reviewer checklist. |
| W18.T1 | UNIQUE, CHECK & Exclusion Constraints | EXCLUDE example non-runnable without `btree_gist` (§8-3). |
| W18.T2 | Migrations: Versioned Schema Change | Correct; never-edit-a-run-migration. |
| W18.T3 | Handling Schema Changes Safely | CONCURRENTLY, backfill-then-NOT NULL — correct and current. |
| W19.T0 | Finding Slow Queries First | pg_stat_statements — correct; N+1. |
| W19.T1 | Index Strategy | pg_stat_user_indexes — correct. |
| W19.T2 | Rewriting Queries | Set-based thinking — correct. |
| W19.T3 | Caching & When to Give Up on a Query | Cache-aside; invalidation. Correct but shallow. |
| W20.T0 | The Project Brief: Design a Booking System | Ambitious, real brief; **capstone EXCLUDE DDL non-runnable** (§8-2/3). |
| W20.T1 | Advanced Queries the Booking System Needs | generate_series free slots; EXTRACT(EPOCH)/3600 utilization (verified §8-8). |
| W20.T2 | Reviewing Your Own Work Like a Senior Engineer | "What happens if" discipline — excellent. |
| W20.T3 | Final Exam Prep & Certification Review | Honest exam framing; no exam-reachability caveat (final exam is dead content, §21). |

---

## 8. Technical Accuracy Findings

**Method:** every SQL snippet that could be executed was mentally traced and, where load-bearing, executed against the local PostgreSQL 16. All snippets marked [CONFIRMED] below were run live.

### 8.1 Confirmed-accurate claims (representative sample)
- AND binds tighter than OR (`sql.ts:147,191`); BETWEEN inclusive (`sql.ts:185`); `ILIKE` PG-only (`sql.ts:185`).
- `NOT IN` with a NULL in the list returns no rows (`sql.ts:191`). [CONFIRMED — established PG semantics]
- NULLs sort last ASC / first DESC in PG (`sql.ts:197`).
- Aggregates ignore NULLs except COUNT(*) (`sql.ts:229,247`); DISTINCT treats NULLs as equal (`sql.ts:235`).
- Non-aggregate SELECT columns must appear in GROUP BY (`sql.ts:273`); GROUP BY on a SELECT alias works — verified live (§8-8).
- Scalar subquery: >1 row → error; 0 rows → NULL (`sql.ts:361`).
- `ADD COLUMN` with constant DEFAULT is metadata-only in PG (`sql.ts:461,819`).
- `SET a = b, b = a` swaps (`sql.ts:499`); `ON CONFLICT … DO UPDATE … excluded` (`sql.ts:511`).
- Composite left-prefix rule (`sql.ts:543`); `LIKE 'abc%'` indexable, `'%abc'` not (`sql.ts:549`).
- `EXPLAIN ANALYZE` executes the query (`sql.ts:555`); `REFRESH MATERIALIZED VIEW CONCURRENTLY` needs UNIQUE index (`sql.ts:587`).
- `EXECUTE FUNCTION` is PG11+ syntax (`sql.ts:600`).
- PG default isolation READ COMMITTED; REPEATABLE READ prevents phantoms; SERIALIZABLE aborts on conflict (`sql.ts:637`).
- node-postgres `$1`; psycopg2 `%s` + mandatory `conn.commit()` (`sql.ts:713-721`).
- `current_date + 14` yields DATE — verified live (`sql.ts:764`); W20 utilization `EXTRACT(EPOCH FROM …)/3600` — verified live (`sql.ts:896`).
- `CREATE INDEX CONCURRENTLY` non-blocking (`sql.ts:820`); `pg_stat_statements.total_exec_time` (`sql.ts:846`).

### 8.2 Technical defects (each independently executed/verified)

1. **[CONFIRMED — P1] Capstone EXCLUDE DDL non-runnable — `tsrange` on `timestamptz`.**
   - Claim: `EXCLUDE USING gist (resource_id WITH =, tsrange(starts_at, ends_at) WITH &&)` where `starts_at timestamptz`, `ends_at timestamptz` (`sql.ts:890-891`).
   - Evidence: live `SELECT tsrange(now(), now() + interval '1 hour');` → `ERROR: function tsrange(timestamp with time zone, timestamp with time zone) does not exist`. The range type over `timestamptz` is `tstzrange`.
   - Impact: the capstone's "centerpiece" schema fails at DDL time if copied verbatim; the W20 note explicitly calls this the centerpiece (`sql.ts:891`).
   - Correction direction: use `tstzrange(starts_at, ends_at)`.

2. **[CONFIRMED — P1] `EXCLUDE USING gist (int WITH =, …)` requires `btree_gist`, never mentioned.**
   - Claim: `EXCLUDE USING gist (room_id WITH =, during WITH &&)` (`sql.ts:808`) and the W20 capstone (`sql.ts:891`).
   - Evidence: live `CREATE TABLE … EXCLUDE USING gist (room_id WITH =, during WITH &&)` → `ERROR: data type integer has no default operator class for access method "gist"`. With `CREATE EXTENSION btree_gist` first, the same DDL succeeds and rejects overlapping ranges (verified).
   - Impact: both EXCLUDE examples (W18 and W20) fail on a stock PostgreSQL install.
   - Correction direction: precede with `CREATE EXTENSION IF NOT EXISTS btree_gist;` or mention the extension prerequisite in the lesson.

3. **[CONFIRMED — P1] TRUNCATE transactionality mis-taught in assessments.**
   - Claim (lesson, hedged correctly): "cannot be part of a plain rollback **in some engines**" (`sql.ts:467`).
   - Claims (assessments, unhedged and wrong for PG): chapter quiz "Which removal is transactional and rollback-able?" → keyed `DELETE FROM … WHERE` with TRUNCATE as a distractor (`sql.ts:479`; DB `11491`); topic quiz option "is transactional" marked wrong (`sql_topic_quizzes.ts:267`; DB `11482`).
   - Evidence: live `BEGIN; TRUNCATE _audit_t; ROLLBACK;` → both rows remain. **TRUNCATE is transactional and rollback-able in PostgreSQL.** (DROP TABLE also survived a ROLLBACK — PG DDL is transactional.) In the chapter-quiz item, three of the four options (TRUNCATE, DROP TABLE, DELETE) are in fact transactional in PG, making the item ambiguous even beyond the mis-key.
   - Impact: shipped auto-graded content teaches a false statement about the course's own engine; the W10 chapter item has multiple technically-correct answers.
   - Correction direction: re-key/rephrase to engine-scoped truth ("TRUNCATE is transactional in PostgreSQL; in MySQL it causes an implicit commit").

4. **[CONFIRMED — P2] Lesson: TRUNCATE "resets counters" is false for PostgreSQL.**
   - Claim: "TRUNCATE — deletes ALL rows instantly, **resets counters**, …" (`sql.ts:467`).
   - Evidence: live — after `TRUNCATE _audit_seq;` the next `serial` insert id was **3**; only `TRUNCATE … RESTART IDENTITY` reset it to 1.
   - Impact: a learner clearing a table for test resets will be surprised when ids keep climbing.
   - Correction direction: say "resets counters only with `RESTART IDENTITY`."

5. **[CONFIRMED — P2] Lesson: btree index "does not speed `WHERE col IS NULL`" is false for modern PostgreSQL.**
   - Claim: "a normal index in PostgreSQL does not speed `WHERE col IS NULL` unless it's a partial index" (`sql.ts:549`).
   - Evidence: live — with a plain `CREATE INDEX … (phone)` on 100k rows, `EXPLAIN SELECT … WHERE phone IS NULL` produced an **Index Scan using** that index. (The prior audit marked this claim "Correct"; I **disagree** on the strength of the live plan.)
   - Impact: teaches a false constraint; learners may skip indexing or build unnecessary partial indexes.
   - Correction direction: state that a plain btree index *can* serve `IS NULL`; the partial-index pattern is an optimization, not a requirement.

6. **[CONFIRMED — P3] Lesson: DROP TABLE "reversible only from a backup" is inaccurate within a transaction.**
   - Claim: "DROP TABLE … Reversible only from a backup" (`sql.ts:467`).
   - Evidence: live — `BEGIN; DROP TABLE _audit_d2; ROLLBACK;` → table still exists. PG DDL is transactional.
   - Impact: minor; in practice an un-transactional DROP is backup-only recoverable. Correction direction: add "outside a transaction."

7. **[CONFIRMED — P3] Portability overstatement.** "the ideas transfer to MySQL, SQLite, and every SQL engine… zero changes" (`sql.ts:53`). SQL Server (TOP/no LIMIT), older MySQL, etc. contradict this. Correct to "PostgreSQL-first; most basics port with minor dialect tweaks."

8. **[INFERRED — P3] Modernity: `serial` taught throughout (`sql.ts:66,104,…`) without `GENERATED … AS IDENTITY`**, PG's documented recommendation for new apps. Not an error; a missed modernity point.

9. **[CONFIRMED — accurate] The remaining dialect-specific content (ILIKE, ON CONFLICT, EXCLUDE, pg_stat_statements, EXECUTE FUNCTION, CONCURRENTLY) is correctly framed as PostgreSQL-specific** — the right way to teach a Postgres course.

---

## 9. Learning Objective Audit

- **[CONFIRMED] No explicit learning objectives exist at any level.** The `SqlSection` model is `{week, title, description, topics, quizzes}` (`sql.ts:31`); there is no objectives/outcomes field. Module `description` strings (e.g., "Read data with SELECT, filter it with WHERE, and handle NULLs and aliases," `sql.ts:137`) are the only goal-like text. The W20 exam-prep topic (`sql.ts:907`) lists what the exam covers, not what a learner should be able to do per week.
- **[INFERRED]** Consequences: no measurable outcomes, no learner contract ("what can I do by Friday?"), no objective→assessment traceability, and no way to demonstrate that the 60%-pass quiz gates the intended competency. The single highest-leverage structural fix available to this course is adding per-week measurable objectives.

**Score: 2.0 / 10.**

---

## 10. LO → Content → Practice → Assessment Matrix

Classes: **A** objective+content+practice+assessment · **B** objective+content+assessment (no practice) · **C** content+assessment (no stated objective, no verifiable practice) · **D** content only · **E** assessment tests untaught content · **F** objective/content with no assessment.

Because **no objectives are stated** and **verifiable practice is absent**, no row can exceed class C except the two project weeks, whose practice is prose-described but not instrumented (shown as C/D). Interactive challenges exist for W1 but are UI-orphaned, so even W1 practice is not reachable (marked ✗, see §21).

| Week | Content | Practice (reachable) | Assessment | Stated LO | Class |
|---|---|---|---|---|---|
| 1 | ✓ | ✗ (2 challenges orphaned) | ✓ | ✗ | C |
| 2–9 | ✓ | ✗ | ✓ | ✗ | C |
| 10 | ✓ | ✗ | ✓ (1 P0 + 2 TRUNCATE-defective) | ✗ | C |
| 11–16 | ✓ | ✗ | ✓ | ✗ | C |
| 17 | ✓ | prose-only mini-project | ✓ | ✗ | C/D |
| 18–19 | ✓ | ✗ | ✓ (W19 stem defect) | ✗ | C |
| 20 | ✓ | prose-only capstone | ✓ | ✗ | C/D |

**Verdict:** the entire course sits in the **C band** — content and assessment exist and align, but there are no explicit objectives and no verified practice. This structurally caps the LO-alignment and practical-learning criteria.

---

## 11. Assessment Audit

### 11.1 Volume and structure — `[CONFIRMED]` (DB)
- 320 topic-quiz questions (4 per topic, 80 topics), 160 module-quiz questions (8 per module), 18 final-exam questions. Total **498** SQL assessment items, all 4-option / 1-keyed-correct.
- **No exact duplicate question texts** across the SQL bank (DB `GROUP BY text HAVING COUNT(*) > 1` → 0 rows).
- **Every topic has a quiz** (0 orphan topics; 4 questions each) — the topic-lock flow is fully populated.

### 11.2 Quality — `[CONFIRMED]`
- **Strengths:** distractors are generally plausible and diagnostic (e.g., "customer with zero orders appears in…" `sql.ts:342`; "NOT IN with a NULL…" `sql.ts:213`; "`WHERE city = NULL`…" `sql.ts:167`). A minority of items are genuinely applied (₹50k segment `sql.ts:192`; `generate_series` free slots `sql.ts:914`; `EXTRACT(EPOCH)/3600` `sql.ts:916`).
- **Defects:** 4 defective items (§12) — 1 P0, 2 P1, 1 P3 → **0.8% defect rate** by count, but the P0 sits on a topic-lock gate.
- **Cognitive level:** skews heavily to recall/recognition ("Which makes text lowercase?" `sql_topic_quizzes.ts:135`; "The relational model was invented by…" `sql_topic_quizzes.ts:36`; "The course uses which database engine?" `sql_topic_quizzes.ts:26`). `[INFERRED]` — under-represents construction tasks for a course whose stated goal is "design and query a real database" (`sql.ts:909`).
- **Randomization:** topic quiz `slice(0,5)` on a 4-question bank is a **no-op** (`quizService.ts:336-338`); module quizzes return in DB order with no option shuffle (`quizService.ts:17-19`). `[CONFIRMED]`
- **Feedback:** grading is exact-string match; `QuizQuestion` has **no explanation field** (`schema.prisma:137-151`), so no feedback beyond right/wrong + correct answer (`quizService.ts:52-64`). `[CONFIRMED]` (see §19).
- **Final exam:** 18 distinct, reasonable questions (DB ids 544–561), faithful sample of the arc; correctly avoids testing window functions/CTEs (never taught). **However the final exam is dead content — no route serves it** (§21).

**Score: 6.0 / 10.**

---

## 12. Question-Level Defects (individual, DB id)

| DB `QuizQuestion.id` | Week / bank | Stem (abbrev.) | Defect | Severity |
|---|---|---|---|---|
| **11477** | W10 topic quiz (module 130, topic 1388) | "Which command evolves the schema without dropping data?" | **Unanswerable P0.** Keyed answer is the stem's own phrase; `ALTER TABLE` absent from options; option "query rows" is not a SQL command. A learner cannot answer correctly from knowledge. `[CONFIRMED]` file `sql_topic_quizzes.ts:260` + DB. | **P0** |
| **11491** | W10 module quiz (module 130) | "Which removal is transactional and rollback-able?" | **Ambiguous/mis-keyed P1.** Keyed `DELETE FROM … WHERE`; but TRUNCATE and DROP TABLE are also transactional/rollback-able in PG (verified). ≥2 correct answers. `[CONFIRMED]` `sql.ts:479` + DB. | **P1** |
| **11482** | W10 topic quiz (module 130, topic 1389) | "TRUNCATE…" | Option "is transactional" keyed **wrong** — false for PG (verified live). The keyed behavior answer is correct, but the bank asserts a factual error about the course's engine. `[CONFIRMED]` `sql_topic_quizzes.ts:267` + DB. | **P1** |
| **11686** | W19 topic quiz (module 139, topic 1422) | "A loop that fires one query per row is the…" | **Broken stem.** "is the…" cannot accept the keyed answer "an ORM loop that runs one query per row" (should be "…is the N+1 problem"). Answerable only by elimination. `[CONFIRMED]` `sql_topic_quizzes.ts:474` + DB. | **P3** |

**Healthy population (summary):** the remaining **494 / 498** items are grammatically valid, 4-option, single-key, and consistent with taught content (`[CONFIRMED]` full read of both source files). Distractors are mostly plausible; no other exact duplicates or contradictory keys were found.

---

## 13. Practical Learning Audit

**Classification: MODERATE (intended STRONG, delivery MODERATE).**

- **Strengths** — `[CONFIRMED]`
  - Every topic ships a runnable-looking code block (80/80).
  - W16 is genuinely applied (node-postgres Pool, psycopg2 commit, PgBouncer, `pd.read_sql`, Prisma `$queryRaw`).
  - W17 (library) and W20 (booking) are well-conceived projects with requirements → DDL → seed → real feature queries → negative testing.
  - Real tools taught: `EXPLAIN ANALYZE`, `pg_stat_statements`, `pg_stat_user_indexes`, `generate_series`.
  - 2 interactive SQL challenges are seeded (SELECT All Columns; Filter with WHERE) with a sandboxed auto-grader (`challengeSeedData.ts:191-232`).
- **Weaknesses** — `[CONFIRMED]`
  - **No environment setup lesson** (no install/psql/Docker/sample DB) — a true beginner cannot run any of the 80 code blocks.
  - **No lesson shows expected output** — no self-verification loop.
  - Projects are prose, not scaffolded: no starter files, no seed SQL file, no test harness, no rubric artifact.
  - **The 2 SQL challenges are UI-orphaned** — no frontend route/page consumes `api/challenges/*` (only `About.tsx` marketing + `Dashboard.tsx` daily-practice, a different system). `[CONFIRMED]`
  - **The practice bank has 0 SQL questions** (5 practice questions total, none SQL-categorized) — the "Practice Arena" offers SQL learners nothing.
  - The two capstone EXCLUDE schemas are non-runnable as written (§8-2/3).

**Score: 5.0 / 10.**

---

## 14. Project Audit

- **W17 Mini-project — Library System** (`sql.ts:757-777`): requirements, entities, constrained DDL, seeding guidance, 4 real queries, positive/negative test methodology. **Clarity/scope/realism: strong.** Deliverables not instrumented.
- **W20 Capstone — Booking System** (`sql.ts:889-903`): 5 ordered deliverables (ER sketch → schema → seed → queries → migrations), advanced queries (today's bookings, `generate_series` free slots, utilization/week, cancellation trend), senior self-review checklist. **Clarity/scope/realism: strong.** Evaluation philosophy stated ("a stranger with your migration files can recreate the DB," `sql.ts:889`) but **no rubric artifact, no grading schema, no automated checks** exist in the platform.
- **Gaps** — `[CONFIRMED]`
  - No content-defined brief is bound to the submission system: `routes/project.ts` accepts arbitrary title/description/URLs and never references any brief or rubric (`assessment-systems-audit.md:88-101`).
  - No starter files/seed SQL/harness; capstone DDL non-runnable (§8-2/3).
  - Hardcoded **20-module gate** on project submission (`routes/project.ts:48-56`) — latent break for any ≠20-module course (SQL currently has 20, so not breaking today).

**Score: 3.0 / 5.**

---

## 15. Industry Relevance Audit

**Score: 4.5 / 5 — the course's strongest dimension.** `[CONFIRMED]`
- Postgres-first (right call for a backend bootcamp); real tools (`EXPLAIN ANALYZE`, `pg_stat_statements`, PgBouncer, Prisma — the platform's own stack, `sql.ts:733`).
- Real-world notes tied to recognizable systems: bank transfers/ACID (`sql.ts:73`), e-commerce carts/RETURNING (`sql.ts:495`), loyalty campaigns (`sql.ts:369`), leaderboards (`sql.ts:199`), onboarding emails (`sql.ts:325`), CFO revenue SUM (`sql.ts:231`), pool-exhaustion outages (`sql.ts:727`), N+1 (`sql.ts:847`), injection at "real banks and governments" (`sql.ts:671`), compliance triggers (`sql.ts:601`), Stripe/Razorpay (`sql.ts:687`), 3-2-1 backups (`sql.ts:689`).
- W19 measure-before-optimizing and W20 reproducibility-as-grade mirror real engineering practice.
- **Currency:** syntax is current (ON CONFLICT 9.5+, EXECUTE FUNCTION 11+, CONCURRENTLY, generate_series). No deprecated commands taught. `[CONFIRMED]`
- **Gaps:** no window functions/CTEs (§4) — the most-in-demand modern SQL feature family — and no JSONB operator content (`sql.ts:449` lists JSONB but never teaches `->`/`@>`).

---

## 16. Obsolete / Deprecated Technology Audit

- **[CONFIRMED] Nothing verifiably obsolete or deprecated is taught.** Syntax verified current. Dates in examples are current (`sql.ts:903` uses 2026-08-12).
- **[INFERRED — P3]** `serial` throughout vs `GENERATED … AS IDENTITY` (PG's modern recommendation) — a missed modernity point, not an error.
- **Outdated infrastructure (platform-level, not content):** `backend/dev.db` / `backend/prisma/dev.db` SQLite leftovers; the live site runs GitHub `main` (4+ commits ahead of local master) per the deployment-state memory — content audited here is the repo tree; live parity is `[UNKNOWN — NOT VERIFIED]`.

---

## 17. Duplication Audit

- **[CONFIRMED] No exact-duplicate question texts** in the SQL bank (DB check, §11.1).
- **[CONFIRMED] W10 T3 "DROP, TRUNCATE & DELETE" (`sql.ts:467`) substantially overlaps W11 T2 "DELETE: Removing Rows" (`sql.ts:505`)** — both cover DELETE-vs-TRUNCATE, ON DELETE CASCADE/RESTRICT/SET NULL, and soft delete; W10 even pre-teaches `DELETE FROM … WHERE` two weeks early. **Harmful-ish redundancy** → tighten by re-pointing W10 T3 to drop/truncate-only.
- **[CONFIRMED] W1 ACID preview vs W14 ACID week** is a deliberate, labelled spiral — legitimate reinforcement, not duplication.
- **[INFERRED] W12 (indexes) vs W19 (index strategy)** are complementary (what vs when), acceptable.

---

## 18. Consistency Audit

- **[CONFIRMED]** Terminology and voice are highly consistent across all 80 topics (same 3-paragraph + code + note shape; same Hinglish-flavoured-English voice with Indian context). Format uniform (4 options / 1 correct / option text = `correctAnswer`). Pitfall vocabulary consistent (NULL, IS NULL, WHERE vs HAVING, COUNT(*) vs COUNT(col)).
- **[CONFIRMED]** The only inconsistency of note is **description vs delivery**: the DB description advertises "in Hinglish" while bodies are English (§2); the file header advertises "~250-300 words" while median is 149 (§6).
- **[INFERRED]** Assessment style is consistent but uniformly recall-heavy — consistent in a way that under-serves the goal.

---

## 19. Feedback Audit

**Score: 1.0 / 10 — the weakest dimension.**
- **[CONFIRMED]** `QuizQuestion` has no `explanation` field (`schema.prisma:137-151`); grading returns right/wrong + correct answer only (`quizService.ts:52-64`). For all 498 SQL questions there is **zero "why" content** — score-without-learning.
- **[CONFIRMED]** No hints, no remediation paths, no next-steps in content. No in-lesson exercises with solutions.
- **[CONFIRMED]** The platform *can* do feedback — `PracticeQuestion` carries an optional `explanation` (`schema.prisma:218`), returned in the practice breakdown (`routes/practice.ts:79`) — but it was not applied to course quizzes. For SQL the practice bank is empty anyway (§13).
- The interactive challenge runner gives per-assertion pass/fail (`challengeRunnerService.ts`) — the only feedback-capable assessment asset — and it is **UI-orphaned** (§21).

---

## 20. Student Journey Audit

Discover → Enroll → Learn → Practice → Quiz → Feedback → Progress → Assignment → Project → Final → Certificate.

| Stage | Status | Evidence |
|---|---|---|
| Discover/Enroll | ✅ LIVE | Course listed/published, price 699, pay route `/pay/:courseId` |
| Learn | ✅ LIVE | 80 topics served in UI |
| Practice (interactive) | ❌ ORPHANED | 2 SQL challenges seeded, backend complete, **no frontend route** (`App.tsx:58-78`); Practice Arena has **0 SQL questions** |
| Quiz (topic + module) | ✅ LIVE | `/quiz/:courseId/:week/:topicId`, `/quiz/:courseId/:week` |
| Feedback | ❌ ABSENT | right/wrong only; no explanations (§19) |
| Progress | ✅ LIVE | `TopicProgress`/`ModuleProgress`/`CourseProgress` models exist |
| Assignment | ⚠️ PARTIAL | submission route live but no content-defined briefs; uploads are mock-path metadata (`routes/assignment.ts:79,88`) |
| Project | ⚠️ PARTIAL | submission route live (20-module gate), no brief/rubric bound (§14) |
| Final exam | ❌ DEAD | `FinalExamQuestion` seeded (18 for SQL) but **zero refs** in `backend/src` and `frontend/src`; no route |
| Certificate | ✅ LIVE | `/certificate` route; `CertificateRecord` model; verification flow |

**Verdict:** the journey is complete through progress, then **breaks**: no reachable summative assessment (final exam dead), no reachable auto-graded coding practice (challenges orphaned), assignments/projects are unbound envelopes, and certificate issuance is not gated on any content-defined final assessment. `[CONFIRMED]` except live deployment parity (`[UNKNOWN — NOT VERIFIED]`).

---

## 21. Assessment Reachability Audit

DB → route → API → frontend → student.

- **Topic quizzes:** `QuizQuestion(topicId)` → `getTopicQuizQuestions` (`quizService.ts:329`) → route `/quiz/:courseId/:week/:topicId` → `Quiz.tsx` → **REACHABLE** ✅
- **Module quizzes:** `QuizQuestion(topicId NULL)` → `getQuizQuestions` (`quizService.ts:4`) → route `/quiz/:courseId/:week` → **REACHABLE** ✅ (randomization no-op, §11.2)
- **Final exam:** `FinalExamQuestion` (DB 18 rows) → **no route, no API, no frontend ref** (grep of `backend/src` and `frontend/src` → zero hits) → **DEAD CONTENT** ❌
- **Interactive challenges:** `Challenge` (2 SQL rows) → backend `routes/challenge.ts` fully wired (sandboxed runner) → **no frontend consumer** ("challenge(s)" only in `About.tsx` marketing + `Dashboard.tsx` daily-practice, a different system) → **UI-ORPHANED** ❌
- **Practice:** `PracticeQuestion` → `routes/practice.ts` → `/practice/arena` → **REACHABLE** ✅ but **0 SQL questions** → effectively empty for this course.
- **Projects/assignments:** routes live and reachable via course UI; not bound to any content-defined brief (§14).

All route conclusions `[CONFIRMED]` against `frontend/src/App.tsx:58-78` and the grep results; live-site parity `[UNKNOWN — NOT VERIFIED]`.

---

## 22. Scope / Identity Audit

- **Title/description vs content:** The course is titled "Database Management & SQL" — accurate. The DB description promises relational databases, SQL queries, joins, indexes, schema design — all delivered. **"in Hinglish" is a false advertising token**: bodies are English (with Indian examples). `[CONFIRMED]`
- **Scope drift:** The tail of the arc (W16, W18, W19) drifts from "SQL" into "application integration and performance tooling" — defensible for employability, but a learner expecting pure SQL will find driver code, Prisma, and caching. Frame it honestly as "SQL in the application stack."
- **Advertised skills vs delivered:** 20 modules, 4 topics each — delivered exactly as advertised (inventory matches). Depth per topic is ~half the file's own claim (§6).
- **Identity strength:** unambiguous PostgreSQL identity; dialect-scoped claims are handled well (§8.1-9).

---

## 23. Scorecard + Confidence

| # | Dimension | Weight | Score | Weighted |
|---|---|---|---|---|
| 1 | Curriculum Architecture | 10 | 7.0 | 7.0 |
| 2 | Learning Objectives | 10 | 2.0 | 2.0 |
| 3 | Content Quality | 15 | 8.5 | 8.5 |
| 4 | Technical Accuracy | 15 | 9.5 | 9.5 |
| 5 | Practical Learning | 10 | 5.0 | 5.0 |
| 6 | Assessment Quality | 10 | 6.0 | 6.0 |
| 7 | Question Quality | 5 | 3.5 | 3.5 |
| 8 | LO Alignment | 5 | 2.5 | 2.5 |
| 9 | Difficulty Progression | 5 | 3.5 | 3.5 |
| 10 | Industry Relevance | 5 | 4.5 | 4.5 |
| 11 | Project Quality | 5 | 3.0 | 3.0 |
| 12 | Feedback/Learning Support | 5 | 1.0 | 1.0 |
| | **Total** | **100** | — | **56.0 / 100** |

**Band: Weak (50–59).**

**Confidence: MEDIUM-HIGH.**
- **HIGH** on all factual/technical findings: I read 100% of `sql.ts`, `sql_topic_quizzes.ts`, `reseed_sql_full.ts`, `challengeSeedData.ts`, verified the DB inventory, question IDs, frontend routes, and executed every load-bearing SQL claim live against PostgreSQL 16.
- **MEDIUM** on the subjective dimension scores (content depth judgment, difficulty progression, cognitive-level mix) and on live-site parity (repo tree is master; live site runs GitHub main per the deployment-state memory — `[UNKNOWN — NOT VERIFIED]`).

**Independent validation vs prior audit (63.5):** I agree with the prior audit's substantive findings (P0 item, capstone `tsrange`/`btree_gist`, TRUNCATE assessments, missing window functions/CTEs, no objectives/setup/feedback). I **add** two defects the prior audit missed or got wrong: (a) the "TRUNCATE resets counters" lesson error (`sql.ts:467`), and (b) the prior audit marked the "btree index doesn't help IS NULL" claim **Correct** — I **disagree**; my live EXPLAIN shows a plain btree index serving `IS NULL`. The score differs because the mandated rubric here is 12 dimensions (the prior used 7); the numeric gap is not a disagreement about quality so much as a different scoring contract.

---

## 24. Issue Register

| ID | Severity | Location | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| SQL-01 | **P0** | `sql_topic_quizzes.ts:260` / DB `11477` | Unanswerable W10 topic-quiz item — keyed answer is the stem phrase; `ALTER TABLE` absent | file + DB read | Blocks the W10 topic-lock gate; rewards skimming; teaches nothing | Rewrite stem/options so `ALTER TABLE` is the keyed correct answer; reseed |
| SQL-02 | **P1** | `sql.ts:890-891` | Capstone EXCLUDE uses `tsrange` on `timestamptz` columns | Live `SELECT tsrange(now(),…)` → function does not exist | Capstone centerpiece DDL fails verbatim | Use `tstzrange(starts_at, ends_at)` |
| SQL-03 | **P1** | `sql.ts:808`, `sql.ts:891` | `EXCLUDE USING gist (int WITH =, …)` needs `btree_gist` | Live CREATE TABLE → "integer has no default operator class for gist" | W18 + W20 EXCLUDE examples fail on stock PG | Add `CREATE EXTENSION IF NOT EXISTS btree_gist;` prerequisite |
| SQL-04 | **P1** | `sql.ts:479` / DB `11491`; `sql_topic_quizzes.ts:267` / DB `11482` | TRUNCATE taught as non-transactional in assessments | Live BEGIN/TRUNCATE/ROLLBACK → rows survive | Shipped assessment states a falsehood about the course's engine; W10 chapter item has ≥2 correct answers | Engine-scope the items; PG TRUNCATE is transactional |
| SQL-05 | **P1** | Curriculum (full read) | Window functions and CTEs have no dedicated lesson | `sql.ts:291,375` passing mentions; zero `WITH` | Gaps the "modern SQL" promise; reduces employability | Add dedicated W-… topics (RANK/ROW_NUMBER/SUM-over + CTE + recursive CTE) |
| SQL-06 | **P1** | Curriculum (full read) | No environment setup / practice path | grep: no install/psql/Docker/sample-DB content | A beginner cannot execute any of the 80 code blocks | Add a setup lesson + downloadable seed DB; add expected outputs |
| SQL-07 | **P1** | Platform | Final-exam questions (18 SQL) are dead content | zero refs in `backend/src`, `frontend/src` | No summative assessment; certificate not gated on mastery | Serve the final exam (route + UI) or remove the dead table |
| SQL-08 | **P1** | Platform | Interactive SQL challenges UI-orphaned | `App.tsx` routes; only About/Dashboard marketing refs | Sandboxed autograder + 2 SQL challenges unreachable | Add a challenge page + route wiring |
| SQL-09 | **P1** | Platform | No content-defined project/assignment briefs bound to submission routes | `routes/project.ts:38-91`; `routes/assignment.ts:49-88` | W17/W20 briefs are prose; submission is an unbound URL envelope | Bind briefs/rubrics; surface the booking capstone deliverables |
| SQL-10 | **P2** | `sql.ts:467` | "TRUNCATE resets counters" — false for PG | Live: next serial id=3 after plain TRUNCATE | Wrong mental model for test resets | Say "resets counters only with RESTART IDENTITY" |
| SQL-11 | **P2** | `sql.ts:549` | "btree index does not speed `IS NULL`" — false for modern PG | Live EXPLAIN → Index Scan for `WHERE phone IS NULL` | Teaches a false index constraint | Correct the claim; partial index is an optimization, not a requirement |
| SQL-12 | **P2** | All lessons | Depth ~half the header claim on hardest topics (median 149 vs 250-300) | DB word-count query; `sql.ts:4` | EXPLAIN/correlated subqueries/isolation/EXCLUDE too thin to teach | Expand the thinnest high-difficulty topics with worked traces/output |
| SQL-13 | **P2** | Model `SqlSection` | No learning objectives anywhere | `sql.ts:31`; no objectives field | No learner contract; no objective→assessment trace | Add per-week measurable objectives |
| SQL-14 | **P2** | Curriculum | No JSONB operator content | `sql.ts:449` lists JSONB only | Missing a key PG capability | Add `->`/`->>`/`@>` lesson |
| SQL-15 | **P2** | Platform | No explanation/feedback on any course question; no option randomization | `schema.prisma:137-151`; `quizService.ts:52-64,336-338` | Score-without-learning; retake pattern-memorization | Add explanation field + real shuffle |
| SQL-16 | **P2** | Platform | Hardcoded 20-module gates (project) + `week*5` assignment mapping | `routes/project.ts:48-56`; `routes/assignment.ts:49-56` | Latent break if module count ≠ 20 | Use dynamic module-count helper |
| SQL-17 | **P2** | Platform | XP-award guard non-atomic (double-award race) | `quizService.ts:83-112` vs `practiceService.ts:108-121` | Points economy integrity | Apply atomic `updateMany` guard |
| SQL-18 | **P3** | `sql_topic_quizzes.ts:474` / DB `11686` | W19 broken stem ("…is the…") | file + DB read | Sloppy, answerable by elimination | Reword stem to "…is the N+1 problem" |
| SQL-19 | **P3** | `sql.ts:53` | "zero changes / every SQL engine" overstatement | file read | Minor accuracy nit | Soften to dialect-scoped claim |
| SQL-20 | **P3** | Throughout | `serial` without `GENERATED AS IDENTITY` | `sql.ts:66,104,…` | Missed modernity point | Mention identity columns |
| SQL-21 | **P3** | `sql.ts:467` | DROP TABLE "reversible only from a backup" | Live BEGIN/DROP/ROLLBACK → table survives | Inaccurate within a transaction | Add "outside a transaction" |
| SQL-22 | **P3** | DB metadata | Description advertises "in Hinglish"; content is English | DB course row vs full read | False-advertising token | Update description |
| SQL-23 | **P3** | Platform | Assignment uploads are mock-path metadata | `routes/assignment.ts:79,88` | No real file storage | Add upload endpoint |
| SQL-24 | **P3** | Platform | Badge curve front-loaded (week-1 only) | `quizService.ts:101-103` | No recognition for later weeks | Add per-week/perfect badges |

---

## 25. Recommended Improvement Opportunities

Ranked by leverage (all are **recommendations only** — nothing implemented):

1. **Fix the four defective assessment items** (SQL-01 P0 first; then SQL-04, SQL-18). All are content-file corrections + `reseed_sql_full.ts`.
2. **Make the capstone and W18 EXCLUDE DDL executable** (SQL-02/03): `tstzrange` + `CREATE EXTENSION btree_gist` prerequisite.
3. **Add window functions and CTE lessons** (SQL-05) — the two most consequential curriculum gaps.
4. **Add an environment-setup lesson and expected outputs** (SQL-06) so the 80 code blocks are runnable/verifiable.
5. **Add per-week measurable learning objectives** (SQL-13).
6. **Wire the final exam and the interactive challenges into the UI** (SQL-07/08) — turns dead/orphaned assessment live with no content rewrite.
7. **Bind the W17/W20 briefs and a rubric to the project submission flow** (SQL-09).
8. **Correct the two lesson-level PG errors** (SQL-10/11) and polish the P3 items.
9. **Add explanations + real randomization** to the quiz pipeline (SQL-15).
10. **Expand the thinnest high-difficulty topics** (SQL-12): EXPLAIN with a real plan, correlated subquery with a per-row trace, isolation levels, EXCLUDE.

---

## 26. Unknowns / Missing Evidence

- **Live deployment parity:** the live site runs GitHub `main` (4+ commits ahead of local `master`, per the deployment-state memory). All content/DB/route findings are against this repo tree; live content could differ. `[UNKNOWN — NOT VERIFIED]`
- **Whether the P0/P1 content fixes have since been applied on GitHub `main`:** `wave1-decision-spec.md` lists them as planned (decision spec), not shipped. Verify against `main` before editing.
- **Employer-demand quantification** for the SQL syllabus: no labour-market data was available; industry relevance is judged on content-vs-mainstream-practice only. `[INFERRED]`
- **`pg_stat_statements` availability** in the target course environment: taught as a tool (`sql.ts:846`) but the extension is not part of a default PG install. `[UNKNOWN — NOT VERIFIED]` whether the platform's sandbox/tutorial DB has it enabled.
- **Per-question cognitive-level distribution** was judged by full read, not a formal Bloom taxonomy scoring pass. `[INFERRED]`

---

## 27. Final Verdict

**56.0 / 100 — Weak band; clear, evidence-backed path to strong.**

The SQL course is architecturally sound and, at its best, genuinely excellent: the sequence is right, the writing is consistent and industry-anchored, the PostgreSQL dialect-scoping is disciplined, and the applied weeks (W16, W17, W20) are the best in the catalog. It is currently held back by **four clusters of problems, all fixable without a rewrite**: (1) a small but real set of correctness defects in high-visibility spots (one P0 unanswerable item, two P1 TRUNCATE mis-keys, capstone EXCLUDE DDL that does not run), (2) structural absences (no objectives, no setup path, no graded practice, no feedback), (3) a depth-vs-promise mismatch (median 149 words vs a 250–300 claim) concentrated on the hardest topics, and (4) platform-level dead/orphaned assessment (final exam, challenges, empty practice bank) that makes the intended learn→practice→assess loop incomplete. The prior 63.5/100 was directionally right on the findings; under this 12-dimension rubric the independent score is 56.0. Treat the P0 item, the TRUNCATE keys, and the capstone DDL as the immediate blocking work; the objectives/feedback/window-functions/CTE gaps as the high-leverage curriculum work; and the dead-assessment wiring as the platform work.

---

## Improvement Candidates — NOT YET APPROVED

(Next phase decides KEEP / FIX / REWRITE / RESTRUCTURE / REMOVE / ADD / MODERNIZE / DEPRECATE. None applied.)

| Candidate | Decision class | Notes |
|---|---|---|
| W10 topic quiz item `11477` | FIX | Rewrite so `ALTER TABLE` is a valid keyed option; reseed |
| W10 module + topic TRUNCATE items `11491`, `11482` | FIX | Engine-scope to PostgreSQL truth |
| W19 topic stem `11686` | FIX | Reword to "…is the N+1 problem" |
| W20 capstone + W18 EXCLUDE DDL | FIX | `tstzrange` + `CREATE EXTENSION btree_gist` |
| W10 T3 / W11 T2 overlap | RESTRUCTURE | Re-point W10 T3 to drop/truncate only; delete-rule detail to W11 |
| Window functions & CTEs | ADD | New dedicated topics |
| Environment setup + expected outputs | ADD | Setup lesson + outputs on code blocks |
| Learning objectives per week | ADD | Objectives field on `SqlSection` |
| JSONB operators, `GENERATED AS IDENTITY` | ADD / MODERNIZE | Fill type-function gaps |
| Final exam serving | FIX (platform) | Route + UI, or DEPRECATE the dead table |
| Interactive challenge wiring | FIX (platform) | Frontend challenge page using existing seeds |
| Project/assignment brief binding | FIX (platform) | Bind W17/W20 briefs + rubric to submission routes |
| Practice bank for SQL | ADD | Seed SQL practice questions with explanations |
| "TRUNCATE resets counters" / btree-IS-NULL / DROP-backup claims | FIX | Lesson-level PG corrections |
| Hinglish description | FIX | Align description with English content |

---

*Audit-only. No product content, seed file, database record, source code, or schema was modified. The only file written is this report.*

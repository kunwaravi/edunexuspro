# TASK 4 — Enrollment Foundation + Server-Side Course Access Control · Report

> Scope: additive, backward-compatible, production-safe. Local dev DB (`nexus`) is
> NOT Prisma-migration-managed → schema applied via `prisma db push` (never
> `migrate deploy` locally). Prod applies the new migration via on-container-start
> `migrate deploy`.
> Date: 2026-08-16 · Repo: `kunwaravi/edunexuspro` (master)
> Baseline: `docs/phase1-course-catalog-report.md` (TASK 3) — schema/routes/services
> re-inspected before coding, not assumed.

---

## A. Objective

✅ **CONFIRMED** — Phase 4 of the Universal Course Architecture: an explicit
`Enrollment` model as the canonical **learning-access** record, backfilled from
VERIFIED payments, with all premium course-learning endpoints gated server-side.
Payment remains the **financial/audit** record; certificate rules untouched.
Course.id, legacy `/course/:id`, Phase-1 `/course/:slug`, progress records,
payment records, and certificate records all preserved.

---

## B. Files changed

**Backend — schema / data**
| File | Change |
|---|---|
| `backend/prisma/schema.prisma` | `Enrollment` model + relations on `User`/`Course`. |
| `backend/prisma/migrations/20260816130000_add_enrollment/migration.sql` | **New** — canonical additive migration (prod `migrate deploy`). |
| `backend/prisma/backfill_enrollments.ts` | **New** — idempotent backfill from VERIFIED payments. |
| `backend/prisma/verify_data_safety.ts` | **New** — §K data-safety snapshot tool (run before/after). |

**Backend — access logic**
| File | Change |
|---|---|
| `backend/src/services/enrollmentService.ts` | **New** — canonical access service (`getEnrollment` / `isEnrolled` / `canAccessCourse` / `requireEnrollment` / `assertEnrolled` / `syncEnrollmentFromVerifiedPayment`). |
| `backend/src/services/paymentService.ts` | `adminVerifyPayment` now also activates Enrollment (idempotent). |
| `backend/src/services/quizService.ts` | Ownership-chain validation in `submitQuiz` (cross-course question/topic rejection). |

**Backend — routes (premium guards)**
| File | Endpoints protected |
|---|---|
| `backend/src/routes/course.ts` | `GET /:courseId/module/:week` |
| `backend/src/routes/quiz.ts` | `GET /questions/topic/:topicId`, `GET /questions/:courseId/:week`, `POST /submit` |
| `backend/src/routes/challenge.ts` | `GET /course/:courseId`, `GET /:id`, `POST /:id/run-test`, `POST /:id/complete` |
| `backend/src/routes/assignment.ts` | `GET /status/:courseId`, `POST /submit`, `GET /:courseId/solutions`, `PATCH /:id/privacy` |
| `backend/src/routes/project.ts` | `GET /status/:courseId`, `POST /submit`, `GET /:courseId/solutions`, `PATCH /:id/privacy` |
| `backend/src/routes/forum.ts` | `POST /` course-scoped post — consolidated to `isEnrolled()` |

**Frontend (minimal, no redesign)**
| File | Change |
|---|---|
| `frontend/src/hooks/useCourseDetail.ts` | New `moduleAccessDenied` state; backend 403 → clean access-required flag (no premium fallback). |
| `frontend/src/pages/CourseDetail.tsx` | Destructures flag; renders "Enrollment Required" card and suppresses topic list when access denied. |

**Tests**
| File | Change |
|---|---|
| `backend/tests/task4_security_tests.ts` | **New** — §J 17-case security/ownership suite (+ admin/forum smoke). |

---

## C. Schema / migration changes

✅ **CONFIRMED** — Migration `20260816130000_add_enrollment`, generated via
`prisma migrate diff` so it exactly matches what `migrate deploy` produces on the
VPS. Pure additive: `CREATE TABLE "Enrollment"` + 3 indexes + 2 FKs. **No drops,
no data-loss, no column changes.** Safe to re-run (once recorded in
`_prisma_migrations`, deploy is a no-op).

```prisma
model Enrollment {
  id         String   @id @default(cuid())
  userId     Int                        // NOT String — must match User.id Int
  courseId   String
  status     String   @default("ACTIVE") // ACTIVE | SUSPENDED | EXPIRED (String per project convention)
  enrolledAt DateTime @default(now())
  source     String?                    // "PAYMENT"
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course     Course   @relation(fields: [courseId], references: [id])
  @@unique([userId, courseId])
  @@index([courseId])
  @@index([userId, status])
}
```

🔶 **IMPLEMENTED — documented deviation:** spec draft said `userId String`, but
`User.id` is `Int`; a String FK cannot reference it. Used `Int` (mirrors every
other relation to `User`). Enrollment `status` is a String (ACTIVE/SUSPENDED/
EXPIRED), not a Prisma enum, per the project's intentional String-status
convention. No other enrollment states added.

🔶 **IMPLEMENTED:** only the three allowed statuses exist in code
(`ENROLLMENT_STATUS` const in `enrollmentService.ts`).

---

## D. Enrollment / backfill behavior

✅ **CONFIRMED — backfill rule:** every `Payment.status === "VERIFIED"` pair →
`Enrollment(userId, courseId, ACTIVE, source="PAYMENT")` via upsert on
`@@unique([userId, courseId])`. Idempotent. **Ran twice → 3 enrollments, 0
duplicates both runs.**

**CourseProgress-without-payment decision (documented per spec §B):**
✅ **CONFIRMED — NOT converted.** The existing application treats `CourseProgress`
as a **learning record** (created when a user passes quizzes via
`quizService`/`challengeService`), not as proof of purchase. Every existing access
check (forum POST, certificate generation) keys off **VERIFIED payment**, never
off progress. Fabricating enrollments from progress would invent purchase history,
so none were created. Locally: 0 CourseProgress pairs lacked a VERIFIED payment,
so this had no local effect — but the decision is in place for prod.

**Counts (local dev DB):**
| Metric | Value |
|---|---|
| Verified payment rows | 3 |
| Distinct (user, course) pairs | 3 |
| Enrollment rows (all ACTIVE) | 3 |
| Duplicate enrollment pairs | 0 |
| Enrollments w/ missing User/Course FK | 0 |

✅ **CONFIRMED:** enrollment count == distinct VERIFIED-payment pairs; no dupes;
all ACTIVE enrollments reference valid User + Course.

**Payment → enrollment wiring (spec §D):** `adminVerifyPayment` sets
status → VERIFIED, then calls `syncEnrollmentFromVerifiedPayment(userId,
courseId)` (upsert). Only the VERIFIED transition triggers it; INITIATED/PENDING/
FAILED never reach that path. `submitPaymentForVerification` (student submit →
PENDING) unchanged — no auto-activation. Payment remains the financial/audit
record; Enrollment is the access record.

---

## E. Endpoint authorization audit

Canonical rule (single source, `enrollmentService`): **ACTIVE = access;
SUSPENDED / EXPIRED = no premium access.** Admins (`role === 'ADMIN'`) are
exempt — required so the existing CMS (`AdminDashboard` syllabus editor) keeps
working; it reuses the same `GET /courses/:courseId/module/:week` endpoint.

### 🔶 PROTECTED (authenticate → resolve ownership → require ACTIVE enrollment → serve)
| Route | Guard basis |
|---|---|
| `GET /api/courses/:courseId/module/:week` | courseId (param) |
| `GET /api/quiz/questions/topic/:topicId` | topic → module → course (server-resolved) |
| `GET /api/quiz/questions/:courseId/:week` | courseId |
| `POST /api/quiz/submit` | courseId + **ownership: every answer-key question must resolve to a module of courseId; topicId must match course+week** |
| `GET /api/challenges/course/:courseId` | courseId |
| `GET /api/challenges/:id` | challenge → owning course |
| `POST /api/challenges/:id/run-test` | challenge → owning course |
| `POST /api/challenges/:id/complete` | challenge → owning course |
| `GET /api/assignments/status/:courseId` | courseId |
| `POST /api/assignments/submit` | courseId (+ existing week→module pass gate) |
| `GET /api/assignments/:courseId/solutions` | courseId (+ existing approved-week gate) |
| `PATCH /api/assignments/:id/privacy` | submission → owning course (+ owner check) |
| `GET /api/projects/status/:courseId` | courseId |
| `POST /api/projects/submit` | courseId (+ existing 20-module pass gate) |
| `GET /api/projects/:courseId/solutions` | courseId (+ existing approved-project gate) |
| `PATCH /api/projects/:id/privacy` | submission → owning course (+ owner check) |
| `POST /api/forum` (course-scoped) | courseId — consolidated to `isEnrolled()` (was a raw payment lookup) |

### ⚪ Intentionally left public / un-gated (and why)
| Endpoint | Why |
|---|---|
| `GET /api/courses` (catalog) | Spec §F — public; no premium content. |
| `GET /api/courses/:slug` and `/:courseId/public` | Spec §F — public syllabus (topics = id + title only). |
| `GET /api/certificate/verify/:credentialId` | Spec §I — public credential registry; eligibility unchanged. |
| `GET /api/challenges/counts` | Aggregate `{total, completed}` counts only — no lesson/quiz/code material; spec's premium list is content-bearing endpoints. Auth-required, not enrollment-gated. |
| All `ADMIN` CRUD routes | Already `isAdmin`-gated (module/topic/question/course/payment/evaluate). |
| `GET /api/certificate/:courseId` (+ `/user/:courseId`) | Certificate generation keeps its own payment+completion eligibility (spec §I — untouched). |

**No premium content leaks in 403 responses** — messages are generic
("Access to this course requires an active enrollment."); the 404 path for
nonexistent modules/courses does not disclose the resource shape beyond the
requested id.

---

## F. Validation / test results

✅ `prisma validate` — valid.
✅ Migration = canonical `prisma migrate diff` output; additive only.
✅ Backend `tsc --noEmit` — 0 errors.
✅ Frontend `tsc -b && vite build` — passes.
✅ Frontend `eslint` on changed files — 0 issues.
✅ Backfill **run twice** — 3 rows, 0 dupes, idempotent.
✅ **Security/ownership suite `backend/tests/task4_security_tests.ts` — 17/17 PASS**
  (fresh JWT-minted tokens; temp payment/enrollment fixtures created then
  deleted; DB verified back to baseline after):

| # | Case | Result |
|---|---|---|
| 1 | Enrolled user → own course premium lesson | 200, has `text` |
| 2 | Same user → un-enrolled course lesson | **403** |
| 3 | Cross-course topicId topic-quiz | **403** |
| 4 | Cross-course quiz submit (C++ questions vs courseId=C) | **403** |
| 5 | PENDING payment → access | **403** |
| 6 | FAILED payment → access | **403** |
| 7 | VERIFIED payment (admin flow) → ACTIVE enrollment | ✅ ACTIVE, source=PAYMENT |
| 8 | Re-sync → no duplicate | rows=1 |
| 9 | SUSPENDED → blocked | **403** |
| 10 | EXPIRED → blocked | **403** |
| 11 | Public catalog without enrollment | 200, 9 courses |
| 12 | Public detail leaks no text/code/answers | ✅ clean |
| 13 | Legacy `/courses/C` resolves | 200 |
| 14 | Slug `/courses/c` resolves | 200 |
| 15 | CourseProgress intact | count=1 |
| 16 | Payments intact | count=3 (post-cleanup) |
| 17 | CertificateRecords intact | count=3 |

✅ **Additional smoke (live server):** admin module fetch 200 (CMS unbroken);
forum non-enrolled 403, admin 201, enrolled 201.

✅ **Data safety (§K)** — verified via `prisma/verify_data_safety.ts` before and
after: Course 9, Module 180, Topic 705, Payment 3, CourseProgress 1,
ModuleProgress 1, TopicProgress 1, CertificateRecord 3 — **none decreased**;
Enrollment 3 == distinct verified pairs; 0 duplicates; 0 orphan FKs.

---

## G. Risks / open follow-ups

🔶 **IMPLEMENTED — behavioral change to flag:** premium learning content (lesson
text/code, quiz bank, challenges, assignments, projects) is now gated behind
**ACTIVE enrollment**, and enrollment comes from **VERIFIED payments**. Users
without a verified payment lose free access to premium lesson bodies — they can
still browse the full public syllabus (module outlines + topic titles), read the
public catalog/detail, and the certificate/payment flow is unchanged. `Home.tsx`
still carries the marketing line *"100% Free Access — No enrollment fees or
payments for learning curriculum"* — that copy now conflicts with the enforced
access model and was left untouched (out of scope). **Decide whether to update the
copy or relax the gate (e.g. free-tier preview).**

🔶 **IMPLEMENTED — admin exemption:** `role === 'ADMIN'` bypasses enrollment
checks. Required for the CMS (SyllabusManager reuses the module endpoint) and for
operational verification. Documented; not a spec deviation that affects students.

⚪ **UNKNOWN — prod dataset:** counts/behavior above are the local dev DB (3
payments). Prod has a larger dataset; the backfill is idempotent and additive, so
running it on prod creates one ACTIVE enrollment per distinct verified-payment
pair. **Run `verify_data_safety.ts` + `backfill_enrollments.ts` on prod before
releasing the access-gated build** so enrolled students don't lose access mid-day.

🔶 **IMPLEMENTED — certificate compatibility:** certificate generation/verification
logic untouched; eligibility still keys off VERIFIED payment + completion
(spec §I). Introducing Enrollment did not alter any certificate code path.
`verifyIssuedCredential` for admin-verified records still skips the payment
re-check (issue #101 semantics preserved).

⚪ **Follow-up candidates (deferred, out of scope):** admin-only catalog endpoint
(TASK 3 §G#1); admin dashboard "enrollments" metric still derives from
`user.progresses` counts rather than the `Enrollment` table; a public
"is-enrolled" affordance for the course detail page (frontend currently learns
access only via the module-fetch 403); retroactive enrollment for users whose
access predates payments (e.g. admin-granted) if the product wants that — not
fabricated here.

🔶 **IMPLEMENTED — non-goals respected:** no Assignment model, no FinalExam
revival, no certificate UI change, no CourseDetail redesign, no content rewrite,
no price change, no coupons/ratings/bundles, no content-loader refactor, no
Payment replacement, no `Payment.status` removal, no Course.id migration, no
`Module.week` rename, no second hierarchy, no Prisma enums, no destructive
migrations.

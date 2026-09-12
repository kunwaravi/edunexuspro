# EduNexus Pro — Backend Audit → Action Plan (Phase 4)

> **Document type:** Analysis + action plan ONLY. **No code changed, no files created/edited, no packages installed, no DB/migration touched, no API/auth/payment/config modified.** Audit branch: local `master` == GitHub `master` (`d5ca6a4`) == live production.
> **Method:** complete read of `backend/src` (all 12 routers, 9 services, 5 middleware, 5 lib, entry), `prisma/schema.prisma`, seed/reseed scripts, Dockerfile + compose files, plus the Phase 3 frontend inventory. Five read-only deep-dive passes (architecture/endpoints · auth/security · payment/certificate · course/quiz/practice/DB · FE↔BE contract), reconciled against direct first-hand reads.
> **Labels:** ✅ CONFIRMED (code, file:line) · 🔶 LIKELY (deployment-dependent) · ⚪ OPTIONAL.
> **Paths:** relative to `backend/` unless prefixed `frontend/`.
> **Endpoint count:** 76 mounted endpoints across 12 routers (`src/index.ts:69-80`).

---

## 1. Backend Health Summary

**The backend core is stronger than its surface.** The post-incident hardening (referral/coupon discount caps, no-auto-verify payment state machine, IDOR-scoped payment submit, unguessable credential IDs, PII-suppressed legacy verification) is real, correct, and live. Auth flows, the payment lifecycle, and the certificate registry are well-designed. The fragility is in four places:

1. **Grading/progress integrity is exploitable.** The quiz grader trusts a client-chosen question subset as the denominator and binds no question to the claimed module/topic — a student can pass any module with one correct answer and mark arbitrary progress (`quizService.ts:29-49, 37-44`). Everything downstream (certificates, project gates, assignment gates, XP, grades) consumes this forged progress. **P0.**
2. **One live account-takeover vector.** `POST /auth/forgot-password` returns the raw reset token in the HTTP response body — an unauthenticated attacker needs two requests to take over any account whose email they know. **P0.**
3. **Domain rules hardcoded to the old 20-module track.** The Final Project gate hardcodes `< 20` (`project.ts:49-57`) and the Assignment gate maps `weekNum * 5` (`assignment.ts:49-57`) — both **permanently block the paid CADDED (5-module) tracks**. Business constants live in 8+ hardcoded sites; `src/lib/businessRules.ts` is dead code.
4. **Contract and structure drift.** 4 route domains run raw Prisma inline in handlers (no service layer), 8 admin/list endpoints are unpaginated, error responses use 3 competing shapes, the frontend duplicates coupon/pricing math and a static course catalog, and ~11 endpoints/routes are orphans (called without a route, or shipped with no caller).

**Verdict:** no rewrite warranted. The action plan below is a targeted sequence: close the 2 P0s → fix the 5 broken course/quiz gate rules → harden security (rate limiting, headers, validation, transactions) → normalize the contract → centralize business rules → database indexes/constraints → cleanup.

---

## 2. What Is Already Good

| # | Area | Evidence | Notes |
|---|---|---|---|
| 1 | Payment cannot auto-verify | `paymentService.ts:103-106, 146-148` | Every order starts `INITIATED`; `submitPaymentForVerification` hardcodes `PENDING` even for ₹0 orders; the only `VERIFIED` writer is `adminVerifyPayment` (`:172-175`) behind `isAdmin`. The historical ₹0/SAVI10 exploit paths are closed. |
| 2 | Payment order ownership | `paymentService.ts:142-144` | `/payments/verify` rejects an `orderId` that isn't the caller's (IDOR fix). |
| 3 | Discount caps + amount integrity | `paymentService.ts:78, 94, 101` | Referral cap 0.5, coupon cap 0.5, `finalAmount = max(0, round(...))`; the client-sent `amount` is accepted in the body but **ignored** — server recomputes from `Course.price`. |
| 4 | Credential IDs unguessable + persisted | `certificateService.ts:12-16, 118-137` | 64-bit random IDs; verification is a record lookup; regeneration reuses the printed ID. |
| 5 | PII gating on public verify | `certificateService.ts:210-222, 296-346` | PENDING → no PII; legacy (guessable) IDs → no PII; full PII only for unguessable VERIFIED IDs or the owner. |
| 6 | Certificate access control | `certificate.ts:86-96` | Self-or-admin enforced; admin routes registered before `/:courseId`; public verify rate-limited. |
| 7 | Sandbox execution safety | `sandboxService.ts:99-123, 171-198` | Temp-dir (no shell interpolation), ulimits, process-group kill, env-stripped, output-capped; `challengeRunnerService` deliberately avoids `vm`. |
| 8 | Daily-challenge double-claim guard | `practiceService.ts:108-121` | Atomic `updateMany` on `lastActiveAt` closes issue #74. |
| 9 | Rate limiting on the sensitive surface | `auth.ts` (register 5/300s, login 10/60s, forgot 5/60s, reset 10/60s), `payment.ts` (10/60s ×2), `certificate.ts` (20/60s), `sandbox.ts` (10/60s), `challenge.ts` (15/60s) | Path-scoped keys so one route can't exhaust another's budget. |
| 10 | Referral aggregation without N+1 | `authService.ts:221-286` | `getAllUsers` computes counts in memory, not per-row queries. |
| 11 | Failure-fast env for JWT | `env.ts:14-23`, `index.ts:26-29`, `auth.ts:7` | No hardcoded secret fallback; missing `JWT_SECRET` kills boot. |
| 12 | CORS allowlist + body limit + graceful shutdown | `index.ts:34-61, 114-137` | Origin callback rejects unknown origins; 1mb body cap; SIGTERM/SIGINT teardown. |
| 13 | Clean service layer where it exists | `authService`, `courseService`, `quizService`, `paymentService`, `certificateService`, `challengeService`, `sandboxService` | Controllers/handlers in routes delegate; `notFoundTo404` maps Prisma P2025 → 404 in course/quiz. |
| 14 | Uniqueness constraints in the data model | `schema.prisma:65, 261, 282, 298, 342, 366, 382` | `(user,course)`, `(user,course,week)`, `(user,module)`, `(user,topic)`, `(user,challenge)`, `(course,dashedName)`, `(course,week)` all enforced. |

---

## 3. Confirmed Problems

Organized by the deep-dive areas. Every item is confirmed in code with file:line.

### 3.1 Grading & progress integrity (CRITICAL)

- **P0 — Quiz scoring denominator exploit.** `submitQuiz` sets `totalQuestions = questions.length` where `questions` is only the `findMany({ where: { id: { in: questionIds } } })` subset the client submitted (`quizService.ts:29-49`). Submitting **one correct answer** yields `score = 100`, `passed = true` (`:66-67`) → XP, `perfect_score` badge, and progress upserts. The zod schema (`validation.ts:71`) has no length check. **Fix direction:** require `answers.length` to equal the module's real question count (or the fixed sample size) and only grade questions belonging to the claimed `moduleId`/`topicId`.
- **P0 — Progress identity exploit (same root cause).** The question fetch has **no `moduleId`/`courseId`/`topicId` filter** (`quizService.ts:37-44`), so a client can submit question IDs from any course/week while claiming any `courseId`/`week`/`topicId`; on pass the service upserts `TopicProgress`/`ModuleProgress`/`CourseProgress` for the claimed IDs (`:114-212, 216-282`). Any topic/module/course can be marked complete. **Fix direction:** bind the fetch to the claimed module (`where: { id: { in }, moduleId }`, plus `topicId` when supplied) and verify the topic belongs to that module.
- **P1 — Progress written without evidence.** `challengeService.completeChallenge` sets `ModuleProgress.update: { completed: true, quizPassed: true }` when all module challenges pass (`challengeService.ts:151-161`) — `quizPassed` is set **without any quiz** and `CourseProgress` advances as if a quiz week cleared. **Fix direction:** use a distinct challenge-completion flag; don't write `quizPassed`.
- **P1 — `FinalExamQuestion` seeded but unserved.** The model exists (`schema.prisma:302-313`) and reseeds create 15 real questions, but **no route or service reads it** (grep for `finalExam|exam` in `src/` = nothing). The final exam is entirely unimplemented. **Fix direction:** implement the exam route/scoring or remove the model + seed.

### 3.2 Course-length rules hardcoded to the old 20-module track (functional blockers)

- **P1 — Final Project gate: `completedCount < 20`.** `project.ts:49-57` counts `moduleProgress` rows with `quizPassed: true` and blocks submission until 20. CADDED courses have 5 modules (`reseed_cadd_*_full.ts`) → **the Final Project is permanently locked for paying CADDED students** (no submission → no admin evaluation → no project completion). **Fix direction:** derive the required count from `module.count({ where: { courseId } })` (the same DB-derived pattern already used at `quizService.ts:34-35`).
- **P1 — Assignment gate: `weekNum * 5`.** `assignment.ts:49-57` maps Week 1→Module 5 … Week 4→Module 20. On any course without `week: 10/15/20` modules (all 5-module CADDED tracks), Week 2+ assignment submissions return 400 "Invalid week number". **Fix direction:** resolve the required module from the course's actual week model.

### 3.3 Authentication & sessions

- **P0 — Reset token returned in the API response body.** `authService.forgotPassword` returns `{ sent: true, resetUrl }` where `resetUrl` embeds the live `resetToken` (`authService.ts:108-126`; `auth.ts:32-39`). Unauthenticated attacker: POST forgot with victim email → receive token → POST reset-password → **full account takeover in 2 requests**. The same shape is an **email-enumeration oracle** (token present for existing, absent for non-existing). **Fix direction:** never return the token/URL in the body; deliver by email (SMTP/nodemailer; the existing `certificate-emailer` Gmail pattern applies); return an identical body for every email; restrict dev URL to `NODE_ENV === 'development'`.
- **P1 — Reset tokens stored in plaintext at rest.** `resetToken` is the raw hex string (`authService.ts:114-120`); a DB read yields a working token. **Fix direction:** store `sha256(token)`, look up by hash, keep the raw token only in the emailed link.
- **P1 — Tokens survive password change; no logout/revocation.** `resetPassword` only updates `password` + clears reset fields (`authService.ts:141-148`); there is no `jti`/`tokenVersion`/blacklist anywhere, and `POST /auth/logout` has **no backend route** (the frontend's 404 is swallowed at `frontend/src/context/AuthContext.tsx:69-71`). Stolen JWTs live the full 1 day even after a password change. **Fix direction:** add a `tokenVersion` on `User` (bump on password change) or a `jti` denylist checked in `authenticateToken`.
- **P2 — `/auth/verify` has no backend route.** `frontend/src/pages/Verify.tsx:47` calls `GET /auth/verify?token=…`; `auth.ts` has no such route (verified — 8 routes total). Every user clicking the email-verification link lands in the failure branch. `isVerified`/`verificationToken` (`schema.prisma:26-27`) are **never set or checked anywhere**. **Fix direction:** implement the verify route + token schema + `isVerified` enforcement, or delete the Verify page and the dead fields (decide the product intent).
- **P2 — `/auth/me` exposes the caller's own `resetToken`/`resetTokenExpires`/`verificationToken`.** `getUserById` returns the full user minus password (`authService.ts:192-219`); `/auth/me` (`auth.ts:56-58`) and admin-update responses leak them. **Fix direction:** a `safeUserSelect` excluding all auth-token fields.
- **P3 — Invalid/expired token returns 403 instead of 401.** Missing token → 401 (`middleware/auth.ts:16`), invalid/expired → **403** (`:29`). Breaks RFC 6750 and client 401-handling. **Fix direction:** 401 + `WWW-Authenticate` for all token failures; keep 403 for `isAdmin`; 404 for user-not-found.
- **P3 — Registration is a user-enumeration oracle + login has a timing oracle.** `'User already exists'` on register (`authService.ts:56-59`); `bcrypt.compare` is skipped when the user doesn't exist (`authService.ts:164-171`). **Fix direction:** identical messages; bcrypt against a dummy hash on the absent-user path.
- **P3 — JWT lacks `issuer`/`audience` and verify has no `algorithms` allowlist.** `authService.ts:95,183`; `middleware/auth.ts:19`. **Fix direction:** pin `algorithms: ['HS256']`, add `issuer`/`audience`.

### 3.4 Authorization / access control

- **P1 — Course content + quiz bank are not enrollment-gated.** `GET /courses/:courseId/module/:week` (`course.ts:35`), week/topic quiz questions (`quiz.ts:13,30`), and quiz submission require only auth — any authenticated user can read all premium topic text/code and scrape the full question bank regardless of payment. Forum *posting* IS gated (`forum.ts:146-153`); certificates ARE gated (`certificateService.ts:94-105`). Inconsistent. **Fix direction:** decide the product rule; if content is premium, add an enrollment/access middleware (VERIFIED payment) to module content + quiz + challenge endpoints and align the frontend lock.
- **P2 — Forum read + comment paths not gated.** List/single-post (`forum.ts:19-28, 92-119`) and comment (`forum.ts:187-237`) have no enrollment check while posting does. **Fix direction:** apply the same gate.
- **P2 — Stored XSS in forum.** No server-side sanitization of `title`/`content` anywhere in `src/` (grep = nothing); content is stored raw and replayed raw. If the frontend renders markdown/HTML, this is stored XSS. **Fix direction:** sanitize on write (server) or escape on read.
- **P2 — Assignment/project `fileUrl`/`fileName` unvalidated and served to peers.** No upload endpoint exists (no multer anywhere); routes accept arbitrary `fileUrl` strings with fallback `/uploads/mock_${fileName}` (`assignment.ts:79,88`; `project.ts:64,78`), and peer solutions serve them back (`assignment.ts:219-237`; `project.ts:204-224`) → phishing link vector. **Fix direction:** validate/sanitize URLs (scheme allowlist), cap lengths; remove the `/uploads/mock_` fiction or add a real validated upload endpoint.

### 3.5 Security middleware & hardening

- **P1 — Rate limiter is in-memory and miskeys behind the reverse proxy.** `rateLimiter.ts:4` is a `Map` (per-process, resets on restart, multiplied across instances); `req.ip` is the key source (`:18`) and **`app.set('trust proxy')` is never set** (`index.ts`). Prod binds `127.0.0.1:5000` behind nginx (`docker-compose.prod.yml:7`) → **every user shares the proxy IP → one global bucket per path → site-wide lockouts on login/register/sandbox**, and per-attacker brute-force protection disappears. The XFF fallback would be spoofable if `trust proxy` were enabled. **Fix direction:** set `trust proxy` to the proxy hop count; key on the first untrusted XFF hop; back the store with Redis (Redis is already a dependency for leaderboard caching).
- **P2 — Public credential-verify limit keyed per credential ID.** The limiter key includes the path (`rateLimiter.ts:22`), and `/verify/:credentialId` embeds the ID → each ID gets its own 20/min budget; enumeration is not IP-throttled (mitigated only by unguessable IDs + PII gating). **Fix direction:** key on IP + route without the dynamic segment.
- **P2 — Missing security headers.** No Helmet/CSP/X-Content-Type-Options/X-Frame-Options/HSTS (`index.ts` has none). With the auth token in `localStorage`, missing CSP is the most consequential (XSS → token theft). **Fix direction:** add Helmet + a tight CSP; long-term, consider an httpOnly Secure SameSite cookie for the token.
- **P2 — `POST /api/contact` is public, unvalidated, unrate-limited.** Presence-check only (`contact.ts:35-39`), no email format/length, no limiter; `GET /messages` is unbounded and returns full PII. **Fix direction:** zod schema + rate limit + pagination.
- **P2 — `validateBody` gives false confidence; admin writes lack validation.** `middleware/validate.ts:4-20` is presence-only; admin PUT/DELETE for course/module/topic/question, `PUT /auth/admin/users/:userId` (can set arbitrary `role`/`points`, NaN risk), contact settings write **any key** (`contact.ts:90-104`), forum/assignment/project bodies — all unvalidated or presence-only. `courseEnrollSchema` (`validation.ts:57-61`) is dead. **Fix direction:** zod schemas with bounded strings/arrays on every body-bearing route.
- **P2 — Error handler leaks internals; three competing error shapes.** `errorHandler` returns raw `err.message` (+ stack in dev) (`errorHandler.ts:38-51`) — Prisma P2025/P2003/P2021 and NaN-id errors surface DB/table names. Route-level handlers return bare `{message}` (`assignment.ts:32,121,143,242`; `project.ts:33,112,133,229`; `practice.ts:37`; `course.ts:25`), services return `{error,status}` objects re-shaped in routes, and the global handler returns `{status,statusCode,message}`. The FE reads `.message` in ~20 places and works, but the spread invites drift. **Fix direction:** central Prisma-error mapping (log full, return generic), one envelope, all catches → `next(err)`.
- **P2 — Side-effecting GET.** `GET /certificate/:courseId` creates a `certificateRecord` on first generate (`certificateService.ts:129-136`) — a read that writes. **Fix direction:** move record creation into a POST (or make the GET idempotent-only for reads and require an explicit issue call).
- **P3 — Unrate-limited quiz/practice submit.** `quiz.ts:49`, `practice.ts:42` have no limiter (XP is mostly guarded, but unbounded DB writes). **Fix direction:** per-user submit limiter.
- **P3 — `parseInt` on admin path ids without NaN guard** (`auth.ts:77,94`; `course.ts:38`; `certificate.ts:88`) → Prisma 500s. **Fix direction:** `Number.isInteger` guard before querying.

### 3.6 Payments

- **P1 — `Payment.transactionId @unique` is never written → UPI reference replay.** The unique column (`schema.prisma:157`) is never set; the user-supplied `gatewayReference` goes into the non-unique `reference` (`paymentService.ts:149-155`). The same UPI transaction reference can be submitted against multiple orders/courses → multiple PENDING rows an admin could all verify → **one real payment yielding multiple certificates**; enforcement relies on admin vigilance. **Fix direction:** set `transactionId` from the submitted reference (or generate one) and surface P2002 as a 409.
- **P2 — `/payments/verify` has no state-machine guard.** Ownership is checked, but any status can be re-submitted to `PENDING` (`paymentService.ts:131-158`): a user can flip their own `VERIFIED` back to `PENDING` (self-revoke) or revive an admin-`FAILED` payment without a new order. **Fix direction:** only allow `INITIATED → PENDING` plus an explicit `FAILED → PENDING` retry; reject `VERIFIED`/`SUCCESS`.
- **P2 — `create-order` is not idempotent.** The duplicate check blocks only `VERIFIED/PENDING/PENDING_VERIFICATION` (`paymentService.ts:48-57`); `INITIATED` and `FAILED` rows are ignored and every call inserts a fresh `INITIATED` row (`:108-115`). Double-click/retry accumulates duplicate orders and PENDING records. **Fix direction:** reuse/reject an existing `INITIATED` order for `(user, course)` and/or a client idempotency key.
- **P3 — Unknown `courseId` in `create-order` → Prisma FK 500.** `courseId` that doesn't exist still creates a Payment (`paymentService.ts:63` fallback price) → P2003. **Fix direction:** return a clean 400 when the course is missing.
- **P3 — Admin verify/fail/delete and certificate verify/unverify are not audited.** No audit table/log. **Fix direction:** admin audit log.

### 3.7 Frontend↔backend contract

- **P1 — Price/discount math duplicated and divergent.** The FE hardcodes `BASE_PRICE = 699` (`frontend/src/pages/PayPage.tsx:26`; `EnrollmentPanel.tsx:80`) and duplicates the coupon map **without the 50% cap** (`PayPage.tsx:92-112` vs `paymentService.ts:82-95`). Three concrete divergences: (a) a course priced ≠ 699 shows one QR amount (FE) and records another (BE); (b) the ₹200-off coupons compute against `699` vs `course.price`; (c) a course < ₹400 shows >50% off in the UI while the server silently caps at 50%. **Fix direction:** backend is the single source of truth — add `GET /payments/checkout/:courseId` (basePrice, referralDiscount, couponDiscount, finalAmount, isFree); PayPage renders only that; drop the FE coupon map and `BASE_PRICE`; move the coupon map to a DB `Setting` table so codes are auditable/changeable without deploy.
- **P1 — Admin quiz CMS gets blank correct answers.** `AdminDashboard.tsx:535` calls the student endpoint `GET /quiz/questions/:courseId/:week`, which strips `correctAnswer` (`quizService.ts:17-19`); the CMS renders `q.correctAnswer` (`AdminDashboard.tsx:1312`) — always blank. **Fix direction:** admin-only quiz-questions endpoint that includes `correctAnswer`; keep the student one stripped.
- **P1 — Dead `VERIFIED` branch in PayPage.** After the #100 fix the server always returns `PENDING` from `/payments/verify` (`paymentService.ts:148`); the FE's `payment.status === 'VERIFIED'` success toast/redirect is unreachable (`PayPage.tsx:189-194`), and the stale `:170` comment asserts behavior the backend forbids. **Fix direction:** delete the branch + comment; single "awaiting admin verification" path.
- **P1 — `amount` is required by the schema but ignored by the server.** `createOrderSchema` requires `amount` (`validation.ts:113`), the FE sends it (`PayPage.tsx:177-181`), the server recomputes from `course.price` (`paymentService.ts:60-63,101`). **Fix direction:** drop `amount` from the schema + FE payload (or 409 on mismatch).
- **P2 — Three response-envelope conventions.** Raw arrays (`course.ts:12`, `auth.ts:68`, `payment.ts:10`, `certificate.ts:24`, `contact.ts:57`) vs `{key: []}` (`assignment.ts:29`, `project.ts:30`, `forum.ts:30`, `practice.ts:199/207`) vs flat objects (`payment.ts:87-91`). FE consumers hardcode each shape (`Home.tsx:602`, `useCourseDetail.ts:25`, `CourseDetail.tsx:250/268`, `LeaderboardTab.tsx:53-60`). **Fix direction:** normalize to one convention (`{ data, meta }`) with a shared TS types module, or at minimum document it.
- **P2 — Static course-catalog fallback masks API failure.** When `/courses` fails/empty, Home renders inline catalog data (`Home.tsx:18-244, 246-492, 637`) indistinguishable from live — a source-of-truth violation. **Fix direction:** visible error/retry state; single source (`config/courses.ts` ↔ DB already drifts).
- **P2 — Orphans.** `GET /auth/verify` (no BE route), `POST /auth/logout` (no BE route), `POST /projects/submit` (no FE caller — students cannot submit final projects; the admin evaluate pipeline has no input), `/api/challenges/*` (5 routes, no FE caller), `GET /forum/:postId` + forum deletes (no FE caller). **Fix direction:** wire or remove each; add a route-coverage test.
- **P3 — Vestigial `userId` in quiz submit.** `useQuiz.ts:34-40` sends it; server ignores it (`quiz.ts:49` derives from JWT). **Fix direction:** drop from schema + payload.
- **P3 — Stale copy/constants:** "all 4 weeks" (`frontend/src/pages/Certificate.tsx:34` — but Certificate is HARD NO-TOUCH, so this is documentation-only), "100% OFF Unlocked" (`AdminDashboard.tsx:1478` vs the 50% cap), `weekCompleted // 0 to 4` comment (`schema.prisma:59`), `paymentService.ts:127` "or VERIFIED if free" comment.

### 3.8 Services layer & transactions

- **P1 — Per-request DB storm in auth middleware.** `authenticateToken` calls `getUserById` on EVERY authenticated request (`middleware/auth.ts:20`), which runs `user.findUnique` **including `progresses` + `results`**, a possible referral backfill `UPDATE`, and `getReferralStats` (`user.findMany` + payments include) (`authService.ts:192-219, 26-40`) — 2-4 queries (plus a write on some) per request, inflating every protected response. **Fix direction:** attach only `id`/`role` from the JWT; materialize the full user lazily or cache in Redis with invalidation on profile/points/payment changes.
- **P1 — Non-transactional write groups.** `submitQuiz` runs 10+ queries with no transaction (`quizService.ts:69-282`); assignment/project evaluate update status then award XP in separate queries (`assignment.ts:171-185`; `project.ts:161-175`) — a crash between leaves APPROVED-without-XP or progress drift. **Fix direction:** wrap each sequence in `prisma.$transaction`.
- **P2 — XP awards race (lost update).** quiz/challenge read `user.points`, add, and write back (`quizService.ts:88-111`; `challengeService.ts:132-138`) — concurrent submissions lose points. Assignment/project already use atomic `increment` (`assignment.ts:181-184`; `project.ts:171-174`) — the correct pattern. **Fix direction:** `points: { increment }`.
- **P2 — Long sequential chains.** `challengeService.completeChallenge` runs ~13 sequential awaits (`challengeService.ts:94-197`); `quizService.submitQuiz` similar. **Fix direction:** `Promise.all` where independent + pruned includes.
- **P2 — SQL challenges run user code in the parent process.** The SQL path executes the user's query via `node:sqlite DatabaseSync` in the Express process (`challengeRunnerService.ts:87-99, 189-190`), unlike every other language which runs in the sandboxed child. Bounded (in-memory DB), but it's the one place user code runs in-process. **Fix direction:** wrap in the sandbox child or document the bounded risk.
- **P3 — Raw Prisma in route handlers for 4 domains.** forum, assignment, project, contact are 100% inline (`forum.ts` `:19-26,83,135,187,240,277`; `assignment.ts` `:24-33,50-91,105-145,163-186,210-237,256-268`; `project.ts` `:24-34,49-82,96-135,153-175,195-224,243-255`; `contact.ts` `:19-26,41-48,59-63,71-81,90-106`), and practice mixes it (`practice.ts:20-23,56-131,183-198`). Duplicate local `isAdmin` in `assignment.ts:10-16` and `project.ts:10-16`. **Fix direction:** extract services, import the shared `isAdmin`.

### 3.9 Database

- **P2 — Course deletion fails once data exists.** `CourseProgress.course` (`schema.prisma:58`), `QuizResult.course` (`:79`), `Payment.course` (`:163`), `ProjectSubmission.course` (`:279`) have no `onDelete` → FK-restrict error on `courseService.deleteCourse` (`courseService.ts:126-128`). **Fix direction:** `onDelete: Cascade` (or SetNull where history must persist).
- **P2 — 5 models carry a `courseId` with no `Course` relation/FK.** `AssignmentSubmission`, `CertificateRecord`, `Discussion`, `ModuleProgress`, `TopicProgress` — no referential integrity; course deletion orphans their `courseId`. **Fix direction:** add relations/FKs (+ cascades).
- **P2 — Missing indexes.** `Discussion(courseId, createdAt)` (forum list), `AssignmentSubmission(status)` + `(courseId, weekNumber, status)` (admin queue + peer solutions), `ProjectSubmission(status)` + `(courseId, status, shareSolution)`, `QuizResult(userId, courseId, week, passed)` (XP once-guard), `PracticeAttempt(userId, category)` (previous-best). **Fix direction:** add per §15.
- **P2 — Derived values drift.** `CourseProgress.progress` is computed once at write time from `week/requiredWeeks` (`quizService.ts:202,209,270,277`) and never recomputed if the module count changes; `weekCompleted`/`completed` duplicate `ModuleProgress`/`TopicProgress` rows. **Fix direction:** recompute on read (or drop the stored derived columns).
- **P3 — Dead/misleading schema fields.** `User.progress` is never written anywhere (`schema.prisma:23`); `weekCompleted // 0 to 4` comment stale (20 modules now); `Payment.status` and submission `status` are free strings (no enum/CHECK); `price`/`amount` Int has no unit doc. **Fix direction:** drop/rename dead fields, fix comments, consider enums.

### 3.10 Dead code & config

- **P3 — Dead modules:** `src/lib/businessRules.ts` (imported nowhere; its values are hardcoded at `quizService.ts:67,202,270,278`, `assignment.ts:49`, `project.ts:49-57,183`, `practice.ts:95`, `paymentService.ts:78-101`, `courseService.ts:114`); `src/lib/curriculumData.ts` (1,664 lines, imported nowhere, already drifted from the reseeds). **Fix direction:** centralize the constants in `businessRules` and import it (or delete it); delete `curriculumData`.
- **P3 — Dead route surface:** `courseEnrollSchema` (`validation.ts:57-61`); `PAYMENT_WEBHOOK_SECRET`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` passed in compose but never read in `src/`; `FRONTEND_URL` used at `authService.ts:122` but missing from `.env.example`.
- **P3 — Docker:** single-stage image ships `typescript`/`ts-node`/`prisma` CLI to run `migrate deploy` at boot (`Dockerfile:8,12,16,30`) — larger surface + crashloop-on-DB-down; HEALTHCHECK hits `/` not `/health` (`Dockerfile:23` vs `index.ts:83`). **Fix direction:** multi-stage build; migrations as a one-shot job (or entrypoint retry); healthcheck → `/health` (add Redis to the check).

---

## 4. Action Items (master backlog)

Backlog key: **ID · Priority · Area · Action · Files · Deps · Risk.**

| ID | P | Area | Action | Files | Deps | Risk |
|---|---|---|---|---|---|---|
| BE-01 | **P0** | Grading | Fix quiz grader: require `answers.length` == module's real question count (or fixed sample); grade only questions bound to the claimed module/topic | `quizService.ts:29-49`, `validation.ts:63-73`, `src/routes/quiz.ts` | — | Med (grading logic) |
| BE-02 | **P0** | Grading | Bind quiz question fetch to claimed module/topic (`where: { id in, moduleId, topicId? }`); verify topic∈module | `quizService.ts:37-44, 114-282` | BE-01 | Med |
| BE-03 | **P0** | Auth | Never return reset token/URL in response; deliver by email; identical body for all emails; dev-only URL behind NODE_ENV | `authService.ts:108-126`, `routes/auth.ts:32-39`, `.env.example` (+SMTP vars) | — | Low-Med |
| BE-04 | P1 | Course rules | Derive Final Project gate from `module.count(courseId)`; remove hardcoded `< 20` | `routes/project.ts:49-57` | — | Low |
| BE-05 | P1 | Course rules | Derive Assignment gate from the course's real week/module model; remove `weekNum*5` | `routes/assignment.ts:49-57` | — | Low |
| BE-06 | P1 | Security | Fix rate limiter: `trust proxy` + first-untrusted-XFF key + Redis-backed store | `middleware/rateLimiter.ts`, `src/index.ts`, `lib/redis.ts` | — | Med |
| BE-07 | P1 | Auth | Invalidate JWTs on password change/reset; add `tokenVersion` or `jti` denylist in `authenticateToken`; implement or remove `POST /auth/logout` | `authService.ts:141-148,183`, `middleware/auth.ts`, `routes/auth.ts`, `frontend/src/context/AuthContext.tsx:67-76` | — | Med (auth) |
| BE-08 | P1 | Access control | Add enrollment/access middleware (VERIFIED payment) to module content + quiz + challenge endpoints; align FE lock | `course.ts:35`, `quiz.ts:13/30/49`, `challenge.ts`, `courseService.ts:23-66` | — | Med (product rule) |
| BE-09 | P1 | Contract | Single pricing source of truth: `GET /payments/checkout/:courseId`; PayPage renders server amount only; drop FE coupon map + `BASE_PRICE`; coupon map → DB table | `paymentService.ts:47-101`, `frontend/src/pages/PayPage.tsx:26,92-112,177-181`, `EnrollmentPanel.tsx:80`, `validation.ts:113` | — | Med (payment UI) |
| BE-10 | P1 | Payments | Write `transactionId` from submitted reference (or generate); surface P2002 as 409 → no reference replay | `paymentService.ts:131-158`, `schema.prisma:157` | — | Low |
| BE-11 | P1 | Contract | Admin-only quiz-questions endpoint including `correctAnswer`; point `AdminDashboard.tsx:535` at it | `quizService.ts:17-19`, `routes/quiz.ts`, `frontend/src/pages/AdminDashboard.tsx:535,1312` | — | Low |
| BE-12 | P1 | Auth | Implement or remove email verification (`GET /auth/verify` + `isVerified` enforcement) — resolve the orphan | `routes/auth.ts`, `validation.ts`, `frontend/src/pages/Verify.tsx:42-54`, `schema.prisma:26-27` | — | Low |
| BE-13 | P1 | Content | Implement or remove the final exam (`FinalExamQuestion` seeded but unserved) | `schema.prisma:302-313`, `reseed_*_full.ts` | — | Low |
| BE-14 | P1 | Security | Per-request DB storm: attach only `id`/`role` from JWT; lazy/cached full-user materialization with invalidation | `middleware/auth.ts:20`, `authService.ts:192-219` | — | Med (auth perf) |
| BE-15 | P1 | Transactions | Wrap quiz submit + assignment/project evaluate in `$transaction` | `quizService.ts:69-282`, `assignment.ts:171-185`, `project.ts:161-175` | BE-01/02 | Med |
| BE-16 | P2 | Security | Security headers (Helmet + tight CSP) given localStorage token | `src/index.ts` | — | Low |
| BE-17 | P2 | Auth | Hash reset tokens at rest (`sha256`); consume-on-use stays | `authService.ts:114-120,128-151` | BE-03 | Low |
| BE-18 | P2 | Validation | Zod schemas + length limits on contact/forum/assignment/project/admin-update bodies; drop `courseEnrollSchema` | `routes/contact.ts`, `forum.ts`, `assignment.ts`, `project.ts`, `auth.ts:92`, `middleware/validation.ts:57-61` | — | Low |
| BE-19 | P2 | Security | Contact: rate limit + email validation; paginate `GET /messages` | `routes/contact.ts:33-64` | — | Low |
| BE-20 | P2 | Security | Fix public verify limiter key (IP + route, not credential ID) | `rateLimiter.ts:22`, `certificate.ts:11` | BE-06 | Low |
| BE-21 | P2 | Security | Sanitize forum content server-side (or escape on read) | `routes/forum.ts:135-183` | — | Low |
| BE-22 | P2 | Security | Validate/sanitize assignment/project `fileUrl`/`fileName`; remove `/uploads/mock_` fiction | `assignment.ts:69-91`, `project.ts:59-82` | — | Low |
| BE-23 | P2 | Auth | `safeUserSelect` to stop leaking reset/verification tokens in `/auth/me` and admin-update | `authService.ts:192-219, 296-347`, `auth.ts:56-100` | — | Low |
| BE-24 | P2 | Errors | Centralize Prisma-error mapping (log full, generic response); unify envelope; all catches → `next(err)` | `middleware/errorHandler.ts:38-51`, `assignment.ts:32,121,143,242`, `project.ts:33,112,133,229`, `practice.ts:37` | — | Low |
| BE-25 | P2 | Payments | Enforce payment state machine on `/payments/verify` (INITIATED→PENDING only; explicit FAILED→PENDING retry) | `paymentService.ts:131-158` | — | Low |
| BE-26 | P2 | Payments | Make `create-order` idempotent (reuse/reject `INITIATED`; idempotency key) | `paymentService.ts:48-57,108-115` | — | Low |
| BE-27 | P2 | Contract | Normalize response envelopes to `{ data, meta }` (or a documented types module); update 9 consumers | `course.ts:12`, `auth.ts:68`, `payment.ts:10`, `certificate.ts:24`, `contact.ts:57` + FE consumers | — | Med (touches FE) |
| BE-28 | P2 | Contract | Remove dead `VERIFIED` PayPage branch + stale comments; drop `amount` from create-order schema/payload | `PayPage.tsx:168-198`, `validation.ts:113`, `paymentService.ts:127` | BE-09 | Low |
| BE-29 | P2 | Contract | Wire or remove `POST /projects/submit` (no FE caller today — projects tab is read-only) | `routes/project.ts:38-93`, `frontend/src/pages/CourseDetail.tsx` projects tab | — | Low |
| BE-30 | P2 | Progress | Stop setting `ModuleProgress.quizPassed` from challenge completion; distinct flag | `challengeService.ts:151-161` | — | Low |
| BE-31 | P2 | Performance | Atomic XP awards (`points: { increment }`) in quiz/challenge | `quizService.ts:88-111`, `challengeService.ts:132-138` | — | Low |
| BE-32 | P2 | Performance | `Promise.all` + prune includes in `completeChallenge`/`submitQuiz` chains | `challengeService.ts:94-197`, `quizService.ts:69-282` | BE-15 | Low |
| BE-33 | P2 | DB | Add `onDelete` to `CourseProgress`/`QuizResult`/`Payment`/`ProjectSubmission` course relations | `schema.prisma:58,79,163,279` (+migration) | — | Low-Med (migration) |
| BE-34 | P2 | DB | Add `Course` relations/FKs for the 5 orphan `courseId` models | `schema.prisma:247-263,234-245,182-194,286-344` (+migration) | — | Med (migration) |
| BE-35 | P2 | DB | Add indexes (discussion/assignment/project/quizresult/practice) per §15 | `schema.prisma` (+migration) | — | Low |
| BE-36 | P2 | DB | Recompute (or stop storing) `CourseProgress.progress`/`completed` derived values | `quizService.ts:202-278`, `schema.prisma:59-63` | — | Low |
| BE-37 | P2 | Security | Remove `?pay_debug=true` enrollment-panel backdoor (FE) + document that course-length "20" assumptions live in FE too | `frontend/src/pages/CourseDetail.tsx:1326,1241-1265` | — | Low |
| BE-38 | P2 | Services | Extract services for forum/assignment/project/contact + shared `isAdmin` import | `routes/{forum,assignment,project,contact}.ts`, `middleware/auth.ts:33` | — | Low-Med |
| BE-39 | P3 | Security | Standardize 401 vs 403; pin JWT `algorithms`/`issuer`/`audience`; NaN guards on path ids | `middleware/auth.ts:29`, `authService.ts:95,183`, `auth.ts:77,94` | — | Low |
| BE-40 | P3 | Security | Timing oracle (dummy bcrypt) + registration enumeration message | `authService.ts:56-59,164-171` | — | Low |
| BE-41 | P3 | Sandbox | Move SQL challenge execution into the sandboxed child (or document the bounded in-process risk) | `challengeRunnerService.ts:87-99,189-190` | — | Med |
| BE-42 | P3 | Cleanup | Delete dead modules (`curriculumData.ts`, `businessRules.ts` or centralize + import it); drop `courseEnrollSchema`; fix stale comments | `src/lib/*`, `validation.ts:57-61`, `schema.prisma:59`, `paymentService.ts:127` | — | Low |
| BE-43 | P3 | Cleanup | Dead env vars (`PAYMENT_WEBHOOK_SECRET`/`ADMIN_EMAIL`/`ADMIN_PASSWORD`) + add `FRONTEND_URL` | `docker-compose.prod.yml:16-18`, `.env.example` | — | Low |
| BE-44 | P3 | Ops | Multi-stage Dockerfile; migrations as one-shot job/retry; HEALTHCHECK → `/health` (+Redis) | `Dockerfile`, `docker-compose.prod.yml` | — | Low-Med |
| BE-45 | P3 | Contract | Remove vestigial `userId` from quiz submit schema/payload; FE fallback copy | `validation.ts:63-73`, `useQuiz.ts:34-40`, `Home.tsx:637` | — | Low |
| BE-46 | P3 | Governance | Admin audit log for payment verify/fail/delete + certificate verify/unverify | `paymentService.ts:161-214`, `certificateService.ts:367-383` | — | Low |
| BE-47 | P3 | Governance | Regression tests: no-auto-verify invariant; PENDING-vs-VERIFIED PII split; quiz denominator/identity; gate rules for 5-module courses | `paymentService`, `certificateService`, `quizService`, `project.ts`, `assignment.ts` | BE-01,04,05,10,25 | Low |

---

## 5. P0/P1/P2/P3 Priority Matrix

| Priority | Action IDs | Impact | Count |
|---|---|---|---|
| **P0 — must fix before modernization** | BE-01, BE-02 (quiz grading integrity), BE-03 (reset-token takeover) | Exploitable: data corruption of all progress/certificates; live 2-request account takeover | 3 |
| **P1 — important** | BE-04, BE-05 (CADDED gates locked), BE-06 (rate limiter), BE-07 (JWT revocation), BE-08 (enrollment gate), BE-09 (pricing single source), BE-10 (UPI replay), BE-11 (admin quiz CMS), BE-12 (email verify orphan), BE-13 (final exam), BE-14 (auth DB storm), BE-15 (transactions) | Functional blockers for paying CADDED students; money-loss replay gap; site-wide lockout risk; paywall bypass; divergence bugs | 12 |
| **P2 — should improve** | BE-16..BE-38 (headers, token hashing, zod coverage, contact, limiter key, XSS, fileUrl, token exposure, error shape, payment state machine/idempotency, envelope normalization, dead branches, project-submit wiring, progress flags, atomic XP, query parallelism, DB onDelete/FKs/indexes/derived, pay_debug, service extraction) | Security depth, correctness, contract discipline, DB hygiene | 23 |
| **P3 — optional** | BE-39..BE-47 (401/403, JWT metadata, NaN guards, timing oracle, sandbox SQL, dead code, dead env, Docker, vestigial fields, audit log, tests) | Cleanup, ops, governance | 9 |

---

## 6. Dependency-Ordered Implementation Plan

Phases are ordered by dependency; each is independently shippable and deployable.

**PHASE A — Stabilization (P0 + grading/rules).** *Nothing downstream is trustworthy until progress is.* BE-01 → BE-02 (grading integrity; BE-02 depends on BE-01's model binding) → BE-04 → BE-05 (gate rules; unblocks CADDED) → BE-15 (transactions around the now-correct grader) → BE-13 (final-exam decision, depends on same grading rules).
**PHASE B — Security: credentials & identity.** BE-03 (reset token; highest-urgency live exploit) → BE-17 (hash at rest, same flow) → BE-07 (JWT revocation + logout resolution) → BE-12 (email-verify orphan) → BE-23 (token field exposure).
**PHASE C — Security: platform hardening.** BE-06 (rate limiter; foundation for BE-20) → BE-20 (verify key) → BE-16 (headers) → BE-18 (zod coverage) → BE-19 (contact) → BE-22 (fileUrl) → BE-21 (XSS) → BE-24 (error shape) → BE-39, BE-40 (401/403, oracles).
**PHASE D — Access control & business-logic centralization.** BE-08 (enrollment gate — requires the product decision) → BE-30 (progress flags) → BE-31 (atomic XP) → BE-38 (service extraction) → centralize business constants (fold into BE-42 or BE-30/31 scope).
**PHASE E — Payment correctness.** BE-10 (reference replay) → BE-25 (state machine) → BE-26 (idempotency) → BE-09 (pricing single source; also drives BE-28).
**PHASE F — API contract normalization.** BE-11 (admin CMS) → BE-28 (dead branch + amount field) → BE-27 (envelopes — the only cross-FE step) → BE-29 (project submit wiring) → BE-45 (vestigial fields, FE fallback copy).
**PHASE G — Database improvements.** BE-33 (onDelete) → BE-34 (FKs) → BE-35 (indexes) → BE-36 (derived values). Migrations are low-risk additive (no data rewrite).
**PHASE H — Performance & ops.** BE-14 (auth DB storm) → BE-32 (query parallelism) → BE-44 (Docker/healthcheck) → BE-43 (env hygiene).
**PHASE I — Cleanup & governance.** BE-37 (pay_debug) → BE-42 (dead modules) → BE-46 (audit log) → BE-47 (regression tests) — tests ideally land with each phase above (BE-47 is the consolidation).

**Critical dependency note:** the quiz-grading fix (A) must precede certificate/assignment/project gate changes because all gates consume `ModuleProgress`/`TopicProgress`/`CourseProgress`; the rate-limiter fix (C) must precede the verify-key fix (C); the pricing fix (E) must precede the envelope normalization touching PayPage (F).

---

## 7. Backend Next-Version Roadmap

Stay on Express 5 + Prisma 6 + PostgreSQL + Redis. No framework change. Target shape after the phases:

```
CURRENT (today)
  inline-Prisma handlers in forum/assignment/project/contact + practice mix
  76 endpoints · 3 error shapes · 2 envelope conventions · dead businessRules/curriculumData
  per-request DB storm in auth middleware · in-memory rate limiter
  hardcoded 20-module gates · quiz grader trusts client subset · reset token in body
  Payment.transactionId unused · 8 unpaginated admin lists · no enrollment gate on content

        ↓  A–B   integrity + security of identity
  quiz grading bound to real module set · reset token emailed+hashed · JWT revocation
        ↓  C–D   platform hardening + rules
  Redis rate limiter behind trust-proxy · zod everywhere · headers · enrollment middleware ·
  centralized businessRules (pass %, XP, price, module counts)
        ↓  E–F   payment + contract
  server-only pricing (quote endpoint, DB coupon table) · state machine + idempotency enforced ·
  single response envelope + shared types · admin CMS gets correctAnswer · projects wire-up
        ↓  G–H   data + perf
  FKs/onDelete/indexes · derived progress recomputed · lean auth (JWT-only) · multi-stage Docker
        ↓  I     cleanup
  dead code/routes/env pruned · audit log · regression suite

EduNexus Pro Next
```

Rules at every phase: **no endpoint path/method changed without the paired FE update · Certificate backend gating untouched (only documented) · each phase deployable independently · migrations additive.**

---

## 8. First Implementation Task

**FIRST TASK: BE-03 — Close the password-reset account-takeover.**

- **WHY THIS FIRST:** It is the only **live, actively-exploitable** vulnerability in the audit: an unauthenticated attacker who knows (or enumerates) an email can take over the account in **two requests** (`POST /auth/forgot-password` → receive the reset token in the body → `POST /auth/reset-password`). It outranks the quiz-grading exploits (BE-01/02) on urgency because it requires no authenticated session and affects every account type including admins. It is also the smallest, most self-contained fix — one service function + one route + env/email plumbing — with zero dependencies on other phases, so it can ship immediately and independently.
- **FILES:**
  - `backend/src/services/authService.ts:108-126` — `forgotPassword`: stop returning the token/URL; generate the token, store a hash (see BE-17), and hand the raw token to an email sender.
  - `backend/src/routes/auth.ts:32-39` — `forgot-password` handler: return an **identical** success body for existing and non-existing emails (kills the enumeration oracle).
  - `backend/.env.example` — add `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`/`FROM_EMAIL` (the existing `/home/abhi/certificate-emailer` Gmail-SMTP pattern is the reference); add `FRONTEND_URL` (already consumed at `authService.ts:122` but undocumented).
  - Dev fallback: gate the response-body reset URL behind `NODE_ENV === 'development'` so local flows still work without a mailer.
- **DEPENDENCIES:** none — no other phase blocks it. (BE-17 token-hashing follows naturally in the same PR but is optional for the immediate fix.)
- **EXPECTED RESULT:** `POST /auth/forgot-password` returns `{ success: true }` for every email; the reset link goes only to the owner's inbox; a DB read exposes only a `sha256` digest; an attacker cannot mint or guess a reset token from the API.
- **VALIDATION:**
  - [ ] For an existing and a non-existing email, the response bodies are byte-identical; no `resetUrl`/token in any body.
  - [ ] An emailed reset link still completes a password reset in dev (SMTP logging to a local mailbox or `NODE_ENV=development` URL fallback).
  - [ ] After reset, `resetToken`/`resetTokenExpires` are cleared (`authService.ts:145-146` preserved).
  - [ ] `User.resetToken` in the DB is a hash, not the raw token.
  - [ ] Pre-existing JWTs survive (no auth-contract change); `GET /auth/me` unchanged.

**Backlog #2:** BE-01+BE-02 — quiz grading integrity (same grading transaction, highest platform impact).

---

## 9. Do-Not-Touch List

| # | Area | Rule |
|---|---|---|
| 1 | **Certificate backend gating** | `certificateService.generateCertificate` (completion + VERIFIED payment, 402 `paymentRequired`), admin-verify skip path, PENDING→VERIFIED PII split, `setCredentialVerification`, legacy-ID parsing — **the audit found no defect; do not modify**. The FE Certificate page is already HARD NO-TOUCH. |
| 2 | **Payment no-auto-verify invariant** | `status: INITIATED → PENDING → VERIFIED/FAILED` with **only** `adminVerifyPayment` writing `VERIFIED` (`paymentService.ts:161-178`). No fix may reintroduce any path where a non-admin order reaches `VERIFIED`. |
| 3 | **Discount caps + amount clamp** | Referral ≤ 50%, coupon ≤ 50%, `finalAmount ≥ 0` (`paymentService.ts:78,94,101`). The client `amount` is ignored by design. |
| 4 | **JWT in Authorization header / localStorage contract** | `login(token, user)` shape, `expiresIn: '1d'`, `Bearer` parsing, `withCredentials` + CORS allowlist — no auth-contract change; token-in-cookie migration is a deliberate later decision (BE-16 scope). |
| 5 | **Route paths, methods, and response fields consumed by the FE** | Any endpoint shape change (BE-27) ships only paired with its FE consumer update; no path/method renames without a paired change. |
| 6 | **`isVerified` semantics** | Until BE-12 decides, registration must not start requiring verification (would lock users out of a working app). |
| 7 | **Sandbox/challenge isolation posture** | No change that widens code-execution scope; SQL-in-parent-process fix (BE-41) must keep the in-memory DB bound. |
| 8 | **Prisma schema** | No schema edit in this phase; all DB items (BE-33..36) are additive migrations in PHASE G only. |
| 9 | **Production data & reseeds** | No reseeds, no backfills, no DB writes; `TransactionId`/`status` values already in the DB must remain interpretable (BE-10/BE-25 must handle legacy `SUCCESS`/`PENDING_VERIFICATION` strings). |
| 10 | **Email-verification + reset token fields** | `resetToken`/`resetTokenExpires`/`verificationToken` columns keep their names; only their handling changes. |
| 11 | **`errorHandler` dev stack + status codes** | BE-24 must keep `NODE_ENV=development` stack exposure out of production and preserve the `{status,statusCode,message}` surface the FE already reads. |
| 12 | **Rate-limit budgets** | BE-06/BE-20 must not loosen the existing per-route budgets (5/300s register etc.) — only correct the keying/store. |

---

*Next phase (per the standing STOP instruction): none — this is a pure audit. No implementation was started; the backlog in §4 is ready to feed a Phase 5 execution prompt.*

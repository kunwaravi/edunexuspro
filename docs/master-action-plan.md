# EDU NEXUS PRO — MASTER ACTION PLAN (PHASE 5)

**Analysis only — no code, no files, no packages, no DB, no APIs changed.** Sources merged: Phase 1 architecture baseline · Phase 2 UI/UX audit (RB-01…RB-21, Top-20, V2 priority) · Phase 3 frontend deep-dive (Steps 1–28, P0-x/P1-x/P2-x/P3-x) · Phase 4 backend audit (BE-01…BE-47). Evidence labels: ✅ CONFIRMED (code/file:line) · 🔶 INFERRED · ⚪ UNKNOWN.

---

## 1. Executive Summary

EduNexus Pro is a functional, monetized product with a **solid hardened core** (no-auto-verify payment machine, admin-only VERIFIED, 50% discount caps, IDOR-scoped verify, unguessable credential IDs, PII-suppressed public verify, atomic streak claim, additive-migration deploy discipline) and **drifting edges** in three layers.

The consolidated plan collapses the three phase reports (~96 original actions) into **one register of 59 master actions (M-001…M-059)** after removing duplicates and merging every FE/BE pair that shares one underlying problem. Priorities were **re-evaluated across the whole project**, not copied: the two live exploit/corruption vectors (password-reset takeover, forgeable quiz grading) plus one hard user-flow break (blank quiz page) are the only P0s. CADDED-course gate bugs, payment reference replay, pricing duplication, and the admin CMS blank-answer bug are the critical P1s that determine revenue correctness.

The roadmap is deliberately **two-track**: backend stabilization and frontend foundation run in **parallel** (they share no files), then merge at the API-contract layer (Phase D), then the design system → page refactors → responsive/a11y → performance → cleanup. **No framework rewrite, no new state library, no giant refactor** — each action is one task, limited files, independently shippable and testable. The first implementation task is the **password-reset account-takeover fix (M-001)**; the second is the **Tailwind shade-token registration (M-034)** — both independent and Wave-1.

**Readiness verdict:** implementation-ready, but **not yet UI-modernization-ready** — P0/P1 security+correctness and the API-contract layer must land first (Section 18).

---

## 2. Phase 2 + Phase 3 + Phase 4 Consolidation

### 2.1 What was merged, from where

| Source | Original units | Count | What became |
|---|---|---|---|
| Phase 2 (UI/UX) | RB-01…RB-21 + Top-20 problems + V2 P0–P3 priority (24 items) | ~45 | Folded into frontend M-034…M-058 and responsive/a11y columns; RB items map to specific master actions below |
| Phase 3 (Frontend) | Steps 1–28 + P0-1…P0-5, P1-1…P1-10, P2-1…P2-10, P3-1…P3-4 | 28+24 | Folded into M-034…M-058; retained as the step-level sequencing inside FE phases |
| Phase 4 (Backend) | BE-01…BE-47 | 47 | Merged into M-001…M-033 (BE-leaning) — 14 merges below |
| Phase 1 (Baseline) | structural risks #1–24 | 24 | Feeding M-032 (schema drift), M-059 (tests/CI), M-033 (gateway), M-030 (Docker) |

**Count after consolidation:** 96 original action units → **59 master actions** (−39%). Every original ID is preserved in the **Sources** column of the register so nothing is lost.

### 2.2 The 14 key merges (see Section 4 for the full table)

1. **Pricing single source** = Phase 4 BE-09+BE-28 + Phase 3 Step-16/P1-9 + Phase 2 #12 + Phase 1 risk #7 → **M-018** (coordinated).
2. **Quiz grading integrity** = Phase 4 BE-01+BE-02 (same root cause: client-chosen denominator + unbound questions) → **M-002**.
3. **Reset-token fix** = Phase 4 BE-03+BE-17 (exposure + plaintext-at-rest, one flow) → **M-001**.
4. **Course-length rules** = Phase 4 BE-04+BE-05 (both hardcode the 20-module track) → **M-003**.
5. **Rate limiting** = Phase 4 BE-06+BE-20 (same subsystem; verify-key fix depends on store fix) → **M-004**.
6. **Auth contract stabilization** = Phase 4 BE-39 (401/403) + Phase 3 Step-6/P1-1 (FE 401 interceptor) → **M-007** (coordinated).
7. **Write-group discipline** = Phase 4 BE-15+BE-31+BE-32 (transactions + atomic XP + parallelism — one DB-write hygiene concern) → **M-020**.
8. **Error + envelope normalization** = Phase 4 BE-24+BE-27 (three error shapes + three envelopes = one contract problem) → **M-024** (coordinated).
9. **Validation + contact hardening** = Phase 4 BE-18+BE-19 → **M-010**.
10. **Additive migration** = Phase 4 BE-33+BE-34+BE-35 (onDelete + FKs + indexes in one additive migration) → **M-027**.
11. **Backend cleanup** = Phase 4 BE-42+BE-43+BE-45 (dead modules, dead env, vestigial userId) → **M-029** (coordinated for the userId part).
12. **Theme rebuild** = Phase 3 Step-2 (FOUC) + Step-26 (token rollout) + Phase 2 #6/#14 (light theme, typography) → **M-035**.
13. **Admin tables** = Phase 4 (admin lists unpaginated) + Phase 2 RB-01/RB-14/RB-15 + Phase 3 Step-20/P1-7 → **M-050**.
14. **Quiz page** = Phase 3 Step-14/P0-3 + Phase 2 RB-19 + Phase 2 #2 → **M-045** (the CRITICAL blank page).

### 2.3 Conflicts detected and resolved

| Conflict | Resolution |
|---|---|
| Phase 3 first task = register shades (M-034); Phase 4 first task = reset-token (M-001) | Both are correct for different reasons. **M-001 first** (live exploit, self-contained backend); **M-034 second** (independent, low-risk, unblocks FE visual verification). Both in Wave 1, parallel. |
| Phase 3 Step-6 (FE 401 interceptor) assumes BE returns 401; Phase 4 BE-39 says BE returns **403** for invalid/expired tokens | Must be **coordinated**: BE 401 first (M-007), then FE interceptor (M-007 FE half) — otherwise the interceptor never fires. |
| Phase 3 Step-16 removes FE coupon math "frontend only, no backend change" | Contradicted by Phase 4 BE-09 (backend quote endpoint needed so FE *can* display a single value). Resolved as **M-018 coordinated**: BE adds `GET /payments/checkout/:courseId`, FE consumes it and drops its own math. |
| Phase 2 wants Quiz/PayPage breakpoints; Phase 4 wants `trust proxy` — different layers | Independent; placed on parallel tracks (FE responsive vs BE security). |
| Phase 1 flags schema/migration drift; memory notes share_solution + cert-verification migrations already landed | M-032 scoped to the *remaining* drift (enum→String reconciliation, `User.progress` dead field, any still-unmigrated tables) — not a re-audit. |
| `GET /certificate/:courseId` is a side-effecting GET (Phase 4 BE-side) vs Certificate page NO-TOUCH | The **page** stays NO-TOUCH; the **backend route** fix (POST vs GET) is a coordinated API-contract change → **M-024** scope note; flagged separately as requiring explicit approval. |

---

## 3. Confirmed Problems (consolidated)

Labels: ✅ CONFIRMED (seen in code) · 🔶 INFERRED · ⚪ UNKNOWN.

### 3.1 Security (backend) — live risk
| # | Problem | Evidence | Label |
|---|---|---|---|
| S1 | Reset token + URL returned in `forgot-password` response body → 2-request account takeover + email enumeration | `backend/src/services/authService.ts:108-126`, `routes/auth.ts:32-39` | ✅ CONFIRMED |
| S2 | Reset tokens stored plaintext at rest | `authService.ts:114-120` | ✅ CONFIRMED |
| S3 | Rate limiter in-memory + `trust proxy` never set → one global bucket per path behind nginx (site-wide lockout) | `middleware/rateLimiter.ts:4,18`; `index.ts` | ✅ CONFIRMED |
| S4 | No security headers / no CSP (JWT lives in localStorage → CSP is the key XSS mitigation) | `index.ts`; `nginx/edunexus.conf` CSP commented | ✅ CONFIRMED |
| S5 | Invalid/expired JWT returns 403, not 401 (breaks RFC 6750 and the planned FE interceptor) | `middleware/auth.ts:29` | ✅ CONFIRMED |
| S6 | Tokens survive password change; `POST /auth/logout` has no backend route | `authService.ts:141-148`; `routes/auth.ts` | ✅ CONFIRMED |
| S7 | No zod on forum/assignment/project/admin-update/contact-settings bodies; `POST /contact` public + unrate-limited | `routes/contact.ts:33-54`; `middleware/validation.ts` | ✅ CONFIRMED |
| S8 | Forum content stored/returned raw (no sanitization anywhere in `src/`) → stored XSS if FE renders it | grep `src/` for sanitize = empty | ✅ CONFIRMED |
| S9 | `fileUrl`/`fileName` unvalidated; `/uploads/mock_*` fabricated; peer solutions serve arbitrary URLs | `routes/assignment.ts:69-91`, `project.ts:59-82` | ✅ CONFIRMED |
| S10 | `?pay_debug=true` enrollment-panel backdoor | `frontend/src/pages/CourseDetail.tsx:1326` | ✅ CONFIRMED |
| S11 | Login timing oracle + register enumeration message | `authService.ts:56-59,164-171` | ✅ CONFIRMED |
| S12 | `/auth/me` and admin-update leak caller's own reset/verification tokens | `authService.ts:192-219,296-347` | ✅ CONFIRMED |
| S13 | SQL challenges run user code in the parent process (`node:sqlite`) | `challengeRunnerService.ts:87-99,189-190` | 🔶 INFERRED (bounded, but in-process) |
| S14 | 401 interceptor missing on FE; `refreshUser` clears session on ANY error (transient logout) | `frontend/src/api/index.ts`; `AuthContext.tsx:18-37` | ✅ CONFIRMED |

### 3.2 Grading & learning integrity (backend)
| # | Problem | Evidence | Label |
|---|---|---|---|
| G1 | Quiz denominator = client-chosen question subset; one correct answer → 100%, passed | `quizService.ts:29-49,66-67` | ✅ CONFIRMED |
| G2 | Question fetch unbound to module/topic/course → any content can be marked complete | `quizService.ts:37-44,114-282` | ✅ CONFIRMED |
| G3 | Challenge completion writes `ModuleProgress.quizPassed=true` with no quiz | `challengeService.ts:151-161` | ✅ CONFIRMED |
| G4 | Final exam (`FinalExamQuestion`) seeded, never served | grep `src/` for `finalExam` = empty | ✅ CONFIRMED |
| G5 | CourseProgress derived values computed once, never recomputed; XP read-then-write lost-update | `quizService.ts:88-111,202-278` | ✅ CONFIRMED |
| G6 | CADDED (5-module) courses locked: project gate `<20`, assignment gate `weekNum*5` | `routes/project.ts:49-57`, `routes/assignment.ts:49-57` | ✅ CONFIRMED |
| G7 | `useQuiz` stale-question timer + blank flash; `useCourseDetail` refetch cascade + week-jump race | `frontend/src/hooks/useQuiz.ts:6,11,55`; `useCourseDetail.ts:40,53,68` | ✅ CONFIRMED |

### 3.3 Payments (backend)
| # | Problem | Evidence | Label |
|---|---|---|---|
| P1 | `Payment.transactionId @unique` never written → UPI reference replayable across orders | `schema.prisma:157`; `paymentService.ts:149-155` | ✅ CONFIRMED |
| P2 | `/payments/verify` has no state-machine guard (VERIFIED→PENDING self-revoke; FAILED revival) | `paymentService.ts:131-158` | ✅ CONFIRMED |
| P3 | `create-order` not idempotent (duplicate INITIATED rows on retry) | `paymentService.ts:48-57,108-115` | ✅ CONFIRMED |
| P4 | FE/BE price+coupon math duplicated; FE lacks the 50% cap; `amount` required-but-ignored | `PayPage.tsx:26,95-105` vs `paymentService.ts:82-101`; `validation.ts:113` | ✅ CONFIRMED |
| P5 | Dead `VERIFIED` branch + stale comments in PayPage (server always returns PENDING) | `PayPage.tsx:168-198`; `paymentService.ts:127` | ✅ CONFIRMED |
| P6 | Admin verify/fail/delete and cert verify/unverify unaudited | `paymentService.ts:161-214`; `certificateService.ts:367-383` | ✅ CONFIRMED |

### 3.4 Contract & data layer (coordinated)
| # | Problem | Evidence | Label |
|---|---|---|---|
| C1 | 3 error shapes + 3 response envelopes; ~20 FE consumers hardcode one shape each | `errorHandler.ts`; `course.ts:12`, `auth.ts:68`, `payment.ts:10`, `certificate.ts:24`, `contact.ts:57` | ✅ CONFIRMED |
| C2 | Admin quiz CMS renders blank `correctAnswer` (calls student endpoint which strips it) | `AdminDashboard.tsx:535,1312` vs `quizService.ts:17-19` | ✅ CONFIRMED |
| C3 | `/auth/verify`, `/auth/logout`, `POST /projects/submit`, `/api/challenges/*`, forum deletes — orphans | FE `Verify.tsx:47`, `AuthContext.tsx:69`, CourseDetail projects tab; BE routes | ✅ CONFIRMED |
| C4 | No uniform FE type layer (`src/types/` empty; pervasive `any`) | `frontend/src/types/` | ✅ CONFIRMED |
| C5 | 8 admin/list endpoints unpaginated; Referrals O(n²) | `paymentService.ts:5-20`; `AdminDashboard.tsx:2028` | ✅ CONFIRMED |
| C6 | Schema drift: 8 tables created via `db push` without migrations; native enum→String flattening; `User.progress` dead | Phase 1 §14 #1; `schema.prisma` | ✅ CONFIRMED |
| C7 | Missing onDelete (course delete 500s), 5 orphan `courseId` FKs, missing admin-queue indexes | `schema.prisma:58,79,163,279,234-344` | ✅ CONFIRMED |

### 3.5 Frontend design system, pages, a11y, perf (Phase 2+3 confirmed)
| # | Problem | Evidence | Label |
|---|---|---|---|
| F1 | ~96 uses of unregistered Tailwind shades (`slate-850/855/750/905/655/405`, `blue-450`, `rose-450`, `to-blue-750`) emit no CSS in dark mode | `frontend/src/index.css` `@theme`; 6 files | ✅ CONFIRMED |
| F2 | 12 semantic tokens dead; `.light !important` chain (250 lines) is the real light theme; 28 hardcoded hexes | `index.css:12-50,91-342` | ✅ CONFIRMED |
| F3 | Quiz blank page on empty question set; no cancel-confirm; no early submit | `Quiz.tsx:157` | ✅ CONFIRMED |
| F4 | PracticeArena: timer runs during coding mode; timeout+failure → infinite re-submit loop | `PracticeArena.tsx:151-165` | ✅ CONFIRMED |
| F5 | 9+ overlays lack dialog semantics/focus trap; 160 untyped buttons; one `htmlFor` app-wide; no h1 on 6 screens; toasts unannounced + FAB-occluded | Phase 2 §8; `UIContext.tsx:91-106` | ✅ CONFIRMED |
| F6 | 3 monoliths (AdminDashboard 2,649 / CourseDetail 1,588 / Home 1,383); 3rd course source of truth; mock leaderboard/analytics shown as real | Phase 2 §18; `Home.tsx:18,246,659`; `AdminDashboard.tsx:1813-1908` | ✅ CONFIRMED |
| F7 | Double/triple horizontal padding; admin tables no min-w; CMS accordion clipped; QR overflows ≤340px; 40px touch targets | Phase 2 §17 RB-01/02/04/11/18 | ✅ CONFIRMED |
| F8 | Light-mode contrast invisible text (Privacy `slate-355`, Contact `slate-250/indigo-450/405/emerald-450`) | `Privacy.tsx:41…`, `Contact.tsx:124-179` | ✅ CONFIRMED |
| F9 | Home + Login eager; 214KB logo unlazy; ~1.06MB dead images; no `prefers-reduced-motion`; no-op animation classes | Phase 3 §8 REAL items | ✅ CONFIRMED |
| F10 | ConfirmDialog re-entrancy hang; dead `busy`; 3 wrong-severity toasts | `UIContext.tsx:58-74`; `AdminDashboard.tsx:189,595,683` | ✅ CONFIRMED |

### 3.6 Infrastructure & governance
| # | Problem | Evidence | Label |
|---|---|---|---|
| I1 | Docker single-stage ships ts-node/prisma CLI; HEALTHCHECK hits `/` not `/health` | `Dockerfile` | ✅ CONFIRMED |
| I2 | No automated tests (stub `npm test`); CI test step commented out | Phase 1 §14 #3 | ✅ CONFIRMED |
| I3 | Auth middleware DB storm (2–4 queries + possible UPDATE per request) | `middleware/auth.ts:20`; `authService.ts:192-219` | ✅ CONFIRMED |
| I4 | Backend layering: forum/assignment/project/contact 100% inline Prisma; duplicated `isAdmin` | Phase 1 §7 | ✅ CONFIRMED |
| I5 | Dead code: `curriculumData.ts` (1664 lines), `businessRules.ts`, dead env vars, `RegisterPage`, `QuizResults`, `config/projects.ts`, unused assets | Phase 3 §2.9; Phase 4 §3.10 | ✅ CONFIRMED |

⚪ **UNKNOWN / not confirmed:** whether any student has exploited quiz-progress forgery or the reset-token vector in production (no audit trail exists); whether `trust proxy` misbehavior has actually caused a lockout event (🔶 deployment-dependent); intended product posture for email verification and final exams (product decisions needed, M-009/M-019).

---

## 4. Duplicate / Overlapping Actions Removed

| Merged into | Original actions absorbed | Why merged |
|---|---|---|
| M-001 | BE-03, BE-17 | Same password-reset flow (exposure + hashing) |
| M-002 | BE-01, BE-02 | Same root cause (client-trusted subset + unbound questions) |
| M-003 | BE-04, BE-05 | Same root cause (hardcoded 20-module track) |
| M-004 | BE-06, BE-20 | Same subsystem (rate limiter store + keying) |
| M-007 | BE-39, FE Step-6 / P1-1 | FE 401 interceptor depends on BE returning 401 |
| M-008 | BE-40, BE-23 | Auth API hygiene (oracle + token exposure) |
| M-010 | BE-18, BE-19 | Validation coverage + contact hardening (same body-bearing surface) |
| M-018 | BE-09, BE-28, FE Step-16/P1-9, Phase2 #12, Phase1 #7 | One pricing single-source-of-truth problem (BE quote endpoint + FE consumer) |
| M-020 | BE-15, BE-31, BE-32 | One DB-write discipline concern (transactions + atomic XP + parallel chains) |
| M-024 | BE-24, BE-27 | One response/error contract problem (3 shapes + 3 envelopes) |
| M-027 | BE-33, BE-34, BE-35 | One additive migration (onDelete + FKs + indexes) |
| M-029 | BE-42, BE-43, BE-45 | Dead code/env/vestigial field cleanup |
| M-035 | Step-2, Step-26, Phase2 #6, #14 | Theme system rebuild (FOUC + tokens + light theme + typography floor) |
| M-050 | Step-20/P1-7, RB-01/14/15, Phase2 #8 | Admin tables (min-w + search + pagination) |
| M-051 | RB-02, Phase2 #16, Step-20 CMS part | CMS accordion header + saving states |
| M-052 | Step-21/P2-6/P2-9, RB-10/20, Phase2 #11/#19, BE-29 | Home + static pages + Verify destinations + project-submit wiring (all public-screen/flow polish) |
| M-057 | P2-1, Phase2 #17, Step-27 assets part | Frontend dead-code sweep |

**Overlapping refactors avoided:** only one theme migration path (M-035) so no two actions fight over `index.css`; only one `Modal` primitive (M-042) so 9 overlays migrate once; only one `AdminTable` (M-044) feeding both admin list action and M-050; `useCourseDetail`/`useQuiz` changes confined to M-036/M-048 so the two hooks aren't touched by parallel FE page work.

---

## 5. Cross-Layer Dependencies (FE ⇄ BE)

Coordinated actions — each row is the full FE+BE chain. Everything else is BE-ONLY or FE-ONLY.

| # | Action | BACKEND CHANGE → | API CONTRACT → | FRONTEND CONSUMER → | VALIDATION | Type |
|---|---|---|---|---|---|---|
| M-007 | Auth 401 | Return 401 + `WWW-Authenticate` for invalid/expired token (was 403); pin HS256/issuer/aud | `{status:401}` on auth failure | Axios response interceptor dispatches `auth:unauthorized`; `refreshUser` clears only on 401 | Expired token → single redirect to login; network blip keeps session | **COORDINATED** |
| M-018 | Pricing SOOT | `GET /payments/checkout/:courseId` → `{basePrice, referralDiscount, couponDiscount, finalAmount, isFree}`; coupons → DB Setting table | new read-only endpoint | PayPage renders server values only; drop FE `BASE_PRICE`/coupon map/`amount` field; delete dead VERIFIED branch | UI price == server order amount == recorded `Payment.amount` | **COORDINATED** |
| M-025 | Admin CMS answers | Admin-only `GET /quiz/questions/admin/:courseId/:week` including `correctAnswer` | new admin endpoint; student endpoint keeps stripping | `AdminDashboard.tsx:535,1312` calls admin endpoint | CMS shows answers; student endpoint still strips | **COORDINATED** |
| M-024 | Envelope/error | One envelope `{data, meta}` + Prisma-error mapping; all catches → `next(err)` | shape change on ~10 endpoints | Shared FE types module (`src/types/`); update ~20 consumers | All consumers render post-change; no `.message` drift | **COORDINATED** |
| M-006 | JWT revocation | `tokenVersion` on User; bump on password change; implement or remove `POST /auth/logout` | `{tokenVersion}` semantics | FE `logout()` call resolved (real 204 or removed) | Old JWT fails after password change; logout path works | **COORDINATED** |
| M-009 | Email verify | Implement `GET /auth/verify` + `isVerified` enforcement (or remove both) | new route + user field | `Verify.tsx:47` token branch works (or page branch removed) | Verify link completes; enrolled users not locked out | **COORDINATED** |
| M-023 | Enrollment gate | `enrollmentGate` middleware (VERIFIED payment) on module content + quiz + challenges + submission routes | 403 on ungated | FE lock alignment + 403 handling (no paywall bypass) | Ungated user 403s; paid user passes; FE unlocks | **COORDINATED** |
| M-029 | Vestigial userId | Drop `userId` from `quizSubmissionSchema` | request payload change | `useQuiz.ts:34-40` stops sending it | Payload validation passes without `userId` | **COORDINATED** |
| M-053 | AuthForm | — (none) | — | LoginPage → shared `AuthForm`; Home inline form replaced | Three entry points behave identically | FE-ONLY |
| M-048 | Project submit wiring | `POST /projects/submit` route exists; gate fix in M-003 | route already live | CourseDetail projects tab + ProjectStatusCard get real submit call | Submission lands in admin review queue | **COORDINATED** |

**BE-ONLY (no FE consumer change required):** M-001, M-002, M-003(backend gate only), M-004, M-005, M-008, M-010, M-011, M-012, M-014, M-015, M-016, M-017, M-019, M-020, M-021, M-022, M-026, M-027, M-028, M-030, M-031, M-032, M-033.
**FE-ONLY (no BE change):** M-013, M-034, M-035, M-036, M-037, M-038, M-039, M-040, M-041, M-042, M-043, M-044, M-045, M-046, M-047, M-049, M-051, M-052, M-054, M-055, M-056, M-057, M-058.

---

## 6. Master Invariants

Preserve at all costs, across every phase:

| # | Invariant | Source | Grade |
|---|---|---|---|
| I-1 | **Certificate page (`frontend/src/pages/Certificate.tsx` + inline `<style>`) is HARD NO-TOUCH.** Not imported, not edited, not "fixed" in any phase. | User mandate + Phase 2/3 | **ABSOLUTE NO-TOUCH** |
| I-2 | **Payment must NEVER auto-transition to `VERIFIED`.** Only `adminVerifyPayment` writes VERIFIED. | Phase 4 do-not-touch #2 | **ABSOLUTE NO-TOUCH** |
| I-3 | **Admin verification is authoritative** for both payments and certificate credentials. | Phase 4 #1/#2 | **ABSOLUTE NO-TOUCH** |
| I-4 | **Discount caps stay server-enforced:** referral ≤50%, coupon ≤50%, `finalAmount ≥ 0`; client `amount` ignored. | Phase 4 #3 | **ABSOLUTE NO-TOUCH** |
| I-5 | **Existing payment status semantics remain valid** (`INITIATED/PENDING/VERIFIED/FAILED`, legacy `SUCCESS`/`PENDING_VERIFICATION` strings stay interpretable). | Phase 4 #9 | **ABSOLUTE NO-TOUCH** |
| I-6 | **Existing JWT/auth contract preserved** unless a dedicated action (M-006/M-007) explicitly changes it — `login(token,user)`, `Bearer` parsing, `expiresIn:'1d'`, localStorage keys `token`/`user`. | Phase 3 do-not-touch #4 | **SAFE ONLY WITH PAIRED FE/BE CHANGE** |
| I-7 | **Route paths, methods, and response fields consumed by the FE are preserved** unless the paired FE consumer ships in the same change (M-024 envelope is the one exception, done as one coordinated PR). | Phase 3 #2, #5 | **SAFE ONLY WITH PAIRED FE/BE CHANGE** |
| I-8 | **Existing production data preserved; no destructive DB rewrite.** Additive migrations only; no `--accept-data-loss`; reseeds never run against live user progress. | Phase 1 §16 #9 | **ABSOLUTE NO-TOUCH** |
| I-9 | **Sandbox isolation must not be weakened.** M-014 may only move SQL execution *into* the sandbox child, never widen host access. | Phase 4 #7 | **ABSOLUTE NO-TOUCH** |
| I-10 | **Existing working user flows keep behavior parity:** enroll→pay→verify→certificate, quiz→progress, practice→leaderboard, admin flows. | Phase 3 #7 | **ABSOLUTE** |
| I-11 | **`isVerified` semantics:** until M-009 decides, registration must not begin *requiring* verification (would lock out a working app). | Phase 4 #6 | **CHANGE ONLY AFTER EXPLICIT APPROVAL** |
| I-12 | **`.light` override chain is kept** until the last `.light`-reliant page migrates (M-035 removes it only at the end). | Phase 3 #9 | **SAFE WITHIN M-035** |
| I-13 | **Backend certificate gating unchanged** (completion + VERIFIED 402 gate, PENDING→VERIFIED PII split, legacy-ID parsing). No defect found; do not modify. The only allowed backend-cert change is an explicit audit-log addition (M-031). | Phase 4 #1 | **ABSOLUTE NO-TOUCH** |
| I-14 | **`errorHandler` dev stack + `{status,statusCode,message}` surface** preserved during M-024 (production must stay safe). | Phase 4 #11 | **SAFE WITHIN M-024** |
| I-15 | **Rate-limit budgets never loosened** — M-004 only corrects keying/store. | Phase 4 #12 | **SAFE WITHIN M-004** |
| I-16 | **Certificates' `verificationCode`/`verificationStatus` column names unchanged**; only handling changes. | Phase 4 #10 | **ABSOLUTE NO-TOUCH** |
| I-17 | **Deploy discipline preserved:** DB backup before deploy, `.env` never rsynced, migrations auto-apply, non-destructive. | Phase 1 §16 #9 | **ABSOLUTE** |
| I-18 | **No framework/state-library rewrite:** stay React 19 + Vite + Tailwind 4 + Context API + Express 5 + Prisma 6 + PostgreSQL. | Phase 3 §11 | **ABSOLUTE** |

**New invariants added by this consolidation (beyond the four phase reports):** I-11 (isVerified gate), I-15 (rate budgets), I-18 (no rewrite), and the coordination rule that **every M marked COORDINATED must ship FE+BE in one change** (I-7 extension).

---

## 7. Priority Reassessment

Re-evaluated across the whole project (not copied from phase reports). **P0 = security/correctness that must be fixed before anything else; P1 = critical product/architectural.**

### P0 — 3 actions (exploitable or hard user-flow break)
| ID | Why it is P0 |
|---|---|
| **M-001** | Live 2-request **account takeover** affecting every account incl. admins; unauthenticated; no mitigation in place today. |
| **M-002** | Forged quiz scores **corrupt all downstream state** — progress, XP, badges, project/assignment gates, and ultimately certificate issuance; a student can pass any course. |
| **M-045** | **Blank page** on any empty/legacy question set — a hard dead end for students (sighted and SR); also the CRITICAL item in Phase 2. |

### P1 — 27 actions (critical product/architecture)
| ID | Why |
|---|---|
| **M-003** | Paying CADDED students are **permanently locked** out of assignments/projects (revenue + churn). |
| **M-015** | One real UPI payment can unlock **multiple courses/certificates** (replay) — money integrity. |
| **M-018** | FE/BE price divergence means students **pay a different amount than the UI shows**; FE lacks the 50% cap → displayed discount lies. |
| **M-025** | Admin CMS cannot see correct answers — course correctness admin blind spot. |
| **M-006, M-007** | No session revocation + no 401 handling = stolen/expired tokens silently break auth UX; M-007 is the precondition for all coordinated auth work. |
| **M-004, M-005** | Site-wide lockout risk (rate limiter) and no CSP with localStorage JWT = the platform's top two availability/security levers. |
| **M-009** | Orphan email-verify flow misleads users; product decision gates it. |
| **M-019** | Final exam is *advertised* (seeded questions) but **never served** — curriculum promise broken. |
| **M-020, M-022** | Non-transactional quiz/evaluate writes can desync XP/progress; per-request DB storm throttles every endpoint. |
| **M-023** | Premium content + question bank are **ungated** — the paywall is only cosmetic on the FE. |
| **M-034…M-044** | The frontend foundation: dark mode renders wrong (~96 sites), theme is a 250-line hack, no dialog/focus-trap/labels/type-safe buttons, double-padding, no shared table — every later page refactor depends on these. |
| **M-046…M-050** | The four highest-traffic student screens have correctness bugs (practice loop, dashboard dead button/silent errors, CourseDetail refetch cascade, admin stale/fake data). |

### P2 — 21 (important modernization) · P3 — 8 (polish/cleanup)
Full assignment in the register. Notable P2s: payment state machine + idempotency (M-016/M-017), XSS/fileUrl/zod (M-011/M-012/M-010), additive migration + schema drift (M-027/M-032), a11y hardening (M-055), tests+CI (M-059). Notable P3s: Docker (M-030), dead code (M-029/M-057), audit log (M-031), AdminDashboard split (M-058), gateway decision (M-033).

---

## 8. Dependency Graph

```
TIER 0  (parallel, no interdependencies)
  M-001 BE reset-token        M-034 FE shade tokens        M-004 BE rate limiter
  M-002 BE quiz integrity     M-036 FE useQuiz hook        M-005 BE headers
                              M-037/38 FE contexts         M-015 BE payment ref
                              M-045 FE quiz page *deps 036 M-003 BE gates

TIER 1  (needs Tier 0 correctness/visuals)
  M-007 auth 401 (coord) ──deps M-004? no─deps BE 401 change only
  M-006 JWT revocation (coord)
  M-016/17 payment state+idempotency ─deps M-015
  M-019 final exam ─deps M-002 (grading rules)
  M-020 write-group ─deps M-002
  M-022 auth DB storm ─deps M-007 (stable auth surface)
  M-035 theme rebuild ─deps M-034
  M-039/40/41/42/43/44 primitives ─deps M-034 (visual baseline)

TIER 2  (API CONTRACT — coordinated FE+BE; biggest single choke point)
  M-018 pricing SOOT      M-024 envelope/error      M-025 admin CMS answers
  M-009 email-verify      M-023 enrollment gate     M-029 vestigial userId

TIER 3  (frontend consumes normalized contract + primitives)
  M-046 practice   M-047 dashboard   M-048 CourseDetail   M-049 admin data
  M-050 admin tables   M-051 CMS   M-052 Home/static   M-053 AuthForm
  M-054 responsive/z   M-055 a11y

TIER 4  (polish, perf, governance)
  M-056 perf   M-057 dead code   M-058 split Admin   M-059 tests/CI
  M-010/11/12/13/14 validation+XSS+fileUrl+pay_debug   M-026 service extraction
  M-027/028/032 DB   M-030/031/033 ops/audit/gateway
```

**Blockers:** M-002 blocks M-019/M-020 and (indirectly) M-059 quiz tests. M-007 must precede any FE 401 work. M-018 blocks M-024's PayPage consumer. M-034 blocks the visual verification of every later FE step.
**Parallelizable:** everything on the same tier that doesn't share files (BE and FE never share files; FE primitives that touch different files can run in parallel).
**Safe to defer:** M-058 (AdminDashboard split) is last; M-033 (gateway) is strategic; M-056/M-057/M-030/M-031 are cleanups.

---

## 9. Master Implementation Phases

Each phase is independently shippable and deployable. **BE and FE tracks within a phase run in parallel where marked ∥.**

### PHASE A — Critical Stabilization (P0)
- **GOAL:** remove the live account-takeover, make grading unforgeable, unblock the dead quiz flow and the CADDED gates, close the payment-reference replay.
- **ACTIONS:** ∥ BE: M-001, M-002, M-003, M-015 · FE: M-034, M-036, M-037, M-038, M-045.
- **DEPENDENCIES:** M-045 → M-036 (hook first). M-002 → M-020 later. None cross-track.
- **RISK:** Low–Med. M-001 touches auth (keep response-shape for the FE), M-002 touches grading (must keep `passed` semantics), M-003 touches gates (CADDED is the target).
- **EXIT CRITERIA:** reset token never in any response body; a 1-answer quiz cannot pass; CADDED assignment/project submissions succeed; `transactionId` unique enforced; quiz page never blank; dark mode renders correctly; toasts announce.

### PHASE B — Security Hardening
- **GOAL:** close the platform-level security holes.
- **ACTIONS:** ∥ BE: M-004, M-005, M-010, M-011, M-012, M-014, M-008 · FE: M-013, M-039, M-040.
- **DEPENDENCIES:** M-004 self-contained (store+keying). M-007 arrives in Phase D (needs FE interceptor).
- **RISK:** Med — rate-limiter rework can lock people out if keying is wrong (rollback: revert to in-memory). Headers/CSP can break embeds (validate against QR/lightbox which use external images? — Certificate uses Google Fonts via `@import`; CSP must allow fonts.googleapis).
- **EXIT CRITERIA:** security regression checklist passes (below); no stored XSS in forum; fileUrl scheme-allowlisted; no `pay_debug` bypass; sandbox unchanged or documented.

### PHASE C — Backend Business Rules & Data Integrity
- **GOAL:** make every write-group atomic, payments lifecycle-correct, content promise complete, DB referentially sound.
- **ACTIONS:** ∥ BE: M-016, M-017, M-020, M-021, M-022, M-019, M-026, M-027, M-028, M-032 · FE: (none).
- **DEPENDENCIES:** M-016 → M-015; M-020/M-021 → M-002; M-019 → M-002; M-027/M-032 are additive migrations (no data rewrite).
- **RISK:** Med — migrations are the only risky part; each is additive + backed up first.
- **EXIT CRITERIA:** quiz submit is one transaction; XP is atomic; payment state machine rejects illegal transitions; `create-order` idempotent; final exam served or removed; migrations applied cleanly in staging.

### PHASE D — API Contract Normalization (coordinated — the choke point)
- **GOAL:** one contract layer so FE and BE can never drift again.
- **ACTIONS:** ∥ M-007, M-006, M-009, M-018, M-024, M-025, M-023, M-029 (coordinated FE+BE pairs each ship as one change).
- **DEPENDENCIES:** M-007 before M-006 (auth surface stable); M-018 before M-024's PayPage consumer; M-023 needs the product decision.
- **RISK:** **Highest** — touches auth, payments, certificates-adjacent, and every FE page's data shape. Mitigation: each coordinated pair ships as ONE PR with its FE consumer; contract tests (M-059) added here.
- **EXIT CRITERIA:** single envelope + shared types; FE consumes server pricing only; 401 handled globally; no orphan routes; enrollment gated server-side; admin CMS answers visible.

### PHASE E — Frontend Foundation & Design System
- **GOAL:** normalize primitives, layout, and theme so page refactors are mechanical.
- **ACTIONS:** ∥ M-041, M-042, M-043, M-044, M-046, M-035 (in order: primitives → overlays → layout → theme).
- **DEPENDENCIES:** M-044 → M-042 (Dialog uses Button/Input) and M-039; M-045 → M-043; M-035 → M-034 + last consumer of `.light`.
- **RISK:** Med — PageContainer (M-045) touches every page; Dialog migration can regress overlays. Mitigation: per-page screenshot parity.
- **EXIT CRITERIA:** 160 untyped buttons gone; labels bound via `useId`; all 9 overlays use `Dialog`; padding single-sourced; `.light` chain removed; `text-[11px]` → `text-xs` floor.

### PHASE F — Core Screen Refactors
- **GOAL:** move the heavy screens onto the primitives with zero flow change.
- **ACTIONS:** ∥ M-046 (Practice), M-047 (Dashboard), M-048 (CourseDetail), M-049 (Admin data), M-050 (Admin tables), M-051 (CMS), M-052 (Home/static/Verify), M-053 (AuthForm).
- **DEPENDENCIES:** all depend on Phase E primitives; M-048 also depends on M-024/M-018 contract (payment state, envelopes) and M-036 (hook).
- **RISK:** Med — CourseDetail and Home are state-heavy.
- **EXIT CRITERIA:** each screen refactored page-by-page with route/API/flow parity.

### PHASE G — Responsive + Accessibility + Performance
- **GOAL:** the mobile/accessibility/perf backlog.
- **ACTIONS:** ∥ M-054, M-055, M-056, M-057.
- **DEPENDENCIES:** M-054 → Phase E layout; M-055 → Phase E a11y primitives.
- **RISK:** Low.
- **EXIT CRITERIA:** 320–1440 sweep clean; axe/Lighthouse ≥ target; perf wins measured.

### PHASE H — Admin Decomposition, Ops & Governance
- **GOAL:** maintainability + safety rails.
- **ACTIONS:** ∥ M-058, M-030, M-031, M-059, M-062 (CI gates), M-033 (strategic decision).
- **DEPENDENCIES:** M-058 → Phase F admin work + primitives; M-059 → M-002/M-018/M-015 (tests target those invariants).
- **RISK:** Med (M-058 largest refactor; M-030 touches the Docker image used by live deploy).
- **EXIT CRITERIA:** `/admin` split into routed sub-screens; CI runs tests; invariant suite green.

### PHASE I — Strategic / Deferred (decision gates)
- **ACTIONS:** M-033 (payment gateway + webhook, or a formalized manual-verify + audit design). No code until the owner decides.
- **EXIT CRITERIA:** a written decision; if gateway: a separate scoped plan.

---

## 10. Master Action Register

Legend: **P** = priority (P0/P1/P2/P3) · **L** = layer (BE / FE / COORD / DB / OPS) · **Sources** = original IDs (BE-xx = Phase 4, Step-NN / Px-x = Phase 3, RB-xx / #xx = Phase 2) · Status = **PLANNED** (no implementation this phase).

| ID | P | Area | Action | L | Files (primary) | Sources | Deps | Risk | Validation | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| M-001 | P0 | Auth | Password reset: never return token/URL in body; email delivery (SMTP); identical body for all emails; hash token at rest; dev-only URL | BE | `authService.ts:108-151`, `routes/auth.ts:32-39`, `.env.example` | BE-03, BE-17 | — | Low–Med | Same body for existing/non-existing; emailed link works; `resetToken` is a hash; tokens cleared on use | PLANNED |
| M-002 | P0 | Quiz | Grader: require `answers.length` == module's real question count; bind fetch to `moduleId`/`topicId`; verify topic∈module | BE | `quizService.ts:29-49,37-44,114-282`, `validation.ts:63-73`, `routes/quiz.ts` | BE-01, BE-02 | — | Med | 1-answer submit fails; cross-course question IDs rejected; legit quiz passes | PLANNED |
| M-003 | P0 | Course rules | Derive gates from DB: project required count = `module.count(courseId)`; assignment week mapping from real modules | BE | `routes/project.ts:49-57`, `routes/assignment.ts:49-57` | BE-04, BE-05 | — | Low | CADDED week-2+ assignment submits; final project submits after 5 modules | PLANNED |
| M-045 | P0 | Quiz page | Empty-state (no `return null`), cancel-confirm, early submit, h1 | FE | `pages/Quiz.tsx:157,205`, `components/molecules/ExamResultsModal.tsx` | Step-14, P0-3, RB-19, #2 | M-036 | Low | Empty set renders friendly state; cancel asks; early submit posts | PLANNED |
| M-004 | P1 | Security | Rate limiter: `trust proxy`, first-untrusted-XFF key, Redis store; verify-credential key by IP+route | BE | `middleware/rateLimiter.ts`, `index.ts`, `lib/redis.ts` | BE-06, BE-20 | — | Med | No shared-lockout under load; brute-force throttled per IP; budgets unchanged | PLANNED |
| M-005 | P1 | Security | Helmet + CSP (allow Google Fonts for Certificate; no inline-script breakage) | BE | `src/index.ts`, `nginx/edunexus.conf` | BE-16 | — | Low | Headers present; QR/lightbox/fonts still load; no console CSP violations | PLANNED |
| M-006 | P1 | Auth | JWT revocation on password change/reset (`tokenVersion` or `jti` denylist); implement or remove logout | COORD | `authService.ts:141-148,183`, `middleware/auth.ts`, `routes/auth.ts`, `AuthContext.tsx:67-76` | BE-07 | M-007 | Med | Old token fails after password change; logout 204 or removed | PLANNED |
| M-007 | P1 | Auth | BE: 401 for invalid/expired token + `WWW-Authenticate`, pin HS256/issuer/audience · FE: 401 interceptor → logout; `refreshUser` clears only on 401 | COORD | `middleware/auth.ts:29`, `authService.ts:95,183`, `frontend/src/api/index.ts`, `AuthContext.tsx:18-37` | BE-39, Step-6, P1-1 | — | Med | Expired token → one redirect; network blip keeps session | PLANNED |
| M-008 | P1 | Auth | Timing oracle (dummy bcrypt) + enumeration-safe message + `safeUserSelect` (no token leakage in /auth/me) | BE | `authService.ts:56-59,164-171,192-219`, `routes/auth.ts:56-100` | BE-40, BE-23 | — | Low | Uniform timing; no reset/verification tokens in responses | PLANNED |
| M-009 | P1 | Auth | Email-verify orphan: implement `GET /auth/verify` + `isVerified` enforcement, or remove Verify email branch + dead fields (product decision) | COORD | `routes/auth.ts`, `validation.ts`, `Verify.tsx:47`, `schema.prisma:26-27` | BE-12 | — | Low | No dead link; no accidental verification lockdown (I-11) | PLANNED |
| M-015 | P1 | Payments | Write `transactionId` from submitted reference (or generated); P2002 → 409 | BE | `paymentService.ts:131-158`, `schema.prisma:157` | BE-10 | — | Low | Same UPI ref on 2nd order → 409; no multi-cert replay | PLANNED |
| M-016 | P1 | Payments | State machine on `/payments/verify`: INITIATED→PENDING only; explicit FAILED→PENDING retry; reject VERIFIED/SUCCESS | BE | `paymentService.ts:131-158` | BE-25 | M-015 | Low | Illegal transitions rejected; legacy strings still handled | PLANNED |
| M-017 | P1 | Payments | `create-order` idempotent (reuse/reject `INITIATED` for `(user,course)`; idempotency key) | BE | `paymentService.ts:48-57,108-115` | BE-26 | M-015 | Low | Double-click → one order | PLANNED |
| M-018 | P1 | Payments/Contract | Pricing single source: BE `GET /payments/checkout/:courseId` + coupons→DB; FE PayPage consumes only server values, drops `BASE_PRICE`/coupon map/`amount`/dead VERIFIED branch | COORD | `paymentService.ts:47-101`, `routes/payment.ts`, `PayPage.tsx:26,92-112,168-198`, `EnrollmentPanel.tsx:80`, `validation.ts:113` | BE-09, BE-28, Step-16, P1-9, #12, P1-7 | — | Med | UI price == order amount == recorded amount; coupon cap matches server | PLANNED |
| M-019 | P1 | Content | Final exam: implement serve+grade, or remove model+seed (product decision) | BE | `schema.prisma:302-313`, `reseed_*_full.ts` | BE-13 | M-002 | Low | Exam reachable and graded, or removed without residue | PLANNED |
| M-020 | P1 | Services | Write-group discipline: `$transaction` around quiz submit + evaluate flows; `points: { increment }`; parallelize independent awaits | BE | `quizService.ts:69-282`, `assignment.ts:171-185`, `project.ts:161-175`, `challengeService.ts:94-197` | BE-15, BE-31, BE-32 | M-002 | Med | Crash mid-submit leaves consistent state; no lost XP; latency down | PLANNED |
| M-022 | P1 | Auth/Perf | Auth middleware DB storm: attach only `id`/`role` from JWT; lazy/cached full-user with invalidation | BE | `middleware/auth.ts:20`, `authService.ts:192-219` | BE-14 | M-007 | Med | Protected-route DB queries drop to 0–1; role changes still take effect | PLANNED |
| M-023 | P1 | Access | `enrollmentGate` middleware (VERIFIED payment) on module content + quiz + challenges + submission routes; FE lock alignment + 403 handling | COORD | `course.ts:35`, `quiz.ts:13,30,49`, `challenge.ts`, `courseService.ts:23-66`, CourseDetail lock | BE-08 | M-018 (contract stable) | Med | Ungated user 403s; paid user passes; FE no paywall bypass | PLANNED |
| M-025 | P1 | Contract | Admin quiz-questions endpoint incl. `correctAnswer`; AdminDashboard consumes it | COORD | `quizService.ts:17-19`, `routes/quiz.ts`, `AdminDashboard.tsx:535,1312` | BE-11 | — | Low | CMS shows answers; student endpoint still strips | PLANNED |
| M-034 | P1 | Design sys | Register missing Tailwind shades in `@theme` (slate-850/855/750/905/655/405, blue-450, rose-450, to-blue-750) | FE | `frontend/src/index.css` | P0-1, Step-1, #1 | — | Very low | All 96 classes emit CSS; dark renders correct; light unchanged | PLANNED |
| M-035 | P1 | Design sys | Theme rebuild: token-driven light theme, pre-paint script (kill FOUC), type/radius/shadow/z tokens, retire `.light` after last consumer, typography floor | FE | `index.css`, `index.html`, `ThemeContext.tsx`, systematic class swaps | Step-2, Step-26, #6, #14 | M-034 | Med | No FOUC; light readable everywhere; `.light` chain removed; `text-[11px]` → 0 | PLANNED |
| M-036 | P1 | Hooks | `useQuiz`: `loading:true` init, `setData(null)` on refetch, split fetch/submit, abort on param change | FE | `hooks/useQuiz.ts` | P0-2, Step-3 | — | Low | No blank flash; no stale-timer; mid-submit UI stable | PLANNED |
| M-037 | P1 | Context | ConfirmDialog/UIContext: resolve-outside-updater, re-entrancy guard, implement/remove `busy`, `crypto.randomUUID`, memoize | FE | `context/UIContext.tsx`, `atoms/ConfirmDialog.tsx` | P0-4, Step-4 | — | Low–Med | Double-confirm resolves once; busy spinner; no hung promises | PLANNED |
| M-038 | P1 | Context | Toast system: `aria-live`, labeled dismiss, z above FAB, severity icons; fix 3 wrong-severity toasts | FE | `context/UIContext.tsx:91-106`, `AdminDashboard.tsx:189,595,683` | P0-5, Step-5, #5, #11 | M-037 | Low | Toasts visible+announced; wrong severities corrected | PLANNED |
| M-039 | P1 | Primitives | Button: default `type="button"`, `aria-busy`, forwardRef, dedupe `transition-all`; migrate inline button sites; button-in-anchor → Link-styled | FE | `atoms/Button.tsx` + ~30 sites | P1-2, Step-7, #6, #20 | M-034 | Low (verify submit intents) | Forms don't double-submit; `aria-busy` present | PLANNED |
| M-040 | P1 | Primitives | Input/FormField merge: `useId` label binding, `aria-invalid`/`aria-describedby`; migrate inline forms | FE | `atoms/Input.tsx`, delete `molecules/FormField.tsx`, Contact/PayPage/admin forms | P1-3, Step-8, #1 | — | Low | Clicking label focuses input app-wide | PLANNED |
| M-042 | P1 | Primitives | Dialog primitive (focus trap, scroll lock, Esc, size map, busy) + migrate 9 overlays | FE | `atoms/Dialog.tsx` (new), ConfirmDialog + 9 sites | P1-4, Step-10/11, #5, #7 | M-039, M-040 | Med | Every overlay traps focus/scrolls-locks/Esc; screenshot parity | PLANNED |
| M-043 | P1 | Layout | PageContainer: single padding/max-width source; kill double/triple padding + container-cap conflict | FE | `layout/PageContainer.tsx` (new), `App.tsx:49`, every page root | P1-5, Step-12, RB-11 | M-034, M-035 | Med | Padding identical at 375/1024/1440; `max-w-7xl` pages reach 7xl | PLANNED |
| M-044 | P1 | Primitives | Tabs/Select/Table primitives: ARIA tablist, labeled select, AdminTable with min-w + sortable-th + pagination slot | FE | `foundation/Tabs.tsx`, `Select.tsx`, `layout/ResponsiveTable.tsx` | P1-7, Step-13 | M-039, M-040 | Low–Med | Tabs keyboard-navigable; tables scroll correctly | PLANNED |
| M-046 | P1 | Practice | Timer state machine (pause in coding mode, single submit, no re-fire on failure), retry-on-empty, 44px targets | FE | `pages/PracticeArena.tsx:151-165,435`, `CodePlayground.tsx:133-171` | P1-8, Step-15, RB-05, RB-18, #3 | M-039 | Med | Coding mode never auto-submits; no toast storm | PLANNED |
| M-047 | P1 | Dashboard | Render `useCourses.error` + Refresh→refetch; wire/remove Submit-Now; daily skeleton; stat truncation | FE | `pages/Dashboard.tsx:67,321-424`, `ProjectStatusCard.tsx:67` | P2-7, Step-17, RB-12, RB-13, #18 | M-043, M-044 | Low–Med | Failed `/courses` shows error; no layout jump; no dead button | PLANNED |
| M-048 | P1 | CourseDetail | Hook fixes (drop `currentWeek` dep, abort/ordering, error state, single payment source); view-state restore; h1; markdown overflow; surface module-quiz CTA; **wire `POST /projects/submit` (BE-29)** | FE | `pages/CourseDetail.tsx`, `hooks/useCourseDetail.ts:40-68,209`, projects tab | P1-10, P2-8, Step-18, RB-07/08/09, #10, BE-29 | M-036, M-042, M-043 | Med | No week-jump; last view restored; project submissions reach admin queue | PLANNED |
| M-049 | P1 | Admin | Per-tab lazy fetch + refetch-on-switch; real Analytics or remove tab | FE | `pages/AdminDashboard.tsx:510-521,1813-1908` | P1-6, Step-19, #9 | M-038 | Med | Opening tab refetches; no pre-fetch of unopened tabs; no fake numbers | PLANNED |
| M-050 | P1 | Admin | Tables: min-w strategy, search (users/payments/messages), pagination | FE | `AdminDashboard.tsx:1364,1686,1989,2098`, `AdminPaymentTable.tsx` | P1-7, Step-20, RB-01, RB-14, RB-15, #8 | M-044 | Med | Tables readable at 375 with scroll; search works; pages | PLANNED |
| M-010 | P2 | Validation | Zod schemas + length bounds on forum/assignment/project/admin-update/contact-settings; drop `courseEnrollSchema`; contact rate limit + email format + paginate messages | BE | `routes/contact.ts`, `forum.ts`, `assignment.ts`, `project.ts`, `auth.ts:92`, `validation.ts:57-61` | BE-18, BE-19 | — | Low | Malformed bodies 400; contact rate-limited; messages paginated | PLANNED |
| M-011 | P2 | Security | Server-side sanitization of forum content (or escape on read) | BE | `routes/forum.ts:135-183` | BE-21 | — | Low | `<script>`/markdown-injection stored inert | PLANNED |
| M-012 | P2 | Security | Validate/sanitize `fileUrl`/`fileName` (scheme allowlist, length cap); remove `/uploads/mock_` fiction or add real upload | BE | `routes/assignment.ts:69-91`, `project.ts:59-82` | BE-22 | — | Low | Only http/https URLs stored; peer solutions inert | PLANNED |
| M-013 | P2 | Security | Remove `?pay_debug=true` enrollment backdoor | FE | `CourseDetail.tsx:1326,1241-1265` | BE-37 | — | Low | Param no longer bypasses paywall | PLANNED |
| M-021 | P2 | Progress | Stop setting `ModuleProgress.quizPassed` from challenge completion; distinct flag | BE | `challengeService.ts:151-161` | BE-30 | M-002 | Low | Challenge completion no longer marks quiz passed | PLANNED |
| M-024 | P2 | Contract | Central Prisma-error mapping (log full, generic response); one envelope `{data,meta}`; all catches → `next(err)`; shared FE types + update consumers | COORD | `errorHandler.ts`, route handlers, FE `src/types/` (new), ~20 consumers | BE-24, BE-27 | M-018 | Med | All consumers render post-change; dev stack stays out of prod | PLANNED |
| M-026 | P2 | Structure | Extract services for forum/assignment/project/contact; import shared `isAdmin` | BE | `routes/{forum,assignment,project,contact}.ts`, `middleware/auth.ts:33` | BE-38 | — | Low–Med | Handlers delegate; duplicated isAdmin gone | PLANNED |
| M-027 | P2 | DB | One additive migration: `onDelete` on Course relations, Course FKs for 5 orphan `courseId` models, indexes on admin queues | DB | `schema.prisma:58,79,163,279,234-344` + migration | BE-33, BE-34, BE-35 | — | Low–Med | Course delete cascades; FK integrity; admin queries use indexes | PLANNED |
| M-028 | P2 | DB | Recompute (or stop storing) `CourseProgress.progress`/`completed` derived values | BE | `quizService.ts:202-278`, `schema.prisma:59-63` | BE-36 | M-020 | Low | Progress reflects current module counts | PLANNED |
| M-032 | P2 | DB | Schema drift: reconcile enum→String, remove dead `User.progress`, confirm all 8 `db push` tables have migrations | DB | `schema.prisma`, migrations | Phase-1 #1, #15 | — | Low–Med | Fresh env matches live; no future #75-style 500s | PLANNED |
| M-041 | P2 | Primitives | Card keyboard a11y (role/tabIndex/Enter when clickable); shadow opt-out; remove dead `CourseCard.tags` | FE | `atoms/Card.tsx:30`, `molecules/CourseCard.tsx:132-133` | P2-3, Step-9 | M-039 | Low | Keyboard activates cards | PLANNED |
| M-051 | P2 | Admin | CMS accordion header re-flow (wrap buttons), saving/disabled state, promote-confirm, sortable-th a11y | FE | `AdminDashboard.tsx:1182-1225,1262-1329,1368-1382` | RB-02, #16 | M-044 | Low–Med | Header tappable at 320; no double-submit; keyboard sorts | PLANNED |
| M-052 | P2 | Home/static | Home: consume `config/courses.ts`+`useCourses`, remove mock fallback, mobile hero, heading order · static pages: primitives + light-mode contrast · Verify: button destinations + `useSearchParams` | FE | `Home.tsx:18,246,659,822,837`, About/Contact/Terms/Privacy/Refund/NotFound, `Verify.tsx:131,155` | P2-6, P2-9, Step-21, RB-10, RB-20, #11, #19, BE-29 | M-039, M-040, M-043 | Med | One course source; no mock-as-real; light readable; Verify navigates correctly | PLANNED |
| M-053 | P2 | Auth UI | Shared `AuthForm` (mode prop) → Login/Register/Home inline form | FE | `organisms/AuthForm.tsx` (new), `LoginPage.tsx`, `Home.tsx:1148` | Step-22 | M-039, M-040 | Low–Med | All three entry points identical | PLANNED |
| M-054 | P2 | Layout | Responsive hardening: breakpoints for Quiz/PayPage, 44px targets, toast/FAB z-order, drawer≥modal z, overflow-mask reassessment | FE | `Quiz.tsx`, `PayPage.tsx`, `UIContext.tsx`, `FloatingSupportWidget.tsx`, `index.css` | P2-10, Step-23/24, RB-16, RB-17 | M-043 | Low–Med | 320–1440 sweep clean; toasts never hidden | PLANNED |
| M-055 | P2 | A11y | h1s on 6 pages, heading order, `prefers-reduced-motion`, contrast floor (11px→12px), aria-live timers, keyboardable sortable-th | FE | 6 pages, `index.css`, QuizHeader, SkillRadar | P2-2, P2-4, P2-5, Step-25 | M-035, M-040, M-042 | Low | axe/Lighthouse pass per screen | PLANNED |
| M-059 | P2 | Testing | Invariant regression suite (no-auto-verify, PII split, quiz integrity, gates, pricing) + enable CI test step + typecheck/build gates | CROSS | `backend` tests, `.github/workflows/ci.yml` | BE-47, Phase-1 #3 | M-002, M-018, M-015 | Low | CI runs suite; invariants verified on every PR | PLANNED |
| M-014 | P3 | Sandbox | Move SQL challenge execution into sandboxed child, or document the bounded in-process risk | BE | `challengeRunnerService.ts:87-99,189-190` | BE-41 | — | Med | User SQL never runs in Express process (or documented+rate-limited) | PLANNED |
| M-029 | P3 | Cleanup | Backend dead code/env: delete/centralize `businessRules`+`curriculumData`, drop `courseEnrollSchema`, dead env vars, add `FRONTEND_URL`; drop vestigial `userId` (coordinated) | COORD | `src/lib/*`, `validation.ts:57-61,63-73`, `useQuiz.ts:34-40`, `docker-compose.prod.yml` | BE-42, BE-43, BE-45 | — | Low | No dead imports; env documented; payloads clean | PLANNED |
| M-030 | P3 | Ops | Docker: multi-stage image, migrations as one-shot/retry, HEALTHCHECK → `/health` (+Redis) | OPS | `Dockerfile`, `docker-compose.prod.yml` | BE-44 | — | Low–Med | Smaller image; healthcheck reflects DB | PLANNED |
| M-031 | P3 | Governance | Admin audit log: payment verify/fail/delete + cert verify/unverify (actor, action, timestamp) | BE | `paymentService.ts:161-214`, `certificateService.ts:367-383` + model | BE-46 | — | Low | Audit rows on every admin payment/cert mutation | PLANNED |
| M-033 | P3 | Payments | Decision: payment gateway + webhook, OR formalized manual-verify + audit design | BE | product decision | Phase-1 #5 | M-031 | — | Written decision; no code until owner approves | DEFERRED |
| M-056 | P3 | Perf | Lazy logo + image dims/lazy, remove ~1MB dead images, trim `transition-all`, kill infinite ambient anim on Home, disable particles below lg | FE | `Navbar.tsx:99`, `NotFound.tsx:20`, `index.html`, assets | P3-1, Step-27, #18 | M-035, M-055 | Low | Bundle/LCP improves; no visual regression | PLANNED |
| M-057 | P3 | Cleanup | Frontend dead code: QuizResults, RegisterPage, `config/projects.ts`, `src/assets/*`, no-op animation classes, dead props | FE | files above | P2-1, #17 | — | Low | `git grep` clean; build passes | PLANNED |
| M-058 | P3 | Admin | Split AdminDashboard into routed sub-screens on shared primitives | FE | `pages/AdminDashboard.tsx` → `pages/admin/*` | P3-4, Step-28 | M-044, M-049, M-050 | High | `/admin` unchanged; each tab its own file; parity tab-by-tab | PLANNED |

---

## 11. Parallel Work Groups

Only grouped where no shared file and no ordering constraint:

| Group | Tasks | Why safe |
|---|---|---|
| **G-A (Wave 1)** | M-001 (BE) · M-034 (FE) · M-002 (BE) · M-015 (BE) · M-003 (BE) · M-036 (FE) | Different layers/files; M-036 before M-045 only. No FE↔BE file overlap. |
| **G-B** | M-004 (BE rate) · M-005 (BE headers) · M-037/38 (FE contexts) · M-008 (BE auth hygiene) | Independent subsystems. |
| **G-C** | M-016 (BE payment ref) · M-017 (BE payment state) · M-039/40 (FE primitives) · M-010/11/12 (BE validation/XSS/fileUrl) | M-016→M-017 sequential within BE; FE parallel. |
| **G-D** | M-020/21/22 (BE grading/XP/auth-perf) · M-041/42/43 (FE primitives/layout) | M-020→M-021 sequential; M-042→M-043 sequential within FE; cross-track parallel. |
| **G-E** | M-019 (BE final exam) · M-044 (FE Tabs/Table) · M-026 (BE services) | Independent. |
| **G-F** | M-027/28/32 (DB additive) · M-035 (FE theme) · M-018 backend half (BE quote) | DB and FE never touch files; M-018 FE half waits for Phase D coordination. |
| **G-G (Phase F)** | M-046 · M-047 · M-049 · M-050 · M-051 · M-053 | Different FE files; M-048 stays separate (largest, needs M-036 + contract). |
| **G-H (Phase G)** | M-054 · M-055 · M-056 · M-057 | Different concerns, all post-Foundation. |

**Not parallel (dangerous deps):** M-045 depends on M-036; M-050 on M-044; M-024/M-018/M-007/M-023/M-025 on their BE+FE halves shipping together; M-019/M-020 on M-002; M-058 last.

---

## 12. Wave 1

First implementation wave — only high-priority, low/controlled-risk, clearly specified, independently testable tasks.

### W1-1 — M-001 · Close password-reset account takeover (BE)
- **WHY NOW:** the only live, unauthenticated exploit; two requests, every account incl. admins; self-contained.
- **FILES:** `backend/src/services/authService.ts:108-126` · `backend/src/routes/auth.ts:32-39` · `.env.example` (+SMTP vars, `FRONTEND_URL`). Dev fallback: token-URL only when `NODE_ENV=development`.
- **DEPS:** none.
- **EXPECTED RESULT:** identical `{success:true}` for every email; link goes only to the inbox; DB holds only a hash.
- **VALIDATION:** byte-identical bodies for existing/non-existing email; emailed link completes a reset in dev; tokens cleared on use; no auth-contract change.

### W1-2 — M-034 · Register missing Tailwind shades (FE)
- **WHY NOW:** 96 dead dark-mode classes; the cheapest fix that unblocks visual verification of every later FE step.
- **FILES:** `frontend/src/index.css` (`@theme`).
- **DEPS:** none.
- **EXPECTED RESULT:** Admin "Add Week Module" background, CourseDetail shimmers, Dashboard referral borders, PracticeArena borders render correctly in dark.
- **VALIDATION:** `vite build`; classes present in output CSS; light mode unchanged; `git status` shows only `index.css`.

### W1-3 — M-002 · Quiz grading integrity (BE)
- **WHY NOW:** forgery corrupts progress→certificates; highest platform integrity impact after the reset token.
- **FILES:** `backend/src/services/quizService.ts:29-49,37-44,114-282` · `backend/src/middleware/validation.ts:63-73`.
- **DEPS:** none.
- **EXPECTED RESULT:** a 1-answer submit fails; cross-course question IDs rejected; legit quizzes pass unchanged.
- **VALIDATION:** unit-grade the service against crafted payloads; regression on one real 20-module quiz.

### W1-4 — M-045 · Quiz page dead-flow fixes (FE)
- **WHY NOW:** the CRITICAL blank-page bug; needs M-036 first.
- **FILES:** `frontend/src/pages/Quiz.tsx:157,205` · `frontend/src/hooks/useQuiz.ts` (M-036) · `ExamResultsModal.tsx`.
- **DEPS:** M-036.
- **EXPECTED RESULT:** empty set renders a friendly state; cancel confirms; early submit available.
- **VALIDATION:** navigate to a legacy/empty quiz → state renders; keyboard walkthrough.

### W1-5 — M-003 · CADDED course gates (BE)
- **WHY NOW:** paying students are locked out of assignments/projects today.
- **FILES:** `backend/src/routes/project.ts:49-57` · `backend/src/routes/assignment.ts:49-57`.
- **DEPS:** none.
- **EXPECTED RESULT:** 5-module courses submit week-2+ assignments and final projects.
- **VALIDATION:** CADDED fixture user completes all modules → project submit 200; assignment week mapping resolves real modules.

### W1-6 — M-015 · Payment reference integrity (BE)
- **WHY NOW:** one UPI payment can currently unlock multiple courses.
- **FILES:** `backend/src/services/paymentService.ts:131-158` · `backend/prisma/schema.prisma:157` (+ additive migration).
- **DEPS:** none.
- **EXPECTED RESULT:** second order with same reference → 409; `transactionId` populated.
- **VALIDATION:** submit same `gatewayReference` twice → second rejected; legacy rows (null transactionId) still render in admin.

*(Wave 1 also runs W1-2's M-034 in parallel with W1-1 — they share nothing.)*

---

## 13. First 10 Implementation Tasks

| # | Task (concrete) | ID | Layer |
|---|---|---|---|
| 1 | Stop returning the reset token/URL in `forgotPassword`; deliver by email; identical bodies; hash at rest — `authService.ts:108-126,128-151`, `routes/auth.ts:32-39` | M-001 | BE |
| 2 | Register missing Tailwind shade tokens in `frontend/src/index.css` `@theme` | M-034 | FE |
| 3 | Bind quiz grading to the real module/topic question set and the actual question count — `quizService.ts:29-49,37-44,114-282`, `validation.ts:63-73` | M-002 | BE |
| 4 | Fix Quiz blank page / cancel-confirm / early-submit — `pages/Quiz.tsx:157,205` | M-045 | FE |
| 5 | Derive project+assignment gates from `module.count(courseId)` — `routes/project.ts:49-57`, `routes/assignment.ts:49-57` | M-003 | BE |
| 6 | Toast system a11y + severity fixes + z-above-FAB — `UIContext.tsx:91-106`, `AdminDashboard.tsx:189,595,683` | M-038 | FE |
| 7 | Write `Payment.transactionId` + 409 on collision — `paymentService.ts:131-158` | M-015 | BE |
| 8 | Admin-only quiz-questions endpoint incl. `correctAnswer`; point `AdminDashboard.tsx:535,1312` at it | M-025 | COORD |
| 9 | `useQuiz` correctness: loading init, clear-on-refetch, split fetch/submit, abort — `hooks/useQuiz.ts` | M-036 | FE |
| 10 | Helmet + CSP — `src/index.ts`, `nginx/edunexus.conf` (allow Google Fonts for Certificate) | M-005 | BE |

---

## 14. Validation Strategy

### Frontend gates (every FE action)
- **Typecheck/build:** `npm run build` (`tsc -b && vite build`) must pass; no new TS errors.
- **Route checks:** the touched routes still render + guard correctly (Protected/Admin).
- **Responsive checks:** screenshot pass at 320/375/414/768/1024/1440 for every touched screen (no clip, no truncation, no double-pad).
- **A11y checks:** axe-core/Lighthouse per screen; keyboard-only walkthrough of Quiz, CourseDetail, Admin; label/h1/focus checks on every form.
- **Visual regression:** screenshot parity before/after for refactors; dark+light both.

### Backend gates (every BE action)
- **Unit:** service-level tests for grading, pricing, state machine, cert PII split, gate math.
- **API:** endpoint contract tests (status, envelope, auth codes) via a scripted harness or supertest.
- **Auth:** register/login/forgot/reset/me/admin flows; 401-vs-403; revocation after password change.
- **Payment:** no-auto-verify invariant test; IDOR; state machine; idempotency; reference collision.
- **DB:** migration applies cleanly on a copy of prod data; referential integrity; indexes used (`EXPLAIN`).
- **Security regression:** reset token absent from bodies; hashes at rest; XSS payloads stored inert; fileUrl scheme-allowlist; `pay_debug` dead; rate limiter behaves behind `trust proxy`.

### Cross-layer gates (every COORD action)
- **Contract checks:** a type-level contract test (FE consumes only declared shapes); envelope match.
- **Flow tests (post-every-wave):** login → dashboard · enroll → pay → verify → certificate · quiz → progress advance · practice → leaderboard · admin review → evaluate → payout status. A single end-to-end script per flow, run before and after each Phase.

### Required after every implementation wave
1. BE: invariant suite (M-059 base) green — no-auto-verify, PII split, grading, gates, pricing.
2. FE: build + a11y scan + responsive screenshot diff on the touched screens.
3. Cross-layer: the 7 flow scripts green (login, enrollment, payment, quiz, certificate, admin, practice).
4. Prod-safety: staging migration check on a restored DB backup; deploy dry-run.

---

## 15. Rollback Strategy

| Phase | What can break | Detect | Safe rollback | Data never changed destructively |
|---|---|---|---|---|
| A (P0) | Reset-email delivery breaks if SMTP misconfigured; grading strictness rejects a legitimate quiz; gate change lets through ungated submission | Smoke login/reset; grade a known-good quiz; submit CADDED fixture | Revert the single BE commit; re-deploy backend only (`docker compose build backend && up -d`); DB backup restorable if migration ran | Nothing — A has one additive migration (M-015) only |
| B (Security) | Rate limiter lockout; CSP blocks fonts/QR; validation 400s a previously-accepted form | Watch error logs + do a 1-user login burst in staging; load /certificate (fonts) | Flip `trust proxy`/store back to in-memory; CSP from `unsafe-inline`→tight in one PR; schema reversion not needed | None |
| C (Rules/DB) | Migrations conflict with live drift (M-027/M-032) | Migration dry-run on a prod backup first; check `_prisma_migrations` | Backup before any migration (`backup_db.sh`); additive migrations are reversible by apply-revert migration; never `--accept-data-loss` | **No DELETE/ALTER DROP anywhere**; dead fields only dropped in a later, separately-approved migration |
| D (Contract) | Envelope change breaks an FE consumer; 401 interceptor logs users out wrongly; pricing endpoint diverges | Per-consumer smoke; contract test suite; price cross-check vs recorded order | Each COORD pair is one revertible commit (FE+BE together); interceptor gated to 401-only | Payment amounts/statuses never rewritten |
| E/F/G (FE) | Dialog/PageContainer/theme regressions | Per-page screenshot parity + flow scripts | `git revert` the single FE commit; FE is behind nginx — rebuild frontend container only | None |
| H (Admin/Ops) | Docker image change breaks deploy; admin split loses a feature | Deploy to staging; tab-by-tab parity pass | Keep old image tag; rollback = `up -d` with previous image; M-058 lands only after everything else green | None |

**Global rollback invariant (I-8/I-17):** every deploy takes a DB backup first, never rsyncs `.env`, never uses `--accept-data-loss`, and the backend CMD (`prisma migrate deploy && npm start`) means a schema change applies only on container start — so a bad migration is caught at boot, not mid-traffic.

---

## 16. EduNexus Pro Next Target Architecture

No framework rewrite — same stack (React 19 + Vite + Tailwind 4 + Context API · Express 5 + Prisma 6 + PostgreSQL + Redis).

```
EDUNEXUS PRO TODAY
  inline-Prisma forum/assignment/project/contact · 3 error shapes · 3 envelopes
  in-memory rate limiter (no trust proxy) · no headers/CSP
  reset token in body · quiz trusts client subset · hardcoded 20-module gates
  Payment.transactionId unused · no enrollment gate · FE/BE pricing duplicated
  96 dead shade classes · .light 250-line hack · 9 bespoke overlays
  3 monoliths (Admin 2649 / CourseDetail 1588 / Home 1383) · no tests/CI
        ↓  PHASE A  STABILIZATION (P0, parallel FE/BE)
  reset token emailed+hashed · quiz bound to real set · CADDED gates fixed
  payment ref unique · quiz page never blank · dark renders right
        ↓  PHASE B  SECURITY
  Redis rate limiter behind trust proxy · helmet+CSP · zod everywhere · XSS/fileUrl closed
        ↓  PHASE C  BACKEND CORRECTNESS
  transactions + atomic XP · payment state machine + idempotency · additive migrations/FKs/indexes
        ↓  PHASE D  API CONTRACT (coordinated FE+BE)
  one envelope + shared types · server-only pricing (quote endpoint) · 401 handled · enrollment gate · no orphans
        ↓  PHASE E  FRONTEND FOUNDATION
  primitives (Button/Input/Card/Dialog/Tabs/Table) · PageContainer · token-driven themes
        ↓  PHASE F  DOMAIN SCREENS
  Practice · Dashboard · CourseDetail · Home · Verify · Admin on primitives, flows preserved
        ↓  PHASE G  RESPONSIVE + A11Y + PERFORMANCE
  320–1440 clean · WCAG pass · lazy/perf wins
        ↓  PHASE H  DECOMPOSITION + GOVERNANCE
  Admin split · multi-stage Docker · audit log · invariant test suite + CI
EDUNEXUS PRO NEXT
```

---

## 17. Master Do-Not-Touch List

### 🚫 ABSOLUTE NO-TOUCH (never, in any phase)
1. **Certificate page** — `frontend/src/pages/Certificate.tsx` + inline `<style>` + its print CSS (I-1).
2. **Backend certificate gating** — `certificateService.generateCertificate` completion+VERIFIED 402 gate, admin-verify skip, PENDING→VERIFIED PII split, legacy-ID parsing (I-13).
3. **Payment no-auto-verify invariant** — only `adminVerifyPayment` writes VERIFIED (I-2); admin verification authoritative (I-3); discount caps + `finalAmount ≥ 0` server-enforced (I-4); status string semantics preserved incl. legacy (I-5).
4. **Production data & migrations** — no destructive rewrite, no `--accept-data-loss`, no reseeds on live user progress; backup-before-deploy + `.env`-preserving discipline (I-8, I-17).
5. **Sandbox isolation** — never widened; M-014 only moves SQL *into* the child (I-9).
6. **Framework/stack** — no React/Express/Tailwind/Prisma/DB rewrite; no new state library (I-18).
7. **`verificationCode`/`verificationStatus` column names** and `resetToken`/`resetTokenExpires`/`verificationToken` field names — handling changes only (I-16, Phase 4 #10).

### ⚠️ SAFE ONLY WITH PAIRED FE+BE CHANGE
8. **Route paths / methods / response fields the FE consumes** — M-024 envelope is the single coordinated exception (I-7).
9. **JWT/auth contract** — M-006/M-007 only, as coordinated commits (I-6).
10. **`.light` override chain** — removed only by M-035 after the last consumer migrates (I-12).
11. **`errorHandler` surface + dev-stack behavior** — M-024 must keep prod safe and preserve the `{status,statusCode,message}` shape (I-14).
12. **Rate-limit budgets** — M-004 corrects keying/store only, never loosens (I-15).
13. **`isVerified` semantics** — no verification lockdown until M-009 decides (I-11).

### 🔒 CHANGE ONLY AFTER EXPLICIT APPROVAL
14. **Certificates backend**: audit-log addition (M-031) is the only allowed backend-cert change — needs explicit sign-off.
15. **`GET /certificate/:courseId` side-effecting GET** → POST migration (in M-024 scope) — needs explicit approval before contract change.
16. **Payment gateway/webhook or manual-flow redesign (M-033)** — strategic decision, no code until approved.
17. **Course content reseeds** against the live DB — never without a fresh backup and a written go-ahead.
18. **Admin role edit, coupon code table migration, and any `Setting` key semantics** — covered by M-010/M-018 only under supervision.

---

## 18. Final Implementation Decision

1. **Is the project ready for implementation?** — **Yes.** The codebase is stable enough to start the backlog today; the register (M-001…M-059) is implementation-ready, each action is scoped to limited files, and the P0/P1 set is small and unambiguous.

2. **What must be fixed before UI modernization?** — All **P0** (M-001, M-002, M-045) plus the **P1 backend correctness** set (M-003, M-015, M-016, M-017, M-018, M-025) and the **API-contract layer** (M-024, M-007, M-006, M-023). UI modernization (Phase E+) is blocked on M-034, M-035, and the contract being stable — you must not rebuild pages on a contract that is about to change.

3. **What can happen in parallel?** — Everything in **Section 11 Parallel Groups**; concretely: M-001 ∥ M-034 ∥ M-002 ∥ M-015 in Wave 1; then the whole FE foundation track (M-036…M-044) runs beside the BE security track (M-004, M-005, M-008, M-010–M-014); DB work (M-027, M-032) is parallel-safe throughout (additive migrations, separate files).

4. **What should NOT be touched yet?** — The entire **§17 Absolute list**; M-058 (AdminDashboard split) until Phase F lands; M-033 (gateway) until you decide; M-030 (Dockerfile) until the code phases are green; Certificate in every form.

5. **What is the FIRST implementation task?** — **M-001 — Close the password-reset account-takeover** (`authService.ts:108-126,128-151`, `routes/auth.ts:32-39`, `.env.example`): stop returning the token/URL in any body, deliver by email, identical responses, hash at rest. Self-contained, zero deps, live exploit, crisp validation.

6. **What is the SECOND implementation task?** — **M-034 — Register the missing Tailwind shade tokens** in `frontend/src/index.css` `@theme` (slate-850/855/750/905/655/405, blue-450, rose-450, to-blue-750). Independent, additive, unblocks all FE visual verification. (M-002 quiz grading is the natural third.)

7. **What is the FIRST major milestone?** — **"Phase A + B complete":** no live exploit, unforgeable grading, CADDED students unblocked, payment references unique, security headers + rate limiter hardened, and the FE foundation primitives in place — i.e., **M-001, M-002, M-003, M-015, M-045, M-034, M-036, M-037, M-038, M-039, M-040, M-042, M-043, M-044, M-004, M-005 all green** and the invariant regression suite running in CI.

8. **What should "EduNexus Pro Next" look like when this roadmap is complete?** — A platform that is: **secure by construction** (emailed+hashed resets, unforgeable grading, server-only pricing, enrollment-gated content, Redis-backed limits, CSP); **contractually clean** (one envelope, shared FE types, no orphans, no FE/BE drift); **built on a real design system** (token-driven dark+light themes, one Dialog/Table/Button/FormField, PageContainer layout, a11y-clean); **maintainable** (no monoliths — decomposed admin and CourseDetail, service layer for the four inline domains, additive migrations, indexed queries, atomic writes); **tested** (invariant suite + CI + end-to-end flow scripts); and operationally sound (multi-stage Docker, `/health`, audit log, non-destructive deploys) — while **keeping every working flow, the certificate page, and the hardened payment/certificate invariants exactly as they are today.**

---

**PHASE 5 COMPLETE**
**MASTER ACTION PLAN READY FOR IMPLEMENTATION**

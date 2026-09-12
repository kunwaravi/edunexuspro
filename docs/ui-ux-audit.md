# EduNexus Pro — Complete UI/UX + Responsive Audit (Phase 2)

> **Document type:** Analysis + documentation only. No code was modified, no packages installed, nothing redesigned.
> **Date:** 2026-08-13
> **Source:** Full read of every frontend source file (`frontend/src`, ~14,283 lines across 19 pages, 27 components, 3 contexts, 3 hooks) plus `index.html`, `index.css`, `App.css`, `tailwind.config.js`, `vite.config.ts`, `App.tsx`.
> **Labels:** ✅ **CONFIRMED** (seen in code, file:line) · 🔶 **INFERRED** · ⚪ **UNKNOWN / NOT CONFIRMED**
> **Constraint honored:** The Certificate page is a user-mandated **HARD NO-TOUCH** area — its issues are documented for awareness only, with no change recommendations.
> **File paths:** relative to `/home/abhi/repo/edunexuspro/frontend/` unless otherwise noted.

---

## 1. Complete Screen / Route Inventory

All routes are wired in `src/App.tsx` (`App.tsx:56-77`) under a global shell: sticky `Navbar`, `fixed bottom-4 right-4 z-[9999]` `FloatingSupportWidget`, `container mx-auto px-4 py-8 flex-grow` wrapper (`App.tsx:46-49`), `ErrorBoundary` + single `Suspense`. Eager pages: Home, LoginPage, ForgotPassword, ResetPassword, Verify. All others `React.lazy`.

| Route | Screen | User | Purpose | Main Components | Data/API dependency |
|---|---|---|---|---|---|
| `/` | Home | Public | Marketing/landing + embedded auth + catalog + leaderboard | Hero, bento catalog, leaderboard podium, inline auth form, syllabus-preview modal | `GET /courses`, `GET /practice/leaderboard/public`, `POST /auth/login`/`register`; inline `courseDetails` fallback |
| `/login` | LoginPage (mode=login) | Public | Sign in | Card, Button, Input, FloatingParticles | `POST /auth/login` |
| `/register` | LoginPage (mode=register) | Public | Register | same | `POST /auth/register` |
| `/register` → `RegisterPage.tsx` | **Dead code** | — | Orphaned wrapper, never routed (`App.tsx:59` routes to LoginPage; file never imported) | — | — |
| `/forgot-password` | ForgotPasswordPage | Public | Request reset link | Card, Button, Input | `POST /auth/forgot-password` |
| `/reset-password` | ResetPassword | Public | Set new password | Card, Button, Input | `POST /auth/reset-password` |
| `/dashboard` | Dashboard | Auth | Student console | CourseCard, Skeleton, SkillRadar, ProjectStatusCard, LeaderboardTab | `GET /courses` (useCourses), `GET /practice/daily`, `POST /practice/daily/submit`, `GET /practice/leaderboard` |
| `/course/:id` | CourseDetail | Auth | Learning core (3 view-states) | CourseHero, SyllabusManager, ProgressMap, CodePlayground, EnrollmentPanel, PeerSolutionsModal, doubts drawer, lightbox | `GET /courses`, `GET /payments/status/:id`, `GET /courses/:id/module/:week`, `GET /assignments/status/:id`, `GET /projects/status/:id`, forum endpoints, assignment/project submits |
| `/quiz/:courseId/:week` | Quiz | Auth | Timed chapter quiz | QuizHeader, QuizQuestion, ExamResultsModal, confetti | `GET /quiz/questions/:courseId/:week`, `POST /quiz/submit` |
| `/quiz/:courseId/:week/:topicId` | Quiz | Auth | Timed topic quiz | same | `GET /quiz/questions/topic/:topicId` |
| `/practice/arena` | PracticeArena | Auth | MCQ + coding practice, 15-min timer | Skeleton, CodePlayground, confetti, confirmDialog | `GET /practice/questions?category=`, `POST /practice/submit`, `POST /sandbox/run` |
| `/pay/:courseId` | PayPage | Auth | UPI checkout | QRCodeSVG, inline forms | `GET /payments/status/:courseId`, `POST /payments/create-order`, `POST /payments/verify` |
| `/certificate?courseId&userId` | Certificate | Auth | Printable QR certificate | QRCodeSVG, inline CSS | `GET /certificate/:courseId`, `GET /certificate/:userId/:courseId` |
| `/verify?id` + `/verify?token` | Verify | Public | Certificate authenticity + email verify | raw elements + motion | `GET /certificate/verify/:id`, `GET /courses/:id/public`, `GET /auth/verify?token=` |
| `/admin` | AdminDashboard | Admin | 8-tab back-office | AdminPaymentTable, 5 custom modals, ConfirmDialog | all `/admin/*` endpoints + `/contact/*` |
| `/about` `/contact` | About / Contact | Public | Company / contact form + settings | raw elements + lucide | `GET /contact/settings`, `POST /contact` |
| `/terms` `/privacy` `/refund` | Terms / Privacy / Refund | Public | Legal/static | raw elements | none |
| `*` | NotFound | Public | 404 | logo img, links | reads `useAuth` |
| — | **Loading states** | — | Per-page spinners/skeletons | Skeleton, Spinner | — |
| — | **Empty states** | — | Dashboard courses empty, leaderboard <3, practice empty, peer solutions empty, doubts empty, review/payments empty | inline | — |
| — | **Modal-driven screens** | — | Syllabus preview (Home), Exam results, Peer solutions, Doubts drawer, Lightbox (CourseDetail), 5 admin editor modals, Edit-candidate modal, ConfirmDialog (global) | — | — |

---

## 2. UI Component Inventory

All shared components live in `src/components/{atoms,molecules,organisms}` (26 files) + `Navbar.tsx`.

### Layout
| Component | File | Reused in | Notes |
|---|---|---|---|
| Navbar | `Navbar.tsx` (347) | App shell (global) | Auth-aware; profile dropdown + mobile drawer; **the only fully-correct responsive implementation** (`hidden md:flex`, `md:hidden`) |
| Footer | inline in `App.tsx:83-101` | global | not a component |
| FloatingSupportWidget | `atoms/FloatingSupportWidget.tsx` | App shell (global) | FAB `z-[9999]`, hardcoded brand hexes |
| Page wrapper | `App.tsx:49` | global | `.container mx-auto px-4 py-8` — **adds double horizontal padding on top of each page's own `px-*`** ✅ |

### Navigation
| Component | Notes |
|---|---|
| Navbar desktop links + mobile drawer | `hidden md:flex` / `md:hidden` |
| Tabs | Dashboard (`overflow-x-auto`, no ARIA tab pattern), AdminDashboard (`aria-pressed` only), CourseDetail material/project (`layoutId` motion), Admin review sub-tabs |
| Breadcrumbs | `CourseHero.tsx` (responsive `max-w` truncation) |
| Admin tab bar | `AdminDashboard.tsx:761-798` — horizontal scroll pill bar (`#89` fix) |
| Syllabus tree/map | `SyllabusManager` + `ProgressMap` (real buttons, `aria-label`) |

### Content
| Component | File | Notes |
|---|---|---|
| Card | `atoms/Card.tsx` | 4 variants, `rounded-2xl border shadow-lg overflow-hidden`, **always-on shadow**, clickable via `onClick` on a `div` (not keyboard-focusable) ✅ |
| CourseCard | `molecules/CourseCard.tsx` | Dashboard variant (whole card = `div onClick`); `h-32` gradient header; catalog/dashboard dual hard-coded layouts |
| Badge | `atoms/Badge.tsx` | 7 variants, 2 sizes, `text-[11px]`; used only by CourseCard |
| Table wrappers | — | **All 8 tables in the app are inside `overflow-x-auto`** ✅ (a genuine strength): AdminDashboard:884/1364/1685/1989/2098, Home:1074, LeaderboardTab:138, AdminPaymentTable:160 |
| Progress indicators | `ProgressMap`, skill/score rings (SVG), timer bars, `h-1.5` quiz progress | |
| CodePlayground | `molecules/CodePlayground.tsx` | `grid-cols-1 lg:grid-cols-2`; output pane **has no `overflow-x-auto`/`break-words`** ✅ |
| SkillRadar | `molecules/SkillRadar.tsx` | hardcoded 200×200 SVG, no accessible name ✅ |

### Interaction
| Component | File | Notes |
|---|---|---|
| Button | `atoms/Button.tsx` | 6 variants/3 sizes/`isLoading`; `rounded-xl font-bold uppercase tracking-wider`; `transition-all` listed **twice** in one class string ✅; **no default `type="button"`** |
| Input | `atoms/Input.tsx` | `label` rendered with **no `htmlFor`**, input no `id` ✅; no `aria-invalid`/`aria-describedby` |
| FormField | `molecules/FormField.tsx` | thin pass-through of Input; used only by Home — duplicates Input 1:1 |
| Selects | raw `<select>` (admin) | no custom Select |
| Checkbox / radio | raw (quiz uses `<label>`+radio ✅); privacy toggle = `button aria-pressed` ✅ | |
| ConfirmDialog | `atoms/ConfirmDialog.tsx` | global promise-based; `role="dialog" aria-modal aria-label` + Escape ✅; **no focus trap / focus restore**; `busy` prop is dead code (never true) ✅ |
| ExamResultsModal | `molecules/ExamResultsModal.tsx` | **no `role=dialog`/`aria-modal`/Escape/focus trap** ✅ |
| PeerSolutionsModal | `molecules/PeerSolutionsModal.tsx` | same gaps; backdrop-click closes ✅ |
| 5 admin modals + Edit-candidate modal | inline in `AdminDashboard.tsx` | same overlay pattern duplicated 5×, none a11y-complete ✅ |
| Toasts | `UIContext.tsx:91-106` | `fixed bottom-4 right-4 z-50`; **no `aria-live`/`role=status`**; dismiss `×` no aria-label; 5s auto-dismiss; color-only severity ✅; **occluded by FAB `z-[9999]`** ✅ |

### Feedback
| Component | Notes |
|---|---|
| Skeleton | `atoms/Skeleton.tsx` (`aria-hidden`) — but callers (Dashboard/PracticeArena) don't add `role="status"` ✅ |
| Spinner | `atoms/Spinner.tsx` — `role="status"` + `aria-label` + sr-only ✅ |
| ErrorBoundary | `atoms/ErrorBoundary.tsx` — `role="img"` warning emoji, refresh button ✅ |
| Empty states | inline per page — inconsistent styling |
| Error states | inline per page — no shared `ErrorMessage` |
| Success states | toasts + inline; toasts are not announced ✅ |

### Duplicate versions exist (inline, in pages)
- **Inline buttons** re-implementing Button variants: `Certificate.tsx:482`, `CourseDetail.tsx:1530`, `Dashboard.tsx:366/500`, `PracticeArena.tsx:261/528/591`, `Verify.tsx:196`, `PayPage.tsx:339` ✅
- **Inline modals**: `AdminDashboard.tsx:1525/2197/2373/2462/2562`, `CourseDetail.tsx:1346/1548`, `Home.tsx:1273` ✅
- **Inline cards** duplicating Card: `About.tsx:59/69/79/89`, `CourseDetail.tsx:1267`, `Verify.tsx:179`, `AdminDashboard.tsx:2289` ✅
- **Inline inputs** duplicating Input: `Verify.tsx:185`, `PayPage.tsx:378`, `AdminDashboard.tsx:1551/2289/2487/2501/2514/2600/2613`, `Contact.tsx` (3) ✅

---

## 3. Page-by-Page UI Audit

### Screen: Home
- **Route** `/` · **Public** · marketing + embedded auth.
- **Layout** (`Home.tsx:698-1379`): scroll-progress bar → animated mesh-gradient bg → floating tech SVGs → "Desktop Recommended" banner → hero split (`flex-col lg:flex-row`) → trust metrics → bento catalog (`grid-cols-1 md:grid-cols-6`) → Hall of Fame podium → accreditation grid → enrollment card (`max-w-md`) → syllabus-preview modal.
- **Components:** Button, FormField, Card, motion/AnimatePresence, custom SVG icons (494-520).
- **Data:** `GET /courses` with **inline `courseDetails` fallback (18-244) ~460 lines of duplicated static curriculum** ✅; `GET /practice/leaderboard/public` with **mock fallback data shown as real** (660-666) ✅; inline auth `POST /auth/login|register` (675-680).
- **States:** loading/error/success/disabled present. **Missing:** catalog loading skeleton, catalog error message (silent fallback), leaderboard empty state (<3 renders nothing), no forgot-password link in inline form ✅.
- **Responsive:** `flex-col lg:flex-row`, `grid-cols-1 sm:grid-cols-3 md:grid-cols-6`, `hidden lg:block`. ✅ **Hero card absent below lg** (`:822`) — tablet/mobile get no hero visual. Double padding from App wrapper.
- **Hierarchy:** Telegram CTA (`font-extrabold`, brand blue, `:788`) competes with primary amber "Start Learning Now" (`:799`); each course card has two equal-weight buttons. **"Enroll Now" scrolls to a login form, not enrollment** ✅ (`:963-968 → :1127`).
- **Density:** too dense (~1,380 lines, 7 stacked sections, infinite ambient animation).
- **A11y:** heading-order violation (h3 at `:837` before first h2 at `:872`); labels unassociated; syllabus modal no `role=dialog`/focus trap/Escape; accordion trigger `focus:outline-none` kills focus ring (`:1321`); `text-slate-450`/`650` borderline contrast.

### Screen: Login / Register
- **Route** `/login`, `/register` (same component, `mode` prop) · **Public**.
- **Layout:** centered `Card p-8 sm:p-10 max-w-xl` + FloatingParticles; register fields `grid-cols-1 sm:grid-cols-2`; password-strength checklist; referral field; success overlay; shake-on-error.
- **Data:** `POST /auth/login|register`.
- **States:** good coverage; **missing** "already logged in → redirect" guard; server errors only via toast.
- **Responsive:** no fixed widths; checklist `grid-cols-2` tight at 320px 🔶; inputs `py-2.5` ~40px touch target 🔶.
- **A11y:** **no h1** (main heading is h2 at `:188`) ✅; Input label no `htmlFor` (Input.tsx:25-29) though `id="email-address"`/`id="password"` exist but unlinked ✅; show/hide button has aria-label ✅.
- **Dead file:** `RegisterPage.tsx` never imported ✅.

### Screen: Forgot Password / Reset Password
- **Public** · `max-w-md` cards, blur blobs, single CTA.
- **Forgot:** success state **renders the dev-mode `resetUrl` on the page** (`:76-91`) — potential live-token leak 🔶; `<Link>` wrapping `<Button>` (button-in-anchor, `:93-97`) ✅; no h1 ✅.
- **Reset:** live complexity audit, `disabled={!token}`, mismatch error; **no show/hide toggle** (unlike login) ✅; no h1 ✅; button-in-anchor (`:108-112`) ✅.

### Screen: Verify
- **Public** · two flows (`id`/`credentialId` and `token`) via `window.location.search` (static per render — not `useSearchParams`) ✅.
- **Data:** `GET /certificate/verify/:id`, `GET /courses/:id/public`, `GET /auth/verify?token=`; nested course fetch failure silently skipped ✅.
- **States:** loading/success/**pending (issue #101)**/error all present ✅.
- **A11y:** **the only page with a correct `label htmlFor`** (`:181,186`) ✅; email branch no h1 ✅.
- **Bugs:** "Proceed to Login" → `navigate('/')` (`:131`); "Back to Registration" → `navigate('/')` (`:155`) — both misnavigate ✅.

### Screen: Dashboard
- **Route** `/dashboard` · **Auth**.
- **Layout** (`Dashboard.tsx:218-677`): welcome header (h1 + chips + pills) → tab bar (`overflow-x-auto`) → stat cards `grid-cols-2 lg:grid-cols-4` → Continue banner → Daily Challenge + Skill Matrix (`lg:grid-cols-5`) → Milestone submissions (`1/2/4`) → Courses grid (`1/2/4`) → Leaderboard tab → Referrals tab (dark-only panels).
- **Data:** `GET /courses` (useCourses), `GET /practice/daily`, `POST /practice/daily/submit`, `GET /practice/leaderboard`. **`useCourses.error` never rendered** — network failure surfaces as empty state ✅.
- **States:** loading skeleton (with `role="status"` ✅), empty courses + refresh, daily error box, daily solved. **Missing:** daily-section loading skeleton → layout shift when skill matrix re-flows (`:424`) ✅.
- **Responsive:** stat labels `truncate`d at `:321/323` (2×2 grid = ~160px cells at 375px) ✅. **Dead tokens in dark mode:** `border-slate-850` (`:558,578,610,643,659`) — referral tab borders fall back to `currentColor` (bright) ✅.
- **Hierarchy:** strong primary (Resume/Get Started indigo button `:364-370`); **dead "Submit Now" button** on milestone cards (`ProjectStatusCard.tsx:67` — no `onClick`) ✅ = a dead end + focus hazard.
- **A11y:** tabs no `aria-selected`/`role=tab` ✅; daily options no `aria-pressed` ✅; CourseCard whole-card `div onClick` not keyboard-accessible ✅; **toasts (`z-50`) are occluded by the support FAB (`z-[9999]`)** ✅.

### Screen: CourseDetail
- **Route** `/course/:id` · **Auth** · the learning core (1,587 lines).
- **Layout** (`CourseDetail.tsx:537-1587`): CourseHero → (course-home) hero card → split `flex-col md:flex-row` [sidebar `w-full md:w-1/4 lg:w-1/3` = SyllabusManager/ProgressMap + content `flex-1 min-w-0`] → EnrollmentPanel → doubts drawer (`fixed inset-y-0 right-0 z-50 w-full max-w-md`) → lightbox → PeerSolutionsModal.
- **Data:** 5 GETs on mount — `GET /courses`, `GET /payments/status/:id`, `GET /courses/:id/module/:week`, `GET /assignments/status/:id`, `GET /projects/status/:id` — sequentially, `useCourseDetail.ts:19-70`; forum CRUD; assignment/project submit + privacy; `localStorage` `last_viewed_week_<courseId>`.
- **States:** full-page spinner ("Decrypting…" `:521`), module skeleton, chapter verified/current/locked, topic locked/passed, submissions spinner + per-week status, doubts loading/empty/list, peer modal loading/error/empty. **Missing:** module fetch failure → silent empty topic grid (`useCourseDetail.ts:64`) ✅; **no h1** ✅; `checkingPayment` no indicator (panel pops in) ✅; empty `weeks` → `continueIdx=-1` 🔶.
- **Responsive:** sidebar **grows** at lg (`md:w-1/4 lg:w-1/3`) leaving content narrow; at `md` (768-1023) sidebar ≈185px with `md:truncate` chapter titles ✅; mobile list/content toggle via `mobileView` ✅. **Dead tokens:** `border-slate-850` (11×: 622-1411), `bg-slate-850` (:1210), `bg-slate-905` (:1385-1386 — **doubt-loading shimmer invisible**), `text-slate-455` (:1077), `placeholder-slate-655` (:1525), `text-blue-450` (:1510), `hover:bg-slate-750` (:923) ✅. Markdown tables have **no overflow rule** (content pane `overflow-hidden`) 🔶. `window.scrollTo({behavior:'instant'})` non-standard 🔶.
- **Hierarchy:** course-home CTA strong; module-home quiz action **buried at bottom** of 6+ stacked sections ✅; topic-reader "Start Topic Quiz" (amber pulse) vs "Next Topic" (cyan) — two competing primaries, Next disabled-looking (`opacity-60`) when quiz required 🔶.
- **A11y:** no h1; chapter rows + topic cards = `div onClick` no role/tabIndex (`:644,779`) ✅; doubts drawer no `role=dialog`/focus trap, post-doubt textarea placeholder-only ✅; lightbox close no aria-label + no Esc ✅; `text-slate-550/650` at 10-11px contrast risk ✅.
- **Hardcoded denominator inconsistency:** project tab shows `{currentWeek}/20 Chapters` (`:1241,1244`) while CourseCard badge is `Week x/4` (`CourseCard.tsx:146`) and the API returns `weeks.length` (4-8) and config says 6-8 ✅.

### Screen: Quiz
- **Route** `/quiz/:courseId/:week[/:topicId]` · **Auth** · 5-min timer.
- **Layout** (`Quiz.tsx:160-244`): QuizHeader (Cancel + timer pill) → progress → QuizQuestion (`min-h-[320px]`) → Prev/Next/Submit footer.
- **Data:** `GET /quiz/questions/...` (useQuiz), `POST /quiz/submit`; auto-submit at 0:00 via ref ✅.
- **States:** loading, "Access Blocked" error, ExamResultsModal (confetti on pass). **CRITICAL: zero-question quiz renders `null` → blank page** (`:157`) ✅. **Missing:** no confirm on Cancel/back (answers discarded silently) ✅; **Submit button only on last question — can't submit early without clicking through** (`:205`) ✅.
- **Responsive:** `max-w-2xl`, no breakpoints; fine to 320px 🔶.
- **A11y:** radio+label+name ✅; **no page heading at all** ✅; modal no dialog semantics.

### Screen: PracticeArena
- **Route** `/practice/arena` · **Auth** · adaptive MCQ + coding templates, 15-min timer.
- **Layout** (`PracticeArena.tsx:283-674`): breadcrumb+timer → h1 header → mode pill → MCQ `grid-cols-1 lg:grid-cols-4` (5-col navigator + question) or Coding (CodePlayground) → results breakdown.
- **Data:** `GET /practice/questions?category=`, `POST /practice/submit`, `POST /sandbox/run`; static `codingTemplates` (C/C++/IoT).
- **States:** loading skeleton, empty/fetch-error (Retry gated on `fetchError` — **no retry path when fetch returns `[]`** ✅), results, submitting-disabled. **CRITICAL: timer keeps running in coding mode** (countdown effect has no `mode` dep) → auto-submits MCQ with zero answers while student is mid-code ✅; **timeout+failed-submit → infinite re-submit loop** firing `POST /practice/submit` repeatedly with "Time is up!" toasts (`:151-165`) ✅.
- **Responsive:** navigator `grid-cols-5` of `w-10 h-10` = 40px touch targets ✅; CodePlayground output pane no `overflow-x` ✅; **dead tokens:** `dark:hover:bg-slate-750` (`:597`), `dark:border-slate-850` (~10×) → **light `border-slate-200` borders visible on dark cards** ✅.
- **A11y:** h1/h2/h3 hierarchy good ✅; option buttons no `aria-pressed`/radio semantics ✅.

### Screen: PayPage
- **Route** `/pay/:courseId` · **Auth** · UPI checkout.
- **Layout** (`PayPage.tsx:277-459`): single `max-w-md bg-white` light card (theme-independent) — gradient header, amount block, QR section, "Pay by Any UPI App", UPI ID+copy, coupon, "How to Pay" list, submit.
- **Data:** `GET /payments/status/:courseId`, `POST /payments/create-order`, `POST /payments/verify`; `VITE_UPI_ID`/`VITE_UPI_PAYEE` (fallback payee "EDUNEXUS PRO" ≠ `.env.example` "Anjali Singh") ✅.
- **Coupon/pricing (FE) — duplicated with backend:** `BASE_PRICE=699` (`:26`), `SAVI10`→0.1, `AVI050`→0.5, `AVI030`→0.3, `NEXUS499|EDU499|SPECIAL499`→`200/699`, referral 0.5, `Math.max` combine, `Math.round(699*(1-d))` (`:62-65,95-105`) — **all hand-duplicated in `backend/src/services/paymentService.ts`** (`:63,75-101`), and **the FE lacks the backend's 50% coupon cap** (`paymentService.ts:94`) ✅. The `amount` FE sends is ignored by the backend (recomputed from `course.price`) → any price drift shows one price, orders at another ✅. `currentPrice===0` "Claim Free Certificate" branch is **dead** (max discount 50% → ₹350 floor) ✅.
- **States:** checking/isPaid/submitted-awaiting-admin/processing/errors/copied all present. **Missing:** `FAILED` payment status has no UI branch ✅; initial status fetch failure swallowed silently ✅.
- **Responsive:** **QR overflows its padded card ≤~340px** (fixed `size={190}` + `p-4` box vs 320-32-48-48=192px inner) clipped by card `overflow-hidden` (`:278,328-330`) ✅; no breakpoints.
- **A11y:** back/copy buttons have aria-labels ✅; UPI label no `htmlFor` (`:359-363`), coupon input no label (`:378-383`) ✅; `text-slate-400` at `text-[11px]` ≈2.6:1 contrast ✅.

### Screen: Certificate (HARD NO-TOUCH — issues documented for awareness only)
- **Route** `/certificate?courseId&userId` · **Auth** · A4-landscape branded certificate.
- **Layout** (`Certificate.tsx:99-491`): inline `<style>` (`:101-377`) defines scoped CSS — `.certificate-container` (`aspect-ratio:297/210`, `padding:55px 65px`, `border:8px solid #b392ac`, radial-gradient `#0a1128→#020617`), Cinzel gold `#d4af37`, QR 70×70, signature block, `@media print` `@page size: A4 landscape; margin:0`, hides nav/buttons, `print-color-adjust:exact`.
- **Data:** `GET /certificate/:courseId` / `:userId/:courseId`; admin preview uses viewer identity or `'—'` (privacy fix `:70-83`).
- **States:** loading/error/access-blocked/admin-fallback/PENDING vs VERIFIED badges (`#4ade80`/`#fbbf24`) ✅. Backend 402 `paymentRequired` collapses into generic "Access Blocked" ✅.
- **Responsive:** **zero breakpoints**; fixed-px interior metrics (`padding:55px 65px`, 40px name, 220px signature) with `overflow:hidden` → content clips at mobile widths; page itself warns "Mobile download is not supported" ✅. Print path robust for desktop.
- **A11y:** images have alt; QR value is text credential ID too ✅. `@import` Google Fonts render-blocking 🔶.
- **Brand hexes bypass palette:** `#d4af37`, `#b392ac`, `#0a1128` ✅.

### Screen: AdminDashboard
Deep audit in §15. One-line summary: **one 2,649-line component, 8 tabs, ~48 `useState`, 5 bespoke modals, duplicated tables, hardcoded Analytics, tables without min-width, dead dark-mode tokens, 3 toast-severity bugs** ✅.

### Screen: About / Contact / Terms / Privacy / Refund / NotFound
- **About** — static, h1-h2-h3 ordered ✅, single CTA ✅.
- **Contact** — `md:grid-cols-5` (info 2 / form 3); `safeWebsiteUrl` scheme guard prevents `javascript:` injection ✅; **4 labels with no `htmlFor`/id** ✅; **light-mode contrast bugs**: `text-slate-250` (`:153`), `text-indigo-450` (`:124`), `text-indigo-405` (`:179`), `text-emerald-450` (`:175`) not in `.light` overrides → near-invisible on white ✅; default phone `+91 99999 99999` shown as real when settings fail ✅.
- **Terms/Privacy/Refund** — static, headings ordered; **Privacy body `text-slate-355` (`:41,57,74…`) not in `.light` overrides → unreadable body text in light mode** ✅.
- **NotFound** — **light-first** (`dark:` variants) while marketing pages are **dark-first** (CSS-hack) → inconsistent theming strategy ✅; h1 contains only "404" 🔶.

---

## 4. Responsive Audit

**Global:** `xl:` and `2xl:` are **never used anywhere** ✅. `html, body { overflow-x: clip }` (`index.css:85-88`) masks overflow globally. App wrapper + every page double-pads horizontally (`App.tsx:49` + each root). **Zero breakpoints** in `Certificate.tsx`, `Quiz.tsx`, `PayPage.tsx`, `RegisterPage.tsx`, `CourseCard.tsx`, `AdminPaymentTable.tsx`, `ExamResultsModal.tsx`, `PeerSolutionsModal.tsx`, `SkillRadar.tsx`, `Input.tsx`, `Card.tsx` ✅.

| Screen | Breakpoint | Problem | Severity | Evidence/Location |
|---|---|---|---|---|
| Certificate | 375/320 | Fixed-px A4 interior clips inside scaled `aspect-ratio` box; no breakpoints | HIGH (no-touch; documented limitation) | `Certificate.tsx:109-121`, page warns at `:474` |
| Certificate | all | `@media print` reliability on mobile browsers | MEDIUM | `:308-376` |
| PayPage | ≤~340 | QR box (222px) overflows padded card (192px), clipped by `overflow-hidden` | MEDIUM | `PayPage.tsx:278,328-330` |
| Quiz | 375 | Zero-question quiz renders blank page (not strictly responsive, but worst at small screens) | CRITICAL | `Quiz.tsx:157` |
| PracticeArena | 375 | Navigator buttons `w-10 h-10` = 40px touch targets | LOW | `PracticeArena.tsx:435` |
| PracticeArena | all | Output pane has no overflow/break → long stdout clipped | MEDIUM | `CodePlayground.tsx:133-171` |
| PracticeArena | dark | `dark:border-slate-850` resolves to light `border-slate-200` on dark cards | MEDIUM | `PracticeArena.tsx:188,358-519` |
| Dashboard | 375 | Stat labels truncated in 2×2 grid (~160px cells) | LOW | `Dashboard.tsx:321/323` |
| Dashboard | 375 | Daily section missing while loading → layout shift | LOW | `Dashboard.tsx:424` |
| CourseDetail | 768-1023 | Sidebar 25% (~185px), chapter titles `md:truncate` | MEDIUM | `CourseDetail.tsx:586`, `SyllabusManager.tsx:176` |
| CourseDetail | dark | `border-slate-850`(11×) → bright `currentColor` borders | MEDIUM | `CourseDetail.tsx:622-1411` |
| CourseDetail | dark | `bg-slate-905` doubt-loading shimmer invisible | MEDIUM | `CourseDetail.tsx:1385-1386` |
| CourseDetail | 375 | Markdown tables clipped (no `[&_table]` overflow rule) | LOW | `CourseDetail.tsx:1021` |
| Home | <1024 | Hero card `hidden lg:block` — no hero visual on tablet/mobile | MEDIUM | `Home.tsx:822` |
| Home | all | Double horizontal padding | LOW | `App.tsx:49` + `Home.tsx:699` |
| AdminDashboard | 375 | Users/transactions/messages/referrals tables: 7-8 cols, **no min-width** → unreadable | HIGH | `AdminDashboard.tsx:1364,1686,1990`, `AdminPaymentTable.tsx:160` |
| AdminDashboard | ≤480 | CMS module-accordion header button cluster clipped by `overflow-x: clip` (no wrap) | HIGH | `AdminDashboard.tsx:1205-1227` |
| AdminDashboard | ≤480 | Payment action cell (3 non-wrapping buttons) overflows column | MEDIUM | `AdminPaymentTable.tsx:197-263` |
| AdminDashboard | 375 | Review table `min-w-[680px]` → forced horizontal scroll (usable, clunky) | MEDIUM | `AdminDashboard.tsx:884-885` |
| AdminDashboard | 375 | Tab bar `whitespace-nowrap` + scroll | LOW | `AdminDashboard.tsx:761-780` |
| Login/Reset | 320 | 2-col password checklist tight | LOW | `LoginPage.tsx:319`, `ResetPassword.tsx:146` |
| Navbar | 320-1440 | **Fully correct responsive split** (reference) | — | `Navbar.tsx:108/233/246` |
| All pages | global | Toasts (`z-50`) occluded by FAB (`z-[9999]`); FAB floats over modals | MEDIUM | `UIContext.tsx:91`, `FloatingSupportWidget.tsx:9` |

**Severity counts:** CRITICAL 1 · HIGH 4 · MEDIUM 11 · LOW 6.

---

## 5. Design System Audit

### Colors
- **Named tokens in `index.css` `@theme` (14-50):** `light-bg/surface/border` (#F6F8FB/#FFFFFF/#E6EAF2), `primary` #6366F1, `primary-hover` #4F46E5, `success` #10B981, `streak` #F59E0B, `dark-bg` #0A0F1E, `dark-surface` #0F1629, `dark-border` #1E293B, `cyan-accent` #22D3EE, `success-dark` #34D399, `streak-dark` #FBBF24, plus shade registrations `slate-250/350/355/450/550/650`, `amber-450`, `emerald-450`, `indigo-450/405`.
- **ALL 12 semantic `light-*`/`dark-*` tokens are dead — never consumed** (components use raw `slate-*`/`blue-*`/`cyan-*`) ✅ (`index.css:12-13` comment admits "Screens consume these in Phase 3/4").
- **~28 hardcoded hexes** in components/pages; direct duplicates of existing tokens: `#10b981` (≈success), `#f59e0b` (≈streak), `#22d3ee` (≈cyan-accent), `#1e293b` (≈dark-border), `#0F1629` (≈dark-surface) ✅. Non-palette brand hexes: `#d4af37` gold (Certificate), `#b392ac` (Certificate border), `#0a1128` (Certificate bg), `#25D366/#229ED9/#0A66C2` social (FloatingSupportWidget), `#29aae2` (Home Telegram CTA), `#0F1629→#101D33` arbitrary gradient duplicated instead of token (`CourseDetail.tsx:552`).
- **Theme mechanism:** `@custom-variant dark` class-based (`index.css:8`); default **dark**; the **`.light` override chain (`index.css:90-342`)** is a legacy `!important` system that flips dark classes to light — it only partially covers custom shades. `:root { color-scheme: dark }` is unconditional (`:52`) → light-mode scrollbars/autofill stay dark 🔶.
- **Light-mode-only colors:** `.light` blocks hardcode ~23 hexes (#f1f5f9… #fca5a5) with no dark-side counterpart; `--color-*-dark` tokens are dark-only declarations, never referenced ✅.

### Typography
- **Lato loaded in `index.html:11`, never applied** (no `font-family: Lato` anywhere) ✅. **Inter declared as `--font-sans` (`index.css:15`), never loaded** → body falls back to system-ui ✅. JetBrains Mono loaded and used (`font-mono` ×72) but also used for **non-code UI chrome** (transaction IDs, XP, UPI ID) ✅. Certificate self-loads Montserrat/Cinzel (`:102`).
- **Sizes:** `text-xs` ×47, `text-sm` ×31, `text-lg/xl/2xl/3xl` few; **arbitrary `text-[11px]` ×369** app-wide; `text-[10px]` ×6, `text-[10.5px]` ×2, `text-[8.5px]` ×1 (CourseDetail:1447) ✅.
- **Weights:** `font-black` ×308, `font-bold` ×292 dominate; `uppercase` near-universal on labels/buttons.
- **No consistent heading scale** — headings jump text-3xl→text-sm across components (ExamResultsModal 3xl vs AdminPaymentTable text-base vs ConfirmDialog text-sm) ✅.

### Spacing
- Literal Tailwind spacing on a 4px grid — no `--spacing` tokens. Dominant: `px-4` ×41, `p-2` ×37, `p-3` ×31, `p-4` ×27, `gap-2` ×30, `gap-3` ×24. Consistent rhythm; page→page spacing differs (`py-8` vs `py-12` roots).

### Border Radius
- Counts: `rounded-xl` ×187, `rounded-full` ×107, `rounded-2xl` ×97, `rounded-lg` ×84, `rounded-3xl` ×14, `rounded-md` ×6. **No arbitrary `rounded-[Npx]`** ✅. **Language clash:** buttons `rounded-xl` (Button.tsx:24) vs modals/cards `rounded-2xl`; same "button" is `rounded-xl`/`rounded-lg`/`rounded-2xl` in different places ✅.

### Shadows
- `shadow-lg` ×16 (Card always-on, no opt-out `Card.tsx:18`), `shadow-2xl/xl/md/sm` few; some cards (Verify:179, LeaderboardTab empty state) use inline divs with **no shadow** — inconsistent with Card's always-on shadow 🔶; 5 arbitrary `shadow-[rgba…]`.

### Icons
- **lucide-react exclusively** (35 files). 11 distinct sizes (14/16/18 dominant; spread 11-60, QR 190). Inconsistent micro-sizing within a component (Navbar nav 14 vs drawer 18). One hand-rolled LinkedIn SVG (FloatingSupportWidget:61-76). Chart SVGs (radar/rings/blueprints) are hand-authored.

---

## 6. Component Consistency Audit

| Pattern | Variations Found | Locations | Recommended future consolidation |
|---|---|---|---|
| Buttons | Shared `Button` (6 variants) **plus** ~12 inline button class-blobs re-implementing variants; `rounded-xl` vs `rounded-lg` vs `rounded-2xl` | `Button.tsx` vs `Certificate.tsx:482`, `CourseDetail.tsx:1530`, `Dashboard.tsx:366/500`, `PracticeArena.tsx:261/528/591`, `Verify.tsx:196`, `PayPage.tsx:339` | Single Button; kill inline blobs |
| Cards | Shared `Card` **plus** inline `rounded-2xl border bg-slate-900/…` divs (some without Card's shadow) | `About.tsx:59-89` (4×), `CourseDetail.tsx:1267`, `Verify.tsx:179`, `AdminDashboard.tsx:2289` | Single Card; decide shadow policy |
| Modals | ConfirmDialog (a11y-complete-ish) **plus** 5 admin modals + Home syllabus modal + ExamResults/PeerSolutions + doubts drawer + lightbox — 9+ bespoke overlays, only ConfirmDialog has dialog semantics | `AdminDashboard.tsx:1525/2197/2373/2462/2562`, `Home.tsx:1273`, `ExamResultsModal.tsx`, `PeerSolutionsModal.tsx`, `CourseDetail.tsx:1346/1548` | One `Modal` primitive (focus trap + scroll lock + Esc + aria) |
| Inputs | Shared `Input` + `FormField` (1:1 dup) **plus** inline inputs with identical styling | `Verify.tsx:185`, `PayPage.tsx:378`, `AdminDashboard.tsx:1551/2289/2487/2501/2514/2600/2613`, `Contact.tsx` | One FormField; labels bound via htmlFor/id |
| Tables | 6 hand-rolled admin/student tables, near-identical thead + `overflow-x-auto` + badge logic; only Review has min-width | `AdminDashboard.tsx:884/1364/1685/1989/2098`, `AdminPaymentTable.tsx:160`, `LeaderboardTab.tsx:138` | One `AdminTable` (wrapper + sortable headers + min-w) |
| Status badges | `statusConfig` map (AdminPaymentTable:26-58) vs inline color ternaries elsewhere | AdminPaymentTable vs review/user/referral rows | One `StatusBadge` |
| Course badges | Same IIFE **duplicated verbatim** in users tab and referrals sub-table | `AdminDashboard.tsx:1405-1460` and `:2119-2168` | One `CourseBadges` component |
| Headings | No shared heading; text-3xl→text-sm per component | across all components | Type scale tokens |
| Loading | Spinner + Skeleton + inline spinners (App.tsx:53, CodePlayground:112) + text fallbacks | — | Unify; add `role="status"` at call sites |
| Errors | Inline per-page `err.response?.data?.message` blocks; no shared component | across pages | Shared `ErrorMessage` |
| Toast severity | 3 admin error paths call `addToast(msg,'success')` | `AdminDashboard.tsx:189/595/683` | Fix severity; add icon/aria |

---

## 7. UX Flow Audit

| # | Flow | Steps | Findings |
|---|---|---|---|
| 1 | Landing → Register → Login | Home hero → inline form OR /login → submit → toast → /dashboard | Inline form is a **weaker duplicate** of LoginPage (no password checklist/show-hide/referral/forgot link); "Enroll Now" scrolls to a login card ✅ |
| 2 | Login → Dashboard | /login → POST → success overlay → navigate | Overlay delays 1.5s (nice); no "already logged in" redirect; no 401 handling → expired token shows generic errors 🔶 |
| 3 | Dashboard → Course → Module → Topic | Card click → /course/:id → course-home → chapter → module-home → topic → reader | **Every CourseDetail mount resets to course-home** (viewState `:209`) — never restores last module/topic; 5 sequential GETs re-fire on every return ✅ |
| 4 | Topic → Quiz → Progress | Start Topic Quiz → /quiz → submit → modal → Return to Course | **Blank page if quiz has 0 questions** ✅; no confirm on Cancel; can't submit early (Submit only on last question) ✅; Return re-fetches everything (nested loading) ✅ |
| 5 | Course → Enrollment → Payment | EnrollmentPanel → /pay/:id → coupon → UPI → submit | FE price ≠ BE price on drift (amount ignored) ✅; `FAILED` payment has no UI ✅; QR overflows ≤340px ✅ |
| 6 | Payment → Verification → Access | admin VERIFY → status reflects | No student-facing "admin verified" notification; PayPage resume-from-PENDING works ✅ |
| 7 | Practice → Challenge → Result | Arena MCQ → confirm → results | **Timer runs during coding mode** → auto-submits empty MCQ ✅; **timeout+error → infinite auto-submit loop** ✅ |
| 8 | Assignment submission | CourseDetail project tab → filename → submit → PENDING | **Dashboard "Submit Now" is a dead button** (no onClick) ✅; no enrollment check on submit 🔶 (Phase 1) |
| 9 | Project submission | same | file URLs only; fabricated mock paths 🔶 |
| 10 | Forum interaction | doubts drawer → post/reply | Drawer no dialog semantics; post textarea unlabeled; enrollment-gated backend ✅ |
| 11 | Course completion → Certificate | complete + VERIFIED → /certificate | Backend 402 → generic "Access Blocked" (no pay CTA) ✅ |
| 12 | Certificate → Public verify | /verify?id → result | **Buttons misnavigate** ("Proceed to Login"→'/') ✅; PENDING state present ✅ |
| 13 | Admin login → Dashboard | /login (ADMIN) → Navbar Admin link → /admin | AdminRoute redirects to /dashboard ✅ |
| 14 | Admin → management | 8 tabs | All data fetched on mount (7 groups), **no per-tab refetch** → stale counts; no search on users/payments/messages; no pagination anywhere ✅ |

**Dead ends / feedback gaps:** quiz blank page · CourseDetail empty `weeks` → broken module-home 🔶 · module fetch failure → silent empty grid ✅ · Practice timeout loop ✅ · ProjectStatusCard dead button ✅ · daily-challenge already-solved has no toast ✅ · "Next Module" disabled with no reason 🔶.

---

## 8. Accessibility Audit

| Severity | Issue | Evidence |
|---|---|---|
| CRITICAL | Quiz with zero questions → blank page (SR and sighted both stuck) | `Quiz.tsx:157` |
| HIGH | Label↔input association broken app-wide — only **one** `htmlFor` in all of `pages/` (Verify.tsx:181); Input/FormField/Contact/admin/CMS/legal forms all unassociated | `Input.tsx:25-29`, `Contact.tsx:200-250`, admin modals |
| HIGH | No `h1` on LoginPage/Forgot/Reset/Verify-email-branch/CourseDetail/Quiz | `LoginPage.tsx:188`, `CourseDetail.tsx` (none), `Quiz.tsx` |
| HIGH | Clickable `div`s not keyboard-accessible: Card, CourseCard, topic cards, chapter rows | `Card.tsx:30`, `CourseCard.tsx:133`, `CourseDetail.tsx:644/779` |
| HIGH | 8+ modals/drawers lack `role=dialog`/`aria-modal`/focus trap/scroll-lock/focus restore (ConfirmDialog has role+Escape but no trap) | `ExamResultsModal.tsx`, `PeerSolutionsModal.tsx`, `AdminDashboard.tsx` modals, `CourseDetail.tsx:1337/1541`, `Home.tsx:1273` |
| HIGH | Toasts never announced (`no aria-live`/`role=status`), color-only severity, `×` unlabeled | `UIContext.tsx:91-106` |
| HIGH | **160 buttons without `type`** (AdminDashboard 42, CourseDetail 25, PracticeArena 13…) → inside forms they default to submit | across pages |
| MEDIUM | 369× `text-[11px]` + `text-[10px]` on `text-slate-400/450/500/550/650` → contrast ≈2.6-4.5:1, below WCAG AA for small text | PayPage, CourseDetail, AdminDashboard, Verify |
| MEDIUM | Unlabeled icon buttons in admin CMS (edit/delete/reorder) | `AdminDashboard.tsx:1262-1287,1317-1329` |
| MEDIUM | Nested interactive elements: module accordion `role="button"` div containing real `<button>`s | `AdminDashboard.tsx:1182-1225` |
| MEDIUM | Sortable `<th>` not keyboard-accessible (no role/tabIndex/aria-sort) | `AdminDashboard.tsx:1368-1382` |
| MEDIUM | `<Link>` wrapping `<Button>` (button-in-anchor, invalid HTML) | `ForgotPasswordPage.tsx:93-97`, `ResetPassword.tsx:108-112`, `Navbar.tsx:218-226/330-335` |
| MEDIUM | SkillRadar SVG no accessible name; ProgressMap good (has aria-label) | `SkillRadar.tsx:42` |
| MEDIUM | Light-mode contrast bugs: Privacy `text-slate-355`, Contact `text-slate-250`/`indigo-450/405`/`emerald-450` not overridden → unreadable on white | `Privacy.tsx:41…`, `Contact.tsx:124/153/175/179` |
| MEDIUM | Tabs: Dashboard/Admin use `aria-pressed` only (no tablist/tab); Dashboard no aria-selected | `Dashboard.tsx:271-303`, `AdminDashboard.tsx:785` |
| MEDIUM | Heading-order violation on Home (h3 before h2) | `Home.tsx:837 vs 872` |
| MEDIUM | Dead a11y tokens: `ProjectStatusCard` dead button is a focus hazard; `focus:outline-none` on Home accordion kills focus ring | `ProjectStatusCard.tsx:67`, `Home.tsx:1321` |
| LOW | FormField/Input error not `aria-invalid`/`aria-describedby`; decorative icons not aria-hidden | `Input.tsx:32,49,55` |
| LOW | Verify reads `window.location.search` (no `useSearchParams`); images (214KB logo, 92KB signature) no alt issues but no lazy | `Verify.tsx:9-10` |
| LOW | QuizHeader timer no `role="timer"`/`aria-live`; QuizResults not aria-live | `QuizHeader.tsx:20-29` |
| LOW | NotFound h1 = "404" only | `NotFound.tsx:27` |
| LOW | `prefers-reduced-motion` **absent** app-wide | grep zero ✅ |

**Best-practice islands worth preserving:** Navbar `aria-expanded/aria-haspopup/role=menu` + Escape; ConfirmDialog `role=dialog/aria-modal/aria-label`; Spinner `role=status`; Skeleton `aria-hidden`; ProgressMap node buttons; QuizQuestion radio+label+name; Contact `safeWebsiteUrl` scheme guard; global `:focus-visible` ring (`index.css:60-68`).

---

## 9. Mobile-First UX Audit

- **What works:** Navbar responsive split (drawer + dropdown) ✅; all 8 tables scroll horizontally ✅; modals use `max-w` + `p-4` + inner scroll (readable, though "zoomed desktop card" not bottom-sheet) ✅; CourseDetail mobile list/content toggle ✅; Forms in single-column are OK; toasts readable when not under the FAB.
- **What breaks:** Certificate (fixed-px A4) ✅; Home hero absent <1024 ✅; Quiz blank-on-empty ✅; Practice timeout loop (worse on mobile where tab switches/timeouts common) ✅; PayPage QR ≤340px ✅.
- **Feels desktop-first:** the whole design is **dark-first desktop-first** — marketing pages built on CSS-hack overrides; `text-[11px]` micro-typography everywhere; 40px touch targets (Practice navigator) below the 44px guideline; stat cards truncate; `grid-cols-2` password checklists.
- **Need structural (not CSS) changes:** Admin tables (users/transactions/messages) need card/row-switch representations, not narrower tables ✅; CMS module-accordion header needs a re-flow (buttons clipped) ✅; Certificate needs a genuine mobile layout (but is NO-TOUCH) ; Home hero needs a mobile-safe visual.
- **Admin unusable on phone:** User Management (8-col, no search) ✅; Payment Audits action cluster ✅; CMS accordion header ✅. Usable-but-clunky: Review (min-w scroll) ✅; Referrals (search + scroll) ✅.

---

## 10. Visual Hierarchy Audit

| Screen | Primary action | Secondary | Hierarchy quality |
|---|---|---|---|
| Home | "Start Learning Now" (amber) | Telegram CTA (brand blue, bold) | **Weak** — Telegram competes visually; two equal-weight buttons per card; "Enroll Now" → login form ✅ |
| Login | "Sign In Now" full-width amber | Forgot/switch links | Good |
| Dashboard | Resume/Get Started (indigo) | Daily challenge options | Good; milestone "Submit Now" dead button = broken CTA ✅ |
| CourseDetail course-home | "Start/Continue Curriculum" full-width | — | Good |
| CourseDetail module-home | Quiz unlock (bottom, disabled until checkbox) | — | **Weak** — quiz action buried under 6+ sections ✅ |
| CourseDetail topic-reader | "Start Topic Quiz" (amber pulse) vs "Next Topic" (cyan, opacity-60) | — | Two competing primaries; confusing when Next looks disabled 🔶 |
| Quiz | Submit (amber accent) | Prev/Next | Good; early-submit impossible ✅ |
| Practice | Submit (emerald) | Prev/Next navigator | Good; coding mode has no submit (Run only) |
| PayPage | Pay / Claim (full-width gradient) | Copy UPI, "How to Pay" | Good; micro-labels crowd the amount/QR ✅ |
| Verify | Verify Credential (amber) | Verify another / Try again | Good; button labels lie (→'/') ✅ |
| Admin | per-tab action buttons | Reload Data | Dense, mixed; analytics is fake ✅ |
| Certificate | Print/Export | Return to Console | Good (no-touch) |

---

## 11. UI Density Audit

| Screen | Class | Why |
|---|---|---|
| Dashboard | **Dense** | 4 pill rows + badges in header; stat cards truncate; referral tab two progress tiers |
| CourseDetail module-home | **Dense** | 6+ stacked callout blocks (topics, simulator, anti-patterns, blueprint, verification) |
| CourseDetail topic-reader | Balanced | single reading column |
| Quiz | **Balanced/too sparse** | single question per screen; blank on empty |
| Practice MCQ | Balanced | clean question card, compact navigator; results breakdown dense but structured |
| PayPage | Dense | many `text-[10/11px]` labels + amount + QR + coupon + 4-step list |
| Home | **Too dense** | ~1,380 lines, 7 stacked decorative sections, infinite animation |
| AdminDashboard | **Too dense** | 8 tabs, 7-8-col tables, no pagination |
| Admin CMS editor | Dense | two-pane WYSIWYG with many fields |
| Certificate | Balanced | fixed formal layout (no-touch) |
| Legal/About/Contact | Balanced | single-column, comfortable |

---

## 12. States Audit

| Feature | Loading | Empty | Error | Success | Disabled | Unauthorized | Not found | Offline/network | Partial data |
|---|---|---|---|---|---|---|---|---|---|
| Courses (Home/Dashboard) | ✅ (Dashboard) / ❌ (Home) | ✅ Dashboard, ❌ Home | ❌ (silent fallback Home; Dashboard never renders `useCourses.error`) | ✅ | — | ✅ guard | — | ❌ | ❌ |
| CourseDetail | ✅ | ✅ (misleading: silent empty on fetch fail) | ❌ (swallowed → empty) | ✅ | ✅ | ✅ guard | — | ❌ | ❌ |
| Quiz | ✅ | **❌ blank page** | ✅ "Access Blocked" | ✅ modal | ✅ | ✅ guard | — | ❌ | ❌ |
| Practice | ✅ | ✅ (no retry when `[]`) | ✅ (Retry on fetchError) | ✅ results | ✅ submit | ✅ guard | — | ❌ | ❌ |
| PayPage | ✅ | — | ✅ | ✅ | ✅ processing | ✅ guard | — | ❌ (initial status fail swallowed) | ❌ (no FAILED state) |
| Certificate | ✅ | ✅ fallback | ✅ Access Blocked | ✅ | — | ✅ (non-admin block) | — | ❌ | ✅ (admin `'—'`) |
| Admin (per tab) | ✅ (some) | ✅ (some) | ❌ (console-only) | ✅ | ✅ buttons | ✅ AdminRoute | — | ❌ | ❌ (Analytics fake) |
| Forum (drawer) | ✅ | ✅ | ❌ | ✅ | — | ✅ guard | — | ❌ | ❌ |

**Systemic misses:** offline/network states never handled; partial-data states rare; several fetch failures silently surface as empty.

---

## 13. Performance-Related UI Audit

- **Eager heavy pages:** Home (1,383 lines + ~460 lines inline static curriculum + `config/courses.ts` + `config/projects.ts`) and LoginPage are in the initial bundle ✅.
- **framer-motion is in every route's bundle** (Navbar statically imports it) — even static Terms/Privacy pay for it ✅.
- **LoginPage mounts a full-screen `<canvas>` particle network** (rAF loop, 75 particles, O(n²) connection lines, window mousemove listener) for the whole session ✅.
- **Home runs infinite ambient animation** (7 spinning icons `repeat: Infinity`, 3 mesh-gradient blobs) + scroll-progress ✅.
- **Images:** only ~5 `<img>` tags; **none have width/height or `loading="lazy"`** — `/logo.png` is **214 KB** on every route; `/Vinayak_sign…png` 92 KB; `public/edunexus_banner.png` (787 KB) and `src/assets/hero.png` are **never referenced** but ship ✅.
- **No `prefers-reduced-motion` anywhere** ✅.
- **Admin renders all rows, no virtualization/pagination**; Referrals table is **O(n²)** (`users.filter` per row, `AdminDashboard.tsx:2028`) ✅; course-badge IIFE runs per row twice.
- **Per-mount refetch storm:** returning to CourseDetail re-fires 5 GETs sequentially ✅; Quiz → back re-fetches everything; no cache (Phase 1 finding).
- **Global widget:** FAB with expand panel + `animate-ping` badge on every route.
- **Dead weight:** dead animation classes, dead QuizResults component, dead RegisterPage, `text-[8.5px]`... minor.

---

## 14. Animation & Interaction Audit

- **Consistent, well-templated:** framer-motion springs (260-120, 0.2-0.5s fades) across cards, modals, tabs, results; confetti on pass (appropriate); Navbar drawer/dropdown; state crossfades on Verify/Reset.
- **Excess:** Home infinite ambient animations (icons + blobs + scroll bar); LoginPage full-screen particles; global FAB `animate-ping`.
- **Missing:** `prefers-reduced-motion` handling (zero); page transitions (none — hard route switches except Suspense spinner); toast entrance/exit animation (none).
- **Distracting/risky:** the FAB ping badge on every route; infinite rAF canvas; CourseDetail `scrollTo({behavior:'instant'})` non-standard.
- **Interaction issues:** dead "Submit Now" button; Practice timeout loop; PayPage UPI-intent 2s timeout heuristic; `active:scale-[0.98]` on Button is nice micro-interaction ✅.

---

## 15. Admin UI Audit (AdminDashboard, 2,649 lines)

- **Structure:** no sidebar — single tabbed page, `max-w-6xl`, 8 tabs (`AdminDashboard.tsx:761-798`): Payment Audits, Course Syllabus CMS, User Management, Referral Tracker, Analytics, Contact Messages, Contact Settings, Review Queue. ~48 `useState`, all handlers inline, 5 bespoke modals ✅.
- **Data model:** **all 7 fetch groups fire on mount** (`:510-521`), even for never-opened tabs; **no refetch on tab switch** (stale counts); header "Reload Data" refreshes only transactions+CMS ✅.
- **Analytics is fully hardcoded** — no API: 1,250/78.4%/81.2%/412 stats, funnel numbers, track numbers, "Founder Insight" all literal (`:1813-1908`) ✅.
- **Tables:** 6 hand-rolled; only Review has `min-w-[680px]`; no search (except Referrals), no pagination anywhere ✅.
- **Certificate console:** one-student-at-a-time, non-searchable `<select>`; track dropdown uses **static `coursesConfig`** → CMS-created courses never appear ✅; verify toggle has no audit trail ✅.
- **CMS:** module accordion = `role="button"` div containing real buttons (a11y violation); expand-fetch failure swallowed → misleading "No topics" empty ✅; topic/quiz Save has **no saving/disabled state → double-submit risk** ✅; fake "Embedded Infographic Upload Sandbox" (no real upload, `:706-721`) ✅.
- **User management:** role `<select>` lets admin promote to ADMIN with no confirm/audit ✅; no loading/error/search/pagination; sortable `<th>` not keyboard-accessible ✅.
- **Toast severity bugs:** "Failed to delete message"/"Failed to save topic"/"Failed to save quiz question" all toast as **'success'** (`:189,595,683`) ✅.
- **Dark-mode dead tokens throughout:** `bg-slate-850` (:1157 "Add Week Module" button has **no background**), `border-slate-850/855`, `divide-slate-850`, `to-blue-750` (gradient endpoint), `text-rose-450`, `placeholder-slate-655` ✅.
- **Mobile:** users/transactions/messages/referrals tables squeeze to unreadable; CMS accordion header cluster clipped ✅.
- **Overload:** one component carries every admin workflow → any keystroke re-runs a ~2,600-line render function; every mutation triggers full module refetches (+2 requests each) ✅.

---

## 16. Design Inconsistency Map

| Category | Pattern A | Pattern B | Locations | Severity |
|---|---|---|---|---|
| Colors | Token `--color-primary` etc. declared | raw slate/blue classes + 28 hardcoded hexes; 5 hexes duplicate tokens | `index.css:14-50` vs components | HIGH |
| Colors (dark) | registered shades | **unregistered `slate-850/750/905/855/455/655/405` silently no-op in dark** | ~80 uses across AdminDashboard/CourseDetail/Dashboard/PracticeArena/CourseHero/QuizResults/LeaderboardTab/ExamResultsModal | **CRITICAL** |
| Colors (light) | `.light` overrides | custom shades (slate-355/250, indigo-450/405, emerald-450) **not** overridden → invisible on white | Privacy, Contact, Home | HIGH |
| Theme strategy | dark-first CSS-hack pages | light-first `dark:` pages | Home/About/Contact/Terms/Privacy/Refund vs LoginPage/NotFound | MEDIUM |
| Typography | Inter (declared, not loaded) | Lato (loaded, unused) | `index.css:15`, `index.html:11` | MEDIUM |
| Typography | `text-xs`+ standard scale | `text-[11px]` ×369, `text-[10px]`, `text-[8.5px]` | app-wide | HIGH |
| Buttons | `rounded-xl` shared Button | `rounded-lg`/`rounded-2xl` inline | Button.tsx vs ConfirmDialog:89/96, AdminPaymentTable:203, PayPage:341 | LOW |
| Cards | Card = `rounded-2xl border shadow-lg` | inline cards without shadow | Verify:179, About, AdminDashboard:2289 | LOW |
| Modals | ConfirmDialog (role/aria/Escape) | 9+ overlays with no dialog semantics | admin modals, Home, CourseDetail, Exam/Peer modals | HIGH |
| Tables | review `min-w-[680px]` | others no min-w | AdminDashboard | MEDIUM |
| Badges | `statusConfig` map | inline ternaries | AdminPaymentTable vs others | MEDIUM |
| Spacing | page `py-8` | `py-12` on marketing pages | App.tsx:49 vs About:8 | LOW |
| Fonts (mono) | code only | UI chrome (IDs, XP, UPI) | AdminPaymentTable, LeaderboardTab, PayPage, LoginPage:316 | LOW |
| Loading | Spinner/Skeleton | text fallbacks, silent nothing | Dashboard vs CourseDetail vs Home | MEDIUM |
| Error | toast | inline red box | LoginPage vs PayPage vs Dashboard daily | MEDIUM |
| Icon sizes | 14/16/18 | 11/13/20/24/32/48, mixed within Navbar | components | LOW |
| Empty states | dashed card | plain text | Dashboard courses vs leaderboard | MEDIUM |
| Buttons (all-caps) | `uppercase tracking-wider` micro-text | mixed | app-wide | LOW |

---

## 17. Responsive Bug Master List (implementation backlog — NOT to fix now)

| ID | Screen | Viewport | Problem | Root Cause | Severity |
|---|---|---|---|---|---|
| RB-01 | Admin tables | 375/320 | Users/transactions/messages/referrals unreadable (7-8 cols) | No `min-w` on tables | HIGH |
| RB-02 | Admin CMS | ≤480 | Module accordion header button cluster clipped/unreachable | `flex` no wrap + global `overflow-x: clip` | HIGH |
| RB-03 | Certificate | 375/320 | Fixed-px A4 interior clips (documented limitation, NO-TOUCH) | fixed px metrics + aspect-ratio | HIGH |
| RB-04 | PayPage | ≤340 | QR box overflows card and is clipped | `size={190}` + `p-4` vs narrow card | MEDIUM |
| RB-05 | PracticeArena | all | stdout clipped in output pane | no `overflow-x-auto`/`break-words` | MEDIUM |
| RB-06 | PracticeArena | dark | light borders on dark cards | unregistered `dark:border-slate-850` | MEDIUM |
| RB-07 | CourseDetail | dark | bright `currentColor` borders; invisible shimmer | unregistered slate shades | MEDIUM |
| RB-08 | CourseDetail | 768-1023 | sidebar 25% + truncated titles | `md:w-1/4 lg:w-1/3` | MEDIUM |
| RB-09 | CourseDetail | 375 | GFM markdown tables clipped | no `[&_table]` overflow rule | LOW |
| RB-10 | Home | <1024 | no hero visual | `hidden lg:block` | MEDIUM |
| RB-11 | Home/all | all | double horizontal padding | App wrapper + page root both `px-4` | LOW |
| RB-12 | Dashboard | 375 | stat labels truncated | `truncate` in 2-col cells | LOW |
| RB-13 | Dashboard | all | layout shift when daily loads | missing daily skeleton | LOW |
| RB-14 | AdminDashboard | 375 | tab strip requires horizontal scroll | `whitespace-nowrap` + scroll | LOW |
| RB-15 | AdminPaymentTable | ≤480 | action cluster overflows column | 3 non-wrapping buttons | MEDIUM |
| RB-16 | All pages | all | toasts hidden behind FAB; FAB over modals | `z-50` vs `z-[9999]` | MEDIUM |
| RB-17 | Login/Reset | 320 | 2-col password checklist tight | `grid-cols-2` fixed | LOW |
| RB-18 | PracticeArena | 375 | 40px touch targets | `w-10 h-10` | LOW |
| RB-19 | Quiz | any | blank page on empty question set | `if(!activeQuestion) return null` | CRITICAL |
| RB-20 | Home | 375 | long syllabi modal + dense sections | content volume | MEDIUM |
| RB-21 | SkillRadar | 320 | fixed 200×200 SVG may clip legend | hardcoded canvas | LOW |

---

## 18. UI/UX Technical Debt

- **Giant components:** AdminDashboard 2,649 lines (~48 useState, 8 tabs, 5 modals); CourseDetail 1,587 (3 view-states, forum, assignments, lightbox); Home 1,383 (7 sections + ~460 lines inline curriculum).
- **Duplicate UI code:** ~12 inline button blobs, 9+ modal scaffolds, 6 hand-rolled tables, ~30 inline label+input forms, 2 verbatim course-badge IIFEs, FormField 1:1 duplicating Input, QuizResults duplicating ExamResultsModal (dead).
- **Hardcoded styles:** 28 hex colors; `text-[11px]` ×369; `rounded-xl/2xl` split; `shadow-lg` always-on Card.
- **Inconsistent tokens:** 12 semantic tokens dead; unregistered slate shades ~80 uses; `.light` chain is the real light theme (250 lines, `!important`).
- **Missing reusable components:** Modal, Table, FormField (real), StatusBadge, CourseBadges, ErrorMessage, EmptyState, ConfirmationToast.
- **Poor component boundaries:** organisms are CourseDetail/Admin-specific single-use; project/view coupling.
- **Desktop-first assumptions:** fixed 2-col grids, 40px targets, micro-text, no `xl/2xl`.
- **Responsive hacks:** `overflow-x: clip` global mask; `hidden lg:block` hero; no-min-w tables.
- **Accessibility debt:** label association, headings, focus, dialog semantics, 160 untyped buttons, reduced-motion.
- **State handling affecting UX:** per-mount refetch storm, no cache, silent fallbacks shown as real (Home leaderboard mock, Contact fake phone, Analytics fake numbers), Practice timeout loop, Quiz blank page.

---

## 19. What Should Be Preserved (V2 candidates)

1. **All 8 tables wrapped in `overflow-x-auto`** — the app never horizontally breaks the page on tables ✅.
2. **Navbar responsive implementation** — the only fully-correct `hidden md:flex`/`md:hidden` split with drawer/dropdown + Escape + `aria` attributes ✅.
3. **ConfirmDialog** — the only a11y-complete overlay (`role=dialog/aria-modal/aria-label`, Escape, backdrop-close) ✅.
4. **CourseHero responsive breadcrumbs** — `flex-wrap` + responsive `max-w` truncation ✅.
5. **ProgressMap / QuizQuestion / Spinner / Skeleton a11y** — real buttons, radio+label, `role=status` ✅.
6. **Global `:focus-visible` ring** (`index.css:60-68`) ✅.
7. **framer-motion consistency** — one spring scale used everywhere ✅.
8. **Contact `safeWebsiteUrl` scheme guard** (injection-proof) ✅.
9. **Verify PENDING/VERIFIED state design** (issue #101) and Dashboard skeleton with `role="status"` ✅.
10. **Dark-first visual identity** — the navy/indigo/cyan + JetBrains Mono identity is strong; the mechanism (not the hack) is worth keeping.
11. **Quiz auto-submit ref pattern** (`Quiz.tsx:44-48`) avoids stale closures ✅.
12. **Certificate print CSS** (`@page`, `print-color-adjust`) — robust desktop printing (NO-TOUCH).

---

## 20. V2 UI/UX Opportunity Map

| Bucket | Areas |
|---|---|
| **KEEP** | Navbar pattern; table overflow wrappers; ConfirmDialog; dark-first identity; framer-motion scale; `:focus-visible`; course/topic content layouts; Certificate print (no-touch); Dashboard skeleton; radio+label quiz questions; `safeWebsiteUrl` |
| **POLISH** | CourseHero breadcrumbs app-wide; stat-card truncation + loading skeletons (Dashboard daily); toast z-order/aria; micro-text floor (11px→12px); heading hierarchy per page; button-in-anchor → Link-styled button; Verify button destinations; pay-button QR spacing; touch targets 40→44px |
| **REWORK** | The `.light` override chain → token-driven theme (fixes #84 + custom-shade dead classes in one move); Quiz zero-state + early-submit + cancel-confirm; Practice timeout/timer-mode logic; CourseDetail refetch storm + view-state restore + buried module quiz CTA; admin tables (min-w, search, pagination); admin CMS accordion header re-flow; Home hero mobile visual; toasts aria-live |
| **REDESIGN** | Home (structure, hierarchy, mock-data honesty); AdminDashboard → routed sub-screens with shared Table/Modal/FormField; marketing/legal light-mode; PayPage layout for mobile (bottom-sheet feel); Dashboard layout (density) |
| **REBUILD** | Certificate mobile (gated by the no-touch mandate — only if the user lifts it); PracticeArena timer state machine; the whole admin tab data-fetching model (per-tab lazy, refetch, cache); component primitive layer (Modal/Table/FormField/StatusBadge/CourseBadges/ErrorMessage) |

---

## 21. Final UI/UX Scorecard

| Dimension | Score /10 | Justification |
|---|---|---|
| Visual consistency | 4 | One strong dark identity, but 28 hardcoded hexes, dead semantic tokens, ~80 no-op shade classes, 3 theme strategies |
| UX clarity | 5 | Clear primary CTAs on most screens; undermined by dead buttons, buried quiz action, mock data shown as real, mislabeled buttons |
| Responsive quality | 4 | Great table wrappers + Navbar; but Certificate/Quiz/PayPage zero breakpoints, no-min-w admin tables, clipped CMS cluster |
| Mobile UX | 3 | Desktop-first micro-text, 40px targets, admin unusable on phone, Certificate not mobile (documented) |
| Accessibility | 3 | Only one `htmlFor` app-wide, no h1 on 6 pages, 8+ modals without dialog semantics, 160 untyped buttons, toasts not announced, no reduced-motion |
| Component reuse | 5 | 26 shared components exist; but FormField duplicates Input, QuizResults is dead, ~12 inline button blobs, 9 modal scaffolds, 6 hand-rolled tables |
| Design-system consistency | 3 | Tokens declared-but-dead; `.light` hack is the real theme; `text-[11px]` ×369; radius/shadow/font split |
| Navigation | 6 | Navbar excellent; CourseDetail/Admin tab patterns OK but not ARIA-tab; ViewState reset loses context |
| Forms | 4 | Input/FormField clean but labels unbound; no shared validation; double-submit risks in admin CMS |
| Feedback states | 4 | Skeleton/Spinner/toast/confirm exist; toasts unannounced + occluded + 3 wrong-severity; error states inconsistent |
| Admin UX | 3 | 2,649-line monolith; fake Analytics; no search/pagination; stale data; tables unreadable on mobile |
| Performance-related UI | 4 | Lazy routes ✅; but 214KB eager logo, LoginPage particle canvas, Home infinite animation, no reduced-motion, O(n²) admin renders |
| **Overall UI quality** | **4.2** | A strong dark visual identity and genuinely good foundations (table wrappers, Navbar, ConfirmDialog, motion consistency, print CSS) weighed down by an incomplete design-token migration, a 250-line light-mode hack with known dead classes, pervasive label/a11y gaps, and desktop-first admin/mobile gaps. |

---

## 22. Final Report — COMPLETE UI/UX AUDIT SUMMARY

### Top 20 UI/UX Problems
1. **~80 unregistered Tailwind shade classes (`slate-850/750/905/855/455/655/405`, `blue-450`, `rose-450`, `to-blue-750`) silently no-op in the default dark theme** — borders become `currentColor`, backgrounds/shimmers invisible, "Add Week Module" button has no background. Root cause: `@theme` registers only 6 shades; `.light` overrides define the rest. ✅
2. **All 12 semantic design tokens are dead** — components hardcode raw palette + 28 hexes; the 250-line `.light !important` chain is the real light theme. ✅
3. **Label↔input association broken app-wide** (one `htmlFor` in the whole `pages/` tree). ✅
4. **No `h1` on LoginPage, Forgot, Reset, Verify-email, CourseDetail, Quiz.** ✅
5. **8+ modals/drawers lack `role=dialog`/`aria-modal`/focus trap/scroll lock/Escape** (only ConfirmDialog partial). ✅
6. **160 `<button>`s without `type`** (default to submit in forms). ✅
7. **Toasts: no `aria-live`, unlabeled `×`, color-only severity, occluded by the FAB (`z-[9999]`), 3 admin errors toast as success.** ✅
8. **Quiz renders a blank page when a question set is empty; no confirm on Cancel; early submit impossible.** ✅
9. **PracticeArena: timer keeps running in coding mode → auto-submits empty MCQ; timeout+failure → infinite re-submit loop.** ✅
10. **CourseDetail: 5 sequential GETs on every mount, viewState resets to course-home, module quiz action buried, no h1, silent fetch-failure empty states.** ✅
11. **Home: 460 lines of inline static curriculum (3rd source of truth), mock leaderboard/achievers shown as real, "Enroll Now" → login form, hero hidden <1024px, infinite ambient animation.** ✅
12. **AdminDashboard: one 2,649-line component; all 7 data groups fetched on mount; no per-tab refetch; no search/pagination; Referrals O(n²).** ✅
13. **Admin Analytics tab is 100% hardcoded fake numbers.** ✅
14. **`text-[11px]` ×369 / `text-[10px]` / `text-[8.5px]` on low-contrast slate → WCAG failures.** ✅
15. **Certificate fixed-px A4 clips on mobile (documented limitation; page is HARD NO-TOUCH).** ✅
16. **PayPage: FE/BE coupon+pricing duplication (FE lacks the 50% cap; `amount` ignored by BE), QR overflows ≤340px, no FAILED-payment state, dead ₹0 branch.** ✅
17. **Light-mode contrast bugs on Privacy (`slate-355`) and Contact (`slate-250`, `indigo-450/405`, `emerald-450`) — text invisible on white.** ✅
18. **Dead "Submit Now" button on Dashboard milestone cards.** ✅
19. **Verify page buttons misnavigate; `window.location.search` instead of `useSearchParams`; RegisterPage is dead code; QuizResults is dead code; dead animation classes (`animate-fade-in` ×11 etc.).** ✅
20. **Typography drift: Lato loaded-never-used, Inter declared-never-loaded; JetBrains Mono used for UI chrome; no heading scale.** ✅

### Top 20 Responsive Problems
See §17 master list (RB-01…RB-21). Ranked: RB-19 quiz blank (CRITICAL); RB-01/RB-02/RB-03 (HIGH); RB-04…RB-08, RB-10, RB-15, RB-16 (MEDIUM); rest LOW.

### Top 10 Accessibility Problems
1. No label association (only one `htmlFor` app-wide). 2. Missing `h1`s on 6 screens. 3. Non-keyboard clickable `div`s (Card, CourseCard, topic/chapter rows). 4. Modals without dialog semantics/focus trap. 5. 160 untyped buttons. 6. Toasts not announced + color-only. 7. `text-[11px]` low-contrast slate. 8. Unlabeled admin icon buttons + nested-interactive accordion + non-keyboard sortable `<th>`. 9. Button-in-anchor invalid nesting. 10. No `prefers-reduced-motion`.

### Top 10 Design-System Problems
1. 12 dead semantic tokens. 2. ~80 no-op shade classes in dark mode. 3. `.light !important` hack (250 lines) as the real light theme. 4. 28 hardcoded hexes (5 duplicate tokens). 5. Lato/Inter mismatch. 6. `text-[11px]` ×369 + no size floor. 7. No heading scale. 8. Radius language split (xl buttons vs 2xl modals). 9. Card always-on shadow vs shadowless inline cards. 10. 11 lucide sizes, mono-in-UI-chrome, dead animation classes.

### Top 10 Components That Need Consolidation
1. One `Modal` primitive (9+ overlays). 2. One `AdminTable` (6 tables + sortable headers). 3. One `FormField` with bound labels (Input + FormField + ~30 inline). 4. One `StatusBadge` (statusConfig + ternaries). 5. One `CourseBadges` (2 verbatim IIFEs). 6. One `Button` (12 inline blobs). 7. One `Card` (inline cards). 8. One `EmptyState` (inconsistent empties). 9. One `ErrorMessage` (inline per page). 10. Delete dead: QuizResults, RegisterPage, FormField→Input, dead animation classes.

### Top 10 Screens That Need the Most Attention
1. AdminDashboard (monolith, fake analytics, tables). 2. CourseDetail (refetch storm, buried CTA, a11y). 3. Home (hierarchy, mock data, mobile hero). 4. Quiz (blank page, cancel, early-submit). 5. PracticeArena (timer state machine). 6. PayPage (pricing duplication, QR, FAILED state). 7. Certificate (mobile — gated by no-touch). 8. Dashboard (dead button, truncation, layout shift). 9. Contact/Privacy (light-mode contrast). 10. Verify (button destinations, useSearchParams).

### Top 10 Existing UI Patterns Worth Preserving
1. Table `overflow-x-auto` wrappers (all 8). 2. Navbar responsive split + a11y. 3. ConfirmDialog dialog semantics. 4. CourseHero responsive breadcrumbs. 5. ProgressMap/QuizQuestion/Spinner/Skeleton a11y islands. 6. Global `:focus-visible` ring. 7. framer-motion consistency. 8. Contact `safeWebsiteUrl` guard. 9. Dashboard skeleton with `role="status"`; Quiz auto-submit ref. 10. Certificate print CSS (no-touch) + dark-first identity.

### Recommended V2 UI/UX Priority Order
- **P0 — Critical:** (1) Register/fix the custom shade tokens so dark mode renders every class (register `slate-850/750/905/855/455/655/405`, `blue-450`, `rose-450`, `to-blue-750`, `placeholder-slate-655`); (2) Quiz empty-state (no more blank page); (3) Practice timeout/timer state machine (kill the auto-submit loop + coding-mode timer); (4) Label↔input association + `h1`s on the 6 pages; (5) Fix the 3 wrong-severity toasts.
- **P1 — High impact:** (6) Rebuild the light theme on tokens (replaces the `.light` hack, fixes #84 + all contrast bugs); (7) One `Modal` primitive with focus trap + scroll lock; (8) Admin tables: min-width + search + pagination; (9) Admin: per-tab data fetching + real Analytics or remove the tab; (10) CourseDetail: view-state restore + module refetch consolidation + surface the quiz action; (11) Toasts: `aria-live` + z-order + icons; (12) PayPage: backend-driven pricing (kill FE/BE coupon duplication), FAILED state, QR spacing.
- **P2 — Important:** (13) Component consolidation (Table, FormField, StatusBadge, CourseBadges, EmptyState, ErrorMessage); (14) Typography floor (11→12px) + one font stack + heading scale; (15) Home: remove mock data, one curriculum source, mobile hero; (16) CMS accordion header re-flow + saving states; (17) Dead code removal (QuizResults, RegisterPage, dead animation classes, orphaned tokens); (18) Performance: lazy logo, `prefers-reduced-motion`, kill LoginPage particle canvas on mobile.
- **P3 — Polish:** (19) Verify button destinations + `useSearchParams`; (20) button-in-anchor → Link-styled button; (21) touch targets 40→44px; (22) tab ARIA patterns; (23) icon-size harmonization; (24) `#d4af37`/social hexes → tokens.

---

*End of Phase 2. Next: Phase 3 (frontend deep dive) / Phase 4 (backend deep dive) — and ultimately the V2 design system built from this report's §20/§22.*

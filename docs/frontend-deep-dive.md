# EduNexus Pro — Frontend Deep-Dive + UI Implementation Blueprint (Phase 3)

> **Document type:** Analysis + implementation planning ONLY. No code modified, nothing installed, no framework changed, no rewrite proposed.
> **Date:** 2026-08-13
> **Sources of truth:** full frontend source read (`frontend/src`, ~14,300 lines), Phase 1 `docs/architecture-baseline.md`, Phase 2 `docs/ui-ux-audit.md`, four dedicated read-only deep-dive passes (architecture map · hooks/contexts API · component prop signatures + duplicate inventory · design tokens/z-index/breakpoints).
> **Labels:** ✅ CONFIRMED (code, file:line) · 🔶 INFERRED · ⚪ UNKNOWN/NOT CONFIRMED.
> **Constraint:** the **Certificate page is HARD NO-TOUCH** — never in any refactor step. Backend contracts, routes, auth semantics, payment business rules, and production data are preserved unless a frontend bug explicitly requires a change (each such case is flagged).
> **Paths:** relative to `frontend/`.

---

## 1. Executive Summary

EduNexus Pro's frontend is **architecturally sound at the shell level and fragmented at the component level**. Routing is clean (`App.tsx:56-77`), providers nest correctly, layering is directionally correct (`pages → components → hooks → contexts → api`, no circular imports), and 8 shared primitives genuinely exist (`Button`, `Input`, `Card`, `Badge`, `Skeleton`, `Spinner`, `ConfirmDialog`, `ErrorBoundary`). The problems are **concentration and bypass**, not framework choice:

1. **The design system exists but is half-wired.** All 12 semantic tokens in `index.css:19-33` are dead (zero usages). The real light theme is a ~250-line `!important` override chain (`index.css:91-342`). Six unregistered Tailwind shades (`slate-850/855/750/905/655/405`) are used ~96× and **emit no CSS** — dark mode silently renders wrong.
2. **Shared primitives are bypassed at scale.** `AdminDashboard` (2,649 lines) uses exactly one shared component. `PayPage`, `Certificate`, `Verify`, and all 6 static pages import **zero** shared components. Hand-rolled `rounded-xl` buttons (~30 sites) and `rounded-2xl` card divs (~40 sites) reimplement `Button`/`Card` with drift.
3. **Three monoliths carry the app:** `AdminDashboard.tsx` (2,649), `CourseDetail.tsx` (1,588), `Home.tsx` (1,383) — 5,620 lines ≈ 39% of the codebase inside three files, each mixing data fetching, presentation, and business logic.
4. **State/data flow has systemic gaps:** no 401 handling, no response interceptor, no cache, four independent `/courses` call sites, a refetch cascade in `useCourseDetail`, silent errors, and duplicated payment state across 3 places.
5. **Responsiveness is desktop-first:** `xl:` used 3× total, `2xl:` 0×; `Quiz` and `PayPage` have zero breakpoints; every page double-pads; admin tables collapse; the toast corner is occluded by the FAB (`z-50` vs `z-[9999]`).
6. **Accessibility is thin:** one `htmlFor` in the whole `pages/` tree, no `h1` on 6 screens, 9+ overlays without dialog semantics, 160 untyped buttons, zero `prefers-reduced-motion`.

**The modernization path is therefore: normalize the foundation (tokens, primitives, layout), then refactor the monoliths into those primitives — page by page, keeping every route, every API call, and every user flow.** No rewrite is warranted or proposed. The safe sequence is laid out in §12 as 28 ordered steps, each with files, what changes, why, dependencies, risk, expected result, and validation.

---

## 2. Current Frontend Architecture

### 2.1 File tree (`src/`)

```
src/
├── main.tsx                  # StrictMode → <App/>
├── App.tsx                   # providers + shell + routes (118 lines)
├── App.css                   # 5 lines: #root width/margin
├── index.css                 # 344 lines — @theme tokens, .light chain, focus, overflow guard
├── api/index.ts              # THE ONLY api module (shared axios instance)
├── assets/                   # DEAD — hero.png, react.svg, vite.svg never imported
├── config/courses.ts         # coursesConfig (9 tracks) — LIVE (2nd source of truth)
├── config/projects.ts        # projectsConfig — DEAD (never imported)
├── context/                  # AuthContext.tsx, ThemeContext.tsx, UIContext.tsx
├── hooks/                    # useCourses.ts, useCourseDetail.ts, useQuiz.ts
├── components/
│   ├── Navbar.tsx            # site-global, 347 lines
│   ├── atoms/                # Badge, Button, Card, ConfirmDialog, ErrorBoundary,
│   │                         #   FloatingParticles, FloatingSupportWidget, Input, Skeleton, Spinner
│   ├── molecules/            # CodePlayground, CourseCard, ExamResultsModal, FormField,
│   │                         #   PeerSolutionsModal, ProjectStatusCard, QuizQuestion, SkillRadar
│   └── organisms/            # AdminPaymentTable, CourseHero, EnrollmentPanel, LeaderboardTab,
│                             #   ProgressMap, QuizHeader, QuizResults(DEAD), SyllabusManager
└── pages/                    # 18 pages (Home+Login eager; rest lazy); RegisterPage.tsx DEAD
```

There is **no `src/types/`, `src/utils/`, or `src/lib/`**. All non-config types are inline interfaces; all helpers are module-local.

### 2.2 API layer — `api/index.ts` (the only API file)

- Default-exported axios instance: `baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'` (`:4`), `withCredentials: true` (`:5`).
- Request interceptor (`:8-16`): attaches `Authorization: Bearer <token>` from `localStorage['token']` + `X-Requested-With: XMLHttpRequest` (anti-CSRF).
- **No response interceptor, no 401 handling** ✅ — expired sessions surface as raw per-call errors with no global sign-out.
- Every call site invokes `api.get/post/put/delete` inline — there are **no named API functions**, so endpoint strings are duplicated across pages (e.g. `/courses` at `useCourses.ts:13`, `useCourseDetail.ts:23`, `Home.tsx:600`, `AdminDashboard.tsx:377`; `GET /payments/status/:id` at `useCourseDetail.ts:46`, `PayPage.tsx:72`, `EnrollmentPanel.tsx`).
- Only 3 env vars in use: `VITE_API_URL`, `VITE_UPI_ID`, `VITE_UPI_PAYEE`.

### 2.3 Routing & shell — `App.tsx`

| Concern | Location | Notes |
|---|---|---|
| Eager routes | `App.tsx:6-10` | `/`, `/login`, `/register`, `/forgot-password`, `/verify`, `/reset-password` |
| Lazy routes | `App.tsx:12-24` | everything else via `React.lazy` |
| Guards | `:30-35` ProtectedRoute (loading→"Loading...", !user→`/login`), `:37-42` AdminRoute (role!=='ADMIN'→`/dashboard`) | admin enforced at route + Navbar (`Navbar.tsx:72`) |
| Shell | `:46-49` | `div.min-h-screen.flex.flex-col.bg-slate-950.text-white.overflow-x-clip` → Navbar → FloatingSupportWidget → `container mx-auto px-4 py-8 flex-grow` |
| Error/Suspense | `:50-55` | ErrorBoundary wraps Suspense (spinner fallback) wraps Routes |
| Footer | `:83-101` | inline, `no-print`, `bg-slate-950/60 border-t` |
| Providers | `:106-118` | `AuthProvider > UIProvider > ThemeProvider > Router` — order correct (none depend on router) |

### 2.4 State management

Context API only (`package.json` has no redux/zustand/react-query). Three contexts, three data hooks (full APIs in §6).

### 2.5 Authentication flow

- Storage: `localStorage['token']` (JWT), `localStorage['user']` (JSON), `theme`, `last_viewed_week_<courseId>`.
- `AuthContext.refreshUser` (`AuthContext.tsx:18-37`): no token → done; else `GET /auth/me` → set user; **on ANY error removes token+user and sets user null (`:29-33`)** — a transient network blip logs the user out ✅.
- `login` (`:61-65`) sets storage + state; `logout` (`:67-76`) best-effort `POST /auth/logout` then clears.
- Bootstrap (`:39-59`) JSON-parses `user` defensively, then always `refreshUser()`.
- **Problems:** no response-interceptor-driven sign-out; `refreshUser` nukes session on any error; context value + functions not memoized (11 consumers re-render per provider render); `user: any`.

### 2.6 Loading / error patterns (5 coexisting styles)

1. Skeleton (`Dashboard.tsx:107-136`, `PracticeArena.tsx:211-236`).
2. Spinner (`Quiz.tsx:125`, `CourseDetail.tsx:524/1257`, `PeerSolutionsModal.tsx:107`, `LeaderboardTab.tsx:116`).
3. Inline text ("Loading CMS builder modules…" `AdminDashboard.tsx:1143`).
4. Inline error banners (`PracticeArena.tsx:241-275`, `PayPage.tsx:311-316`, `Verify.tsx:351-373`, `Certificate.tsx:53-67`).
5. Silent (`useCourses.error` never consumed, `Dashboard.tsx:67`; module-fetch failures swallowed, `useCourseDetail.ts:35-36/48-49`; Home mock fallback shown as real).

### 2.7 Modal/dialog/drawer inventory (9 bespoke + 1 shared)

Shared: `ConfirmDialog` (wired via `UIContext.confirmDialog`, `z-[60]`, `role=dialog/aria-modal`, Escape — no focus trap). Hand-rolled (all `z-50`, none dialog-semantics): Admin edit-candidate `AdminDashboard.tsx:1525`, topic WYSIWYG `:2197`, quiz-question editor `:2373`, add-course `:2462`, add-module `:2562`; Home syllabus preview `Home.tsx:1279`; CourseDetail doubts drawer `:1346/1355` + lightbox `:1548`; `ExamResultsModal.tsx:67/76`; `PeerSolutionsModal.tsx:75/84`.

### 2.8 Toast system — `UIContext.tsx`

`toasts: {id,message,type}[]`, `addToast(message, type='info')` (`:44-52`, 5s auto-dismiss), `removeToast` (`:54-56`), `confirmDialog(options): Promise<boolean>` (`:58-62`). Render (`:91-106`): `fixed bottom-4 right-4 z-50`, bg by type, `×` close. **No `aria-live`; id via `Math.random()`; `settleConfirm` calls `resolve` inside a state updater (`:66`); `busy` is dead (`:71-74`); re-entrancy hangs the first caller's promise (`:58-62`).**

### 2.9 Dead code (verified)

`pages/RegisterPage.tsx` (only imports LoginPage, nothing imports it), `config/projects.ts` (never imported), `components/organisms/QuizResults.tsx` (never imported), `src/assets/*` (3 files), `public/icons.svg`, `public/edunexus_banner.png` (787 KB), `public/website_img-removebg-preview.png` (216 KB), `public/edunexus_QR-removebg-preview.png`, no-op animation classes (`animate-fade-in` ×11, `animate-spin-slow` ×2, `animate-pulse-slow` ×1 — no `@keyframes`), dead props (`EnrollmentPanel.onPaymentSuccess`, `CourseCard.tags`, `ConfirmDialog.busy`, `ProjectStatusCard` "Submit Now" button has no `onClick`).

### 2.10 Config / build

- `config/courses.ts` exports `SyllabusItem {order,title,details}` and `CourseConfigItem {id,title,titleShort,category,difficulty,tags,colorLight,colorDark,iconColor,textColor,barColor,desc,descShort,icon,syllabus}` — but **`Home.tsx` embeds its own duplicate catalog** (`Home.tsx:18` `courseDetails`, `:246` `courseMetadata`) and Dashboard/Admin read API data. Three representations of the same courses ✅.
- `vite.config.ts`: `react()` only — no alias, no proxy; all imports relative. `tailwind.config.js`: `content` + empty `theme.extend`. `tsconfig.app.json`: `verbatimModuleSyntax`, `erasableSyntaxOnly` (no enums), `noUnusedLocals/Parameters: false`.

---

## 3. Page → Component Dependency Map

### 3.1 Home (`/`, eager, 1,383 lines)
`Home → {Button, Card, FormField(→Input)} + raw JSX; useAuth, useUI; api.get('/courses'):600, api.get('/practice/leaderboard/public'), POST /auth/login|register:675`
- User action → inline form submit → `login(token,res)` → navigate `/dashboard`. Enroll → scrolls to form. Syllabus modal opens locally.
- **Duplication:** full second catalog (`:18`, `:246`) + full second auth form (`:1148`) + mock leaderboard fallback (`:659-666`).
- **State:** local `scrollY`, form fields, modal open; no loading skeleton for catalog; error → silent fallback to inline data.
- **Refactor:** Home should consume `config/courses.ts` + `useCourses`; the inline auth form should become `LoginPage` (or a shared `AuthForm`); hero needs a `<lg` visual.

### 3.2 Login/Register (`/login`,`/register`, eager, 399 lines)
`LoginPage(mode) → {Card, Button, Input, FloatingParticles}; useAuth, useUI; POST /auth/login|register`
- mode prop toggles fields/endpoint. Success overlay (`:137-170`) → navigate.
- **Refactor:** extract `AuthForm` so Home stops duplicating; add `htmlFor` bindings; h1.

### 3.3 Forgot / Reset (eager)
`ForgotPasswordPage → {Card, Button, Input}; useUI; POST /auth/forgot-password` · `ResetPassword → {Card, Button, Input}; POST /auth/reset-password`
- Forgot renders dev `resetUrl` (`:76-91`); both wrap `<Link>` around `<Button>` (`:93-97`, `:108-112`).

### 3.4 Dashboard (`/dashboard`, lazy, 677 lines)
`Dashboard → {CourseCard, Skeleton, SkillRadar, ProjectStatusCard, LeaderboardTab}; useAuth, useCourses, useUI; GET /practice/daily, POST /practice/daily/submit, GET /practice/leaderboard`
- **Data flow:** `useCourses().data` → courses grid; `useCourses.error` never read (`:67`). Daily challenge + leaderboard fetched in-page.
- **Dead:** `ProjectStatusCard` "Submit Now" (`ProjectStatusCard.tsx:67`). Hand-rolls every stat card/banner/CTA (doesn't import `Button`/`Card`).

### 3.5 CourseDetail (`/course/:id`, lazy, 1,588 lines)
`CourseDetail → {CourseHero, SyllabusManager(→ProgressMap), EnrollmentPanel, CodePlayground, PeerSolutionsModal, Spinner}; useAuth, useCourseDetail, useUI; + inline GETs for assignments/projects/forum + POSTs`
- 3 view-states (`course-home|module-home|topic-reader`), `mobileView` toggle, doubts drawer, lightbox.
- **Data flow:** `useCourseDetail` (5 fetches on mount) → weeks → module detail; payment status gates EnrollmentPanel; `setIsPaid(true)` raw write on pay success (`CourseDetail.tsx:1331`).
- **Problems:** refetch cascade (§6.2), viewState resets each mount (`CourseDetail.tsx:209`), 5 sequential GETs, no h1, buried module-quiz CTA, sidebar `md:w-1/4 lg:w-1/3` (`:586`).

### 3.6 Quiz (`/quiz/:courseId/:week[/:topicId]`, lazy, 244 lines)
`Quiz → {QuizHeader, QuizQuestion, Button, Spinner, ExamResultsModal}; useAuth, useQuiz, useUI`
- Good shared-component coverage. **Data flow:** `useQuiz` → questions → radio answers → `submitQuiz` → `login(token, res.updatedUser)` on success (`Quiz.tsx:103-106`).
- **Problems:** blank page on empty set (`:157`), no cancel confirm, submit only on last question, no h1, `useQuiz.loading` initial `false` → blank flash (`useQuiz.ts:6`).

### 3.7 PracticeArena (`/practice/arena`, lazy, 674 lines)
`PracticeArena → {Skeleton, CodePlayground}; useAuth, useUI; GET /practice/questions, POST /practice/submit`
- 15-min timer; MCQ navigator `grid-cols-5` `w-10 h-10`; coding mode.
- **Problems:** timer runs during coding mode (auto-submits empty MCQ); timeout+failed-submit → infinite loop (`PracticeArena.tsx:151-165`); no retry when fetch returns `[]`; unregistered `dark:border-slate-850`.

### 3.8 PayPage (`/pay/:courseId`, lazy, 465 lines)
`PayPage → {useAuth, useUI} + 100% raw JSX + QRCodeSVG` — **zero shared components**
- `GET /payments/status/:id`, `POST /payments/create-order`, `POST /payments/verify`; FE coupon map (`:95-111`) duplicated from backend.
- **Problems:** FE/BE pricing duplication (missing 50% cap — backend `paymentService.ts:94`); `amount` ignored by backend; no FAILED-payment branch; QR overflows ≤340px; light `bg-white` card in dark app; labels unbound.

### 3.9 Certificate (`/certificate?courseId&userId`, lazy, 491 lines) — **HARD NO-TOUCH**
`Certificate → useAuth; GET /certificate/:courseId | :userId/:courseId`; inline `<style>` for A4 print. Documented issues (fixed-px mobile clipping, hardcoded brand hexes) are recorded in Phase 2 and will NOT be changed.

### 3.10 AdminDashboard (`/admin`, lazy, 2,649 lines)
`AdminDashboard → {AdminPaymentTable}; useAuth, useUI; ~45 inline api.* calls across 8 tabs`
- **Data flow:** all 7 fetch groups on mount (`:510-521`), no per-tab refetch, no search/pagination. Analytics hardcoded (`:1813-1908`).
- **Problems:** monolith; 5 bespoke modals; tables without min-w; CMS accordion header clipped; role promote no confirm; toast severity bugs (`:189/595/683`); Referrals O(n²) (`:2028`).

### 3.11 Verify (`/verify`, eager, 380 lines)
`Verify → useAuth + 100% raw JSX`; `GET /certificate/verify/:credentialId`, `GET /courses/:id/public`, `GET /auth/verify?token=` via `window.location.search`.
- Button misnavigations (`:131`, `:155`); the **only correct `htmlFor`** in `pages/` (`:181,186`).

### 3.12 Static pages (About/Contact/Terms/Privacy/Refund/NotFound)
All **100% raw JSX**, zero shared components. Contact does `GET /contact/settings` + `POST /contact`; others are static. Light-mode contrast bugs (`Privacy.tsx:41…`, `Contact.tsx:124/153/175/179`).

### 3.13 Cross-cutting findings

| Finding | Evidence |
|---|---|
| Pages that bypass primitives entirely | PayPage, Certificate, Verify, About, Contact, Terms, Privacy, Refund, NotFound (0 imports from components/) |
| Pages that hand-roll most markup despite some imports | Home, Dashboard, CourseDetail, AdminDashboard, PracticeArena |
| Pages with good shared-component coverage | Login, Forgot, Reset, Quiz |
| `FormField` = pass-through alias of `Input` | `FormField.tsx:21-28` |
| `/courses` fetched 4 independent places | useCourses:13, useCourseDetail:23, Home:600, AdminDashboard:377 |
| `/payments/status/:id` fetched 3 places | useCourseDetail:46, PayPage:72, EnrollmentPanel |
| Duplicate course catalog | `config/courses.ts` vs `Home.tsx:18/246` vs API |
| Duplicate auth form | `LoginPage.tsx` vs `Home.tsx:1148` |
| Dead props | `EnrollmentPanel.onPaymentSuccess`, `CourseCard.tags`, `ConfirmDialog.busy`, `ProjectStatusCard` button no-op |

---

## 4. Design System Findings

### 4.1 Token audit — `index.css`

| Group | Status |
|---|---|
| `--font-sans` (Inter) / `--font-mono` (JetBrains Mono) | Declared; **Inter never loaded** (`index.html` loads Lato, unused) → UI renders system fallback |
| `--color-primary #6366F1` etc. (L22-33) | Used only as **variant names**, never as color utilities |
| 10 semantic tokens `light-bg/surface/border`, `primary-hover`, `success`, `streak`, `dark-bg/surface/border`, `cyan-accent`, `success-dark`, `streak-dark` | **0 usages — dead** (`index.css:12-13` admits migration unfinished) |
| 10 custom shades `slate-250/350/355/450/550/650`, `amber-450`, `emerald-450`, `indigo-450/405` | Registered AND used (1/40/9/34/6/24/2/7/1/1) — these work |
| **Unregistered shades** `slate-850/855/750/905/655/405` | **96 uses, no token → no CSS rule emitted** in Tailwind v4. Dark mode silently breaks where they appear (AdminDashboard, CourseDetail, Dashboard, PracticeArena) |

### 4.2 The two-theming-systems conflict

- `@custom-variant dark` (`index.css:8`) drives `dark:` classes (9 files: NotFound, LoginPage, PracticeArena, Dashboard, AdminDashboard, Navbar, ConfirmDialog, Skeleton, LeaderboardTab).
- The `.light` override chain (`index.css:91-342`) is a ~250-line `!important` remap that is the **actual light engine for every other file** (dark-first pages). It was even built to flip the unregistered shades — which generate no CSS, so those elements get nothing in dark and are only "fixed" when `.light` is present.
- `ThemeContext` adds both `.dark` and `.light` classes on `<html>` (`ThemeContext.tsx:20-26`), so both systems are active simultaneously.
- **FOUC:** theme class applied in an effect after first paint (`ThemeContext.tsx:18-28`) — dark-preference user flashes light on load. No pre-paint script.

### 4.3 Hardcoded hexes

13 unique non-brand hexes duplicate existing tokens (`#1e293b`=dark-border ×13, `#10b981`=success ×11, `#f59e0b`=streak ×5, `#22d3ee`=cyan ×2); brand hexes are deliberate (`#25D366`/`#229ED9`/`#0A66C2`); Certificate gold `#d4af37` ×8 + `#b392ac` + `#0a1128` are no-touch; `CourseDetail.tsx:552` hardcodes the dark-surface gradient `from-[#0F1629] to-[#101D33]` that a token exists for.

### 4.4 Arbitrary values & micro-type

- `text-[…]` ×385 dominates arbitrary usage; **`text-[11px]` ×369** (single most-used arbitrary value), plus `text-[10px]` ×6, `text-[10.5px]` ×2, `text-[8.5px]` ×1.
- `shadow-[…]` ×18 (mostly brand glows in FloatingSupportWidget). Zero `rounded-[`/`gap-[`/`duration-[`.
- `transition-all` ×71 where `transition-colors` would be cheaper.

### 4.5 z-index inventory & conflicts

| z | Elements |
|---|---|
| `z-[9999]` | FloatingSupportWidget FAB (`:9`), `fixed bottom-4 right-4` |
| `z-[60]` | ConfirmDialog (`:50,53`) |
| `z-50` | Navbar (`:86`), profile dropdown (`:179`), toasts (`UIContext.tsx:91`), Home scroll bar (`:703`) + syllabus modal (`:1279`), CourseDetail drawer/lightbox (`:1346/1548`), 5 admin modals, ExamResults/PeerSolutions modals |
| `z-40` | Navbar mobile drawer (`:246`) |
| `z-30` | Login success overlay (`:143`) |
| `z-10`/`-z-10` | decorative layers |

Conflicts: (1) **toasts `z-50` are permanently occluded by the FAB `z-[9999]`** in the same bottom-right corner; (2) ConfirmDialog `z-[60]` floats above every `z-50` modal (intended) but also above the FAB; (3) Navbar drawer `z-40` sits below all modals; (4) Home scroll bar `z-50` later-sibling paints over the sticky Navbar's bottom edge.

### 4.6 Proposed NEXT VERSION token system (analysis only)

Categories and the first migration targets:

| Category | Tokens to introduce | Maps today |
|---|---|---|
| color/brand | `--color-primary(600/700)`, `--color-accent(amber)`, `--color-cyan` | `bg-blue-600/700`, `bg-amber-500`, `#22d3ee` |
| color/semantic | `--color-success/warning/danger/info` + dark twins | `bg-green/red/yellow/blue-600` in toasts, statusConfig |
| surface | `--color-surface-0/1/2/3` (page/raised/overlay/floating) + light/dark | `slate-950/900/800`, `dark:bg-slate-900` |
| border | `--color-border`/`-strong` | `border-slate-800/700` |
| text | `--color-text-{primary,secondary,muted}` | `text-white/slate-300/slate-400/450/550/650` |
| type | `--text-2xs: 11px`, `--text-xs`, plus heading scale | `text-[11px]` ×369, `text-xs` |
| radius | `--radius-sm(0.75)/md(1)/lg(1.5)` | `rounded-lg/xl/2xl` (pick a 3-tier scale) |
| shadow | `--shadow-card`/`-hover`/`-glow` | `shadow-lg`, brand glows |
| spacing | keep Tailwind scale; add `--spacing-page` | `px-4` doubling |
| z-index | `--z-fab:9999`, `--z-dialog:60`, `--z-modal:50`, `--z-nav:50`, `--z-toast:70` (above FAB) | §4.5 |
| motion | `--animate-fade-in/…` + `@keyframes`; honor `prefers-reduced-motion` | no-op classes today |

**Migration rule (safe):** introduce tokens as parallel utilities, then swap class-by-class — never delete the `.light` chain until the last `.light`-reliant page is migrated.

---

## 5. Responsive Findings

### 5.1 Global behavior

- App wrapper (`App.tsx:49`): `container mx-auto px-4 py-8`. Every page adds its own `px-4` (some `px-2`/`px-6`/`px-8`) **and** its own `max-w-* mx-auto` → **double/triple horizontal padding everywhere**, and the `container` breakpoint cap (1280px at xl) fights page `max-w-7xl` on ≥1536px.
- `html,body { overflow-x: clip }` (`index.css:85-88`) masks overflow app-wide — clipping symptoms (AdminDashboard CMS header, PayPage QR) instead of fixing them.
- **`xl:` = 3 total (all Navbar gaps), `2xl:` = 0.** No large-screen work exists.

### 5.2 Per-page breakpoint table (sm/md/lg/xl/2xl counts)

| Page | sm | md | lg | Notes |
|---|---|---|---|---|
| Home | 12 | 30 | 8 | hero `hidden lg:block`; bento `md:grid-cols-6`; double-pads |
| LoginPage | 3 | 0 | 0 | `min-h-[85vh]`; `sm:grid-cols-2` checklist |
| Forgot/Reset | 1 | 0 | 0 | `max-w-md` cards |
| Verify | 5 | 0 | 0 | `break-all` cred IDs |
| Dashboard | 15 | 14 | 10 | stats `grid-cols-2 lg:grid-cols-4` (truncates at 375); tabs scroll |
| CourseDetail | 4 | 12 | 3 | sidebar `md:w-1/4 lg:w-1/3`; drawer `max-w-md` |
| **Quiz** | 0 | 0 | 0 | **zero breakpoints** |
| PracticeArena | 5 | 5 | 6 | navigator `grid-cols-5` 40px cells |
| **PayPage** | 0 | 0 | 0 | **zero breakpoints**; white `max-w-md` card |
| **Certificate** | 0 | 0 | 0 | fixed A4 canvas (NO-TOUCH) |
| AdminDashboard | 16 | 4 | 4 | `px-2` root; tables no min-w; tab strip `w-max` scroll |
| About/Contact/Terms/Privacy/Refund | 14/6/9/13/8 | 0-3 | 1 | `py-12 px-4 sm:px-6 lg:px-8` — **triple padding at lg** |
| NotFound | 2 | 0 | 0 | |
| Navbar | 1 | 3 | 4(+3 xl) | reference implementation |

### 5.3 Root-cause engineering issues

| Issue | Root cause | Files |
|---|---|---|
| Double/triple padding | App `px-4` + page `px-*` + page `sm:px-6 lg:px-8` | App.tsx:49, all pages |
| Admin tables unreadable ≤480 | no `min-w` on 6 of 7 tables | AdminDashboard.tsx:1364,1686,1989,2098; AdminPaymentTable |
| CMS accordion header clipped | `flex` no-wrap + global `overflow-x: clip` | AdminDashboard.tsx:1205-1227 |
| PayPage QR clipped ≤340px | `size={190}` + `p-4` vs card inner width | PayPage.tsx:278,328-330 |
| CourseDetail sidebar squeeze at md | `md:w-1/4` ≈185px | CourseDetail.tsx:586 |
| Markdown tables clipped | no `[&_table]` overflow rule in content pane | CourseDetail.tsx:1021,1024 |
| Practice stdout clipped | output pane no `overflow-x-auto`/`break-words` | CodePlayground.tsx:133-171 |
| Quiz/PayPage no responsiveness | zero breakpoints | Quiz.tsx, PayPage.tsx |
| `container` cap fights `max-w-7xl` | `container` width lock at xl | App.tsx:49 vs Home/Dashboard `max-w-7xl` |

### 5.4 Safe-fix posture per issue
Every fix is a class-level change confined to one file (or one shared component), none alters markup structure or API. Highest-risk items are the shell padding change (§12 C1 — touches every page) and admin table min-ws (structure-adjacent); both are scheduled with per-page verification.

---

## 6. State/Data Flow Findings

### 6.1 `useCourses` (`hooks/useCourses.ts`)
`{data:any|null, loading, error, refetch}` via `GET /courses` (`:13`). **`error` and `refetch` are never consumed** (`Dashboard.tsx:67`). Problems: silent error→empty state, 4 duplicate call sites, `data:any`, no abort. Refactor: generic, expose error/refetch to Dashboard, dedupe `/courses` via a shared cache or `useCourseDetail` accepting a course.

### 6.2 `useCourseDetail` (`hooks/useCourseDetail.ts`) — the worst offender
- Signature `(courseId) => {course, weeks, activeWeekIndex, setActiveWeekIndex, loadingSyllabus, loadingDetails, activeModuleDetail, isPaid, checkingPayment, currentWeek, refreshPaymentStatus, setIsPaid}`.
- 3 effects: syllabus `[courseId, currentWeek]` (`:40`), payment `[courseId, user]` (`:53`), module `[courseId, weeks, activeWeekIndex]` (`:68`).
- **Refetch cascade:** any `user` change (including the user's own quiz completion via `login(token, res.updatedUser)`, `Quiz.tsx:105`) → `currentWeek` change → syllabus refetch → fresh `weeks` identity → module refetch, re-clamping `activeWeekIndex` from localStorage → **the user can be jumped to a different week mid-session** ✅.
- **Race:** rapid week switching fires overlapping `GET /module/:week`; last-to-resolve wins, not current-index; no AbortController.
- **Silent failures:** `fetchSyllabus`/`fetchPaymentStatus` catch only `console.error` (`:35-36`, `:48-49`) → render looks like a valid empty course.
- **Inefficient:** downloads the whole `/courses` list to find one course (`:23-25`).
- **Duplicated payment state:** `isPaid`/`checkingPayment` here + `isPaid`/`checking` in `PayPage.tsx:46-47` + raw `setIsPaid` escape hatch (`useCourseDetail.ts:105`, called from `CourseDetail.tsx:1331`).
- **`refreshPaymentStatus` returns void** (`:82-84`); localStorage key not clamped back on write (`:30-34`).
- **Refactor:** drop `currentWeek` from syllabus deps (lift progress into the same query); AbortController/request-id for module fetch; expose an error state; single payment-status source (context or hook-level).

### 6.3 `useQuiz` (`hooks/useQuiz.ts`)
`{data, loading=false, error, refetch, submitQuiz}`. Problems: initial `loading:false` → blank flash before spinner (`Quiz.tsx:122→157`); **stale `data` not cleared on refetch** (`:11-12`) — the quiz timer can count down against old questions (`Quiz.tsx:55`); race on param change; shared `loading` for fetch AND submit → mid-submit UI swap; no 401 handling. Refactor: `loading:true` init, `setData(null)` on refetch, abort, split `fetching`/`submitting`.

### 6.4 `AuthContext`
Non-memoized value/functions (11 consumers re-render); `refreshUser` clears session on ANY error (`:29-33`); **no 401 response interceptor** (`api/index.ts`); `user:any`; StrictMode double `/auth/me`. Refactor: response interceptor dispatching a `auth:unauthorized` event → provider `logout()`; branch on `err.response?.status===401`; `useMemo`+`useCallback`; type `user`.

### 6.5 `UIContext`
- `settleConfirm` resolves inside a state updater (`:66`) — StrictMode double-invoke risk.
- **`busy` is dead** (`:60`,`:71-74`) — async confirmations snap shut with no spinner.
- **Re-entrancy hang:** a second `confirmDialog()` while one is open overwrites the pending `resolve`; the first caller's promise never settles (`:58-62`).
- Toast id `Math.random()` (`:45`); context value unmemoized → all 14 consumers re-render per toast.
- Refactor: resolve via ref outside updater; implement or remove `busy`; queue/guard re-entrancy; `crypto.randomUUID()`; split toast/confirm contexts or memoize.

### 6.6 `ThemeContext`
FOUC (effect-applied class); garbage-tolerant `'blue'` theme silently treated as light (`:15`, effect else-branch adds `.light`); uncaught `localStorage.getItem` (`:14`); default hardcoded `'dark'` with no `prefers-color-scheme` fallback. Refactor: try/catch + validation + inline pre-paint script in `index.html`.

### 6.7 Systemic state findings

| Category | Finding |
|---|---|
| Duplicated state | `isPaid` ×3; `data`/`loading`/`error` re-implemented in every page that doesn't use a hook |
| Unnecessary state | `scrolled` Navbar listener; per-page `page`/`search` where query params would do (LeaderboardTab, Referrals) |
| Derived-state-as-state | `currentWeek` is derived (`useCourseDetail.ts:16-17`) but its change re-triggers refetches |
| Belongs in context | payment status, courses cache, toasts already contextualized |
| Duplicated API calls | `/courses` ×4, `/payments/status` ×3, `GET /auth/me` on every load |
| Race conditions | useCourseDetail module fetch; useQuiz param change |
| Stale state | useQuiz stale data; AuthContext stale `user` until reload |
| Silent errors | useCourses.error; useCourseDetail syllabus/payment catches; PayPage initial status; Home catalog fallback; Admin per-tab fetch failures console-only |
| Layout shifts | Dashboard daily section; Practice skeleton→results; CourseDetail double-loading layer |
| Inconsistent error handling | toast vs inline vs silent across 5 styles (§2.6) |

---

## 7. Accessibility Findings

Ranked (full inventory in Phase 2 §8; new deep-dive specifics below):

| Sev | Issue | Evidence |
|---|---|---|
| CRITICAL | Quiz blank page on empty question set | `Quiz.tsx:157` |
| HIGH | Label↔input association: only one `htmlFor` in `pages/` | `Verify.tsx:181,186` (the good one); `Input.tsx:25-29` unbound; Contact, PayPage, admin modals, CourseDetail textareas |
| HIGH | No `h1`: LoginPage (`:188` h2), Forgot, Reset, Verify-email, CourseDetail, Quiz | |
| HIGH | Clickable `div`s not keyboard-operable: `Card` (`Card.tsx:30` onClick), `CourseCard` (`:132-133`), topic/chapter rows (`CourseDetail.tsx:644,779`) | |
| HIGH | 9+ overlays lack `role=dialog`/`aria-modal`/focus trap/scroll-lock/focus-restore (only ConfirmDialog partial) | Admin modals ×5, Home:1279, CourseDetail:1346/1548, ExamResultsModal, PeerSolutionsModal |
| HIGH | Toasts: no `aria-live`, unlabeled ×, color-only | `UIContext.tsx:91-106` |
| HIGH | 160 `<button>`s without `type` (default submit in forms) | AdminDashboard ~42, CourseDetail ~25 |
| MEDIUM | `text-[11px]` ×369 on `slate-400/450/500/550/650` ≈2.6-4.5:1 | app-wide |
| MEDIUM | Unlabeled admin icon buttons; nested-interactive accordion (`role="button"` div wrapping real buttons `AdminDashboard.tsx:1182-1225`); sortable `<th>` not keyboard-accessible (`:1368-1382`) | |
| MEDIUM | `<Link>` wrapping `<Button>` (invalid) | `ForgotPasswordPage.tsx:93-97`, `ResetPassword.tsx:108-112`, Navbar |
| MEDIUM | No `prefers-reduced-motion` anywhere; no `role="timer"` on quiz timer; SkillRadar SVG no accessible name; CodePlayground textarea no label; CourseCard syllabus toggle no `aria-expanded` | |
| MEDIUM | Light-mode contrast: `Privacy.tsx` `text-slate-355`; `Contact.tsx` `slate-250/indigo-450/405/emerald-450` not overridden | |
| LOW | Tabs lack tablist/tab/aria-selected; `focus:outline-none` accordion trigger (Home:1321); images no dims/alt mostly fine |

**Keep:** Navbar aria-expanded/haspopup/Escape + role=menu; ConfirmDialog role/aria; Spinner `role="status"`; ProgressMap node buttons + focus-visible ring; QuizQuestion radio+label; global `:focus-visible` (`index.css:60-68`).

---

## 8. Performance Findings

Classification per the Phase 3 rule (REAL / POSSIBLE / PREMATURE):

| Class | Finding | Evidence |
|---|---|---|
| REAL | Home + LoginPage eager with ~1,383 lines incl. ~460 lines inline curriculum and a second auth form | `App.tsx:6-7` |
| REAL | LoginPage full-screen particle canvas (rAF, 75 pts, O(n²) lines, mousemove) for the whole session | `FloatingParticles.tsx`, `LoginPage.tsx:123` |
| REAL | 5 `repeat: Infinity` framer animations + 3 mesh blobs on Home, no reduced-motion gate | `Home.tsx:563,717,730,743,855` |
| REAL | `/logo.png` 214 KB on every route, no `width/height`, no `loading="lazy"`; 5 `<img>` total, none lazy | Navbar:99, NotFound:20, Certificate:400/457 |
| REAL | ~1.06 MB dead/unused images (banner 787 KB, website_img 216 KB, assets/*) | public/, src/assets |
| REAL | Admin renders all rows, no pagination/virtualization; Referrals O(n²) filter per row | `AdminDashboard.tsx:2028`; tables |
| REAL | `useCourseDetail` cascading refetch + 5 sequential GETs per mount; useQuiz stale-data refetch | §6.2/6.3 |
| REAL | No-op animation classes pretend to animate (`animate-fade-in` ×11 etc.) — dead weight + broken expectation | index.css has no `@keyframes` |
| POSSIBLE | framer-motion is in every route's bundle via Navbar static import — fine now, worth checking after splitting Navbar | `Navbar.tsx` imports motion |
| POSSIBLE | `transition-all` ×71 where `transition-colors` suffices (GPU cost on hover-heavy admin lists) | app-wide |
| POSSIBLE | 21 files use framer-motion; a single shared motion-config (spring scale) exists informally — codify it | components |
| PREMATURE | Micro-optimizing the 40-70 component re-renders from unmemoized contexts — fix the obvious (memoize values) but don't go beyond | AuthContext/UIContext |
| PREMATURE | Adding virtualization to leaderboard/dashboard lists before pagination exists (add pagination first — already present in LeaderboardTab) | LeaderboardTab |

---

## 9. Component Refactor Map

### 9.1 Proposed canonical APIs (NEXT VERSION — not implemented)

**FOUNDATION**

```
Button
 ├─ variants: primary | secondary | accent | ghost | outline | danger
 ├─ sizes:    sm | md | lg
 ├─ isLoading (aria-busy, disabled, keeps width) | disabled
 ├─ leftIcon | rightIcon
 ├─ fullWidth
 ├─ type: default 'button'          ← NEW default (fixes 160 untyped buttons)
 └─ forwardRef
```

```
Input / FormField (merge)
 ├─ label + auto id = useId()        ← binds htmlFor/id (fixes app-wide)
 ├─ error → aria-invalid + aria-describedby
 ├─ leftIcon | rightIcon | containerClassName
 └─ forwardRef
```

```
Card
 ├─ variant: default | glass | accent | outline
 ├─ shadow?: boolean (default true)  ← make opt-out; today always-on
 ├─ as?: 'div' | 'article' | 'section'
 └─ if onClick: role="button" + tabIndex + onKeyDown (Enter/Space)   ← a11y fix
```

```
Badge: variants(7) + sizes(sm/md) + icon — unchanged API, keep
Dialog (NEW primitive — absorbs ConfirmDialog + all 9 overlays)
 ├─ open | onClose | title
 ├─ role="dialog" aria-modal focus trap (initial focus + restore) scroll lock Escape
 ├─ size: sm | md | lg | xl | full (maps max-w)
 ├─ footer: action slot; busy prop (async confirm support)
 └─ replace ConfirmDialog internals first; then migrate each modal
```

```
Toast (system, in UIProvider)
 ├─ aria-live="polite" on container, role="status"/"alert" per type
 ├─ dismiss button aria-label="Dismiss notification"
 ├─ id via crypto.randomUUID()
 ├─ z-index above FAB (e.g. z-[70]) and reposition clear of FAB corner
 └─ severity → icon + label (fixes the 3 wrong-severity toasts)
```

```
Skeleton: + parent role="status" at call sites; Spinner: keep (already role=status)
```

```
Tabs (NEW shared): role="tablist" + role="tab" + aria-selected + arrow-key nav + panel id
  ← replaces Dashboard tab bar and AdminDashboard tab strip + segmented toggles
Select (NEW): styled wrapper over native <select> with label binding (admin needs 3)
FormField: delete alias; use Input (with merged API above)
Table (NEW AdminTable): header config + min-w token + sortable<th>(aria-sort+keyboard) + row actions + pagination slot + overflow-x-auto built-in
```

**LAYOUT (NEW)**
```
PageContainer: single source of padding/max-width (replaces App.tsx:49 wrapper +
 every page's own px-*/max-w-* duplication); props: maxWidth ('prose'|'md'|'lg'|'xl'|'7xl'), padded
Section: vertical rhythm + optional eyebrow/heading
Stack / Grid: flex/grid helpers
ResponsiveTable: wraps overflow-x-auto + min-w strategy
```

**FEEDBACK (NEW)**
```
LoadingState (skeleton + label), EmptyState (icon+title+desc+CTA), ErrorState (title+detail+retry)
 ← absorbs Dashboard empty/error, Admin "No … yet", CourseDetail "No doubts", PracticeArena Retry, PayPage error banner
```

**DOMAIN (keep + trim)**
```
CourseCard (remove dead `tags`; unify catalog/dashboard branches or split into
  CatalogCourseCard / DashboardCourseCard), CourseHero, QuizQuestion, QuizHeader,
  ExamResultsModal → Dialog, PeerSolutionsModal → Dialog, CodePlayground (add textarea label),
  SkillRadar (add role="img"/aria-label), ProjectStatusCard (wire Submit Now or remove),
  SyllabusManager/ProgressMap (keep), EnrollmentPanel (drop dead onPaymentSuccess),
  AdminPaymentTable → AdminTable, LeaderboardTab → Tabs+pagination primitives
```

### 9.2 Which existing components move where

| Move into | Components |
|---|---|
| FOUNDATION | Button, Input(+FormField), Card, Badge, Dialog (from ConfirmDialog), Toast (from UIContext), Tabs (new), Select (new) |
| LAYOUT | PageContainer (new), Section/Stack/Grid (new), ResponsiveTable (new) |
| FEEDBACK | LoadingState, EmptyState, ErrorState (new; Skeleton/Spinner stay FOUNDATION) |
| DOMAIN | CourseCard, CourseHero, QuizQuestion, QuizHeader, ExamResultsModal, PeerSolutionsModal, CodePlayground, SkillRadar, ProjectStatusCard, SyllabusManager, ProgressMap, EnrollmentPanel, AdminPaymentTable, LeaderboardTab |
| DELETE | QuizResults, RegisterPage, config/projects.ts, src/assets/*, FormField alias, no-op animation classes, dead props |

---

## 10. P0 / P1 / P2 / P3 Priority Matrix

| ID | Item | Priority | Impact | Risk | Effort |
|---|---|---|---|---|---|
| P0-1 | Register missing shade tokens (`slate-850/855/750/905/655/405`, `blue-450`, `rose-450`, `to-blue-750`) in `@theme` | **P0** | Fixes dark-mode render across ~96 sites in 6 files | Very low (one CSS block; class names already used) | S |
| P0-2 | `useQuiz`: init `loading:true`, `setData(null)` on refetch, split fetch/submit loading | **P0** | Fixes quiz blank flash + stale-question timer + mid-submit UI swap | Low | S |
| P0-3 | Quiz page: empty-state (no blank `null`), confirm-on-cancel, early submit | **P0** | Unblocks a dead user flow | Low | S-M |
| P0-4 | ConfirmDialog/`UIContext`: fix re-entrancy hang + resolve-outside-updater; implement or delete `busy` | **P0** | Prevents hung promises on double actions (admin deletes) | Low | S |
| P0-5 | Toast: `aria-live`, labeled dismiss, `randomUUID`, z-above-FAB, severity icons; fix 3 wrong-severity toasts | **P0** | Feedback correctness + a11y | Low | S |
| P1-1 | 401 response interceptor → AuthContext logout; only clear session on 401 | **P1** | Fixes expired-session UX + transient-logout | Medium (auth) | S-M |
| P1-2 | Button: default `type="button"`, `aria-busy`, forwardRef; then migrate inline button sites page-by-page | **P1** | Form-submit safety + consistency | Low (mechanical) | M |
| P1-3 | Input/FormField merge: `useId` binding, `aria-invalid`/`aria-describedby`; migrate Contact/PayPage/admin forms | **P1** | a11y + one form primitive | Low | M |
| P1-4 | Dialog primitive + migrate the 9 overlays (ConfirmDialog first) | **P1** | Focus trap/scroll-lock/Escape everywhere | Medium (modal regressions) | L |
| P1-5 | PageContainer (kill double/triple padding + container-cap conflict) | **P1** | Consistent layout; fixes spacing drift | Medium (touches every page) | M |
| P1-6 | Admin data model: per-tab lazy fetch + refetch-on-tab-switch; real Analytics or remove tab | **P1** | Correct admin UX (stale/fake data) | Medium | L |
| P1-7 | Admin tables: `min-w` strategy + search (users/payments/messages) + pagination | **P1** | Admin usable on desktop+phone | Low-Medium | L |
| P1-8 | PracticeArena: timer-state machine (pause in coding mode; single submit), kill infinite re-submit loop, retry-on-empty | **P1** | Correctness | Medium | M |
| P1-9 | PayPage: backend-driven pricing (remove FE coupon map + missing 50% cap), FAILED branch, QR sizing, labels | **P1** | Payment correctness + mobile | Medium (payment UI only) | M |
| P1-10 | `useCourseDetail`: drop `currentWeek` dep, abort/ordering guard, expose error state, single payment source | **P1** | Fixes refetch cascade + week-jump + races | Medium | M |
| P2-1 | Dead-code sweep (files, props, no-op animation classes, unused assets) | P2 | Housekeeping | Low | S |
| P2-2 | h1s on 6 pages; heading-order on Home | P2 | a11y | Low | S |
| P2-3 | Card keyboard-accessibility; CourseCard/ProjectStatusCard fixes | P2 | a11y | Low | S |
| P2-4 | Type scale: `text-[11px]`→`text-xs` floor migration, heading scale tokens | P2 | legibility | Low-Medium | M |
| P2-5 | Reduced-motion: `prefers-reduced-motion` gate on Home/Login/canvas + tokenize animation classes | P2 | a11y + perf | Low | S-M |
| P2-6 | Home: consume `config/courses.ts` + `useCourses`; remove mock fallback; share AuthForm; mobile hero | P2 | removes 3rd source of truth + fake data | Medium | L |
| P2-7 | Dashboard: render `useCourses.error`, wire Refresh→refetch, dead button, daily skeleton, truncation | P2 | UX correctness | Low-Medium | M |
| P2-8 | CourseDetail: view-state restore, consolidate 5 GETs, h1, markdown-table overflow, surface module-quiz CTA | P2 | UX + correctness | Medium | L |
| P2-9 | Static pages: adopt primitives + fix light-mode contrast (Privacy/Contact) | P2 | consistency + a11y | Low | M |
| P2-10 | Responsive hardening: admin CMS header wrap, Quiz/PayPage breakpoints, 44px touch targets | P2 | mobile | Low-Medium | M |
| P3-1 | Performance: lazy logo, image dims/lazy, remove dead images, trim `transition-all` | P3 | perf | Low | S |
| P3-2 | Memoize context values (Auth/UI/Theme); `useCallback` fns | P3 | perf | Low | S |
| P3-3 | Verify `useSearchParams` + button destinations; button-in-anchor cleanup | P3 | correctness | Low | S |
| P3-4 | Split AdminDashboard into routed sub-screens on the new primitives | P3 | maintainability | High | XL |

---

## 11. EduNexus Pro Next Frontend Architecture

Stay on React 19 + Vite 8 + TypeScript + Tailwind v4 + Context API + axios + framer-motion + react-router 7. No new framework, no state library required (cache needs are met by a lightweight course/payment context; react-query is optional and NOT required).

```
CURRENT (today)
  App.tsx shell (container px-4) + pages that each double-pad
  index.css: @theme(dead tokens) + .light !important chain + 6 unregistered shades
  pages → inline api.* + per-page loading/error/empty
  AdminDashboard (2650) / CourseDetail (1588) / Home (1383) monoliths
  26 components, 9+ bespoke overlays, FormField=Input alias, QuizResults dead
  Quiz/PayPage zero-breakpoint; admin tables no min-w

        ↓  STEP 0-4   FOUNDATION REFACTOR
  Register missing shades; theme tokens + pre-paint script (kill FOUC);
  Button/Input/Card/Dialog/Toast/Tabs/Select primitives; 401 interceptor;
  context value memoization; useQuiz/useCourseDetail correctness fixes;
  dead-code sweep

        ↓  STEP 5-8   DESIGN + LAYOUT SYSTEM
  Token-driven themes (light/dark via dark: variants), .light chain retired
  only after last consumer migrates; PageContainer/Section/Stack/Grid/
  ResponsiveTable; type scale (11px floor) + radius/shadow/z tokens

        ↓  STEP 9-13  DOMAIN COMPONENTS
  AdminTable, StatusBadge, CourseBadges, EmptyState/ErrorState/LoadingState,
  CourseCard split, CourseHero/QuizQuestion/etc. on primitives; overlays → Dialog

        ↓  STEP 14-21 PAGE REFACTOR (P1 pages first)
  Quiz, PracticeArena, PayPage, Dashboard, CourseDetail, Home, Verify,
  static pages — each moved onto primitives with routes/APIs untouched

        ↓  STEP 22-24 RESPONSIVE HARDENING
  PageContainer everywhere; admin table min-w; CMS header wrap; breakpoints
  for Quiz/PayPage; 44px targets; toast/FAB z-order

        ↓  STEP 25-26 ACCESSIBILITY HARDENING
  h1s, label binding, keyboard cards, dialog focus, reduced-motion, contrast

        ↓  STEP 27-28 PERFORMANCE PASS
  lazy logo + image dims, remove dead assets, context memoization, split
  AdminDashboard (last)

EduNexus Pro Next
```

Rules enforced at every step: **no route/API/contract changes · Certificate never touched · one concern per step · each step independently shippable and verifiable.**

---

## 12. Exact Implementation Sequence

Each step is independently shippable. `R = risk`, `V = validation`.

**STEP 1 — Register missing shades**
Files: `src/index.css` (`@theme`). Changes: add `slate-850/855/750/905/655/405`, `blue-450`, `rose-450`, `to-blue-750`-style tokens (a 2×10 shade set + gradient stop). Why: 96 dead dark-mode classes become real (P0-1). Deps: none. R: very low (additive). Result: AdminDashboard/CourseDetail/Dashboard/PracticeArena dark-mode renders correct borders/backgrounds. V: `grep -c 'slate-850'` matches now render; screenshot dark Admin + CourseDetail.

**STEP 2 — Theme bootstrap kill-FOUC**
Files: `index.html` (inline script), `ThemeContext.tsx:13-16`. Changes: read+validate `theme`/`prefers-color-scheme` in a pre-paint script that sets `.dark|.light` on `<html>` before bundle; try/catch storage. Why: no light flash (P2). Deps: Step 1. R: low. V: reload in dark preference → no flash.

**STEP 3 — useQuiz correctness**
Files: `hooks/useQuiz.ts`. Changes: `loading:true` init (`:6`), `setData(null)` on refetch (`:11`), split `fetching`/`submitting`, abort on param change. Why: fixes quiz blank flash + stale timer + mid-submit swap (P0-2). Deps: none. R: low. V: navigate quiz→quiz, watch no stale questions; submit keeps question on screen.

**STEP 4 — ConfirmDialog + UIContext correctness**
Files: `context/UIContext.tsx`, `components/atoms/ConfirmDialog.tsx`. Changes: resolve via ref outside updater (`:64-69`); re-entrancy guard (queue or reject) (`:58-62`); implement `busy` (async confirm shows spinner) or remove the prop; toast id `randomUUID` (`:45`); memoize context value. Why: prevents hung promises + dead busy API (P0-4). Deps: none. R: low-medium (admin confirm flows). V: double-click destructive action → single resolution, dialog shows in-flight state.

**STEP 5 — Toast system**
Files: `context/UIContext.tsx:91-106`. Changes: `aria-live="polite"` container, `role=status/alert` per type, labeled dismiss (`aria-label="Dismiss notification"`), raise z above FAB (`z-[70]`) and offset from corner, severity→icon+label; fix 3 wrong-severity toasts (`AdminDashboard.tsx:189,595,683`). Why: feedback a11y + visibility (P0-5). Deps: Step 4. R: low. V: toast visible while FAB open; screen reader announces.

**STEP 6 — 401 handling**
Files: `src/api/index.ts`, `context/AuthContext.tsx:18-37`. Changes: response interceptor dispatches `window.dispatchEvent(new Event('auth:unauthorized'))` on 401 (and clears token); `refreshUser` only clears session when `err.response?.status === 401` (`:29-33`); memoize value/functions. Why: expired sessions + transient-logout bug (P1-1). Deps: none. R: **medium — auth.** V: expire token → one redirect to login, no per-page errors; network blip keeps user logged in.

**STEP 7 — Button normalization**
Files: `components/atoms/Button.tsx` (+ `index.css` if needed). Changes: `type='button'` default, `aria-busy={isLoading}` + keep spinner visually, forwardRef, dedupe `transition-all` (`:24`), `useId`-free (Button needs no id). Why: 160-untyped-button + loading a11y + consistency (P1-2). Deps: Step 1. R: low (verify no submit-intent button relies on default). V: forms no longer double-submit; `aria-busy` present while loading. **Then migrate inline button sites page-by-page** (About:111, NotFound:43/51, Contact:252, Verify:132/156/199, Dashboard:366/500, AdminDashboard:780/815/831/1017/1157/1170/1648/1655/1805/2353/2359/2442/2448/2541/2547/2627/2633, CourseDetail:692/1156/1317/1318/1502/1510/1530, Home:792/1055, PracticeArena:261/268/329/339/435/516/528/536/591/597, PayPage:234/267/366/383/388, Certificate excluded).

**STEP 8 — Input/FormField merge + label binding**
Files: `components/atoms/Input.tsx`, delete `components/molecules/FormField.tsx`. Changes: `useId` to bind label↔input; `aria-invalid` + `aria-describedby` on error; forwardRef; keep `leftIcon/icon` alias. Why: app-wide label a11y + one form primitive (P1-3). Deps: none. R: low. V: clicking label focuses input (all pages using Input). **Then migrate inline forms**: Contact.tsx:200-217/238, Verify (keep its correct pair), PayPage:377-383, CourseDetail:1296/1518-1526, AdminDashboard selects/textareas/modals (~15 sites).

**STEP 9 — Card + clickable-div a11y**
Files: `components/atoms/Card.tsx`, `components/molecules/CourseCard.tsx`. Changes: `shadow` opt-out prop; when `onClick|hoverable` → `role="button"`/`tabIndex`/Enter+Space. Remove dead `CourseCard.tags` (`:25`). Why: a11y + shadow policy (P2-3). Deps: Step 7. R: low. V: keyboard can activate CourseCard/topic cards.

**STEP 10 — Dialog primitive**
Files: `components/atoms/Dialog.tsx` (new); refactor `ConfirmDialog.tsx` to use it. Changes: role=dialog, aria-modal, focus trap (initial focus, trap Tab, restore on close), scroll lock, Escape, size map, `busy` support. Why: foundation for all 9 overlays (P1-4). Deps: Steps 4. R: medium (modal behavior). V: ConfirmDialog has full keyboard flow + scroll lock; existing confirm flows green.

**STEP 11 — Migrate overlays to Dialog**
Files: `Home.tsx:1279`, `CourseDetail.tsx:1346/1548`, `AdminDashboard.tsx:1525/2197/2373/2462/2562`, `ExamResultsModal.tsx`, `PeerSolutionsModal.tsx`. Changes: swap backdrop/panel markup for `<Dialog>`, keep content/state identical. Why: a11y + dedupe 9 scaffolds (P1-4). Deps: Step 10. R: medium. V: each modal: tab-trap, Esc, scroll-lock, focus return; screenshot parity.

**STEP 12 — PageContainer**
Files: `components/layout/PageContainer.tsx` (new), `App.tsx:49`, every page root. Changes: one component owning `max-w-* mx-auto px-* py-*`; App renders `<PageContainer>`; pages drop their own `px-*/max-w-*`. Why: kills double/triple padding + container-cap conflict (P1-5). Deps: Steps 1-2. R: **medium — touches every page.** V: horizontal padding visually identical at 375/1024/1440; `max-w-7xl` pages reach 7xl at ≥1536.

**STEP 13 — Tabs + Select + Table primitives**
Files: `components/foundation/Tabs.tsx`, `Select.tsx`, `components/layout/ResponsiveTable.tsx` (new). Changes: ARIA-tablist/tab/aria-selected/arrow keys; labeled select; table with header-config + built-in `overflow-x-auto` + optional `min-w` + sortable-th (aria-sort + keyboard) + pagination slot. Why: admin + dashboard tab/table standardization (P1-7). Deps: Steps 7-8. R: low-medium (admin UI only). V: Dashboard tabs and Admin tab strip keyboard-navigable; admin tables scroll correctly.

**STEP 14 — Quiz page**
Files: `pages/Quiz.tsx`, `components/organisms/QuizHeader.tsx`, `components/molecules/ExamResultsModal.tsx`. Changes: empty-state (`:157` — never `return null`), cancel confirm, submit button always visible (early submit), h1, ExamResultsModal→Dialog (from Step 11). Why: dead-flow + a11y (P0-3). Deps: Steps 3,10,11. R: low. V: empty question set renders a friendly state; cancel asks; early submit posts.

**STEP 15 — PracticeArena**
Files: `pages/PracticeArena.tsx`. Changes: timer state machine (mode-aware — pause/submit in coding mode; `:151-165` loop guard: single submit, no re-fire on failure); retry-on-empty; 44px navigator targets; use `Button`/`Card` from Steps 7/9. Why: correctness + touch (P1-8). Deps: Steps 7,9. R: medium (timer logic). V: coding mode never auto-submits empty MCQ; failed submit shows error once, no toast storm.

**STEP 16 — PayPage**
Files: `pages/PayPage.tsx`. Changes: remove FE coupon map (`:95-111`) — show backend-computed price only; add FAILED-payment branch; QR responsive (`size` prop from container width, ≤340px safe); bind UPI/coupon labels; replace raw markup with primitives; keep white card visually but route it through a `light-card` token. Why: payment correctness + mobile (P1-9). Deps: Steps 7,8,12. R: medium (payment UI only — no backend change). V: coupon no longer double-computes; FAILED state renders; QR fully visible at 320px; price always equals `/payments/status` value.

**STEP 17 — Dashboard**
Files: `pages/Dashboard.tsx`, `components/molecules/ProjectStatusCard.tsx`. Changes: render `useCourses.error` (`:67`) + Refresh→`refetch()`; wire or remove Submit-Now (`ProjectStatusCard.tsx:67`); daily-section skeleton (`:424`); stat-label truncation (`:321/323`); tabs→Step 13; remove double padding via PageContainer. Why: silent-error + dead-end + layout shift (P2-7). Deps: Steps 7,12,13. R: low-medium. V: failed `/courses` shows error not "No tracks"; Refresh refetches without reload; no layout jump.

**STEP 18 — CourseDetail**
Files: `pages/CourseDetail.tsx`, `hooks/useCourseDetail.ts`. Changes: hook fixes from §6.2 (drop `currentWeek` dep; abort/ordering; error state; single payment source — `setIsPaid` becomes internal); view-state restore (persist + restore, `:209`); h1; markdown-table overflow (`:1021`); move module-quiz CTA up; replace raw buttons/cards (Steps 7/9) and drawer/lightbox (Step 11). Why: refetch cascade + UX (P1-10, P2-8). Deps: Steps 7,9,11,12. R: medium (state-heavy page). V: returning to a course restores last view; no week-jump after quiz; module fetch failure shows an error; markdown tables scroll.

**STEP 19 — Admin data model**
Files: `pages/AdminDashboard.tsx` (`:510-521`). Changes: per-tab lazy fetch on first open + refetch on tab switch; Analytics → real data or remove tab (`:1813-1908`); toast-severity fixes already in Step 5. Why: stale/fake admin data (P1-6). Deps: Steps 5. R: medium. V: opening Analytics no longer pre-fetches it; switching tabs refreshes counts; no console errors on tabs never opened.

**STEP 20 — Admin tables + CMS**
Files: `AdminDashboard.tsx:761-798/849-885/1364/1685/1989/2098`, `components/organisms/AdminPaymentTable.tsx`. Changes: min-w strategy via Step 13; search for users/payments/messages; pagination; CMS accordion header re-flow (wrap buttons, `:1182-1225`); role-promote confirm; sortable-th a11y. Why: admin usability (P1-7). Deps: Steps 13. R: medium (admin only). V: users/payments tables readable at 375 with horizontal scroll; CMS header fully tappable at 320; keyboard sorts.

**STEP 21 — Static pages + Home**
Files: `pages/About/Contact/Terms/Privacy/Refund/NotFound.tsx`, `pages/Home.tsx`. Changes: static pages adopt Card/Badge/Button/Input primitives + fix light-mode contrast (Privacy `slate-355`, Contact `slate-250/indigo-450/405/emerald-450`); Home: consume `config/courses.ts`+`useCourses`, remove mock fallback (`:659-666`), share AuthForm (Step 22), mobile hero (`:822`), heading order (`:837/872`). Why: consistency + honesty (P2-9, P2-6). Deps: Steps 7,8,12. R: low (static) / medium (Home). V: all static pages use shared components; light mode fully readable; Home shows one course source.

**STEP 22 — Shared AuthForm**
Files: `components/organisms/AuthForm.tsx` (new). Changes: extract LoginPage's form (mode prop) → used by `/login`, `/register`, and Home's inline form (`Home.tsx:1148`). Why: kills second auth form (P2-6). Deps: Steps 7,8. R: low-medium (auth UX must match exactly). V: all three entry points behave identically; existing credentials still work.

**STEP 23 — Responsive hardening**
Files: `AdminDashboard.tsx` CMS header, `PayPage.tsx` QR (done Step 16), `Quiz.tsx`/`PayPage.tsx` breakpoints, touch targets 40→44px (`PracticeArena.tsx:435`, navigator). Why: mobile (P2-10). Deps: Steps 12,15,16. R: low-medium. V: 320/375/414/768/1024/1280/1440 sweep shows no clip, no 40px targets, no truncation.

**STEP 24 — z-index + scrollbar + overflow cleanup**
Files: `App.tsx`, `index.css`, `FloatingSupportWidget.tsx`, `UIContext.tsx`. Changes: standardize z via tokens (toast above FAB), fix drawer-vs-modal z (drawer ≥ modal), reassess `overflow-x: clip` masking once underlying fixes land. Why: layering correctness (P2). Deps: Steps 5,23. R: low. V: toasts never hidden; drawer always above modals; no accidental horizontal scroll regressions.

**STEP 25 — Accessibility hardening**
Files: h1s on LoginPage/Forgot/Reset/Verify-email/CourseDetail/Quiz; label binding (done Step 8); clickable-div keyboard (Step 9); dialog focus (Step 10); `prefers-reduced-motion` gate + remove/fix no-op animation classes; `text-[11px]`→`text-xs` floor; heading order. Why: a11y + contrast (P2-2/4/5). Deps: Steps 7-12. R: low. V: axe-core/Lighthouse a11y score per screen; keyboard-only walkthrough of Quiz, CourseDetail, Admin.

**STEP 26 — Type/radius/shadow/z token rollout**
Files: `index.css` `@theme` + systematic class swaps per §4.6. Changes: introduce token categories; migrate colors/radii/shadows/micro-type class-by-class; keep `.light` chain until last consumer migrated. Why: single design vocabulary (P2-4). Deps: Steps 1,2. R: low (mechanical). V: no hardcoded hexes added; `text-[11px]` count → 0; tokens grep-usages > 0.

**STEP 27 — Performance pass**
Files: `Navbar.tsx:99`, `NotFound.tsx:20`, `Certificate` excluded; remove `public/edunexus_banner.png` + `website_img` + `src/assets/*`; add `width/height` + `loading="lazy"` to logo imgs; trim `transition-all`→`transition-colors`; reduce Home infinite animation count; disable FloatingParticles below lg. Why: perf (P3-1). Deps: Steps 12,25. R: low. V: bundle-size diff; LCP improves; no visual regression on Home/Login.

**STEP 28 — Split AdminDashboard (last)**
Files: `pages/AdminDashboard.tsx` → `pages/admin/{Transactions,CMS,Users,Referrals,Analytics,Messages,Settings,Review}.tsx` sharing Step-9/13 primitives. Why: maintainability (P3-4). Deps: Steps 13,19,20. R: high (largest refactor) → only after everything else green. V: route `/admin` unchanged; each tab is its own file; feature parity verified tab-by-tab.

---

## 13. Do-Not-Touch List

| # | Area | Reason / rule |
|---|---|---|
| 1 | **Certificate page** (`pages/Certificate.tsx` + its inline `<style>`) | User-mandated HARD NO-TOUCH — never appears in any step |
| 2 | Backend APIs & contracts | No endpoint/method/payload changes; frontend must keep calling the same strings (see §2.2 inventory) |
| 3 | Payment business rules | Coupon map, 50% cap, amount computation live in `backend/src/services/paymentService.ts` — **frontend may only display backend-computed values, never re-derive** (Step 16 removes, does not re-implement) |
| 4 | Authentication contracts | JWT in localStorage, `login(token,user)` signature, `/auth/me` shape, role string `'ADMIN'`/`'USER'` — preserved |
| 5 | Existing routes & route guards | `App.tsx:56-77` paths, ProtectedRoute/AdminRoute redirect behavior |
| 6 | Production data | No reseeds, no DB writes; localStorage keys (`token`,`user`,`theme`,`last_viewed_week_*`) must keep working |
| 7 | User flows | Enroll→pay→verify→certificate, quiz→progress, practice→leaderboard, admin flows — behavior parity required |
| 8 | `config/courses.ts` + `config/projects.ts` shape | CourseCard/Admin track dropdown depend on `CourseConfigItem`; projects.ts is dead — deleting it is allowed, changing the type is not |
| 9 | `.light` override chain | Keep until the LAST `.light`-reliant page is migrated (Step 26 removes only then) |
| 10 | Navbar responsive behavior + FloatingSupportWidget position | Reference implementations; z-order changes only via Step 24 tokens |
| 11 | ExamResults/PeerSolutions business content | Breakdown grouping, privacy toggle, retry/certificate actions — only the overlay shell changes (Step 11) |
| 12 | `index.html` fonts | Lato/JetBrains Mono load lines — changing to Inter is a deliberate later decision, not part of this sequence |
| 13 | Issue-numbered comments (`#8…`…`#101`) | They track a GitHub workflow; don't strip them during mechanical edits |

---

## 14. Risk Register

| Risk | Area | Prob | Impact | Mitigation |
|---|---|---|---|---|
| Button `type='button'` default breaks a form-submit intent | Auth/forms | Med | High | Step 7 verification: grep every `<Button` inside `<form>` for explicit `type="submit"` before rollout; Login/Home/Contact submit buttons get explicit `type="submit"` |
| PageContainer changes spacing subtly on some pages | Layout | Med | Med | Step 12: screenshot-diff 375/1024/1440 per page; land per-page not in one sweep |
| 401 interceptor logs out users incorrectly | Auth | Med | High | Only clear on `status===401`; keep cached `user` on network errors; feature-flag via console test first |
| Dialog focus-trap/scroll-lock regresses existing overlays | Modals | Med | Med | Step 11 per-overlay: keyboard walk + screenshot parity before next overlay |
| `useCourseDetail` dep change re-orders data loading | CourseDetail | Med | Med | Step 18: verify week-jump gone, module fetch still resolves; keep payment status first |
| PracticeArena timer rework breaks quiz timing | Practice | Med | Med | Preserve 15-min wall-clock semantics in MCQ mode; unit-test the state machine |
| PayPage pricing display change confuses existing users | Payment | Low | High | Show backend price + still show coupon field that only sends a code (no client math); verify against `/payments/status` |
| Admin per-tab fetch change leaves a tab stale | Admin | Med | Med | Refetch on tab activate + manual reload kept; toast on fetch error |
| Admin table min-w changes break narrow layouts | Admin | Low | Med | Test 320/375; scroll rather than clip |
| `transition-all`→`transition-colors` trims a needed animation | Motion | Low | Low | Only swap where both transitions exist; visual check |
| Dead-code deletion removes something grep missed | Housekeeping | Low | High | Delete after a `git grep` in the whole repo (incl. index.html), not just src/ |
| Certificate print CSS accidentally affected by overflow/z-index cleanup | Certificate | High if touched | High | Steps never import/edit Certificate; Step 24 verifies `no-print`/z-inline-style untouched via git diff |
| StrictMode double-effects surface during refactors | Dev | Med | Low | Validate behavior in production build (`vite build`), not dev |

---

## 15. Recommended First Implementation Task

**Task:** Step 1 — Register the missing Tailwind shade tokens.

- **Why first:** it is the single highest-leverage, lowest-risk fix. 96 class usages across 6 files (`AdminDashboard`, `CourseDetail`, `Dashboard`, `PracticeArena`, `CourseHero`, `QuizResults`) currently emit **no CSS** — dark mode renders borders as `currentColor`, backgrounds transparent, and shimmer skeletons invisible. It unblocks correct visual verification for every later step.
- **Files:** `frontend/src/index.css` (`@theme` block, ~lines 14-50).
- **What changes:** add tokens for the unregistered shades used today: `slate-850 #151C2D` (or match the design's intended value — verify against the `.light` chain's assumptions at `index.css:171-175,249-255` which already name `slate-850/750/905/855`), `slate-855`, `slate-750`, `slate-905`, `slate-655`, `slate-405`, plus `blue-450`, `rose-450`, `emerald-450`/`amber-450` (already registered), and a gradient-stop token for `to-blue-750`/`from-blue-750` if used. This is a CSS-only, additive change.
- **Expected outcome:** every `border-slate-850`, `bg-slate-850`, `bg-slate-905`, `divide-slate-850`, `placeholder-slate-655`, `text-slate-455/405`, `text-blue-450`, `text-rose-450`, `to-blue-750` now produces a real utility in the default dark theme. Admin "Add Week Module", CourseDetail doubt shimmers, Dashboard referral borders, and PracticeArena cards render with their intended dark surfaces.
- **Validation checklist:**
  - [ ] `grep -rn "slate-850\|slate-855\|slate-750\|slate-905\|slate-655\|slate-405" frontend/src | wc -l` — all counted classes present in output CSS (`frontend/dist/assets/*.css` after `vite build`) or via Tailwind's generated CSS.
  - [ ] Dark mode (default): AdminDashboard syllabus builder "Add Week Module" button has a visible background; CourseDetail doubt-loading shimmer visible; Dashboard referral borders are subtle, not bright `currentColor`.
  - [ ] Light mode unchanged (`.light` chain still wins for `.light`).
  - [ ] No route, API, component, or business-logic file touched (`git status` shows only `index.css`).
  - [ ] `vite build` passes; no TS changes.

---

# PHASE 3 COMPLETE

## Top 10 implementation tasks (execution order)

1. **Register missing shade tokens** (Step 1) — makes 96 dead dark-mode classes real.
2. **useQuiz correctness** (Step 3) — kills blank flash, stale-question timer, mid-submit swap.
3. **Quiz page** (Step 14) — empty state, cancel confirm, early submit, h1.
4. **ConfirmDialog/UIContext correctness** (Step 4) — re-entrancy hang, dead `busy`, resolve-outside-updater.
5. **Toast system + severity fixes** (Step 5) — a11y, FAB occlusion, 3 wrong-severity toasts.
6. **401 interceptor + refreshUser guard** (Step 6) — expired-session UX, transient-logout bug.
7. **Button + Input/FormField primitives** (Steps 7-8) — 160 untyped buttons, app-wide label binding.
8. **Dialog primitive + 9-overlay migration** (Steps 10-11) — focus trap/scroll lock everywhere.
9. **PracticeArena timer state machine** (Step 15) — coding-mode timer, infinite re-submit loop.
10. **PageContainer + padding cleanup** (Step 12) — double/triple padding, container-cap conflict.

## First task to execute
**Step 1 — Register missing Tailwind shade tokens** (full spec in §15).

## Files involved
- **Primary:** `frontend/src/index.css`
- **Reference (read-only, do not edit):** `frontend/src/index.css:171-175,249-255` (the `.light` chain's expectations for the missing shades); usages in `frontend/src/pages/AdminDashboard.tsx`, `CourseDetail.tsx`, `Dashboard.tsx`, `PracticeArena.tsx`, `CourseHero.tsx`, `QuizResults.tsx`.

## Expected outcome
Dark-mode rendering corrected at ~96 sites with a CSS-only, additive change; every later refactor step now verifiable against true dark-mode visuals. Zero routes, APIs, components, or business logic touched. Certificate untouched.

## Validation checklist
- All unregistered shades appear as generated utilities in the build CSS.
- Admin "Add Week Module" background, CourseDetail shimmer, Dashboard referral borders, PracticeArena card borders render correctly in dark mode.
- Light mode visually unchanged.
- `git status` shows only `frontend/src/index.css` modified; `vite build` passes.

---

*Next phase (per the standing STOP instruction): design-system + screen-by-screen V2 plan built from this blueprint's §9-§12. No implementation was started in Phase 3.*

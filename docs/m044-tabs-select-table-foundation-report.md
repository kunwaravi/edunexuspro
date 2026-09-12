# M-044 — Tabs / Select / Basic Table Primitives — Implementation Report

**Status:** IMPLEMENTED (primitives + consumer migration) — **not** browser-tested, **not** committed, **not** pushed, **not** deployed.
**Date:** 2026-08-13
**Branch:** master (working tree, uncommitted) — HEAD still `e974bfb` (M-043 PageContainer foundation).

---

## Summary

Three zero-dependency UI primitives were added under `frontend/src/components/ui/`:
`Tabs`, `Select`, and `Table`. Seven consumer sites that clearly benefit were
migrated to them, pixel-identical, without changing any business logic.
Every primitive ships **no baked size classes** — callers keep their exact
existing classes, so output is unchanged. All static checks pass
(`tsc` exit 0, `eslint` 0 errors, production `vite build` exit 0).

The previous session's substring-`replace_all` leak in `AdminDashboard.tsx`
(which had converted `<td>`/`</td>` in the review / messages / referrals tables
to `TableCell`) was fully repaired this session by reverting only those
non-target regions; the sortable **users** table remains the single migrated
table in that file.

---

## 17-Point Implementation Report

| # | Item | Status |
|---|------|--------|
| 1 | **Inspect existing code first** — mapped 3 hand-rolled tab bars (Dashboard underline, CourseDetail motion-underline, AdminDashboard aria-pressed pills), 3 native `<select>`s (all AdminDashboard, identical styling), 8 tables (AdminPaymentTable 8-col, LeaderboardTab 5-col + pagination, Home 4-col, AdminDashboard users/review/messages/referrals/nested), 1 pagination block. | IMPLEMENTED |
| 2 | **Define smallest useful scope** — three primitives, zero default visuals (className passthrough), no new UI library or dependency. | IMPLEMENTED |
| 3 | **Tabs primitive** — controlled compound component `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`; `Tabs` renders a fragment so parent `space-y-*` rhythm is preserved; triggers/panels wired via `useId`-based `aria-controls`/`aria-labelledby`. | IMPLEMENTED |
| 4 | **Tabs semantics** — `role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`; inactive panels unmount (same rendering as the old conditional guards). | IMPLEMENTED |
| 5 | **Tabs keyboard nav** — roving tabindex (only the active trigger is in the tab order), Arrow Up/Down/Left/Right move + activate, Home/End jump; automatic-activation pattern. | IMPLEMENTED |
| 6 | **Select primitive** — thin styled wrapper around the **native** `<select>` (OS picker, keyboard, form submission, mobile sheets all preserved — no combobox re-invention); shared border/bg/focus classes baked, size classes passed by caller. | IMPLEMENTED |
| 7 | **Table primitives** — `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` map 1:1 to `table`/`thead`/`tbody`/`tr`/`th`/`td`; `Table` bakes only `overflow-x-auto` + `w-full text-left`; **no** data-grid / sorting / filtering / pagination (those remain page-level concerns, e.g. LeaderboardTab pagination, AdminDashboard `handleSort`). | IMPLEMENTED |
| 8 | **Migrate: Dashboard tabs** — 3-tab underline bar converted to `Tabs`; all original button classes and the underline `<span>` preserved; ternary panels → 3 `TabsContent`; overview panel carries `space-y-8 sm:space-y-10` to match the root container's rhythm. | IMPLEMENTED |
| 9 | **Migrate: CourseDetail tabs** — 2-tab motion-underline bar (Study Material / Project & Assignment) converted; framer-motion `layoutId="tab"` underlines preserved inside each trigger; Bottom Navigation kept outside `Tabs` (as before). | IMPLEMENTED |
| 10 | **Migrate: AdminDashboard selects** — the 3 native selects (student, track, role) wrapped in `Select`; exact size classes retained (`px-4 py-2.5 text-xs`, `px-3 py-2`); gains correct `label`→`select` association (previous markup had bare text labels). | IMPLEMENTED |
| 11 | **Migrate: tables** — Home top-students, AdminPaymentTable (8-col), LeaderboardTab (5-col + pagination), AdminDashboard sortable **users** table all converted to `Table` primitives; every class preserved (headers, row dividers, hover states, responsive `hidden md:table-cell`). | IMPLEMENTED |
| 12 | **Business logic preserved** — 0 handler changes across all migrated files (payment verify/fail/delete, leaderboard fetch/pagination, referral logic, users sort all untouched); verified via diff. | IMPLEMENTED |
| 13 | **Accessibility review** — primitives carry the ARIA tab pattern (item 4–5), `Select` adds `htmlFor`/`aria-invalid`/`aria-describedby`/`role="alert"` error wiring, tables are semantic `thead`/`tbody`/`th`/`td`; no regression introduced. Sortable headers remain clickable `<th>` (pre-existing pattern; `aria-sort` deferred). | IMPLEMENTED |
| 14 | **Responsive review (375/768/1024/1440)** — no baked sizes in any primitive; all responsive classes preserved by construction; tables scroll horizontally via the primitive's `overflow-x-auto`; Dashboard tablist keeps its `overflow-x-auto`; College column keeps `hidden md:table-cell`. No `PageContainer` change. | IMPLEMENTED |
| 15 | **Regression safety** — reviewed full diff of every migrated file; confirmed only intended M-044 changes in those files; the 7 other modified working-tree files are pre-existing uncommitted work from prior tasks (M-034 tokens, M-043 overflow/PageContainer work, an unrelated backend auth edit) and were **not touched**. | IMPLEMENTED |
| 16 | **Static checks** — `npx tsc -b --noEmit` exit 0; `npm run lint` 0 errors (8 pre-existing warnings, all in untouched data-fetching/context files); `npm run build` (tsc + vite) exit 0. | IMPLEMENTED |
| 17 | **Git safety** — nothing staged (`git diff --cached` empty), **no commit**, no push, no deploy; HEAD unchanged at M-043; only M-044 files changed (7 files + new `ui/` directory). | IMPLEMENTED |

---

## Files Changed (M-044)

**New primitives** (`frontend/src/components/ui/`):
- `Tabs.tsx` — controlled accessible tab compound
- `Select.tsx` — native-select wrapper with label/error
- `Table.tsx` — semantic table structure helpers

**Migrated consumers:**
- `frontend/src/pages/Dashboard.tsx` — tab bar + panels
- `frontend/src/pages/CourseDetail.tsx` — tab bar + panels (only the Tabs hunk is M-044; the `md:`/grid/min-w-0 hunks are pre-existing responsive work)
- `frontend/src/pages/AdminDashboard.tsx` — 3 selects + users sortable table (accidental `<TableCell>` conversions in review/messages/referrals tables reverted)
- `frontend/src/pages/Home.tsx` — top-students table
- `frontend/src/components/organisms/AdminPaymentTable.tsx` — payment table
- `frontend/src/components/organisms/LeaderboardTab.tsx` — leaderboard table (pagination unchanged)

## Explicitly NOT Changed (pre-existing working-tree changes, not M-044)

`backend/src/routes/auth.ts`, `backend/src/services/authService.ts`,
`frontend/src/App.tsx`, `frontend/src/components/Navbar.tsx`,
`frontend/src/components/atoms/FloatingSupportWidget.tsx`,
`frontend/src/components/organisms/CourseHero.tsx`,
`frontend/src/components/organisms/SyllabusManager.tsx`,
`frontend/src/index.css`, plus untracked `docs/*` reports and `scripts/`.

## Out of Scope / Deferred

- **AdminDashboard 8-tab bar** (aria-pressed pills) and **review sub-tabs** — pre-existing, not migrated (no clear benefit; different pattern).
- **AdminDashboard review / messages / referrals / nested tables** — pre-existing, left as raw `<table>` markup (no clear benefit).
- **`aria-sort` on sortable headers** — possible future enhancement; pre-existing clickable-`<th>` pattern preserved as-is.
- **M-035 / M-046 / M-047 / M-048** — not started (per task boundary).

## Verification evidence

- `npx tsc -b --noEmit` → exit 0
- `npm run lint` → 0 errors (8 pre-existing warnings)
- `npm run build` → exit 0 (built in ~3.6s)
- `git status` / `git diff --stat` / per-file `git diff` reviewed — only M-044 changes in M-044 files

## Stop conditions honoured

✅ Implementation only · ✅ NOT browser-tested · ✅ NOT committed · ✅ NOT pushed · ✅ NOT deployed · ✅ M-046/M-035/M-047/M-048 NOT started

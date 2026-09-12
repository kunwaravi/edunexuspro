# M-048 AUDIT — CourseDetail milestone (P1)

**READ-ONLY · zero files changed · zero DB writes · working tree untouched · no commit**

Sources: `docs/master-action-plan.md:395` (register), `docs/frontend-deep-dive.md:638` (Step-18), `docs/frontend-deep-dive.md:514/522` (P1-10 / P2-8), `docs/ui-ux-audit.md:479-481` (RB-07/08/09), `docs/backend-audit.md:170` (BE-29).

---

## 1. Exact objective

From the M-048 register + Step-18 + P1-10 / P2-8:

> **M-048 (P1, CourseDetail, risk Med):** Hook fixes to `useCourseDetail` — drop the `currentWeek` dep (refetch cascade / week-jump), abort/ordering guard for module fetch, expose an error state, single payment source (`setIsPaid` becomes internal); view-state restore; `<h1>`; markdown-table overflow; surface the module-quiz CTA; replace raw buttons/cards (Steps 7/9) and drawer/lightbox (Step 11); **wire `POST /projects/submit` (BE-29) so project submissions reach the admin review queue**.

- **Success criteria (register):** "No week-jump; last view restored; project submissions reach admin queue."
- **Register dependencies:** M-036 (useQuiz), M-042 (Dialog), M-043 (PageContainer).

## 2. Current state of the in-scope files

- `useCourseDetail.ts` (107 lines) — all §6.2 defects **present in current code** (see §4).
- `CourseDetail.tsx` (1585 lines) — M-043 applied (`PageContainer` :539) and M-044 applied (`Tabs` :702). **No `<h1>`** (only `<h2>` at :558/616/760/1015; `CourseHero` has no h1). `viewState` (:211) and `activeTab` (:217) are plain `useState`, **not persisted**. Markdown renderer (:1017) has `[&_pre]` overflow rules but **no `[&_table]` rule**. Module-quiz CTA is a card at the **bottom** of the reader (:1135-1160). Doubts drawer (:1353) and lightbox (:1540-1568) are hand-rolled `motion.div` (z-50, no `role=dialog`/focus-trap/Esc). Projects tab: weekly-assignment uploads (`POST /assignments/submit` via `handleUploadAssignment` :340-357) + read-only project-status display; **no final-project submission form, no `POST /projects/submit` caller anywhere in `frontend/src/`** (grep: NONE).
- Backend `POST /api/projects/submit` (`routes/project.ts:38-91`) — **route already live**, `authenticateToken`, `validateBody(['courseId','title','description','sourceCodeUrl','reportUrl'])`, 20-module gate, `prisma.projectSubmission.upsert` (user-owned, PENDING). `ProjectSubmission` table: **0 rows**.

## 3. Already-completed work

| Item | Status |
|---|---|
| M-043 PageContainer applied to CourseDetail (`:539`) | ✅ DONE |
| M-044 Tabs primitive applied (`:702`) | ✅ DONE |
| M-042 Dialog **primitive** exists (`atoms/Dialog`, commit `12864d5`) — CourseDetail overlays NOT yet migrated | ✅ DONE (primitive only) |
| **RB-07** dark mode: `--color-slate-850` registered (`index.css:61`); `Skeleton` uses `dark:bg-slate-800` (:16); no `border-current` bright borders in CourseDetail | ✅ ALREADY ADDRESSED (M-035 token foundation + #46/#47 UX commits; re-verify visually) |
| **RB-08** sidebar width `md:w-1/4 lg:w-1/3` present (`:588`) | ⚠️ PARTIAL — sidebar week titles still `truncate` (:806), doubts-drawer line `truncate max-w-[280px]` (:1359); verify at 768-1023 |

## 4. Remaining gaps (all CONFIRMED in current code)

1. **Week-jump / refetch cascade** — `fetchSyllabus` deps include `currentWeek` (`useCourseDetail.ts:40`); any user change (own quiz pass → `login(token, res.updatedUser)`) re-clamps the active week. `[P1-10]`
2. **Module-fetch race** — no AbortController / request-id (:55-68); last-to-resolve wins. `[P1-10]`
3. **No error state exposed** — `fetchSyllabus`/`fetchPaymentStatus` catch with `console.error` only (:42-53); a failed fetch renders as a valid empty course. `[P1-10]`
4. **Duplicated payment state + raw escape hatch** — `setIsPaid` returned from the hook (:105) and called directly at `CourseDetail.tsx:1329` (`onPaymentSuccess={() => setIsPaid(true)}`). `[P1-10]`
5. **View state not restored** — `viewState`/`activeTab`/topic index lost on remount; only `last_viewed_week_*` is restored. `[P2-8/Step-18]`
6. **No `<h1>`** on the page. `[P2-8]`
7. **Markdown-table overflow (RB-09)** — no `[&_table]` rule at :1017 → GFM tables clip at 375. `[P2-8, RB-09]`
8. **Module-quiz CTA buried** — card sits below all topic content + code playground (:1135-1160). `[P2-8]`
9. **5 GETs on mount not consolidated** — `fetchPaymentStatus`, `fetchSyllabus`, `fetchModuleDetails`, `fetchSubmissions`, `fetchProjectStatus`. `[P2-8]`
10. **Raw buttons/cards + drawer/lightbox not on M-042 Dialog** — zero `Dialog`/`ConfirmDialog`/`Button` atoms imported; assignment "Confirm" (:1295), doubts drawer (:1353), lightbox (:1540), PeerSolutionsModal (:1571) all custom. `[Step-18/Step-11]`
11. **`POST /projects/submit` unwired (BE-29)** — backend route live, but no FE caller; projects tab read-only for the final project. `[BE-29]`

## 5. Exact files / components

**In scope (register file list):**
- `frontend/src/pages/CourseDetail.tsx` — view-state restore, h1, markdown `[&_table]`, CTA move, overlay→Dialog migrations, final-project submit form (projects tab)
- `frontend/src/hooks/useCourseDetail.ts` — deps fix (:40), abort/ordering (:55-68), error-state exposure (:42-53), `setIsPaid` internal (:93-106)

**Ambiguous (resolve at implementation):** Step-11 "lightbox" (in `CourseDetail.tsx` — in scope) vs `PeerSolutionsModal.tsx` (a separate molecule NOT in the register file list → treat **OUT OF SCOPE** unless explicitly re-added).

## 6. FE / BE / API / DB dependencies

- **FE:** M-042 primitive (available), M-043 (applied), M-044 (applied). **M-036 `useQuiz` listed as dep — NOT implemented** (`useQuiz.ts:6` `loading` init `false`; no `setData(null)`; no abort; split fetch/submit already present). Disjoint file from M-048 → **non-blocking sequencing note**, not a code block.
- **BE/API:** only `POST /api/projects/submit` (already live) gains a first FE caller. Read routes already consumed: `/payments/status/:id`, syllabus, `/module/:week`, `/assignments/status/:id`, `/projects/status/:id`.
- **DB:** no schema change, no migration.

## 7. User-data impact

- All M-048 work except BE-29 wiring is **FE-only → DB-neutral**, proven by code path (hook/view/h1/markdown/CTA/primitives touch no API write path).
- **BE-29** introduces the first FE call to `POST /projects/submit`: `prisma.projectSubmission.upsert` on `userId_courseId` — **user-owned, single-row, PENDING, no cascade, no other table touched**. Table is **empty (0 rows)** today, so there is no existing submission to clobber. The 20-module gate is a read-only count.
- **Caveat to carry into implementation:** the upsert's `update` clause resets the user's own row to `status:'PENDING'` + `feedback:null`. Once submissions exist, re-submitting after an approval silently demotes their own status — add a re-submit guard/confirm. Not a risk to other users or tables.
- **Untouched:** accounts, progress, quiz attempts, practice attempts, XP/badges, certificates, enrollments, payments, all tracking.

## 8. Regression risks

- **Week-jump fix** — risk of over-correcting: syllabus must still refresh on course change; keep an explicit `courseId` (not progress) trigger.
- **Payment source consolidation** — must not block the `onPaymentSuccess` unlock after a successful checkout (EnrollmentPanel flow :1324-1332).
- **Overlay migrations (Step 11)** — focus-trap/scroll-lock/Esc regressions in doubts drawer + lightbox; keyboard-walk + screenshot parity per overlay (deep-dive :699).
- **Markdown `[&_table]`** — must be a scroll container, not a layout-breaker, and only for tables (pre blocks already handled).
- **Project form** — validation must match `validateBody` keys exactly; the 20-module 403 must surface in UI, not fail silently.

## 9. Recommended implementation sequence

1. `useCourseDetail.ts` — deps fix, abort/ordering, error-state exposure, `setIsPaid` internal (single payment source). No UI yet.
2. `CourseDetail.tsx` — consume error state; h1; `[&_table]` overflow; move module-quiz CTA; view-state persist/restore.
3. Step-11 overlay migrations (drawer, lightbox) onto M-042 Dialog.
4. BE-29: final-project submit form in the projects tab → `POST /projects/submit` → refresh `projectStatus`.
5. Regression: quiz→return→no week-jump; returning restores last view; tables scroll at 375; approval flow reaches admin queue.

## 10. Validation / E2E requirements

- **Static:** tsc + lint clean.
- **Browser** (desktop + 375/768/1024): returning to a course restores last view & tab; no week-jump after completing a topic quiz; module-fetch failure shows a visible error (network-block `/module/:week`); markdown table scrolls at 375 (no page overflow); sidebar week titles not clipped at 768-1023; drawer/lightbox trap focus + Esc + scroll-lock; quiz CTA visible above the fold.
- **BE-29 E2E:** submit final project (≥20 modules) → 200, status PENDING → admin `/admin/pending` shows it → approve → +100 XP. <20 modules → 403 "Locked Project" surfaced in UI.
- **Data-safety:** deterministic pg_dump fingerprint (nonce-stripped) before/after an isolated submit-free session = identical; then a targeted submit test asserting only the user's own `ProjectSubmission` row changes and every other table count is unchanged.

## 11. Files that MUST NOT be touched

- `frontend/src/pages/Certificate.tsx` (+ inline `<style>`) — I-1 **ABSOLUTE NO-TOUCH**
- Any payment auto-`VERIFIED` transition — I-2 (only `adminVerifyPayment` writes VERIFIED)
- Admin-verification authority + `verificationCode`/`verificationStatus` column names — **I-3 / I-16 (Phase 4 #10 — the "#10" cited in the M-048 row is this NO-TOUCH invariant, not M-048 work → OUT OF SCOPE)**
- Discount caps server-enforced — I-4
- JWT/auth contract (`login(token,user)`, Bearer, `expiresIn:'1d'`, localStorage `token`/`user`) — I-6
- `backend/src/routes/project.ts` (route already live; only the FE gains a caller — no backend edit in M-048)
- `frontend/src/components/molecules/ProjectStatusCard.tsx` — M-047 already removed its dead button; register/Step-18 do NOT include it (**OUT OF SCOPE**, supersedes overview line 184's "ProjectStatusCard")
- Pre-existing uncommitted work (backend auth.ts/authService.ts; FE App.tsx/Navbar/FloatingSupportWidget/CourseHero/SyllabusManager/index.css; untracked docs/* + scripts/)
- `useQuiz.ts` (M-036's file — leave for M-036)

## 12. GO / NO-GO

Scope fully mapped; every gap confirmed in current code; backend route already live; primitives available; DB-safe. **GO for implementation.**

---

## M-048 STATUS: **READY FOR IMPLEMENTATION**

- **Exact reason:** All work is confined to the 2 in-scope files (`CourseDetail.tsx`, `useCourseDetail.ts`); the only backend contact is a first caller to an **already-live, user-owned, non-destructive upsert** route; the DB is byte-safe (schema unchanged, 0-row target table). Not blocked.
- **Exact scope:** §1 objective, §4 gaps 1-11, §9 sequence, §10 validation.
- **Files to change:** `frontend/src/pages/CourseDetail.tsx`, `frontend/src/hooks/useCourseDetail.ts`.
- **Files to remain untouched:** §11 list.
- **Database impact:** **READ + WRITE REQUIRED** — READ for all existing flows (unchanged), WRITE **only** to `ProjectSubmission` via the new `POST /projects/submit` caller. **No schema change, no migration.**
- **User-data safety verdict:** **SAFE.** No code path in M-048 can reach accounts, progress, quiz/practice attempts, XP/badges, certificates, enrollments, payments, or tracking. The sole write is a user's own project row (PENDING). Caveat to implement with care: a re-submit resets the user's own `ProjectSubmission` status to PENDING — guard/confirm that case once APPROVED submissions exist (0 today).
- **Carry-overs:** M-036 (useQuiz) unmet — **non-blocking** (disjoint file); RB-07/08 largely pre-addressed (visual re-verify); `#10` = I-16 NO-TOUCH invariant (OUT OF SCOPE); ProjectStatusCard OUT OF SCOPE.

---

*Audit disclosure: No code changed · no other file created/edited · no DB write · no commit · no push. Working tree preserved exactly. (This file `docs/m048-audit.md` is the audit deliverable, created at the user's explicit request.)*

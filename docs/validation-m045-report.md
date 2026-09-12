# M-045 — Quiz UX + A11y: Implementation & Validation Report

**Date:** 2026-08-13
**Milestone:** M-045 (Quiz page UX + accessibility)
**Status:** Implementation complete · Fix applied (M-042 backdrop-click) · Validation **36/36 PASS**
**Constraint compliance:** No commits made. The `Dialog.tsx` fix is applied (2 pointer-events class additions, 1 file); no other files were touched by this fix.

---

## 1. Executive Summary

The Quiz page (`frontend/src/pages/Quiz.tsx`) previously had four problems, all fixed under M-045:

| Before (audit) | After (M-045) |
|---|---|
| `Cancel Exam` navigated away **immediately** — accidental progress loss | Shows a confirm dialog: **"Exit this exam?"** → `Exit Exam` (danger) / `Keep Taking Exam`. Only explicit confirm navigates; cancel keeps the quiz running with answers intact. |
| Manual submit of a partial quiz was **blocked** with a toast ("answer all questions first") — no way to submit early | All manual submits go through the shared M-042 confirm dialog: partial → **"Submit partial quiz?"** (`Submit Anyway`); full → **"Submit quiz?"** (`Submit`). Mirrors PracticeArena. 0:00 auto-submit unchanged. |
| Empty / out-of-range question set rendered a **blank page** (audit CRITICAL) | Friendly **"No Questions Available"** state with a **Back to Course** action. |
| No primary `<h1>` on the quiz page (audit HIGH); question text was a `<p>` | `QuizHeader` now renders an `<h1>` (`Chapter Quiz` / `Topic Quiz`); question text upgraded `<p>` → `<h2>`; "Access Blocked" `h2` → `h1`. |

**Validation:** An end-to-end suite (login-based, real DB) covers load, timer, navigation, answer selection/change, all 4 dismiss paths of the exit confirm, early-submit dismiss, full 23-question run, final submit → results modal, mobile overflow at 375/768, empty state, **and** the app-wide backdrop-click fix. **36/36 pass** (0 console errors, 0 page errors, 0 failed requests).

---

## 2. Files Changed (all under `frontend/src/`)

| File | Change | Purpose |
|---|---|---|
| `pages/Quiz.tsx` | `handleCancel()` → `confirmDialog` | Exit confirm before leaving active quiz |
| `pages/Quiz.tsx` | `handleSubmitQuiz()` → `confirmDialog` (partial/full variants) | Early submit allowed, safety-gated |
| `pages/Quiz.tsx` | `if (!activeQuestion) return null` → friendly empty state | Fix blank page (CRITICAL) |
| `pages/Quiz.tsx` | "Access Blocked" `h2` → `h1`; `QuizHeader` gets `title` + `onCancel={handleCancel}` | Heading structure |
| `pages/Quiz.tsx` | Early "Submit" ghost button on non-last questions | Feature parity with PracticeArena |
| `components/organisms/QuizHeader.tsx` | New `title` prop + `<h1>` | Primary heading (a11y HIGH) |
| `components/molecules/QuizQuestion.tsx` | Question text `<p>` → `<h2>` | Heading hierarchy |

### 2.1 `pages/Quiz.tsx` — key hunks

**Cancel/exit confirm** (`handleCancel`, ~L91):
```tsx
const handleCancel = async () => {
  const ok = await confirmDialog({
    title: 'Exit this exam?',
    message: 'Your progress on this exam will be lost. Are you sure you want to leave?',
    confirmLabel: 'Exit Exam',
    cancelLabel: 'Keep Taking Exam',
    danger: true,
  });
  if (ok) navigate(`/course/${courseId}`);
};
```

**Submit confirm** (`handleSubmitQuiz`, ~L102): guards `results` re-submit, then:
```tsx
const ok = answeredCount < questions.length
  ? await confirmDialog({ title: 'Submit partial quiz?', ..., confirmLabel: 'Submit Anyway', danger: true })
  : await confirmDialog({ title: 'Submit quiz?', ..., confirmLabel: 'Submit' });
if (!ok || results) return;
```

**Empty state** (~L192): renders `No Questions Available` + `Back to Course` when no active question.

### 2.2 `QuizHeader.tsx` — h1
```tsx
<h1 className="min-w-0 flex-1 text-center text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-200 truncate">
  {title}
</h1>
```

### 2.3 `QuizQuestion.tsx` — heading
```tsx
<h2 className="font-extrabold text-slate-200 text-lg leading-snug">{index + 1}. {question.text}</h2>
```

---

## 3. Validation Evidence (run against live frontend + backend + postgres)

**Artifacts:** test `m045-e2e/test2.js` · JSON results `m045-e2e/results.json` · screenshots `m045-e2e/shots/{results,quiz-375,empty}.png`

Result: **36/36 PASS · 0 console errors · 0 page errors · 0 failed requests.**

> Fix applied: the §4 backdrop bug was fixed in `Dialog.tsx` (positioning layer `pointer-events-none`, panel `pointer-events-auto`). Post-fix re-run: backdrop click closes dialogs app-wide, inside-panel clicks do **not** close, and all prior checks stay green. Also added: a PracticeArena non-quiz backdrop-dismiss check (covers the fix app-wide) and an inside-click-does-not-close check.

| Section | Check | Result |
|---|---|---|
| setup | register fresh user | ✅ |
| load | quiz page has primary `h1` (`Chapter Quiz`) | ✅ |
| load | question renders as `h2` | ✅ |
| load | options rendered (4) | ✅ |
| load | early "Submit" action on non-last question | ✅ |
| load | progress "Question 1 of 23" | ✅ |
| timer | countdown continues (4:59 → 4:56) | ✅ |
| nav | Next → question 2 | ✅ |
| nav | Previous enabled on Q2 | ✅ |
| nav | Previous → back to question 1 | ✅ |
| answer | select option A | ✅ |
| answer | change answer to option B (old unchecks) | ✅ |
| cancel | Cancel Exam opens "Exit this exam?" | ✅ |
| cancel | Keep Taking Exam → dialog gone, quiz intact, **answer kept** | ✅ |
| cancel | Esc dismisses dialog (no navigation) | ✅ |
| cancel | X (Close dialog) dismisses | ✅ |
| cancel | **backdrop click dismisses** | ✅ |
| cancel | **click inside dialog does NOT close it** | ✅ |
| other | PracticeArena 0-answer submit opens confirm (non-quiz) | ✅ |
| other | **non-quiz dialog: backdrop click closes it** | ✅ |
| cancel | Exit Exam confirmed → navigates to `/course/C` | ✅ |
| early | Submit with 0 answered → "Submit partial quiz?" | ✅ |
| early | dismiss partial dialog → no submit, still on quiz | ✅ |
| early | answer all 23 questions (fresh read per question) | ✅ |
| early | last question shows Submit Exam | ✅ |
| early | early Submit all answered → "Submit quiz?" | ✅ |
| early | dismiss full dialog → quiz intact | ✅ |
| submit | Submit Exam opens confirm | ✅ |
| submit | confirm → results modal appears | ✅ |
| mobile | results modal @375 no overflow | ✅ |
| mobile | results modal @768 no overflow | ✅ |
| mobile | quiz @375 no horizontal overflow | ✅ |
| mobile | header (cancel/title/timer) fits @375 | ✅ |
| empty | empty question set → friendly state (no blank page) | ✅ |
| empty | empty state has Back to Course action | ✅ |
| empty | empty state: no console/page errors | ✅ |

> The first two validation runs flagged 2 extra failures that were **test-harness bugs, not app bugs**: (a) fixed 400 ms waits raced the M-042 dialog's slow spring exit and reported close-checks as failed; (b) the answer-loop reused question 1's option text across all 23 questions (each has different options). Both were fixed in the harness (poll-for-unmount + per-question re-read) and re-ran green. See §5.

---

## 4. The One Real Defect — Backdrop Click Does Not Close M-042 Dialogs

**Classification:** Pre-existing bug in `frontend/src/components/atoms/Dialog.tsx` (M-042 primitive). Affects **every** dialog in the app that relies on `closeOnBackdrop` (ConfirmDialog in Quiz/PracticeArena/Admin, ExamResultsModal, PeerSolutionsModal). Not introduced by M-045.

### 4.1 Symptom
Open the Exit-Exam confirm, click the dimmed area outside the panel → dialog stays open, and it continues to swallow pointer events (subsequent clicks also blocked).

### 4.2 Root cause (confirmed by evidence)
`Dialog.tsx` renders two full-screen layers with the **same `z-index`**:

```
L1 backdrop:   <motion.div className="fixed inset-0 no-print" onClick={closeOnBackdrop && !busy ? onClose : undefined} />
L2 positioning <div  className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto no-print">   ← later in DOM
```

`L2` paints **on top of** `L1` (same stacking context, later DOM order) and has **no `pointer-events: none`**. It covers the entire viewport, so every click outside the panel lands on `L2`, never reaches the backdrop's `onClick`. The backdrop click-to-close is effectively dead.

**Proof — `elementFromPoint` at the click point (700, 40):**
```
FAIL cancel :: backdrop click dismisses — dialog stayed open — top element @click point: DIV.fixed.inset-0.z-50
```
Playwright's own click log independently confirmed it: `<div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto no-print"> intercepts pointer events`.

**Intent mismatch:** `Dialog.tsx`'s own docstring documents *"Backdrop click-to-close (suppressed while busy)"* — i.e., the current dead backdrop is a bug against the intended behavior, not a design choice. `ConfirmDialog` does not set `closeOnBackdrop`, so the default `true` applies.

### 4.3 Applied fix (2 class additions, 1 file)
In `frontend/src/components/atoms/Dialog.tsx`:
- Positioning layer (`L2`): add `pointer-events-none` → empty-area clicks fall through to the backdrop.
- Dialog panel (`role="dialog"` motion.div): add `pointer-events-auto` → panel + its controls (buttons, busy overlay) behave exactly as before.

Backdrop handler logic unchanged (`closeOnBackdrop && !busy`), so busy-state suppression and the Esc/X/button close paths are untouched. Net effect: backdrop-click-to-close restored **app-wide** with no behavior change to any consumer, no duplicated logic, no quiz-specific workaround. Post-fix validation confirms backdrop clicks close dialogs (quiz exit + PracticeArena) and inside-panel clicks do not close.

---

## 5. Pre-existing Observations (documented, not fixed)

- **Slow exit animation (~1.5 s "ghost").** The M-042 panel exits on the same underdamped spring used for entry (`transition={{ type:'spring', damping:26, stiffness:260 }}`). After any dismiss, the panel remains mounted and click-swallowing for ~1–1.5 s while the spring settles. Cosmetic; affects all M-042 dialogs; unchanged by M-045. (Validation harness polls for actual unmount instead of fixed waits to stay deterministic.)

---

## 6. Environment for Re-running Validation

- **Frontend:** `cd frontend && npm run dev` → `http://localhost:5173`
- **Backend:** `cd backend && npm run dev` → `http://localhost:5000` (uses mock Redis for local dev)
- **Postgres:** local 16 instance (`/home/abhi/pg-local`), started via its extracted `pg_ctl`, port 5432, DB `nexus`
- **Test:** `cd m045-e2e && NODE_PATH=<playwright-core path> node test2.js` (uses installed `google-chrome`)

---

## 7. Fix Outcome

1. ✅ 2-line `Dialog.tsx` fix applied (backdrop pointer-events).
2. ✅ Full validation suite re-run: **36/36 PASS** (backdrop closes, inside-click doesn't close, all prior checks green).
3. ✅ Cross-checked a non-quiz dialog (PracticeArena confirm) — backdrop dismiss works there too; fix is app-wide.
4. ✅ No commit (per project rule). Deliverables stay in the working tree.

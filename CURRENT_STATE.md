# CURRENT_STATE — EduNexus Pro

> Generated: 2026-10-28

## Active Work
- **Diwali 2026 coupon offer (2026-10-28, uncommitted, NOT deployed).**
  - Backend: `Coupon` / `CouponRedemption` models, `Payment.couponCode` + `discountAmount`,
    `couponService.ts` (atomic claim/release/consume), `POST /api/payments/coupon/validate`,
    coupon-aware `createOrder` (still starts `INITIATED`).
  - Migration: `backend/prisma/migrations/20261028120000_add_diwali_coupons` (additive).
  - Data script: `npm run diwali:offer` / `npm run diwali:offer:apply`
    (9 courses → ₹2,000; `DIWALI500` ₹500, `DIWALI250` ₹250, max 1 redemption each).
  - Frontend: `DiwaliOfferPopup.tsx` on Home; PayPage validates coupons via the backend.
  - GBP content prepared but **NOT PUBLISHED**: `docs/diwali-gbp-offer.md`.
- Working tree also has a **pre-existing uncommitted nginx fix**: `nginx/edunexus.conf`
  adds `location /static/` → `http://127.0.0.1:5000/static/`. Unrelated to the Diwali work.
- Untracked: `MASTER-TASK-REPORT.html` (stabilization report, 2026-09-12).

## Diwali Offer — Verification Done Locally (2026-10-28)
- Service + HTTP flow: ₹2,000 → `DIWALI500` ₹1,500, `DIWALI250` ₹1,750; second global use → 400;
  FAILED releases the coupon; proof → `PENDING`; no enrollment before verify; admin verify →
  `VERIFIED` + `Enrollment ACTIVE` + redemption `CONSUMED`.
- Popup: 31/31 Playwright checks at 1440×900 and 390×844 (fits viewport, no overflow,
  FAB no longer overlaps).
- Local counts unchanged: users 5, courses 34, payments 3, enrollments 3, certificates 3.
- **Production untouched**: `https://edunexus.kibm.in/api/courses` still returns ₹699 for all 9 courses.

## Deploy Checklist (when authorized)
1. Commit code + migration + docs (exclude `nginx/edunexus.conf` unless intended).
2. `npx prisma migrate deploy` on prod, then `npm run diwali:offer:apply` (dry-run first).
3. Rebuild frontend + backend containers; verify coupon validate + create-order.
4. GBP offer still needs manual publish by the business owner.

## Pending Work
- Commit + deploy the `/static/` nginx fix. **Verified still broken in production**: `GET https://edunexus.kibm.in/static/course-banners/3d-cad.webp` returns `text/html` 200 (SPA fallback), not `image/webp`.
- Open PR #104 `fix(dialog): over-tall modals scroll internally instead of clipping` (branch `fix/internship-dialog-scroll`, open since 2026-09-04).
- Post-deploy: run `backfill_enrollments.ts` if any new paid enrollments need access rows.

## Known Issues
- Course banners silently 404→index.html on prod (frontend fallback visual masks it) until nginx fix deploys.
- Local DB is not Prisma-migration-managed; `migrate deploy` forbidden locally.
- `/health` is not proxied by nginx (falls through to SPA); use `/api/*` probes instead.

## Recent Decisions
- Internship certificate console stays training-only in scope (#101/#102).
- Type-aware public verification for internship credentials (#102).

## Last Verification / Deploy
- Production HTTP: `https://edunexus.kibm.in/` → 200; `/api/courses` returns course JSON.
- Prod deploy commit: **not verified** — SSH `root@187.127.156.138` rejected (`Permission denied (publickey,password)`) from this session.
- Local `master` == `origin/master` (0 ahead / 0 behind) as of 2026-10-28.

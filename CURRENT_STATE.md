# CURRENT_STATE — EduNexus Pro

> Generated: 2026-10-28

## Active Work
- **Diwali 2026 coupon offer — DEPLOYED 2026-10-28 (commit `11e34e6`).**
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

## Diwali Offer — Verification (2026-10-28)
- Local service + HTTP flow: ₹2,000 → `DIWALI500` ₹1,500, `DIWALI250` ₹1,750; second global use → 400;
  FAILED releases the coupon; proof → `PENDING`; no enrollment before verify; admin verify →
  `VERIFIED` + `Enrollment ACTIVE` + redemption `CONSUMED`.
- Local counts unchanged: users 5, courses 34, payments 3, enrollments 3, certificates 3.
- **Production deployed 2026-10-28**: migration `20261028120000_add_diwali_coupons` applied;
  `diwali:offer:apply` run (Payments 14 → 14, Enrollments 14 → 14).
- Prod counts pre/post identical: users 65, courses 9, payments 14, enrollments 14, certificates 33.
- Live `/api/courses` returns ₹2,000 for all 9 courses; live popup 18/18 Playwright checks at
  1440×900 and 390×844; `/api/payments/coupon/validate` wired (401 without auth).
- Coupons in prod: `DIWALI500` ₹500, `DIWALI250` ₹250, max 1 each, 0 used, valid 28 Oct – 15 Nov 2026.
- **GBP offer NOT published** — owner must publish manually from `docs/diwali-gbp-offer.md`.

## Deploy Checklist
1. ✅ Commit code + migration + docs (nginx/edunexus.conf left uncommitted).
2. ✅ Migration-on-start applied; `npm run diwali:offer:apply` run on prod.
3. ✅ Frontend + backend containers rebuilt and healthy.
4. ⬜ GBP offer manual publish by the business owner.

## Pending Work
- Commit + deploy the `/static/` nginx fix. **Verified still broken in production**: `GET https://edunexus.kibm.in/static/course-banners/3d-cad.webp` returns `text/html` 200 (SPA fallback), not `image/webp`.
- Open PR #104 `fix(dialog): over-tall modals scroll internally instead of clipping` (branch `fix/internship-dialog-scroll`, open since 2026-09-04).
- Post-deploy: run `backfill_enrollments.ts` if any new paid enrollments need access rows.

## Catalog Filters + Poster Popup — 2026-10-28 (deployed, commit `0923d16`)
- Root cause of "filter shows nothing": prod `Category` table was empty and all courses had
  `categoryId`/`slug`/`difficulty` NULL, while the UI hardcoded ₹600/₹800 price bands.
- Fix (frontend): filter chips are derived from the catalog; level chips only render when a
  course has a difficulty; price chips are generated from real prices and hidden when uniform.
- Data: ran `prisma/seed_catalog.ts` on prod — 10 categories created, 9 course slugs +
  category links backfilled. Payments/enrollments/certificates unchanged (14/14/33).
- Live: category chips All / Programming (4) / Web Development (1) / IoT (1) /
  Embedded Systems (1) / CAD & Design (2), every chip returns results.
- Home popup now shows `frontend/public/diwali-offer-2026.jpeg` (owner-supplied poster).
  **Note:** the poster says "30% OFF" while the coupons are ₹500 off ₹2,000 (25%) and
  ₹250 off (12.5%) — poster copy needs correcting.

## Known Issues
- Course banners silently 404→index.html on prod (frontend fallback visual masks it) until nginx fix deploys.
- Local DB is not Prisma-migration-managed; `migrate deploy` forbidden locally.
- `/health` is not proxied by nginx (falls through to SPA); use `/api/*` probes instead.
- All 9 prod courses still have `difficulty = NULL`, so the level filter stays hidden until
  real difficulty values are set.

## Recent Decisions
- Internship certificate console stays training-only in scope (#101/#102).
- Type-aware public verification for internship credentials (#102).

## Last Verification / Deploy
- Production HTTP: `https://edunexus.kibm.in/` → 200; `/api/courses` returns course JSON.
- Prod deploy commit: **not verified** — SSH `root@187.127.156.138` rejected (`Permission denied (publickey,password)`) from this session.
- Local `master` == `origin/master` (0 ahead / 0 behind) as of 2026-10-28.

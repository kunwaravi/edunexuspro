# Diwali Offer + Coupon Safety — Design

**Date:** 2026-10-28
**Project:** EduNexus Pro (`edunexus.kibm.in`)
**Status:** Approved by owner (implementation only; no production deploy or GBP publication without explicit authorization)

## Goal

Promote a Diwali course offer on the existing Google Business Profile and on the website, while:
- keeping the existing payment lifecycle exactly as it is,
- enforcing each Diwali coupon once globally,
- preserving all student, payment, enrollment, and certificate data.

## Offer

| Item | Value |
|---|---|
| Regular course price | ₹2,000 (all 9 published courses) |
| `DIWALI500` | ₹500 off → ₹1,500 |
| `DIWALI250` | ₹250 off → ₹1,750 |
| Validity | 2026-10-28 → 2026-11-15 |
| Website CTA | https://edunexus.kibm.in/courses |

## Payment lifecycle (unchanged)

`createOrder` (INITIATED) → student pays via existing UPI/QR → `submitPaymentForVerification` (PENDING) → admin manually verifies (VERIFIED, creates/activates Enrollment).

No change to: UPI ID, payee name, QR payload, payment instructions, proof submission, admin verification, enrollment rules, historical records. No auto-verification or auto-enrollment.

## Database — additive only

New tables:
- `Coupon`: code (unique), description, discountType, discountValue, active, maxRedemptions, redemptionCount, validFrom, validUntil.
- `CouponRedemption`: couponId, userId, paymentId (unique), status (`RESERVED` | `CONSUMED` | `RELEASED`), reservedAt, resolvedAt.

New nullable/default columns on `Payment`:
- `couponCode String?`
- `discountAmount Int @default(0)`

No existing column is altered or deleted. No seed/reset.

## Coupon enforcement

- Atomic claim at order creation: `UPDATE Coupon SET redemptionCount = redemptionCount + 1 WHERE code = ? AND active AND redemptionCount < maxRedemptions`. Only one concurrent caller succeeds.
- Reservation row created in the same transaction as the Payment.
- Release on admin `FAILED` and on payment delete.
- Lazy auto-release of `RESERVED` coupons older than 24 hours whose Payment is still `INITIATED` (abandoned checkout). `PENDING` payments keep the coupon locked.
- Admin verification marks the redemption `CONSUMED`.
- Legacy hardcoded coupons (`SAVI10`, `AVI050`, `AVI030`, `NEXUS499`, `EDU499`, `SPECIAL499`) keep their current behavior and are not globally limited.

## Backend

- New `couponService` with validate / reserve / release helpers.
- New authenticated endpoint `POST /api/payments/coupon/validate` returning `{ valid, discountAmount, finalAmount, couponApplied, message }`. It does not create a Payment.
- `createOrder` re-derives price from the course row and applies the server-side coupon/discount math (client amount remains untrusted).
- Best-discount rule: `finalDiscount = max(referralDiscount, couponDiscount)`. A coupon is claimed only when it actually wins over the referral discount.

## Frontend

- PayPage applies coupons through the validation endpoint; existing UPI/QR/proof UI is unchanged.
- New dismissible `DiwaliOfferPopup` on the Home page only, responsive on mobile and desktop, frequency-limited via localStorage (24h), CTA to `/courses`, and no automatic coupon application.

## Data script

`backend/prisma/apply_diwali_offer.ts`:
- dry-run unless `--apply`
- sets the 9 catalog courses to ₹2,000
- upserts `DIWALI500` and `DIWALI250` with `redemptionCount = 0`
- never touches payments, enrollments, or historical amounts

## Google Business Profile

No GBP API or authorized integration is configured, and the public Maps link is JavaScript-only. Therefore:
- prepare ready-to-publish Offer/Update content and owner instructions in `docs/diwali-gbp-offer.md`,
- report status as **NOT PUBLISHED**,
- never request or expose Google credentials,
- never create a duplicate profile or edit business identity fields.

## Validation

Local only (no production deploy):
- backend `tsc` build + frontend production build
- API integration checks on a local database:
  - ₹2,000 → `DIWALI500` = ₹1,500, `DIWALI250` = ₹1,750
  - second use of the same coupon rejected
  - `FAILED` releases the coupon
  - proof submission → PENDING; no course access before verification; admin verify → VERIFIED + Enrollment ACTIVE
  - payment destination/QR/proof files unchanged (git diff)
- Playwright check of the popup at mobile and desktop widths
- row-count comparison before/after to prove data preservation

## Out of scope / not done without approval

- production deploy
- production migration or price script execution
- GBP publication
- any change to payment destination, gateway, proof flow, verification, or enrollment rules

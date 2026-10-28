import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { getReferralStats } from './authService';

/**
 * Diwali offer coupon support (2026-10-28).
 *
 * Guarantees:
 *  - The final payable amount is always derived from the course row in the
 *    database. A client-supplied amount is never trusted.
 *  - A database coupon is claimed atomically via an UPDATE ... WHERE
 *    redemptionCount < maxRedemptions, so two concurrent checkouts can never
 *    both use a single-use code.
 *  - Claim/release never changes the payment state machine. Coupons are
 *    reserved on Payment creation (INITIATED) only; admin verification still
 *    decides VERIFIED, and only that transition grants enrollment.
 *  - Legacy hardcoded coupons keep their previous behaviour and are not
 *    globally limited.
 */

/** Old percentage coupons — behaviour unchanged (issue #100). */
const LEGACY_PERCENT_COUPONS: Record<string, number> = {
  SAVI10: 0.1,
  AVI050: 0.5,
  AVI030: 0.3,
};

/** Old flat-₹200 coupons — behaviour unchanged. */
const LEGACY_FLAT_200_COUPONS = new Set(['NEXUS499', 'EDU499', 'SPECIAL499']);

/** Hard ceiling shared by every coupon path (same guard as issue #68). */
const MAX_DISCOUNT_RATE = 0.5;

/** Abandoned INITIATED orders release their coupon after this window. */
const RESERVATION_TTL_MS = 24 * 60 * 60 * 1000;

export const normalizeCouponCode = (code?: string | null) =>
  (code || '').toUpperCase().trim();

const capDiscount = (basePrice: number, amount: number) =>
  Math.max(0, Math.min(Math.round(amount), Math.floor(basePrice * MAX_DISCOUNT_RATE)));

export interface CouponQuote {
  valid: boolean;
  code: string;
  /** best discount in rupees (coupon or referral, whichever is larger) */
  discountAmount: number;
  /** coupon-only discount in rupees */
  couponDiscountAmount: number;
  /** referral-only discount in rupees */
  referralDiscountAmount: number;
  finalAmount: number;
  couponApplied: boolean;
  /** true when this code is a database coupon subject to global limits */
  globallyLimited: boolean;
  message?: string;
}

type CouponRow = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  active: boolean;
  maxRedemptions: number;
  redemptionCount: number;
  validFrom: Date | null;
  validUntil: Date | null;
};

/** Rupee value of a database coupon at the given base price. */
const databaseCouponAmount = (coupon: CouponRow, basePrice: number) => {
  if (coupon.discountType === 'PERCENT') {
    return capDiscount(basePrice, (basePrice * coupon.discountValue) / 100);
  }
  return capDiscount(basePrice, coupon.discountValue);
};

/** Rupee value of a legacy hardcoded coupon, or null when the code is unknown. */
const legacyCouponAmount = (code: string, basePrice: number): number | null => {
  if (code in LEGACY_PERCENT_COUPONS) {
    return capDiscount(basePrice, basePrice * LEGACY_PERCENT_COUPONS[code]);
  }
  if (LEGACY_FLAT_200_COUPONS.has(code)) {
    return capDiscount(basePrice, 200);
  }
  return null;
};

const isWithinWindow = (coupon: CouponRow, now = new Date()) => {
  if (coupon.validFrom && now < coupon.validFrom) return false;
  if (coupon.validUntil && now > coupon.validUntil) return false;
  return true;
};

/**
 * Pure-ish quote used by the validation endpoint and by createOrder.
 * It does NOT reserve anything — createOrder claims inside its transaction.
 */
export const quoteCoupon = async (
  userId: number,
  courseId: string,
  rawCode: string
): Promise<CouponQuote & { coupon?: CouponRow }> => {
  const code = normalizeCouponCode(rawCode);
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      couponDiscountAmount: 0,
      referralDiscountAmount: 0,
      finalAmount: 0,
      couponApplied: false,
      globallyLimited: false,
      message: 'Course not found.',
    };
  }

  const basePrice = course.price;

  // Referral reward is capped at 50% (issue #68). The best discount wins.
  const user = await prisma.user.findUnique({ where: { id: userId } });
  let referralAmount = 0;
  if (user?.referralCode) {
    const stats = await getReferralStats(user.referralCode);
    if (stats.referralSuccess) {
      referralAmount = capDiscount(basePrice, basePrice * 0.5);
    }
  }

  const dbCoupon = await prisma.coupon.findUnique({ where: { code } });
  let couponAmount = 0;
  let globallyLimited = false;

  if (dbCoupon) {
    globallyLimited = true;
    if (!dbCoupon.active) {
      return {
        valid: false,
        code,
        discountAmount: 0,
        couponDiscountAmount: 0,
        referralDiscountAmount: referralAmount,
        finalAmount: basePrice,
        couponApplied: false,
        globallyLimited,
        message: 'This coupon is no longer active.',
      };
    }
    if (!isWithinWindow(dbCoupon)) {
      return {
        valid: false,
        code,
        discountAmount: 0,
        couponDiscountAmount: 0,
        referralDiscountAmount: referralAmount,
        finalAmount: basePrice,
        couponApplied: false,
        globallyLimited,
        message: 'This coupon is not valid on this date.',
      };
    }
    if (dbCoupon.redemptionCount >= dbCoupon.maxRedemptions) {
      return {
        valid: false,
        code,
        discountAmount: 0,
        couponDiscountAmount: 0,
        referralDiscountAmount: referralAmount,
        finalAmount: basePrice,
        couponApplied: false,
        globallyLimited,
        message: 'This coupon has already been redeemed.',
      };
    }
    couponAmount = databaseCouponAmount(dbCoupon, basePrice);
  } else {
    const legacyAmount = legacyCouponAmount(code, basePrice);
    if (legacyAmount === null) {
      return {
        valid: false,
        code,
        discountAmount: 0,
        couponDiscountAmount: 0,
        referralDiscountAmount: referralAmount,
        finalAmount: basePrice,
        couponApplied: false,
        globallyLimited: false,
        message: 'Invalid coupon code.',
      };
    }
    couponAmount = legacyAmount;
  }

  const discountAmount = Math.max(referralAmount, couponAmount);
  const couponApplied = couponAmount > 0 && couponAmount >= referralAmount;

  return {
    valid: true,
    code,
    discountAmount,
    couponDiscountAmount: couponAmount,
    referralDiscountAmount: referralAmount,
    finalAmount: Math.max(0, basePrice - discountAmount),
    couponApplied,
    globallyLimited,
    coupon: dbCoupon || undefined,
    message: couponApplied
      ? undefined
      : 'Your referral discount is better than this coupon, so the referral discount is applied.',
  };
};

/** Thrown when another checkout claimed the code between quote and claim. */
export class CouponUnavailableError extends Error {
  constructor(message = 'This coupon has already been redeemed.') {
    super(message);
    this.name = 'CouponUnavailableError';
  }
}

/**
 * Atomically claim a database coupon and write its reservation row.
 * Must be called inside the same transaction that creates the Payment, so a
 * failure rolls the payment back rather than leaving an unclaimed order.
 */
export const claimCoupon = async (
  tx: Prisma.TransactionClient,
  couponId: string,
  maxRedemptions: number,
  userId: number,
  paymentId: string
) => {
  const claimed = await tx.coupon.updateMany({
    where: {
      id: couponId,
      active: true,
      redemptionCount: { lt: maxRedemptions },
    },
    data: { redemptionCount: { increment: 1 } },
  });

  if (claimed.count !== 1) {
    throw new CouponUnavailableError();
  }

  await tx.couponRedemption.create({
    data: {
      couponId,
      userId,
      paymentId,
      status: 'RESERVED',
    },
  });
};

/** Mark a coupon as successfully redeemed after admin verification. */
export const consumeCouponForPayment = async (paymentId: string) => {
  await prisma.couponRedemption.updateMany({
    where: { paymentId, status: 'RESERVED' },
    data: { status: 'CONSUMED', resolvedAt: new Date() },
  });
};

/**
 * Return a reserved coupon to the pool. Only RESERVED redemptions are
 * released — a CONSUMED coupon (already admin-verified) is never reusable.
 */
export const releaseCouponForPayment = async (paymentId: string) => {
  const redemption = await prisma.couponRedemption.findUnique({
    where: { paymentId },
    select: { id: true, couponId: true, status: true },
  });

  if (!redemption || redemption.status !== 'RESERVED') return;

  await prisma.$transaction(async (tx) => {
    const released = await tx.couponRedemption.updateMany({
      where: { id: redemption.id, status: 'RESERVED' },
      data: { status: 'RELEASED', resolvedAt: new Date() },
    });

    if (released.count === 1) {
      await tx.coupon.updateMany({
        where: { id: redemption.couponId, redemptionCount: { gt: 0 } },
        data: { redemptionCount: { decrement: 1 } },
      });
    }
  });
};

/**
 * Lazy sweep for abandoned checkouts: a coupon reserved more than 24h ago on
 * a Payment that never left INITIATED is released. PENDING payments keep
 * their reservation because an admin decision is still outstanding.
 */
export const releaseStaleReservations = async (now = new Date()) => {
  const cutoff = new Date(now.getTime() - RESERVATION_TTL_MS);

  const stale = await prisma.couponRedemption.findMany({
    where: {
      status: 'RESERVED',
      reservedAt: { lt: cutoff },
      payment: { status: 'INITIATED' },
    },
    select: { id: true, couponId: true },
  });

  for (const redemption of stale) {
    await prisma.$transaction(async (tx) => {
      const released = await tx.couponRedemption.updateMany({
        where: { id: redemption.id, status: 'RESERVED' },
        data: { status: 'RELEASED', resolvedAt: now },
      });

      if (released.count === 1) {
        await tx.coupon.updateMany({
          where: { id: redemption.couponId, redemptionCount: { gt: 0 } },
          data: { redemptionCount: { decrement: 1 } },
        });
      }
    });
  }
};

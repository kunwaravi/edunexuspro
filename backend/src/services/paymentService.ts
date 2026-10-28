import prisma from '../lib/prisma';
import crypto from 'crypto';
import { getReferralStats } from './authService';
import { syncEnrollmentFromVerifiedPayment } from './enrollmentService';
import {
  claimCoupon,
  consumeCouponForPayment,
  CouponUnavailableError,
  quoteCoupon,
  releaseCouponForPayment,
  releaseStaleReservations,
} from './couponService';

export const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

// A payment is considered "paid" only when Admin has manually verified it
export const getPaymentStatus = async (userId: number, courseId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      courseId,
      status: 'VERIFIED'
    }
  });
  return payment;
};

// Latest row still awaiting admin action (PENDING or legacy PENDING_VERIFICATION).
// Used by the /pay page to resume the "awaiting verification" state after a refresh.
export const getPendingPaymentStatus = async (userId: number, courseId: string) => {
  return await prisma.payment.findFirst({
    where: {
      userId,
      courseId,
      status: { in: ['PENDING', 'PENDING_VERIFICATION'] }
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * NOTE (master task §24/§27): `amount` is part of the route contract but is
 * deliberately NOT read — the price is re-derived below from the course row in
 * the database. A client-supplied amount must never be trusted; tsc flags this
 * parameter as unused, and "fixing" that by actually charging `amount` would
 * let a caller name their own price. Behaviour unchanged.
 */
export const createOrder = async (userId: number, courseId: string, amount: number, couponCode?: string) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { userId, courseId, status: { in: ['VERIFIED', 'PENDING', 'PENDING_VERIFICATION'] } }
  });

  if (existingPayment?.status === 'VERIFIED') {
    return { error: 'Certificate already unlocked for this course.', status: 400 };
  }
  if (existingPayment?.status === 'PENDING' || existingPayment?.status === 'PENDING_VERIFICATION') {
    return { error: 'Payment proof already submitted and is pending admin verification. Please wait.', status: 400 };
  }

  // Fetch course details to get the actual price
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  const basePrice = course ? course.price : 699;

  // Fetch user's referral code and calculate referral count
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  let referralDiscount = 0;
  let referralCount = 0;
  if (user && user.referralCode) {
    const stats = await getReferralStats(user.referralCode);
    referralCount = stats.referralCount;
    if (stats.referralSuccess) {
      // BUSINESS (#68): cap referral discount at 50% — 100% free was a
      // money-loss exploit via fake-referral signups.
      referralDiscount = 0.5;
    }
  }

  // Coupon quote. Database coupons (Diwali) are globally limited and are
  // claimed atomically inside the payment transaction below. Legacy hardcoded
  // coupons keep their previous behaviour.
  let couponQuote: Awaited<ReturnType<typeof quoteCoupon>> | null = null;
  if (couponCode) {
    // Release coupons abandoned in INITIATED checkouts > 24h ago before
    // deciding whether this code is still available.
    await releaseStaleReservations();
    couponQuote = await quoteCoupon(userId, courseId, couponCode);

    // An inactive/expired/used database coupon is a hard error: the student
    // must never pay full price while believing a discount was applied.
    if (!couponQuote.valid && couponQuote.globallyLimited) {
      return { error: couponQuote.message || 'This coupon is not available.', status: 400 };
    }
  }

  const couponApplied = !!couponQuote?.valid && couponQuote.couponApplied;
  const couponRupees = couponQuote?.valid ? couponQuote.couponDiscountAmount : 0;
  const referralRupees = couponQuote?.referralDiscountAmount ?? Math.round(basePrice * referralDiscount);
  const discountRupees = Math.max(referralRupees, couponApplied ? couponRupees : 0);
  const finalDiscount = basePrice > 0 ? discountRupees / basePrice : 0;
  // Clamp so a ≥100% discount can never produce a zero/negative amount that a
  // later auto-VERIFY check could treat as "paid".
  const finalAmount = Math.max(0, basePrice - discountRupees);

  // Payment state machine (#100): INITIATED → PENDING → VERIFIED / FAILED.
  // SECURITY: EVERY order starts INITIATED — even a ₹0 order requires manual
  // admin verification. No coupon/discount path may auto-VERIFY payment.
  const status = 'INITIATED';

  try {
    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          userId,
          courseId,
          amount: finalAmount,
          status,
          couponCode: couponApplied ? couponQuote!.code : null,
          discountAmount: discountRupees,
        }
      });

      // Claim last, in the same transaction: if another checkout already used
      // the code, this throws and the Payment row above is rolled back.
      if (couponApplied && couponQuote?.coupon) {
        await claimCoupon(
          tx,
          couponQuote.coupon.id,
          couponQuote.coupon.maxRedemptions,
          userId,
          created.id
        );
      }

      return created;
    });

    return {
      orderId: payment.id,
      amount: payment.amount,
      courseId: payment.courseId,
      discountApplied: finalDiscount * 100,
      referralCount,
      isFree: finalAmount === 0
    };
  } catch (error) {
    if (error instanceof CouponUnavailableError) {
      return { error: error.message, status: 400 };
    }
    throw error;
  }
};

// Student submits payment proof — sets status to PENDING for admin review, or VERIFIED if free.
// SECURITY (#100): the old "cryptographic signature" was mock theater — the client simply echoed an HMAC
// the server had handed it, so it gated nothing. The real gates are (1) ownership: the authenticated
// submitter must own the order (IDOR fix) and (2) manual admin verification.
export const submitPaymentForVerification = async (
  orderId: string,
  userId: number,
  gatewayReference?: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: orderId }
  });

  if (!payment) return { error: 'Order not found', status: 404 };

  if (payment.userId !== userId) {
    return { error: 'This payment order does not belong to your account.', status: 403 };
  }

  // SECURITY: always route to admin verification — even ₹0 (fully-discounted)
  // orders require manual approval. No order may auto-VERIFY on submit.
  const newStatus = 'PENDING';
  const updatedPayment = await prisma.payment.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      reference: gatewayReference || `UPI_REF_${crypto.randomBytes(6).toString('hex').toUpperCase()}`
    }
  });

  return { success: true, payment: updatedPayment };
};

// Admin manually verifies and approves a payment — unlocks certificate for student
// TASK 4: the VERIFIED transition also activates the student's Enrollment
// (access record), so premium learning unlocks together with the certificate.
// Idempotent: enrollment upsert keys on [userId, courseId]. Payment remains the
// financial/audit record and is never replaced by enrollment.
export const adminVerifyPayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found', status: 404 };

  if (payment.status === 'VERIFIED') {
    return { error: 'Payment is already verified', status: 400 };
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'VERIFIED' }
  });

  // The coupon is now permanently consumed. A RESERVED row may only be
  // consumed here — never by createOrder or proof submission.
  await consumeCouponForPayment(paymentId);

  // Only the VERIFIED transition activates enrollment. INITIATED / PENDING /
  // FAILED never reach this code path (adminMarkFailed never sets VERIFIED).
  await syncEnrollmentFromVerifiedPayment(payment.userId, payment.courseId);

  return { success: true, payment: updatedPayment };
};

// Admin manually marks a payment as failed (e.g. proof invalid / no UPI received).
// Completes the #100 state machine: INITIATED → PENDING → VERIFIED / FAILED.
export const adminMarkFailed = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found', status: 404 };

  if (payment.status === 'VERIFIED' || payment.status === 'SUCCESS') {
    return { error: 'Cannot fail an already verified payment.', status: 400 };
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'FAILED' }
  });

  // Failed payment → the reserved coupon returns to the pool. Only RESERVED
  // redemptions are released; a VERIFIED (CONSUMED) coupon stays spent.
  await releaseCouponForPayment(paymentId);

  return { success: true, payment: updatedPayment };
};

// Admin manually deletes a payment record (spam/duplicates/invalid)
export const deletePayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found', status: 404 };

  // Release a still-reserved coupon before the cascade delete removes the
  // redemption row. A CONSUMED coupon is untouched.
  await releaseCouponForPayment(paymentId);

  await prisma.payment.delete({
    where: { id: paymentId }
  });

  return { success: true };
};

import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

/**
 * TASK 4 — Enrollment access control (single source of truth).
 *
 * Canonical rule:
 *   ACTIVE Enrollment      → course learning access
 *   SUSPENDED / EXPIRED    → no premium learning access
 *
 * Enrollment is the access record; Payment remains the financial/audit record.
 * All premium course-learning routes MUST route through these helpers instead
 * of duplicating enrollment logic.
 */

export const ENROLLMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  EXPIRED: 'EXPIRED',
} as const;

/** Raw enrollment row for a (user, course) pair, if any. */
export const getEnrollment = async (userId: number, courseId: string) => {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
};

/** True only when an ACTIVE enrollment exists for the pair. */
export const isEnrolled = async (userId: number, courseId: string) => {
  const enrollment = await getEnrollment(userId, courseId);
  return !!enrollment && enrollment.status === ENROLLMENT_STATUS.ACTIVE;
};

/**
 * Admin operators always have course access (they build/verify content and the
 * CMS reuses the same module endpoint). Everyone else needs an ACTIVE
 * enrollment. Never trust a client-supplied courseId alone — the enrollment is
 * keyed to the authenticated user's id from the JWT.
 */
export const canAccessCourse = async (user: { id: number; role?: string }, courseId: string) => {
  if (user.role === 'ADMIN') return true;
  return isEnrolled(user.id, courseId);
};

/**
 * Express guard: 403 with a clean, non-leaking message when the caller is not
 * allowed to access this course's premium content. Returns true when allowed.
 */
export const requireEnrollment = async (req: any, res: any, courseId: string) => {
  if (await canAccessCourse(req.user, courseId)) return true;
  res.status(403).json({ message: 'Access to this course requires an active enrollment.' });
  return false;
};

/** Throwing variant for service-layer guards (AppError → 403 via errorHandler). */
export const assertEnrolled = async (user: { id: number; role?: string }, courseId: string) => {
  if (!(await canAccessCourse(user, courseId))) {
    throw new AppError('Access to this course requires an active enrollment.', 403);
  }
};

/**
 * Create/activate the enrollment for a (user, course) that now has a VERIFIED
 * payment. Idempotent (unique [userId, courseId]). ONLY called on the VERIFIED
 * transition — PENDING/INITIATED/FAILED never trigger it.
 */
export const syncEnrollmentFromVerifiedPayment = async (userId: number, courseId: string) => {
  return prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { status: ENROLLMENT_STATUS.ACTIVE, source: 'PAYMENT' },
    create: { userId, courseId, status: ENROLLMENT_STATUS.ACTIVE, source: 'PAYMENT' },
  });
};

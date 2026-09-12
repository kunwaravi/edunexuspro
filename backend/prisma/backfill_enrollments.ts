import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/**
 * TASK 4 — Backfill Enrollments from VERIFIED payments.
 *
 * Rules:
 *  - For every Payment where status === "VERIFIED", upsert an Enrollment:
 *      userId, courseId, status ACTIVE, source "PAYMENT".
 *  - Idempotent: the @@unique([userId, courseId]) makes re-runs a no-op.
 *  - CourseProgress WITHOUT a VERIFIED payment is NOT converted into an
 *    enrollment. Decision (documented in task4 report §B): the existing
 *    application treats CourseProgress as a LEARNING record (created when a
 *    user passes quizzes), not as proof of purchase — access checks today
 *    (forum POST, certificate generation) key off VERIFIED payment, never
 *    off progress. Fabricating paid enrollments from progress would invent
 *    purchase history, so we do not.
 *  - This script is safe to run more than once and on prod.
 */
async function main() {
  // 1. All VERIFIED payments (financial/audit record is untouched).
  const verifiedPayments = await prisma.payment.findMany({
    where: { status: 'VERIFIED' },
    select: { userId: true, courseId: true },
  });

  // Distinct (userId, courseId) pairs — multiple verified rows for the same
  // pair collapse into one enrollment via the unique constraint.
  const pairs = new Map<string, { userId: number; courseId: string }>();
  for (const p of verifiedPayments) {
    pairs.set(`${p.userId}:${p.courseId}`, { userId: p.userId, courseId: p.courseId });
  }

  let created = 0;
  let updated = 0;

  // Snapshot existing enrollment keys so created/updated is counted accurately
  // (timestamps differ by microseconds even on create, so they can't be used).
  const existing = await prisma.enrollment.findMany({ select: { userId: true, courseId: true } });
  const existingKeys = new Set(existing.map((e) => `${e.userId}:${e.courseId}`));

  for (const { userId, courseId } of pairs.values()) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { status: 'ACTIVE', source: 'PAYMENT' },
      create: { userId, courseId, status: 'ACTIVE', source: 'PAYMENT' },
    });
    if (existingKeys.has(`${userId}:${courseId}`)) updated++;
    else created++;
  }

  // 2. Report: users with CourseProgress but NO verified payment (informational
  //    only — these are NOT granted enrollment).
  const progressUsers = await prisma.courseProgress.findMany({
    select: { userId: true, courseId: true },
  });
  const progressPairs = new Map<string, { userId: number; courseId: string }>();
  for (const p of progressUsers) {
    progressPairs.set(`${p.userId}:${p.courseId}`, { userId: p.userId, courseId: p.courseId });
  }
  const progressWithoutPayment = [...progressPairs.keys()].filter((k) => !pairs.has(k));

  // 3. Summary.
  const totalEnrollments = await prisma.enrollment.count();
  const dupCheck = await prisma.enrollment.groupBy({
    by: ['userId', 'courseId'],
    _count: { _all: true },
    having: { userId: { _count: { gt: 1 } } },
  });

  console.log('=== Enrollment Backfill Summary ===');
  console.log(`Verified payment rows:        ${verifiedPayments.length}`);
  console.log(`Distinct (user, course) pairs: ${pairs.size}`);
  console.log(`Enrollments upserted:          ${pairs.size} (created ${created}, already-present/updated ${updated})`);
  console.log(`Total Enrollment rows:         ${totalEnrollments}`);
  console.log(`Duplicate (user, course) rows: ${dupCheck.length}`);
  console.log(`CourseProgress pairs w/o VERIFIED payment (NOT enrolled): ${progressWithoutPayment.length}`);

  if (progressWithoutPayment.length > 0) {
    console.log('Sample (first 10) — learning-only, no purchase, not enrolled:');
    progressWithoutPayment.slice(0, 10).forEach((k) => console.log(`  - ${k}`));
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

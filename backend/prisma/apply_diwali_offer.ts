/**
 * Diwali 2026 offer data update — idempotent and additive.
 *
 * What it does:
 *  - sets the 9 catalog courses to the ₹2,000 regular price
 *  - upserts DIWALI500 (₹500 off) and DIWALI250 (₹250 off), max 1 redemption
 *
 * What it never does:
 *  - touches Payment / Enrollment / CertificateRecord rows
 *  - changes historical payment amounts
 *  - resets an existing coupon's redemptionCount (a used coupon stays used)
 *  - runs without --apply
 *
 * Usage:
 *   npx ts-node prisma/apply_diwali_offer.ts           # dry run
 *   npx ts-node prisma/apply_diwali_offer.ts --apply   # write
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const APPLY = process.argv.includes('--apply');

const COURSE_IDS = [
  'C',
  'C++',
  'IoT',
  'Embedded',
  'WebDesign',
  'Python',
  'SQL',
  'CADDED_Mech',
  'CADDED_Civil',
];

const REGULAR_PRICE = 2000;

// Offer window is IST (UTC+05:30).
const VALID_FROM = new Date('2026-10-28T00:00:00+05:30');
const VALID_UNTIL = new Date('2026-11-15T23:59:59+05:30');

const COUPONS = [
  {
    code: 'DIWALI500',
    description: 'Diwali 2026 — ₹500 off any ₹2,000 course',
    discountValue: 500,
  },
  {
    code: 'DIWALI250',
    description: 'Diwali 2026 — ₹250 off any ₹2,000 course',
    discountValue: 250,
  },
];

const main = async () => {
  console.log(`\nEduNexus Diwali offer — ${APPLY ? 'APPLY' : 'DRY RUN'}\n`);

  const beforeCourses = await prisma.course.findMany({
    where: { id: { in: COURSE_IDS } },
    select: { id: true, title: true, price: true },
    orderBy: { id: 'asc' },
  });

  if (beforeCourses.length !== COURSE_IDS.length) {
    const found = new Set(beforeCourses.map((course) => course.id));
    const missing = COURSE_IDS.filter((id) => !found.has(id));
    console.error(`Aborting: missing course(s) in this database: ${missing.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  console.log('Courses:');
  for (const course of beforeCourses) {
    console.log(`  ${course.id.padEnd(14)} ${String(course.price).padStart(5)} → ${REGULAR_PRICE}  (${course.title})`);
  }

  const beforePayments = await prisma.payment.count();
  const beforeEnrollments = await prisma.enrollment.count();

  for (const coupon of COUPONS) {
    const existing = await prisma.coupon.findUnique({ where: { code: coupon.code } });
    console.log(
      `Coupon ${coupon.code}: ${existing
        ? `exists (used ${existing.redemptionCount}/${existing.maxRedemptions})`
        : 'will be created'}`
    );
  }

  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write changes.');
    console.log('Payments/enrollments will not be touched.\n');
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.course.updateMany({
      where: { id: { in: COURSE_IDS } },
      data: { price: REGULAR_PRICE },
    });

    for (const coupon of COUPONS) {
      await tx.coupon.upsert({
        where: { code: coupon.code },
        update: {
          description: coupon.description,
          discountType: 'FLAT',
          discountValue: coupon.discountValue,
          active: true,
          maxRedemptions: 1,
          validFrom: VALID_FROM,
          validUntil: VALID_UNTIL,
          // redemptionCount is intentionally not reset.
        },
        create: {
          code: coupon.code,
          description: coupon.description,
          discountType: 'FLAT',
          discountValue: coupon.discountValue,
          active: true,
          maxRedemptions: 1,
          validFrom: VALID_FROM,
          validUntil: VALID_UNTIL,
        },
      });
    }
  });

  const afterCourses = await prisma.course.findMany({
    where: { id: { in: COURSE_IDS } },
    select: { id: true, price: true },
    orderBy: { id: 'asc' },
  });
  const afterPayments = await prisma.payment.count();
  const afterEnrollments = await prisma.enrollment.count();

  console.log('\nAfter:');
  for (const course of afterCourses) {
    console.log(`  ${course.id.padEnd(14)} ₹${course.price}`);
  }
  for (const coupon of COUPONS) {
    const row = await prisma.coupon.findUnique({ where: { code: coupon.code } });
    console.log(
      `  ${coupon.code.padEnd(10)} ₹${row?.discountValue} off, ${row?.redemptionCount}/${row?.maxRedemptions} used, active=${row?.active}`
    );
  }

  console.log(`\nPayments:    ${beforePayments} → ${afterPayments}`);
  console.log(`Enrollments: ${beforeEnrollments} → ${afterEnrollments}`);
  console.log('\nDone. No payment or enrollment row was modified.\n');
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/**
 * TASK 4 §K — data safety snapshot. Prints the counts that must NEVER
 * decrease across a migration + backfill. Run before and after.
 */
async function main() {
  const tables = {
    Course: prisma.course.count(),
    Module: prisma.module.count(),
    Topic: prisma.topic.count(),
    Payment: prisma.payment.count(),
    CourseProgress: prisma.courseProgress.count(),
    ModuleProgress: prisma.moduleProgress.count(),
    TopicProgress: prisma.topicProgress.count(),
    CertificateRecord: prisma.certificateRecord.count(),
    Enrollment: prisma.enrollment.count(),
  };

  const results = await Promise.all(Object.entries(tables).map(async ([name, p]) => [name, await p]));

  console.log('=== Data safety counts ===');
  for (const [name, count] of results) {
    console.log(`${name.padEnd(20)} ${count}`);
  }

  const verifiedPayments = await prisma.payment.findMany({
    where: { status: 'VERIFIED' },
    select: { userId: true, courseId: true },
  });
  const distinctPairs = new Set(verifiedPayments.map((p) => `${p.userId}:${p.courseId}`));
  console.log('\nVerified payments (rows):       ', verifiedPayments.length);
  console.log('Distinct (user, course) pairs:  ', distinctPairs.size);

  const enrollments = await prisma.enrollment.findMany({
    select: { userId: true, courseId: true, status: true },
  });
  const enrPairs = new Set(enrollments.map((e) => `${e.userId}:${e.courseId}`));
  console.log('Enrollment rows:                 ', enrollments.length);
  console.log('Distinct enrollment pairs:       ', enrPairs.size);
  console.log('ACTIVE enrollments:              ', enrollments.filter((e) => e.status === 'ACTIVE').length);
  console.log('Duplicate enrollment pairs:      ', enrollments.length - enrPairs.size);

  // Every ACTIVE enrollment must reference a real User and Course (FKs enforce
  // this, but surface it explicitly).
  const orphanCheck = await prisma.$queryRaw`
    SELECT count(*)::int AS orphans FROM "Enrollment" e
    LEFT JOIN "User" u ON u.id = e."userId"
    LEFT JOIN "Course" c ON c.id = e."courseId"
    WHERE u.id IS NULL OR c.id IS NULL`;
  console.log('Enrollments with missing User/Course FK: ', (orphanCheck as any)[0]?.orphans ?? 'n/a');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

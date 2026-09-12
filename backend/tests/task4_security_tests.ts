import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRequiredEnv } from '../src/lib/env';
import { syncEnrollmentFromVerifiedPayment } from '../src/services/enrollmentService';

dotenv.config();

const prisma = new PrismaClient();
const BASE = 'http://localhost:5000/api';
const JWT_SECRET = getRequiredEnv('JWT_SECRET');

/** Mint an auth token for a real DB user id (same shape as authService). */
const tokenFor = (userId: number) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

async function api(method: string, path: string, token?: string, body?: any) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data: any = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, data };
}

const results: { name: string; pass: boolean; detail: string }[] = [];
const check = (name: string, pass: boolean, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

async function main() {
  // ---- Fixtures -------------------------------------------------------------
  const enrolled = await prisma.enrollment.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  });
  if (!enrolled) throw new Error('No ACTIVE enrollment exists — run backfill first.');
  const enrolledUserId = enrolled.userId;
  const enrolledCourseId = enrolled.courseId;

  // "Other" courses must be ones this user is NOT enrolled in (a fixture user
  // may legitimately hold several ACTIVE enrollments).
  const enrolledCourses = new Set(
    (await prisma.enrollment.findMany({ where: { userId: enrolledUserId } })).map((e) => e.courseId)
  );
  const allCourses = await prisma.course.findMany({ select: { id: true } });
  const notEnrolledCourses = allCourses.filter((c) => !enrolledCourses.has(c.id));
  if (notEnrolledCourses.length < 2) {
    throw new Error('Fixture requires at least 2 courses the enrolled user is NOT enrolled in.');
  }
  const otherCourse = notEnrolledCourses[0].id;
  const thirdCourse = notEnrolledCourses[1].id;

  const nonEnrolled = await prisma.user.findFirst({
    where: { id: { notIn: [enrolledUserId] }, role: 'USER' },
  });
  if (!nonEnrolled) throw new Error('No non-enrolled user fixture found.');
  const nonEnrolledUserId = nonEnrolled.id;

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin fixture found.');

  // A C++ topic + C++ question for cross-course attacks (enrolled course is not C++).
  const crossTopic = await prisma.topic.findFirst({
    where: { module: { courseId: otherCourse } },
  });
  const crossQuestion = await prisma.quizQuestion.findFirst({
    where: { module: { courseId: otherCourse } },
  });
  if (!crossTopic || !crossQuestion) throw new Error(`No topic/question in ${otherCourse}.`);

  const enrolledTok = tokenFor(enrolledUserId);
  const nonEnrolledTok = tokenFor(nonEnrolledUserId);
  const adminTok = tokenFor(admin.id);

  // Temp-row cleanup registry (rows we create must be removed on exit).
  const cleanup: (() => Promise<void>)[] = [];

  try {
    // 1. Enrolled user CAN read a premium lesson in their own course.
    {
      const r = await api('GET', `/courses/${enrolledCourseId}/module/1`, enrolledTok);
      const hasPremiumText = Array.isArray(r.data?.topics) && r.data.topics.some((t: any) => !!t.text);
      check('1. Enrolled user can access own course premium lesson', r.status === 200 && hasPremiumText, `GET ${enrolledCourseId}/module/1 → ${r.status}`);
    }

    // 2. Same user CANNOT read a premium lesson in an un-enrolled course.
    {
      const r = await api('GET', `/courses/${otherCourse}/module/1`, enrolledTok);
      check('2. Enrolled user blocked from another course premium lesson', r.status === 403, `GET ${otherCourse}/module/1 → ${r.status} (${r.data?.message})`);
    }

    // 3. Cross-course topicId: topic quiz for the OTHER course's topic → 403.
    {
      const r = await api('GET', `/quiz/questions/topic/${crossTopic.id}`, enrolledTok);
      check('3. Cross-course topic quiz rejected (topicId from another course)', r.status === 403, `topic ${crossTopic.id} (course ${otherCourse}) → ${r.status}`);
    }

    // 4. Cross-course quiz submit: courseId=enrolled, answers reference other-course questions → 403.
    {
      const r = await api('POST', '/quiz/submit', enrolledTok, {
        courseId: enrolledCourseId,
        week: 1,
        answers: { [crossQuestion.id]: 'whatever' },
      });
      check('4. Cross-course quiz submission rejected', r.status === 403, `answers w/ ${otherCourse} question id → ${r.status} (${r.data?.message})`);
    }

    // 5. PENDING payment does NOT grant access (temp row, cleaned up).
    {
      const pending = await prisma.payment.create({
        data: { userId: nonEnrolledUserId, courseId: enrolledCourseId, amount: 699, status: 'PENDING' },
      });
      cleanup.push(async () => { await prisma.payment.delete({ where: { id: pending.id } }).catch(() => {}); });
      const r = await api('GET', `/courses/${enrolledCourseId}/module/1`, nonEnrolledTok);
      check('5. PENDING payment does not grant access', r.status === 403, `user ${nonEnrolledUserId} → ${r.status}`);
    }

    // 6. FAILED payment does NOT grant access (temp row, cleaned up).
    {
      const failed = await prisma.payment.create({
        data: { userId: nonEnrolledUserId, courseId: enrolledCourseId, amount: 699, status: 'FAILED' },
      });
      cleanup.push(async () => { await prisma.payment.delete({ where: { id: failed.id } }).catch(() => {}); });
      const r = await api('GET', `/courses/${enrolledCourseId}/module/1`, nonEnrolledTok);
      check('6. FAILED payment does not grant access', r.status === 403, `user ${nonEnrolledUserId} → ${r.status}`);
    }

    // 7. VERIFIED payment (admin flow) creates ACTIVE enrollment (temp rows, cleaned up).
    {
      const fresh = await prisma.payment.create({
        data: { userId: nonEnrolledUserId, courseId: otherCourse, amount: 699, status: 'INITIATED' },
      });
      const { adminVerifyPayment } = await import('../src/services/paymentService');
      const result = await adminVerifyPayment(fresh.id);
      const enr = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: nonEnrolledUserId, courseId: otherCourse } },
      });
      const ok = !('error' in result) && result.payment.status === 'VERIFIED' && !!enr && enr.status === 'ACTIVE' && enr.source === 'PAYMENT';
      check('7. VERIFIED payment creates ACTIVE enrollment', ok, `payment→VERIFIED, enrollment ${enr?.status ?? 'MISSING'}`);
      cleanup.push(async () => {
        await prisma.enrollment.deleteMany({ where: { userId: nonEnrolledUserId, courseId: otherCourse } });
        await prisma.payment.delete({ where: { id: fresh.id } }).catch(() => {});
      });
    }

    // 8. syncEnrollmentFromVerifiedPayment is idempotent (no duplicate rows).
    {
      await syncEnrollmentFromVerifiedPayment(nonEnrolledUserId, otherCourse);
      await syncEnrollmentFromVerifiedPayment(nonEnrolledUserId, otherCourse);
      const count = await prisma.enrollment.count({
        where: { userId: nonEnrolledUserId, courseId: otherCourse },
      });
      check('8. Re-sync does not create duplicate enrollment', count === 1, `rows=${count}`);
    }

    // 9. SUSPENDED enrollment blocks premium access (temp row).
    {
      const suspended = await prisma.enrollment.create({
        data: { userId: nonEnrolledUserId, courseId: enrolledCourseId, status: 'SUSPENDED' },
      });
      cleanup.push(async () => { await prisma.enrollment.delete({ where: { id: suspended.id } }).catch(() => {}); });
      const r = await api('GET', `/courses/${enrolledCourseId}/module/1`, nonEnrolledTok);
      check('9. SUSPENDED enrollment blocks access', r.status === 403, `→ ${r.status}`);
    }

    // 10. EXPIRED enrollment blocks premium access (temp row, different course to
    //     avoid colliding with test 9's [userId, courseId] unique pair).
    {
      const expired = await prisma.enrollment.create({
        data: { userId: nonEnrolledUserId, courseId: thirdCourse, status: 'EXPIRED' },
      });
      cleanup.push(async () => { await prisma.enrollment.delete({ where: { id: expired.id } }).catch(() => {}); });
      const r = await api('GET', `/courses/${thirdCourse}/module/1`, nonEnrolledTok);
      check('10. EXPIRED enrollment blocks access', r.status === 403, `→ ${r.status}`);
    }

    // 11. Public catalog accessible WITHOUT any token/enrollment.
    {
      const r = await api('GET', '/courses');
      check('11. Public catalog accessible without enrollment', r.status === 200 && Array.isArray(r.data) && r.data.length > 0, `→ ${r.status}, ${r.data?.length} courses`);
    }

    // 12. Public detail stays safe — no lesson text/code/answer keys leaked.
    {
      const r = await api('GET', '/courses/cpp');
      const moduleLeak = (r.data?.modules ?? []).some((m: any) => m.topics?.some((t: any) => t.text || t.code));
      const noAnswers = (r.data?.modules ?? []).every((m: any) => !m.questions || m.questions.every((q: any) => !q.correctAnswer));
      check('12. Public detail exposes no premium lesson body/answers', r.status === 200 && !moduleLeak && noAnswers, `→ ${r.status}`);
    }

    // 13/14. Legacy id AND slug both resolve public detail.
    {
      const byId = await api('GET', '/courses/C');
      const bySlug = await api('GET', '/courses/c');
      check('13. Legacy /course/C resolves', byId.status === 200 && byId.data?.id === 'C', `→ ${byId.status}`);
      check('14. Slug /course/c resolves', bySlug.status === 200 && bySlug.data?.id === 'C', `→ ${bySlug.status}`);
    }

    // 15/16/17. Data safety — counts unchanged vs baseline.
    {
      const [prog, pay, cert, enr] = await Promise.all([
        prisma.courseProgress.count(),
        prisma.payment.count(),
        prisma.certificateRecord.count(),
        prisma.enrollment.count(),
      ]);
      // Baseline from pre-task state: 1 progress, 3 payments, 3 certs, 3 enrollments.
      // Temp rows still exist here (cleanup runs after) — payment/enrollment counts are
      // expected to be temporarily higher, so assert only the protected counts.
      check('15. CourseProgress records intact', prog === 1, `count=${prog}`);
      check('16. Payment records intact', pay >= 3, `count=${pay} (≥ baseline 3)`);
      check('17. CertificateRecord intact', cert === 3, `count=${cert}`);
    }

  } finally {
    for (const fn of cleanup) await fn();
    await prisma.$disconnect();
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length > 0) {
    failed.forEach((f) => console.log(`  ✗ ${f.name} :: ${f.detail}`));
    process.exitCode = 1;
  }
}

main().catch(async (e) => {
  console.error(e);
  process.exitCode = 1;
  await prisma.$disconnect();
});

/**
 * Removes synthetic accounts created by automated test / probe runs.
 *
 * Usage (from backend/):
 *   npx ts-node --compiler-options '{"target":"ES2022","types":["node"]}' scripts/cleanup_test_accounts.ts          # dry run
 *   npx ts-node --compiler-options '{"target":"ES2022","types":["node"]}' scripts/cleanup_test_accounts.ts --apply  # delete
 *
 * Only accounts on reserved/non-routable test domains are eligible, and the
 * admin account never is. Everything else is listed for manual review.
 *
 * SAFETY (master task §25 / §27):
 *
 * Every relation from User is `onDelete: Cascade`, so a plain `deleteMany` also
 * removes that user's Payment and CertificateRecord rows. On this database one
 * of the test-domain accounts (`demo@test.local`) owns three VERIFIED payments
 * and a VERIFIED certificate whose verification code is published on the public
 * /verify page — deleting it would have destroyed payment/certificate history
 * and silently broken a live credential URL.
 *
 * So an account that owns any Payment or CertificateRecord is NEVER deleted,
 * whatever its email domain. Those are reported separately under "KEPT —
 * financial/credential history". `--apply` additionally writes a full JSON
 * backup of everything it is about to remove before removing it.
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import prisma from '../src/lib/prisma';

const APPLY = process.argv.includes('--apply');

// Domains that cannot belong to a real learner.
const TEST_DOMAINS = ['test.dev', 'test.com', 'test.local', 'nexus.test', 'example.com', 'example.org', 'localhost'];

const isTestAccount = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return TEST_DOMAINS.includes(domain);
};

(async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, points: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const candidates = users.filter((u) => u.role !== 'ADMIN' && isTestAccount(u.email));
  const candidateIds = candidates.map((u) => u.id);

  // ── Protected: anything with money or a credential attached ──────────────
  const [payments, certRecords] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: { in: candidateIds } },
      select: { id: true, userId: true, status: true, amount: true, courseId: true, createdAt: true },
    }),
    prisma.certificateRecord.findMany({
      where: { userId: { in: candidateIds } },
      select: { id: true, userId: true, verificationCode: true, verificationStatus: true, courseId: true, createdAt: true },
    }),
  ]);

  const protectedIds = new Set<number>([...payments.map((p) => p.userId), ...certRecords.map((c) => c.userId)]);

  const doomed = candidates.filter((u) => !protectedIds.has(u.id));
  const protectedKept = candidates.filter((u) => protectedIds.has(u.id));
  const kept = users.filter((u) => u.role === 'ADMIN' || !isTestAccount(u.email));

  console.log(`Total users              : ${users.length}`);
  console.log(`Test-domain accounts     : ${candidates.length}`);
  console.log(`  → eligible to delete   : ${doomed.length}`);
  console.log(`  → PROTECTED (keep)     : ${protectedKept.length}`);
  console.log(`Real/admin accounts kept : ${kept.length}\n`);

  if (protectedKept.length > 0) {
    console.log('--- KEPT — financial/credential history (NOT deleted) ---');
    for (const u of protectedKept) {
      const p = payments.filter((x) => x.userId === u.id);
      const c = certRecords.filter((x) => x.userId === u.id);
      console.log(`  ${u.email}  (${u.name})`);
      for (const x of p) console.log(`      payment ${x.id} status=${x.status} amount=${x.amount} course=${x.courseId} ${x.createdAt.toISOString()}`);
      for (const x of c) console.log(`      cert    ${x.id} code=${x.verificationCode} status=${x.verificationStatus} course=${x.courseId}`);
    }
    console.log('  These accounts are synthetic but hold real financial/credential rows,');
    console.log('  so they are excluded from deletion by design. Review them by hand.\n');
  }

  console.log('--- WOULD DELETE ---');
  for (const u of doomed) console.log(`  ${u.email}  (${u.name}, ${u.points} pts)`);

  console.log('\n--- WOULD KEEP (real / admin) ---');
  for (const u of kept) console.log(`  ${u.email}  (${u.name}, ${u.role}, ${u.points} pts)`);

  const doomedIds = doomed.map((u) => u.id);

  // Dependent rows that the cascade will take with them — reported so the
  // deletion is never a surprise, and captured in the backup below.
  const [
    enrollments, applications, submissions, courseProgress,
    quizResults, practiceAttempts, moduleProgress, topicProgress,
    challengeProgress, discussions, forumComments,
  ] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.internshipApplication.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.assignmentSubmission.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.courseProgress.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.quizResult.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.practiceAttempt.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.moduleProgress.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.topicProgress.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.challengeProgress.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.discussion.findMany({ where: { userId: { in: doomedIds } } }),
    prisma.forumComment.findMany({ where: { userId: { in: doomedIds } } }),
  ]);

  console.log('\n--- CASCADE SIDE EFFECTS (rows removed with these accounts) ---');
  console.log(`  enrollments=${enrollments.length}  internshipApplications=${applications.length}  assignmentSubmissions=${submissions.length}`);
  console.log(`  courseProgress=${courseProgress.length}  quizResults=${quizResults.length}  practiceAttempts=${practiceAttempts.length}`);
  console.log(`  moduleProgress=${moduleProgress.length}  topicProgress=${topicProgress.length}  challengeProgress=${challengeProgress.length}`);
  console.log(`  discussions=${discussions.length}  forumComments=${forumComments.length}`);
  console.log('  payments=0  certificateRecords=0  (protected accounts are never deleted)');

  if (!APPLY) {
    console.log('\nDRY RUN — nothing deleted. Re-run with --apply to delete the accounts above.');
    await prisma.$disconnect();
    return;
  }

  // ── Backup first, so the delete is reversible ────────────────────────────
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(__dirname, '..', '..', `cleanup-test-accounts-${stamp}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        users: doomed,
        enrollments, internshipApplications: applications, assignmentSubmissions: submissions,
        courseProgress, quizResults, practiceAttempts, moduleProgress,
        topicProgress, challengeProgress, discussions, forumComments,
      },
      null,
      2,
    ),
  );
  console.log(`\nBackup written: ${backupPath}`);

  const result = await prisma.user.deleteMany({ where: { id: { in: doomedIds } } });
  console.log(`Deleted ${result.count} test accounts (no payment/certificate rows touched).`);
  await prisma.$disconnect();
})();

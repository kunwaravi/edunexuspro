import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * TASK 7 — public site statistics (counts only, no PII).
 *
 * Real numbers straight from the DB so the homepage never invents stats.
 * Public (no auth, no rate limit needed — a handful of COUNT queries).
 */
router.get('/', async (_req, res) => {
  try {
    const [students, courses, modules, topics, quizzes, certificates] = await Promise.all([
      prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.module.count(),
      prisma.topic.count(),
      prisma.quizQuestion.count(),
      prisma.certificateRecord.count(),
    ]);
    res.json({ students, courses, modules, topics, quizzes, certificates });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load statistics.' });
  }
});

export default router;

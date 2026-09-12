import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireEnrollment } from '../services/enrollmentService';
import { rateLimiter } from '../middleware/rateLimiter';
import { logger } from '../lib/logger';
import {
  getCourseChallenges,
  getChallenge,
  getChallengeCounts,
  completeChallenge
} from '../services/challengeService';
import { runChallengeTests } from '../services/challengeRunnerService';

const router = Router();

// GET /api/challenges/course/:courseId - ordered challenges grouped by module, with completion flags
// TASK 4: ACTIVE enrollment required (challenge content is course learning material).
router.get('/course/:courseId', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!(await requireEnrollment(req, res, req.params.courseId as string))) return;
    const data = await getCourseChallenges(req.params.courseId as string, req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /api/challenges/counts - per-course { total, completed } for the curriculum page
router.get('/counts', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const counts = await getChallengeCounts(req.user.id);
    res.json(counts);
  } catch (error) {
    next(error);
  }
});

// GET /api/challenges/:id - single challenge (solutionCode excluded)
// TASK 4: challenge resolved server-side → owning course → ACTIVE enrollment required.
router.get('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = await getChallenge(id);
    if (!(await requireEnrollment(req, res, data.courseId))) return;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// POST /api/challenges/:id/run-test - run the challenge's assertion tests against submitted code (issue #72)
// Rate-limited (15 runs / min / IP) to prevent sandbox abuse.
router.post('/:id/run-test', authenticateToken, rateLimiter(15, 60_000), async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { code } = req.body;
    if (typeof code !== 'string' || code.length === 0) {
      return res.status(400).json({ message: 'code is required.' });
    }

    const challenge = await getChallenge(id); // excludes solutionCode
    if (!(await requireEnrollment(req, res, challenge.courseId))) return;
    const outcome = await runChallengeTests(
      { challengeType: challenge.challengeType, seedCode: challenge.seedCode, testCode: challenge.testCode },
      code
    );

    // Auto-record completion only when ALL assertions pass (server-side grading).
    // The student's pass result is still returned even if recording fails; the
    // failure is logged instead of silently swallowed.
    if (outcome.passed) {
      await completeChallenge(req.user.id, id).catch((err) => {
        logger.error(`Failed to record challenge completion (challenge ${id}, user ${req.user.id}):`, err);
      });
    }

    res.json(outcome);
  } catch (error) {
    next(error);
  }
});

// POST /api/challenges/:id/complete - record completion for non-test-graded challenges only
router.post('/:id/complete', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const challenge = await getChallenge(id);
    if (!(await requireEnrollment(req, res, challenge.courseId))) return;

    // SECURITY (#100): server-graded challenges (non-empty assertion testCode)
    // must be completed through /run-test, which records ONLY when every test
    // passes. This endpoint used to let any student mark ANY published graded
    // challenge complete — bypassing grading while still farming XP + progress.
    if (challenge.testCode && challenge.testCode.trim().length > 0) {
      return res.status(403).json({
        message: 'This challenge is graded by automated tests. Run your code with "Run Tests" to complete it.'
      });
    }

    const result = await completeChallenge(req.user.id, id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

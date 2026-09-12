import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { requireEnrollment } from '../services/enrollmentService';
import { logger } from '../lib/logger';
import { validateBody, sanitizeLinkUrl, sanitizeFileName, ASSIGNMENT_WEEKS_PER_COURSE } from '../middleware/validate';

const router = Router();

// Middleware to verify admin privileges
const isAdmin = (req: any, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/assignments/status/:courseId - Get all submissions for course
// TASK 4: ACTIVE enrollment required.
router.get('/status/:courseId', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const userId = req.user.id;

    if (!(await requireEnrollment(req, res, courseId))) return;

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { userId, courseId },
      orderBy: { weekNumber: 'asc' }
    });

    res.json({ submissions });
  } catch (err: any) {
    logger.error('Fetch assignment status error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/assignments/submit - Submit assignment
router.post(
  '/submit',
  authenticateToken,
  validateBody(['courseId', 'weekNumber', 'fileName']),
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { courseId, weekNumber, fileName, fileUrl } = req.body;
      const userId = req.user.id;
      const weekNum = parseInt(weekNumber);

      // fileUrl is echoed back to peers in the solutions browser and linked in
      // the admin console, so an unchecked scheme (javascript:/data:) would be a
      // stored-XSS payload against those viewers.
      const safeFileUrl = fileUrl === undefined || fileUrl === null || fileUrl === ''
        ? null
        : sanitizeLinkUrl(fileUrl);
      if (fileUrl && !safeFileUrl) {
        return res.status(400).json({ message: 'Invalid file URL. Use an absolute http(s) link or an /uploads path.' });
      }
      const safeFileName = sanitizeFileName(fileName) || 'submission';
      if (String(fileName).length > 200) {
        return res.status(400).json({ message: 'File name is too long.' });
      }

      // TASK 4: ACTIVE enrollment required to submit course assignments.
      if (!(await requireEnrollment(req, res, courseId))) return;

      // Verify that student has passed modules up to that week. The mapping is
      // derived from the course's real module count so it stays 5/10/15/20 on the
      // 20-module tracks, while the 5-module tracks resolve to 2/3/4/5 instead of
      // demanding modules 10/15/20 that do not exist ("Invalid week number").
      const totalModules = await prisma.module.count({ where: { courseId } });
      const requiredModules = totalModules > 0 ? totalModules : 20;
      const reqModuleOrder = Math.ceil((weekNum / ASSIGNMENT_WEEKS_PER_COURSE) * requiredModules);
      const moduleRecord = await prisma.module.findFirst({
        where: { courseId, week: reqModuleOrder }
      });

      if (!moduleRecord && req.user.role !== 'ADMIN') {
        return res.status(400).json({ message: `Invalid week number: Module ${reqModuleOrder} does not exist.` });
      }

      if (moduleRecord && req.user.role !== 'ADMIN') {
        const moduleProgress = await prisma.moduleProgress.findUnique({
          where: { userId_moduleId: { userId, moduleId: moduleRecord.id } }
        });
        if (!moduleProgress || !moduleProgress.quizPassed) {
          return res.status(403).json({ 
            message: `Locked Assignment: You must complete Module ${reqModuleOrder} and pass its quiz before submitting Week ${weekNum} Assignment.` 
          });
        }
      }

      const submission = await prisma.assignmentSubmission.upsert({
        where: {
          userId_courseId_weekNumber: {
            userId,
            courseId,
            weekNumber: weekNum
          }
        },
        update: {
          fileName,
          fileUrl: safeFileUrl || `/uploads/mock_${safeFileName}`,
          status: 'PENDING',
          feedback: null
        },
        create: {
          userId,
          courseId,
          weekNumber: weekNum,
          fileName,
          fileUrl: safeFileUrl || `/uploads/mock_${safeFileName}`,
          status: 'PENDING'
        }
      });

      logger.info(`Student ${userId} submitted Week ${weekNum} assignment for course ${courseId}`);
      res.json({ success: true, submission });
    } catch (err: any) {
      logger.error('Submit assignment error:', err);
      next(err);
    }
  }
);

// ADMIN - GET /api/assignments/admin/pending - Get all pending assignments
router.get('/admin/pending', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const pending = await prisma.assignmentSubmission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ pending });
  } catch (err: any) {
    logger.error('Fetch pending assignments error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - GET /api/assignments/admin/all - Full submission queue (review stats + history, issue #82)
router.get('/admin/all', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const submissions = await prisma.assignmentSubmission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ submissions });
  } catch (err: any) {
    logger.error('Fetch all assignments error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - PUT /api/assignments/admin/evaluate/:id - Approve or reject assignment
router.put(
  '/admin/evaluate/:id',
  authenticateToken,
  isAdmin,
  validateBody(['status']),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params as any;
      const idNum = parseInt(id);
      const { status, feedback } = req.body;

      if (status !== 'APPROVED' && status !== 'REJECTED') {
        return res.status(400).json({ message: 'Status must be APPROVED or REJECTED.' });
      }

      const submission = await prisma.assignmentSubmission.findUnique({
        where: { id: idNum }
      });

      if (!submission) {
        return res.status(404).json({ message: 'Assignment submission not found.' });
      }

      const updated = await prisma.assignmentSubmission.update({
        where: { id: idNum },
        data: {
          status,
          feedback: feedback || null
        }
      });

      // Award 20 XP on approval
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: submission.userId },
          data: { points: { increment: 20 } }
        });
      }

      logger.info(`Admin evaluated assignment ${idNum} as ${status}`);
      res.json({ success: true, submission: updated });
    } catch (err: any) {
      logger.error('Evaluate assignment error:', err);
      next(err);
    }
  }
);

// GET /api/assignments/:courseId/solutions?weekNumber=N - Peer solutions browser (issue #75)
// Only learners with an APPROVED submission for that week can view peers; only APPROVED + shareSolution
// submissions are shown; no PII (email, phone) is ever exposed.
router.get('/:courseId/solutions', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const weekNumber = parseInt(req.query.weekNumber as string);
    const userId = req.user.id;

    if (isNaN(weekNumber)) {
      return res.status(400).json({ message: 'Valid weekNumber query param is required.' });
    }

    // TASK 4: ACTIVE enrollment required to browse peer solutions.
    if (!(await requireEnrollment(req, res, courseId))) return;

    // Gate: viewer must have this week approved before browsing peers (freeCodeCamp-style)
    const mySubmission = await prisma.assignmentSubmission.findUnique({
      where: { userId_courseId_weekNumber: { userId, courseId, weekNumber } }
    });
    if (!mySubmission || mySubmission.status !== 'APPROVED') {
      return res.status(403).json({
        message: 'Complete this week and get it approved to view peer solutions.'
      });
    }

    const solutions = await prisma.assignmentSubmission.findMany({
      where: {
        courseId,
        weekNumber,
        status: 'APPROVED',
        shareSolution: true,
        userId: { not: userId }
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        submittedAt: true,
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ solutions });
  } catch (err: any) {
    logger.error('Fetch peer solutions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/assignments/:id/privacy - toggle own solution sharing (issue #75)
router.patch(
  '/:id/privacy',
  authenticateToken,
  validateBody(['shareSolution']),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = parseInt(req.params.id as string);
      const { shareSolution } = req.body as any;

      const submission = await prisma.assignmentSubmission.findUnique({ where: { id } });
      if (!submission) return res.status(404).json({ message: 'Submission not found.' });

      // TASK 4: premium operation on a course's learning record — enrollment required.
      if (!(await requireEnrollment(req, res, submission.courseId))) return;

      const isOwner = (req as any).user.id === submission.userId;
      const isAdminUser = (req as any).user.role === 'ADMIN';
      if (!isOwner && !isAdminUser) {
        return res.status(403).json({ message: 'You can only update your own submission.' });
      }

      const updated = await prisma.assignmentSubmission.update({
        where: { id },
        data: { shareSolution: !!shareSolution }
      });

      logger.info(`User ${(req as any).user.id} set assignment ${id} shareSolution=${updated.shareSolution}`);
      res.json({ success: true, shareSolution: updated.shareSolution });
    } catch (err: any) {
      logger.error('Update assignment privacy error:', err);
      next(err);
    }
  }
);

export default router;

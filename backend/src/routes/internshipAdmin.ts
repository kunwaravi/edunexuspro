import { Router, Request, Response, NextFunction } from 'express';
import * as internshipService from '../services/internshipService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { validate, internshipListQuerySchema, internshipStatusSchema, internshipRespondSchema } from '../middleware/validation';

const router = Router();

// Every route below is admin-only: authenticateToken establishes who the caller
// is, isAdmin rejects anyone whose role is not ADMIN. Mounted at
// /api/internship/admin, so the guard is applied per-route rather than with a
// router-level use() — accidental reordering must not be able to expose one.
router.use(authenticateToken, isAdmin);

/** Parse a path id, or null when it is not a positive integer. */
const parseId = (raw: string): number | null => {
  const id = parseInt(raw, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// GET /api/internship/admin/applications?status= - All applications, optional status filter
router.get('/applications', validate(internshipListQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const applications = await internshipService.listApplications(status);
    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// GET /api/internship/admin/stats - Real counts by status (for the pending-actions widget)
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await internshipService.getApplicationStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/internship/admin/applications/:id - Single application
router.get('/applications/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id as string);

    if (id === null) {
      return res.status(400).json({ message: 'Invalid application ID.' });
    }

    const application = await internshipService.getApplicationById(id);
    res.json(application);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/internship/admin/applications/:id/status - Move an application through the workflow
router.patch('/applications/:id/status', validate(internshipStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id as string);

    if (id === null) {
      return res.status(400).json({ message: 'Invalid application ID.' });
    }

    const { status, adminResponse } = req.body;
    const application = await internshipService.updateApplicationStatus(id, status, adminResponse);

    res.json({ success: true, message: `Application status updated to ${status}.`, data: application });
  } catch (error) {
    next(error);
  }
});

// POST /api/internship/admin/applications/:id/respond - Save a response and email it.
// The response is stored whether or not the email goes out; `email` in the
// response body reports what actually happened to the notification.
router.post('/applications/:id/respond', validate(internshipRespondSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id as string);

    if (id === null) {
      return res.status(400).json({ message: 'Invalid application ID.' });
    }

    const { adminResponse } = req.body;
    const result = await internshipService.respondToApplication(id, req.user.id, adminResponse);

    res.json({
      success: true,
      message: result.email.sent
        ? 'Response saved and emailed to the applicant.'
        : 'Response saved. The notification email was not sent.',
      email: result.email,
      data: result.application
    });
  } catch (error) {
    next(error);
  }
});

export default router;

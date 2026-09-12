import { Router, Request, Response, NextFunction } from 'express';
import * as internshipService from '../services/internshipService';
import { authenticateToken } from '../middleware/auth';
import { validate, internshipApplySchema } from '../middleware/validation';

const router = Router();

// GET /api/internship/programs - Open internship programs (Public).
// Application counts are intentionally NOT exposed here.
router.get('/programs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const programs = await internshipService.getOpenPrograms();
    res.json(programs);
  } catch (error) {
    next(error);
  }
});

// GET /api/internship/programs/:slug - Program detail (Public)
router.get('/programs/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const program = await internshipService.getProgramBySlug(slug as string);

    if (!program) {
      return res.status(404).json({ message: `Internship program ${slug} not found.` });
    }

    res.json(program);
  } catch (error) {
    next(error);
  }
});

// POST /api/internship/apply - Submit an application (Authenticated)
router.post('/apply', authenticateToken, validate(internshipApplySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // SECURITY: identity comes from the verified token only. A userId in the
    // body is ignored outright, so an application can never be filed for someone
    // else.
    const userId = req.user.id;
    const { programId, fullName, email, phone, qualification, skills, introduction, portfolioUrl, message } = req.body;

    const application = await internshipService.createApplication(userId, {
      programId,
      fullName,
      email,
      phone,
      qualification,
      skills,
      introduction,
      portfolioUrl,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/internship/my-applications - The caller's OWN applications (Authenticated).
// Scoped to the token's user id — there is no parameter that can widen this.
router.get('/my-applications', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applications = await internshipService.getApplicationsForUser(req.user.id);
    res.json(applications);
  } catch (error) {
    next(error);
  }
});

export default router;

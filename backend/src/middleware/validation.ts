import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './errorHandler';
import { APPLICATION_STATUSES } from '../services/internshipService';

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(message, 400));
      }
      return next(error);
    }
  };
};

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().min(2),
    fatherName: z.string().min(2),
    collegeName: z.string().min(2),
    branchName: z.string().min(2),
    phone: z.string().min(10).max(15).optional(),
    referredBy: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});

export const courseEnrollSchema = z.object({
  body: z.object({
    courseId: z.string(),
  }),
});

// Public, unauthenticated endpoint: bound every field so a submitter cannot
// store megabyte payloads or junk addresses in the admin inbox.
export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200),
    subject: z.string().max(200).optional(),
    message: z.string().min(1).max(5000),
  }),
});

export const quizSubmissionSchema = z.object({
  body: z.object({
    // userId kept optional for backward-compat with old clients, but the server
    // now derives the identity from the JWT (issue #64) and ignores this field.
    userId: z.number().or(z.string()).optional(),
    courseId: z.string(),
    week: z.number().or(z.string()),
    topicId: z.number().or(z.string()).optional(),
    answers: z.record(z.string(), z.string().or(z.number())),
  }),
});

export const createCourseSchema = z.object({
  body: z.object({
    id: z.string(),
    title: z.string().min(2),
    description: z.string(),
    price: z.number().optional(),
    banner: z.string().optional().nullable(),
    thumbnail: z.string().optional().nullable(),
    comingSoon: z.boolean().optional(),
  }),
});

export const createModuleSchema = z.object({
  body: z.object({
    week: z.number().or(z.string()),
    title: z.string().min(2),
    description: z.string(),
  }),
});

export const createTopicSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    text: z.string(),
    code: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    order: z.number().or(z.string()).optional(),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    courseId: z.string(),
    amount: z.number().or(z.string()),
    couponCode: z.string().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    gatewayReference: z.string().optional(),
  }),
});

// --- Internship applications -------------------------------------------------
// Optional fields are the ones a form leaves blank: an empty string is accepted
// and stored as NULL rather than rejected, so a blank text input is not an error.

/** Accepts "", null, or a plausible phone number; anything else fails. */
const blankablePhone = z
  .string()
  .trim()
  .refine((v) => v === '' || (v.length >= 10 && v.length <= 15), {
    message: 'Phone must be 10 to 15 characters',
  })
  .optional()
  .nullable();

/** Accepts "", null, or an http(s) URL. */
const blankableUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), {
    message: 'Must be a valid http(s) URL',
  })
  .optional()
  .nullable();

export const internshipApplySchema = z.object({
  body: z.object({
    // Coerced rather than the `z.number().or(z.string())` used elsewhere: an id
    // that reaches Prisma must be a real integer, and the looser form lets
    // "abc" through only for parseInt to turn it into NaN.
    programId: z.coerce.number().int().positive('A valid program id is required'),
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().email(),
    phone: blankablePhone,
    qualification: z.string().trim().min(2, 'Qualification is required'),
    skills: z.string().trim().min(2, 'Skills are required'),
    introduction: z.string().trim().min(20, 'Introduction must be at least 20 characters'),
    portfolioUrl: blankableUrl,
    message: z.string().trim().max(2000).optional().nullable(),
    // userId is deliberately absent: identity comes from the verified JWT.
  }),
});

export const internshipListQuerySchema = z.object({
  query: z.object({
    status: z.enum(APPLICATION_STATUSES).optional(),
  }),
});

export const internshipStatusSchema = z.object({
  body: z.object({
    status: z.enum(APPLICATION_STATUSES),
    adminResponse: z.string().trim().max(5000).optional().nullable(),
  }),
});

export const internshipRespondSchema = z.object({
  body: z.object({
    adminResponse: z.string().trim().min(1, 'A response message is required').max(5000),
  }),
});

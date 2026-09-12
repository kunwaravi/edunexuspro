import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { AppError, notFoundTo404 } from '../middleware/errorHandler';
import { sendInternshipResponseEmail } from './emailService';

/**
 * Application workflow states. Strings (not a Prisma enum), matching the
 * project convention for role/status fields (issue #77).
 */
export const APPLICATION_STATUSES = [
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'NEED_MORE_INFO'
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const isApplicationStatus = (value: unknown): value is ApplicationStatus =>
  typeof value === 'string' && (APPLICATION_STATUSES as readonly string[]).includes(value);

/**
 * Statuses that mean "this application is still live". A student may not open a
 * second application for the same program while one of these is in flight;
 * REJECTED and NEED_MORE_INFO applications are closed, so a fresh one is allowed.
 */
const ACTIVE_STATUSES: ApplicationStatus[] = ['PENDING', 'UNDER_REVIEW', 'APPROVED'];

/** Public program fields — deliberately excludes application counts. */
const PROGRAM_FIELDS = {
  id: true,
  slug: true,
  title: true,
  description: true,
  categorySlug: true,
  duration: true,
  mode: true,
  isOpen: true
} as const;

const PROGRAM_SUMMARY_FIELDS = {
  id: true,
  slug: true,
  title: true,
  duration: true,
  mode: true
} as const;

/** Open programs for the public listing. Applied-to counts are never exposed. */
export const getOpenPrograms = async () => {
  return await prisma.internshipProgram.findMany({
    where: { isOpen: true },
    select: PROGRAM_FIELDS,
    orderBy: [{ createdAt: 'asc' }]
  });
};

/**
 * Public program detail. A closed program is still returned (isOpen tells the
 * UI to disable the apply CTA) so a bookmarked or in-flight application keeps a
 * page to land on — `apply` is where closure is actually enforced.
 */
export const getProgramBySlug = async (slug: string) => {
  return await prisma.internshipProgram.findFirst({
    where: { slug },
    select: PROGRAM_FIELDS
  });
};

/** Human-readable reference, e.g. INT-2026-0001. */
const APPLICATION_CODE_PREFIX = 'INT';

const generateApplicationCode = async (): Promise<string> => {
  const prefix = `${APPLICATION_CODE_PREFIX}-${new Date().getFullYear()}-`;
  // Highest sequence so far this year, ordered by id rather than by code so the
  // sequence keeps counting past INT-…-9999, where lexical code order breaks.
  const latest = await prisma.internshipApplication.findFirst({
    where: { applicationCode: { startsWith: prefix } },
    orderBy: { id: 'desc' },
    select: { applicationCode: true }
  });

  const next = latest ? parseInt(latest.applicationCode.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
};

export interface ApplicationInput {
  programId: number;
  fullName: string;
  email: string;
  phone?: string | null;
  qualification: string;
  skills: string;
  introduction: string;
  portfolioUrl?: string | null;
  message?: string | null;
}

/**
 * Create an application for the authenticated user.
 *
 * `userId` is passed in from the verified JWT — never from the request body.
 */
export const createApplication = async (userId: number, data: ApplicationInput) => {
  const program = await prisma.internshipProgram.findUnique({
    where: { id: data.programId },
    select: { id: true, isOpen: true }
  });

  if (!program) {
    throw new AppError(`Internship program ${data.programId} not found`, 404);
  }

  if (!program.isOpen) {
    throw new AppError('Applications for this internship program are currently closed.', 409);
  }

  // NOTE: this check is not atomic with the insert below — two simultaneous
  // submissions could both pass it. A partial unique index on
  // (userId, programId) WHERE status IN (…) would close that window, but it is
  // not expressible in the Prisma schema and would drift from `db push`, so the
  // guard stays here and the duplicate risk is accepted as low-impact.
  const existing = await prisma.internshipApplication.findFirst({
    where: { userId, programId: data.programId, status: { in: ACTIVE_STATUSES } },
    select: { applicationCode: true, status: true }
  });

  if (existing) {
    throw new AppError(
      `You already have an active application (${existing.applicationCode}) for this program. ` +
        `Its status is ${existing.status}.`,
      409
    );
  }

  const applicationData = {
    userId,
    programId: data.programId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone ?? null,
    qualification: data.qualification,
    skills: data.skills,
    introduction: data.introduction,
    portfolioUrl: data.portfolioUrl ?? null,
    message: data.message ?? null
  };

  // Retry on the (rare) race where a concurrent insert took the same code.
  for (let attempt = 0; attempt < 5; attempt++) {
    const applicationCode = await generateApplicationCode();
    try {
      return await prisma.internshipApplication.create({
        data: { ...applicationData, applicationCode },
        include: { program: { select: PROGRAM_SUMMARY_FIELDS } }
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') continue;
      throw err;
    }
  }

  throw new AppError('Could not allocate an application reference. Please try again.', 503);
};

/**
 * The caller's OWN applications — scoped by the JWT userId. This is a security
 * boundary: `userId` is never taken from the request, so no filter the client
 * can send will widen the result set.
 */
export const getApplicationsForUser = async (userId: number) => {
  return await prisma.internshipApplication.findMany({
    where: { userId },
    include: { program: { select: PROGRAM_SUMMARY_FIELDS } },
    orderBy: { createdAt: 'desc' }
  });
};

/** Admin: every application, optionally filtered by status. */
export const listApplications = async (status?: string) => {
  if (status !== undefined && !isApplicationStatus(status)) {
    throw new AppError(
      `Invalid status filter. Expected one of: ${APPLICATION_STATUSES.join(', ')}.`,
      400
    );
  }

  return await prisma.internshipApplication.findMany({
    where: status ? { status } : {},
    include: {
      program: { select: PROGRAM_SUMMARY_FIELDS },
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getApplicationById = async (id: number) => {
  const application = await prisma.internshipApplication.findUnique({
    where: { id },
    include: {
      program: { select: PROGRAM_FIELDS },
      user: { select: { id: true, name: true, email: true } }
    }
  });

  if (!application) {
    throw new AppError(`Internship application ${id} not found`, 404);
  }

  return application;
};

/**
 * Move an application through the workflow. `adminResponse` is optional here —
 * a status change alone is a valid admin action, and the response/email flow
 * lives in `respondToApplication`.
 */
export const updateApplicationStatus = async (
  id: number,
  status: string,
  adminResponse?: string | null
) => {
  if (!isApplicationStatus(status)) {
    throw new AppError(
      `Invalid status. Expected one of: ${APPLICATION_STATUSES.join(', ')}.`,
      400
    );
  }

  return await notFoundTo404(
    prisma.internshipApplication.update({
      where: { id },
      data: {
        status,
        ...(adminResponse !== undefined ? { adminResponse } : {})
      },
      include: { program: { select: PROGRAM_SUMMARY_FIELDS } }
    }),
    `Internship application ${id} not found`
  );
};

export interface RespondResult {
  application: Awaited<ReturnType<typeof updateApplicationStatus>>;
  email: { sent: boolean; reason?: string };
}

/**
 * Record an admin response and attempt to email it.
 *
 * The response is written to the DB FIRST, so the decision survives even if the
 * mail attempt fails; `responseEmailStatus` then records what actually happened.
 * Status and delivery state stay separate fields — a FAILED email never rolls
 * back or masks the status.
 */
export const respondToApplication = async (
  id: number,
  adminUserId: number,
  adminResponse: string
): Promise<RespondResult> => {
  const application = await prisma.internshipApplication.findUnique({
    where: { id },
    include: { program: { select: { title: true } } }
  });

  if (!application) {
    throw new AppError(`Internship application ${id} not found`, 404);
  }

  // 1. Save the admin's response. "NOT_SENT" is the honest starting state.
  await notFoundTo404(
    prisma.internshipApplication.update({
      where: { id },
      data: {
        adminResponse,
        respondedAt: new Date(),
        respondedBy: adminUserId,
        responseEmailStatus: 'NOT_SENT'
      },
      include: { program: { select: PROGRAM_SUMMARY_FIELDS } }
    }),
    `Internship application ${id} not found`
  );

  // 2. Attempt delivery. sendMail never throws — it reports.
  const result = await sendInternshipResponseEmail(application.email, {
    studentName: application.fullName,
    programTitle: application.program.title,
    status: application.status,
    adminResponse
  });

  // 3. Record the delivery outcome exactly as it happened. A deployment with no
  //    SMTP configured is NOT_SENT (nothing was attempted), not FAILED — only a
  //    real transport error is a failure.
  const responseEmailStatus = result.sent
    ? 'SENT'
    : result.reason === 'NOT_CONFIGURED'
      ? 'NOT_SENT'
      : 'FAILED';

  const withEmailStatus = await notFoundTo404(
    prisma.internshipApplication.update({
      where: { id },
      data: { responseEmailStatus },
      include: { program: { select: PROGRAM_SUMMARY_FIELDS } }
    }),
    `Internship application ${id} not found`
  );

  return {
    application: withEmailStatus,
    email: result.sent ? { sent: true } : { sent: false, reason: result.reason }
  };
};

/** Admin dashboard counts — real DB values, zeros when a status has none. */
export const getApplicationStats = async () => {
  const grouped = await prisma.internshipApplication.groupBy({
    by: ['status'],
    _count: { _all: true }
  });

  const byStatus: Record<ApplicationStatus, number> = {
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
    NEED_MORE_INFO: 0
  };

  let total = 0;
  for (const row of grouped) {
    total += row._count._all;
    if (isApplicationStatus(row.status)) {
      byStatus[row.status] = row._count._all;
    }
  }

  return { total, byStatus, openPrograms: await prisma.internshipProgram.count({ where: { isOpen: true } }) };
};

export const INTERNSHIP_STATUSES = ['APPLIED', 'SELECTED', 'ACTIVE', 'COMPLETED'] as const;
export type InternshipStatus = (typeof INTERNSHIP_STATUSES)[number];

// Filter values for ?certificate= (admin list)
export const CERT_FILTERS = {
  ISSUED: 'ISSUED',      // has a CertificateRecord
  PENDING: 'PENDING',    // has a CertificateRecord that is not VERIFIED
  NONE: 'NONE',          // no CertificateRecord yet
} as const;

// Display fields that, once a certificate is issued, must not silently change.
const SENSITIVE_AFTER_ISSUE = [
  'programTitle', 'domain', 'role', 'startDate', 'endDate', 'duration',
  'performanceGrade', 'projectTitle',
] as const;

interface InternshipCreateData {
  programTitle: string;
  domain: string;
  role: string;
  startDate?: string | null;
  endDate?: string | null;
  duration?: string | null;
  institution?: string | null;
  branch?: string | null;
  session?: string | null;
  mentorName?: string | null;
  projectTitle?: string | null;
  performanceGrade?: string | null;
  completionNotes?: string | null;
  remarks?: string | null;
  status?: InternshipStatus;
}

export class InternshipService {
  static async list(opts: {
    search?: string;
    domain?: string;
    status?: string;
    certificate?: string;
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 20));
    const sort: 'asc' | 'desc' = opts.sort === 'asc' ? 'asc' : 'desc';

    const where: Record<string, unknown> = {};
    if (opts.domain) where.domain = opts.domain;
    if (opts.status) where.status = opts.status;

    if (opts.search) {
      where.OR = [
        { user: { name: { contains: opts.search, mode: 'insensitive' } } },
        { user: { email: { contains: opts.search, mode: 'insensitive' } } },
        { programTitle: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const certificate = opts.certificate;
    if (certificate) {
      // Certificate predicate lives in the SQL `where` (not a JS post-filter) so
      // pagination and `total` stay correct when ?certificate= is used.
      if (certificate === CERT_FILTERS.ISSUED) {
        where.certificate = { isNot: null };
      } else if (certificate === CERT_FILTERS.NONE) {
        where.certificate = { is: null };
      } else if (certificate === CERT_FILTERS.PENDING) {
        where.certificate = { is: { verificationStatus: { not: 'VERIFIED' } } };
      }
      // Any other value is treated as no filter (unknown values are ignored).
    }

    // Admin console summary cards (Task 9 / #102). Global counts across all
    // internships — deliberately NOT scoped to the active filters so the cards
    // describe the whole pipeline while `total` stays the filtered row count.
    const [internships, total, statsTotal, statsActive, statsCompleted, statsIssued, statsPending] =
      await Promise.all([
        prisma.internship.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, email: true } },
            certificate: { select: { id: true, verificationCode: true, verificationStatus: true, createdAt: true } },
          },
          orderBy: { createdAt: sort },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.internship.count({ where }),
        prisma.internship.count(),
        prisma.internship.count({ where: { status: 'ACTIVE' } }),
        prisma.internship.count({ where: { status: 'COMPLETED' } }),
        prisma.internship.count({ where: { certificate: { isNot: null } } }),
        prisma.internship.count({ where: { certificate: { is: { verificationStatus: { not: 'VERIFIED' } } } } }),
      ]);

    return {
      internships,
      total,
      page,
      limit,
      stats: {
        total: statsTotal,
        active: statsActive,
        completed: statsCompleted,
        issued: statsIssued,
        pending: statsPending,
      },
    };
  }

  static async getById(id: string) {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, fatherName: true, collegeName: true, branchName: true } },
        certificate: true,
      },
    });
    if (!internship) throw new AppError('Internship record not found.', 404);
    return internship;
  }

  static async listMine(userId: number) {
    return prisma.internship.findMany({
      where: { userId },
      include: { certificate: { select: { verificationCode: true, verificationStatus: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(data: InternshipCreateData, resolve: { userId?: number; email?: string }) {
    let userId = resolve.userId;
    if (!userId && resolve.email) {
      const user = await prisma.user.findUnique({ where: { email: resolve.email } });
      if (!user) throw new AppError('No registered user matches that email.', 404);
      userId = user.id;
    }
    if (!userId) throw new AppError('userId or email is required.', 400);

    // Spec: duplicate guard on (userId, programTitle, startDate, endDate) — a candidate may
    // re-sit the same program/domain in a later session, so dates disambiguate. Null date
    // fields match null-date rows (an explicit admin edge case can be created by tweaking a date).
    const dup = await prisma.internship.findFirst({
      where: {
        userId,
        programTitle: data.programTitle,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    if (dup) {
      throw new AppError('Duplicate internship record: this candidate already has the same program in the same period.', 409);
    }

    return prisma.internship.create({
      data: {
        userId,
        programTitle: data.programTitle,
        domain: data.domain,
        role: data.role,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        duration: data.duration ?? null,
        institution: data.institution ?? null,
        branch: data.branch ?? null,
        session: data.session ?? null,
        mentorName: data.mentorName ?? null,
        projectTitle: data.projectTitle ?? null,
        performanceGrade: data.performanceGrade ?? null,
        completionNotes: data.completionNotes ?? null,
        remarks: data.remarks ?? null,
        status: data.status ?? 'APPLIED',
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  static async update(id: string, data: Partial<InternshipCreateData>, opts: { confirm?: boolean } = {}) {
    const existing = await this.getById(id);
    const certIssued = Boolean(existing.certificate);

    if (certIssued && !opts.confirm) {
      const touchesSensitive = SENSITIVE_AFTER_ISSUE.some(
        (k) => data[k as keyof InternshipCreateData] !== undefined
      );
      if (touchesSensitive) {
        throw new AppError(
          'A certificate is already issued for this internship. Changing display fields requires confirmation.',
          409
        );
      }
    }

    const { userId: _ignore, email: _ignore2, ...safe } = data as any;
    return prisma.internship.update({
      where: { id },
      data: {
        ...(safe.programTitle !== undefined && { programTitle: safe.programTitle }),
        ...(safe.domain !== undefined && { domain: safe.domain }),
        ...(safe.role !== undefined && { role: safe.role }),
        ...(safe.startDate !== undefined && { startDate: safe.startDate ? new Date(safe.startDate) : null }),
        ...(safe.endDate !== undefined && { endDate: safe.endDate ? new Date(safe.endDate) : null }),
        ...(safe.duration !== undefined && { duration: safe.duration ?? null }),
        ...(safe.institution !== undefined && { institution: safe.institution ?? null }),
        ...(safe.branch !== undefined && { branch: safe.branch ?? null }),
        ...(safe.session !== undefined && { session: safe.session ?? null }),
        ...(safe.mentorName !== undefined && { mentorName: safe.mentorName ?? null }),
        ...(safe.projectTitle !== undefined && { projectTitle: safe.projectTitle ?? null }),
        ...(safe.performanceGrade !== undefined && { performanceGrade: safe.performanceGrade ?? null }),
        ...(safe.completionNotes !== undefined && { completionNotes: safe.completionNotes ?? null }),
        ...(safe.remarks !== undefined && { remarks: safe.remarks ?? null }),
        ...(safe.status !== undefined && { status: safe.status }),
        ...(safe.certificateEligible !== undefined && { certificateEligible: safe.certificateEligible }),
      },
      include: { user: { select: { id: true, name: true, email: true } }, certificate: true },
    });
  }

  static async remove(id: string) {
    const existing = await this.getById(id);
    if (existing.certificate) {
      throw new AppError('A certificate is issued for this internship. Delete/void it first.', 400);
    }
    await prisma.internship.delete({ where: { id } });
  }

  static async complete(id: string) {
    const existing = await this.getById(id);
    if (existing.status === 'COMPLETED') return existing; // idempotent
    return prisma.internship.update({
      where: { id },
      data: { status: 'COMPLETED', certificateEligible: true },
      include: { user: { select: { id: true, name: true, email: true } }, certificate: true },
    });
  }
}

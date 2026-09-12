/**
 * Internship API contracts — mirrors the shapes returned by
 * `../backend/src/routes/internship.ts` and `internshipAdmin.ts`.
 *
 * Only `PUBLIC_PROGRAM_FIELDS`-style shapes are declared here: application
 * counts are deliberately absent from the public program payload, so there is
 * no field for a component to accidentally render a number that the API never
 * sent. `status` / `responseEmailStatus` stay `string` on purpose — the API
 * records them as plain strings (issue #77), and a value the UI does not
 * recognise must still render (StatusBadge shows it verbatim) rather than be
 * silently coerced into a wrong badge.
 */

/** The five workflow states the API accepts and returns. */
export const APPLICATION_STATUSES = [
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'NEED_MORE_INFO',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Human labels for the status filter and status action buttons. */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  NEED_MORE_INFO: 'More Info Needed',
};

/** Delivery state of the admin response email (separate from `status`). */
export type ResponseEmailStatus = 'NOT_SENT' | 'SENT' | 'FAILED';

/** `GET /internship/programs` and `GET /internship/programs/:slug`. */
export interface InternshipProgram {
  id: number;
  slug: string;
  title: string;
  description: string;
  categorySlug: string | null;
  duration: string;
  mode: string;
  /** False means the program is closed — apply is rejected server-side. */
  isOpen: boolean;
}

/**
 * `program` as embedded on an application. The list endpoints select a summary
 * (id/slug/title/duration/mode); the admin detail endpoint selects the full
 * public field set, hence the optional category/description fields.
 */
export interface InternshipProgramSummary {
  id: number;
  slug: string;
  title: string;
  duration: string;
  mode: string;
  categorySlug?: string | null;
  description?: string;
  isOpen?: boolean;
}

/** An application as returned to the student who owns it. */
export interface InternshipApplication {
  id: number;
  /** Human-readable reference, e.g. "INT-2026-0001". */
  applicationCode: string;
  userId: number;
  programId: number;
  fullName: string;
  email: string;
  phone: string | null;
  qualification: string;
  skills: string;
  introduction: string;
  portfolioUrl: string | null;
  message: string | null;
  status: string;
  adminResponse: string | null;
  responseEmailStatus: string;
  respondedAt: string | null;
  respondedBy: number | null;
  createdAt: string;
  updatedAt: string;
  program: InternshipProgramSummary;
}

/** Admin list rows additionally carry the applicant's account. */
export interface AdminInternshipApplication extends InternshipApplication {
  user: { id: number; name: string; email: string };
}

/** `GET /internship/admin/stats` — real DB counts, zeros included. */
export interface InternshipStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  openPrograms: number;
}

/** Body of `POST /internship/apply`. Identity comes from the JWT, never here. */
export interface InternshipApplyPayload {
  programId: number;
  fullName: string;
  email: string;
  phone?: string;
  qualification: string;
  skills: string;
  introduction: string;
  portfolioUrl?: string;
  message?: string;
}

/** Success body of `POST /internship/apply`. */
export interface InternshipApplyResponse {
  success: boolean;
  message: string;
  data: InternshipApplication;
}

/**
 * Body of `POST /internship/admin/applications/:id/respond`.
 *
 * `email.sent` reports what actually happened to the notification; the response
 * itself is stored either way, so the two must be surfaced separately.
 */
export interface InternshipRespondResponse {
  success: boolean;
  message: string;
  email: { sent: boolean; reason?: string };
  data: InternshipApplication;
}

/** Success body of `PATCH /internship/admin/applications/:id/status`. */
export interface InternshipStatusResponse {
  success: boolean;
  message: string;
  data: InternshipApplication;
}

/**
 * Turn a category slug ("web-development") into a label ("Web Development").
 * Category NAMES are owned by the course-catalog taxonomy and are not included
 * in the internship program payload, so the slug is the only honest source; an
 * absent slug yields null and the caller renders nothing.
 */
export const humanizeCategory = (slug?: string | null): string | null => {
  if (!slug) return null;
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/** Locale-stable date rendering for tables; falls back to the raw value. */
export const formatInternshipDate = (value?: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/** Date + time, for "last updated" columns where the time matters. */
export const formatInternshipDateTime = (value?: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

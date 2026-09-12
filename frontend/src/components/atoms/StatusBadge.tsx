import React from 'react';
import Badge from './Badge';

/**
 * Canonical presentation for the status strings the API actually returns.
 *
 * One map, used everywhere (Dashboard, Admin tables, Internship, Payments,
 * Certificates) so the same status can never render green in one screen and
 * amber in another. Unknown values fall back to `neutral` and are shown
 * verbatim — never hidden, since an unrecognised status is information.
 */
export type KnownStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEED_MORE_INFO'
  | 'VERIFIED'
  | 'FAILED'
  | 'NOT_SENT'
  | 'SENT'
  | 'ACTIVE'
  | 'COMPLETED';

const STATUS_MAP: Record<KnownStatus, { variant: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error'; label: string }> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  UNDER_REVIEW: { variant: 'primary', label: 'Under Review' },
  APPROVED: { variant: 'success', label: 'Approved' },
  REJECTED: { variant: 'error', label: 'Rejected' },
  NEED_MORE_INFO: { variant: 'accent', label: 'More Info Needed' },
  VERIFIED: { variant: 'success', label: 'Verified' },
  FAILED: { variant: 'error', label: 'Failed' },
  NOT_SENT: { variant: 'neutral', label: 'Not Sent' },
  SENT: { variant: 'success', label: 'Sent' },
  ACTIVE: { variant: 'success', label: 'Active' },
  COMPLETED: { variant: 'secondary', label: 'Completed' },
};

const humanize = (raw: string) =>
  raw
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const known = STATUS_MAP[status as KnownStatus];
  return (
    <Badge
      variant={known ? known.variant : 'neutral'}
      size="sm"
      className={className}
    >
      {known ? known.label : humanize(status)}
    </Badge>
  );
};

export default StatusBadge;

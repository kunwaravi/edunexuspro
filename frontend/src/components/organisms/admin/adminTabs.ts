import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  BookOpen,
  ClipboardCheck,
  DollarSign,
  FileCode2,
  Mail,
  Settings,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react';

/**
 * M-049: the admin dashboard tab identities.
 *
 * These ids are the contract with `TAB_SOURCES` in AdminDashboard — a tab id
 * with no source entry silently never receives data, so this list and that map
 * must stay in step. Relocated here (values unchanged) so the tab bar can live
 * in its own component without either file owning the other.
 */
export type AdminTab =
  | 'transactions'
  | 'cms'
  | 'users'
  | 'analytics'
  | 'referrals'
  | 'messages'
  | 'settings'
  | 'review'
  | 'internships'
  | 'internshipRecords';

export interface AdminTabDef {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}

export interface AdminTabGroup {
  label: string;
  /** Plain-language summary of what the group is for (title attribute). */
  hint: string;
  tabs: AdminTabDef[];
}

/**
 * Phase 13: nine destinations is more than a flat row can communicate, so the
 * tabs are grouped by the kind of work they belong to. Presentation only —
 * every id, body and `TAB_SOURCES` entry is untouched, and each destination is
 * still one click away.
 */
export const ADMIN_TAB_GROUPS: AdminTabGroup[] = [
  {
    label: 'Operations',
    hint: 'Day-to-day queues that need an admin decision',
    tabs: [
      { id: 'review', label: 'Review Queue', icon: ClipboardCheck },
      { id: 'internships', label: 'Internships', icon: Briefcase },
      { id: 'internshipRecords', label: 'Internship Records', icon: FileCode2 },
    ],
  },
  {
    label: 'Catalog',
    hint: 'Course content and the payment/certificate records behind it',
    tabs: [
      { id: 'cms', label: 'Course Syllabus CMS', icon: BookOpen },
      { id: 'transactions', label: 'Payment Audits', icon: DollarSign },
    ],
  },
  {
    label: 'Community',
    hint: 'Registered people and the messages and referrals they generate',
    tabs: [
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'referrals', label: 'Referral Tracker', icon: Share2 },
      { id: 'messages', label: 'Contact Messages', icon: Mail },
    ],
  },
  {
    label: 'Insights',
    hint: 'Aggregate reporting and the public contact details',
    tabs: [
      { id: 'analytics', label: 'Analytics', icon: TrendingUp },
      { id: 'settings', label: 'Contact Settings', icon: Settings },
    ],
  },
];

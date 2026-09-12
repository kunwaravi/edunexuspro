import React from 'react';
import { Check, CheckCircle2, Clock, FileCode2, X, XCircle } from 'lucide-react';
import LoadingState from '../../atoms/LoadingState';
import EmptyState from '../../atoms/EmptyState';
import ErrorState from '../../atoms/ErrorState';

/** Student avatar initials — moved here with the only markup that used it. */
const initialsOf = (name?: string) =>
  (name || '?').split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || '?';

interface AdminReviewQueueProps {
  assignments: any[];
  projects: any[];
  loading: boolean;
  /** Set when the review fetch failed — rendered instead of an empty table. */
  error: string | null;
  reviewTab: 'assignments' | 'projects';
  onReviewTabChange: (tab: 'assignments' | 'projects') => void;
  evaluatingId: number | null;
  onEvaluate: (submission: any, isProject: boolean, status: 'APPROVED' | 'REJECTED') => void;
  courseTitleById: (id: string) => string;
  onRetry: () => void;
}

/**
 * Phase 16: the Review Queue tab body, lifted out of AdminDashboard verbatim.
 * Owns no fetching — the dashboard keeps the single lazy per-tab source map —
 * so all it needs is the two queues plus the evaluate callback.
 */
const AdminReviewQueue: React.FC<AdminReviewQueueProps> = ({
  assignments,
  projects,
  loading,
  error,
  reviewTab,
  onReviewTabChange,
  evaluatingId,
  onEvaluate,
  courseTitleById,
  onRetry,
}) => {
  const reviewIsProject = reviewTab === 'projects';
  const reviewItems = reviewIsProject ? projects : assignments;
  const reviewPending = reviewItems.filter((s) => s.status === 'PENDING').length;
  const reviewApprovedToday = reviewItems.filter(
    (s) => s.status === 'APPROVED' && new Date(s.updatedAt).toDateString() === new Date().toDateString()
  ).length;
  const reviewRejected = reviewItems.filter((s) => s.status === 'REJECTED').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-tabs: Assignments / Projects */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Review Queue</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evaluate student submissions inline — approvals award XP instantly.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onReviewTabChange('assignments')}
            className={`px-4 py-2 rounded-xl border text-[13px] font-bold transition ${
              reviewTab === 'assignments'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40'
            }`}
            aria-pressed={reviewTab === 'assignments'}
          >
            Assignments
            {assignments.filter((s) => s.status === 'PENDING').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[12px] font-black">
                {assignments.filter((s) => s.status === 'PENDING').length}
              </span>
            )}
          </button>
          <button
            onClick={() => onReviewTabChange('projects')}
            className={`px-4 py-2 rounded-xl border text-[13px] font-bold transition ${
              reviewTab === 'projects'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40'
            }`}
            aria-pressed={reviewTab === 'projects'}
          >
            Projects
            {projects.filter((s) => s.status === 'PENDING').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[12px] font-black">
                {projects.filter((s) => s.status === 'PENDING').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stat row: Pending / Approved today / Rejected */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock size={12} className="text-amber-500" /> Pending
          </p>
          <p className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{reviewPending}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-500" /> Approved today
          </p>
          <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{reviewApprovedToday}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <XCircle size={12} className="text-rose-500" /> Rejected
          </p>
          <p className="text-2xl font-black mt-1 text-rose-500 dark:text-rose-400">{reviewRejected}</p>
        </div>
      </div>

      {/* Submissions table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingState label={`Loading ${reviewIsProject ? 'projects' : 'assignments'}…`} className="py-16" />
        ) : error ? (
          <ErrorState
            title="Couldn't load the review queue"
            message={error}
            onRetry={onRetry}
            className="my-8"
          />
        ) : reviewItems.length === 0 ? (
          <EmptyState
            icon={FileCode2}
            title={`No ${reviewIsProject ? 'projects' : 'assignments'} submitted yet`}
            description="New student submissions will appear here for review."
            className="my-8"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Deliverable</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {reviewItems.map((s) => {
                  const xpAwarded = reviewIsProject ? 100 : 20;
                  return (
                    <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                            {initialsOf(s.user?.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{s.user?.name}</p>
                            <p className="text-[12px] text-slate-400 truncate">
                              {courseTitleById(s.courseId)}{s.weekNumber ? ` · Week ${s.weekNumber}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={reviewIsProject ? s.sourceCodeUrl : s.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[12px] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition"
                          title="Open submission file"
                        >
                          <FileCode2 size={13} className="shrink-0" />
                          <span className="max-w-[180px] truncate">{reviewIsProject ? s.title : s.fileName}</span>
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[12px] font-black uppercase border ${
                          s.status === 'APPROVED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            : s.status === 'REJECTED'
                            ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400'
                            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400'
                        }`}>
                          {s.status === 'APPROVED' ? 'Approved' : s.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {s.status === 'PENDING' ? (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => onEvaluate(s, reviewIsProject, 'APPROVED')}
                              disabled={evaluatingId === s.id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-black uppercase flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check size={13} /> Approve
                            </button>
                            <button
                              onClick={() => onEvaluate(s, reviewIsProject, 'REJECTED')}
                              disabled={evaluatingId === s.id}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-[12px] font-black uppercase flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X size={13} /> Reject
                            </button>
                          </div>
                        ) : s.status === 'APPROVED' ? (
                          <span className="text-[12px] text-emerald-600 dark:text-emerald-400 font-black uppercase">
                            +{xpAwarded} XP ✓
                          </span>
                        ) : (
                          <span className="text-[12px] text-rose-500 dark:text-rose-400 font-black uppercase">No XP</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewQueue;

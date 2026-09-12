import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import LoadingState from '../atoms/LoadingState';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import StatusBadge from '../atoms/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Briefcase, RefreshCw } from 'lucide-react';
import {
  formatInternshipDate,
  formatInternshipDateTime,
  type InternshipApplication,
} from '../../types/internship';

/**
 * "My Internship Applications" — the student's own applications on /dashboard.
 *
 * The endpoint is scoped to the caller's token server-side, so this list can
 * only ever contain the signed-in student's own rows. A failed fetch renders
 * ErrorState, never an empty list — "you have no applications" is only ever
 * shown after a successful response that returned none.
 */
const MyInternshipApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<InternshipApplication[]>('/internship/my-applications');
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'We could not load your internship applications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <section className="space-y-4" aria-labelledby="my-internships-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-blue-500/10 rounded-lg text-indigo-600 dark:text-blue-400">
            <Briefcase size={18} aria-hidden="true" />
          </div>
          <h2
            id="my-internships-heading"
            className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-wider"
          >
            My Internship Applications
          </h2>
        </div>
        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading && applications.length === 0 ? (
        <LoadingState label="Loading your internship applications…" />
      ) : error ? (
        <ErrorState
          title="Could not load your applications"
          message={error}
          onRetry={fetchApplications}
          retrying={loading}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No internship applications yet"
          description="Once you apply to an internship program, its status and any response from the review team will appear here."
          action={{ label: 'Browse internship programs', onClick: () => navigate('/internship') }}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[12px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400">
                <TableHead className="py-3 px-4">Program</TableHead>
                <TableHead className="py-3 px-4">Applied</TableHead>
                <TableHead className="py-3 px-4">Status</TableHead>
                <TableHead className="py-3 px-4">Last Updated</TableHead>
                <TableHead className="py-3 px-4">Admin Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {applications.map((application) => (
                <TableRow
                  key={application.id}
                  className="align-top text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition"
                >
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white min-w-[180px]">
                      {application.program?.slug ? (
                        <Link
                          to={`/internship/${application.program.slug}`}
                          className="hover:text-indigo-600 dark:hover:text-blue-400 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                        >
                          {application.program.title}
                        </Link>
                      ) : (
                        application.program?.title || 'Program unavailable'
                      )}
                    </div>
                    <div className="text-[12px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {application.applicationCode}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    {formatInternshipDate(application.createdAt)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatInternshipDateTime(application.updatedAt)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 max-w-xs">
                    {application.adminResponse ? (
                      <div className="space-y-1">
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">
                          {application.adminResponse}
                        </p>
                        {application.respondedAt && (
                          <p className="text-[12px] text-slate-400 dark:text-slate-500">
                            Responded {formatInternshipDate(application.respondedAt)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 italic">
                        No response yet
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default MyInternshipApplications;

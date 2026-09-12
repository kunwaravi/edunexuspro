import { useCallback, useEffect, useState } from 'react';
import api from '../../api';
import { useUI } from '../../context/UIContext';
import Dialog from '../atoms/Dialog';
import Select from '../ui/Select';
import LoadingState from '../atoms/LoadingState';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import StatusBadge from '../atoms/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Eye, RefreshCw, Send, Inbox } from 'lucide-react';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  formatInternshipDate,
  formatInternshipDateTime,
  type AdminInternshipApplication,
  type ApplicationStatus,
  type InternshipRespondResponse,
  type InternshipStats,
  type InternshipStatusResponse,
} from '../../types/internship';

interface AdminInternshipsPanelProps {
  applications: AdminInternshipApplication[];
  loading: boolean;
  error: string | null;
  /**
   * Re-runs the list fetch. Used both for retry-after-failure and after a
   * mutation; resolves when the refetch settles.
   */
  onRefetch: () => Promise<void>;
  /** '' means "all statuses"; the API filters server-side. */
  statusFilter: '' | ApplicationStatus;
  onStatusFilterChange: (status: '' | ApplicationStatus) => void;
}

/** The workflow actions available on an application, in the order shown. */
const STATUS_ACTIONS: { status: ApplicationStatus; label: string; danger?: boolean }[] = [
  { status: 'UNDER_REVIEW', label: 'Under Review' },
  { status: 'APPROVED', label: 'Approve' },
  { status: 'NEED_MORE_INFO', label: 'Request More Info' },
  { status: 'REJECTED', label: 'Reject', danger: true },
];

const STATUS_BUTTON_CLASS: Record<'default' | 'danger', string> = {
  default:
    'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300',
  danger:
    'border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-400',
};

/**
 * Admin → Internships.
 *
 * The list is fetched by AdminDashboard (so it follows the same lazy per-tab
 * source map as every other admin section); this panel owns the detail dialog,
 * the workflow actions and the response/email flow.
 *
 * Email delivery is reported exactly as the API reported it. `POST /respond`
 * persists the response even when delivery fails, so the two outcomes are
 * surfaced separately: "Response saved. Email sent." never appears unless
 * `email.sent` was true (or `responseEmailStatus === 'SENT'`).
 */
const AdminInternshipsPanel = ({
  applications,
  loading,
  error,
  onRefetch,
  statusFilter,
  onStatusFilterChange,
}: AdminInternshipsPanelProps) => {
  const { confirmDialog, addToast } = useUI();

  // Real counts straight from GET /admin/stats (zeros are valid values).
  const [stats, setStats] = useState<InternshipStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [selected, setSelected] = useState<AdminInternshipApplication | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responseError, setResponseError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: boolean; message: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await api.get<InternshipStats>('/internship/admin/stats');
      setStats(res.data);
    } catch (err: unknown) {
      setStatsError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Could not load internship counts.'
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // The panel only mounts when its tab is open, so this is the lazy load.
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const openDetail = (application: AdminInternshipApplication) => {
    setSelected(application);
    setResponseText(application.adminResponse || '');
    setResponseError(null);
    setSendResult(null);
  };

  const closeDetail = () => {
    setSelected(null);
    setResponseText('');
    setResponseError(null);
    setSendResult(null);
  };

  const handleStatusChange = async (application: AdminInternshipApplication, status: ApplicationStatus) => {
    if (application.status === status || updatingId !== null) return;

    if (status === 'REJECTED') {
      const ok = await confirmDialog({
        title: 'Reject this application?',
        message:
          `Mark the application from "${application.fullName}" (${application.applicationCode}) as REJECTED? ` +
          'The applicant keeps a record of it and can apply again for a future intake.',
        confirmLabel: 'Reject',
        danger: true,
      });
      if (!ok) return;
    }

    setUpdatingId(application.id);
    try {
      const res = await api.patch<InternshipStatusResponse>(
        `/internship/admin/applications/${application.id}/status`,
        { status }
      );
      const updated = res.data?.data;
      // Keep the open dialog in sync even if the active filter drops the row.
      if (updated) {
        setSelected((prev) => (prev && prev.id === application.id ? { ...prev, ...updated } : prev));
      }
      addToast(`${application.applicationCode} marked ${APPLICATION_STATUS_LABELS[status]}.`, 'success');
      await onRefetch();
      fetchStats();
    } catch (err: unknown) {
      addToast(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to update the application status.',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendResponse = async () => {
    if (!selected || sending) return;
    const adminResponse = responseText.trim();
    if (!adminResponse) {
      setResponseError('Please write a response before sending it.');
      return;
    }
    setResponseError(null);
    setSending(true);
    setSendResult(null);
    try {
      const res = await api.post<InternshipRespondResponse>(
        `/internship/admin/applications/${selected.id}/respond`,
        { adminResponse }
      );
      const email = res.data?.email;
      const emailStatus = res.data?.data?.responseEmailStatus;
      const sent = email?.sent === true || emailStatus === 'SENT';

      let message: string;
      if (sent) {
        message = `Response saved. Email sent to ${selected.email}.`;
      } else if (email?.reason === 'NOT_CONFIGURED' || emailStatus === 'NOT_SENT') {
        message =
          'Response saved. Email could NOT be sent (mail service not configured) — ' +
          'the applicant will still see this response on their dashboard.';
      } else if (emailStatus === 'FAILED') {
        message =
          'Response saved, but the email failed to send. ' +
          'The applicant will still see this response on their dashboard.';
      } else {
        message = 'Response saved. No email was sent to the applicant.';
      }

      setSendResult({ sent, message });
      addToast(message, sent ? 'success' : 'warning');

      if (res.data?.data) {
        setSelected((prev) => (prev ? { ...prev, ...res.data.data } : prev));
      }
      await onRefetch();
      fetchStats();
    } catch (err: unknown) {
      const serverMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setResponseError(
        serverMessage
          ? `Response not saved: ${serverMessage}`
          : 'Response not saved — the request failed. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const statusCount = (status: ApplicationStatus) => stats?.byStatus?.[status] ?? 0;

  const renderStatusActions = (application: AdminInternshipApplication, compact: boolean) => (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'justify-end'}`}>
      {STATUS_ACTIONS.map((action) => {
        const isCurrent = application.status === action.status;
        return (
          <button
            key={action.status}
            type="button"
            onClick={() => handleStatusChange(application, action.status)}
            disabled={isCurrent || updatingId === application.id}
            aria-label={`Mark ${application.applicationCode} as ${APPLICATION_STATUS_LABELS[action.status]}`}
            className={`px-3 py-1.5 rounded-lg border text-[12px] font-black uppercase tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed ${
              STATUS_BUTTON_CLASS[action.danger ? 'danger' : 'default']
            }`}
          >
            {updatingId === application.id ? '…' : action.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Internship Applications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review applications, move them through the workflow, and send the applicant a response.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div className="w-full sm:w-56">
            <Select
              label="Filter by status"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as '' | ApplicationStatus)}
              className="px-3 py-2 text-xs"
            >
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {APPLICATION_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>
          <button
            type="button"
            onClick={() => {
              onRefetch();
              fetchStats();
            }}
            disabled={loading}
            className="mb-0.5 p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all disabled:opacity-50"
            title="Reload applications"
            aria-label="Reload internship applications"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Real counts by status — GET /admin/stats, zeros included */}
      {statsError ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-300">{statsError}</p>
          <button
            type="button"
            onClick={fetchStats}
            disabled={statsLoading}
            className="text-[12px] font-black uppercase tracking-wider text-red-300 hover:text-red-200 transition-colors disabled:opacity-50"
          >
            {statsLoading ? 'Retrying…' : 'Retry counts'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats?.total },
            { label: 'Pending', value: statsLoading && !stats ? undefined : statusCount('PENDING') },
            { label: 'Under Review', value: statsLoading && !stats ? undefined : statusCount('UNDER_REVIEW') },
            { label: 'Approved', value: statsLoading && !stats ? undefined : statusCount('APPROVED') },
            { label: 'Rejected', value: statsLoading && !stats ? undefined : statusCount('REJECTED') },
            { label: 'More Info Needed', value: statsLoading && !stats ? undefined : statusCount('NEED_MORE_INFO') },
          ].map((tile) => (
            <div
              key={tile.label}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-3"
            >
              <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {tile.label}
              </p>
              <p className="text-2xl font-black mt-0.5 text-slate-900 dark:text-white">
                {tile.value === undefined ? '—' : tile.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading && applications.length === 0 ? (
          <LoadingState label="Loading internship applications…" />
        ) : error ? (
          <div className="p-6">
            <ErrorState
              title="Could not load internship applications"
              message={error}
              onRetry={onRefetch}
              retrying={loading}
            />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Inbox}
              title={statusFilter ? 'No applications match this filter' : 'No internship applications yet'}
              description={
                statusFilter
                  ? 'No application currently has this status. Clear the filter to see the full list.'
                  : 'Applications submitted by students will appear here for review.'
              }
              tone={statusFilter ? 'neutral' : 'positive'}
              action={statusFilter ? { label: 'Show all statuses', onClick: () => onStatusFilterChange('') } : undefined}
            />
          </div>
        ) : (
          <Table className="text-xs min-w-[900px]">
            <TableHeader>
              <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[12px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400">
                <TableHead className="py-3 px-4">Application ID</TableHead>
                <TableHead className="py-3 px-4">Student</TableHead>
                <TableHead className="py-3 px-4">Program</TableHead>
                <TableHead className="py-3 px-4">Applied Date</TableHead>
                <TableHead className="py-3 px-4">Status</TableHead>
                <TableHead className="py-3 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {applications.map((application) => (
                <TableRow
                  key={application.id}
                  className="align-top text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition"
                >
                  <TableCell className="py-3.5 px-4">
                    <div className="font-mono text-[12px] text-cyan-700 dark:text-cyan-400 font-bold whitespace-nowrap">
                      {application.applicationCode}
                    </div>
                    <div className="text-[12px] text-slate-400 dark:text-slate-500">#{application.id}</div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white min-w-[150px]">
                      {application.fullName}
                    </div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400 font-mono break-all">
                      {application.user?.email || application.email}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-semibold min-w-[160px]">
                      {application.program?.title || 'Program unavailable'}
                    </div>
                    {application.program && (
                      <div className="text-[12px] text-slate-400 dark:text-slate-500">
                        {application.program.duration} · {application.program.mode}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    {formatInternshipDate(application.createdAt)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => openDetail(application)}
                        aria-label={`View application ${application.applicationCode}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-300 text-[12px] font-black uppercase tracking-wide transition"
                      >
                        <Eye size={13} aria-hidden="true" /> View
                      </button>
                      {renderStatusActions(application, false)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Detail + response dialog ─────────────────────────────────────── */}
      <Dialog
        open={!!selected}
        onClose={closeDetail}
        closeOnBackdrop={false}
        title={selected ? `Application ${selected.applicationCode}` : 'Application'}
        size="xl"
        backdropClassName="bg-slate-950/80 backdrop-blur-sm"
        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-300"
        busy={sending}
      >
        {selected && (
          <div className="flex flex-col max-h-[88vh]">
            <div className="flex flex-wrap items-start justify-between gap-3 p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {selected.fullName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono break-all">
                  {selected.applicationCode} · {selected.user?.email || selected.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status} />
                <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email: <StatusBadge status={selected.responseEmailStatus} />
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3">
                  <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Program</dt>
                  <dd className="mt-1 font-semibold text-slate-900 dark:text-slate-200">
                    {selected.program?.title || 'Program unavailable'}
                  </dd>
                  {selected.program && (
                    <dd className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {selected.program.duration} · {selected.program.mode}
                    </dd>
                  )}
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3">
                  <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Applied / Updated</dt>
                  <dd className="mt-1 text-slate-700 dark:text-slate-300">
                    {formatInternshipDateTime(selected.createdAt)}
                  </dd>
                  <dd className="text-[12px] text-slate-500 dark:text-slate-400">
                    last change {formatInternshipDateTime(selected.updatedAt)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3">
                  <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</dt>
                  <dd className="mt-1 text-slate-700 dark:text-slate-300">{selected.phone || 'Not provided'}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3">
                  <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Education / Qualification</dt>
                  <dd className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selected.qualification}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 sm:col-span-2">
                  <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Relevant Skills</dt>
                  <dd className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selected.skills}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 sm:col-span-2">
                  <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Introduction</dt>
                  <dd className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selected.introduction}
                  </dd>
                </div>
                {selected.portfolioUrl && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 sm:col-span-2">
                    <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Portfolio / GitHub / LinkedIn</dt>
                    <dd className="mt-1">
                      <a
                        href={selected.portfolioUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-indigo-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {selected.portfolioUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {selected.message && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 sm:col-span-2">
                    <dt className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Applicant Message</dt>
                    <dd className="mt-1 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selected.message}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
                <p className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Move to another status
                </p>
                {renderStatusActions(selected, true)}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="admin-internship-response"
                  className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Admin Response
                </label>
                <textarea
                  id="admin-internship-response"
                  rows={5}
                  value={responseText}
                  onChange={(e) => {
                    setResponseText(e.target.value);
                    if (responseError) setResponseError(null);
                  }}
                  data-dialog-autofocus
                  aria-invalid={responseError ? true : undefined}
                  aria-describedby={responseError ? 'admin-internship-response-error' : 'admin-internship-response-hint'}
                  placeholder="Write the response the applicant will see. This is saved even if the notification email cannot be sent."
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 leading-relaxed focus:outline-none transition ${
                    responseError
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800 focus:border-cyan-500'
                  }`}
                />
                {responseError ? (
                  <p
                    id="admin-internship-response-error"
                    role="alert"
                    className="text-red-600 dark:text-red-400 text-[12px] font-semibold"
                  >
                    ⚠ {responseError}
                  </p>
                ) : (
                  <p id="admin-internship-response-hint" className="text-[12px] text-slate-500 dark:text-slate-400">
                    {responseText.trim().length}/5000 characters. Sending also attempts the notification email.
                  </p>
                )}

                {selected.adminResponse && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 space-y-1">
                    <p className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Currently stored response
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selected.adminResponse}
                    </p>
                    {selected.respondedAt && (
                      <p className="text-[12px] text-slate-500 dark:text-slate-400">
                        Sent on {formatInternshipDateTime(selected.respondedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {sendResult && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl border p-4 text-xs leading-relaxed font-semibold ${
                    sendResult.sent
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                      : 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {sendResult.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 p-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={closeDetail}
                disabled={sending}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold uppercase transition disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendResponse}
                disabled={sending || !responseText.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} aria-hidden="true" />
                {sending ? 'Saving…' : 'Save Response & Send Email'}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AdminInternshipsPanel;

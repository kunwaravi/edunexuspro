import React, { useState } from 'react';
import { Edit3, Search, Trash2, Users } from 'lucide-react';
import Dialog from '../../atoms/Dialog';
import Select from '../../ui/Select';
import LoadingState from '../../atoms/LoadingState';
import EmptyState from '../../atoms/EmptyState';
import ErrorState from '../../atoms/ErrorState';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/Table';

export interface CandidateForm {
  name: string;
  email: string;
  fatherName: string;
  collegeName: string;
  branchName: string;
  courseType: string;
  role: string;
  certificateStartDate: string;
  certificateEndDate: string;
}

type SortField = 'id' | 'name' | 'createdAt' | 'referralCount';

interface AdminCandidatesTableProps {
  users: any[];
  loading: boolean;
  /** Set when the users fetch failed — rendered instead of a blank table. */
  error: string | null;
  onRetry: () => void;
  onEdit: (candidate: any) => void;
  onDelete: (userId: number, userName: string) => void;
  /** Non-null while the edit dialog is open (the dialog lives here, with the table). */
  editingCandidate: any | null;
  candidateForm: CandidateForm;
  onCandidateFormChange: React.Dispatch<React.SetStateAction<CandidateForm>>;
  savingCandidate: boolean;
  onSaveCandidate: (e: React.FormEvent) => void;
  onCloseEdit: () => void;
}

/**
 * Phase 16: the User Management tab body, lifted out of AdminDashboard verbatim
 * — including the edit dialog, which is nested inside the tab's conditional and
 * must unmount with the tab (it holds no data of its own).
 *
 * Phase 15: the table used to paint an empty <tbody> until the fetch settled
 * and had no empty state at all, so a slow or failed load was indistinguishable
 * from "no candidates". Loading / empty / error are now three distinct
 * surfaces, and sorting + search stay client-side (the admin user list is small
 * enough that a server round-trip per keystroke would only add latency).
 */
const AdminCandidatesTable: React.FC<AdminCandidatesTableProps> = ({
  users,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  editingCandidate,
  candidateForm,
  onCandidateFormChange,
  savingCandidate,
  onSaveCandidate,
  onCloseEdit,
}) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const needle = search.trim().toLowerCase();
  const sortedUsers = users
    .filter((u) => {
      if (!needle) return true;
      return (
        String(u.name ?? '').toLowerCase().includes(needle) ||
        String(u.email ?? '').toLowerCase().includes(needle) ||
        String(u.id ?? '').includes(needle)
      );
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      if (sortField === 'referralCount') {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const loaded = !loading || users.length > 0;

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users size={18} className="text-cyan-400" /> Registered Candidate Directory
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or ID…"
              aria-label="Search candidates"
              className="w-full sm:w-56 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-[12px] text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <span className="text-[12px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold whitespace-nowrap">
            {!loaded
              ? 'Loading candidates…'
              : error && users.length === 0
              ? 'Unavailable'
              : needle
              ? `${sortedUsers.length} of ${users.length} shown`
              : `${users.length} Candidates Registered`}
          </span>
        </div>
      </div>

      {!loaded ? (
        <LoadingState label="Loading candidates…" className="py-12" />
      ) : error && users.length === 0 ? (
        <ErrorState
          title="Couldn't load the candidate directory"
          message={error}
          onRetry={onRetry}
          retrying={loading}
          className="my-6"
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates registered yet"
          description="Students who sign up on the portal will appear here."
          className="my-6"
        />
      ) : sortedUsers.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No candidates match your search"
          description={`Nothing matches “${search.trim()}”.`}
          action={{ label: 'Clear Search', onClick: () => setSearch('') }}
          className="my-6"
        />
      ) : (
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
              <TableHead className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('id')}>
                Student ID {sortField === 'id' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                Candidate Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead className="py-3 px-4">Academic Details</TableHead>
              <TableHead className="py-3 px-4">Pursuing Courses</TableHead>
              <TableHead className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('referralCount')}>
                Referrals {sortField === 'referralCount' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead className="py-3 px-4">Role</TableHead>
              <TableHead className="py-3 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('createdAt')}>
                Registration Date {sortField === 'createdAt' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead className="py-3 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-850">
            {sortedUsers.map((u) => (
              <TableRow key={u.id} className="hover:bg-slate-900/40 text-slate-300 transition">
                  <TableCell className="py-3.5 px-4 font-mono text-[12px] text-cyan-400">#{u.id}</TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[12px] text-slate-500 font-mono">{u.email}</div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    {u.collegeName ? (
                      <>
                        <div className="font-semibold text-slate-350">{u.collegeName}</div>
                        <div className="text-[12px] text-slate-500 uppercase font-bold">
                          {u.branchName ? `${u.branchName} Branch` : 'Branch not recorded'}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-600 italic">No academic profiles updated</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const courseMap = new Map<string, { progress?: number; paid?: boolean; pending?: boolean }>();

                        // 1. Add progresses info
                        if (u.progresses) {
                          u.progresses.forEach((p: any) => {
                            courseMap.set(p.courseId, { progress: p.progress });
                          });
                        }

                        // 2. Add payments info
                        if (u.payments) {
                          u.payments.forEach((py: any) => {
                            const existing = courseMap.get(py.courseId) || {};
                            if (py.status === 'VERIFIED') {
                              courseMap.set(py.courseId, { ...existing, paid: true });
                            } else if (py.status === 'PENDING' || py.status === 'PENDING_VERIFICATION') {
                              courseMap.set(py.courseId, { ...existing, pending: true });
                            }
                          });
                        }

                        if (courseMap.size === 0) {
                          return <span className="text-slate-600 italic text-[12px]">Not Enrolled</span>;
                        }

                        return Array.from(courseMap.entries()).map(([courseId, info]) => {
                          let badgeText = `${courseId}`;
                          let badgeStyle = "border-blue-500/20 bg-blue-500/5 text-blue-400";

                          if (info.progress !== undefined) {
                            badgeText += ` (${info.progress}%)`;
                          } else {
                            badgeText += ` (0%)`;
                          }

                          if (info.paid) {
                            badgeText += ` [Paid]`;
                            badgeStyle = "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";
                          } else if (info.pending) {
                            badgeText += ` [Pending]`;
                            badgeStyle = "border-amber-500/25 bg-amber-500/10 text-amber-400";
                          }

                          return (
                            <span
                              key={courseId}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[12px] font-black uppercase tracking-wider ${badgeStyle}`}
                              title={`Course: ${courseId}`}
                            >
                              {badgeText}
                            </span>
                          );
                        });
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-left">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-200">
                        Code: <span className="font-mono text-[12px] text-cyan-400">{u.referralCode || '—'}</span>
                      </div>
                      {u.referredBy && (
                        <div className="text-[12px] text-slate-500">
                          Referred By: <span className="font-mono">{u.referredBy}</span>
                        </div>
                      )}
                      <div className="text-[12px] text-emerald-450 font-bold">
                        Refers: {u.referralCount || 0} (Paid: {u.referralPaidCount || 0})
                      </div>
                      {u.referralSuccess && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[12px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                          100% OFF Unlocked
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[12px] font-black uppercase ${
                      u.role === 'ADMIN'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/25'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                    }`}>
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-slate-500 font-mono">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : '—'}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onEdit(u)}
                      className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 rounded-lg transition active:scale-90 mr-1.5"
                      title="Edit Candidate Profile"
                      aria-label="Edit candidate profile"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(u.id, u.name)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition active:scale-90"
                      title="Remove Candidate"
                      aria-label="Remove candidate"
                    >
                      <Trash2 size={14} />
                    </button>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Candidate Profile Modal */}
      <Dialog
        open={!!editingCandidate}
        onClose={onCloseEdit}
        closeOnBackdrop={false}
        title="Edit Candidate Profile"
        size="lg"
        backdropClassName="bg-slate-950/80 backdrop-blur-sm"
        className="bg-slate-900 border-slate-800 rounded-2xl p-6 space-y-6"
      >
        {editingCandidate && (
        <>
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Edit3 size={18} className="text-cyan-400" /> Edit Candidate Profile
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Candidate ID: #{editingCandidate.id}</p>
          </div>
          <button
            onClick={onCloseEdit}
            aria-label="Close edit candidate dialog"
            className="text-slate-500 hover:text-white p-1 rounded-lg text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSaveCandidate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    data-dialog-autofocus
                    value={candidateForm.name}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={candidateForm.email}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Father's Name</label>
                  <input
                    type="text"
                    value={candidateForm.fatherName}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, fatherName: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <Select
                    label="Role"
                    value={candidateForm.role}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, role: e.target.value })}
                    className="px-3 py-2"
                  >
                    <option value="USER">USER (Student)</option>
                    <option value="ADMIN">ADMIN (Staff)</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">College Name</label>
                  <input
                    type="text"
                    value={candidateForm.collegeName}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, collegeName: e.target.value })}
                    placeholder="e.g. COEP Technological University"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Branch Name</label>
                  <input
                    type="text"
                    value={candidateForm.branchName}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, branchName: e.target.value })}
                    placeholder="e.g. ECE / CSE / Mechanical"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Certificate Start Date</label>
                  <input
                    type="date"
                    value={candidateForm.certificateStartDate}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, certificateStartDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-black uppercase text-slate-400">Certificate End Date</label>
                  <input
                    type="date"
                    value={candidateForm.certificateEndDate}
                    onChange={(e) => onCandidateFormChange({ ...candidateForm, certificateEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <p className="text-[12px] text-slate-500 -mt-2">These dates are shown on the certificate. Leave empty to auto-derive from registration date.</p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onCloseEdit}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCandidate}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow disabled:opacity-50"
                >
                  {savingCandidate ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
        </>
        )}
      </Dialog>
    </div>
  );
};

export default AdminCandidatesTable;

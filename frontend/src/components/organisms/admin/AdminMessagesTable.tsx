import React from 'react';
import { Inbox, Mail, Trash2 } from 'lucide-react';
import LoadingState from '../../atoms/LoadingState';
import EmptyState from '../../atoms/EmptyState';
import ErrorState from '../../atoms/ErrorState';

interface AdminMessagesTableProps {
  messages: any[];
  loading: boolean;
  /** Set when the messages fetch failed — rendered instead of an empty table. */
  error: string | null;
  onDelete: (id: number) => void;
  onRetry: () => void;
}

/**
 * Phase 16: the Contact Messages tab body, lifted out of AdminDashboard
 * verbatim. The row count is only ever the length of a list the API actually
 * returned; a failed or in-flight fetch says so instead of reporting 0.
 */
const AdminMessagesTable: React.FC<AdminMessagesTableProps> = ({
  messages,
  loading,
  error,
  onDelete,
  onRetry,
}) => (
  <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in">
    <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
      <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
        <Mail size={18} className="text-cyan-400" /> Contact Messages Registry
      </h3>
      <span className="text-[12px] bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 font-bold">
        {loading && messages.length === 0
          ? 'Loading…'
          : error && messages.length === 0
          ? 'Unavailable'
          : `${messages.length} Messages`}
      </span>
    </div>

    {loading && messages.length === 0 ? (
      <LoadingState label="Loading contact messages…" className="py-12" />
    ) : error && messages.length === 0 ? (
      <ErrorState
        title="Couldn't load contact messages"
        message={error}
        onRetry={onRetry}
        className="my-6"
      />
    ) : messages.length === 0 ? (
      <EmptyState
        icon={Inbox}
        title="No messages submitted yet"
        description="Messages sent through the public contact form will appear here."
        className="my-6"
      />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">From</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Message</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {messages.map((m) => (
              <tr key={m.id} className="hover:bg-slate-900/40 text-slate-300 transition align-top">
                <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                  {new Date(m.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-[12px] text-slate-550 font-mono">{m.email}</div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-350">{m.subject || '(no subject)'}</td>
                <td className="py-3.5 px-4 max-w-sm whitespace-pre-wrap leading-relaxed text-slate-405">{m.message}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onDelete(m.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg transition"
                    title="Remove Message"
                    aria-label="Remove message"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default AdminMessagesTable;

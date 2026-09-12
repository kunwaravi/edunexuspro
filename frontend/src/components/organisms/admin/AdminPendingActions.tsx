import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { type AdminTab } from './adminTabs';

export interface PendingActionItem {
  id: string;
  label: string;
  /** `count` is only rendered when the state is 'ready'. */
  state: 'ready' | 'loading' | 'error';
  /** A real count received from the API. Ignored unless state === 'ready'. */
  count: number;
  /** What the number counts, in the admin's terms. */
  hint: string;
  /** Where clicking the tile navigates to. */
  tab: AdminTab;
}

interface AdminPendingActionsProps {
  items: PendingActionItem[];
  onSelect: (tab: AdminTab) => void;
}

/**
 * Phase 14: the "what is actually waiting on me" strip.
 *
 * Every number here comes from a fetch that already ran for other reasons
 * (payments, certificates, review queues, internship stats) — there is no
 * separate count endpoint and nothing is estimated. A tile shows a figure only
 * once its source has answered; while a source is in flight, or after it
 * failed, the tile renders an em dash and says which of the two it is. A
 * fabricated 0 would read as "all clear" and is never shown.
 */
const AdminPendingActions: React.FC<AdminPendingActionsProps> = ({ items, onSelect }) => (
  <section
    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3"
    aria-label="Pending admin actions"
  >
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Pending Actions</h2>
      <p className="text-[12px] text-slate-500 dark:text-slate-400">
        Counted live from the data this dashboard loads. “—” means the count has not arrived yet or its source failed — never a stand-in for zero.
      </p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const isReady = item.state === 'ready';
        const hasWork = isReady && item.count > 0;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.tab)}
            className={`text-left rounded-xl border p-3 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
              hasWork
                ? 'border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 hover:border-amber-400 dark:hover:border-amber-500/50'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {item.label}
              </span>
              <ChevronRight size={14} className="shrink-0 text-slate-400 dark:text-slate-600" aria-hidden="true" />
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              {isReady ? (
                <span className={`text-2xl font-black ${hasWork ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.count}
                </span>
              ) : (
                <span
                  className="text-2xl font-black text-slate-400 dark:text-slate-600"
                  title={item.state === 'loading' ? 'Still loading' : 'Unavailable — the source fetch failed'}
                >
                  —
                </span>
              )}
              {item.state === 'loading' && <span className="text-[12px] text-slate-500">loading…</span>}
              {item.state === 'error' && (
                <span className="text-[12px] font-bold text-rose-500 dark:text-rose-400 inline-flex items-center gap-1">
                  <AlertTriangle size={11} aria-hidden="true" /> unavailable
                </span>
              )}
            </div>

            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              {isReady && !hasWork ? 'Nothing waiting.' : item.hint}
            </p>
          </button>
        );
      })}
    </div>
  </section>
);

export default AdminPendingActions;

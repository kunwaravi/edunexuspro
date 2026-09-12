import React from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { ADMIN_TAB_GROUPS, type AdminTab } from './adminTabs';

interface AdminNavTabsProps {
  activeTab: AdminTab;
  onTabClick: (tab: AdminTab) => void;
  /** Real PENDING submissions across both queues; only rendered when above 0. */
  reviewPendingCount: number;
  onReload: () => void;
}

/**
 * Phase 13: the admin header + grouped tab bar, lifted out of AdminDashboard
 * unchanged in behaviour. The tab ids come from `adminTabs` and must keep
 * matching `TAB_SOURCES` there, otherwise a tab renders with no data.
 *
 * Mobile: the group row scrolls horizontally inside its own container, so the
 * page itself never gains a horizontal scrollbar (same as the flat bar before).
 */
const AdminNavTabs: React.FC<AdminNavTabsProps> = ({
  activeTab,
  onTabClick,
  reviewPendingCount,
  onReload,
}) => (
  <>
    {/* Admin Title Block */}
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Staff Portal &amp; Course CMS
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Nexus Corporate Academic Advisors &amp; Content Editors</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onReload}
          className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all"
          title="Reload Data"
          aria-label="Reload data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>

    {/* Tabs — active pill, bigger icons, grouped by work area (#89) */}
    <div className="overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:thin] [scrollbar-color:#94a3b8_transparent]">
      <div className="flex items-start gap-4 w-max">
        {ADMIN_TAB_GROUPS.map((group) => (
          <div
            key={group.label}
            className="space-y-1.5 pl-4 border-l border-slate-200 dark:border-slate-800 first:border-l-0 first:pl-0"
            title={group.hint}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600 px-1">
              {group.label}
            </p>
            <div className="flex items-center gap-1.5">
              {group.tabs.map((tab) => {
                const TabIcon = tab.icon;
                const pendingTotal = tab.id === 'review' ? reviewPendingCount : 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wide transition flex items-center gap-2.5 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-transparent'
                    }`}
                    aria-pressed={activeTab === tab.id}
                  >
                    <TabIcon size={20} className="shrink-0" />
                    {tab.label}
                    {pendingTotal > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[12px] font-black">
                        {pendingTotal}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default AdminNavTabs;

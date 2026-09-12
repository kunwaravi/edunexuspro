import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional single call to action — e.g. "Clear Search & Filters". */
  action?: EmptyStateAction;
  /** Use when the emptiness is good news (e.g. "no pending reviews"). */
  tone?: 'neutral' | 'positive';
  className?: string;
}

/**
 * Rendered when a fetch SUCCEEDED and genuinely returned nothing.
 *
 * Deliberately distinct from ErrorState: this says "there is nothing here",
 * which is only ever true after a successful response. Use ErrorState for
 * failures so the two can never be confused.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  tone = 'neutral',
  className = '',
}) => (
  <div
    className={`rounded-2xl border p-10 text-center space-y-3 max-w-lg mx-auto ${
      tone === 'positive'
        ? 'border-emerald-500/25 bg-emerald-500/5'
        : 'border-slate-800 bg-slate-900/60'
    } ${className}`}
  >
    <Icon
      className={tone === 'positive' ? 'text-emerald-400/70 mx-auto' : 'text-slate-600 mx-auto'}
      size={30}
      aria-hidden="true"
    />
    <p className="text-slate-300 text-sm font-bold uppercase tracking-widest">{title}</p>
    {description && <p className="text-slate-500 text-xs leading-relaxed">{description}</p>}
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="inline-flex items-center gap-1.5 text-xs font-black text-amber-450 hover:text-amber-300 uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 rounded"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;

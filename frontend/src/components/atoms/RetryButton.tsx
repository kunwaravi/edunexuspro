import React from 'react';
import { RotateCw } from 'lucide-react';

interface RetryButtonProps {
  onClick: () => void;
  label?: string;
  /** Set while the retry is in flight so the control can't be double-fired. */
  loading?: boolean;
  className?: string;
}

/**
 * The single retry affordance used by every ErrorState. Kept separate so the
 * wording and behaviour stay identical wherever a failed fetch is surfaced —
 * a silent empty list must never be mistaken for "there is no data".
 */
const RetryButton: React.FC<RetryButtonProps> = ({
  onClick,
  label = 'Try Again',
  loading = false,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-[12px] font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${className}`}
  >
    <RotateCw size={13} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
    {label}
  </button>
);

export default RetryButton;

import React from 'react';
import Spinner from './Spinner';

interface LoadingStateProps {
  /** Announced to screen readers and shown beneath the spinner. */
  label?: string;
  /** `skeleton` suits lists/cards, `spinner` suits a single blocking fetch. */
  variant?: 'spinner' | 'skeleton';
  /** How many skeleton rows to draw (variant="skeleton"). */
  rows?: number;
  className?: string;
}

/**
 * Shared loading surface so pages stop inventing their own spinners and
 * ad-hoc pulse blocks. `aria-live="polite"` means assistive tech hears the
 * loading state once, rather than on every re-render.
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading…',
  variant = 'spinner',
  rows = 3,
  className = '',
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`} role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">{label}</span>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-800/60 rounded-2xl border border-slate-850" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner size="lg" />
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
};

export default LoadingState;

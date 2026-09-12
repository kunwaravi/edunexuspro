import React from 'react';
import { AlertTriangle } from 'lucide-react';
import RetryButton from './RetryButton';

interface ErrorStateProps {
  /** Short, non-technical headline. Defaults to a generic load failure. */
  title?: string;
  /** What went wrong, in the user's terms. Never a raw stack/message dump. */
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  retrying?: boolean;
  className?: string;
}

/**
 * Failure surface for a fetch that did not succeed.
 *
 * Exists so a failed request never degrades into an empty list — showing "no
 * courses" when the API actually errored tells the user something false about
 * the product. `role="alert"` announces it to screen readers on mount.
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load',
  message = 'Something went wrong while loading this content. Please try again.',
  onRetry,
  retryLabel,
  retrying = false,
  className = '',
}) => (
  <div
    role="alert"
    className={`rounded-2xl border border-red-500/25 bg-red-500/5 p-8 text-center space-y-3 max-w-lg mx-auto ${className}`}
  >
    <AlertTriangle className="text-red-400 mx-auto" size={28} aria-hidden="true" />
    <p className="text-slate-200 text-sm font-bold">{title}</p>
    <p className="text-slate-400 text-xs leading-relaxed">{message}</p>
    {onRetry && <RetryButton onClick={onRetry} label={retryLabel} loading={retrying} />}
  </div>
);

export default ErrorState;

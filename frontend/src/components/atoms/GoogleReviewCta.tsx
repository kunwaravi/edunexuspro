import React from 'react';
import { Star } from 'lucide-react';
import { GOOGLE_REVIEW_URL, hasGoogleReviewUrl } from '../../config/site';

/**
 * "Rate EduNexus on Google" — points at the public Google Business listing.
 *
 * Deliberately NOT an internal review system: no review rows, no aggregate
 * score, no star count. We show no rating number at all, because we have no
 * verified source for one — the CTA only sends the visitor to Google.
 *
 * Renders nothing while `GOOGLE_REVIEW_URL` is unconfigured (see config/site.ts),
 * so a missing listing can never surface as a dead link.
 */
type Variant = 'inline' | 'card';

const GoogleReviewCta: React.FC<{ variant?: Variant; className?: string }> = ({
  variant = 'inline',
  className = '',
}) => {
  if (!hasGoogleReviewUrl) return null;

  const base =
    'inline-flex items-center gap-2 font-black uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 rounded-xl';

  // The inline variant is only 16px tall without vertical padding — below the
  // WCAG 2.5.8 minimum target size of 24x24 CSS px, and awkward to hit with a
  // thumb. `py-1.5` gives it 28px of height while staying visually a quiet text
  // link. The card variant already clears this with its own padding.
  const styles =
    variant === 'card'
      ? 'px-6 py-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 text-xs'
      : 'py-1.5 text-xs text-slate-400 hover:text-amber-400';

  return (
    <a
      href={GOOGLE_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      <Star size={14} className="fill-current" aria-hidden="true" />
      Rate EduNexus on Google
      {/* The link opens a new tab; say so, since a screen-reader user gets no
          other signal that the context is about to change. */}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
};

export default GoogleReviewCta;

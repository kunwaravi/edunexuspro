import React from 'react';
import { Share2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';

interface CourseShareButtonProps {
  courseTitle: string;
  courseDescription?: string;
  /** canonical slug route (preferred over id) */
  slug?: string;
  id?: string;
  /** Tailwind size classes for the button (defaults to a 40px touch target). */
  sizeClass?: string;
}

/**
 * TASK 6 — share a course via the Web Share API (mobile/desktop) with a
 * clipboard fallback (copy link + toast). Shares the canonical `/course/<slug>`
 * URL — never exposes the internal id when a slug exists. Distinct from the
 * card's View Course action (own button, stops propagation, own handler).
 */
const CourseShareButton: React.FC<CourseShareButtonProps> = ({
  courseTitle,
  courseDescription,
  slug,
  id,
  sizeClass = 'w-10 h-10',
}) => {
  const { addToast } = useUI();

  const canonicalUrl = `${window.location.origin}/course/${slug || id || ''}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: `EduNexus Pro — ${courseTitle}`,
      text: courseDescription ? `${courseDescription.slice(0, 180)}` : `Learn ${courseTitle} on EduNexus Pro.`,
      url: canonicalUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await navigator.share(shareData);
        return; // user completed/cancelled the native sheet — no toast needed
      }
    } catch (err: any) {
      // AbortError = user dismissed the native share sheet — not a failure.
      if (err?.name === 'AbortError') return;
      // Any other failure → fall through to clipboard copy.
    }

    // Fallback: copy the canonical link to the clipboard.
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonicalUrl);
        addToast('Course link copied to clipboard.', 'success');
        return;
      }
    } catch {
      /* clipboard unavailable — fall through */
    }

    // Last-resort fallback: legacy execCommand via a temp input.
    try {
      const textarea = document.createElement('textarea');
      textarea.value = canonicalUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      addToast('Course link copied to clipboard.', 'success');
    } catch {
      addToast('Sharing is not supported in this browser.', 'warning');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${courseTitle}`}
      title={`Share ${courseTitle}`}
      className={`${sizeClass} shrink-0 inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70 hover:border-slate-600 hover:text-white text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 active:scale-95`}
    >
      <Share2 size={16} />
    </button>
  );
};

export default CourseShareButton;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

/**
 * Diwali offer popup (2026-10-28).
 *
 * Shows the official Diwali poster supplied by the business owner. Website-only
 * and dismissible:
 *  - shown on the Home page only (never during checkout),
 *  - frequency-limited to once per 24h via localStorage,
 *  - does NOT apply a coupon automatically; the student still enters the code
 *    on the Pay page and the backend remains the source of truth.
 */

const STORAGE_KEY = 'edunexus_diwali_offer_dismissed_until';
const DISMISS_FOR_MS = 24 * 60 * 60 * 1000;

const DiwaliOfferPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissedUntil = 0;
    try {
      dismissedUntil = Number(localStorage.getItem(STORAGE_KEY) || 0);
    } catch {
      /* private mode / storage blocked → show the popup, just don't persist */
    }

    if (Date.now() < dismissedUntil) return;

    // Small delay so the page paints before the overlay appears.
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_FOR_MS));
    } catch {
      /* ignore storage failures — dismissal still works for this view */
    }
    setOpen(false);
  };

  if (!open) return null;

  // z-[10000]: above the floating support FAB (z-[9999]), below toasts
  // (z-[10001]) — see the layering note in Dialog.tsx. Without this the FAB
  // sits on top of the popup's bottom-right on mobile.
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm px-3 pb-3 sm:px-4 sm:pb-0"
      onClick={dismiss}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="diwali-offer-title"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 shadow-2xl shadow-amber-500/10"
      >
        <h2 id="diwali-offer-title" className="sr-only">
          Diwali Special Offer — ₹2,000 course now ₹1,500 with coupon DIWALI500
        </h2>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close Diwali offer"
          className="absolute right-3 top-3 z-10 rounded-full bg-slate-950/80 border border-slate-700 p-2 text-slate-300 hover:text-white hover:border-slate-500 transition"
        >
          <X size={16} />
        </button>

        <Link
          to="/courses"
          onClick={dismiss}
          aria-label="View the Diwali offer course catalog"
          className="block"
        >
          <img
            src="/diwali-offer-2026.jpeg"
            alt="Diwali Special Offer: ₹2,000 course now ₹1,500 with coupon DIWALI500, or ₹1,750 with coupon DIWALI250. Valid 28 October to 15 November 2026 at EduNexus Pro."
            className="block w-full h-auto"
            loading="eager"
            decoding="async"
          />
        </Link>

        <div className="border-t border-amber-500/15 px-4 py-3 sm:px-5">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Each coupon code can be redeemed once globally. Course access is granted only after the
            existing admin payment verification.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <Link
              to="/courses"
              onClick={dismiss}
              className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-center text-[12px] font-black uppercase tracking-wide text-slate-950 transition hover:bg-amber-400"
            >
              Explore Courses
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="px-3 py-2.5 text-[12px] font-bold text-slate-500 hover:text-slate-300 transition"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiwaliOfferPopup;

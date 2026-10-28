import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Diwali offer popup (2026-10-28).
 *
 * Shows the official Diwali poster supplied by the business owner.
 *  - Home page only (never during checkout),
 *  - shown on every visit — dismissal lasts only for the current view, nothing
 *    is persisted, so returning users see the offer again,
 *  - centered in the viewport on mobile and desktop (never bottom-anchored),
 *  - does NOT apply a coupon automatically; the student still enters the code
 *    on the Pay page and the backend remains the source of truth.
 */

const DiwaliOfferPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Small delay so the page paints before the overlay appears.
    const timer = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const dismiss = () => setOpen(false);

  if (!open) return null;

  // z-[10000]: above the floating support FAB (z-[9999]), below toasts
  // (z-[10001]) — see the layering note in Dialog.tsx. Without this the FAB
  // sits on top of the popup's bottom-right on mobile.
  return (
    <div
      className="fixed inset-0 z-[10000] grid place-items-center overflow-y-auto bg-slate-950/85 px-4 py-4 backdrop-blur-sm"
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
          Diwali Special Offer — 25% off all courses. ₹2,000 now ₹1,500 with coupon
          DIWALI500, or ₹1,750 with coupon DIWALI250.
        </h2>

        <div className="relative">
          <Link
            to="/courses"
            onClick={dismiss}
            aria-label="View the Diwali offer course catalog"
            className="block"
          >
            <img
              src="/diwali-offer-2026.jpeg"
              alt="Diwali Special Offer: 25% off all courses. ₹2,000 now ₹1,500 with coupon DIWALI500, or ₹1,750 with coupon DIWALI250. Valid 28 October to 15 November 2026 at EduNexus Pro."
              className="block h-auto w-full"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* The poster artwork already draws its own close icon at the
              top-right. This invisible hit target sits exactly on top of it so
              clicking the drawn X actually closes the popup, instead of a
              second X appearing next to it. Percentages keep it aligned at
              every width (the poster scales proportionally). */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close Diwali offer"
            className="absolute left-[84%] top-[12.4%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Close
          </button>
        </div>

        <div className="border-t border-amber-500/15 px-4 py-2.5 sm:px-5">
          <p className="text-center text-[11px] leading-relaxed text-slate-500">
            Each coupon code can be redeemed once globally. Course access is granted only after the
            existing admin payment verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiwaliOfferPopup;

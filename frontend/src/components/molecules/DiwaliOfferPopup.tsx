import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ArrowRight, Ticket, ShieldCheck } from 'lucide-react';

/**
 * Diwali offer popup (2026-10-28).
 *
 * Deliberately website-only and dismissible:
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

  return (
    // z-[10000]: above the floating support FAB (z-[9999]), below toasts
    // (z-[10001]) — see the layering note in Dialog.tsx. Without this the FAB
    // sits on top of the popup's bottom-right on mobile.
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
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 shadow-2xl shadow-amber-500/10"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-rose-500/20 blur-3xl" />

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close Diwali offer"
          className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 border border-slate-800 p-2 text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <X size={16} />
        </button>

        <div className="relative px-5 pt-8 pb-5 sm:px-7 sm:pt-9 sm:pb-7">
          <div className="flex items-center gap-2 text-amber-400">
            <Sparkles size={16} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Diwali Dhamaka</span>
          </div>

          <h2 id="diwali-offer-title" className="mt-2 text-2xl sm:text-3xl font-black leading-tight text-white">
            ₹2,000 course,
            <br />
            <span className="text-amber-400">ab sirf ₹1,500</span>
          </h2>

          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">
            Celebrate Diwali with a certified skill. Use a coupon at checkout — the discount is
            applied to your course fee. Limited to one redemption per coupon code.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Ticket size={14} />
                <span className="font-mono text-sm font-black tracking-wider">DIWALI500</span>
              </div>
              <p className="mt-1 text-[12px] font-bold text-slate-300">₹500 off → pay ₹1,500</p>
            </div>
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] px-4 py-3">
              <div className="flex items-center gap-2 text-rose-300">
                <Ticket size={14} />
                <span className="font-mono text-sm font-black tracking-wider">DIWALI250</span>
              </div>
              <p className="mt-1 text-[12px] font-bold text-slate-300">₹250 off → pay ₹1,750</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />
            <span>
              Valid 28 Oct – 15 Nov 2026. Each code can be redeemed once globally. Course access is
              granted only after the existing admin payment verification.
            </span>
          </div>

          <Link
            to="/courses"
            onClick={dismiss}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-amber-400"
          >
            Explore Courses <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full text-center text-[12px] font-bold text-slate-500 hover:text-slate-300 transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiwaliOfferPopup;

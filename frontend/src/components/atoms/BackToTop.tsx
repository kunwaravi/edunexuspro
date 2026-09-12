import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Global scroll-to-top control.
 *
 * Appears once the reader is a viewport or so into the page and sits above the
 * support FAB (bottom-4 + a ~56px button) rather than on top of it, so the two
 * floating elements never collide.
 *
 * The scroll itself is CSS-driven (`scroll-behavior` is honoured per-element
 * below), which lets `prefers-reduced-motion` degrade to an instant jump
 * without any JS branch.
 */
const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-[9998] no-print
        w-11 h-11 rounded-full grid place-items-center
        bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-300
        hover:text-white hover:border-slate-500 hover:bg-slate-800
        shadow-lg shadow-black/30 transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60
        motion-reduce:transition-none
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default BackToTop;

/**
 * Motion preferences (master task §21).
 *
 * The CSS `@media (prefers-reduced-motion: reduce)` block in index.css already
 * neutralises CSS keyframe animations and transitions, but it cannot reach two
 * things:
 *   - JS-driven scrolling — `scrollIntoView({ behavior: 'smooth' })` ignores
 *     the `scroll-behavior: auto !important` override.
 *   - Framer Motion, which animates via inline style/transform rather than CSS
 *     animation-duration (handled separately by <MotionConfig reducedMotion="user">).
 *
 * This module covers the first case.
 */

/** True when the user has asked the OS to minimise motion. */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/** Scroll behaviour to pass to scrollIntoView / window.scrollTo. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

/**
 * Scroll an element into view, honouring the user's motion preference.
 * Returns false when the element does not exist (callers can ignore it).
 */
export const scrollToElement = (
  element: HTMLElement | null,
  options: ScrollIntoViewOptions = {}
): boolean => {
  if (!element) return false;
  element.scrollIntoView({ behavior: scrollBehavior(), ...options });
  return true;
};

/** Scroll to an element by id, honouring the user's motion preference. */
export const scrollToId = (id: string, options: ScrollIntoViewOptions = {}): boolean =>
  scrollToElement(typeof document === 'undefined' ? null : document.getElementById(id), options);

/**
 * Site-level configuration — the single place for outbound links and brand
 * constants that would otherwise be scattered (and drift) across components.
 *
 * Nothing here is a statistic or a claim: these are just destinations. Anything
 * left empty is treated as "not configured" by consumers, which must hide the
 * corresponding UI rather than render a dead link.
 */

/**
 * EduNexus Pro's public Google Business / Maps review destination.
 *
 * A Maps short link is used rather than a `writereview?placeid=` deep link: the
 * short link is what the Business profile itself issues and it survives the
 * place ID changing, whereas a hard-coded place ID silently rots.
 *
 * Every consumer hides its CTA while this is blank, so an unconfigured value
 * never ships as a broken "Rate us" link. It is set, so the CTAs are live in
 * three places at once (Home trust section, Footer, Contact).
 */
export const GOOGLE_REVIEW_URL = 'https://maps.app.goo.gl/jMoKmvDUtxK4QsQP9';

/** True when a real review destination is configured. */
export const hasGoogleReviewUrl = GOOGLE_REVIEW_URL.trim().length > 0;

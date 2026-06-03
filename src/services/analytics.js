// src/services/analytics.js
//
// Thin wrapper around Vercel Analytics' track() so we have a single
// place to standardize event names + properties.
//
// Why we need this:
// Vercel Analytics gives us automatic pageviews via <Analytics />, but
// without custom events we cannot tell whether visitors actually click
// our CTAs, open the Stripe checkout, or finish signup. "We're getting
// traffic but nothing's happening" — that's exactly what no-event-data
// looks like. The fix is to instrument the points along the funnel.
//
// Conventions:
//   - Event names use snake_case to match Vercel dashboard sorting
//   - Always pass a `location` property so we can tell hero CTA from
//     pricing CTA from in-page CTA
//   - Property values must be primitives (string / number / boolean) —
//     Vercel Analytics drops objects silently
//
// Failure mode: track() is safe to call before the SDK has loaded; it
// queues. If the env var isn't set or the user has a blocker, we just
// swallow the error.

import { track as vercelTrack } from '@vercel/analytics/react';

const isProd = process.env.NODE_ENV === 'production';

function safeTrack(eventName, properties = {}) {
  try {
    // In dev we log to console so devs can verify wiring without
    // polluting prod analytics.
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log('[analytics]', eventName, properties);
      return;
    }
    vercelTrack(eventName, properties);
  } catch (e) {
    // Never let analytics throw into the UI.
  }
}

// ── Conversion funnel events ────────────────────────────────────────
// Each track() call below is intentionally a separate function so we
// have type-safe call sites and named properties. Add new helpers here
// rather than calling safeTrack() inline at the call site.

/** Hero / above-the-fold primary CTA clicked. */
export const trackPrimaryCtaClick = (location) =>
  safeTrack('primary_cta_click', { location });

/** Any in-page secondary CTA (Learn more, See features, etc.) */
export const trackSecondaryCtaClick = (location, target) =>
  safeTrack('secondary_cta_click', { location, target });

/** Signup form rendered (helps us tell who actually reaches the form). */
export const trackSignupView = (source) =>
  safeTrack('signup_view', { source: source || 'direct' });

/** Email signup submitted (before backend confirms — captures intent). */
export const trackSignupSubmit = (method) =>
  safeTrack('signup_submit', { method }); // method: 'email' | 'google'

/** Backend accepted the signup. Fires from signup success handler. */
export const trackSignupSuccess = (method) =>
  safeTrack('signup_success', { method });

/** Pricing page CTA clicked — plan tells us which tier they want. */
export const trackPricingCtaClick = (plan, location) =>
  safeTrack('pricing_cta_click', { plan, location });

/** Stripe checkout session created — last frontend step before payment. */
export const trackCheckoutStart = (plan, source) =>
  safeTrack('checkout_start', { plan, source: source || 'pricing' });

/** Cost estimator interacted with (helps us see who's calculating value). */
export const trackEstimatorChange = (pages, tier) =>
  safeTrack('estimator_change', { pages, tier });

/** Hero demo citation clicked (engagement with the receipts demo). */
export const trackDemoInteraction = (citation_id) =>
  safeTrack('demo_interaction', { citation_id });

/** Voice switcher tab changed on homepage / features page. */
export const trackVoiceSwitch = (voice, location) =>
  safeTrack('voice_switch', { voice, location });

/** First source successfully imported into the library. */
export const trackFirstSourceImport = (method) =>
  safeTrack('first_source_import', { method }); // 'pdf' | 'url' | 'doi' | 'rss'

/** Document generation job created. */
export const trackContentGenerationStart = (tier, pages) =>
  safeTrack('content_generation_start', { tier, pages });

/** Document generation job completed successfully. */
export const trackContentGenerationComplete = (tier, pages, durationMs) =>
  safeTrack('content_generation_complete', { tier, pages, durationMs });

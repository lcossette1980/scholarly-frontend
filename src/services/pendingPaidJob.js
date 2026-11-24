// src/services/pendingPaidJob.js
// 3D Secure keeps the money but used to lose the draft: confirmPayment
// redirects to the bank and back, React state is gone, and
// verifyAndCreateJob never ran (charged, no job, nothing to refund).
// Before confirming we save the job request here, keyed by the PaymentIntent
// id; on the return trip the wizard resumes it. No card data is stored.
// The backend re-verifies the PaymentIntent (succeeded, owned by the caller)
// and returns the existing job if one was already created, so a resume can't
// double-create.

export const PENDING_KEY = 'de_pending_paid_job';
export const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** "pi_123_secret_abc" -> "pi_123" */
export function paymentIntentIdFromSecret(clientSecret) {
  if (!clientSecret || typeof clientSecret !== 'string') return null;
  const i = clientSecret.indexOf('_secret_');
  return i > 0 ? clientSecret.slice(0, i) : null;
}

export function savePendingPaidJob(record, storage = window.sessionStorage) {
  try {
    storage.setItem(
      PENDING_KEY,
      JSON.stringify({ ...record, savedAt: Date.now() })
    );
  } catch {
    // storage blocked: the in-page (non-3DS) path still works
  }
}

export function clearPendingPaidJob(storage = window.sessionStorage) {
  try {
    storage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

/** The saved record if it matches this PaymentIntent and isn't stale. */
export function loadPendingPaidJob(
  paymentIntentId,
  storage = window.sessionStorage,
  now = Date.now()
) {
  try {
    const rec = JSON.parse(storage.getItem(PENDING_KEY) || 'null');
    if (!rec || rec.paymentIntentId !== paymentIntentId) return null;
    if (!rec.savedAt || now - rec.savedAt > MAX_AGE_MS) return null;
    return rec;
  } catch {
    return null;
  }
}

/**
 * Read Stripe's return parameters (appended to return_url after a redirect).
 * @returns {{paymentIntentId: string, status: string}|null}
 */
export function readStripeReturn(search) {
  const params = new URLSearchParams(search || '');
  const paymentIntentId = params.get('payment_intent');
  const status = params.get('redirect_status');
  if (!paymentIntentId || !status) return null;
  return { paymentIntentId, status };
}

/**
 * Decide what to do on a return from Stripe.
 * @returns {{action: 'resume'|'retry'|'support'|'none', record?: object, paymentIntentId?: string}}
 */
export function planResume(
  search,
  storage = window.sessionStorage,
  now = Date.now()
) {
  const ret = readStripeReturn(search);
  if (!ret) return { action: 'none' };
  const record = loadPendingPaidJob(ret.paymentIntentId, storage, now);
  if (ret.status === 'succeeded' || ret.status === 'processing') {
    return record
      ? { action: 'resume', record, paymentIntentId: ret.paymentIntentId }
      : { action: 'support', paymentIntentId: ret.paymentIntentId };
  }
  // 'failed' / 'requires_payment_method': nothing was charged
  return { action: 'retry', record, paymentIntentId: ret.paymentIntentId };
}

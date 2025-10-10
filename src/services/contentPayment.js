// src/services/contentPayment.js
/**
 * Content Generation Payment Service
 *
 * Handles Stripe Payment Intents for variable-priced content generation.
 *
 * FLOW:
 * 1. createPaymentIntent() - Get client_secret from backend
 * 2. User enters card in Stripe Elements (handled by PaymentModal)
 * 3. verifyAndCreateJob() - Verify payment, create generation job
 *
 * SECURITY:
 * - All card data handled by Stripe (never touches our servers)
 * - Backend verifies payment with Stripe (source of truth)
 * - Frontend only gets one-time client_secret token
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Creates a Stripe Payment Intent for content generation
 *
 * @param {string} userId - Firebase user ID
 * @param {string} tier - "standard" or "pro"
 * @param {number} estimatedPages - Number of pages (for price calculation)
 * @param {object} jobMetadata - Job details (source_ids, outline, settings)
 * @returns {Promise<object>} - {client_secret, payment_intent_id, amount, currency}
 *
 * WHAT THIS DOES:
 * - Backend calculates exact price ($1.49 or $2.49 per page)
 * - Creates Stripe Payment Intent
 * - Returns client_secret for payment form
 *
 * EXAMPLE:
 * const result = await createPaymentIntent(userId, 'standard', 10, {...})
 * // Returns: {client_secret: 'pi_xxx_secret_xxx', amount: 1490, ...}
 */
export const createPaymentIntent = async (userId, tier, estimatedPages, jobMetadata) => {
  try {
    const response = await fetch(`${API_URL}/api/content/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        tier: tier,
        estimated_pages: estimatedPages,
        job_metadata: jobMetadata
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create payment intent' }));
      throw new Error(errorData.detail || 'Failed to create payment intent');
    }

    const data = await response.json();

    // Validate response
    if (!data.client_secret || !data.payment_intent_id) {
      throw new Error('Invalid response from server - missing payment data');
    }

    return data;

  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Verifies payment succeeded and creates content generation job
 *
 * @param {string} paymentIntentId - Stripe Payment Intent ID (from Stripe.js)
 * @param {string} userId - Firebase user ID
 * @param {Array<string>} sourceIds - Bibliography entry IDs
 * @param {object} outline - Selected outline object
 * @param {object} settings - Generation settings (word count, style, etc.)
 * @param {string} tier - "standard" or "pro"
 * @returns {Promise<object>} - {job_id, status, message}
 *
 * WHAT THIS DOES:
 * - Backend verifies payment actually succeeded with Stripe
 * - Verifies user owns this payment (security)
 * - Creates job in Firestore with payment tracking
 * - Triggers content generation
 *
 * CRITICAL:
 * Only call this AFTER Stripe.confirmPayment() succeeds
 * Backend verifies with Stripe (never trust frontend)
 *
 * EXAMPLE:
 * const result = await verifyAndCreateJob('pi_xxx', userId, [...], {...}, {...}, 'standard')
 * // Returns: {job_id: 'job_xxx', status: 'processing'}
 */
export const verifyAndCreateJob = async (
  paymentIntentId,
  userId,
  sourceIds,
  outline,
  settings,
  tier
) => {
  try {
    const response = await fetch(`${API_URL}/api/content/verify-and-create-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        user_id: userId,
        source_ids: sourceIds,
        outline: outline,
        settings: settings,
        tier: tier
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create job' }));
      throw new Error(errorData.detail || 'Failed to create job');
    }

    const data = await response.json();

    // Validate response
    if (!data.job_id) {
      throw new Error('Invalid response from server - missing job ID');
    }

    return data;

  } catch (error) {
    console.error('Error verifying payment and creating job:', error);
    throw error;
  }
};

/**
 * Checks if a payment was successful (used for retry scenarios)
 *
 * @param {string} paymentIntentId - Stripe Payment Intent ID
 * @returns {Promise<boolean>} - true if payment succeeded
 *
 * USE CASE:
 * If user closes tab during payment, check on return
 */
export const checkPaymentStatus = async (paymentIntentId) => {
  try {
    // This would call Stripe directly via your backend
    // For now, we'll rely on Stripe.js client-side check
    return false;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return false;
  }
};

/**
 * Formats price for display
 *
 * @param {string} tier - "standard" or "pro"
 * @param {number} pages - Number of pages
 * @returns {string} - Formatted price string (e.g., "$14.90")
 */
export const calculatePrice = (tier, pages) => {
  const pricePerPage = tier === 'standard' ? 1.49 : 2.49;
  const total = pricePerPage * pages;
  return total.toFixed(2);
};

/**
 * Gets human-readable tier name
 */
export const getTierName = (tier) => {
  return tier === 'standard' ? 'Standard' : 'Professional';
};

/**
 * Gets tier model name
 */
export const getTierModel = (tier) => {
  return tier === 'standard' ? 'GPT-4o' : 'GPT-4 Turbo';
};

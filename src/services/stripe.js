// src/services/stripe.js (FIXED VERSION)
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, serverTimestamp, getDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  trial: {
    id: 'trial',
    name: 'Starter',
    price: 0,
    entriesLimit: 5,
    features: [
      '5 source entries (lifetime)',
      'Basic AI analysis',
      'Standard export format',
      'Email support'
    ],
    allowedFeatures: ['bibliography']
  },
  free: {
    id: 'free',
    name: 'Starter',
    price: 0,
    entriesLimit: 5,
    features: [
      '5 source entries (lifetime)',
      'Basic AI analysis',
      'Standard export format',
      'Email support'
    ],
    allowedFeatures: ['bibliography']
  },
  student: {
    id: 'student',
    name: 'Plus',
    price: 9.99,
    priceId: process.env.REACT_APP_STRIPE_STUDENT_PRICE_ID || 'price_1RdJyPCfEsnTPNpVUZVs6OU1',
    entriesLimit: -1,
    features: [
      'Unlimited source entries',
      'Topic & Outline Generator',
      'Advanced AI analysis',
      'Multiple export formats',
      'Priority support',
      'Topic focus customization',
      'Batch processing',
      'Access to Content Generator (pay-per-use)'
    ],
    allowedFeatures: ['bibliography', 'topic_outline']
  },
  researcher: {
    id: 'researcher',
    name: 'Pro',
    price: 19.99,
    priceId: process.env.REACT_APP_STRIPE_RESEARCHER_PRICE_ID || 'price_1RdK3ACfEsnTPNpVG9GjSJNH',
    entriesLimit: -1,
    features: [
      'Unlimited source entries',
      'Topic & Outline Generator',
      'Premium AI analysis',
      'All export formats',
      'Priority support',
      'Advanced customization',
      'Batch processing',
      'Reference style options'
    ],
    allowedFeatures: ['bibliography', 'topic_outline']
  }
};

// Create checkout session
export const createCheckoutSession = async (userId, priceId, planId) => {
  try {
    // Get the price ID from the plan if not provided
    const finalPriceId = priceId || SUBSCRIPTION_PLANS[planId]?.priceId;

    // Enhanced validation
    if (!finalPriceId || finalPriceId === 'undefined' || finalPriceId === '') {
      console.error('Price ID validation failed for plan:', planId);
      throw new Error(`Invalid price ID for plan ${planId}. Please check your environment configuration.`);
    }

    // Use backend API to create checkout session
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    // Build authenticated request — Stripe routes now require auth (C1/C6 hardening)
    const { auth } = await import('./firebase');
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('You must be signed in to subscribe.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(`${apiUrl}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        plan: planId,
        price_id: finalPriceId,
        success_url: `${window.location.origin}/dashboard?success=true&plan=${planId}&userId=${userId}`,
        cancel_url: `${window.location.origin}/pricing?canceled=true`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create checkout session' }));
      throw new Error(errorData.detail || 'Failed to create checkout session');
    }

    const data = await response.json();

    if (data.checkout_url) {
      // Store pending subscription info in localStorage as backup
      localStorage.setItem('pendingSubscription', JSON.stringify({
        userId,
        planId,
        priceId: finalPriceId,
        timestamp: Date.now()
      }));

      // Redirect to Stripe Checkout
      window.location.assign(data.checkout_url);
      return data.checkout_url;
    } else {
      throw new Error('No checkout URL received from server');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create customer portal session
export const createCustomerPortalSession = async (userId) => {
  try {
    // Use backend API to create portal session
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const { auth } = await import('./firebase');
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('You must be signed in to manage your subscription.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(`${apiUrl}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        return_url: `${window.location.origin}/dashboard`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create portal session' }));
      throw new Error(errorData.detail || 'Failed to create portal session');
    }

    const data = await response.json();

    if (data.url) {
      // Redirect to Customer Portal
      window.location.assign(data.url);
      return data.url;
    } else {
      throw new Error('No portal URL received from server');
    }
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Update user subscription in Firestore
export const updateUserSubscription = async (userId, subscriptionData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscription: subscriptionData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};

// Helper to build authenticated fetch headers for Stripe routes
const _authHeaders = async () => {
  const { auth } = await import('./firebase');
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must be signed in.');
  }
  const token = await currentUser.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Check subscription status from backend
export const checkSubscriptionStatus = async (userId, skipFallback = false) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const headers = await _authHeaders();
    const response = await fetch(`${apiUrl}/check-subscription/${userId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.warn(`Subscription check returned ${response.status}`);
      throw new Error('Failed to check subscription status');
    }

    const data = await response.json();

    // If backend returns subscription data, update Firestore
    if (data.subscription) {
      await updateUserSubscription(userId, data.subscription);
    }

    return data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    // Don't throw - return null to allow fallback
    return null;
  }
};

// Force sync subscription from Stripe (for webhook failures)
export const forceSyncSubscription = async (userId) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const headers = await _authHeaders();
    const response = await fetch(`${apiUrl}/force-sync-subscription/${userId}`, {
      method: 'POST',
      headers,
    });

    if (response.ok) {
      const data = await response.json();

      if (data.subscription) {
        // Update Firestore with the synced data
        await updateUserSubscription(userId, data.subscription);
        return { success: true, subscription: data.subscription };
      }
    }

    return { success: false, error: 'No active subscription found' };
  } catch (error) {
    console.error('Error force syncing subscription:', error);
    return { success: false, error: error.message };
  }
};

// REMOVED: manuallyActivateSubscription
// This client-side function let any signed-in user grant themselves a paid
// plan by writing directly to Firestore. Subscription grants must happen
// via Stripe webhook only. If the webhook fails, use forceSyncSubscription
// (which re-reads truth from Stripe) instead.

// Check if user can create more entries
export const canCreateEntry = (user) => {
  if (!user?.subscription) return false;

  const { entriesUsed, entriesLimit, plan } = user.subscription;

  // Unlimited plan (Plus, Pro)
  if (entriesLimit === -1) return true;

  // Free/trial users have 5 lifetime limit
  if (plan === 'trial' || plan === 'free') {
    return entriesUsed < entriesLimit;
  }

  // Check if within limit
  return entriesUsed < entriesLimit;
};

// Check if user has access to a specific feature
export const canAccessFeature = (user, feature) => {
  if (!user?.subscription) return false;

  const plan = user.subscription.plan || 'free';
  const planConfig = SUBSCRIPTION_PLANS[plan];

  if (!planConfig) return false;

  return planConfig.allowedFeatures?.includes(feature) || false;
};

// Fix subscription for existing paid users with old limits
export const fixSubscription = async (userId) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const headers = await _authHeaders();
    const response = await fetch(`${API_URL}/fix-subscription/${userId}`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fix subscription');
    }

    return data;
  } catch (error) {
    console.error('Error fixing subscription:', error);
    throw error;
  }
};

// Increment user's entries used
export const incrementEntriesUsed = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Use atomic increment to prevent race conditions with simultaneous uploads
      await updateDoc(userRef, {
        'subscription.entriesUsed': increment(1),
        'subscription.entriesRemaining': increment(-1),
        updatedAt: serverTimestamp()
      });

      const updatedSnap = await getDoc(userRef);
      return updatedSnap.data()?.subscription?.entriesUsed || 1;
    }
  } catch (error) {
    console.error('Error incrementing entries used:', error);
    throw error;
  }
};

export default stripePromise;
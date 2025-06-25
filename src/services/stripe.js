// src/services/stripe.js (FIXED VERSION)
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  trial: {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    entriesLimit: 5,
    features: [
      '5 bibliography entries (lifetime)',
      'Basic AI analysis',
      'Standard export format',
      'Email support'
    ]
  },
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    entriesLimit: 5,
    features: [
      '5 bibliography entries (lifetime)',
      'Basic AI analysis',
      'Standard export format',
      'Email support'
    ]
  },
  student: {
    id: 'student',
    name: 'Student',
    price: 9.99,
    priceId: process.env.REACT_APP_STRIPE_STUDENT_PRICE_ID || 'price_1RdJyPCfEsnTPNpVUZVs6OU1',
    entriesLimit: 20,
    features: [
      '20 bibliography entries per month',
      'Advanced AI analysis',
      'Multiple export formats',
      'Priority support',
      'Research focus customization',
      'Batch processing'
    ]
  },
  researcher: {
    id: 'researcher',
    name: 'Researcher',
    price: 19.99,
    priceId: process.env.REACT_APP_STRIPE_RESEARCHER_PRICE_ID || 'price_1RdK3ACfEsnTPNpVG9GjSJNH',
    entriesLimit: 50,
    features: [
      '50 bibliography entries per month',
      'Premium AI analysis',
      'All export formats',
      'Priority support',
      'Advanced customization',
      'Batch processing',
      'Citation style options',
      'Research collaboration tools'
    ]
  }
};

// Create checkout session
export const createCheckoutSession = async (userId, priceId, planId) => {
  try {
    // Debug: Log ALL environment variables to see what's happening
    console.log('Full environment check:', {
      allEnvVars: process.env,
      studentPriceId: process.env.REACT_APP_STRIPE_STUDENT_PRICE_ID,
      researcherPriceId: process.env.REACT_APP_STRIPE_RESEARCHER_PRICE_ID,
      planId,
      priceIdPassed: priceId,
      priceIdType: typeof priceId,
      priceIdFromPlan: SUBSCRIPTION_PLANS[planId]?.priceId
    });

    // Get the price ID from the plan if not provided
    const finalPriceId = priceId || SUBSCRIPTION_PLANS[planId]?.priceId;
    
    // Enhanced validation
    if (!finalPriceId || finalPriceId === 'undefined' || finalPriceId === '') {
      console.error('Price ID validation failed:', {
        finalPriceId,
        planId,
        planData: SUBSCRIPTION_PLANS[planId],
        environmentVars: {
          student: process.env.REACT_APP_STRIPE_STUDENT_PRICE_ID,
          researcher: process.env.REACT_APP_STRIPE_RESEARCHER_PRICE_ID
        }
      });
      throw new Error(`Invalid price ID for plan ${planId}. Price ID: "${finalPriceId}". Please check your environment configuration.`);
    }

    console.log('Using price ID:', finalPriceId);

    // Use backend API to create checkout session
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        plan: planId,
        success_url: `${window.location.origin}/dashboard?success=true&plan=${planId}`,
        cancel_url: `${window.location.origin}/pricing?canceled=true`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create checkout session' }));
      throw new Error(errorData.detail || 'Failed to create checkout session');
    }

    const data = await response.json();
    
    if (data.checkout_url) {
      console.log('Checkout session created successfully:', data.checkout_url);
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
    const response = await fetch(`${apiUrl}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      console.log('Portal session created successfully:', data.url);
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

// Check subscription status from backend
export const checkSubscriptionStatus = async (userId) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/check-subscription/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check subscription status');
    }

    const data = await response.json();
    console.log('Subscription status from backend:', data);
    
    // If backend returns subscription data, update Firestore
    if (data.subscription) {
      await updateUserSubscription(userId, data.subscription);
    }
    
    return data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    // Don't throw - return null to allow fallback to Firestore check
    return null;
  }
};

// Force sync subscription from Stripe (for webhook failures)
export const forceSyncSubscription = async (userId) => {
  try {
    console.log('Force syncing subscription for user:', userId);
    
    // First try the backend sync endpoint
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/force-sync-subscription/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Force sync response:', data);
      
      if (data.subscription) {
        // Update Firestore with the synced data
        await updateUserSubscription(userId, data.subscription);
        return { success: true, subscription: data.subscription };
      }
    }

    // If backend sync fails, try checking subscription status
    const statusCheck = await checkSubscriptionStatus(userId);
    if (statusCheck?.subscription) {
      return { success: true, subscription: statusCheck.subscription };
    }

    return { success: false, error: 'No active subscription found' };
  } catch (error) {
    console.error('Error force syncing subscription:', error);
    return { success: false, error: error.message };
  }
};

// Manually activate subscription after successful payment (temporary fix for webhook issues)
export const manuallyActivateSubscription = async (userId, planId) => {
  try {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) throw new Error('Invalid plan');
    
    const subscriptionData = {
      plan: planId,
      status: 'active',
      entriesUsed: 0,
      entriesLimit: plan.entriesLimit,
      entriesRemaining: plan.entriesLimit,
      isLifetime: false,
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      updatedAt: new Date().toISOString()
    };
    
    console.log('Manually activating subscription:', subscriptionData);
    await updateUserSubscription(userId, subscriptionData);
    
    return subscriptionData;
  } catch (error) {
    console.error('Error manually activating subscription:', error);
    throw error;
  }
};

// Check if user can create more entries
export const canCreateEntry = (user) => {
  if (!user?.subscription) return false;
  
  const { entriesUsed, entriesLimit, plan, isLifetime } = user.subscription;
  
  // Unlimited plan
  if (entriesLimit === -1) return true;
  
  // For lifetime trial plans, check against total lifetime usage
  if (plan === 'trial' && isLifetime) {
    return entriesUsed < entriesLimit;
  }
  
  // Check if within limit
  return entriesUsed < entriesLimit;
};

// Increment user's entries used
export const incrementEntriesUsed = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const newEntriesUsed = (userData.subscription?.entriesUsed || 0) + 1;
      const entriesRemaining = Math.max(0, (userData.subscription?.entriesLimit || 5) - newEntriesUsed);
      
      await updateDoc(userRef, {
        'subscription.entriesUsed': newEntriesUsed,
        'subscription.entriesRemaining': entriesRemaining,
        updatedAt: serverTimestamp()
      });
      
      return newEntriesUsed;
    }
  } catch (error) {
    console.error('Error incrementing entries used:', error);
    throw error;
  }
};

export default stripePromise;
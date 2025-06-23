// src/services/stripe.js (FIXED VERSION)
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, collection, addDoc, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';
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
    priceId: process.env.REACT_APP_STRIPE_STUDENT_PRICE_ID,
    entriesLimit: 50,
    features: [
      '50 bibliography entries per month',
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
    priceId: process.env.REACT_APP_STRIPE_RESEARCHER_PRICE_ID,
    entriesLimit: 200,
    features: [
      '200 bibliography entries per month',
      'Premium AI analysis',
      'All export formats',
      'Priority support',
      'Advanced customization',
      'Batch processing',
      'Citation style options',
      'Research collaboration tools'
    ]
  },
  institution: {
    id: 'institution',
    name: 'Institution',
    price: 99.99,
    priceId: process.env.REACT_APP_STRIPE_INSTITUTION_PRICE_ID,
    entriesLimit: -1,
    features: [
      'Unlimited bibliography entries',
      'Premium AI analysis',
      'All export formats',
      'Dedicated support',
      'Advanced customization',
      'Batch processing',
      'All citation styles',
      'Team collaboration',
      'Admin dashboard',
      'Usage analytics',
      'Priority API access'
    ]
  }
};

// Create checkout session
export const createCheckoutSession = async (userId, priceId, planId) => {
  try {
    // Create checkout session document in Firestore
    const checkoutSessionRef = await addDoc(
      collection(db, 'users', userId, 'checkout_sessions'),
      {
        price: priceId,
        success_url: `${window.location.origin}/dashboard?success=true`,
        cancel_url: `${window.location.origin}/pricing?canceled=true`,
        metadata: {
          planId: planId
        },
        created: serverTimestamp()
      }
    );
    
    // Wait for checkout session to be created by Cloud Function
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(checkoutSessionRef, (snap) => {
        const data = snap.data();
        
        if (data?.error) {
          unsubscribe();
          reject(new Error(data.error.message));
        }
        
        if (data?.url) {
          unsubscribe();
          // Redirect to Stripe Checkout
          window.location.assign(data.url);
          resolve(data.url);
        }
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Timeout creating checkout session'));
      }, 10000);
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Create customer portal session
export const createCustomerPortalSession = async (userId) => {
  try {
    // Create portal session document in Firestore
    const portalSessionRef = await addDoc(
      collection(db, 'users', userId, 'portal_sessions'),
      {
        return_url: `${window.location.origin}/dashboard`,
        created: serverTimestamp()
      }
    );
    
    // Wait for portal session to be created by Cloud Function
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(portalSessionRef, (snap) => {
        const data = snap.data();
        
        if (data?.error) {
          unsubscribe();
          reject(new Error(data.error.message));
        }
        
        if (data?.url) {
          unsubscribe();
          // Redirect to Customer Portal
          window.location.assign(data.url);
          resolve(data.url);
        }
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Timeout creating portal session'));
      }, 10000);
    });
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
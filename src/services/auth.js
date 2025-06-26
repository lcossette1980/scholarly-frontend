// src/services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Enhanced Google Auth Provider with specific scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Helper function to wait for auth state
const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Helper function to wait for document to be readable
const waitForDocumentReadable = async (uid, maxRetries = 5, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await getUserDocument(uid);
      if (result) {
        console.log(`Document readable after ${i + 1} attempts`);
        return result;
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
    }
    
    if (i < maxRetries - 1) {
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.warn('Document not readable after all retries');
  return null;
};

// Debug function to check Firebase configuration
export const debugFirebaseConfig = () => {
  console.log('Firebase Configuration Debug:', {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    currentDomain: window.location.hostname,
    protocol: window.location.protocol,
    authInstance: !!auth,
    currentUser: auth.currentUser?.email || 'None'
  });
};

// Sign up with email and password
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Wait for auth state to be fully propagated
    console.log('Waiting for auth state to propagate...');
    await waitForAuth();
    
    // Create user document in Firestore
    console.log('Creating user document...');
    const userRef = await createUserDocument(user, { displayName });
    
    // Verify the document was created and is readable
    if (userRef) {
      console.log('User document created successfully for:', user.uid);
      const userData = await waitForDocumentReadable(user.uid);
      if (userData) {
        console.log('User document verified and readable');
      } else {
        console.warn('User document created but not immediately readable - will retry later');
      }
    } else {
      throw new Error('Failed to create user document');
    }
    
    return { user, error: null, emailVerificationSent: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { user: null, error: error.message, emailVerificationSent: false };
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with Google - Try popup first, fallback to redirect
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in...');
    
    // Check sessionStorage availability
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
    } catch (storageError) {
      console.warn('SessionStorage not available, trying popup method');
      return await signInWithGooglePopup();
    }
    
    // Try popup method first (better UX)
    try {
      console.log('Attempting popup sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result && result.user) {
        const user = result.user;
        console.log('Google popup sign-in successful:', user.email);
        
        // Create user document if it doesn't exist
        const userRef = await createUserDocument(user);
        
        if (userRef) {
          const userData = await waitForDocumentReadable(user.uid);
          if (userData) {
            console.log('Google popup user document verified');
          } else {
            console.warn('Google popup user document created but not immediately readable - will retry later');
          }
        } else {
          throw new Error('Failed to create Google popup user document');
        }
        
        return { user, error: null };
      }
      
      return { user: null, error: 'No user returned from popup' };
    } catch (popupError) {
      console.log('Popup failed, trying redirect:', popupError.code);
      
      // If popup fails, fall back to redirect
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/popup-closed-by-user') {
        console.log('Falling back to redirect method...');
        return await signInWithGoogleRedirect();
      }
      
      throw popupError;
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Provide specific error messages for common issues
    let userFriendlyMessage = error.message;
    
    switch (error.code) {
      case 'auth/operation-not-allowed':
        userFriendlyMessage = 'Google sign-in is not enabled. Please contact support.';
        break;
      case 'auth/unauthorized-domain':
        userFriendlyMessage = 'This domain is not authorized for Google sign-in.';
        break;
      case 'auth/network-request-failed':
        userFriendlyMessage = 'Network error. Please check your connection and try again.';
        break;
    }
    
    return { user: null, error: userFriendlyMessage };
  }
};

// Sign in with Google using redirect method
export const signInWithGoogleRedirect = async () => {
  try {
    console.log('Starting Google sign-in with redirect...');
    
    // Check if we're in a secure context
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      throw new Error('Google Sign-In requires HTTPS in production');
    }
    
    await signInWithRedirect(auth, googleProvider);
    
    console.log('Redirect initiated - user will be redirected to Google');
    return { user: null, error: null }; // User will be available after redirect
  } catch (error) {
    console.error('Google redirect sign-in error:', error);
    return { user: null, error: error.message };
  }
};

// Alternative: Try popup-based Google sign-in as fallback
export const signInWithGooglePopup = async () => {
  try {
    console.log('Attempting Google sign-in with popup...');
    
    const result = await signInWithPopup(auth, googleProvider);
    
    if (result && result.user) {
      const user = result.user;
      console.log('Google popup sign-in successful:', user.email);
      
      // Create user document if it doesn't exist
      const userRef = await createUserDocument(user);
      
      if (userRef) {
        const userData = await waitForDocumentReadable(user.uid);
        if (userData) {
          console.log('Google popup user document verified');
        }
      }
      
      return { user, error: null };
    }
    
    return { user: null, error: 'No user returned from popup' };
  } catch (error) {
    console.error('Google popup sign-in error:', error);
    
    if (error.code === 'auth/popup-blocked') {
      return { user: null, error: 'Popup was blocked. Please allow popups and try again.' };
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: 'Sign-in was cancelled.' };
    }
    
    return { user: null, error: error.message };
  }
};

// Enhanced redirect result handler with better logging
export const handleRedirectResult = async () => {
  try {
    console.log('Checking for redirect result...');
    console.log('Current URL:', window.location.href);
    console.log('Current auth state:', auth.currentUser?.email || 'No user');
    
    const result = await getRedirectResult(auth);
    console.log('Redirect result:', result);
    
    if (result && result.user) {
      const user = result.user;
      console.log('Google sign-in successful for user:', user.email);
      console.log('User details:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      });
      
      // Wait for auth state to be fully propagated
      console.log('Google sign-in successful, waiting for auth state...');
      await waitForAuth();
      
      // Create user document if it doesn't exist
      console.log('Creating/verifying user document for Google sign-in...');
      const userRef = await createUserDocument(user);
      
      // Verify the document was created and is readable
      if (userRef) {
        console.log('User document created/verified for Google sign-in:', user.uid);
        const userData = await waitForDocumentReadable(user.uid);
        if (userData) {
          console.log('Google user document verified and readable');
        } else {
          console.warn('Google user document created but not immediately readable - will retry later');
        }
      } else {
        throw new Error('Failed to create Google user document');
      }
      
      return { user, error: null };
    } else {
      console.log('No redirect result found');
      return { user: null, error: null };
    }
  } catch (error) {
    console.error('Google redirect result error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific redirect errors
    if (error.code === 'auth/unauthorized-domain') {
      console.error('Domain not authorized:', window.location.hostname);
      console.error('Make sure this domain is added to Firebase Console → Authentication → Settings → Authorized domains');
    }
    
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    throw error; // Let the calling component handle specific errors
  }
};

// Send email verification
export const sendEmailVerificationToUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    if (user.emailVerified) {
      return { error: 'Email is already verified' };
    }
    
    await sendEmailVerification(user);
    return { error: null };
  } catch (error) {
    throw error;
  }
};

// Check if email is verified
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

// Create user document in Firestore
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = serverTimestamp();
      
      console.log('Creating new user document for:', user.uid);
      
      await setDoc(userRef, {
        displayName: displayName || additionalData.displayName || '',
        email,
        photoURL: photoURL || '',
        createdAt,
        subscription: {
          plan: 'trial',
          status: 'active',
          entriesUsed: 0,
          entriesLimit: 5,
          entriesRemaining: 5,
          isLifetime: true,
          periodEnd: null
        },
        preferences: {
          researchFocus: '',
          notificationsEnabled: true,
          theme: 'light'
        },
        ...additionalData
      });
      
      console.log('User document created successfully');
    } else {
      console.log('User document already exists for:', user.uid);
    }
    
    return userRef;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error; // Re-throw so calling code knows it failed
  }
};

// Get user document
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  
  try {
    // Debug: Check authentication state
    const currentUser = auth.currentUser;
    console.log('getUserDocument - Current user:', currentUser?.uid);
    console.log('getUserDocument - Requested UID:', uid);
    console.log('getUserDocument - Auth state:', !!currentUser);
    
    if (!currentUser) {
      console.warn('No authenticated user when trying to get document');
      return null;
    }
    
    if (currentUser.uid !== uid) {
      console.warn('Requested UID does not match current user');
      return null;
    }
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log('User document retrieved successfully');
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log('User document does not exist');
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    console.error('Auth state during error:', !!auth.currentUser);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error; // Re-throw for better error handling upstream
  }
};

// Get user document with retry logic
export const getUserDocumentWithRetry = async (uid, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await getUserDocument(uid);
      if (result) return result;
      
      if (i < maxRetries - 1) {
        console.log(`getUserDocument attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`getUserDocument attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries - 1) {
        throw error; // Re-throw on final attempt
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return null;
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Debug: Check user document structure
export const debugUserDocument = async (uid) => {
  if (!uid) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log('User document exists:', {
        hasSubscription: !!userData.subscription,
        subscription: userData.subscription,
        fullDocument: userData
      });
      return userData;
    } else {
      console.log('User document does not exist for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error debugging user document:', error);
    return null;
  }
};

// Fix user document with missing subscription data
export const fixUserSubscription = async (uid) => {
  if (!uid) return null;
  
  try {
    // Ensure user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== uid) {
      throw new Error('User not authenticated or UID mismatch');
    }
    
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // Check if subscription is missing or incomplete
      if (!userData.subscription || 
          userData.subscription.entriesLimit === undefined || 
          userData.subscription.entriesUsed === undefined) {
        
        console.log('Fixing user subscription data...');
        
        const fixedSubscription = {
          plan: 'trial',
          status: 'active',
          entriesUsed: userData.subscription?.entriesUsed || 0,
          entriesLimit: 5,
          entriesRemaining: Math.max(0, 5 - (userData.subscription?.entriesUsed || 0)),
          isLifetime: true,
          periodEnd: null,
          ...userData.subscription // Keep any existing data
        };
        
        await setDoc(userRef, {
          ...userData,
          subscription: fixedSubscription,
          updatedAt: serverTimestamp()
        });
        
        console.log('User subscription fixed:', fixedSubscription);
        return fixedSubscription;
      } else {
        console.log('User subscription is already correct:', userData.subscription);
        return userData.subscription;
      }
    } else {
      console.log('User document does not exist, creating new one...');
      const user = auth.currentUser;
      if (user) {
        await createUserDocument(user);
        return { plan: 'trial', status: 'active', entriesUsed: 0, entriesLimit: 5, entriesRemaining: 5, isLifetime: true, periodEnd: null };
      }
    }
  } catch (error) {
    console.error('Error fixing user subscription:', error);
    throw error;
  }
};
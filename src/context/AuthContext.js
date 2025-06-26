// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getUserDocument, handleRedirectResult } from '../services/auth';
import { setUserContext, clearUserContext, logError } from '../services/errorMonitoring';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDocument, setUserDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserDocument = async () => {
    if (currentUser) {
      let userData = await getUserDocument(currentUser.uid);
      
      // If user document doesn't exist yet (race condition), retry up to 5 times with exponential backoff
      for (let retries = 0; !userData && retries < 5; retries++) {
        const delay = Math.min(1000 * Math.pow(2, retries), 5000); // Exponential backoff, max 5s
        console.log(`User document not found, retrying in ${delay}ms... (attempt ${retries + 1}/5)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        userData = await getUserDocument(currentUser.uid);
      }
      
      // If still no user document after retries, try to fix/create it
      if (!userData && currentUser) {
        console.log('User document still not found, attempting to fix...');
        try {
          const { fixUserSubscription } = await import('../services/auth');
          await fixUserSubscription(currentUser.uid);
          userData = await getUserDocument(currentUser.uid);
        } catch (error) {
          console.error('Failed to fix user subscription:', error);
        }
      }
      
      setUserDocument(userData);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Handle redirect result first and await completion
        console.log('Checking for redirect result...');
        const redirectResult = await handleRedirectResult();
        
        if (redirectResult && redirectResult.user) {
          console.log('Redirect result processed successfully:', redirectResult.user.email);
          // Set user immediately to prevent redirect loops
          setCurrentUser(redirectResult.user);
          const userData = await getUserDocument(redirectResult.user.uid);
          setUserDocument(userData);
          setLoading(false);
          
          // Navigate to dashboard after successful Google auth
          if (window.location.pathname === '/signup' || window.location.pathname === '/login') {
            // Use history API without forcing reload
            window.history.replaceState(null, '', '/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
      
      // Set up auth state listener after redirect handling
      const unsubscribe = onAuthStateChange(async (user) => {
        console.log('Auth state changed:', user?.email || 'No user');
        setCurrentUser(user);
        
        if (user) {
          // Get user document from Firestore
          let userData = await getUserDocument(user.uid);
          
          // If user document doesn't exist, create it automatically
          if (!userData) {
            console.log('User document not found, creating it...');
            try {
              const { createUserDocument } = await import('../services/auth');
              await createUserDocument(user);
              userData = await getUserDocument(user.uid);
              
              // If still not found after creation, try fixing it
              if (!userData) {
                const { fixUserSubscription } = await import('../services/auth');
                await fixUserSubscription(user.uid);
                userData = await getUserDocument(user.uid);
              }
            } catch (error) {
              console.error('Failed to create/fix user document:', error);
            }
          }
          
          setUserDocument(userData);
        } else {
          setUserDocument(null);
        }
        
        setLoading(false);
      });

      return unsubscribe;
    };

    let unsubscribe;
    initializeAuth().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    userDocument,
    loading,
    refreshUserDocument
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
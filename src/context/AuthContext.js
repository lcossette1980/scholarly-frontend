// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getUserDocument, handleRedirectResult } from '../services/auth';

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
      
      // If user document doesn't exist yet (race condition), retry up to 3 times
      for (let retries = 0; !userData && retries < 3; retries++) {
        await new Promise(resolve => setTimeout(resolve, 300 * (retries + 1)));
        userData = await getUserDocument(currentUser.uid);
      }
      
      setUserDocument(userData);
    }
  };

  useEffect(() => {
    // Handle redirect result first
    handleRedirectResult();
    
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user document from Firestore
        const userData = await getUserDocument(user.uid);
        setUserDocument(userData);
      } else {
        setUserDocument(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
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
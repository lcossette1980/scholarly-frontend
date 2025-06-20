// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      showSuccess = false, 
      showError = true, 
      successMessage = 'Operation completed successfully',
      loadingMessage = null 
    } = options;

    setLoading(true);
    setError(null);
    
    let toastId = null;
    if (loadingMessage) {
      toastId = toast.loading(loadingMessage);
    }

    try {
      const result = await apiCall();
      
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      if (showSuccess) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showError) {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};
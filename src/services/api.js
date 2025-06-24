// src/services/api.js
import axios from 'axios';
import { auth } from './firebase';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error handling for better user experience
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // You could dispatch a logout action here
    } else if (error.response?.status === 502 || error.response?.status === 503) {
      // Backend is down or unavailable
      console.error('Backend service unavailable:', error.response?.data?.message || error.message);
      error.userMessage = 'Our service is temporarily unavailable. Please try again in a few minutes.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      // Network error or no response
      console.error('Network error:', error.message);
      error.userMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error:', error.response?.status, error.response?.data);
      error.userMessage = 'A server error occurred. Please try again later.';
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      // Client errors
      console.error('Client error:', error.response?.status, error.response?.data);
      error.userMessage = error.response?.data?.message || 'There was an issue with your request.';
    }
    
    return Promise.reject(error);
  }
);

// Bibliography Entry API calls
export const bibliographyAPI = {
  // Upload file and start processing
  uploadDocument: async (file, researchFocus) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('research_focus', researchFocus);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for file upload
    });
    
    return response.data;
  },

  // Get processing status
  getProcessingStatus: async (taskId) => {
    const response = await api.get(`/status/${taskId}`);
    return response.data;
  },

  // Get final result
  getResult: async (taskId) => {
    const response = await api.get(`/result/${taskId}`);
    return response.data;
  },

  // Clean up task
  cleanupTask: async (taskId) => {
    const response = await api.delete(`/task/${taskId}`);
    return response.data;
  },

  // Get user's bibliography entries
  getUserEntries: async () => {
    const response = await api.get('/entries');
    return response.data;
  },

  // Get specific entry
  getEntry: async (entryId) => {
    const response = await api.get(`/entries/${entryId}`);
    return response.data;
  },

  // Update entry
  updateEntry: async (entryId, data) => {
    const response = await api.patch(`/entries/${entryId}`, data);
    return response.data;
  },

  // Delete entry
  deleteEntry: async (entryId) => {
    const response = await api.delete(`/entries/${entryId}`);
    return response.data;
  },

  // Export entry to Word
  exportEntry: async (entryId, format = 'docx') => {
    const response = await api.get(`/entries/${entryId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};

// Health check with enhanced error reporting
export const healthCheck = async () => {
  try {
    const response = await api.get('/health', { timeout: 10000 }); // 10 second timeout for health check
    return { 
      status: 'healthy', 
      message: 'Service is operational',
      data: response.data 
    };
  } catch (error) {
    console.error('Health check failed:', error);
    
    const healthStatus = {
      status: 'error',
      message: error.userMessage || error.message,
      details: {
        code: error.code,
        statusCode: error.response?.status,
        timestamp: new Date().toISOString()
      }
    };
    
    // Specific health check responses
    if (error.response?.status === 502) {
      healthStatus.message = 'Backend service is currently down for maintenance';
      healthStatus.details.issue = 'Service deployment or restart in progress';
    } else if (error.code === 'ERR_NETWORK') {
      healthStatus.message = 'Cannot reach backend servers';
      healthStatus.details.issue = 'Network connectivity or DNS resolution problem';
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      healthStatus.message = 'Backend service is responding slowly';
      healthStatus.details.issue = 'Service overload or performance issues';
    }
    
    return healthStatus;
  }
};

export default api;

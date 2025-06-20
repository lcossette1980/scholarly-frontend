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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // You could dispatch a logout action here
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

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};

export default api;

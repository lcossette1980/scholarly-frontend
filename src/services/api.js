// src/services/api.js
import axios from 'axios';
import { auth } from './firebase';
import toast from 'react-hot-toast';

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
    // Enhanced error handling with toast notifications
    if (error.code === 'ERR_NETWORK' || !error.response) {
      // Network error or no response — check this first before status codes
      console.error('Network error:', error.message);
      error.userMessage = 'Unable to connect. Please check your internet connection.';
      toast.error('Unable to connect. Please check your internet connection.');
    } else if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      error.userMessage = 'Your session has expired. Please sign in again.';
      toast.error('Your session has expired. Please sign in again.');
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } else if (error.response?.status === 403) {
      console.error('Forbidden:', error.response?.data);
      error.userMessage = "You don't have permission for this action.";
      toast.error("You don't have permission for this action.");
    } else if (error.response?.status === 429) {
      console.error('Rate limited:', error.response?.data);
      error.userMessage = 'Too many requests. Please wait a moment and try again.';
      toast.error('Too many requests. Please wait a moment and try again.');
    } else if (error.response?.status === 502 || error.response?.status === 503) {
      console.error('Backend service unavailable:', error.response?.data?.message || error.message);
      error.userMessage = 'Our service is temporarily unavailable. Please try again in a few minutes.';
      toast.error('Our service is temporarily unavailable. Please try again in a few minutes.');
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.status, error.response?.data);
      error.userMessage = 'Something went wrong on our end. Please try again.';
      toast.error('Something went wrong on our end. Please try again.');
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      console.error('Client error:', error.response?.status, error.response?.data);
      error.userMessage = error.response?.data?.message || error.response?.data?.detail || 'There was an issue with your request.';
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

  // Upload URL for processing
  uploadURL: async (url, researchFocus) => {
    const response = await api.post('/upload-url', { url, research_focus: researchFocus, user_id: 'from_token' });
    return response.data;
  },

  // Look up DOI
  lookupDOI: async (doi, researchFocus) => {
    const response = await api.post('/lookup-doi', { doi, research_focus: researchFocus, user_id: 'from_token' });
    return response.data;
  },

  // Import RSS feed
  importRSSFeed: async (feedUrl) => {
    const response = await api.post('/import-rss-feed', { feed_url: feedUrl, user_id: 'from_token' });
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

// Analysis & Topic Generation API calls
export const analysisAPI = {
  // Generate topic suggestions from selected entries
  generateTopics: async (entryIds, userId, options = {}) => {
    const {
      outputType = 'article',
      numTopics = 5,
      focusArea = null
    } = options;

    const response = await api.post('/analyze/generate-topics', {
      entry_ids: entryIds,
      user_id: userId,
      output_type: outputType,
      num_topics: numTopics,
      focus_area: focusArea
    }, {
      timeout: 90000 // 90 seconds for analysis
    });

    return response.data;
  },

  // Generate detailed outline for a topic
  generateOutline: async (entryIds, userId, topicTitle, depth = 'detailed') => {
    const response = await api.post('/analyze/generate-outline', {
      entry_ids: entryIds,
      user_id: userId,
      topic_title: topicTitle,
      depth: depth
    }, {
      timeout: 90000 // 90 seconds for outline generation
    });

    return response.data;
  }
};

// Content Generation API calls
export const contentGenerationAPI = {
  // Create a new content generation job
  createJob: async (userId, sourceEntryIds, outline, settings, tier = 'standard') => {
    const response = await api.post('/content/generate', {
      user_id: userId,
      source_entry_ids: sourceEntryIds,
      outline: outline,
      settings: settings,
      tier: tier,
      citation_style: settings.citation_style || 'none'
    }, {
      timeout: 60000 // 60 seconds for job creation
    });

    return response.data;
  },

  // Get status of a content generation job
  getJobStatus: async (jobId) => {
    const response = await api.get(`/content/status/${jobId}`);
    return response.data;
  },

  // Get user's content generation history
  getHistory: async (limit = 20) => {
    const response = await api.get('/content/history', {
      params: { limit }
    });
    return response.data;
  }
};

// Research Topic Feeds API calls
export const feedsAPI = {
  subscribe: async (topic, sources, frequency) => {
    const response = await api.post('/feeds/subscribe', { topic, sources, frequency });
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await api.get('/feeds/subscriptions');
    return response.data;
  },

  deleteSubscription: async (id) => {
    const response = await api.delete(`/feeds/subscriptions/${id}`);
    return response.data;
  },

  getItems: async () => {
    const response = await api.get('/feeds/items');
    return response.data;
  },

  importItem: async (itemId) => {
    const response = await api.post(`/feeds/items/${itemId}/import`);
    return response.data;
  },

  dismissItem: async (itemId) => {
    const response = await api.post(`/feeds/items/${itemId}/dismiss`);
    return response.data;
  },

  checkFeeds: async () => {
    const response = await api.post('/feeds/check');
    return response.data;
  },
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

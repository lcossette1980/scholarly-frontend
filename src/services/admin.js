// Admin API service
import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with Firebase token auth (matches backend verify_admin)
const createAdminRequest = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  const token = await user.getIdToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });
};

export const adminAPI = {
  // Get admin dashboard stats
  getStats: async () => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getUsers: async (limit = 50) => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/users', {
      params: { limit }
    });
    return response.data;
  },

  // Get support messages
  getSupportMessages: async (unreadOnly = false, limit = 50) => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/support-messages', {
      params: { unread_only: unreadOnly, limit }
    });
    return response.data;
  },

  // Mark message as read
  markMessageRead: async (messageId) => {
    const api = await createAdminRequest();
    const response = await api.post(`/admin/support-messages/${messageId}/mark-read`);
    return response.data;
  },

  // Get all entries (admin only)
  getAllEntries: async (limit = 50, offset = 0, search = null) => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/entries', {
      params: { limit, offset, search }
    });
    return response.data;
  },

  // Get entry details (admin only)
  getEntryDetails: async (entryId) => {
    const api = await createAdminRequest();
    const response = await api.get(`/admin/entries/${entryId}`);
    return response.data;
  },

  // Run functional health check across all critical services
  runHealthCheck: async () => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/health-check');
    return response.data;
  }
};

// Admin auth helper
export const isAdmin = (user) => {
  return user?.email === 'loren.cossette@gmail.com';
};

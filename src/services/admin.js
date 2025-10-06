// Admin API service
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with admin headers
const createAdminRequest = (userEmail) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'X-User-Email': userEmail,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });
};

export const adminAPI = {
  // Get admin dashboard stats
  getStats: async (userEmail) => {
    const api = createAdminRequest(userEmail);
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getUsers: async (userEmail, limit = 50) => {
    const api = createAdminRequest(userEmail);
    const response = await api.get('/admin/users', {
      params: { limit }
    });
    return response.data;
  },

  // Get support messages
  getSupportMessages: async (userEmail, unreadOnly = false, limit = 50) => {
    const api = createAdminRequest(userEmail);
    const response = await api.get('/admin/support-messages', {
      params: { unread_only: unreadOnly, limit }
    });
    return response.data;
  },

  // Mark message as read
  markMessageRead: async (userEmail, messageId) => {
    const api = createAdminRequest(userEmail);
    const response = await api.post(`/admin/support-messages/${messageId}/mark-read`);
    return response.data;
  }
};

// Admin auth helper
export const isAdmin = (user) => {
  return user?.email === 'loren.cossette@gmail.com';
};

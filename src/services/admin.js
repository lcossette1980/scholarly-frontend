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
  },

  // Run the full end-to-end test suite (takes 3-5 min, costs ~$0.50)
  runE2ETests: async () => {
    const api = await createAdminRequest();
    // E2E run can take several minutes — override default timeout
    const response = await api.post('/admin/run-e2e-tests', null, { timeout: 360000 });
    return response.data;
  },

  // Fetch history of the last 20 e2e test runs
  getE2ETestHistory: async () => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/e2e-test-history');
    return response.data;
  },

  // Per-user activity report with funnel analysis
  getUserActivity: async () => {
    const api = await createAdminRequest();
    const response = await api.get('/admin/user-activity');
    return response.data;
  },

  // Resanitize all bibliography_entries (clean up malformed citations from before the upstream fix)
  // Pass {apply: true} to actually write changes. Default is dry run.
  resanitizeBibliography: async ({ apply = false, userId = null, limit = null } = {}) => {
    const api = await createAdminRequest();
    const params = { apply };
    if (userId) params.user_id = userId;
    if (limit) params.limit = limit;
    // Migration on a large library can take a while
    const response = await api.post('/admin/migrate/resanitize-bibliography', null, { params, timeout: 300000 });
    return response.data;
  }
};

// Admin auth helper
export const isAdmin = (user) => {
  return user?.email === 'loren.cossette@gmail.com';
};

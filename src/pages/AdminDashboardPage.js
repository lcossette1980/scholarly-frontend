import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Search,
  Eye,
  BookOpen,
  XCircle,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Beaker,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, isAdmin } from '../services/admin';
import toast from 'react-hot-toast';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FadeIn, StaggerChildren, StaggerItem, AnimatedCounter } from '../components/motion';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [healthResults, setHealthResults] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [e2eRunning, setE2eRunning] = useState(false);
  const [e2eHistory, setE2eHistory] = useState([]);
  const [e2eHistoryLoading, setE2eHistoryLoading] = useState(false);
  const [e2eExpandedRunId, setE2eExpandedRunId] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [voiceRunning, setVoiceRunning] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [voiceHistoryLoading, setVoiceHistoryLoading] = useState(false);
  const [voiceExpandedDocType, setVoiceExpandedDocType] = useState(null);
  const [voiceScope, setVoiceScope] = useState('voices');

  // Load user activity (funnel analysis)
  const loadActivity = async () => {
    setActivityLoading(true);
    try {
      const data = await adminAPI.getUserActivity();
      setActivityData(data);
    } catch (error) {
      console.error('Activity load error:', error);
      toast.error('Failed to load user activity');
    } finally {
      setActivityLoading(false);
    }
  };

  const loadVoiceHistory = async () => {
    setVoiceHistoryLoading(true);
    try {
      const data = await adminAPI.getVoiceComplianceHistory();
      setVoiceHistory(data.runs || []);
    } catch (e) {
      console.error('Voice history error:', e);
    } finally {
      setVoiceHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'voice' && voiceHistory.length === 0 && !voiceHistoryLoading) {
      loadVoiceHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const runVoiceCompliance = async () => {
    const costEstimate = voiceScope === 'all' ? '~$50' : voiceScope === 'voices' ? '~$15' : '~$3';
    const durationEstimate = voiceScope === 'all' ? '~10 min' : voiceScope === 'voices' ? '~3 min' : '~30 sec';
    if (!window.confirm(`Run voice compliance with scope='${voiceScope}'?\n\nThis will generate test documents and run assertions.\nEstimated cost: ${costEstimate}\nEstimated duration: ${durationEstimate}`)) {
      return;
    }
    setVoiceRunning(true);
    setVoiceResult(null);
    const loadingId = toast.loading(`Running voice compliance (scope: ${voiceScope})…`);
    try {
      const data = await adminAPI.runVoiceCompliance({ scope: voiceScope });
      setVoiceResult(data);
      toast.dismiss(loadingId);
      const { passed, failed, errors, total } = data.summary || {};
      if (failed === 0 && errors === 0) {
        toast.success(`All ${total} voice tests passed`);
      } else {
        toast.error(`${failed} failed, ${errors} errored (${passed}/${total} passed)`);
      }
      await loadVoiceHistory();
    } catch (e) {
      console.error('Voice compliance error:', e);
      toast.dismiss(loadingId);
      toast.error(e?.response?.data?.detail || 'Voice compliance run failed');
    } finally {
      setVoiceRunning(false);
    }
  };

  const runResanitizeMigration = async (apply = false) => {
    if (apply && !window.confirm('Apply changes to ALL bibliography entries? This will rewrite source_info and citation fields for any entry the new sanitizer can improve. (You should run a dry run first.)')) {
      return;
    }
    setMigrationRunning(true);
    setMigrationResult(null);
    const loadingId = toast.loading(apply ? 'Applying migration to all entries…' : 'Running dry run…');
    try {
      const data = await adminAPI.resanitizeBibliography({ apply });
      setMigrationResult(data);
      toast.dismiss(loadingId);
      const verb = apply ? 'Updated' : 'Would update';
      toast.success(`${verb} ${data.stats.changed} of ${data.stats.scanned} entries`);
    } catch (error) {
      console.error('Migration error:', error);
      toast.dismiss(loadingId);
      toast.error(error?.response?.data?.detail || 'Migration failed');
    } finally {
      setMigrationRunning(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'activity' && !activityData && !activityLoading) {
      loadActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Fetch e2e test history
  const loadE2EHistory = async () => {
    setE2eHistoryLoading(true);
    try {
      const data = await adminAPI.getE2ETestHistory();
      setE2eHistory(data.runs || []);
    } catch (error) {
      console.error('E2E history error:', error);
      toast.error('Failed to load test history');
    } finally {
      setE2eHistoryLoading(false);
    }
  };

  // Trigger an e2e test run (long running — 3-5 min)
  const runE2ETests = async () => {
    if (e2eRunning) return;
    if (!window.confirm('Running tests takes 3-5 minutes and costs approximately $0.50 in API calls. Continue?')) {
      return;
    }
    setE2eRunning(true);
    const startToast = toast.loading('Running e2e tests (this takes a few minutes)...');
    try {
      const result = await adminAPI.runE2ETests();
      toast.dismiss(startToast);
      const status = result.overall_status || 'unknown';
      if (status === 'pass') {
        toast.success('All e2e tests passed');
      } else if (status === 'partial') {
        toast.error('Some e2e tests failed');
      } else {
        toast.error(`E2E tests: ${status}`);
      }
      // Refresh history to include the new run
      await loadE2EHistory();
      // Auto-expand the run that just finished
      if (result.run_id) {
        setE2eExpandedRunId(result.run_id);
      }
    } catch (error) {
      toast.dismiss(startToast);
      console.error('E2E run error:', error);
      toast.error(`E2E run failed: ${error.message || 'unknown error'}`);
      // Try to refresh history anyway — the run doc may have been written
      try { await loadE2EHistory(); } catch (e) { /* ignore */ }
    } finally {
      setE2eRunning(false);
    }
  };

  // Auto-load history when the tab opens
  useEffect(() => {
    if (activeTab === 'e2e' && e2eHistory.length === 0 && !e2eHistoryLoading) {
      loadE2EHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Run health check
  const runHealthCheck = async () => {
    setHealthLoading(true);
    setHealthResults(null);
    try {
      const data = await adminAPI.runHealthCheck();
      setHealthResults(data);
      if (data.overall_status === 'healthy') {
        toast.success('All systems healthy');
      } else {
        toast.error(`System status: ${data.overall_status}`);
      }
    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Failed to run health check');
      setHealthResults({
        overall_status: 'error',
        checks: {},
        error: error.message
      });
    } finally {
      setHealthLoading(false);
    }
  };

  // Auto-run health check when tab opens
  useEffect(() => {
    if (activeTab === 'health' && !healthResults && !healthLoading) {
      runHealthCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Check admin access
  useEffect(() => {
    if (!currentUser || !isAdmin(currentUser)) {
      toast.error('Admin access required');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser || !isAdmin(currentUser)) return;

      try {
        const data = await adminAPI.getStats();
        console.log('Admin stats received:', data);

        // Ensure stats has the expected structure
        if (data && typeof data === 'object') {
          setStats(data);
        } else {
          console.error('Invalid stats data structure:', data);
          setStats(null);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load admin stats');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || !isAdmin(currentUser)) return;

      try {
        const data = await adminAPI.getUsers(50);
        console.log('Users data received:', data);

        // Ensure data has the expected structure
        if (data && typeof data === 'object' && Array.isArray(data.users)) {
          setUsers(data.users);
        } else if (Array.isArray(data)) {
          // In case the API returns the array directly
          setUsers(data);
        } else {
          console.error('Invalid users data structure:', data);
          setUsers([]);
          toast.error('Failed to load users - invalid data format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        toast.error('Failed to load users');
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [currentUser, activeTab]);

  // Real-time support messages listener
  useEffect(() => {
    if (!currentUser || !isAdmin(currentUser)) return;

    const messagesRef = collection(db, 'support_messages');
    const q = query(
      messagesRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({ id: doc.id, ...data });
        if (!data.read) unread++;
      });

      setMessages(msgs);
      setUnreadCount(unread);
    }, (error) => {
      console.error('Error listening to messages:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch all entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser || !isAdmin(currentUser)) return;
      if (activeTab !== 'entries') return;

      setEntriesLoading(true);
      try {
        const data = await adminAPI.getAllEntries(100, 0, searchQuery || null);
        setEntries(data.entries || []);
      } catch (error) {
        console.error('Error fetching entries:', error);
        toast.error('Failed to load entries');
      } finally {
        setEntriesLoading(false);
      }
    };

    fetchEntries();
  }, [currentUser, activeTab, searchQuery]);

  const handleMarkRead = async (messageId) => {
    try {
      await adminAPI.markMessageRead(messageId);
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const handleViewEntry = async (entryId) => {
    try {
      const data = await adminAPI.getEntryDetails(entryId);
      setSelectedEntry(data);
    } catch (error) {
      console.error('Error fetching entry details:', error);
      toast.error('Failed to load entry details');
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'chestnut' }) => (
    <div className="card card-floating">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-secondary-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-secondary-900 mb-1">
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </p>
          {subtitle && (
            <p className="text-sm text-secondary-600">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}/10 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-secondary-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-mesh">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div>
                <h1 className="text-4xl font-bold text-secondary-900">
                  Admin Dashboard
                </h1>
                <p className="text-secondary-700">
                  System overview and user management
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span className="font-semibold">{unreadCount} unread messages</span>
              </motion.div>
            )}
          </div>
        </FadeIn>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-secondary-300/30">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: `Users (${stats?.users?.total || 0})` },
            { id: 'activity', label: 'User Funnel' },
            { id: 'messages', label: 'Support Messages', badge: unreadCount },
            { id: 'entries', label: 'All Entries' },
            { id: 'health', label: 'System Health' },
            { id: 'e2e', label: 'E2E Tests' },
            { id: 'voice', label: 'Voice Compliance' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && stats && stats.users && stats.revenue && stats.entries && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Grid */}
              <StaggerChildren>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StaggerItem>
                    <StatCard
                      icon={Users}
                      title="Total Users"
                      value={stats.users?.total || 0}
                      subtitle={`${stats.users?.active || 0} active (${stats.users?.active_percent || 0}%)`}
                      color="primary"
                    />
                  </StaggerItem>
                  <StaggerItem>
                    <StatCard
                      icon={DollarSign}
                      title="Monthly Revenue"
                      value={`$${stats.revenue?.mrr || 0}`}
                      subtitle={`${stats.revenue?.total_subscriptions || 0} subscriptions`}
                      color="green-600"
                    />
                  </StaggerItem>
                  <StaggerItem>
                    <StatCard
                      icon={FileText}
                      title="Total Entries"
                      value={stats.entries?.total || 0}
                      subtitle={`${stats.entries?.last_30_days || 0} last 30 days`}
                      color="primary-600"
                    />
                  </StaggerItem>
                  <StaggerItem>
                    <StatCard
                      icon={Mail}
                      title="Support Messages"
                      value={messages.length}
                      subtitle={`${unreadCount} unread`}
                      color="orange-600"
                    />
                  </StaggerItem>
                </div>
              </StaggerChildren>

              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <FadeIn>
                  <div className="card card-floating">
                    <h2 className="text-xl font-bold text-secondary-900 mb-4">
                      Revenue by Plan
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-700">Plus Plan</span>
                        <span className="text-xl font-bold text-secondary-900">${stats.revenue?.by_plan?.student || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-700">Pro Plan</span>
                        <span className="text-xl font-bold text-secondary-900">${stats.revenue?.by_plan?.researcher || 0}</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                {/* Recent Messages Preview */}
                <FadeIn delay={0.1}>
                  <div className="card card-floating">
                    <h2 className="text-xl font-bold text-secondary-900 mb-4">
                      Recent Messages
                    </h2>
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((msg) => (
                        <div key={msg.id} className="flex items-start space-x-3 pb-3 border-b border-secondary-300/20 last:border-0">
                          <div className={`w-2 h-2 rounded-full mt-2 ${msg.read ? 'bg-gray-400' : 'bg-red-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-secondary-900 truncate">{msg.subject}</p>
                            <p className="text-xs text-secondary-600">{msg.userEmail}</p>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <p className="text-sm text-secondary-600">No messages yet</p>
                      )}
                    </div>
                  </div>
                </FadeIn>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="card card-floating">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">
                  All Users
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-300/30">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Display Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Entries Used</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary-900">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-secondary-300/10 hover:bg-pearl/30"
                        >
                          <td className="py-3 px-4 text-sm text-secondary-900">{user.email}</td>
                          <td className="py-3 px-4 text-sm text-secondary-900">{user.displayName || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.subscription?.plan === 'researcher' ? 'bg-primary-100 text-primary-800' :
                              user.subscription?.plan === 'student' ? 'bg-primary-50 text-primary-700' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.subscription?.plan || 'trial'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-secondary-900">
                            {user.subscription?.entriesUsed || 0} / {user.subscription?.entriesLimit === -1 ? '∞' : user.subscription?.entriesLimit || 5}
                          </td>
                          <td className="py-3 px-4 text-sm text-secondary-600">
                            {user.createdAt ? (() => {
                              try {
                                // Handle Firestore Timestamp, Date object, or ISO string
                                if (user.createdAt.toDate && typeof user.createdAt.toDate === 'function') {
                                  return new Date(user.createdAt.toDate()).toLocaleDateString();
                                } else if (user.createdAt.seconds) {
                                  // Firestore Timestamp as plain object
                                  return new Date(user.createdAt.seconds * 1000).toLocaleDateString();
                                } else {
                                  // Already a date string or Date object
                                  return new Date(user.createdAt).toLocaleDateString();
                                }
                              } catch (e) {
                                return 'N/A';
                              }
                            })() : 'N/A'}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* User Funnel / Activity Tab */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-secondary-900 mb-1">User Engagement Funnel</h2>
                  <p className="text-sm text-secondary-600">Where users drop off in your conversion funnel</p>
                </div>
                <button
                  onClick={loadActivity}
                  disabled={activityLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-300 transition-colors text-sm font-medium"
                >
                  <RefreshCw className={`w-4 h-4 ${activityLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {activityLoading && !activityData && (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-sm text-secondary-600">Analyzing user activity...</p>
                </div>
              )}

              {activityData && (
                <>
                  {/* Funnel breakdown */}
                  <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-card p-6 mb-6">
                    <h3 className="font-bold text-secondary-900 mb-4">Funnel Stages</h3>
                    <div className="space-y-3">
                      {[
                        { id: '1_signed_up_no_onboarding', label: 'Signed up, never onboarded', color: 'bg-red-100 text-red-800' },
                        { id: '2_onboarded_no_entry', label: 'Onboarded, never imported a source', color: 'bg-amber-100 text-amber-800' },
                        { id: '3_imported_no_generation', label: 'Imported sources, never generated', color: 'bg-amber-100 text-amber-800' },
                        { id: '4_tried_generation_failed', label: 'Tried generation, all failed', color: 'bg-red-100 text-red-800' },
                        { id: '5_one_successful_generation', label: 'One successful generation', color: 'bg-primary/20 text-primary' },
                        { id: '6_active_user', label: 'Active user (multiple successes)', color: 'bg-green-100 text-green-800' },
                      ].map(stage => {
                        const count = activityData.funnel?.[stage.id] || 0;
                        const pct = activityData.total > 0 ? Math.round((count / activityData.total) * 100) : 0;
                        return (
                          <button
                            key={stage.id}
                            onClick={() => setActivityFilter(stage.id === activityFilter ? 'all' : stage.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              activityFilter === stage.id ? 'border-primary bg-primary/5' : 'border-[#e5e7eb] hover:bg-secondary-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1 text-left">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${stage.color}`}>{count}</span>
                              <span className="text-sm text-secondary-800">{stage.label}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="w-24 h-2 bg-secondary-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-secondary-500 w-10 text-right">{pct}%</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {activityFilter !== 'all' && (
                      <button
                        onClick={() => setActivityFilter('all')}
                        className="mt-3 text-xs text-primary hover:underline"
                      >
                        Show all users
                      </button>
                    )}
                  </div>

                  {/* User list */}
                  <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#e5e7eb]">
                      <h3 className="font-bold text-secondary-900">
                        {activityFilter === 'all' ? `All Users (${activityData.users.length})` : `Filtered Users`}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary-50/50">
                          <tr className="text-left">
                            <th className="px-4 py-2 text-xs font-semibold text-secondary-600 uppercase">Email</th>
                            <th className="px-4 py-2 text-xs font-semibold text-secondary-600 uppercase">Role</th>
                            <th className="px-4 py-2 text-xs font-semibold text-secondary-600 uppercase">Sources</th>
                            <th className="px-4 py-2 text-xs font-semibold text-secondary-600 uppercase">Docs</th>
                            <th className="px-4 py-2 text-xs font-semibold text-secondary-600 uppercase">Last Active</th>
                            <th className="px-4 py-2 text-xs font-semibold text-secondary-600 uppercase">Stage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e5e7eb]">
                          {activityData.users
                            .filter(u => activityFilter === 'all' || u.funnel_stage === activityFilter)
                            .slice(0, 100)
                            .map(u => (
                              <tr key={u.userId} className="hover:bg-secondary-50/30">
                                <td className="px-4 py-2 text-secondary-900">
                                  <div className="font-medium">{u.email || 'no email'}</div>
                                  <div className="text-xs text-secondary-500">{u.displayName || ''}</div>
                                </td>
                                <td className="px-4 py-2 text-secondary-700 text-xs">
                                  {u.onboardingRole || <span className="text-secondary-400">unset</span>}
                                </td>
                                <td className="px-4 py-2 text-secondary-700">{u.entries_count ?? 0}</td>
                                <td className="px-4 py-2 text-secondary-700">
                                  {(u.completed_jobs ?? 0) > 0 ? (
                                    <span className="text-green-700 font-medium">{u.completed_jobs}</span>
                                  ) : (
                                    <span className="text-secondary-400">0</span>
                                  )}
                                  {(u.failed_jobs ?? 0) > 0 && (
                                    <span className="ml-2 text-red-600 text-xs">({u.failed_jobs} failed)</span>
                                  )}
                                </td>
                                <td className="px-4 py-2 text-xs text-secondary-600">
                                  {u.last_activity ? new Date(u.last_activity).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-4 py-2">
                                  <span className="text-xs text-secondary-500">{u.funnel_stage?.split('_').slice(1).join(' ') || ''}</span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StaggerChildren>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <StaggerItem key={msg.id}>
                      <div className={`card card-floating ${msg.read ? 'opacity-75' : 'border-l-4 border-l-chestnut'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {!msg.read && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                              <h3 className="text-lg font-semibold text-secondary-900">{msg.subject}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                msg.category === 'bug' ? 'bg-red-100 text-red-800' :
                                msg.category === 'feature' ? 'bg-primary-100 text-primary-800' :
                                msg.category === 'billing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {msg.category || 'general'}
                              </span>
                            </div>
                            <p className="text-sm text-secondary-600 mb-2">
                              From: <span className="font-medium">{msg.userName || 'Unknown'}</span> ({msg.userEmail})
                            </p>
                            <p className="text-secondary-800 whitespace-pre-line">{msg.message}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <span className="text-xs text-secondary-600">
                              {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : 'N/A'}
                            </span>
                            {!msg.read && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMarkRead(msg.id)}
                                className="btn btn-sm btn-outline"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark Read
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}

                  {messages.length === 0 && (
                    <div className="card card-floating text-center py-12">
                      <Mail className="w-16 h-16 text-secondary-900/20 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        No support messages yet
                      </h3>
                      <p className="text-secondary-600">
                        Messages from users will appear here
                      </p>
                    </div>
                  )}
                </div>
              </StaggerChildren>
            </motion.div>
          )}

          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <motion.div
              key="entries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {/* Resanitize migration panel */}
                <div className="rounded-lg border border-secondary-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-md bg-warning-50 border border-warning-200 flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-4 h-4 text-warning-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-secondary-900">Clean up legacy citations</h3>
                        <p className="text-xs text-secondary-600 mt-0.5 leading-relaxed">
                          Re-runs the new sanitizer over every <code className="text-xs font-mono bg-secondary-100 px-1 py-0.5 rounded">bibliography_entries</code> doc. Fixes malformed author / year / title fields produced by the old extraction pipeline. Always run a dry run first.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => runResanitizeMigration(false)}
                        disabled={migrationRunning}
                        className="btn btn-secondary btn-sm"
                      >
                        {migrationRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Dry run
                      </button>
                      <button
                        onClick={() => runResanitizeMigration(true)}
                        disabled={migrationRunning}
                        className="btn btn-primary btn-sm"
                      >
                        {migrationRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wrench className="w-3.5 h-3.5" />}
                        Apply
                      </button>
                    </div>
                  </div>

                  {migrationResult && (
                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <span className={`badge ${migrationResult.mode === 'apply' ? 'badge-success' : 'badge-neutral'}`}>
                          {migrationResult.mode === 'apply' ? 'Applied' : 'Dry run'}
                        </span>
                        <span className="text-xs text-secondary-600 tabular-nums">
                          Scanned <span className="font-medium text-secondary-900">{migrationResult.stats.scanned}</span>
                          {' · '}
                          {migrationResult.mode === 'apply' ? 'Updated' : 'Would update'}{' '}
                          <span className="font-medium text-secondary-900">{migrationResult.stats.changed}</span>
                          {' · '}
                          Unchanged <span className="font-medium text-secondary-900">{migrationResult.stats.unchanged}</span>
                          {migrationResult.stats.errors > 0 && (
                            <>{' · '}<span className="text-error-700 font-medium">{migrationResult.stats.errors} errors</span></>
                          )}
                        </span>
                      </div>

                      {migrationResult.sample_diffs && migrationResult.sample_diffs.length > 0 && (
                        <details className="group">
                          <summary className="cursor-pointer text-xs text-secondary-700 hover:text-secondary-900 font-medium">
                            Sample diffs ({migrationResult.sample_diffs.length} shown)
                          </summary>
                          <div className="mt-3 space-y-3">
                            {migrationResult.sample_diffs.map((s, idx) => (
                              <div key={idx} className="text-xs border border-secondary-200 rounded-md p-3 bg-secondary-50/40">
                                <p className="font-mono text-secondary-500 mb-2">{s.doc_id}</p>
                                {s.diffs.map((d, di) => (
                                  <div key={di} className="mb-2 last:mb-0">
                                    <p className="text-secondary-500 uppercase tracking-wider text-[10px] font-medium mb-0.5">{d.field}</p>
                                    <p className="text-error-700 line-through opacity-70 break-words">{d.before || <span className="italic">(empty)</span>}</p>
                                    <p className="text-success-700 break-words">{d.after}</p>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}

                      {migrationResult.note && (
                        <p className="mt-3 text-xs text-secondary-600 italic">{migrationResult.note}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="card card-floating">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title or subject..."
                        className="w-full pl-10 pr-4 py-3 border border-secondary-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="text-sm text-secondary-600 whitespace-nowrap">
                      {entries.length} entries
                    </div>
                  </div>
                </div>

                {/* Entries Table */}
                {entriesLoading ? (
                  <div className="card card-floating text-center py-12">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-secondary-700">Loading entries...</p>
                  </div>
                ) : (
                  <>
                    <div className="card card-floating overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-secondary-50/50 border-b border-secondary-300/30">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                                Subject
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                                User
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                                Citation Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-khaki/20">
                            {entries.map((entry, idx) => (
                              <motion.tr
                                key={entry.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                className="hover:bg-secondary-50/30 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm text-secondary-900 font-medium line-clamp-2">
                                      {entry.title || 'Untitled'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-sm text-secondary-700">
                                    {entry.subject || '—'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm">
                                    <div className="text-secondary-900 font-medium">{entry.userEmail || '—'}</div>
                                    <div className="text-secondary-600 text-xs">{entry.userId ? `${entry.userId.substring(0, 8)}...` : ''}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-sm text-secondary-700">
                                    {entry.date ? new Date(entry.date.toDate ? entry.date.toDate() : entry.date).toLocaleDateString() : 'N/A'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {entry.citationType || 'N/A'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewEntry(entry.id)}
                                    className="btn btn-sm btn-outline"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {entries.length === 0 && !searchQuery && (
                      <div className="card card-floating text-center py-12">
                        <FileText className="w-16 h-16 text-secondary-900/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                          No entries found
                        </h3>
                        <p className="text-secondary-600">
                          Source summary entries will appear here
                        </p>
                      </div>
                    )}

                    {entries.length === 0 && searchQuery && (
                      <div className="card card-floating text-center py-12">
                        <Search className="w-16 h-16 text-secondary-900/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                          No results for "{searchQuery}"
                        </h3>
                        <p className="text-secondary-600">
                          Try a different search term
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Entry Details Modal */}
                <AnimatePresence>
                  {selectedEntry && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                      onClick={() => setSelectedEntry(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="sticky top-0 bg-white border-b border-secondary-300/30 px-6 py-4 flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-secondary-900">Entry Details</h3>
                          <button
                            onClick={() => setSelectedEntry(null)}
                            className="p-2 hover:bg-secondary-200/10 rounded-lg transition-colors"
                          >
                            <ArrowLeft className="w-6 h-6 text-secondary-900" />
                          </button>
                        </div>

                        <div className="p-6 space-y-6">
                          {/* User Info */}
                          {selectedEntry.userInfo && (
                            <div className="bg-secondary-50/30 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">User Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-secondary-600">Email:</span>
                                  <span className="ml-2 text-secondary-900 font-medium">{selectedEntry.userInfo.email || '—'}</span>
                                </div>
                                <div>
                                  <span className="text-secondary-600">Name:</span>
                                  <span className="ml-2 text-secondary-900 font-medium">{selectedEntry.userInfo.displayName || '—'}</span>
                                </div>
                                <div>
                                  <span className="text-secondary-600">Plan:</span>
                                  <span className="ml-2 text-secondary-900 font-medium capitalize">{selectedEntry.userInfo.plan || 'trial'}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Citation */}
                          {selectedEntry.citation && (
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Citation ({selectedEntry.citation.type})</h4>
                              <div className="bg-secondary-50/30 rounded-lg p-4">
                                <p className="text-secondary-900">{selectedEntry.citation.formatted}</p>
                              </div>
                            </div>
                          )}

                          {/* Summary */}
                          {selectedEntry.summary && (
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Summary</h4>
                              <div className="bg-secondary-50/30 rounded-lg p-4">
                                <p className="text-secondary-800 whitespace-pre-line">{selectedEntry.summary}</p>
                              </div>
                            </div>
                          )}

                          {/* Key Findings */}
                          {selectedEntry.keyFindings && selectedEntry.keyFindings.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Key Findings</h4>
                              <div className="bg-secondary-50/30 rounded-lg p-4">
                                <ul className="space-y-2">
                                  {selectedEntry.keyFindings.map((finding, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-secondary-800">{finding}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Methodology */}
                          {selectedEntry.methodology && (
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Methodology</h4>
                              <div className="bg-secondary-50/30 rounded-lg p-4">
                                <p className="text-secondary-800 whitespace-pre-line">{selectedEntry.methodology}</p>
                              </div>
                            </div>
                          )}

                          {/* Quotes */}
                          {selectedEntry.quotes && selectedEntry.quotes.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Quotes</h4>
                              <div className="space-y-3">
                                {selectedEntry.quotes.map((quote, index) => (
                                  <div key={index} className="bg-secondary-50/30 rounded-lg p-4 border-l-4 border-primary">
                                    <p className="text-secondary-800 italic mb-2">"{quote.text || ''}"</p>
                                    {quote.page && (
                                      <p className="text-sm text-secondary-600">— Page {quote.page}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Research Focus */}
                          {selectedEntry.researchFocus && (
                            <div>
                              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Research Focus</h4>
                              <div className="bg-secondary-50/30 rounded-lg p-4">
                                <p className="text-secondary-800">{selectedEntry.researchFocus}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Health Check Tab */}
          {activeTab === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-card p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900 mb-1">System Health Check</h2>
                    <p className="text-sm text-secondary-600">
                      Verify that all critical services are operational
                    </p>
                  </div>
                  <button
                    onClick={runHealthCheck}
                    disabled={healthLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-300 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
                    {healthLoading ? 'Running checks...' : 'Run Check'}
                  </button>
                </div>

                {healthResults && (
                  <>
                    {/* Overall status banner */}
                    <div className={`rounded-lg p-4 mb-6 flex items-center justify-between ${
                      healthResults.overall_status === 'healthy'
                        ? 'bg-green-50 border border-green-200'
                        : healthResults.overall_status === 'degraded'
                        ? 'bg-amber-50 border border-amber-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        {healthResults.overall_status === 'healthy' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-amber-600" />
                        )}
                        <div>
                          <p className="font-semibold text-secondary-900">
                            Overall Status: {healthResults.overall_status.toUpperCase()}
                          </p>
                          <p className="text-xs text-secondary-600">
                            Last checked: {new Date(healthResults.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Individual check results */}
                    <div className="space-y-3">
                      {Object.entries(healthResults.checks || {}).map(([service, result]) => (
                        <div
                          key={service}
                          className="flex items-start justify-between p-4 border border-[#e5e7eb] rounded-lg"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            {result.status === 'ok' ? (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : result.status === 'warn' ? (
                              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-secondary-900 capitalize">
                                {service.replace(/_/g, ' ')}
                              </p>
                              <p className="text-xs text-secondary-600 mt-0.5">{result.message}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            result.status === 'ok'
                              ? 'bg-green-100 text-green-800'
                              : result.status === 'warn'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {result.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {healthLoading && !healthResults && (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                    <p className="text-sm text-secondary-600">Running health checks across all services...</p>
                  </div>
                )}
              </div>

              {/* Info card */}
              <div className="bg-secondary-50/50 border border-secondary-200 rounded-lg p-4 text-sm text-secondary-700">
                <p className="font-medium mb-2">What this checks:</p>
                <ul className="space-y-1 text-xs ml-4 list-disc">
                  <li><strong>Firestore</strong> — Read/write to the database</li>
                  <li><strong>OpenAI</strong> — GPT-4o-mini API (source extraction + DALL-E)</li>
                  <li><strong>Anthropic</strong> — Claude Sonnet (topics, outlines, content generation)</li>
                  <li><strong>Haiku</strong> — Claude Haiku (quality review, citations, image prompts)</li>
                  <li><strong>Stripe</strong> — Payment API connectivity</li>
                  <li><strong>Firestore Queries</strong> — Critical queries that previously failed (compound index issues)</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* E2E Tests Tab */}
          {activeTab === 'e2e' && (
            <motion.div
              key="e2e"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-card p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900 mb-1 flex items-center gap-2">
                      <Beaker className="w-5 h-5 text-[#316094]" />
                      End-to-End Test Suite
                    </h2>
                    <p className="text-sm text-secondary-600">
                      Runs the full user workflow (source import &rarr; topics &rarr; outline &rarr; content generation)
                    </p>
                  </div>
                  <button
                    onClick={runE2ETests}
                    disabled={e2eRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-[#316094] text-white rounded-lg hover:bg-[#27517f] disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {e2eRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Run Tests Now
                      </>
                    )}
                  </button>
                </div>

                {/* Warning banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm text-secondary-800">
                    <p className="font-semibold mb-1">Heads up</p>
                    <p>
                      A full e2e run takes <strong>3-5 minutes</strong> and costs approximately
                      <strong> $0.50</strong> in real API calls (OpenAI + Claude).
                      Test entries and content jobs are auto-cleaned up afterwards.
                    </p>
                  </div>
                </div>

                {/* Running indicator */}
                {e2eRunning && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-[#316094] animate-spin" />
                    <div className="text-sm text-secondary-800">
                      <p className="font-semibold">Tests in progress</p>
                      <p className="text-xs text-secondary-600">
                        Source extraction &rarr; topic generation &rarr; outline &rarr; 500-word content draft &rarr; query checks
                      </p>
                    </div>
                  </div>
                )}

                {/* Recent runs header */}
                <div className="flex items-center justify-between mb-3 mt-2">
                  <h3 className="text-sm font-semibold text-secondary-900">Recent Test Runs</h3>
                  <button
                    onClick={loadE2EHistory}
                    disabled={e2eHistoryLoading}
                    className="text-xs text-secondary-600 hover:text-secondary-900 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${e2eHistoryLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* History list */}
                {e2eHistoryLoading && e2eHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 text-[#316094] animate-spin mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">Loading test history...</p>
                  </div>
                ) : e2eHistory.length === 0 ? (
                  <div className="bg-secondary-50/30 border border-dashed border-secondary-300 rounded-lg p-8 text-center">
                    <Beaker className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-secondary-700 mb-1">No test runs yet</p>
                    <p className="text-xs text-secondary-500">Click "Run Tests Now" above to start your first end-to-end test</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {e2eHistory.slice(0, 5).map((run) => {
                      const isExpanded = e2eExpandedRunId === run.run_id;
                      const status = run.overall_status || run.status || 'unknown';
                      const tests = run.tests || [];
                      const passedCount = tests.filter(t => t.status === 'pass').length;
                      const totalCount = tests.length;
                      const startedAt = run.startedAt ? new Date(run.startedAt) : null;
                      const durationSec = run.total_duration_ms ? (run.total_duration_ms / 1000).toFixed(1) : null;

                      // Color scheme by status
                      const statusColors = {
                        pass: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badgeBg: 'bg-green-100', badgeText: 'text-green-800', icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
                        partial: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800', icon: <AlertCircle className="w-4 h-4 text-amber-600" /> },
                        fail: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badgeBg: 'bg-red-100', badgeText: 'text-red-800', icon: <XCircle className="w-4 h-4 text-red-600" /> },
                        running: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badgeBg: 'bg-blue-100', badgeText: 'text-blue-800', icon: <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" /> },
                        timeout: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badgeBg: 'bg-red-100', badgeText: 'text-red-800', icon: <XCircle className="w-4 h-4 text-red-600" /> },
                        error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badgeBg: 'bg-red-100', badgeText: 'text-red-800', icon: <XCircle className="w-4 h-4 text-red-600" /> },
                      };
                      const colors = statusColors[status] || { bg: 'bg-secondary-50', border: 'border-secondary-200', text: 'text-secondary-700', badgeBg: 'bg-secondary-100', badgeText: 'text-secondary-800', icon: <Clock className="w-4 h-4 text-secondary-600" /> };

                      return (
                        <div
                          key={run.run_id}
                          className={`border ${colors.border} ${colors.bg} rounded-lg overflow-hidden`}
                        >
                          {/* Summary row (clickable to expand) */}
                          <button
                            onClick={() => setE2eExpandedRunId(isExpanded ? null : run.run_id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/40 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-secondary-600 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-secondary-600 flex-shrink-0" />
                              )}
                              {colors.icon}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-secondary-900">
                                    {startedAt ? startedAt.toLocaleString() : 'Unknown time'}
                                  </span>
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
                                    {status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-xs text-secondary-600 mt-0.5">
                                  {totalCount > 0 && (
                                    <span>{passedCount}/{totalCount} tests passed</span>
                                  )}
                                  {durationSec && <span> &middot; {durationSec}s</span>}
                                  {run.startedBy && <span> &middot; by {run.startedBy}</span>}
                                  {run.cleanup_complete === false && (
                                    <span className="text-amber-700"> &middot; cleanup incomplete</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-secondary-500 ml-2 flex-shrink-0">~$0.50</span>
                          </button>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="border-t border-[#e5e7eb] bg-white/60 px-4 py-3">
                              {tests.length === 0 ? (
                                <p className="text-xs text-secondary-600 italic">
                                  {status === 'running' ? 'Tests are still in progress...' : 'No test details available'}
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {tests.map((test, idx) => (
                                    <div
                                      key={`${run.run_id}-test-${idx}`}
                                      className="flex items-start gap-2 p-2 rounded border border-[#e5e7eb] bg-white"
                                    >
                                      {test.status === 'pass' ? (
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="text-sm font-medium text-secondary-900">{test.name}</span>
                                          {test.duration_ms != null && (
                                            <span className="text-xs text-secondary-500 flex-shrink-0">
                                              {(test.duration_ms / 1000).toFixed(1)}s
                                            </span>
                                          )}
                                        </div>
                                        {test.message && (
                                          <p className="text-xs text-secondary-700 mt-0.5">{test.message}</p>
                                        )}
                                        {test.details && Object.keys(test.details).length > 0 && (
                                          <div className="mt-1.5 text-xs text-secondary-600 font-mono bg-secondary-50/60 rounded p-1.5 max-h-32 overflow-y-auto">
                                            {Object.entries(test.details).map(([k, v]) => (
                                              <div key={k}>
                                                <span className="text-secondary-500">{k}:</span>{' '}
                                                <span className="text-secondary-800">
                                                  {typeof v === 'object' ? JSON.stringify(v).substring(0, 200) : String(v).substring(0, 200)}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {run.error_message && (
                                    <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
                                      <span className="font-semibold">Run error:</span> {run.error_message}
                                    </div>
                                  )}
                                  {run.timeout_error && (
                                    <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
                                      <span className="font-semibold">Timeout:</span> {run.timeout_error}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Info card */}
              <div className="bg-secondary-50/50 border border-secondary-200 rounded-lg p-4 text-sm text-secondary-700">
                <p className="font-medium mb-2">What gets tested:</p>
                <ul className="space-y-1 text-xs ml-4 list-disc">
                  <li><strong>Source Import</strong> — Extracts a SourceEntry from hardcoded test text and writes it to Firestore</li>
                  <li><strong>Topic Generation</strong> — Generates 3 topic suggestions from 2 test entries via Claude</li>
                  <li><strong>Outline Generation</strong> — Produces a detailed outline from the first generated topic</li>
                  <li><strong>Content Generation</strong> — Runs a 500-word draft end-to-end (skips DALL-E), checks quality report fields</li>
                  <li><strong>Critical Firestore Queries</strong> — Verifies queries that have failed historically (composite index issues)</li>
                </ul>
                <p className="text-xs mt-3 text-secondary-600">
                  Test data is created under user <code className="bg-white px-1 rounded">e2e_test_user_id</code> with
                  <code className="bg-white px-1 rounded">isTestUser: true</code> so it won&apos;t pollute admin stats.
                  All test entries and content jobs are deleted after the run.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'voice' && (
            <motion.div key="voice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-6">
                {/* Run panel */}
                <div className="rounded-lg border border-secondary-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-secondary-900">Voice compliance suite</h3>
                        <p className="text-xs text-secondary-600 mt-0.5 leading-relaxed">
                          Generates a small test document for each document type, then runs structural assertions (citation density, em-dash check, bullet allowance, IMRaD structure) and a Haiku voice-fit judgment. Verifies each voice profile actually produces what it claims to.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        value={voiceScope}
                        onChange={(e) => setVoiceScope(e.target.value)}
                        disabled={voiceRunning}
                        className="form-input w-auto text-xs py-1.5"
                      >
                        <option value="voices">5 voice reps (~$15)</option>
                        <option value="all">All 17 types (~$50)</option>
                      </select>
                      <button
                        onClick={runVoiceCompliance}
                        disabled={voiceRunning}
                        className="btn btn-primary btn-sm"
                      >
                        {voiceRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        {voiceRunning ? 'Running…' : 'Run suite'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current run result */}
                {voiceResult && (
                  <div className="rounded-lg border border-secondary-200 bg-white p-5">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-secondary-900">Latest run</h3>
                        <span className={`badge ${voiceResult.overall_status === 'pass' ? 'badge-success' : 'badge-error'}`}>
                          {voiceResult.overall_status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-secondary-600 tabular-nums">
                        <span className="text-success-700 font-medium">{voiceResult.summary?.passed || 0} passed</span>
                        {(voiceResult.summary?.failed || 0) > 0 && <span className="ml-3 text-error-700 font-medium">{voiceResult.summary?.failed} failed</span>}
                        {(voiceResult.summary?.errors || 0) > 0 && <span className="ml-3 text-warning-700 font-medium">{voiceResult.summary?.errors} errors</span>}
                        <span className="ml-3 text-secondary-500">~${voiceResult.summary?.estimated_cost_usd?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>

                    <div className="divide-y divide-secondary-100">
                      {(voiceResult.results || []).map((r) => {
                        const isExpanded = voiceExpandedDocType === r.doc_type;
                        const overall = r.overall;
                        const overallColor = overall === 'PASS' ? 'badge-success' : overall === 'FAIL' ? 'badge-error' : 'badge-warning';
                        return (
                          <div key={r.doc_type} className="py-3">
                            <button
                              onClick={() => setVoiceExpandedDocType(isExpanded ? null : r.doc_type)}
                              className="w-full flex items-center gap-3 text-left"
                            >
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" />}
                              <span className={`badge ${overallColor} flex-shrink-0`}>{overall}</span>
                              <span className="text-sm font-medium text-secondary-900 flex-shrink-0 min-w-[140px]">{r.doc_type}</span>
                              <span className="text-xs text-secondary-500 font-mono uppercase tracking-wider">{r.voice}</span>
                              {r.structural && (
                                <span className="text-xs text-secondary-500 ml-auto tabular-nums">
                                  {r.structural.passed}/{r.structural.total} assertions
                                  {r.structural.warnings > 0 && <span className="text-warning-600 ml-1">({r.structural.warnings}w)</span>}
                                </span>
                              )}
                              {r.voice_fit?.score != null && (
                                <span className={`text-xs tabular-nums ml-2 ${r.voice_fit.score >= 80 ? 'text-success-700' : r.voice_fit.score >= 60 ? 'text-warning-700' : 'text-error-700'}`}>
                                  fit: {r.voice_fit.score}
                                </span>
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 ml-6 space-y-3">
                                {r.error && (
                                  <div className="rounded-md border border-error-200 bg-error-50/40 p-3 text-xs text-error-800">
                                    <strong>Error:</strong> {r.error}
                                  </div>
                                )}
                                {r.voice_fit && (
                                  <div className="text-xs">
                                    <p className="font-medium text-secondary-900 mb-0.5">Voice-fit judgment</p>
                                    <p className="text-secondary-700"><span className="font-mono">{r.voice_fit.judgment}</span> ({r.voice_fit.score}/100) — {r.voice_fit.reason}</p>
                                  </div>
                                )}
                                {r.structural?.assertions && (
                                  <div>
                                    <p className="text-xs font-medium text-secondary-900 mb-1.5">Structural assertions</p>
                                    <div className="space-y-1">
                                      {r.structural.assertions.map((a, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                          {a.passed ? (
                                            <CheckCircle className="w-3 h-3 text-success-600 mt-0.5 flex-shrink-0" />
                                          ) : (
                                            <XCircle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${a.severity === 'warning' ? 'text-warning-600' : 'text-error-600'}`} />
                                          )}
                                          <span className={`font-mono ${a.passed ? 'text-secondary-600' : 'text-secondary-900 font-medium'}`}>{a.name}</span>
                                          {a.detail && <span className="text-secondary-500">— {a.detail}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {r.sample && (
                                  <details className="text-xs">
                                    <summary className="cursor-pointer text-secondary-700 hover:text-secondary-900 font-medium">Sample output ({r.word_count} words total)</summary>
                                    <div className="mt-2 p-3 bg-secondary-50/60 border border-secondary-200 rounded-md whitespace-pre-wrap text-secondary-700 leading-relaxed max-h-64 overflow-y-auto">
                                      {r.sample}
                                    </div>
                                  </details>
                                )}
                                {r.job_id && (
                                  <p className="text-[10px] font-mono text-secondary-400">job_id: {r.job_id}</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* History */}
                <div className="rounded-lg border border-secondary-200 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-secondary-900">Recent runs</h3>
                    <button onClick={loadVoiceHistory} className="text-xs text-secondary-500 hover:text-secondary-900 inline-flex items-center gap-1">
                      <RefreshCw className={`w-3 h-3 ${voiceHistoryLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                  {voiceHistory.length === 0 ? (
                    <p className="text-xs text-secondary-500">{voiceHistoryLoading ? 'Loading…' : 'No runs yet. Click "Run suite" to start.'}</p>
                  ) : (
                    <div className="divide-y divide-secondary-100">
                      {voiceHistory.map((run) => (
                        <div key={run.run_id} className="py-2 flex items-center gap-3 text-xs">
                          <span className={`badge ${run.overall_status === 'pass' ? 'badge-success' : 'badge-error'} flex-shrink-0`}>{(run.overall_status || run.status || '?').toUpperCase()}</span>
                          <span className="text-secondary-500 font-mono">{run.scope}</span>
                          <span className="text-secondary-700 tabular-nums">
                            {run.summary?.passed || 0}/{run.summary?.total || 0} passed
                          </span>
                          <span className="text-secondary-500 tabular-nums">~${run.summary?.estimated_cost_usd?.toFixed(2) || '0.00'}</span>
                          <span className="text-secondary-400 ml-auto tabular-nums">{run.startedAt ? new Date(run.startedAt).toLocaleString() : '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-secondary-500">
                  Voice compliance generates real documents using fixed test sources under
                  <code className="bg-secondary-100 px-1 rounded mx-0.5">e2e_test_user_id</code>. Each generation costs ~$3.
                  Use the 5-voice scope for routine checks; reserve the all-17 scope for pre-release verification.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

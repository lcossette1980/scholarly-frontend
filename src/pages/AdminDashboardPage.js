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
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, isAdmin } from '../services/admin';
import toast from 'react-hot-toast';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
        const data = await adminAPI.getStats(currentUser.email);
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load admin stats');
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
        const data = await adminAPI.getUsers(currentUser.email, 50);
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
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

  const handleMarkRead = async (messageId) => {
    try {
      await adminAPI.markMessageRead(currentUser.email, messageId);
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'chestnut' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-charcoal/60 font-lato mb-1">{title}</p>
          <p className="text-3xl font-bold text-charcoal font-playfair mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-charcoal/60 font-lato">{subtitle}</p>
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
          <RefreshCw className="w-8 h-8 text-chestnut animate-spin mx-auto mb-4" />
          <p className="text-charcoal/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-charcoal font-playfair">
                Admin Dashboard
              </h1>
              <p className="text-charcoal/70 font-lato">
                System overview and user management
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">{unreadCount} unread messages</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-khaki/30">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-chestnut border-b-2 border-chestnut'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'users'
                ? 'text-chestnut border-b-2 border-chestnut'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            Users ({stats?.users?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-4 font-semibold transition-colors relative ${
              activeTab === 'messages'
                ? 'text-chestnut border-b-2 border-chestnut'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            Support Messages
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.users.total}
                subtitle={`${stats.users.active} active (${stats.users.active_percent}%)`}
                color="blue-600"
              />
              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value={`$${stats.revenue.mrr}`}
                subtitle={`${stats.revenue.total_subscriptions} subscriptions`}
                color="green-600"
              />
              <StatCard
                icon={FileText}
                title="Total Entries"
                value={stats.entries.total}
                subtitle={`${stats.entries.last_30_days} last 30 days`}
                color="purple-600"
              />
              <StatCard
                icon={Mail}
                title="Support Messages"
                value={messages.length}
                subtitle={`${unreadCount} unread`}
                color="orange-600"
              />
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h2 className="text-xl font-bold text-charcoal font-playfair mb-4">
                  Revenue by Plan
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal/70 font-lato">Student Plan</span>
                    <span className="text-xl font-bold text-charcoal">${stats.revenue.by_plan.student}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal/70 font-lato">Researcher Plan</span>
                    <span className="text-xl font-bold text-charcoal">${stats.revenue.by_plan.researcher}</span>
                  </div>
                </div>
              </div>

              {/* Recent Messages Preview */}
              <div className="card">
                <h2 className="text-xl font-bold text-charcoal font-playfair mb-4">
                  Recent Messages
                </h2>
                <div className="space-y-3">
                  {messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3 pb-3 border-b border-khaki/20 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${msg.read ? 'bg-gray-400' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">{msg.subject}</p>
                        <p className="text-xs text-charcoal/60">{msg.userEmail}</p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-sm text-charcoal/60">No messages yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-xl font-bold text-charcoal font-playfair mb-4">
              All Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-khaki/30">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Display Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Entries Used</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-khaki/10 hover:bg-pearl/30">
                      <td className="py-3 px-4 text-sm text-charcoal">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-charcoal">{user.displayName || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscription?.plan === 'researcher' ? 'bg-purple-100 text-purple-800' :
                          user.subscription?.plan === 'student' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscription?.plan || 'trial'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-charcoal">
                        {user.subscription?.entriesUsed || 0} / {user.subscription?.entriesLimit === -1 ? '∞' : user.subscription?.entriesLimit || 5}
                      </td>
                      <td className="py-3 px-4 text-sm text-charcoal/60">
                        {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`card ${msg.read ? 'opacity-75' : 'border-l-4 border-l-chestnut'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {!msg.read && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                      <h3 className="text-lg font-semibold text-charcoal font-playfair">{msg.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        msg.category === 'bug' ? 'bg-red-100 text-red-800' :
                        msg.category === 'feature' ? 'bg-blue-100 text-blue-800' :
                        msg.category === 'billing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.category || 'general'}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal/60 mb-2">
                      From: <span className="font-medium">{msg.userName || 'Unknown'}</span> ({msg.userEmail})
                    </p>
                    <p className="text-charcoal/80 font-lato whitespace-pre-line">{msg.message}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="text-xs text-charcoal/60">
                      {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : 'N/A'}
                    </span>
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="btn btn-sm btn-outline"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="card text-center py-12">
                <Mail className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-charcoal font-playfair mb-2">
                  No support messages yet
                </h3>
                <p className="text-charcoal/60 font-lato">
                  Messages from users will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

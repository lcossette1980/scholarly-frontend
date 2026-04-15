// src/pages/ResearchFeedsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Rss,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  X,
  BookOpen,
  Loader2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { feedsAPI } from '../services/api';
import { FadeIn } from '../components/motion';
import toast from 'react-hot-toast';

const SOURCE_COLORS = {
  'Semantic Scholar': 'bg-blue-100 text-blue-800',
  'OpenAlex': 'bg-purple-100 text-purple-800',
  'CrossRef': 'bg-amber-100 text-amber-800',
};

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const FILTER_TABS = ['All', 'Semantic Scholar', 'OpenAlex', 'CrossRef'];

const ResearchFeedsPage = () => {
  const { currentUser } = useAuth();

  // Subscription state
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [newTopic, setNewTopic] = useState('');
  const [newFrequency, setNewFrequency] = useState('weekly');
  const [subscribing, setSubscribing] = useState(false);

  // Feed items state
  const [feedItems, setFeedItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [checkingFeeds, setCheckingFeeds] = useState(false);
  const [importingItems, setImportingItems] = useState({});
  const [dismissingItems, setDismissingItems] = useState({});

  const loadSubscriptions = useCallback(async () => {
    try {
      setSubsLoading(true);
      const data = await feedsAPI.getSubscriptions();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setSubsLoading(false);
    }
  }, []);

  const loadFeedItems = useCallback(async () => {
    try {
      setItemsLoading(true);
      const data = await feedsAPI.getItems();
      setFeedItems(data.items || []);
    } catch (error) {
      toast.error('Failed to load feed items');
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadSubscriptions();
      loadFeedItems();
    }
  }, [currentUser, loadSubscriptions, loadFeedItems]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    try {
      setSubscribing(true);
      await feedsAPI.subscribe(
        newTopic.trim(),
        ['semantic_scholar', 'openalex', 'crossref'],
        newFrequency
      );
      toast.success(`Subscribed to "${newTopic.trim()}"`);
      setNewTopic('');
      await loadSubscriptions();
    } catch (error) {
      toast.error('Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const handleDeleteSubscription = async (id) => {
    try {
      await feedsAPI.deleteSubscription(id);
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Subscription removed');
    } catch (error) {
      toast.error('Failed to remove subscription');
    }
  };

  const handleCheckFeeds = async () => {
    try {
      setCheckingFeeds(true);
      const data = await feedsAPI.checkFeeds();
      toast.success(`Found ${data.new_items || 0} new items`);
      await loadFeedItems();
    } catch (error) {
      toast.error('Failed to check feeds');
    } finally {
      setCheckingFeeds(false);
    }
  };

  const handleImportItem = async (itemId) => {
    try {
      setImportingItems((prev) => ({ ...prev, [itemId]: true }));
      await feedsAPI.importItem(itemId);
      toast.success('Import started - check your library');
      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, importedToLibrary: true } : item
        )
      );
    } catch (error) {
      toast.error('Failed to import item');
    } finally {
      setImportingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleDismissItem = async (itemId) => {
    try {
      setDismissingItems((prev) => ({ ...prev, [itemId]: true }));
      await feedsAPI.dismissItem(itemId);
      setFeedItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      toast.error('Failed to dismiss item');
    } finally {
      setDismissingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const filteredItems =
    activeFilter === 'All'
      ? feedItems
      : feedItems.filter((item) => item.source === activeFilter);

  const truncateText = (text, maxLen = 200) => {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + '...';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#316094] rounded-lg flex items-center justify-center">
                <Rss className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Research Feeds</h1>
                <p className="text-sm text-gray-500">
                  Discover new research automatically based on your topics
                </p>
              </div>
            </div>
            <button
              onClick={handleCheckFeeds}
              disabled={checkingFeeds || subscriptions.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-[#316094] text-white rounded-lg hover:bg-[#274d78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${checkingFeeds ? 'animate-spin' : ''}`} />
              <span>{checkingFeeds ? 'Checking...' : 'Check Now'}</span>
            </button>
          </div>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Subscriptions */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Subscribe Form */}
            <FadeIn delay={0.1}>
              <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Subscribe to Topic
                </h2>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="e.g., machine learning in healthcare"
                      className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#316094] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <select
                      value={newFrequency}
                      onChange={(e) => setNewFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#316094] focus:border-transparent"
                    >
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={subscribing || !newTopic.trim()}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#316094] text-white rounded-lg hover:bg-[#274d78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {subscribing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{subscribing ? 'Subscribing...' : 'Subscribe'}</span>
                  </button>
                </form>
              </div>
            </FadeIn>

            {/* Active Subscriptions */}
            <FadeIn delay={0.2}>
              <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Active Subscriptions
                </h2>
                {subsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#316094]" />
                  </div>
                ) : subscriptions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No subscriptions yet. Add a topic above to get started.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {subscriptions.map((sub) => (
                        <motion.div
                          key={sub.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="border border-[#e5e7eb] rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {sub.topic}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-[#316094] capitalize">
                                  {sub.frequency}
                                </span>
                                {sub.lastChecked && (
                                  <span className="text-xs text-gray-400">
                                    Last checked {formatDate(sub.lastChecked)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSubscription(sub.id)}
                              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove subscription"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Main Area - Feed Items */}
          <div className="w-full lg:w-2/3">
            <FadeIn delay={0.15}>
              <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm">
                {/* Filter Tabs */}
                <div className="border-b border-[#e5e7eb] px-5 pt-4">
                  <div className="flex space-x-1 overflow-x-auto">
                    {FILTER_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                          activeFilter === tab
                            ? 'text-[#316094] border-b-2 border-[#316094] bg-blue-50/50'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5">
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-[#316094]" />
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">
                        {subscriptions.length === 0
                          ? 'Subscribe to topics to discover new research automatically'
                          : activeFilter !== 'All'
                          ? `No items from ${activeFilter}`
                          : 'No feed items yet. Click "Check Now" to fetch the latest papers.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {filteredItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="border border-[#e5e7eb] rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            {/* Title and source badge */}
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-medium text-gray-900 text-sm leading-snug flex-1">
                                {item.title}
                              </h3>
                              <span
                                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                                  SOURCE_COLORS[item.source] || 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.source}
                              </span>
                            </div>

                            {/* Authors */}
                            {item.authors && item.authors.length > 0 && (
                              <p className="text-xs text-gray-500 mb-2">
                                {Array.isArray(item.authors)
                                  ? item.authors.slice(0, 3).join(', ')
                                  : item.authors}
                                {Array.isArray(item.authors) && item.authors.length > 3
                                  ? ` +${item.authors.length - 3} more`
                                  : ''}
                              </p>
                            )}

                            {/* Abstract snippet */}
                            {item.abstract && (
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {truncateText(item.abstract)}
                              </p>
                            )}

                            {/* Date and actions */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {formatDate(item.publishedDate)}
                              </span>
                              <div className="flex items-center space-x-2">
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#316094] transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>View Original</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDismissItem(item.id)}
                                  disabled={dismissingItems[item.id]}
                                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium border border-[#e5e7eb] rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  {dismissingItems[item.id] ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <X className="w-3.5 h-3.5" />
                                  )}
                                  <span>Dismiss</span>
                                </button>
                                <button
                                  onClick={() => handleImportItem(item.id)}
                                  disabled={importingItems[item.id] || item.importedToLibrary}
                                  className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    item.importedToLibrary
                                      ? 'bg-[#47763b] text-white'
                                      : 'bg-[#316094] text-white hover:bg-[#274d78]'
                                  }`}
                                >
                                  {importingItems[item.id] ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <BookOpen className="w-3.5 h-3.5" />
                                  )}
                                  <span>
                                    {item.importedToLibrary
                                      ? 'Imported'
                                      : importingItems[item.id]
                                      ? 'Importing...'
                                      : 'Import to Library'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchFeedsPage;

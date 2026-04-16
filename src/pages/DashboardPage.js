// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  ArrowRight,
  BookOpen,
  BarChart3,
  TrendingUp,
  Target,
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  Rss,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, updateDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry } from '../services/stripe';
import { getUserBibliographyEntries } from '../services/bibliography';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EntryViewModal from '../components/EntryViewModal';
import OnboardingModal from '../components/OnboardingModal';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import { documentTemplates } from '../data/templates';
import { feedsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Map template icon strings to components
const iconMap = {
  FileText,
  BookOpen,
  BarChart3,
  TrendingUp,
  Target,
  Globe,
};

// Plan display helpers
const getPlanLabel = (subscription) => {
  if (!subscription) return 'Starter';
  const { plan } = subscription;
  if (plan === 'free' || plan === 'trial') return 'Starter';
  if (plan === 'student') return 'Plus';
  if (plan === 'researcher') return 'Pro';
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

const getPlanBadgeColor = (subscription) => {
  if (!subscription) return 'bg-secondary-100 text-secondary-700';
  const { plan } = subscription;
  if (plan === 'free' || plan === 'trial') return 'bg-secondary-100 text-secondary-700';
  if (plan === 'student') return 'bg-blue-100 text-blue-800';
  if (plan === 'researcher') return 'bg-purple-100 text-purple-800';
  return 'bg-secondary-100 text-secondary-700';
};

const isFreePlan = (subscription) => {
  if (!subscription) return true;
  return subscription.plan === 'free' || subscription.plan === 'trial';
};

// Status badge for content generation jobs
const StatusBadge = ({ status }) => {
  const config = {
    completed: { icon: CheckCircle, label: 'Completed', className: 'bg-green-100 text-green-800' },
    processing: { icon: Clock, label: 'Processing', className: 'bg-amber-100 text-amber-800' },
    generating: { icon: Clock, label: 'Generating', className: 'bg-amber-100 text-amber-800' },
    failed: { icon: XCircle, label: 'Failed', className: 'bg-red-100 text-red-800' },
  };
  const { icon: Icon, label, className } = config[status] || config.processing;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const DashboardPage = () => {
  const { currentUser, userDocument, refreshUserDocument } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [feedItemCount, setFeedItemCount] = useState(0);
  const [hasSubscriptions, setHasSubscriptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [refreshingSubscription, setRefreshingSubscription] = useState(false);

  // Handle successful payment redirect
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const success = searchParams.get('success');
      const planId = searchParams.get('plan');
      if (success === 'true' && currentUser && !refreshingSubscription) {
        console.log('Payment success detected for plan:', planId);
        setRefreshingSubscription(true);

        const planName = planId ? planId.charAt(0).toUpperCase() + planId.slice(1) : 'your';
        toast.success(`Payment successful! Activating your ${planName} plan...`);

        searchParams.delete('success');
        searchParams.delete('plan');
        setSearchParams(searchParams);

        const refreshWithRetry = async (maxRetries = 20, delay = 1500) => {
          let previousPlan = userDocument?.subscription?.plan;
          let previousLimit = userDocument?.subscription?.entriesLimit;

          for (let i = 0; i < maxRetries; i++) {
            try {
              console.log(`Refresh attempt ${i + 1}/${maxRetries}`);
              await refreshUserDocument();
              await new Promise(resolve => setTimeout(resolve, 500));

              const { checkSubscriptionStatus, forceSyncSubscription, manuallyActivateSubscription } = await import('../services/stripe');

              let backendStatus = await checkSubscriptionStatus(currentUser.uid);

              if (!backendStatus?.subscription) {
                console.log('Backend check failed, trying force sync...');
                const syncResult = await forceSyncSubscription(currentUser.uid);
                if (syncResult.success) {
                  backendStatus = { subscription: syncResult.subscription };
                }
              }

              if (!backendStatus?.subscription) {
                const pendingSubStr = localStorage.getItem('pendingSubscription');
                if (pendingSubStr) {
                  try {
                    const pendingSub = JSON.parse(pendingSubStr);
                    if (pendingSub.userId === currentUser.uid &&
                        Date.now() - pendingSub.timestamp < 3600000) {
                      // planId may be used below
                    }
                  } catch (e) {
                    console.error('Error parsing pending subscription:', e);
                  }
                }
              }

              if (!backendStatus?.subscription && planId && i === maxRetries - 1) {
                console.log('All sync methods failed, manually activating subscription...');
                try {
                  const manualSubscription = await manuallyActivateSubscription(currentUser.uid, planId);
                  backendStatus = { subscription: manualSubscription };
                  localStorage.removeItem('pendingSubscription');
                  toast.warning('Subscription activated manually. If this persists, please contact support.');
                } catch (manualError) {
                  console.error('Manual activation failed:', manualError);
                }
              }

              const { getUserDocument } = await import('../services/auth');
              const latestUserData = await getUserDocument(currentUser.uid);

              console.log('Backend subscription status:', backendStatus);
              console.log('Latest user data:', latestUserData);

              if (latestUserData?.subscription &&
                  (latestUserData.subscription.plan !== previousPlan ||
                   latestUserData.subscription.entriesLimit !== previousLimit) &&
                  latestUserData.subscription.plan !== 'trial' &&
                  latestUserData.subscription.plan !== 'free') {
                console.log('Subscription successfully updated:', latestUserData.subscription);
                toast.success(`Your ${latestUserData.subscription.plan} plan is now active with ${latestUserData.subscription.entriesLimit} monthly entries!`);
                await refreshUserDocument();
                break;
              }

              if (i < maxRetries - 1) {
                console.log(`Subscription not updated yet, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              } else {
                toast.error('Subscription update is taking longer than expected. Please use the Refresh button to check your subscription status.', {
                  duration: 8000
                });
              }
            } catch (error) {
              console.error('Error refreshing subscription:', error);
              if (i === maxRetries - 1) {
                toast.error('There was an issue updating your subscription. Please use the Refresh button or contact support.');
              }
            }
          }
        };

        await refreshWithRetry();
        setRefreshingSubscription(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, currentUser, setSearchParams]);

  // Fetch user's bibliography entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const result = await getUserBibliographyEntries(currentUser.uid, 100);
        if (result.success) {
          setEntries(result.entries);
        } else {
          toast.error('Failed to load source entries');
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        toast.error('Failed to load source entries');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [currentUser]);

  // Fetch recent content generation jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser) {
        setJobsLoading(false);
        return;
      }

      try {
        const jobsRef = collection(db, 'content_generation_jobs');
        const q = query(
          jobsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(d.data().createdAt),
        }));
        setRecentJobs(jobsData);
      } catch (error) {
        console.error('Error fetching content jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser]);

  // Fetch feed item count
  useEffect(() => {
    const fetchFeedInfo = async () => {
      if (!currentUser) return;
      try {
        const data = await feedsAPI.getSubscriptions();
        const subs = data.subscriptions || [];
        setHasSubscriptions(subs.length > 0);
        if (subs.length > 0) {
          const itemsData = await feedsAPI.getItems();
          setFeedItemCount((itemsData.items || []).length);
        }
      } catch (error) {
        // Feeds are optional; silently fail
        console.error('Error fetching feed info:', error);
      }
    };

    fetchFeedInfo();
  }, [currentUser]);

  // Build merged recent activity timeline
  const recentActivity = React.useMemo(() => {
    const entryItems = entries.slice(0, 5).map(e => ({
      type: 'source',
      id: e.id,
      title: e.title || e.metadata?.title || 'Untitled Source',
      subtitle: e.researchFocus || e.metadata?.authors?.[0] || '',
      date: e.createdAt?.toDate ? e.createdAt.toDate() : (e.createdAt ? new Date(e.createdAt) : new Date()),
      status: null,
      raw: e,
    }));

    const jobItems = recentJobs.map(j => ({
      type: 'document',
      id: j.id,
      title: j.topic || j.settings?.topic || 'Untitled Document',
      subtitle: j.wordCount ? `${j.wordCount.toLocaleString()} words` : '',
      date: j.createdAt,
      status: j.status,
      raw: j,
    }));

    return [...entryItems, ...jobItems]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  }, [entries, recentJobs]);

  // Onboarding
  const showOnboarding = currentUser && userDocument && !userDocument.onboardingCompleted && entries.length === 0 && !loading;

  const handleOnboardingComplete = async (role, purpose) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        onboardingRole: role,
        onboardingPurpose: purpose,
        onboardingCompleted: true
      });
      await refreshUserDocument();
      navigate('/create');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to save onboarding preferences');
    }
  };

  const canCreate = canCreateEntry(userDocument);
  const hasEntries = entries.length > 0;

  // Navigate to generate page with template settings pre-filled
  const handleTemplateClick = (template) => {
    if (!hasEntries) {
      toast.error('Import sources first before generating a document.');
      return;
    }
    const params = new URLSearchParams({
      template: template.id,
      documentType: template.documentType,
      tone: template.tone,
      targetAudience: template.targetAudience,
      approach: template.approach,
      targetWords: template.targetWords.toString(),
    });
    navigate(`/content/generate?${params.toString()}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const usagePercentage = userDocument?.subscription
    ? Math.min(
        (userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100,
        100
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-[#f5f6f8]">
        <div className="container mx-auto px-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-[#f5f6f8]">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* ── Row 1: Header + Plan Badge ── */}
        <FadeIn direction="left">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-bold text-secondary-900">
              Welcome back, {currentUser?.displayName || 'Researcher'}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadgeColor(userDocument?.subscription)}`}>
              {getPlanLabel(userDocument?.subscription)}
              {isFreePlan(userDocument?.subscription) && userDocument?.subscription && (
                <span className="ml-1 opacity-75">
                  {userDocument.subscription.entriesUsed}/{userDocument.subscription.entriesLimit}
                </span>
              )}
            </span>
          </div>
        </FadeIn>

        {/* ── Row 2: Primary Workflow Cards ── */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card A: Import Sources */}
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-secondary-900">Import Sources</h2>
                    <p className="text-sm text-secondary-500 mt-0.5">PDFs, URLs, DOIs, or RSS feeds</p>
                  </div>
                </div>
                <p className="text-sm text-secondary-600 mb-5">
                  {entries.length} {entries.length === 1 ? 'source' : 'sources'} in your library
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <Link
                    to="/create"
                    className={`btn ${canCreate ? 'bg-primary text-white hover:bg-primary-700' : 'bg-secondary-200 text-secondary-400 cursor-not-allowed'} rounded-lg px-5 py-2 text-sm font-medium transition-colors`}
                    onClick={(e) => {
                      if (!canCreate) {
                        e.preventDefault();
                        toast.error('You have reached your limit. Please upgrade your plan.');
                      }
                    }}
                  >
                    Add Source
                  </Link>
                  <Link
                    to="/sources"
                    className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    View Library <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </StaggerItem>

          {/* Card B: Generate Document */}
          <StaggerItem>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-secondary-900">Generate Document</h2>
                    <p className="text-sm text-secondary-500 mt-0.5">Turn your sources into a polished document</p>
                  </div>
                </div>
                <p className="text-sm text-secondary-600 mb-5">
                  {entries.length} {entries.length === 1 ? 'source' : 'sources'} ready
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (!hasEntries) {
                        toast.error('Import sources first');
                        return;
                      }
                      navigate('/content/generate');
                    }}
                    disabled={!hasEntries}
                    title={!hasEntries ? 'Import sources first' : ''}
                    className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                      hasEntries
                        ? 'bg-primary text-white hover:bg-primary-700'
                        : 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                    }`}
                  >
                    Start Generation
                  </button>
                  <Link
                    to="/content/history"
                    className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    View History <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerChildren>

        {/* ── Row 3: Recent Activity ── */}
        <FadeIn direction="up">
          <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white mb-8">
            <div className="px-6 py-4 border-b border-[#e5e7eb]">
              <h2 className="text-lg font-bold text-secondary-900">Recent Activity</h2>
            </div>

            {(loading || jobsLoading) ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="w-8 h-8 bg-secondary-100 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary-100 rounded w-1/3" />
                        <div className="h-3 bg-secondary-100 rounded w-1/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-secondary-500 text-sm">No activity yet. Import your first source to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#e5e7eb]">
                {recentActivity.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      if (item.type === 'source') {
                        setSelectedEntry(item.raw);
                      } else {
                        navigate(`/content/view/${item.id}`);
                      }
                    }}
                    className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-[#f9fafb] transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === 'source' ? 'bg-blue-50' : 'bg-purple-50'
                    }`}>
                      {item.type === 'source' ? (
                        <Upload className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-secondary-500 truncate">{item.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.type === 'source' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {item.type === 'source' ? 'Source' : 'Document'}
                      </span>
                      {item.status && <StatusBadge status={item.status} />}
                      <span className="text-xs text-secondary-400 whitespace-nowrap">{formatDate(item.date)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {(entries.length > 0 || recentJobs.length > 0) && (
              <div className="px-6 py-3 border-t border-[#e5e7eb] flex items-center gap-6">
                <Link
                  to="/sources"
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All Sources <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/content/history"
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All Documents <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </FadeIn>

        {/* ── Row 4: Quick Start Templates ── */}
        <FadeIn direction="up">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-secondary-900 mb-4">Start from a Template</h2>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentTemplates.map((template) => {
                const IconComponent = iconMap[template.icon] || FileText;
                return (
                  <StaggerItem key={template.id}>
                    <motion.button
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleTemplateClick(template)}
                      className={`border border-[#e5e7eb] rounded-lg bg-white p-5 text-left w-full h-full transition-shadow hover:shadow-md ${
                        !hasEntries ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      disabled={!hasEntries}
                      title={!hasEntries ? 'Import sources first' : `Create ${template.title}`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-secondary-900">{template.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-secondary-500 leading-relaxed">{template.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-secondary-400 bg-secondary-50 px-2 py-0.5 rounded">
                          {template.documentType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-secondary-400 bg-secondary-50 px-2 py-0.5 rounded">
                          ~{template.targetWords.toLocaleString()} words
                        </span>
                      </div>
                    </motion.button>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </FadeIn>

        {/* ── Row 5: Research Feeds (conditional) ── */}
        {hasSubscriptions && (
          <FadeIn direction="up">
            <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white px-6 py-4 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Rss className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm text-secondary-700">
                  <span className="font-semibold text-secondary-900">{feedItemCount}</span>{' '}
                  new {feedItemCount === 1 ? 'paper' : 'papers'} in your research feeds
                </p>
              </div>
              <Link
                to="/feeds"
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                View Feeds <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeIn>
        )}

        {/* ── Row 6: Plan & Usage Footer Bar ── */}
        {userDocument?.subscription && (
          <FadeIn direction="up">
            <div className="border border-[#e5e7eb] rounded-lg bg-white px-6 py-3 flex items-center justify-between">
              {isFreePlan(userDocument.subscription) ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-secondary-900">
                      {getPlanLabel(userDocument.subscription)} Plan
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-secondary-500">
                        {userDocument.subscription.entriesUsed}/{userDocument.subscription.entriesLimit} entries used
                      </span>
                      <div className="w-24 bg-secondary-200/30 rounded-full h-1.5">
                        <motion.div
                          className="bg-primary h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${usagePercentage}%` }}
                          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/pricing"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Upgrade
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-secondary-900">
                      {getPlanLabel(userDocument.subscription)} Plan
                    </span>
                    <span className="text-xs text-secondary-500">
                      Unlimited entries
                    </span>
                    {userDocument.subscription.plan === 'researcher' && (
                      <span className="text-xs text-accent font-medium">All features included</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        setRefreshingSubscription(true);
                        try {
                          const loadingToast = toast.loading('Syncing subscription...');
                          const { forceSyncSubscription } = await import('../services/stripe');
                          const syncResult = await forceSyncSubscription(currentUser.uid);

                          if (syncResult.success) {
                            await refreshUserDocument();
                            toast.dismiss(loadingToast);
                            toast.success('Subscription synced successfully!');
                          } else {
                            toast.dismiss(loadingToast);
                            toast.error('No active subscription found.');
                          }
                        } catch (error) {
                          console.error('Error refreshing subscription:', error);
                          toast.error('Failed to sync subscription.');
                        } finally {
                          setRefreshingSubscription(false);
                        }
                      }}
                      disabled={refreshingSubscription}
                      className="text-xs text-secondary-500 hover:text-secondary-700 font-medium"
                    >
                      {refreshingSubscription ? 'Syncing...' : 'Sync'}
                    </button>
                    {userDocument.subscription.plan === 'student' && (
                      <Link to="/pricing" className="text-sm text-primary font-medium hover:underline">
                        Upgrade to Pro
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="text-sm text-secondary-500 hover:text-secondary-700 font-medium"
                    >
                      Manage Plan
                    </Link>
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        )}

        {/* Entry View Modal */}
        {selectedEntry && (
          <EntryViewModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}

        {/* Onboarding Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      </div>
    </div>
  );
};

export default DashboardPage;

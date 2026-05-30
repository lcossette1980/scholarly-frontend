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
  Plus,
  Sparkles,
} from 'lucide-react';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry } from '../services/stripe';
import { getUserBibliographyEntries } from '../services/bibliography';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EntryViewModal from '../components/EntryViewModal';
import OnboardingModal from '../components/OnboardingModal';
import DashboardStats from '../components/DashboardStats';
import { documentTemplates } from '../data/templates';
import { feedsAPI } from '../services/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const iconMap = { FileText, BookOpen, BarChart3, TrendingUp, Target, Globe };

const getPlanLabel = (subscription) => {
  if (!subscription) return 'Starter';
  const { plan } = subscription;
  if (plan === 'free' || plan === 'trial') return 'Starter';
  if (plan === 'student') return 'Plus';
  if (plan === 'researcher') return 'Pro';
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};

const isFreePlan = (subscription) => {
  if (!subscription) return true;
  return subscription.plan === 'free' || subscription.plan === 'trial';
};

const StatusBadge = ({ status }) => {
  const config = {
    completed: { icon: CheckCircle, label: 'Done', className: 'badge-success' },
    processing: { icon: Clock, label: 'Working', className: 'badge-warning' },
    generating: { icon: Clock, label: 'Generating', className: 'badge-warning' },
    failed: { icon: XCircle, label: 'Failed', className: 'badge-error' },
  };
  const { icon: Icon, label, className } = config[status] || config.processing;
  return (
    <span className={`badge ${className}`}>
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
              await refreshUserDocument();
              await new Promise((resolve) => setTimeout(resolve, 500));

              const { checkSubscriptionStatus, forceSyncSubscription } = await import('../services/stripe');
              let backendStatus = await checkSubscriptionStatus(currentUser.uid);

              if (!backendStatus?.subscription) {
                const syncResult = await forceSyncSubscription(currentUser.uid);
                if (syncResult.success) {
                  backendStatus = { subscription: syncResult.subscription };
                }
              }

              // Manual client-side activation was removed for security. If
              // sync still fails after all retries, the user must contact
              // support — only the Stripe webhook can mint a subscription now.
              if (!backendStatus?.subscription && i === maxRetries - 1) {
                toast.error('Payment received but activation is delayed. Please contact support if your plan does not appear within a few minutes.');
              }

              const { getUserDocument } = await import('../services/auth');
              const latestUserData = await getUserDocument(currentUser.uid);

              if (
                latestUserData?.subscription &&
                (latestUserData.subscription.plan !== previousPlan ||
                  latestUserData.subscription.entriesLimit !== previousLimit) &&
                latestUserData.subscription.plan !== 'trial' &&
                latestUserData.subscription.plan !== 'free'
              ) {
                toast.success(`Your ${latestUserData.subscription.plan} plan is now active with ${latestUserData.subscription.entriesLimit} monthly entries!`);
                await refreshUserDocument();
                break;
              }

              if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay));
              } else {
                toast.error('Subscription update is taking longer than expected. Please use the Sync button.', { duration: 8000 });
              }
            } catch (error) {
              console.error('Error refreshing subscription:', error);
              if (i === maxRetries - 1) {
                toast.error('There was an issue updating your subscription. Please contact support.');
              }
            }
          }
        };

        await refreshWithRetry();
        setRefreshingSubscription(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, currentUser, setSearchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch entries
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
        const q = query(jobsRef, where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(d.data().createdAt || 0),
        }));
        jobsData.sort((a, b) => b.createdAt - a.createdAt);
        setRecentJobs(jobsData.slice(0, 5));
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
    if (!currentUser) return;
    const fetchFeedInfo = async () => {
      try {
        const data = await feedsAPI.getSubscriptions();
        const subs = data.subscriptions || [];
        setHasSubscriptions(subs.length > 0);
        if (subs.length > 0) {
          const itemsData = await feedsAPI.getItems();
          setFeedItemCount((itemsData.items || []).length);
        } else {
          setFeedItemCount(0);
        }
      } catch (error) {
        console.error('Error fetching feed info:', error);
      }
    };
    fetchFeedInfo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchFeedInfo();
    };
    const handleFocus = () => fetchFeedInfo();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser, entries.length]);

  // Build merged recent activity
  const recentActivity = React.useMemo(() => {
    const entryItems = entries.slice(0, 5).map((e) => ({
      type: 'source',
      id: e.id,
      title: e.title || e.metadata?.title || 'Untitled Source',
      subtitle: e.researchFocus || e.metadata?.authors?.[0] || '',
      date: e.createdAt?.toDate ? e.createdAt.toDate() : e.createdAt ? new Date(e.createdAt) : new Date(),
      status: null,
      raw: e,
    }));
    const jobItems = recentJobs.map((j) => ({
      type: 'document',
      id: j.id,
      title: j.refinedTitle || j.outline?.topic || j.outline?.title || j.topic || j.settings?.topic || 'Untitled Document',
      subtitle: j.wordCount ? `${j.wordCount.toLocaleString()} words` : j.estimatedPages ? `~${j.estimatedPages} pages` : '',
      date: j.createdAt,
      status: j.status,
      raw: j,
    }));
    return [...entryItems, ...jobItems].sort((a, b) => b.date - a.date).slice(0, 5);
  }, [entries, recentJobs]);

  // Onboarding
  const showOnboarding = currentUser && userDocument && !userDocument.onboardingCompleted && entries.length === 0 && !loading;
  const handleOnboardingComplete = async (role, purposes) => {
    try {
      // purposes is now an array (multi-select). Store the array as the
      // canonical value; keep the first entry as 'onboardingPurpose' string
      // for backward-compat reads in older code paths.
      const purposesArray = Array.isArray(purposes) ? purposes : (purposes ? [purposes] : []);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        onboardingRole: role,
        onboardingPurpose: purposesArray[0] || null,
        onboardingPurposes: purposesArray,
        onboardingCompleted: true,
      });
      await refreshUserDocument();
      navigate('/create');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to save onboarding preferences');
      // Re-throw so the modal's catch block re-enables the button
      throw error;
    }
  };

  const canCreate = canCreateEntry(userDocument);
  const hasEntries = entries.length > 0;

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
    ? Math.min(((userDocument.subscription.entriesUsed || 0) / (userDocument.subscription.entriesLimit || 5)) * 100, 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50/40">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50/40">
      <SEO title="Dashboard" noIndex={true} />
      <div className="max-w-6xl mx-auto px-6 py-8 lg:py-10">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight">
              Welcome back, <span className="text-secondary-600 font-normal">{currentUser?.displayName?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="mt-1 text-sm text-secondary-500">
              {hasEntries
                ? `${entries.length} ${entries.length === 1 ? 'source' : 'sources'} · ${recentJobs.length} ${recentJobs.length === 1 ? 'document' : 'documents'}`
                : 'Import your first source to get started'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-neutral">{getPlanLabel(userDocument?.subscription)}</span>
            {isFreePlan(userDocument?.subscription) && userDocument?.subscription && (
              <span className="text-xs text-secondary-500 tabular-nums">
                {userDocument.subscription.entriesUsed || 0} / {userDocument.subscription.entriesLimit || 5}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats entries={entries} loading={loading} />
        </div>

        {/* Primary actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Import */}
          <div className="rounded-lg border border-secondary-200 bg-white p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <Link to="/sources" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors inline-flex items-center gap-1">
                Library
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <h2 className="text-base font-semibold text-secondary-900 mb-1">Import sources</h2>
            <p className="text-sm text-secondary-600 mb-5">
              {entries.length} {entries.length === 1 ? 'source' : 'sources'} in your library. Add PDFs, URLs, DOIs, or RSS feeds.
            </p>
            <div className="mt-auto">
              <Link
                to="/create"
                className={`btn btn-primary ${!canCreate ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={(e) => {
                  if (!canCreate) {
                    e.preventDefault();
                    toast.error('You have reached your limit. Please upgrade your plan.');
                  }
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add source
              </Link>
            </div>
          </div>

          {/* Generate */}
          <div className="rounded-lg border border-secondary-200 bg-white p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent-600" />
              </div>
              <Link to="/content/history" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors inline-flex items-center gap-1">
                History
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <h2 className="text-base font-semibold text-secondary-900 mb-1">Generate document</h2>
            <p className="text-sm text-secondary-600 mb-5">
              {hasEntries
                ? 'Turn your sources into a polished, citation-backed document.'
                : 'Import sources first, then generate a document from them.'}
            </p>
            <div className="mt-auto">
              <button
                onClick={() => {
                  if (!hasEntries) {
                    toast.error('Import sources first');
                    return;
                  }
                  navigate('/content/generate');
                }}
                disabled={!hasEntries}
                className="btn btn-primary disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start generation
              </button>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-lg border border-secondary-200 bg-white mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-secondary-200">
            <h2 className="text-sm font-semibold text-secondary-900">Recent activity</h2>
            {(entries.length > 0 || recentJobs.length > 0) && (
              <div className="flex items-center gap-4">
                <Link to="/sources" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors">All sources</Link>
                <Link to="/content/history" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors">All documents</Link>
              </div>
            )}
          </div>

          {(loading || jobsLoading) ? (
            <div className="p-5">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-7 h-7 bg-secondary-100 rounded-md" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-secondary-100 rounded w-1/3" />
                      <div className="h-2.5 bg-secondary-100 rounded w-1/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="w-10 h-10 rounded-md bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-5 h-5 text-secondary-400" />
              </div>
              <h3 className="text-base font-semibold text-secondary-900 mb-1">Nothing here yet</h3>
              <p className="text-sm text-secondary-500 mb-5 max-w-sm mx-auto">
                Import a source or generate a document — your activity will show up here.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link
                  to="/create"
                  className={`btn btn-primary btn-sm ${!canCreate ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={(e) => {
                    if (!canCreate) {
                      e.preventDefault();
                      toast.error('You have reached your limit. Please upgrade your plan.');
                    }
                  }}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import sources
                </Link>
                <button
                  onClick={() => {
                    if (!hasEntries) {
                      toast.error('Import sources first');
                      return;
                    }
                    navigate('/content/generate');
                  }}
                  disabled={!hasEntries}
                  className="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Generate
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-secondary-100">
              {recentActivity.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    if (item.type === 'source') setSelectedEntry(item.raw);
                    else navigate(`/content/view/${item.id}`);
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-secondary-50/60 transition-colors text-left group"
                >
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                    item.type === 'source' ? 'bg-primary/10' : 'bg-accent/10'
                  }`}>
                    {item.type === 'source' ? (
                      <Upload className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-accent-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">{item.title}</p>
                    {item.subtitle && <p className="text-xs text-secondary-500 truncate">{item.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    {item.status && <StatusBadge status={item.status} />}
                    <span className="text-xs text-secondary-500 whitespace-nowrap tabular-nums">{formatDate(item.date)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-secondary-300 group-hover:text-secondary-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-secondary-900">Start from a template</h2>
            <span className="text-xs text-secondary-500">{documentTemplates.length} templates</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documentTemplates.map((template) => {
              const IconComponent = iconMap[template.icon] || FileText;
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  disabled={!hasEntries}
                  title={!hasEntries ? 'Import sources first' : `Create ${template.title}`}
                  className={`rounded-lg border border-secondary-200 bg-white p-4 text-left transition-colors ${
                    hasEntries ? 'hover:border-secondary-400 hover:bg-secondary-50/40 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-7 h-7 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-3.5 h-3.5 text-secondary-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-secondary-900 pt-0.5">{template.title}</h3>
                  </div>
                  <p className="text-xs text-secondary-600 leading-relaxed mb-3 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-secondary-500 bg-secondary-100 px-1.5 py-0.5 rounded">
                      {template.documentType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-secondary-500 bg-secondary-100 px-1.5 py-0.5 rounded">
                      ~{template.targetWords.toLocaleString()}w
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feeds banner */}
        {hasSubscriptions && (
          <div className="rounded-lg border border-secondary-200 bg-white px-5 py-3 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-warning/10 flex items-center justify-center">
                <Rss className="w-3.5 h-3.5 text-warning-700" />
              </div>
              <p className="text-sm text-secondary-700">
                <span className="font-semibold text-secondary-900 tabular-nums">{feedItemCount}</span>{' '}
                new {feedItemCount === 1 ? 'paper' : 'papers'} in your research feeds
              </p>
            </div>
            <Link to="/feeds" className="btn btn-ghost btn-sm">
              View feeds
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Plan footer */}
        {userDocument?.subscription && (
          <div className="rounded-lg border border-secondary-200 bg-white px-5 py-3 flex items-center justify-between flex-wrap gap-3">
            {isFreePlan(userDocument.subscription) ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-secondary-900">{getPlanLabel(userDocument.subscription)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary-200 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-primary h-1 transition-all"
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-secondary-500 tabular-nums">
                      {userDocument.subscription.entriesUsed || 0}/{userDocument.subscription.entriesLimit || 5}
                    </span>
                  </div>
                </div>
                <Link to="/pricing" className="btn btn-primary-brand btn-sm">
                  Upgrade
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-secondary-900">{getPlanLabel(userDocument.subscription)}</span>
                  <span className="text-xs text-secondary-500">Unlimited sources</span>
                  {userDocument.subscription.plan === 'researcher' && (
                    <span className="badge badge-success">All features</span>
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
                    className="text-xs text-secondary-500 hover:text-secondary-900 font-medium transition-colors"
                  >
                    {refreshingSubscription ? 'Syncing...' : 'Sync'}
                  </button>
                  {userDocument.subscription.plan === 'student' && (
                    <Link to="/pricing" className="btn btn-secondary btn-sm">
                      Upgrade to Pro
                    </Link>
                  )}
                  <Link to="/profile" className="text-xs text-secondary-500 hover:text-secondary-900 font-medium transition-colors">
                    Manage
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Modals */}
        {selectedEntry && (
          <EntryViewModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
        )}
        <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      </div>
    </div>
  );
};

export default DashboardPage;

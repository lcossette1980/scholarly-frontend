// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowRight,
  Check,
  Lock,
  Download
  } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry } from '../services/stripe';
import { getUserBibliographyEntries, deleteBibliographyEntry } from '../services/bibliography';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ContentGenerationCard from '../components/ContentGenerationCard';
import DashboardStats from '../components/DashboardStats';
import RecentEntriesCard from '../components/RecentEntriesCard';
import EntryViewModal from '../components/EntryViewModal';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { currentUser, userDocument, refreshUserDocument } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
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

        // Show initial success message with plan info
        const planName = planId ? planId.charAt(0).toUpperCase() + planId.slice(1) : 'your';
        toast.success(`Payment successful! Activating your ${planName} plan...`);

        // Clean up URL immediately to prevent re-triggering
        searchParams.delete('success');
        searchParams.delete('plan');
        setSearchParams(searchParams);

        // Wait a moment for webhook to process, then refresh subscription data
        const refreshWithRetry = async (maxRetries = 20, delay = 1500) => {
          let previousPlan = userDocument?.subscription?.plan;
          let previousLimit = userDocument?.subscription?.entriesLimit;

          for (let i = 0; i < maxRetries; i++) {
            try {
              console.log(`Refresh attempt ${i + 1}/${maxRetries}`);
              await refreshUserDocument();

              // Wait a bit for the state to update
              await new Promise(resolve => setTimeout(resolve, 500));

              // First try to check subscription status from backend
              const { checkSubscriptionStatus, forceSyncSubscription, manuallyActivateSubscription } = await import('../services/stripe');

              // Try different methods to sync subscription
              let backendStatus = await checkSubscriptionStatus(currentUser.uid);

              // If backend check fails, try force sync
              if (!backendStatus?.subscription) {
                console.log('Backend check failed, trying force sync...');
                const syncResult = await forceSyncSubscription(currentUser.uid);
                if (syncResult.success) {
                  backendStatus = { subscription: syncResult.subscription };
                }
              }

              // If still no subscription, check localStorage for pending subscription
              if (!backendStatus?.subscription) {
                const pendingSubStr = localStorage.getItem('pendingSubscription');
                if (pendingSubStr) {
                  try {
                    const pendingSub = JSON.parse(pendingSubStr);
                    // Check if it's recent (within last hour) and matches current user
                    if (pendingSub.userId === currentUser.uid &&
                        Date.now() - pendingSub.timestamp < 3600000) {
                      planId = planId || pendingSub.planId;
                    }
                  } catch (e) {
                    console.error('Error parsing pending subscription:', e);
                  }
                }
              }

              // If still no subscription and we have a planId, manually activate as last resort
              if (!backendStatus?.subscription && planId && i === maxRetries - 1) {
                console.log('All sync methods failed, manually activating subscription...');
                try {
                  const manualSubscription = await manuallyActivateSubscription(currentUser.uid, planId);
                  backendStatus = { subscription: manualSubscription };
                  // Clear pending subscription from localStorage
                  localStorage.removeItem('pendingSubscription');
                  toast.warning('Subscription activated manually. If this persists, please contact support.');
                } catch (manualError) {
                  console.error('Manual activation failed:', manualError);
                }
              }

              // Force a re-check by getting the latest user document
              const { getUserDocument } = await import('../services/auth');
              const latestUserData = await getUserDocument(currentUser.uid);

              console.log('Backend subscription status:', backendStatus);
              console.log('Latest user data:', latestUserData);

              // Check if subscription has been updated
              if (latestUserData?.subscription &&
                  (latestUserData.subscription.plan !== previousPlan ||
                   latestUserData.subscription.entriesLimit !== previousLimit) &&
                  latestUserData.subscription.plan !== 'trial' &&
                  latestUserData.subscription.plan !== 'free') {
                console.log('Subscription successfully updated:', latestUserData.subscription);
                toast.success(`Your ${latestUserData.subscription.plan} plan is now active with ${latestUserData.subscription.entriesLimit} monthly entries!`);

                // Force refresh the auth context
                await refreshUserDocument();
                break;
              }

              if (i < maxRetries - 1) {
                console.log(`Subscription not updated yet (plan: ${latestUserData?.subscription?.plan}, limit: ${latestUserData?.subscription?.entriesLimit}), retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              } else {
                // Final attempt - show manual refresh option
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
  }, [searchParams, currentUser, setSearchParams]); // Remove userDocument and refreshUserDocument from deps to prevent loops

  // Fetch user's bibliography entries from Firestore
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

  // Handler functions for entry actions
  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
  };

  const handleAnalyzeEntry = (entry) => {
    navigate(`/analyze?entry=${entry.id}`);
  };

  const handleDeleteEntry = async (entry) => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteBibliographyEntry(currentUser.uid, entry.id);
      setEntries(prevEntries => prevEntries.filter(e => e.id !== entry.id));
      toast.success('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleExportAll = () => {
    navigate('/sources');
  };

  const canCreate = canCreateEntry(userDocument);

  const handleCreateNew = () => {
    if (!canCreate) {
      toast.error('You have reached your monthly limit. Please upgrade your plan.');
      return;
    }
    // Navigate to create page
  };

  const usagePercentage = userDocument?.subscription
    ? Math.min(
        (userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100,
        100
      )
    : 0;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-secondary-50 via-white to-accent-50/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <FadeIn direction="left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                Welcome back, {currentUser?.displayName || 'Researcher'}!
              </h1>
              <p className="text-secondary-700">
                Manage your sources and generate content.
              </p>
            </div>

            <div className="mt-4 lg:mt-0">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/create"
                  onClick={handleCreateNew}
                  className={`btn ${canCreate ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Entry
                </Link>
              </motion.div>
            </div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <DashboardStats entries={entries} loading={loading} />

        {/* Content Generation Discovery Card */}
        {!loading && entries.length > 0 && (
          <ContentGenerationCard entries={entries} />
        )}

        {/* Recent Entries Section */}
        <div className="mb-8">
          <RecentEntriesCard
            entries={entries.slice(0, 5)}
            loading={loading}
            onView={handleViewEntry}
            onAnalyze={handleAnalyzeEntry}
            onDelete={handleDeleteEntry}
          />
        </div>

        {/* Quick Actions */}
        {!loading && entries.length > 0 && (
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StaggerItem>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/content/generate"
                  className="card group block h-full"
                >
                  <h3 className="font-semibold text-secondary-900 mb-1">Generate Content</h3>
                  <p className="text-sm text-secondary-500 mb-3">Create content from your sources</p>
                  <span className="text-accent text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </Link>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/sources"
                  className="card group block h-full"
                >
                  <h3 className="font-semibold text-secondary-900 mb-1">Idea & Outline</h3>
                  <p className="text-sm text-secondary-500 mb-3">Analyze sources for topics</p>
                  <span className="text-accent text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </Link>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={handleExportAll}
                  className="card group text-left w-full h-full"
                >
                  <h3 className="font-semibold text-secondary-900 mb-1">Export</h3>
                  <p className="text-sm text-secondary-500 mb-3">Download source summaries</p>
                  <span className="text-accent text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Export <Download className="w-3.5 h-3.5 ml-1" />
                  </span>
                </button>
              </motion.div>
            </StaggerItem>
          </StaggerChildren>
        )}

        {/* Usage Progress / Plan Features */}
        {userDocument?.subscription && (
          <FadeIn direction="up">
            <div className="card mb-8">
              {userDocument.subscription.plan === 'free' || userDocument.subscription.plan === 'trial' ? (
                // Free users: Show usage bar
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Lifetime Usage
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        Starter Plan
                      </p>
                    </div>
                    <Link to="/pricing" className="btn btn-primary btn-sm">
                      Upgrade
                    </Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-700">
                        {userDocument.subscription.entriesUsed} of {userDocument.subscription.entriesLimit} entries used
                      </span>
                      <span className="text-accent font-medium">
                        {Math.round(usagePercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200/30 rounded-full h-2">
                      <motion.div
                        className="bg-accent h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${usagePercentage}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    {userDocument.subscription.entriesUsed >= userDocument.subscription.entriesLimit && (
                      <p className="text-sm text-accent mt-2">
                        You've reached your limit. Upgrade for unlimited entries!
                      </p>
                    )}
                  </div>
                </>
              ) : (
                // Paid users: Show features
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        Your Plan Features
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        {userDocument.subscription.plan === 'student' ? 'Plus' : userDocument.subscription.plan === 'researcher' ? 'Pro' : 'Starter'} Plan
                      </p>
                    </div>
                    <div className="flex space-x-2">
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
                        className="btn btn-outline btn-sm"
                      >
                        {refreshingSubscription ? (
                          <div className="w-4 h-4 border-2 border-accent-600/30 border-t-accent rounded-full animate-spin" />
                        ) : (
                          'Sync'
                        )}
                      </button>
                      {userDocument.subscription.plan === 'student' && (
                        <Link to="/pricing" className="btn btn-outline btn-sm">
                          Upgrade to Pro
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {/* Bibliography Generator - Always unlimited for paid */}
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-accent" />
                      <span className="text-secondary-900">Source Generator (Unlimited)</span>
                    </div>

                    {/* Topic & Outline Generator - Researcher only */}
                    {userDocument.subscription.plan === 'researcher' ? (
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-accent" />
                        <span className="text-secondary-900">Idea & Outline Generator (Unlimited)</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-secondary-300" />
                        <span className="text-secondary-600">
                          Idea & Outline Generator
                          <Link to="/pricing" className="text-accent ml-2 hover:underline">Upgrade to unlock</Link>
                        </span>
                      </div>
                    )}
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
      </div>
    </div>
  );
};

export default DashboardPage;

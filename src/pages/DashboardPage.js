// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  BookOpen,
  Brain,
  Sparkles,
  CheckCircle,
  Lock,
  Download
  } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry } from '../services/stripe';
import { getUserBibliographyEntries, deleteBibliographyEntry } from '../services/bibliography';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ContentGenerationCard from '../components/ContentGenerationCard';
import DashboardStats from '../components/DashboardStats';
import RecentEntriesCard from '../components/RecentEntriesCard';
import EntryViewModal from '../components/EntryViewModal';
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
          toast.error('Failed to load bibliography entries');
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        toast.error('Failed to load bibliography entries');
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
    toast('Export functionality coming soon!', { icon: '📥' });
  };

  const canCreate = canCreateEntry(userDocument);

  const handleCreateNew = () => {
    if (!canCreate) {
      toast.error('You have reached your monthly limit. Please upgrade your plan.');
      return;
    }
    // Navigate to create page
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal font-playfair mb-2">
              Welcome back, {currentUser?.displayName || 'Researcher'}!
            </h1>
            <p className="text-charcoal/70 font-lato">
              Manage your research and generate content from your sources.
            </p>
          </div>

          <div className="mt-4 lg:mt-0">
            <Link
              to="/create"
              onClick={handleCreateNew}
              className={`btn ${canCreate ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Entry
            </Link>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/content/generate"
              className="card card-hover group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal font-playfair">Generate Content</h3>
                  <p className="text-sm text-charcoal/60 font-lato">Create papers from sources</p>
                </div>
              </div>
            </Link>

            <Link
              to="/bibliography"
              className="card card-hover group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal font-playfair">Topic & Outline</h3>
                  <p className="text-sm text-charcoal/60 font-lato">Analyze bibliography</p>
                </div>
              </div>
            </Link>

            <button
              onClick={handleExportAll}
              className="card card-hover group text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal font-playfair">Export</h3>
                  <p className="text-sm text-charcoal/60 font-lato">Download bibliography</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Usage Progress / Plan Features */}
        {userDocument?.subscription && (
          <div className="card mb-8">
            {userDocument.subscription.plan === 'free' || userDocument.subscription.plan === 'trial' ? (
              // Free users: Show usage bar
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal font-playfair">
                      Lifetime Usage
                    </h3>
                    <p className="text-charcoal/60 text-sm font-lato">
                      Free Plan
                    </p>
                  </div>
                  <Link to="/pricing" className="btn btn-primary btn-sm">
                    Upgrade
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">
                      {userDocument.subscription.entriesUsed} of {userDocument.subscription.entriesLimit} entries used
                    </span>
                    <span className="text-chestnut font-medium">
                      {Math.round((userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-khaki/30 rounded-full h-2">
                    <div
                      className="bg-chestnut h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100,
                          100
                        )}%`
                      }}
                    />
                  </div>
                  {userDocument.subscription.entriesUsed >= userDocument.subscription.entriesLimit && (
                    <p className="text-sm text-chestnut mt-2">
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
                    <h3 className="text-lg font-semibold text-charcoal font-playfair">
                      Your Plan Features
                    </h3>
                    <p className="text-charcoal/60 text-sm font-lato capitalize">
                      {userDocument.subscription.plan} Plan
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
                        <div className="w-4 h-4 border-2 border-chestnut/30 border-t-chestnut rounded-full animate-spin" />
                      ) : (
                        'Sync'
                      )}
                    </button>
                    {userDocument.subscription.plan === 'student' && (
                      <Link to="/pricing" className="btn btn-outline btn-sm">
                        Upgrade to Researcher
                      </Link>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {/* Bibliography Generator - Always unlimited for paid */}
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-charcoal font-lato">Bibliography Generator (Unlimited)</span>
                  </div>

                  {/* Topic & Outline Generator - Researcher only */}
                  {userDocument.subscription.plan === 'researcher' ? (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-charcoal font-lato">Topic & Outline Generator (Unlimited)</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <span className="text-charcoal/60 font-lato">
                        Topic & Outline Generator
                        <Link to="/pricing" className="text-chestnut ml-2 hover:underline">Upgrade to unlock</Link>
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
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
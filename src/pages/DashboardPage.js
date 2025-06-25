// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Clock,
  BookOpen,
  ChevronLeft,
  Quote
  } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry } from '../services/stripe';
import { getUserBibliographyEntries } from '../services/bibliography';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { currentUser, userDocument, refreshUserDocument } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
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
              const { checkSubscriptionStatus } = await import('../services/stripe');
              const backendStatus = await checkSubscriptionStatus(currentUser.uid);
              
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
        const result = await getUserBibliographyEntries(currentUser.uid, 20);
        
        if (result.success) {
          // Transform the entries to match the display format
          const transformedEntries = result.entries.map(entry => {
            // Parse citation to extract author, year, title, journal
            const citationParts = parseCitation(entry.citation);
            
            return {
              id: entry.id,
              title: citationParts.title || 'Untitled',
              authors: citationParts.authors || 'Unknown Authors',
              journal: citationParts.journal || 'Unknown Journal',
              year: citationParts.year || 'N/A',
              researchFocus: entry.researchFocus,
              createdAt: entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date(),
              status: 'completed',
              type: 'journal-article',
              // Store full entry data for viewing/editing
              fullData: entry
            };
          });
          
          setEntries(transformedEntries);
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

  // Helper function to parse citation
  const parseCitation = (citation) => {
    if (!citation) return {};
    
    try {
      // Example citation format: "Arslan, A., Cooper, C., Khan, Z., Golgeci, I., & Ali, I. (2020). Artificial intelligence and human workers interaction at team level: A conceptual assessment of the challenges and potential HRM strategies. International Journal of Management, 43. https://doi.org/10.1108/IJM-01-2021-0052"
      
      // Extract authors (everything before the year in parentheses)
      const yearMatch = citation.match(/\((\d{4})\)/);
      const year = yearMatch ? yearMatch[1] : null;
      
      const authorsEndIndex = yearMatch ? citation.indexOf(yearMatch[0]) : -1;
      const authors = authorsEndIndex > 0 ? citation.substring(0, authorsEndIndex).trim() : '';
      
      // Extract title (after year, before journal name - usually ends with a period)
      const afterYear = yearMatch ? citation.substring(citation.indexOf(yearMatch[0]) + yearMatch[0].length).trim() : '';
      const titleMatch = afterYear.match(/^(.+?)\.\s*([^,]+)/);
      const title = titleMatch ? titleMatch[1] : '';
      const journal = titleMatch ? titleMatch[2] : '';
      
      return {
        authors,
        year,
        title,
        journal
      };
    } catch (error) {
      console.error('Error parsing citation:', error);
      return {};
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.researchFocus.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || entry.status === filterBy;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const stats = {
    totalEntries: entries.length,
    thisMonth: entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length,
    inProgress: entries.filter(entry => entry.status === 'processing').length,
    completed: entries.filter(entry => entry.status === 'completed').length
  };

  const canCreate = canCreateEntry(userDocument);

  const handleCreateNew = () => {
    if (!canCreate) {
      toast.error('You have reached your monthly limit. Please upgrade your plan.');
      return;
    }
    // Navigate to create page
  };

  const StatCard = ({ icon: Icon, title, value, change, color = 'chestnut' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-charcoal/60 font-lato">{title}</p>
          <p className="text-3xl font-bold text-charcoal font-playfair">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-1 text-${color}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}/10 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </div>
  );

  const EntryCard = ({ entry }) => (
    <div className="card card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              entry.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {entry.status === 'completed' ? 'Completed' : 'Processing'}
            </span>
            <span className="px-2 py-1 bg-chestnut/10 text-chestnut rounded-full text-xs font-medium">
              {entry.researchFocus}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2 line-clamp-2">
            {entry.title}
          </h3>
          <p className="text-charcoal/70 text-sm font-lato mb-2">
            {entry.authors} ({entry.year})
          </p>
          <p className="text-charcoal/60 text-sm font-lato">
            {entry.journal}
          </p>
        </div>
        
        <div className="flex items-center ml-4">
          <button 
            className="p-2 text-charcoal/60 hover:text-chestnut hover:bg-chestnut/10 rounded-lg transition-colors"
            onClick={() => setSelectedEntry(entry)}
            title="View entry details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-charcoal/60">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span className="capitalize">{entry.type.replace('-', ' ')}</span>
        </div>
      </div>
    </div>
  );

  const EntryView = ({ entry, onBack }) => {
    const entryData = entry.fullData;
    
    return (
      <div>
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-chestnut hover:text-chestnut/80 transition-colors mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-lato">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              entry.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {entry.status === 'completed' ? 'Completed' : 'Processing'}
            </span>
            <span className="px-2 py-1 bg-chestnut/10 text-chestnut rounded-full text-xs font-medium">
              {entry.researchFocus}
            </span>
          </div>
        </div>

        {/* Entry Details */}
        <div className="space-y-6">
          {/* Citation */}
          <div className="card">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Citation</h2>
            <div className="bg-bone/50 border border-khaki/30 rounded-lg p-4">
              <p className="text-charcoal font-lato leading-relaxed">
                {entryData.citation}
              </p>
            </div>
          </div>

          {/* Summary */}
          {entryData.summary && (
            <div className="card">
              <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Summary</h2>
              <p className="text-charcoal/80 font-lato leading-relaxed whitespace-pre-line">
                {entryData.summary}
              </p>
            </div>
          )}

          {/* Key Findings */}
          {entryData.keyFindings && (
            <div className="card">
              <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Key Findings</h2>
              <p className="text-charcoal/80 font-lato leading-relaxed whitespace-pre-line">
                {entryData.keyFindings}
              </p>
            </div>
          )}

          {/* Methodology */}
          {entryData.methodology && (
            <div className="card">
              <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Methodology</h2>
              <p className="text-charcoal/80 font-lato leading-relaxed whitespace-pre-line">
                {entryData.methodology}
              </p>
            </div>
          )}

          {/* Quotes */}
          {entryData.quotes && entryData.quotes.length > 0 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Key Quotes</h2>
              <div className="space-y-4">
                {entryData.quotes.map((quote, index) => (
                  <div key={index} className="border-l-4 border-chestnut pl-4">
                    <div className="flex items-start space-x-2">
                      <Quote className="w-4 h-4 text-chestnut mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-charcoal/80 font-lato italic leading-relaxed mb-2">
                          "{quote.text}"
                        </p>
                        <p className="text-charcoal/60 text-sm font-lato">
                          Page {quote.page}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research Focus */}
          <div className="card">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Research Focus</h2>
            <p className="text-charcoal/80 font-lato leading-relaxed">
              {entry.researchFocus}
            </p>
          </div>

          {/* Entry Metadata */}
          <div className="card">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">Entry Details</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-charcoal/60 font-lato">Created:</span>
                <span className="ml-2 text-charcoal font-lato">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-charcoal/60 font-lato">Type:</span>
                <span className="ml-2 text-charcoal font-lato capitalize">
                  {entry.type.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-charcoal/60 font-lato">Status:</span>
                <span className="ml-2 text-charcoal font-lato capitalize">
                  {entry.status}
                </span>
              </div>
              {entryData.citationStyle && (
                <div>
                  <span className="text-charcoal/60 font-lato">Citation Style:</span>
                  <span className="ml-2 text-charcoal font-lato">
                    {entryData.citationStyle}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        {selectedEntry ? (
          <EntryView 
            entry={selectedEntry} 
            onBack={() => setSelectedEntry(null)} 
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-charcoal font-playfair mb-2">
                  Welcome back, {currentUser?.displayName || 'Researcher'}!
                </h1>
                <p className="text-charcoal/70 font-lato">
                  Manage your bibliography entries and track your research progress.
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                <Link
                  to="/bibliography"
                  className="btn btn-outline"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Manage Bibliography
                </Link>
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
        {loading ? (
          <LoadingSkeleton variant="dashboard-stats" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FileText}
            title="Total Entries"
            value={stats.totalEntries}
            change="+12% from last month"
          />
          <StatCard
            icon={Calendar}
            title="This Month"
            value={stats.thisMonth}
            change="+3 this week"
          />
          <StatCard
            icon={Clock}
            title="In Progress"
            value={stats.inProgress}
            color="yellow-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Completed"
            value={stats.completed}
            change="85% completion rate"
            color="green-600"
          />
          </div>
        )}

        {/* Usage Progress */}
        {userDocument?.subscription && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-charcoal font-playfair">
                  Monthly Usage
                </h3>
                <p className="text-charcoal/60 text-sm font-lato">
                  {userDocument.subscription.plan.charAt(0).toUpperCase() + userDocument.subscription.plan.slice(1)} Plan
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    setRefreshingSubscription(true);
                    try {
                      // Try to sync with backend first
                      const { checkSubscriptionStatus } = await import('../services/stripe');
                      const backendStatus = await checkSubscriptionStatus(currentUser.uid);
                      
                      if (backendStatus?.subscription) {
                        console.log('Synced subscription from backend:', backendStatus.subscription);
                      }
                      
                      // Then refresh from Firestore
                      await refreshUserDocument();
                      
                      // Get the latest data to verify
                      const { getUserDocument } = await import('../services/auth');
                      const latestData = await getUserDocument(currentUser.uid);
                      
                      if (latestData?.subscription) {
                        toast.success(`Subscription refreshed! ${latestData.subscription.plan} plan with ${latestData.subscription.entriesLimit} entries/month`);
                      } else {
                        toast.success('Subscription data refreshed!');
                      }
                    } catch (error) {
                      console.error('Error refreshing subscription:', error);
                      toast.error('Failed to refresh subscription data');
                    } finally {
                      setRefreshingSubscription(false);
                    }
                  }}
                  disabled={refreshingSubscription}
                  className="btn btn-outline btn-sm"
                  title="Refresh subscription data"
                >
                  {refreshingSubscription ? (
                    <div className="w-4 h-4 border-2 border-chestnut/30 border-t-chestnut rounded-full animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </button>
                <Link to="/pricing" className="btn btn-outline">
                  Upgrade Plan
                </Link>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/70">
                  {refreshingSubscription ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-chestnut/30 border-t-chestnut rounded-full animate-spin mr-2" />
                      Updating subscription...
                    </span>
                  ) : (
                    <>
                      {userDocument.subscription.entriesUsed} of {
                        userDocument.subscription.entriesLimit === -1 
                          ? 'unlimited' 
                          : userDocument.subscription.entriesLimit
                      } entries used
                    </>
                  )}
                </span>
                <span className="text-chestnut font-medium">
                  {refreshingSubscription ? (
                    '...'
                  ) : (
                    userDocument.subscription.entriesLimit === -1 
                      ? '∞' 
                      : Math.round((userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100)
                  )}%
                </span>
              </div>
              
              {userDocument.subscription.entriesLimit !== -1 && (
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
              )}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search entries..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-charcoal/60" />
                <select
                  className="form-input min-w-0"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
              
              <select
                className="form-input min-w-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-charcoal font-playfair">
              Your Bibliography Entries
            </h2>
            <span className="text-charcoal/60 font-lato">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card">
                  <div className="animate-pulse">
                    <div className="h-4 bg-khaki/30 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-khaki/30 rounded w-full mb-2"></div>
                    <div className="h-4 bg-khaki/30 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-khaki/30 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-charcoal/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal font-playfair mb-2">
                {searchTerm || filterBy !== 'all' ? 'No entries found' : 'No entries yet'}
              </h3>
              <p className="text-charcoal/60 font-lato mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Create your first bibliography entry to get started.'
                }
              </p>
              {(!searchTerm && filterBy === 'all') && (
                <Link to="/create" className="btn btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Entry
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
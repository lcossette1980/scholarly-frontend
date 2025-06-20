// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Download, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Clock
  } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry } from '../services/stripe';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { currentUser, userDocument } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - replace with actual Firestore queries
  const mockEntries = [
    {
      id: '1',
      title: 'The Digital Transformation Leadership Framework',
      authors: 'Weber, E., Krehl, E., & Büttgen, M.',
      journal: 'Journal of Leadership Studies',
      year: '2022',
      researchFocus: 'AI Leadership',
      createdAt: new Date('2024-01-15'),
      status: 'completed',
      type: 'journal-article'
    },
    {
      id: '2',
      title: 'Machine Learning Ethics in Academic Research',
      authors: 'Smith, J., Johnson, A.',
      journal: 'AI Ethics Review',
      year: '2023',
      researchFocus: 'AI Ethics',
      createdAt: new Date('2024-01-10'),
      status: 'processing',
      type: 'journal-article'
    },
    {
      id: '3',
      title: 'Digital Innovation in Higher Education',
      authors: 'Brown, K., Davis, L., Wilson, M.',
      journal: 'Education Technology Research',
      year: '2023',
      researchFocus: 'Digital Transformation',
      createdAt: new Date('2024-01-05'),
      status: 'completed',
      type: 'journal-article'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setEntries(mockEntries);
      setLoading(false);
    }, 1000);
  }, []);

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
        
        <div className="flex items-center space-x-2 ml-4">
          <button className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
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
              Manage your bibliography entries and track your research progress.
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
              <Link to="/pricing" className="btn btn-outline">
                Upgrade Plan
              </Link>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/70">
                  {userDocument.subscription.entriesUsed} of {
                    userDocument.subscription.entriesLimit === -1 
                      ? 'unlimited' 
                      : userDocument.subscription.entriesLimit
                  } entries used
                </span>
                <span className="text-chestnut font-medium">
                  {userDocument.subscription.entriesLimit === -1 
                    ? '∞' 
                    : Math.round((userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100)
                  }%
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
      </div>
    </div>
  );
};

export default DashboardPage;
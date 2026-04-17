// src/pages/ContentHistoryPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Download,
  Trash2,
  Eye,
  Filter,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import toast from 'react-hot-toast';
import { exportGeneratedContent } from '../utils/contentExportUtils';
import { FadeIn, StaggerChildren, StaggerItem, AnimatedCounter } from '../components/motion';
import { motion } from 'framer-motion';

const ContentHistoryPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [currentUser]);

  const fetchJobs = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const jobsRef = collection(db, 'content_generation_jobs');
      const q = query(
        jobsRef,
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);

      const jobsData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(d.data().createdAt || 0)
      }));

      // Sort by createdAt descending (avoids Firestore composite index requirement)
      jobsData.sort((a, b) => b.createdAt - a.createdAt);

      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load content history');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.outline?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.settings?.document_type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesTier = filterTier === 'all' || job.tier === filterTier;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this generation? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'content_generation_jobs', jobId));
      setJobs(jobs.filter(j => j.id !== jobId));
      toast.success('Generation deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete generation');
    }
  };

  const getDocTitle = (job) => {
    return (job.refinedTitle || job.outline?.topic || job.outline?.title || 'Generated Content')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 60);
  };

  const handleDownloadTxt = (job) => {
    const blob = new Blob([job.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getDocTitle(job)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded as TXT');
  };

  const handleDownloadWord = async (job) => {
    try {
      await exportGeneratedContent(job);
      toast.success('Downloaded as Word document');
    } catch (error) {
      console.error('Error downloading Word:', error);
      toast.error('Failed to download Word document');
    }
  };

  const handleView = (job) => {
    navigate(`/content/view/${job.id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-primary animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-primary/10 text-primary';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-secondary-700">Loading your content history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8 bg-mesh">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/dashboard" className="text-secondary-600 hover:text-secondary-900 transition-colors">
              Dashboard
            </Link>
            <span className="text-secondary-400">/</span>
            <span className="text-secondary-900 font-medium">Content History</span>
          </div>
        </div>

        {/* Header */}
        <FadeIn direction="left">
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900">
                  Content History
                </h1>
                <p className="text-sm sm:text-base text-secondary-700">
                  View, download, and manage your generated content
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn>
          <div className="card card-floating mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title or type..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-secondary-600" />
                  <select
                    className="form-input min-w-0"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <select
                  className="form-input min-w-0"
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                >
                  <option value="all">All Tiers</option>
                  <option value="standard">Standard</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Stats Summary */}
        <StaggerChildren>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StaggerItem>
              <div className="card card-floating">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600">Total Generated</p>
                    <p className="text-2xl font-bold text-secondary-900">
                      <AnimatedCounter value={jobs.length} />
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card card-floating">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      <AnimatedCounter value={jobs.filter(j => j.status === 'completed').length} />
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card card-floating">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600">Processing</p>
                    <p className="text-2xl font-bold text-primary">
                      <AnimatedCounter value={jobs.filter(j => j.status === 'processing').length} />
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-primary" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="card card-floating">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600">Total Words</p>
                    <p className="text-2xl font-bold text-secondary-900">
                      <AnimatedCounter value={jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.wordCount || 0), 0)} />
                    </p>
                  </div>
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerChildren>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <FadeIn>
            <div className="card card-floating text-center py-12">
              <FileText className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {searchTerm || filterStatus !== 'all' || filterTier !== 'all'
                  ? 'No content found'
                  : 'No content generated yet'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm || filterStatus !== 'all' || filterTier !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Generate your first piece of content from your sources.'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterTier === 'all' && (
                <Link to="/content/generate" className="btn btn-primary">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Content
                </Link>
              )}
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren>
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <StaggerItem key={job.id}>
                  <div className={`card card-floating hover:shadow-md transition-shadow ${job.status === 'processing' ? 'animate-pulse' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(job.status)}
                            <div>
                              <h3 className="text-lg font-semibold text-secondary-900">
                                {job.outline?.title || 'Untitled'}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </span>
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                                  {job.tier} Tier
                                </span>
                                <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs font-medium capitalize">
                                  {job.settings?.document_type?.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-secondary-600">Word Count</p>
                            <p className="text-sm font-medium text-secondary-900">
                              {job.wordCount?.toLocaleString() || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary-600">Pages</p>
                            <p className="text-sm font-medium text-secondary-900">
                              {job.estimatedPages || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary-600">Cost</p>
                            <p className="text-sm font-medium text-secondary-900">
                              ${job.estimatedCost?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-secondary-600">Created</p>
                            <p className="text-sm font-medium text-secondary-900">
                              {job.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Progress for processing jobs */}
                        {job.status === 'processing' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-secondary-700">{job.currentSection || 'Processing...'}</span>
                              <span className="text-primary font-medium">{job.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${job.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Error message for failed jobs */}
                        {job.status === 'failed' && job.errorMessage && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{job.errorMessage}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {job.status === 'completed' && (
                        <div className="flex items-center space-x-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(job)}
                            className="p-2 text-secondary-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            title="View"
                            aria-label="View content"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownloadTxt(job)}
                            className="p-2 text-secondary-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            title="Download TXT"
                            aria-label="Download as TXT file"
                          >
                            <Download className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownloadWord(job)}
                            className="p-2 text-secondary-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            title="Download Word"
                            aria-label="Download as Word document"
                          >
                            <FileText className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            title="Delete"
                            aria-label="Delete content"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        )}
      </div>
    </div>
  );
};

export default ContentHistoryPage;

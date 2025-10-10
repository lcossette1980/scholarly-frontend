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
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import toast from 'react-hot-toast';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

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
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }));

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

  const handleDownloadTxt = (job) => {
    const blob = new Blob([job.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.outline?.title || 'content'}-${job.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded as TXT');
  };

  const handleDownloadWord = async (job) => {
    try {
      // Parse markdown-style content into structured sections
      const sections = job.content.split(/\n## /).filter(s => s.trim());

      const docSections = sections.map((section, idx) => {
        const lines = section.split('\n').filter(l => l.trim());
        const title = idx === 0 ? job.outline?.title || 'Generated Content' : lines[0];
        const content = idx === 0 ? lines : lines.slice(1);

        const paragraphs = [
          new Paragraph({
            text: title,
            heading: idx === 0 ? HeadingLevel.TITLE : HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          })
        ];

        content.forEach(line => {
          if (line.trim()) {
            paragraphs.push(
              new Paragraph({
                children: [new TextRun(line)],
                spacing: { after: 120 }
              })
            );
          }
        });

        return paragraphs;
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: docSections.flat()
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${job.outline?.title || 'content'}-${job.id}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded as Word document');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document');
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
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-chestnut mx-auto mb-4 animate-pulse" />
          <p className="text-charcoal/70">Loading your content history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/dashboard" className="text-charcoal/60 hover:text-charcoal transition-colors">
              Dashboard
            </Link>
            <span className="text-charcoal/40">/</span>
            <span className="text-charcoal font-medium">Content History</span>
          </div>
        </div>

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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal font-playfair">
                Content History
              </h1>
              <p className="text-sm sm:text-base text-charcoal/70 font-lato">
                View, download, and manage your generated content
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-5 h-5" />
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
                <Filter className="w-5 h-5 text-charcoal/60" />
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/60">Total Generated</p>
                <p className="text-2xl font-bold text-charcoal">{jobs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/60">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs.filter(j => j.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/60">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {jobs.filter(j => j.status === 'processing').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/60">Total Words</p>
                <p className="text-2xl font-bold text-charcoal">
                  {jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + (j.wordCount || 0), 0).toLocaleString()}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-charcoal/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-charcoal font-playfair mb-2">
              {searchTerm || filterStatus !== 'all' || filterTier !== 'all'
                ? 'No content found'
                : 'No content generated yet'}
            </h3>
            <p className="text-charcoal/60 font-lato mb-6">
              {searchTerm || filterStatus !== 'all' || filterTier !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Generate your first piece of content from your bibliography sources.'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterTier === 'all' && (
              <Link to="/content/generate" className="btn btn-primary">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Content
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-charcoal font-playfair">
                            {job.outline?.title || 'Untitled'}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
                              {job.tier} Tier
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize">
                              {job.settings?.document_type?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-charcoal/60">Word Count</p>
                        <p className="text-sm font-medium text-charcoal">
                          {job.wordCount?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/60">Pages</p>
                        <p className="text-sm font-medium text-charcoal">
                          {job.estimatedPages || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/60">Cost</p>
                        <p className="text-sm font-medium text-charcoal">
                          ${job.estimatedCost?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/60">Created</p>
                        <p className="text-sm font-medium text-charcoal">
                          {job.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress for processing jobs */}
                    {job.status === 'processing' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-charcoal/70">{job.currentSection || 'Processing...'}</span>
                          <span className="text-chestnut font-medium">{job.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-chestnut h-2 rounded-full transition-all"
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
                      <button
                        onClick={() => handleView(job)}
                        className="p-2 text-charcoal/60 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadTxt(job)}
                        className="p-2 text-charcoal/60 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Download TXT"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadWord(job)}
                        className="p-2 text-charcoal/60 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="Download Word"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 text-charcoal/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentHistoryPage;

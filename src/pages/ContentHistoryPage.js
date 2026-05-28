// src/pages/ContentHistoryPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import toast from 'react-hot-toast';
import { exportGeneratedContent } from '../utils/contentExportUtils';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchJobs = async () => {
    if (!currentUser) {
      setLoading(false);
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
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load content history');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase();
    const titleMatch = (job.refinedTitle || job.outline?.title || job.outline?.topic || '').toLowerCase().includes(search);
    const typeMatch = (job.settings?.document_type || '').toLowerCase().includes(search);
    const matchesSearch = !searchTerm || titleMatch || typeMatch;
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesTier = filterTier === 'all' || job.tier === filterTier;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this generation? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'content_generation_jobs', jobId));
      setJobs(jobs.filter((j) => j.id !== jobId));
      toast.success('Generation deleted');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete generation');
    }
  };

  const getDocTitle = (job) =>
    (job.refinedTitle || job.outline?.topic || job.outline?.title || 'Generated Content')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 60);

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

  const StatusBadge = ({ status }) => {
    const config = {
      completed: { icon: CheckCircle, label: 'Completed', className: 'badge-success' },
      processing: { icon: Clock, label: 'Processing', className: 'badge-warning' },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50/40">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-secondary-600">Loading…</p>
        </div>
      </div>
    );
  }

  const totalWords = jobs.filter((j) => j.status === 'completed').reduce((sum, j) => sum + (j.wordCount || 0), 0);

  return (
    <div className="min-h-screen bg-secondary-50/40">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-secondary-500 mb-6">
          <Link to="/dashboard" className="hover:text-secondary-900 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3 text-secondary-300" />
          <span className="text-secondary-900 font-medium">Documents</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-1 p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight">Documents</h1>
              <p className="text-sm text-secondary-500 mt-1">View, download, and manage your generated content</p>
            </div>
          </div>
          <Link to="/content/generate" className="btn btn-primary btn-sm">
            <Plus className="w-3.5 h-3.5" />
            Generate document
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200 mb-6">
          {[
            { label: 'Total', value: jobs.length },
            { label: 'Completed', value: jobs.filter((j) => j.status === 'completed').length },
            { label: 'In progress', value: jobs.filter((j) => j.status === 'processing' || j.status === 'generating').length },
            { label: 'Total words', value: totalWords.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="bg-white p-4">
              <p className="text-xs uppercase tracking-wider text-secondary-500 font-medium mb-1">{s.label}</p>
              <p className="text-xl font-semibold text-secondary-900 tabular-nums tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-secondary-200 bg-white p-3 mb-6 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or type…"
              className="form-input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="form-input min-w-0 w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
          <select
            className="form-input min-w-0 w-auto"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="all">All tiers</option>
            <option value="standard">Standard</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        {/* Jobs list */}
        {filteredJobs.length === 0 ? (
          <div className="rounded-lg border border-secondary-200 bg-white py-14 text-center">
            {searchTerm || filterStatus !== 'all' || filterTier !== 'all' ? (
              <>
                <div className="w-10 h-10 rounded-md bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-5 h-5 text-secondary-400" />
                </div>
                <h3 className="text-base font-semibold text-secondary-900 mb-1">No documents match</h3>
                <p className="text-sm text-secondary-500 mb-5 max-w-sm mx-auto">
                  Try a different search term or clear your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterTier('all');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-md bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-5 h-5 text-secondary-400" />
                </div>
                <h3 className="text-base font-semibold text-secondary-900 mb-1">No documents yet</h3>
                <p className="text-sm text-secondary-500 mb-5 max-w-sm mx-auto">
                  Generate your first document from your source library.
                </p>
                <Link to="/content/generate" className="btn btn-primary btn-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate document
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-secondary-200 bg-white overflow-hidden divide-y divide-secondary-100">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`p-5 transition-colors ${job.status === 'processing' || job.status === 'generating' ? 'bg-warning-50/30' : 'hover:bg-secondary-50/40'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <button
                        onClick={() => navigate(`/content/view/${job.id}`)}
                        className="text-left min-w-0 flex-1"
                        disabled={job.status !== 'completed'}
                      >
                        <h3 className="text-base font-semibold text-secondary-900 truncate group-hover:text-primary transition-colors">
                          {job.refinedTitle || job.outline?.title || job.outline?.topic || 'Untitled'}
                        </h3>
                      </button>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <StatusBadge status={job.status} />
                        {job.tier && <span className="badge badge-brand capitalize">{job.tier}</span>}
                        {job.settings?.document_type && (
                          <span className="badge badge-neutral capitalize">
                            {job.settings.document_type.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-secondary-500 tabular-nums">
                      <span>{job.wordCount?.toLocaleString() || '—'} words</span>
                      <span>{job.estimatedPages || '—'} pages</span>
                      <span>${job.estimatedCost?.toFixed(2) || '0.00'}</span>
                      <span>{job.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {/* Progress bar */}
                    {(job.status === 'processing' || job.status === 'generating') && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-secondary-700">{job.currentSection || 'Processing…'}</span>
                          <span className="text-secondary-900 font-medium tabular-nums">{job.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-primary h-1 transition-all"
                            style={{ width: `${job.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error */}
                    {job.status === 'failed' && job.errorMessage && (
                      <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-md">
                        <p className="text-xs text-error-800">{job.errorMessage}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {job.status === 'completed' && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/content/view/${job.id}`)}
                        className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadTxt(job)}
                        className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                        title="TXT"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadWord(job)}
                        className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                        title="Word"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 text-secondary-500 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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

// src/pages/ContentViewPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Edit3, Save, X, Sparkles, ChevronRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { exportGeneratedContent } from '../utils/contentExportUtils';

const ContentViewPage = () => {
  const { jobId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, currentUser]);

  const fetchJob = async () => {
    if (!currentUser || !jobId) {
      setLoading(false);
      return;
    }
    try {
      const jobRef = doc(db, 'content_generation_jobs', jobId);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        const jobData = {
          id: jobSnap.id,
          ...jobSnap.data(),
          createdAt: jobSnap.data().createdAt?.toDate
            ? jobSnap.data().createdAt.toDate()
            : new Date(jobSnap.data().createdAt),
        };
        if (jobData.userId !== currentUser.uid) {
          toast.error('You do not have permission to view this content');
          navigate('/content/history');
          return;
        }
        setJob(jobData);
        setEditedContent(jobData.content || '');
      } else {
        toast.error('Content not found');
        navigate('/content/history');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    setJob({ ...job, content: editedContent });
    setIsEditing(false);
    toast.success('Changes saved locally');
  };

  const handleCancelEdit = () => {
    setEditedContent(job.content);
    setIsEditing(false);
  };

  const handleDownloadTxt = () => {
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

  const handleDownloadWord = async () => {
    try {
      await exportGeneratedContent(job, {
        includeTitlePage: true,
        includeHeaders: true,
        includeFooters: true,
      });
      toast.success('Downloaded as Word document');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document');
    }
  };

  const formatContent = (content) => {
    if (!content) return null;
    const sections = content.split(/\n## /);
    return sections.map((section, idx) => {
      const lines = section.split('\n');
      const heading = idx === 0 ? null : lines[0];
      const paragraphs = idx === 0 ? lines : lines.slice(1);
      return (
        <div key={idx} className="mb-10">
          {heading && (
            <h2 className="text-xl font-semibold text-secondary-900 mb-5 pb-2 border-b border-secondary-200 tracking-tight">
              {heading}
            </h2>
          )}
          {paragraphs.map((para, pidx) => {
            if (!para.trim()) return null;
            return (
              <p key={pidx} className="text-secondary-800 leading-[1.7] mb-4 text-[16px]">
                {para}
              </p>
            );
          })}
        </div>
      );
    });
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

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50/40">
        <p className="text-sm text-secondary-600">Content not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50/40">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-secondary-500 mb-6">
          <Link to="/dashboard" className="hover:text-secondary-900 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3 text-secondary-300" />
          <Link to="/content/history" className="hover:text-secondary-900 transition-colors">Documents</Link>
          <ChevronRight className="w-3 h-3 text-secondary-300" />
          <span className="text-secondary-900 font-medium truncate max-w-xs">
            {job.outline?.title || 'View'}
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate('/content/history')}
              className="mt-1 p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight truncate">
                {job.outline?.title || 'Generated content'}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className={`badge ${job.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
                {job.tier && (
                  <span className="badge badge-brand capitalize">{job.tier}</span>
                )}
                {job.settings?.document_type && (
                  <span className="badge badge-neutral capitalize">
                    {job.settings.document_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isEditing ? (
              <>
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button onClick={handleDownloadTxt} className="btn btn-secondary btn-sm">
                  <Download className="w-3.5 h-3.5" />
                  TXT
                </button>
                <button onClick={handleDownloadWord} className="btn btn-primary btn-sm">
                  <FileText className="w-3.5 h-3.5" />
                  Word
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancelEdit} className="btn btn-secondary btn-sm">
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="btn btn-primary btn-sm">
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200 mb-6">
          {[
            { label: 'Words', value: job.wordCount?.toLocaleString() || '—' },
            { label: 'Pages', value: job.estimatedPages || '—' },
            { label: 'Cost', value: job.estimatedCost ? `$${job.estimatedCost.toFixed(2)}` : '—' },
            { label: 'Created', value: job.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
          ].map((s) => (
            <div key={s.label} className="bg-white p-4">
              <p className="text-xs uppercase tracking-wider text-secondary-500 font-medium mb-1">{s.label}</p>
              <p className="text-xl font-semibold text-secondary-900 tabular-nums tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <article className="rounded-lg border border-secondary-200 bg-white">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[600px] p-6 font-mono text-sm text-secondary-900 outline-none resize-y rounded-lg"
              placeholder="Edit your content…"
            />
          ) : (
            <div className="px-6 md:px-10 py-8 md:py-10">
              {formatContent(job.content)}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ContentViewPage;

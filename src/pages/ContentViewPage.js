// src/pages/ContentViewPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Edit3, Save, X, Sparkles } from 'lucide-react';
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
            : new Date(jobSnap.data().createdAt)
        };

        // Verify ownership
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
    // For now, just save locally - in future can sync to Firestore
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
        includeFooters: true
      });
      toast.success('Downloaded as Word document');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document');
    }
  };

  const formatContent = (content) => {
    if (!content) return null;

    // Split by markdown headers
    const sections = content.split(/\n## /);

    return sections.map((section, idx) => {
      const lines = section.split('\n');
      const heading = idx === 0 ? null : lines[0];
      const paragraphs = idx === 0 ? lines : lines.slice(1);

      return (
        <div key={idx} className="mb-8">
          {heading && (
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4 pb-2 border-b-2 border-accent-600">
              {heading}
            </h2>
          )}
          {paragraphs.map((para, pidx) => {
            if (!para.trim()) return null;
            return (
              <p key={pidx} className="text-secondary-800 font-lato leading-relaxed mb-4">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-secondary-700">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-700">Content not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/dashboard" className="text-secondary-600 hover:text-secondary-900 transition-colors">
              Dashboard
            </Link>
            <span className="text-secondary-400">/</span>
            <Link to="/content/history" className="text-secondary-600 hover:text-secondary-900 transition-colors">
              Content History
            </Link>
            <span className="text-secondary-400">/</span>
            <span className="text-secondary-900 font-medium truncate max-w-xs">
              {job.outline?.title || 'View Content'}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={() => navigate('/content/history')}
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 font-playfair">
                {job.outline?.title || 'Generated Content'}
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button onClick={handleDownloadTxt} className="btn btn-outline">
                  <Download className="w-4 h-4 mr-2" />
                  TXT
                </button>
                <button onClick={handleDownloadWord} className="btn btn-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Word
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancelEdit} className="btn btn-outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="btn btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <p className="text-xs text-secondary-600 mb-1">Word Count</p>
            <p className="text-2xl font-bold text-secondary-900">{job.wordCount?.toLocaleString() || 'N/A'}</p>
          </div>
          <div className="card">
            <p className="text-xs text-secondary-600 mb-1">Pages</p>
            <p className="text-2xl font-bold text-secondary-900">{job.estimatedPages || 'N/A'}</p>
          </div>
          <div className="card">
            <p className="text-xs text-secondary-600 mb-1">Cost</p>
            <p className="text-2xl font-bold text-secondary-900">${job.estimatedCost?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="card">
            <p className="text-xs text-secondary-600 mb-1">Created</p>
            <p className="text-2xl font-bold text-secondary-900">
              {job.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="form-input font-mono text-sm min-h-[600px] w-full"
              placeholder="Edit your content..."
            />
          ) : (
            <div className="prose prose-lg max-w-none">
              {formatContent(job.content)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentViewPage;

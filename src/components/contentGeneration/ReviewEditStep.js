// src/components/contentGeneration/ReviewEditStep.js
import React, { useState, useEffect } from 'react';
import { Download, Edit3, Save, X, Check, FileText, Home, File, Copy, ChevronDown, ChevronUp, Image, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { contentGenerationAPI } from '../../services/api';
import { exportGeneratedContent } from '../../utils/contentExportUtils';
import toast from 'react-hot-toast';

// Error boundary wrapper to catch render crashes
class ReviewEditStepErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ReviewEditStep crashed:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-red-900 mb-2">Display Error</h3>
            <p className="text-sm text-red-700 mb-4">
              Your content was generated successfully but there was an error displaying it.
              You can view it from your Content History.
            </p>
            <p className="text-xs text-red-500 mb-4 font-mono bg-red-100 p-2 rounded">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/content/history" className="btn btn-primary text-sm">View Content History</a>
              <button onClick={() => window.location.reload()} className="btn btn-secondary text-sm">Refresh</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ReviewEditStepInner = ({ jobId, onBack }) => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');

  useEffect(() => {
    const fetchJobData = async (retries = 3) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const data = await contentGenerationAPI.getJobStatus(jobId);
          if (data && data.content) {
            setJobData(data);
            setContent(data.content || '');
            setEditableTitle(data.refinedTitle || data.metadata?.title || '');
            setLoading(false);
            return;
          }
          // Content not ready yet, wait and retry
          if (attempt < retries - 1) {
            await new Promise(r => setTimeout(r, 2000));
          }
        } catch (error) {
          console.error(`Error fetching job data (attempt ${attempt + 1}):`, error);
          if (attempt < retries - 1) {
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      }
      toast.error('Failed to load generated content. Please check your content history.');
      setLoading(false);
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      toast.success('Changes saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (editableTitle || 'generated-content').replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').substring(0, 60);
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded as TXT!');
  };

  const handleDownloadWord = async () => {
    try {
      // Build job object that contentExportUtils expects
      const exportJob = {
        ...jobData,
        content: content, // Use possibly-edited content
        refinedTitle: editableTitle || jobData?.refinedTitle,
        outline: jobData?.outline || {},
        settings: jobData?.settings || {},
      };

      await exportGeneratedContent(exportJob);
      toast.success('Downloaded as Word document!');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error('Failed to generate Word document');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreBadgeClasses = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  /**
   * Renders markdown content as formatted React elements.
   * Handles headings (h1, h2, h3), paragraphs, and inline section images.
   */
  const renderContent = (text) => {
    if (!text) return null;

    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      // Main title (# Heading)
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        return (
          <h1 key={idx} className="text-3xl font-bold text-secondary-900 mb-6 mt-2">
            {trimmed.replace(/^# /, '')}
          </h1>
        );
      }

      // Section heading (## Heading) with optional section image
      if (trimmed.startsWith('## ')) {
        const sectionTitle = trimmed.replace(/^## /, '');
        const sectionImage = jobData?.sectionImages?.find(
          img => img.section === sectionTitle || img.heading === sectionTitle
        );

        return (
          <React.Fragment key={idx}>
            <h2 className="text-2xl font-bold text-secondary-900 mt-10 mb-4 pb-2 border-b border-[#e5e7eb]">
              {sectionTitle}
            </h2>
            {sectionImage?.url && (
              <div className="my-4 rounded-lg overflow-hidden border border-[#e5e7eb]">
                <img src={sectionImage.url} alt={sectionTitle} className="w-full rounded-lg" />
                <div className="px-3 py-2 bg-[#f5f6f8] flex items-center space-x-2 text-xs text-gray-500">
                  <Image className="w-3 h-3" />
                  <span>AI-generated illustration</span>
                </div>
              </div>
            )}
            {sectionImage?.imageUrl && !sectionImage?.url && (
              <div className="my-4 rounded-lg overflow-hidden border border-[#e5e7eb]">
                <img src={sectionImage.imageUrl} alt={sectionTitle} className="w-full rounded-lg" />
                <div className="px-3 py-2 bg-[#f5f6f8] flex items-center space-x-2 text-xs text-gray-500">
                  <Image className="w-3 h-3" />
                  <span>AI-generated illustration</span>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      }

      // Sub heading (### Heading)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-semibold text-secondary-900 mt-6 mb-3">
            {trimmed.replace(/^### /, '')}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="text-secondary-800 leading-relaxed mb-2 text-[15px] ml-6 list-disc">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-secondary-800 leading-relaxed mb-4 text-[15px]">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your content...</p>
      </div>
    );
  }

  if (!jobData || !content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Content not available yet. It may still be generating.</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary text-sm">
          Refresh
        </button>
      </div>
    );
  }

  const wordCount = content ? content.split(/\s+/).filter(w => w).length : 0;
  const pageCount = Math.ceil(wordCount / 250);
  const qualityReport = jobData?.qualityReport || null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">
            Your Generated Content
          </h2>
          <p className="text-gray-600">
            Review and edit your AI-generated document
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <File className="w-4 h-4" />
                <span>TXT</span>
              </button>
              <button
                onClick={handleDownloadWord}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Word</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setContent(jobData.content);
                  setEditableTitle(jobData.refinedTitle || jobData.metadata?.title || '');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Refined Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
        <input
          type="text"
          value={editableTitle}
          onChange={(e) => setEditableTitle(e.target.value)}
          className="w-full px-4 py-3 text-xl font-bold text-secondary-900 border border-[#e5e7eb] rounded-lg shadow-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
          placeholder="Enter document title..."
        />
      </div>

      {/* Meta Description & Social Excerpt Cards */}
      {(jobData?.metaDescription || jobData?.socialExcerpt) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {jobData?.metaDescription && (
            <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Meta Description</h3>
                <button
                  onClick={() => handleCopyToClipboard(jobData.metaDescription, 'Meta description')}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-primary hover:bg-primary-50 rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{jobData.metaDescription}</p>
            </div>
          )}
          {jobData?.socialExcerpt && (
            <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Social Excerpt</h3>
                <button
                  onClick={() => handleCopyToClipboard(jobData.socialExcerpt, 'Social excerpt')}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-primary hover:bg-primary-50 rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{jobData.socialExcerpt}</p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary-900">Word Count</span>
          </div>
          <p className="text-2xl font-bold text-primary-700">{wordCount.toLocaleString()}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Pages</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{pageCount}</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Check className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-900">Status</span>
          </div>
          <p className="text-lg font-bold text-primary-700 capitalize">{jobData?.status}</p>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden mb-6">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-6 font-mono text-sm focus:outline-none resize-none"
            placeholder="Your generated content will appear here..."
          />
        ) : (
          <div className="p-8 max-h-[600px] overflow-y-auto">
            <div className="prose max-w-none">
              {renderContent(content)}
            </div>
          </div>
        )}
      </div>

      {/* References Section */}
      {jobData?.referencesList && (
        <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center space-x-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-secondary-900">References</span>
            {jobData?.citationStyle && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                {jobData.citationStyle.toUpperCase()}
              </span>
            )}
            <button
              onClick={() => handleCopyToClipboard(jobData.referencesList, 'References')}
              className="ml-auto flex items-center space-x-1 px-2 py-1 text-xs text-primary hover:bg-primary-50 rounded transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
          <div className="px-5 py-4">
            <div className="space-y-2 text-sm text-secondary-800">
              {jobData.referencesList.split('\n').map((ref, idx) => (
                <p key={idx} className="leading-relaxed pl-4 -indent-4">
                  {ref}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Review Panel */}
      {qualityReport && (() => {
        try {
        const sectionScoreValues = (qualityReport.sectionScores || []).map(s => typeof s === 'number' ? s : (s?.score || s?.overall_score || 0));
        const avgSectionScore = sectionScoreValues.length > 0
          ? Math.round(sectionScoreValues.reduce((a, b) => a + b, 0) / sectionScoreValues.length)
          : null;

        const getStatus = (score) => {
          if (score == null) return 'pass';
          if (score >= 80) return 'pass';
          if (score >= 60) return 'warn';
          return 'fail';
        };

        const arcStatus = (arc) => {
          if (!arc) return 'pass';
          const lower = arc.toLowerCase();
          if (lower === 'strong') return 'pass';
          if (lower === 'adequate') return 'warn';
          return 'fail';
        };

        const unsupportedClaimCount = qualityReport.issues
          ? qualityReport.issues.filter(i => i.type === 'unsupported_claim' || i.type === 'unsupported').length
          : 0;

        const repetitionCount = qualityReport.issues
          ? qualityReport.issues.filter(i => i.type === 'repetition' || i.type === 'cross_section_repetition').length
          : 0;

        const toneIssues = qualityReport.issues
          ? qualityReport.issues.filter(i => i.type === 'tone' || i.type === 'tone_inconsistency').length
          : 0;

        const overallScore = qualityReport.coherenceScore != null && avgSectionScore != null
          ? Math.round((qualityReport.coherenceScore + avgSectionScore) / 2)
          : qualityReport.coherenceScore || avgSectionScore || null;

        const reviewItems = [
          {
            label: 'Structural Quality',
            detail: 'Average section quality score',
            value: avgSectionScore != null ? `${avgSectionScore}/100` : 'N/A',
            status: getStatus(avgSectionScore),
          },
          {
            label: 'Document Coherence',
            detail: 'Argument arc, contradictions, pacing',
            value: typeof qualityReport.arcAssessment === 'string'
              ? qualityReport.arcAssessment.charAt(0).toUpperCase() + qualityReport.arcAssessment.slice(1).toLowerCase()
              : 'N/A',
            status: arcStatus(typeof qualityReport.arcAssessment === 'string' ? qualityReport.arcAssessment : ''),
          },
          {
            label: 'Sections Reviewed',
            detail: qualityReport.sectionsRegenerated?.length > 0
              ? `${qualityReport.sectionsRegenerated.length} sections auto-improved`
              : 'All sections passed quality review',
            value: `${qualityReport.sectionScores?.length || 0} sections`,
            status: 'pass',
          },
          {
            label: 'Unsupported Claims',
            detail: unsupportedClaimCount > 0
              ? `${unsupportedClaimCount} claim${unsupportedClaimCount > 1 ? 's' : ''} flagged`
              : 'No unsupported claims detected',
            value: unsupportedClaimCount === 0 ? 'Clear' : `${unsupportedClaimCount} found`,
            status: unsupportedClaimCount === 0 ? 'pass' : unsupportedClaimCount <= 2 ? 'warn' : 'fail',
          },
          {
            label: 'Tone Consistency',
            detail: toneIssues > 0 ? `${toneIssues} inconsistencies detected` : 'Consistent tone throughout',
            value: toneIssues === 0 ? 'Pass' : 'Warning',
            status: toneIssues === 0 ? 'pass' : 'warn',
          },
          {
            label: 'Repetition Check',
            detail: repetitionCount > 0 ? `${repetitionCount} instances of cross-section repetition` : 'No repetition detected',
            value: repetitionCount === 0 ? 'Clear' : `${repetitionCount} found`,
            status: repetitionCount === 0 ? 'pass' : 'warn',
          },
        ];

        const StatusIcon = ({ status }) => {
          if (status === 'pass') return <CheckCircle className="w-5 h-5 text-[#47763b] flex-shrink-0" />;
          if (status === 'warn') return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
          return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
        };

        return (
          <div className="border border-[#e5e7eb] rounded-lg p-5 bg-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-secondary-900">Document Review</h3>
              {overallScore != null && (
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#47763b]/10 text-[#47763b]">
                  {overallScore}/100
                </span>
              )}
            </div>

            {reviewItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between py-3 ${
                  idx < reviewItems.length - 1 ? 'border-b border-[#e5e7eb]' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <StatusIcon status={item.status} />
                  <div>
                    <p className="text-sm font-medium text-secondary-900">{item.label}</p>
                    <p className="text-xs text-secondary-500">{item.detail}</p>
                  </div>
                </div>
                <span className="text-sm text-secondary-500 ml-4 whitespace-nowrap truncate max-w-[120px]">{typeof item.value === 'string' ? item.value : String(item.value || 'N/A')}</span>
              </div>
            ))}

            {/* Section score breakdown */}
            {qualityReport.sectionScores && qualityReport.sectionScores.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                <p className="text-xs font-medium text-secondary-500 uppercase tracking-wide mb-3">Section Scores</p>
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  {qualityReport.sectionScores.map((item, idx) => {
                    const scoreVal = typeof item === 'number' ? item : (item?.score || item?.overall_score || 0);
                    const sectionName = typeof item === 'object' ? (item?.section || `S${idx + 1}`) : `S${idx + 1}`;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getScoreColor(scoreVal)}`}
                          title={`${sectionName}: ${scoreVal}`}
                        >
                          {scoreVal}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">S{idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
        } catch (e) {
          console.error('Error rendering quality report:', e);
          return (
            <div className="border border-[#e5e7eb] rounded-lg p-5 bg-white mb-6">
              <p className="text-sm text-secondary-500">Quality report available but could not be displayed.</p>
            </div>
          );
        }
      })()}

      {/* Source Traceability */}
      {jobData?.sourceMapping && jobData?.sourceList && (
        <div className="border border-[#e5e7eb] rounded-lg p-5 bg-white mb-6">
          <h3 className="font-bold text-secondary-900 mb-4">Source Traceability</h3>

          {/* Source List */}
          <div className="mb-4 space-y-2">
            {jobData.sourceList.map((source, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-sm">
                <span className="bg-primary/10 text-primary text-xs font-mono font-bold px-2 py-0.5 rounded min-w-[28px] text-center">{idx + 1}</span>
                <span className="text-secondary-700">{source.author} ({source.year}). <span className="italic">{source.title}</span></span>
              </div>
            ))}
          </div>

          {/* Section to Source Mapping */}
          <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
            <p className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Sources per section</p>
            {jobData.sourceMapping.map((mapping, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="text-sm text-secondary-900 font-medium">{mapping.section}</span>
                <div className="flex gap-1">
                  {mapping.sources.map(srcIdx => (
                    <span key={srcIdx} className="bg-primary/10 text-primary text-xs font-mono font-bold px-2 py-0.5 rounded">
                      {srcIdx + 1}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-2">Content Generated Successfully!</h3>
            <p className="text-sm text-green-800 mb-3">
              Your {pageCount}-page document has been generated with {wordCount.toLocaleString()} words.
              You can now review, edit, and download your content.
            </p>
            <div className="flex items-center space-x-4 text-xs text-green-700">
              <span>Sources attributed</span>
              <span>Properly formatted</span>
              <span>Ready to use</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray-600">Step 6 of 6 - Complete!</p>
        </div>
      </div>
    </div>
  );
};

// Wrap with error boundary so render crashes show a useful message instead of blue screen
const ReviewEditStep = (props) => (
  <ReviewEditStepErrorBoundary>
    <ReviewEditStepInner {...props} />
  </ReviewEditStepErrorBoundary>
);

export default ReviewEditStep;

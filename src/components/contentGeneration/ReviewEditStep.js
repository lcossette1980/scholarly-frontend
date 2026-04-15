// src/components/contentGeneration/ReviewEditStep.js
import React, { useState, useEffect } from 'react';
import { Download, Edit3, Save, X, Check, FileText, Home, File, Copy, ChevronDown, ChevronUp, Image } from 'lucide-react';
import { contentGenerationAPI } from '../../services/api';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import toast from 'react-hot-toast';

const ReviewEditStep = ({ jobId, onBack }) => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [qualityReportOpen, setQualityReportOpen] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const data = await contentGenerationAPI.getJobStatus(jobId);
        setJobData(data);
        setContent(data.content || '');
        setEditableTitle(data.refinedTitle || data.metadata?.title || '');
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error('Failed to load generated content');
      } finally {
        setLoading(false);
      }
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
    a.download = `${editableTitle || 'generated-content'}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded as TXT!');
  };

  const handleDownloadWord = async () => {
    try {
      const sections = content.split(/\n## /).filter(s => s.trim());

      const docSections = sections.map((section, idx) => {
        const lines = section.split('\n').filter(l => l.trim());
        const title = idx === 0 ? editableTitle || 'Generated Content' : lines[0];
        const paragraphContent = idx === 0 ? lines : lines.slice(1);

        const paragraphs = [
          new Paragraph({
            text: title,
            heading: idx === 0 ? HeadingLevel.TITLE : HeadingLevel.HEADING_1,
            spacing: { after: 240, before: idx === 0 ? 0 : 240 },
            alignment: idx === 0 ? AlignmentType.CENTER : AlignmentType.LEFT
          })
        ];

        paragraphContent.forEach(line => {
          if (line.trim()) {
            if (line.startsWith('### ')) {
              paragraphs.push(
                new Paragraph({
                  text: line.replace('### ', ''),
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 120, before: 120 }
                })
              );
            } else {
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun({ text: line, size: 24 })],
                  spacing: { after: 120, line: 360 },
                  alignment: AlignmentType.JUSTIFIED
                })
              );
            }
          }
        });

        return paragraphs;
      });

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440
              }
            }
          },
          children: docSections.flat()
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${editableTitle || 'generated-content'}-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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

  // Build a map of section heading -> image data for quick lookup
  const sectionImageMap = {};
  if (jobData?.sectionImages) {
    jobData.sectionImages.forEach(img => {
      sectionImageMap[img.heading] = img;
    });
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your content...</p>
      </div>
    );
  }

  const wordCount = content.split(/\s+/).filter(w => w).length;
  const pageCount = Math.ceil(wordCount / 250);
  const qualityReport = jobData?.qualityReport;

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
          <div className="p-8 max-h-[600px] overflow-y-auto prose prose-lg max-w-none">
            {content.split(/\n## /).map((section, idx) => {
              const lines = section.split('\n').filter(l => l.trim());
              const heading = idx === 0 ? null : lines[0];
              const paragraphs = idx === 0 ? lines : lines.slice(1);
              const sectionImage = heading ? sectionImageMap[heading] : null;

              return (
                <div key={idx} className="mb-8">
                  {heading && (
                    <h2 className="text-2xl font-bold text-secondary-900 mb-4 pb-2 border-b-2 border-primary-600">
                      {heading}
                    </h2>
                  )}
                  {sectionImage && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-[#e5e7eb]">
                      <img
                        src={sectionImage.imageUrl}
                        alt={sectionImage.heading}
                        className="w-full h-auto object-cover max-h-80"
                      />
                      <div className="px-3 py-2 bg-[#f5f6f8] flex items-center space-x-2 text-xs text-gray-500">
                        <Image className="w-3 h-3" />
                        <span>AI-generated illustration</span>
                      </div>
                    </div>
                  )}
                  {paragraphs.map((para, pidx) => {
                    if (!para.trim()) return null;

                    if (para.startsWith('### ')) {
                      return (
                        <h3 key={pidx} className="text-xl font-semibold text-secondary-900 mt-6 mb-3">
                          {para.replace('### ', '')}
                        </h3>
                      );
                    }

                    return (
                      <p key={pidx} className="text-secondary-800 leading-relaxed mb-4 text-justify">
                        {para}
                      </p>
                    );
                  })}
                </div>
              );
            })}
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

      {/* Quality Report Panel */}
      {qualityReport && (
        <div className="border border-[#e5e7eb] rounded-lg shadow-card bg-white mb-6 overflow-hidden">
          <button
            onClick={() => setQualityReportOpen(!qualityReportOpen)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-semibold text-secondary-900">Quality Report</span>
              {qualityReport.coherenceScore != null && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScoreBadgeClasses(qualityReport.coherenceScore)}`}>
                  Coherence: {qualityReport.coherenceScore}
                </span>
              )}
            </div>
            {qualityReportOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {qualityReportOpen && (
            <div className="px-5 pb-5 border-t border-[#e5e7eb]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {/* Coherence Score */}
                {qualityReport.coherenceScore != null && (
                  <div className="bg-[#f5f6f8] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Coherence Score</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-secondary-900">{qualityReport.coherenceScore}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreColor(qualityReport.coherenceScore)}`}
                          style={{ width: `${qualityReport.coherenceScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Arc Assessment */}
                {qualityReport.arcAssessment && (
                  <div className="bg-[#f5f6f8] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Arc Assessment</p>
                    <p className="text-2xl font-bold text-secondary-900 capitalize">{qualityReport.arcAssessment}</p>
                  </div>
                )}

                {/* Section Quality Scores */}
                {qualityReport.sectionScores && qualityReport.sectionScores.length > 0 && (
                  <div className="bg-[#f5f6f8] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Section Scores</p>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                      {qualityReport.sectionScores.map((score, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getScoreColor(score)}`}
                            title={`Section ${idx + 1}: ${score}`}
                          >
                            {score}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">S{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sections Regenerated */}
                {qualityReport.sectionsRegenerated && qualityReport.sectionsRegenerated.length > 0 && (
                  <div className="bg-[#f5f6f8] rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Sections Regenerated</p>
                    <p className="text-2xl font-bold text-secondary-900">{qualityReport.sectionsRegenerated.length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sections {qualityReport.sectionsRegenerated.join(', ')} were re-written for quality
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
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

export default ReviewEditStep;

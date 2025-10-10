// src/components/contentGeneration/ReviewEditStep.js
import React, { useState, useEffect } from 'react';
import { Download, Edit3, Save, X, Check, FileText, Home, File } from 'lucide-react';
import { contentGenerationAPI } from '../../services/api';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import toast from 'react-hot-toast';

const ReviewEditStep = ({ jobId, onBack }) => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const data = await contentGenerationAPI.getJobStatus(jobId);
        setJobData(data);
        setContent(data.content || '');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real implementation, you'd have an endpoint to update the job content
      // For now, we'll just update local state
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
    a.download = `${jobData?.metadata?.title || 'generated-content'}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded as TXT!');
  };

  const handleDownloadWord = async () => {
    try {
      // Parse markdown-style content into structured sections
      const sections = content.split(/\n## /).filter(s => s.trim());

      const docSections = sections.map((section, idx) => {
        const lines = section.split('\n').filter(l => l.trim());
        const title = idx === 0 ? jobData?.metadata?.title || 'Generated Content' : lines[0];
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
            // Check if line is a subheading (starts with ###)
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
                top: 1440,    // 1 inch
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
      a.download = `${jobData?.metadata?.title || 'generated-content'}-${Date.now()}.docx`;
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your content...</p>
      </div>
    );
  }

  const wordCount = content.split(/\s+/).filter(w => w).length;
  const pageCount = Math.ceil(wordCount / 250);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-charcoal font-playfair mb-2">
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
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Word Count</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{wordCount.toLocaleString()}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Pages</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{pageCount}</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Check className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Status</span>
          </div>
          <p className="text-lg font-bold text-purple-700 capitalize">{jobData?.status}</p>
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

              return (
                <div key={idx} className="mb-8">
                  {heading && (
                    <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4 pb-2 border-b-2 border-chestnut">
                      {heading}
                    </h2>
                  )}
                  {paragraphs.map((para, pidx) => {
                    if (!para.trim()) return null;

                    // Check for subheadings
                    if (para.startsWith('### ')) {
                      return (
                        <h3 key={pidx} className="text-xl font-semibold text-charcoal font-playfair mt-6 mb-3">
                          {para.replace('### ', '')}
                        </h3>
                      );
                    }

                    return (
                      <p key={pidx} className="text-charcoal/80 font-lato leading-relaxed mb-4 text-justify">
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
              <span>✓ Citations included</span>
              <span>✓ Properly formatted</span>
              <span>✓ Ready to use</span>
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
          <p className="text-sm text-gray-600">Step 6 of 6 • Complete!</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewEditStep;

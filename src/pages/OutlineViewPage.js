import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  BookOpen,
  Link as LinkIcon,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

const OutlineViewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const { topic, selectedEntries } = location.state || {};
  const [outline, setOutline] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!topic || !selectedEntries) {
      toast.error('Missing topic or entries data');
      navigate('/analyze');
      return;
    }

    generateOutline();
  }, [topic, selectedEntries]);

  const generateOutline = async () => {
    if (!currentUser) {
      toast.error('Please sign in to generate outlines');
      return;
    }

    setIsGenerating(true);

    try {
      const entryIds = selectedEntries.map(e => e.id);

      const result = await analysisAPI.generateOutline(
        entryIds,
        currentUser.uid,
        topic.title,
        'detailed'
      );

      setOutline(result);
      toast.success('Outline generated successfully!');
    } catch (error) {
      console.error('Error generating outline:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate outline');
      navigate('/analyze');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToWord = async () => {
    if (!outline) return;

    setIsExporting(true);

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: outline.topic,
                  bold: true,
                  size: 32,
                })
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Introduction
            new Paragraph({
              children: [
                new TextRun({
                  text: "Introduction",
                  bold: true,
                  size: 28,
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: outline.introduction,
                  size: 24,
                })
              ],
              spacing: { after: 300 }
            }),

            // Sections
            ...outline.sections.flatMap((section, idx) => {
              const sectionParagraphs = [
                // Section heading
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${idx + 1}. ${section.heading}`,
                      bold: true,
                      size: 28,
                    })
                  ],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 300, after: 200 }
                }),

                // Section description
                new Paragraph({
                  children: [
                    new TextRun({
                      text: section.description,
                      size: 24,
                      italics: true,
                    })
                  ],
                  spacing: { after: 200 }
                }),

                // Key points
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Key Points:",
                      bold: true,
                      size: 24,
                    })
                  ],
                  spacing: { before: 100, after: 100 }
                }),
                ...section.key_points.map(point =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${point}`,
                        size: 24,
                      })
                    ],
                    spacing: { after: 100 },
                    indent: { left: 360 }
                  })
                ),

                // Supporting sources
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Supporting Sources:",
                      bold: true,
                      size: 24,
                    })
                  ],
                  spacing: { before: 200, after: 100 }
                }),
                ...section.supporting_sources.map(sourceId => {
                  const source = outline.sources_used.find(s => s.id === sourceId);
                  return new Paragraph({
                    children: [
                      new TextRun({
                        text: source ? `• ${source.citation}` : `• Source ${sourceId}`,
                        size: 22,
                      })
                    ],
                    spacing: { after: 100 },
                    indent: { left: 360 }
                  });
                }),

                // Spacing after section
                new Paragraph({
                  children: [new TextRun({ text: "" })],
                  spacing: { after: 300 }
                })
              ];

              return sectionParagraphs;
            }),

            // Conclusion
            new Paragraph({
              children: [
                new TextRun({
                  text: "Conclusion",
                  bold: true,
                  size: 28,
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 300, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: outline.conclusion,
                  size: 24,
                })
              ],
              spacing: { after: 400 }
            }),

            // References
            new Paragraph({
              children: [
                new TextRun({
                  text: "References",
                  bold: true,
                  size: 28,
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...outline.sources_used.map(source =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: source.citation,
                    size: 24,
                  })
                ],
                spacing: { after: 200 }
              })
            )
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `outline-${outline.topic.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Outline exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export outline');
    } finally {
      setIsExporting(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-chestnut to-charcoal rounded-full flex items-center justify-center mx-auto">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">
              Generating Detailed Outline
            </h3>
            <p className="text-charcoal/70 font-lato">
              Mapping evidence to outline sections...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!outline) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={() => navigate('/analyze', { state: { selectedEntries } })}
              className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-charcoal font-playfair">
                Detailed Outline
              </h1>
              <p className="text-charcoal/70 font-lato text-sm md:text-base">
                Evidence-mapped structure with {outline.sections.length} sections
              </p>
            </div>
          </div>
          <button
            onClick={exportToWord}
            disabled={isExporting}
            className="btn btn-primary"
          >
            {isExporting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export to Word
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        <div className="card bg-gradient-to-br from-green-50 to-khaki/10 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-1">
                Outline Generated Successfully!
              </h3>
              <p className="text-charcoal/70 font-lato text-sm">
                Synthesized from {outline.sources_used.length} sources with evidence mapping
              </p>
            </div>
          </div>
        </div>

        {/* Outline Content */}
        <div className="card bg-white">
          {/* Title */}
          <div className="mb-8 pb-6 border-b border-khaki/20">
            <h2 className="text-3xl font-bold text-charcoal font-playfair text-center">
              {outline.topic}
            </h2>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-charcoal font-playfair mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-chestnut" />
              Introduction
            </h3>
            <p className="text-charcoal/80 font-lato leading-relaxed">
              {outline.introduction}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {outline.sections.map((section, idx) => (
              <div key={idx} className="bg-pearl/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">
                  {idx + 1}. {section.heading}
                </h3>

                <p className="text-charcoal/70 font-lato italic mb-4">
                  {section.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-charcoal mb-2">Key Points:</h4>
                  <ul className="space-y-2">
                    {section.key_points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start space-x-2">
                        <span className="text-chestnut mt-1">•</span>
                        <span className="text-charcoal/80 font-lato">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-charcoal mb-2 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1 text-chestnut" />
                    Supporting Sources:
                  </h4>
                  <div className="space-y-2">
                    {section.supporting_sources.map((sourceId, srcIdx) => {
                      const source = outline.sources_used.find(s => s.id === sourceId);
                      return (
                        <div key={srcIdx} className="text-sm text-charcoal/70 pl-4 border-l-2 border-chestnut/30">
                          {source ? source.citation : `Source ${sourceId}`}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-8 pt-6 border-t border-khaki/20">
            <h3 className="text-xl font-bold text-charcoal font-playfair mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-chestnut" />
              Conclusion
            </h3>
            <p className="text-charcoal/80 font-lato leading-relaxed">
              {outline.conclusion}
            </p>
          </div>
        </div>

        {/* References */}
        <div className="card mt-8">
          <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">
            References
          </h3>
          <div className="space-y-3">
            {outline.sources_used.map((source, idx) => (
              <div key={idx} className="text-charcoal/80 font-lato text-sm leading-relaxed">
                {source.citation}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/analyze', { state: { selectedEntries } })}
            className="btn btn-outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Topics
          </button>
          <button
            onClick={() => navigate('/bibliography')}
            className="btn btn-outline"
          >
            Back to Bibliography
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutlineViewPage;

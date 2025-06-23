// src/utils/exportUtils.js
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';
import { exportToWord } from './wordExportUtils';

export const exportToBibliography = async (entries, format = 'word') => {
    if (format === 'word') {
      return exportToWord(entries);
    }
    
    // Legacy implementation kept for backwards compatibility
    const createEntryParagraphs = (entry) => {
      const paragraphs = [];
      
      // Citation
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: entry.citation,
              bold: true,
              size: 24,
            })
          ],
          spacing: {
            after: 240,
          }
        })
      );
      
      // Narrative Overview
      if (entry.narrative_overview) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Narrative Overview",
                bold: true,
                size: 28,
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120,
            }
          })
        );
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: entry.narrative_overview,
                size: 24,
              })
            ],
            spacing: {
              after: 240,
            }
          })
        );
      }
      
      // Research Components
      if (entry.research_components) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Key Research Components",
                bold: true,
                size: 28,
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120,
            }
          })
        );
        
        if (entry.research_components.research_purpose) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Research Purpose:",
                  bold: true,
                  size: 24,
                })
              ],
              spacing: {
                after: 60,
              }
            })
          );
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: entry.research_components.research_purpose,
                  size: 24,
                })
              ],
              spacing: {
                after: 180,
              }
            })
          );
        }
        
        if (entry.research_components.methodology) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Methodology:",
                  bold: true,
                  size: 24,
                })
              ],
              spacing: {
                after: 60,
              }
            })
          );
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: entry.research_components.methodology,
                  size: 24,
                })
              ],
              spacing: {
                after: 180,
              }
            })
          );
        }
        
        if (entry.research_components.theoretical_framework) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Theoretical Framework:",
                  bold: true,
                  size: 24,
                })
              ],
              spacing: {
                after: 60,
              }
            })
          );
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: entry.research_components.theoretical_framework,
                  size: 24,
                })
              ],
              spacing: {
                after: 180,
              }
            })
          );
        }
      }
      
      // Core Findings
      if (entry.core_findings) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Core Findings & Key Statistics",
                bold: true,
                size: 28,
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120,
            }
          })
        );
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: entry.core_findings,
                size: 24,
              })
            ],
            spacing: {
              after: 240,
            }
          })
        );
      }
      
      // Methodological Value
      if (entry.methodological_value) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Methodological Value",
                bold: true,
                size: 28,
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120,
            }
          })
        );
        
        if (entry.methodological_value.strengths) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Strengths:",
                  bold: true,
                  size: 24,
                })
              ],
              spacing: {
                after: 60,
              }
            })
          );
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: entry.methodological_value.strengths,
                  size: 24,
                })
              ],
              spacing: {
                after: 180,
              }
            })
          );
        }
        
        if (entry.methodological_value.limitations) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Limitations:",
                  bold: true,
                  size: 24,
                })
              ],
              spacing: {
                after: 60,
              }
            })
          );
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: entry.methodological_value.limitations,
                  size: 24,
                })
              ],
              spacing: {
                after: 180,
              }
            })
          );
        }
      }
      
      // Key Quotes
      if (entry.key_quotes && entry.key_quotes.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Key Quotes",
                bold: true,
                size: 28,
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120,
            }
          })
        );
        
        entry.key_quotes.forEach((quote, index) => {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. "${quote.text}" (p. ${quote.page})`,
                  size: 24,
                  italics: true,
                })
              ],
              spacing: {
                after: 120,
              }
            })
          );
        });
      }
      
      return paragraphs;
    };
  
    if (format === 'word') {
      const sections = [];
      
      // Title page
      sections.push({
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "ANNOTATED BIBLIOGRAPHY",
                bold: true,
                size: 48,
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 480,
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Generated by ScholarlyAI",
                size: 28,
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 240,
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date().toLocaleDateString()}`,
                size: 24,
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 120,
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Entries: ${entries.length}`,
                size: 24,
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 480,
            }
          }),
          new Paragraph({
            children: [new PageBreak()],
          })
        ]
      });
      
      // Entries
      const entryParagraphs = [];
      entries.forEach((entry, index) => {
        entryParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `ENTRY ${index + 1}`,
                bold: true,
                size: 32,
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: {
              before: 480,
              after: 240,
            }
          })
        );
        
        entryParagraphs.push(...createEntryParagraphs(entry));
        
        // Add page break between entries (except for the last one)
        if (index < entries.length - 1) {
          entryParagraphs.push(
            new Paragraph({
              children: [new PageBreak()],
            })
          );
        }
      });
      
      sections.push({
        properties: {},
        children: entryParagraphs
      });
      
      // Create document
      const doc = new Document({
        sections: sections,
      });
      
      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated-bibliography-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    }
    
    return false;
  };
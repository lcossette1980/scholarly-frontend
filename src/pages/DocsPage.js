// src/pages/DocsPage.js
import React, { useState } from 'react';
import {
  Book,
  Upload,
  FileText,
  CheckCircle,
  Info,
  Zap,
  BookOpen,
  FileDown
} from 'lucide-react';
import { FadeIn } from '../components/motion';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'uploading-files',
      title: 'Uploading Documents',
      icon: <Upload className="w-5 h-5" />
    },
    {
      id: 'creating-entries',
      title: 'Creating Source Entries',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'managing-bibliography',
      title: 'Managing Your Sources',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 'exporting',
      title: 'Exporting Sources',
      icon: <FileDown className="w-5 h-5" />
    }
  ];

  const content = {
    'getting-started': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Getting Started with DraftEngine</h2>

        <div className="bg-accent/10 border border-accent-600/20 rounded-lg p-4">
          <p className="text-secondary-900">
            DraftEngine helps you transform documents into comprehensive source entries using AI-powered analysis.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Quick Start Guide</h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-secondary-900">1. Sign up for a free account</p>
                <p className="text-secondary-700 text-sm">Get 5 free source entries to try out the platform.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-secondary-900">2. Upload a document (PDF)</p>
                <p className="text-secondary-700 text-sm">Support for files up to 10MB in size.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-secondary-900">3. Define your focus</p>
                <p className="text-secondary-700 text-sm">Guide the AI to extract relevant insights for your specific needs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-secondary-900">4. Review and export</p>
                <p className="text-secondary-700 text-sm">Edit the generated content and export to Word.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50/50 border border-secondary-300/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Pro Tip</p>
              <p className="text-secondary-700 text-sm">
                The more specific your focus, the better the AI can tailor the analysis to your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    'uploading-files': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Uploading Documents</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Supported File Types</h3>
          <ul className="list-disc list-inside space-y-2 text-secondary-800">
            <li>PDF files (recommended)</li>
            <li>Maximum file size: 10MB</li>
            <li>Text-based PDFs work best (not scanned images)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Step-by-Step Upload Process</h3>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Navigate to Create Entry</h4>
                <p className="text-secondary-700 mb-3">Click the "Create Entry" button from your dashboard or navigation menu.</p>
                <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
                  <code className="text-sm">Dashboard → Create New Entry</code>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Upload Your PDF</h4>
                <p className="text-secondary-700 mb-3">Drag and drop your file or click to browse. The upload area accepts PDF files up to 10MB.</p>
                <div className="bg-accent/10 border-2 border-dashed border-accent-600/30 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-accent mx-auto mb-2" />
                  <p className="text-secondary-700">Drag & drop or click to upload</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Wait for Processing</h4>
                <p className="text-secondary-700">You'll see a progress bar while the file uploads. Processing typically takes 5-15 seconds.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Common Issues</p>
              <ul className="text-secondary-700 text-sm space-y-1">
                <li>• Ensure your PDF isn't password-protected</li>
                <li>• Check that the file is under 10MB</li>
                <li>• Text-based PDFs work better than scanned images</li>
                <li>• Clear browser cache if upload fails repeatedly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),

    'creating-entries': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Creating Source Entries</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Setting Your Focus</h3>
          <p className="text-secondary-800">
            The focus is crucial for guiding the AI's analysis. It determines which aspects of the document the AI emphasizes.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-2">Good Focus Examples</h4>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li>✓ "Impact of social media on teenage mental health"</li>
                <li>✓ "Machine learning applications in medical diagnosis"</li>
                <li>✓ "Climate change effects on urban infrastructure"</li>
              </ul>
            </div>

            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-2">Too Broad Examples</h4>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li>✗ "Education"</li>
                <li>✗ "Technology"</li>
                <li>✗ "Health"</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">AI Analysis Process</h3>

          <div className="space-y-3">
            <div className="card card-floating bg-gradient-to-r from-accent/5 to-accent/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-secondary-900">Key Arguments</h4>
              </div>
              <p className="text-secondary-700 text-sm">
                Automatically identifies and extracts the key arguments from your source for use in your writing.
              </p>
            </div>

            <div className="card card-floating bg-gradient-to-r from-accent/5 to-accent/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-secondary-900">Interesting Angles</h4>
              </div>
              <p className="text-secondary-700 text-sm">
                Discovers interesting angles, unique perspectives, and notable passages based on your focus.
              </p>
            </div>

            <div className="card card-floating bg-gradient-to-r from-accent/5 to-accent/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-secondary-900">Smart Analysis</h4>
              </div>
              <p className="text-secondary-700 text-sm">
                AI understands context and provides insights relevant to your specific writing needs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50/50 border border-secondary-300/30 rounded-lg p-4">
          <p className="text-secondary-800 text-sm">
            <strong>Processing Time:</strong> Most entries are processed within 30-60 seconds. Complex papers may take slightly longer.
          </p>
        </div>
      </div>
    ),

    'managing-bibliography': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Managing Your Sources</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Source Library Dashboard</h3>
          <p className="text-secondary-800">
            Access your complete source library from the "Manage Sources" page. Here you can:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-3">Organization Features</h4>
              <ul className="space-y-2 text-secondary-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Sort by date, title, or author</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Filter by focus</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Search across all entries</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Select multiple entries for bulk actions</span>
                </li>
              </ul>
            </div>

            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-3">Entry Actions</h4>
              <ul className="space-y-2 text-secondary-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">View full entry details</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Edit source details and notes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Delete unwanted entries</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                  <span className="text-sm">Export individual or multiple entries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Bulk Operations</h3>

          <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
            <p className="text-secondary-800 mb-3">To perform bulk operations:</p>
            <ol className="list-decimal list-inside space-y-2 text-secondary-700">
              <li>Click the checkbox next to each entry you want to select</li>
              <li>Use "Select All" to choose all visible entries</li>
              <li>Choose your action from the bulk actions menu</li>
              <li>Confirm the operation</li>
            </ol>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent-600/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Quick Tip</p>
              <p className="text-secondary-700 text-sm">
                Use the search bar to quickly find entries by author name, title, or keywords from your focus.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    'exporting': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Exporting Your Sources</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Export Formats</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card card-floating">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <FileDown className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Word Document</h4>
              <p className="text-secondary-700 text-sm">
                Export formatted source entries to .docx with proper styling and attribution.
              </p>
            </div>

            <div className="card card-floating">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Plain Text</h4>
              <p className="text-secondary-700 text-sm">
                Copy source details and notes as plain text for easy pasting.
              </p>
            </div>

            <div className="card card-floating">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">PDF Export</h4>
              <p className="text-secondary-700 text-sm">
                Export your source entries as professionally formatted PDF documents.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Export Process</h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-semibold text-secondary-900">Select Entries</p>
                <p className="text-secondary-700 text-sm">Choose individual entries or select multiple for bulk export.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-semibold text-secondary-900">Choose Format</p>
                <p className="text-secondary-700 text-sm">Select your preferred export format from the dropdown menu.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-semibold text-secondary-900">Download</p>
                <p className="text-secondary-700 text-sm">Click export and your file will download automatically.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50/50 border border-secondary-300/30 rounded-lg p-4">
          <h4 className="font-semibold text-secondary-900 mb-2">Attribution Style</h4>
          <p className="text-sm text-secondary-700">
            DraftEngine uses natural, conversational attribution — weaving source references into your text for readability and credibility.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Pro Feature</p>
              <p className="text-secondary-700 text-sm">
                Paid plans include unlimited exports and additional format options. Free plans are limited to 5 exports per month.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen py-12 bg-mesh">
      <SEO
        title="Documentation"
        description="Learn how to use DraftEngine. Step-by-step guides for uploading sources, generating summaries, creating outlines, and drafting complete content."
        path="/docs"
      />
      <div className="container mx-auto px-6">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              Documentation
            </h1>
            <p className="text-xl text-secondary-700">
              Everything you need to know about using DraftEngine
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <FadeIn direction="left">
              <div className="sticky top-8">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
                        activeSection === section.id
                          ? 'bg-accent text-white shadow-md shadow-accent/20'
                          : 'hover:bg-secondary-200/20 text-secondary-900'
                      }`}
                    >
                      <span className={activeSection === section.id ? 'text-white' : 'text-accent'}>
                        {section.icon}
                      </span>
                      <span className="">{section.title}</span>
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-8 card card-floating bg-accent/10 border-accent-600/20">
                  <h3 className="font-semibold text-secondary-900 mb-2">Need More Help?</h3>
                  <p className="text-secondary-700 text-sm mb-3">
                    Can't find what you're looking for? Contact our support team.
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href="mailto:support@draftengine.com"
                    className="btn btn-sm btn-primary w-full"
                  >
                    Contact Support
                  </motion.a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card card-floating">
                  {content[activeSection]}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;

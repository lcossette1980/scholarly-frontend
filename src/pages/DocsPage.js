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
  FileDown,
  Link2,
  Hash,
  Rss,
  Quote,
  Radio
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
      id: 'url-import',
      title: 'URL Import',
      icon: <Link2 className="w-5 h-5" />
    },
    {
      id: 'doi-lookup',
      title: 'DOI Lookup',
      icon: <Hash className="w-5 h-5" />
    },
    {
      id: 'rss-feeds',
      title: 'RSS Feeds',
      icon: <Rss className="w-5 h-5" />
    },
    {
      id: 'creating-entries',
      title: 'Creating Source Entries',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'citation-styles',
      title: 'Citation Styles',
      icon: <Quote className="w-5 h-5" />
    },
    {
      id: 'research-feeds',
      title: 'Research Feeds',
      icon: <Radio className="w-5 h-5" />
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

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
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
                <p className="font-semibold text-secondary-900">2. Import a source (PDF, URL, DOI, or RSS)</p>
                <p className="text-secondary-700 text-sm">Upload PDFs (up to 10MB), paste URLs, enter DOIs, or subscribe to RSS feeds.</p>
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
            <Info className="w-5 h-5 text-primary mt-0.5" />
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
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Navigate to Create Entry</h4>
                <p className="text-secondary-700 mb-3">Click the "Create Entry" button from your dashboard or navigation menu.</p>
                <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
                  <code className="text-sm">Dashboard → Create New Entry</code>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Upload Your PDF</h4>
                <p className="text-secondary-700 mb-3">Drag and drop your file or click to browse. The upload area accepts PDF files up to 10MB.</p>
                <div className="bg-primary/10 border-2 border-dashed border-primary-600/30 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-secondary-700">Drag & drop or click to upload</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
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

    'url-import': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">URL Import</h2>

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
          <p className="text-secondary-900">
            Import source material directly from web pages by pasting a URL. DraftEngine extracts the article content, metadata, and key information automatically.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">How It Works</h3>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Paste a URL</h4>
                <p className="text-secondary-700">When creating a new entry, select the URL import option and paste the full web address of the article or page you want to analyze.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Automatic Extraction</h4>
                <p className="text-secondary-700">DraftEngine extracts the article title, author(s), publication date, and full text content from the page. It filters out navigation, ads, and other non-content elements.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Set Your Focus and Analyze</h4>
                <p className="text-secondary-700">Define your focus and the AI will analyze the extracted content in about 90 seconds, just like a PDF upload.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary-50/50 border border-secondary-300/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Tip</p>
              <p className="text-secondary-700 text-sm">
                URL import works best with publicly accessible articles, blog posts, and news pages. Paywalled or login-protected content may not extract fully.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    'doi-lookup': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">DOI Lookup</h2>

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
          <p className="text-secondary-900">
            Enter a DOI (Digital Object Identifier) to instantly retrieve metadata for academic papers and journal articles from CrossRef.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">What CrossRef Provides</h3>
          <ul className="list-disc list-inside space-y-2 text-secondary-800">
            <li>Full paper title</li>
            <li>Complete author list with affiliations</li>
            <li>Journal or publication name</li>
            <li>Publication date, volume, issue, and page numbers</li>
            <li>Abstract (when available)</li>
            <li>ISSN / ISBN identifiers</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">How to Use DOI Lookup</h3>
          <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
            <ol className="list-decimal list-inside space-y-2 text-secondary-700">
              <li>Click "Create Entry" and select the DOI import option</li>
              <li>Paste the DOI (e.g., 10.1000/xyz123)</li>
              <li>DraftEngine queries CrossRef and populates metadata automatically</li>
              <li>Set your focus and generate your source summary</li>
            </ol>
          </div>
        </div>

        <div className="bg-secondary-50/50 border border-secondary-300/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Pro Tip</p>
              <p className="text-secondary-700 text-sm">
                DOI lookup is the fastest way to add academic papers to your library. Most academic papers have their DOI listed on the first page or in the database where you found them.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),

    'rss-feeds': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">RSS Feeds</h2>

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
          <p className="text-secondary-900">
            Subscribe to RSS feeds from academic journals, blogs, and news outlets to automatically discover new sources relevant to your work.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Subscribing to Feeds</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Add a Feed URL</h4>
                <p className="text-secondary-700">Navigate to the RSS section and paste the feed URL from any journal, blog, or publication that offers RSS.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Automatic Checking</h4>
                <p className="text-secondary-700">DraftEngine checks your subscribed feeds regularly and presents new articles for you to review and import into your source library.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Import and Analyze</h4>
                <p className="text-secondary-700">When you find a relevant article, import it with one click and generate a source summary entry as usual.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Supported Sources</h3>
          <ul className="list-disc list-inside space-y-2 text-secondary-800">
            <li>Academic journal feeds (PubMed, arXiv, JSTOR, etc.)</li>
            <li>News outlets and magazines</li>
            <li>Industry blogs and research organizations</li>
            <li>Any standard RSS or Atom feed</li>
          </ul>
        </div>
      </div>
    ),

    'creating-entries': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Creating Source Entries</h2>

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4 mb-4">
          <p className="text-secondary-900">
            Source entries can be created from any of the four import methods: PDF upload, URL import, DOI lookup, or RSS feed articles. Regardless of the import method, the AI analysis process works the same way.
          </p>
        </div>

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
            <div className="card card-floating bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-secondary-900">Key Arguments</h4>
              </div>
              <p className="text-secondary-700 text-sm">
                Automatically identifies and extracts the key arguments from your source for use in your writing.
              </p>
            </div>

            <div className="card card-floating bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-secondary-900">Interesting Angles</h4>
              </div>
              <p className="text-secondary-700 text-sm">
                Discovers interesting angles, unique perspectives, and notable passages based on your focus.
              </p>
            </div>

            <div className="card card-floating bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
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
            <strong>Processing Time:</strong> Most entries are analyzed in about 90 seconds. Complex papers may take slightly longer.
          </p>
        </div>
      </div>
    ),

    'citation-styles': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Citation Styles</h2>

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
          <p className="text-secondary-900">
            DraftEngine supports APA, MLA, and Chicago citation styles for generated content. Choose your preferred style and citations are formatted automatically.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Supported Styles</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-2">APA</h4>
              <p className="text-secondary-700 text-sm">
                American Psychological Association style. Common in social sciences, education, and psychology. Uses author-date in-text citations.
              </p>
            </div>

            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-2">MLA</h4>
              <p className="text-secondary-700 text-sm">
                Modern Language Association style. Common in humanities, literature, and language studies. Uses author-page in-text citations.
              </p>
            </div>

            <div className="card card-floating">
              <h4 className="font-semibold text-secondary-900 mb-2">Chicago</h4>
              <p className="text-secondary-700 text-sm">
                Chicago Manual of Style. Widely used in history, arts, and publishing. Supports both notes-bibliography and author-date formats.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">How to Enable a Citation Style</h3>
          <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-100">
            <ol className="list-decimal list-inside space-y-2 text-secondary-700">
              <li>When generating content, select your preferred citation style from the dropdown</li>
              <li>All in-text citations and reference lists are formatted automatically</li>
              <li>You can change the style later and regenerate if needed</li>
              <li>Exported documents preserve the selected citation formatting</li>
            </ol>
          </div>
        </div>
      </div>
    ),

    'research-feeds': (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-secondary-900">Research Feeds</h2>

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
          <p className="text-secondary-900">
            Research Feeds let you subscribe to topics and automatically discover new publications, articles, and sources relevant to your work. Available on the Pro plan.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-900">Subscribing to Topics</h3>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Define Your Research Topics</h4>
                <p className="text-secondary-700">Enter keywords, phrases, or topics that describe your research interests. For example: "machine learning in healthcare" or "climate policy effectiveness."</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Automatic Monitoring</h4>
                <p className="text-secondary-700">DraftEngine monitors academic databases and web sources, surfacing new articles that match your topics. You receive notifications when relevant new content is found.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold text-secondary-900 mb-2">Review and Import</h4>
                <p className="text-secondary-700">Browse discovered articles, read summaries, and import the ones that are useful directly into your source library for full analysis.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-secondary-900 mb-1">Pro Plan Feature</p>
              <p className="text-secondary-700 text-sm">
                Research Feeds are available on the Pro plan ($19.99/month). Upgrade from your account settings to start discovering sources automatically.
              </p>
            </div>
          </div>
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

        <div className="bg-primary/10 border border-primary-600/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-primary mt-0.5" />
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
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <FileDown className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Word Document</h4>
              <p className="text-secondary-700 text-sm">
                Export formatted source entries to .docx with proper styling and attribution.
              </p>
            </div>

            <div className="card card-floating">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">Plain Text</h4>
              <p className="text-secondary-700 text-sm">
                Copy source details and notes as plain text for easy pasting.
              </p>
            </div>

            <div className="card card-floating">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-primary" />
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
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-semibold text-secondary-900">Select Entries</p>
                <p className="text-secondary-700 text-sm">Choose individual entries or select multiple for bulk export.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-semibold text-secondary-900">Choose Format</p>
                <p className="text-secondary-700 text-sm">Select your preferred export format from the dropdown menu.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
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
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'hover:bg-secondary-200/20 text-secondary-900'
                      }`}
                    >
                      <span className={activeSection === section.id ? 'text-white' : 'text-primary'}>
                        {section.icon}
                      </span>
                      <span className="">{section.title}</span>
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-8 card card-floating bg-primary/10 border-primary-600/20">
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

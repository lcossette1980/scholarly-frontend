// src/pages/DocumentationPage.js
import React, { useState } from 'react';
import { 
  Book, 
  FileText, 
  Code, 
  Zap, 
  Settings, 
  ChevronRight,
  Copy,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState(null);

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'guides',
      title: 'Guides & Tutorials',
      icon: <Book className="w-5 h-5" />
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative bg-primary-900 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/60 uppercase">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="text-white/60 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="text-white text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 font-playfair mb-4">
            Documentation
          </h1>
          <p className="text-xl text-secondary-700 font-lato">
            Everything you need to integrate and use ScholarlyAI effectively
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-accent text-white'
                        : 'text-secondary-900 hover:bg-secondary-200/10'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeSection === 'getting-started' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-4">Getting Started</h2>
                  <p className="text-secondary-700 font-lato mb-6">
                    Welcome to ScholarlyAI! This guide will help you get started with creating your first annotated bibliography entry.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Step 1: Create Your Account
                  </h3>
                  <p className="text-secondary-700 font-lato mb-4">
                    Sign up for a free account to get started with 5 bibliography entries per month.
                  </p>
                  <div className="bg-accent/5 border border-accent-600/20 rounded-lg p-4">
                    <p className="text-secondary-800 font-lato">
                      💡 <strong>Tip:</strong> Use your institutional email for potential educational discounts.
                    </p>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Step 2: Upload Your First Document
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-secondary-700 font-lato">
                    <li>Navigate to the "Create Entry" page</li>
                    <li>Enter your research focus (e.g., "Machine Learning", "Climate Change")</li>
                    <li>Upload a PDF document (max 10MB)</li>
                    <li>Wait for AI analysis to complete (usually 30-60 seconds)</li>
                    <li>Review and edit the generated entry</li>
                    <li>Export to Word format</li>
                  </ol>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Step 3: Understanding Your Results
                  </h3>
                  <p className="text-secondary-700 font-lato mb-4">
                    Each generated entry includes:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <span className="text-secondary-700 font-lato"><strong>Citation:</strong> Properly formatted academic citation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <span className="text-secondary-700 font-lato"><strong>Narrative Overview:</strong> Comprehensive summary</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <span className="text-secondary-700 font-lato"><strong>Research Components:</strong> Methodology and framework</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <span className="text-secondary-700 font-lato"><strong>Key Findings:</strong> Important results and statistics</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <span className="text-secondary-700 font-lato"><strong>Key Quotes:</strong> Impactful quotes with page numbers</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'api-reference' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-4">API Reference</h2>
                  <p className="text-secondary-700 font-lato mb-6">
                    Integrate ScholarlyAI into your applications with our REST API.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Authentication
                  </h3>
                  <p className="text-secondary-700 font-lato mb-4">
                    All API requests require authentication using Firebase Auth tokens.
                  </p>
                  <CodeBlock
                    language="javascript"
                    id="auth-example"
                    code={`// Get Firebase auth token
const token = await user.getIdToken();

// Include in API requests
const response = await fetch('https://api.scholarlyaiapp.com/upload', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'multipart/form-data'
  },
  body: formData
});`}
                  />
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Upload Document
                  </h3>
                  <p className="text-secondary-700 font-lato mb-4">
                    <code className="bg-secondary-200/20 px-2 py-1 rounded">POST /upload</code>
                  </p>
                  <CodeBlock
                    language="javascript"
                    id="upload-example"
                    code={`const formData = new FormData();
formData.append('file', pdfFile);
formData.append('research_focus', 'Machine Learning');

const response = await fetch('/upload', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`
  },
  body: formData
});

const { task_id } = await response.json();`}
                  />
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Check Processing Status
                  </h3>
                  <p className="text-secondary-700 font-lato mb-4">
                    <code className="bg-secondary-200/20 px-2 py-1 rounded">GET /status/{'{task_id}'}</code>
                  </p>
                  <CodeBlock
                    language="javascript"
                    id="status-example"
                    code={`const checkStatus = async (taskId) => {
  const response = await fetch(\`/status/\${taskId}\`);
  const status = await response.json();
  
  // Response format:
  // {
  //   "status": "processing" | "completed" | "error",
  //   "progress": 75,
  //   "current_step": "Analyzing Content",
  //   "message": "Extracting key findings..."
  // }
  
  return status;
};`}
                  />
                </div>
              </div>
            )}

            {activeSection === 'guides' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-4">Guides & Tutorials</h2>
                  <p className="text-secondary-700 font-lato mb-6">
                    Detailed guides to help you get the most out of ScholarlyAI.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card card-hover">
                    <FileText className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 font-playfair mb-2">
                      Optimizing Research Focus
                    </h3>
                    <p className="text-secondary-700 font-lato mb-4">
                      Learn how to write effective research focus statements for better AI analysis.
                    </p>
                    <button className="text-accent hover:text-accent-600/80 font-medium flex items-center space-x-1">
                      <span>Read Guide</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="card card-hover">
                    <FileText className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 font-playfair mb-2">
                      Citation Style Guide
                    </h3>
                    <p className="text-secondary-700 font-lato mb-4">
                      Understanding different citation formats and when to use them.
                    </p>
                    <button className="text-accent hover:text-accent-600/80 font-medium flex items-center space-x-1">
                      <span>Read Guide</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="card card-hover">
                    <FileText className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 font-playfair mb-2">
                      Batch Processing
                    </h3>
                    <p className="text-secondary-700 font-lato mb-4">
                      Efficiently process multiple documents for large research projects.
                    </p>
                    <button className="text-accent hover:text-accent-600/80 font-medium flex items-center space-x-1">
                      <span>Read Guide</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="card card-hover">
                    <FileText className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 font-playfair mb-2">
                      Team Collaboration
                    </h3>
                    <p className="text-secondary-700 font-lato mb-4">
                      Share and collaborate on bibliography entries with your research team.
                    </p>
                    <button className="text-accent hover:text-accent-600/80 font-medium flex items-center space-x-1">
                      <span>Read Guide</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'best-practices' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-4">Best Practices</h2>
                  <p className="text-secondary-700 font-lato mb-6">
                    Tips and recommendations for getting the best results from ScholarlyAI.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Document Preparation
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <strong className="text-secondary-900">Use high-quality PDFs:</strong>
                        <span className="text-secondary-700"> Text-based PDFs work better than scanned images</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <strong className="text-secondary-900">Complete documents:</strong>
                        <span className="text-secondary-700"> Include full papers rather than excerpts for better analysis</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <strong className="text-secondary-900">Academic sources:</strong>
                        <span className="text-secondary-700"> Peer-reviewed articles produce the most accurate results</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Research Focus Guidelines
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-2">✅ Good Examples:</h4>
                      <ul className="space-y-1 text-secondary-700 text-sm">
                        <li>• "Machine Learning Ethics"</li>
                        <li>• "Climate Change Adaptation"</li>
                        <li>• "Educational Technology"</li>
                        <li>• "Healthcare AI Applications"</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-2">❌ Avoid:</h4>
                      <ul className="space-y-1 text-secondary-700 text-sm">
                        <li>• Too broad: "Technology"</li>
                        <li>• Too narrow: "BERT model performance"</li>
                        <li>• Vague: "Interesting research"</li>
                        <li>• Multiple topics: "AI and Climate and Education"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-4">
                    Quality Assurance
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-lato">
                      <strong>Always review AI-generated content!</strong> While our AI is highly accurate, 
                      you should verify citations, quotes, and analysis for accuracy and compliance with 
                      your institution's academic standards.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
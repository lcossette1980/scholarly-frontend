// src/pages/FeaturesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Quote,
  FileDown,
  Target,
  Zap,
  Shield,
  Users,
  BarChart3,
  Search,
  Clock,
  CheckCircle,
  FileText,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  X
} from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary-900 mb-6">
            Everything You Need for <span className="text-accent">Writing & Research</span>
          </h1>
          <p className="text-xl text-secondary-700 max-w-3xl mx-auto">
            From source analysis to complete document drafting, DraftEngine provides a comprehensive toolkit for writing success.
          </p>
        </div>

        {/* Core Features - 4 Main Tools */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Four Powerful Tools, One Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Bibliography Generator */}
            <div className="card card-hover">
              <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Source Analyzer
              </h3>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                Upload PDFs and get complete source summary entries in 90 seconds. AI extracts references, summarizes content, identifies key approaches, and pulls relevant quotes with page numbers.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>APA, MLA, Chicago, Harvard reference styles</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Automatic reference extraction from PDFs</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Key findings and approach analysis</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Smart quotes with exact page numbers</span>
                </li>
              </ul>
            </div>

            {/* Topic Generator */}
            <div className="card card-hover">
              <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Topic & Outline Generator
              </h3>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                Analyze your sources together to identify content opportunities and generate compelling topics with complete outlines. Every suggestion is backed by your actual sources.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Automatic content opportunity identification</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>3-5 topic suggestions per analysis</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Complete document outlines with sections</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Source mapping to outline sections</span>
                </li>
              </ul>
            </div>

            {/* Paper Generator */}
            <div className="card card-hover">
              <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Complete Document Generator
              </h3>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                Turn your sources and outline into a fully-referenced document in minutes. Choose document type, word count, citation style, and tone. AI generates professional content ready for editing.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>500-10,000 words (2-40 pages)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Multiple document types (article, essay, report, blog)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Inline references from YOUR sources</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>2-5 minute generation time</span>
                </li>
              </ul>
            </div>

            {/* Export & Editing */}
            <div className="card card-hover">
              <div className="w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center mb-6">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Export & Editing Tools
              </h3>
              <p className="text-secondary-700 mb-6 leading-relaxed">
                Download your work in multiple formats with professional formatting. Edit inline before downloading, manage versions, and organize your content library.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Export to Word, PDF, and TXT</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Inline editing before download</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Content history and management</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Professional document formatting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="mb-20 py-16 bg-gradient-to-br from-red-50 via-white to-green-50 -mx-6 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
              The Traditional Way vs. <span className="text-accent">DraftEngine</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Manual Method */}
              <div className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-700">Manual Method</h3>
                    <p className="text-sm text-red-600 font-semibold">40+ hours per paper</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-800 font-medium">Reading each paper (90 min/paper × 10 papers)</p>
                      <p className="text-secondary-500 text-xs">~15 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-800 font-medium">Writing source summaries</p>
                      <p className="text-secondary-500 text-xs">~6 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-800 font-medium">Identifying topics & outlining</p>
                      <p className="text-secondary-500 text-xs">~4 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-800 font-medium">Writing complete document draft</p>
                      <p className="text-secondary-500 text-xs">~15 hours</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-red-200 mt-4">
                  <p className="text-red-700 font-bold text-center">Total: 40+ hours 😫</p>
                </div>
              </div>

              {/* DraftEngine Method */}
              <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-xl relative">
                <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  95% FASTER
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-700">DraftEngine</h3>
                    <p className="text-sm text-green-600 font-semibold">~2 hours total</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-900 font-medium">Upload 10 PDFs to Source Analyzer</p>
                      <p className="text-secondary-500 text-xs">~2 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-900 font-medium">AI generates complete source summaries</p>
                      <p className="text-secondary-500 text-xs">~15 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-900 font-medium">Generate topics & select outline</p>
                      <p className="text-secondary-500 text-xs">~3 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-900 font-medium">AI writes complete document draft</p>
                      <p className="text-secondary-500 text-xs">~5 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-secondary-900 font-medium">Review, edit & refine</p>
                      <p className="text-secondary-500 text-xs">~2 hours</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200 mt-4">
                  <p className="text-green-700 font-bold text-center">Total: ~2 hours 🎉</p>
                  <p className="text-xs text-green-700 text-center mt-1">Time saved: 38 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Everything Else You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Topic Focus Customization</h3>
              <p className="text-secondary-700 text-sm">
                Tell AI your specific topic area for targeted, relevant analysis tailored to your needs.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">GPT-4 Powered</h3>
              <p className="text-secondary-700 text-sm">
                Advanced AI with 98% accuracy for reference extraction and analysis.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Approach Analysis</h3>
              <p className="text-secondary-700 text-sm">
                Deep analysis of methods, key findings, and limitations.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Private & Secure</h3>
              <p className="text-secondary-700 text-sm">
                PDFs aren't stored after processing. Your data stays yours. GDPR compliant.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Professional Standards</h3>
              <p className="text-secondary-700 text-sm">
                Proper references, clear language, professional formatting - ready to use.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Unlimited Revisions</h3>
              <p className="text-secondary-700 text-sm">
                Regenerate with different settings anytime (paid plans). No limit on iterations.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Common Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Can I edit the AI-generated content?
              </h3>
              <p className="text-secondary-700">
                Yes! Every field is fully editable. DraftEngine gives you a strong starting point that you can customize however you want.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                What citation styles are supported?
              </h3>
              <p className="text-secondary-700">
                We support APA, MLA, Chicago, and Harvard reference styles. Choose your preferred style and AI formats everything correctly.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                How accurate is the AI?
              </h3>
              <p className="text-secondary-700">
                Our AI has 98% accuracy for citation extraction and key finding identification. Always review output, but trust that you're starting from a strong foundation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="card bg-gradient-brand text-white text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of writers using DraftEngine to save 38+ hours per document.
          </p>
          <Link to="/signup" className="inline-block bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-4 rounded-lg font-semibold text-lg">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;

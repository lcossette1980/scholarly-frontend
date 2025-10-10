// src/pages/HomePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Quote,
  FileDown,
  Brain,
  CheckCircle,
  Users,
  Upload,
  FileText,
  Download,
  Clock,
  X,
  Zap,
  Target,
  Shield,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState('summary');

  return (
    <div className="min-h-screen">
      {/* Hero Section - The 5-Second Pitch */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-background.png"
            alt="Abstract academic background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Pain Point Badge */}
            <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">Stop spending 40+ hours per paper on research, reading, and writing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal font-playfair mb-6 leading-tight">
              Your AI-Powered Research Assistant:{' '}
              <span className="text-gradient">From PDFs to Published Paper</span>
              {' '}in Hours, Not Weeks
            </h1>

            <p className="text-lg sm:text-xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed font-lato">
              Upload research papers → Get annotated bibliographies → Generate topics & outlines → Create complete, cited academic papers. ScholarlyAI handles the tedious work so you can focus on your ideas.
            </p>

            {/* What You Get Preview */}
            <div className="bg-white/90 backdrop-blur rounded-xl border-2 border-chestnut/30 p-6 mb-8 max-w-3xl mx-auto shadow-lg">
              <p className="text-sm font-semibold text-chestnut mb-4 text-center">Complete Research Workflow in One Platform:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <FileText className="w-6 h-6 text-chestnut mb-2" />
                  <span className="text-charcoal font-medium text-sm text-center">Bibliography Generator</span>
                  <span className="text-xs text-charcoal/60">APA, MLA, Chicago</span>
                </div>
                <div className="flex flex-col items-center">
                  <Brain className="w-6 h-6 text-chestnut mb-2" />
                  <span className="text-charcoal font-medium text-sm text-center">Topic Generator</span>
                  <span className="text-xs text-charcoal/60">AI-powered insights</span>
                </div>
                <div className="flex flex-col items-center">
                  <BookOpen className="w-6 h-6 text-chestnut mb-2" />
                  <span className="text-charcoal font-medium text-sm text-center">Outline Creator</span>
                  <span className="text-xs text-charcoal/60">Structured sections</span>
                </div>
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</div>
                  <Sparkles className="w-6 h-6 text-chestnut mb-2" />
                  <span className="text-charcoal font-medium text-sm text-center">Paper Generator</span>
                  <span className="text-xs text-charcoal/60">Complete drafts</span>
                </div>
                <div className="flex flex-col items-center">
                  <Target className="w-6 h-6 text-chestnut mb-2" />
                  <span className="text-charcoal font-medium text-sm text-center">Citation Manager</span>
                  <span className="text-xs text-charcoal/60">Auto-formatted</span>
                </div>
                <div className="flex flex-col items-center">
                  <Download className="w-6 h-6 text-chestnut mb-2" />
                  <span className="text-charcoal font-medium text-sm text-center">Export Tools</span>
                  <span className="text-xs text-charcoal/60">Word, PDF, TXT</span>
                </div>
              </div>
              <div className="pt-4 border-t border-khaki/30">
                <a
                  href="/example.pdf"
                  download
                  className="flex items-center justify-center space-x-2 text-chestnut hover:text-chestnut/80 font-medium text-sm group"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  <span>Download Real Example Output (PDF)</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <Link
                to={currentUser ? "/create" : "/signup"}
                className="btn btn-primary text-lg px-8 py-4 group w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                {currentUser ? "Create Your First Entry Now" : "Try It Free - Upload Your First Paper"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto"
              >
                See How It Works ↓
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-charcoal/70 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">5 free entries (no card needed)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">90-second setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Export to Word/PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-charcoal/60 italic">
              Join 10,000+ researchers who've saved an average of 18 hours per month
            </p>
          </div>
        </div>
      </section>

      {/* Before/After Comparison - TIME SAVINGS */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-red-50 via-white to-green-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal font-playfair mb-4">
                The Traditional Way vs. <span className="text-chestnut">The ScholarlyAI Way</span>
              </h2>
              <p className="text-lg text-charcoal/70 font-lato">
                What takes you 4 hours takes ScholarlyAI 2 minutes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Manual Method */}
              <div className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-700 font-playfair">Manual Method</h3>
                    <p className="text-sm text-red-600 font-semibold">≈ 4 hours per paper</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Read entire 50-page paper carefully</p>
                      <p className="text-charcoal/50 text-xs">~90 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Highlight key passages & take notes</p>
                      <p className="text-charcoal/50 text-xs">~45 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Extract methodology & findings</p>
                      <p className="text-charcoal/50 text-xs">~30 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Find quotes & note page numbers</p>
                      <p className="text-charcoal/50 text-xs">~30 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Write coherent summary</p>
                      <p className="text-charcoal/50 text-xs">~45 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Format citation correctly</p>
                      <p className="text-charcoal/50 text-xs">~15 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal/80">Proofread & refine</p>
                      <p className="text-charcoal/50 text-xs">~15 minutes</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-red-200">
                  <p className="text-red-700 font-bold text-center">Total: 4+ hours 😫</p>
                </div>
              </div>

              {/* ScholarlyAI Method */}
              <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-xl relative">
                <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  98% FASTER
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-700 font-playfair">ScholarlyAI Method</h3>
                    <p className="text-sm text-green-600 font-semibold">≈ 2 minutes total</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal font-medium">Upload your PDF paper</p>
                      <p className="text-charcoal/50 text-xs">~10 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal font-medium">Choose citation style (APA/MLA/Chicago)</p>
                      <p className="text-charcoal/50 text-xs">~5 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal font-medium">Add research focus (optional)</p>
                      <p className="text-charcoal/50 text-xs">~15 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal font-medium">Click "Generate"</p>
                      <p className="text-charcoal/50 text-xs">~1 second</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 pl-8">
                    <Brain className="w-5 h-5 text-chestnut flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="text-sm italic">
                      <p className="text-chestnut/80">AI reads entire paper, extracts insights...</p>
                      <p className="text-charcoal/50 text-xs">~60 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-charcoal font-medium">Review & download Word doc</p>
                      <p className="text-charcoal/50 text-xs">~15 seconds</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200 space-y-3">
                  <p className="text-green-700 font-bold text-center">Total: 2 minutes 🎉</p>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-green-800">Time Saved: 3 hours 58 minutes</p>
                    <p className="text-xs text-green-700 mt-1">That's time you can spend actually writing your paper!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link to={currentUser ? "/create" : "/signup"} className="btn btn-primary text-lg px-8 py-4 group inline-flex shadow-lg">
                Save 4 Hours On Your Next Paper
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Problem - with image */}
              <div className="order-2 lg:order-1">
                <div className="inline-block bg-red-50 border border-red-200 rounded-lg px-3 py-1 mb-4">
                  <span className="text-red-700 text-sm font-medium">The Problem Every Researcher Faces</span>
                </div>
                <h2 className="text-3xl font-bold text-charcoal font-playfair mb-6">
                  Writing Annotated Bibliographies Is Painful
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Takes 2-4 hours per paper</p>
                      <p className="text-charcoal/60 text-sm">Reading, extracting, summarizing, formatting</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Repetitive and tedious</p>
                      <p className="text-charcoal/60 text-sm">Same process for every single source</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Easy to miss key findings</p>
                      <p className="text-charcoal/60 text-sm">Important details buried in 50+ page papers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Difficult to maintain consistency</p>
                      <p className="text-charcoal/60 text-sm">Format and style vary across entries</p>
                    </div>
                  </div>
                </div>

                {/* Image - Problem - Mobile */}
                <div className="mt-8 lg:hidden">
                  <img
                    src="/images/problem-manual-work.png"
                    alt="Researcher overwhelmed with manual bibliography work - stacks of papers, late hours, and stress"
                    className="w-full h-auto rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Problem Image - Desktop */}
              <div className="hidden lg:block order-1 lg:order-2">
                <img
                  src="/images/problem-manual-work.png"
                  alt="Researcher overwhelmed with manual bibliography work - stacks of papers, late hours, and stress"
                  className="w-full h-auto rounded-xl shadow-lg"
                  loading="eager"
                />
              </div>
            </div>

            {/* Solution Row */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
              {/* Solution Image */}
              <div className="order-1">
                <img
                  src="/images/solution-ai-powered.png"
                  alt="Relaxed researcher using ScholarlyAI with AI assistant - calm, organized workspace"
                  className="w-full h-auto rounded-xl shadow-lg"
                  loading="lazy"
                />
              </div>

              {/* Solution */}
              <div className="order-2">
                <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-3 py-1 mb-4">
                  <span className="text-green-700 text-sm font-medium">ScholarlyAI Solves This</span>
                </div>
                <h2 className="text-3xl font-bold text-charcoal font-playfair mb-6">
                  Get Perfect Bibliographies in Minutes
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Analyze any paper in 2 minutes</p>
                      <p className="text-charcoal/60 text-sm">Upload PDF → Get complete entry instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">AI extracts everything automatically</p>
                      <p className="text-charcoal/60 text-sm">Summary, findings, quotes with page numbers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Professional academic formatting</p>
                      <p className="text-charcoal/60 text-sm">APA, MLA, Chicago - all citation styles</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">Export ready-to-use entries</p>
                      <p className="text-charcoal/60 text-sm">Download as Word doc, copy & paste, or PDF</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to={currentUser ? "/create" : "/signup"}
                    className="btn btn-primary group inline-flex"
                  >
                    Try It Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section id="how-it-works" className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Dead Simple. <span className="text-chestnut">3 Steps</span> to Perfect Bibliographies
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto font-lato">
              No complex setup. No learning curve. Just upload and go.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="card text-center group hover:shadow-xl transition-shadow">
                <img
                  src="/images/step-1-upload.png"
                  alt="Step 1: Upload your PDF research paper to ScholarlyAI"
                  className="w-full h-auto rounded-xl mb-6"
                  loading="lazy"
                />

                <div className="w-12 h-12 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chestnut">1</span>
                </div>
                <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">Upload</h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  Drop your PDF research paper. We support any academic PDF, any length.
                </p>
              </div>

              {/* Step 2 */}
              <div className="card text-center group hover:shadow-xl transition-shadow">
                <img
                  src="/images/step-2-analyze.png"
                  alt="Step 2: AI analyzes your paper and extracts key information"
                  className="w-full h-auto rounded-xl mb-6"
                  loading="lazy"
                />

                <div className="w-12 h-12 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chestnut">2</span>
                </div>
                <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">AI Analyzes</h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  Our AI reads the entire paper and extracts citation, summary, findings, methodology, and quotes.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card text-center group hover:shadow-xl transition-shadow">
                <img
                  src="/images/step-3-download.png"
                  alt="Step 3: Download your formatted annotated bibliography entry"
                  className="w-full h-auto rounded-xl mb-6"
                  loading="lazy"
                />

                <div className="w-12 h-12 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-chestnut">3</span>
                </div>
                <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">Download</h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  Get a formatted Word doc with your complete annotated bibliography entry. Ready to submit.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-2 text-charcoal/60 mb-6">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Average time: 2 minutes from upload to download</span>
              </div>
              <div>
                <Link
                  to={currentUser ? "/create" : "/signup"}
                  className="btn btn-primary text-lg px-8 py-4 group inline-flex"
                >
                  Try It Now - It's Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get - Output Examples */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Here's What <span className="text-chestnut">ScholarlyAI Creates</span> For You
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto font-lato">
              Every entry includes everything you need, automatically formatted and ready to use.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: 'summary', label: 'Citation & Summary', icon: FileText },
                { id: 'findings', label: 'Key Findings', icon: Target },
                { id: 'methodology', label: 'Methodology', icon: Brain },
                { id: 'quotes', label: 'Smart Quotes', icon: Quote }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === tab.id
                      ? 'bg-chestnut text-white shadow-md'
                      : 'bg-white text-charcoal hover:bg-bone border border-khaki/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="card">
              {selectedTab === 'summary' && (
                <div>
                  <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">Professional Citation (APA)</h3>
                  <div className="bg-bone/50 border border-khaki/30 rounded-lg p-4 mb-6 font-mono text-sm">
                    Smith, J., & Johnson, M. (2024). Machine Learning Applications in Healthcare: A Systematic Review.
                    <em> Journal of Medical Informatics</em>, 45(3), 234-267. https://doi.org/10.1234/jmi.2024.045
                  </div>

                  <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">Research Summary</h3>
                  <div className="prose prose-sm max-w-none text-charcoal/80">
                    <p>
                      This systematic review examines the current applications of machine learning (ML) in healthcare,
                      analyzing 127 peer-reviewed studies published between 2020-2024. The authors investigate how ML
                      algorithms are being deployed across diagnostic imaging, patient outcome prediction, and treatment
                      personalization...
                    </p>
                  </div>
                </div>
              )}

              {selectedTab === 'findings' && (
                <div>
                  <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">Key Findings</h3>
                  <ul className="space-y-3 text-charcoal/80">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-chestnut flex-shrink-0 mt-0.5" />
                      <span>ML algorithms demonstrated 94% accuracy in early cancer detection, outperforming traditional screening methods by 12%</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-chestnut flex-shrink-0 mt-0.5" />
                      <span>Patient outcome prediction models reduced hospital readmissions by 23% when integrated into clinical workflows</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-chestnut flex-shrink-0 mt-0.5" />
                      <span>Deep learning approaches for medical imaging analysis showed significant improvements in processing speed (40% faster) while maintaining diagnostic accuracy</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-chestnut flex-shrink-0 mt-0.5" />
                      <span>Personalized treatment recommendation systems increased treatment efficacy by 18% compared to standard protocols</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedTab === 'methodology' && (
                <div>
                  <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">Methodology Analysis</h3>
                  <div className="space-y-4 text-charcoal/80">
                    <div>
                      <p className="font-semibold mb-2">Study Design:</p>
                      <p>Systematic review following PRISMA guidelines with meta-analysis of quantitative outcomes</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Sample Size:</p>
                      <p>127 studies analyzed, representing 2.4 million patients across 34 countries</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Data Collection:</p>
                      <p>Multi-database search (PubMed, MEDLINE, Web of Science) with dual independent screening</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Statistical Analysis:</p>
                      <p>Random-effects meta-analysis with sensitivity analysis for high-quality studies (n=89)</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'quotes' && (
                <div>
                  <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">Smart Quotes (with page numbers!)</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-chestnut pl-4">
                      <p className="text-charcoal/80 italic mb-2">
                        "The integration of machine learning into clinical workflows represents a paradigm shift in how healthcare providers approach diagnosis and treatment planning."
                      </p>
                      <p className="text-sm text-charcoal/60">— Page 245</p>
                    </div>
                    <div className="border-l-4 border-chestnut pl-4">
                      <p className="text-charcoal/80 italic mb-2">
                        "Our meta-analysis reveals that ML-assisted diagnostic tools reduce false-negative rates by 34% compared to traditional methods, potentially saving thousands of lives annually."
                      </p>
                      <p className="text-sm text-charcoal/60">— Page 252</p>
                    </div>
                    <div className="border-l-4 border-chestnut pl-4">
                      <p className="text-charcoal/80 italic mb-2">
                        "The most significant barrier to ML adoption remains not technical capability but rather clinician trust and interpretability of algorithmic decisions."
                      </p>
                      <p className="text-sm text-charcoal/60">— Page 261</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-khaki/30">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-charcoal/60">
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>Export to Word, PDF, or Copy</span>
                    </div>
                    <a
                      href="/example.pdf"
                      download
                      className="flex items-center space-x-1 text-chestnut hover:text-chestnut/80 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample Output</span>
                    </a>
                  </div>
                  <Link to={currentUser ? "/create" : "/signup"} className="btn btn-primary btn-sm">
                    Create Yours →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ScholarlyAI Beats Manual Work */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Why ScholarlyAI <span className="text-chestnut">Beats Manual Work</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-chestnut" />
              </div>
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">Tailored to YOUR Research</h3>
              <p className="text-charcoal/70 text-sm font-lato">
                Tell us your focus area → Get relevant insights, not generic summaries
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-chestnut" />
              </div>
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">Smarter Than Ctrl+F</h3>
              <p className="text-charcoal/70 text-sm font-lato">
                AI understands context, methodology, and statistical significance
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-chestnut" />
              </div>
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">100x Faster</h3>
              <p className="text-charcoal/70 text-sm font-lato">
                What takes you 3 hours takes our AI 2 minutes
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-chestnut" />
              </div>
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">Academic Standards</h3>
              <p className="text-charcoal/70 text-sm font-lato">
                Proper citations, quote attribution, scholarly language
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-chestnut" />
              </div>
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">Unlimited Revisions</h3>
              <p className="text-charcoal/70 text-sm font-lato">
                Regenerate with different focus areas (Paid plans)
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-chestnut" />
              </div>
              <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">Your Papers Stay Private</h3>
              <p className="text-charcoal/70 text-sm font-lato">
                We don't store or share your research
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic & Outline Generator Feature - THE BIG DIFFERENTIATOR */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-chestnut/5 via-white to-chestnut/10 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-chestnut/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4">
                <span className="text-green-700 text-sm font-bold">🎯 GAME-CHANGING FEATURE</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
                Generate Research Topics & Outlines
                <br />
                <span className="text-chestnut">Based on YOUR Bibliography</span>
              </h2>
              <p className="text-lg text-charcoal/70 max-w-3xl mx-auto font-lato">
                After building your bibliography, use those same sources to instantly generate research topics and comprehensive outlines. No other tool does this.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Visual/Example */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-2xl border border-khaki/30 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-charcoal/60 ml-2">scholarlyaiapp.com/topic-generator</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-bone/50 rounded-lg p-4">
                      <p className="text-xs text-charcoal/60 mb-2">Your Bibliography Sources:</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-charcoal/80">Smith et al. (2024) - ML in Healthcare</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-charcoal/80">Johnson (2023) - Patient Outcomes</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-charcoal/80">Lee (2024) - Diagnostic AI</span>
                        </div>
                        <p className="text-xs text-charcoal/60 italic">+ 7 more sources...</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <Brain className="w-6 h-6 text-chestnut animate-pulse" />
                      <span className="text-sm text-chestnut ml-2 font-medium">AI Analyzing Your Sources...</span>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-green-800 mb-3">Generated Research Topics:</p>
                      <div className="space-y-3">
                        <div className="bg-white rounded p-3 border border-green-300">
                          <p className="text-sm font-medium text-charcoal mb-1">
                            "The Impact of Machine Learning on Early Disease Detection: A Systematic Review"
                          </p>
                          <p className="text-xs text-charcoal/60">
                            Gap identified: Limited research on real-world clinical integration
                          </p>
                        </div>
                        <div className="bg-white rounded p-3 border border-green-300">
                          <p className="text-sm font-medium text-charcoal mb-1">
                            "Patient Outcome Prediction Models: Challenges and Opportunities"
                          </p>
                          <p className="text-xs text-charcoal/60">
                            Gap identified: Lack of standardization across healthcare systems
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-chestnut/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-chestnut" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">
                        Identifies Research Gaps Automatically
                      </h3>
                      <p className="text-charcoal/70 font-lato">
                        AI analyzes your bibliography sources and finds what hasn't been studied yet—giving you original, compelling research topics based on actual evidence.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-chestnut/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-chestnut" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">
                        Generates Complete Outlines
                      </h3>
                      <p className="text-charcoal/70 font-lato">
                        Get a full paper outline with introduction, literature review sections, methodology, and conclusion—all based on the sources you've already analyzed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-chestnut/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-chestnut" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-charcoal font-playfair mb-2">
                        Directly Tied to Your Sources
                      </h3>
                      <p className="text-charcoal/70 font-lato">
                        Every topic and outline section references specific papers from YOUR bibliography—so you know exactly which sources support each point.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      💡 <strong>Unique to ScholarlyAI:</strong> Other tools just create bibliographies. We help you actually USE those sources to write your paper.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-lg border border-khaki/30 p-8">
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-6 text-center">
                How the Topic & Outline Generator Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chestnut">1</span>
                  </div>
                  <h4 className="font-bold text-charcoal mb-2">Build Your Bibliography</h4>
                  <p className="text-sm text-charcoal/70">
                    Upload 5-10 research papers and generate annotated bibliography entries
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chestnut">2</span>
                  </div>
                  <h4 className="font-bold text-charcoal mb-2">Click "Generate Topics"</h4>
                  <p className="text-sm text-charcoal/70">
                    AI analyzes all your sources together to identify patterns and gaps
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-chestnut">3</span>
                  </div>
                  <h4 className="font-bold text-charcoal mb-2">Get Topics + Outlines</h4>
                  <p className="text-sm text-charcoal/70">
                    Receive 3-5 research topic ideas with complete outlines, ready to use
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link to="/pricing" className="btn btn-primary inline-flex items-center group">
                  Available on Researcher Plan
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-charcoal/60 mt-2">$19.99/month • Unlimited topics & outlines</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: AI Content Generation Feature */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-purple-50 border border-purple-200 rounded-lg px-3 py-1 mb-4">
                <span className="text-purple-700 text-sm font-bold">✨ NEW: AI-POWERED CONTENT GENERATION</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
                Generate Complete Papers
                <br />
                <span className="text-chestnut">From Your Sources</span>
              </h2>
              <p className="text-lg text-charcoal/70 max-w-3xl mx-auto font-lato">
                Turn your bibliography into a complete, properly-cited research paper in minutes.
                Choose your outline, set your preferences, and let AI do the heavy lifting.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Left: Feature highlights */}
              <div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal font-playfair mb-2">Complete Academic Papers</h3>
                      <p className="text-charcoal/70 font-lato leading-relaxed">
                        Generate research papers, essays, articles, or blog posts from 500 to 10,000 words.
                        Properly formatted with citations from YOUR sources.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal font-playfair mb-2">Multiple Citation Styles</h3>
                      <p className="text-charcoal/70 font-lato leading-relaxed">
                        APA, MLA, Chicago, or Harvard formatting. Choose your style and let AI handle
                        all citations correctly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal font-playfair mb-2">Export to Word & PDF</h3>
                      <p className="text-charcoal/70 font-lato leading-relaxed">
                        Download your generated content as beautifully formatted Word documents or PDFs.
                        Edit inline before downloading.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal font-playfair mb-2">2-5 Minutes Generation</h3>
                      <p className="text-charcoal/70 font-lato leading-relaxed">
                        What would take you hours to write happens in minutes. Real-time progress tracking
                        shows each section being generated.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl border-2 border-purple-200 shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-charcoal">Two Quality Tiers</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-charcoal">Standard (GPT-4o)</p>
                        <p className="text-sm text-charcoal/60">High-quality generation</p>
                      </div>
                      <p className="text-lg font-bold text-chestnut">$1.49/page</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-2 border-purple-300">
                      <div>
                        <p className="font-semibold text-purple-800">Pro (GPT-4 Turbo) ⭐</p>
                        <p className="text-sm text-purple-600">Premium quality + priority</p>
                      </div>
                      <p className="text-lg font-bold text-purple-700">$2.49/page</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Visual or workflow */}
              <div>
                <div className="bg-white rounded-xl border-2 border-gray-200 shadow-2xl p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                      <p className="font-semibold text-charcoal">Select 3-10 sources from your bibliography</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-charcoal/70">AI in Education (Smith, 2023)</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-charcoal/70">Machine Learning Methods (Chen, 2024)</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-charcoal/70">Future of EdTech (Lee, 2023)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                      <p className="font-semibold text-charcoal">Choose or create your outline</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-charcoal mb-2">AI in Modern Education Systems</p>
                      <div className="space-y-1 text-xs text-charcoal/60">
                        <p>• Introduction</p>
                        <p>• Current State of AI in Education</p>
                        <p>• Benefits and Challenges</p>
                        <p>• Future Implications</p>
                        <p>• Conclusion</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                      <p className="font-semibold text-charcoal">Set preferences & generate</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-charcoal/60">Type:</p>
                        <p className="font-semibold text-charcoal">Research Paper</p>
                      </div>
                      <div>
                        <p className="text-charcoal/60">Words:</p>
                        <p className="font-semibold text-charcoal">2,500 (10 pages)</p>
                      </div>
                      <div>
                        <p className="text-charcoal/60">Style:</p>
                        <p className="font-semibold text-charcoal">APA 7th</p>
                      </div>
                      <div>
                        <p className="text-charcoal/60">Tone:</p>
                        <p className="font-semibold text-charcoal">Academic</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                      <p className="font-semibold text-green-700">Generated in 4 minutes</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-800 font-medium mb-2">✅ 2,547 words • 10 pages • Fully cited</p>
                      <div className="flex items-center space-x-2">
                        <button className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          Download Word
                        </button>
                        <button className="text-xs px-3 py-1 bg-white text-green-700 border border-green-300 rounded hover:bg-green-50 transition-colors">
                          Edit Content
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to={currentUser ? "/content/generate" : "/signup"}
                    className="btn btn-primary inline-flex items-center group text-lg px-8 py-4 shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {currentUser ? "Generate Your First Paper" : "Try Content Generation"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-xs text-charcoal/60 mt-2">Pay only for what you generate • No subscription required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-16 lg:py-20 relative">
        <div className="absolute inset-0">
          <img
            src="/images/testimonials-bg.png"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Trusted by <span className="text-chestnut">10,000+ Researchers</span>
            </h2>
            <div className="flex items-center justify-center space-x-2 text-charcoal/60">
              <Users className="w-5 h-5" />
              <span className="font-lato">Join researchers from Harvard, MIT, Stanford, and 500+ institutions</span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-chestnut rounded-full flex items-center justify-center text-white font-bold">
                  SC
                </div>
                <div>
                  <p className="font-semibold text-charcoal">Dr. Sarah Chen</p>
                  <p className="text-sm text-charcoal/60">Research Professor</p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-chestnut/30 mb-2" />
              <p className="text-charcoal/80 leading-relaxed italic">
                "I finished my lit review in 2 days instead of 2 weeks. ScholarlyAI has revolutionized my research workflow."
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-chestnut rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div>
                  <p className="font-semibold text-charcoal">Michael Rodriguez</p>
                  <p className="text-sm text-charcoal/60">PhD Candidate, History</p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-chestnut/30 mb-2" />
              <p className="text-charcoal/80 leading-relaxed italic">
                "My professor said it was the best-formatted bibliography she'd seen. The AI analysis is incredibly accurate."
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-chestnut rounded-full flex items-center justify-center text-white font-bold">
                  EW
                </div>
                <div>
                  <p className="font-semibold text-charcoal">Emily Watson</p>
                  <p className="text-sm text-charcoal/60">Undergraduate Student</p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-chestnut/30 mb-2" />
              <p className="text-charcoal/80 leading-relaxed italic">
                "Game-changer for my research projects. I actually enjoy literature reviews now!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Simple, Transparent <span className="text-chestnut">Pricing</span>
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto font-lato">
              Start free, upgrade when you need more. No contracts, cancel anytime.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$0</span>
                <span className="text-charcoal/60">/forever</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">Perfect for trying it out</p>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>5 entries (lifetime)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Bibliography Generator</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Basic AI analysis</span>
                </li>
              </ul>
              <Link to="/signup" className="btn btn-outline w-full">Start Free</Link>
            </div>

            {/* Student - Most Popular */}
            <div className="card text-center ring-2 ring-chestnut relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-chestnut text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">Student</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$9.99</span>
                <span className="text-charcoal/60">/month</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">For ongoing research</p>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Unlimited entries</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All citation styles</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/pricing" className="btn btn-primary w-full">Start Trial</Link>
            </div>

            {/* Researcher */}
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">Researcher</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$19.99</span>
                <span className="text-charcoal/60">/month</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">For power users</p>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Everything in Student</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Topic & Outline Generator</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Research synthesis tools</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Premium AI</span>
                </li>
              </ul>
              <Link to="/pricing" className="btn btn-outline w-full">Start Trial</Link>
            </div>
          </div>

          <p className="text-center text-sm text-charcoal/60 mt-8">
            All plans include: Export to Word, secure & private, cancel anytime
          </p>
        </div>
      </section>

      {/* FAQ Section - Objection Handling */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
                Frequently Asked <span className="text-chestnut">Questions</span>
              </h2>
              <p className="text-lg text-charcoal/70 font-lato">
                Everything you need to know about ScholarlyAI
              </p>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  Is this plagiarism? Will my professor know I used AI?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  <strong>No, ScholarlyAI is NOT plagiarism.</strong> Think of it like using Grammarly or a citation generator—it's a research tool that helps you work faster and more efficiently.
                  ScholarlyAI creates <em>original summaries</em> in academic language, extracts key findings, and properly cites everything. The output looks like professional academic writing because that's what it is.
                  You can (and should) edit and customize everything to match your voice.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  How accurate is the AI? Can I trust it for my research?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  Our AI is trained on over 50,000 academic papers and has 98% accuracy for citation extraction and key finding identification.
                  That said, <strong>you should always review the output</strong>—just like you'd proofread any writing. The AI gives you a strong, accurate starting point that you can verify and customize.
                  Think of it as having a research assistant who's read the entire paper for you and highlighted the important parts.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  Can I edit the AI-generated content?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  <strong>Yes! Every field is fully editable.</strong> ScholarlyAI gives you a complete annotated bibliography entry that you can customize however you want.
                  Change the summary, add your own insights, adjust the focus—it's your research. We just save you 4 hours of reading and formatting.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  What citation styles do you support?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  We support <strong>APA, MLA, Chicago, and Harvard</strong> citation styles. You can choose your preferred style when creating an entry, and the AI will format everything correctly—including in-text citations for quotes.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  What file types can I upload?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  We accept <strong>PDF files only</strong>—which covers 99% of academic papers. The paper can be any length (we've processed 200+ page dissertations successfully).
                  If your paper is in a different format, just convert it to PDF first (Word, Google Docs, etc. all have built-in PDF export).
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  Is my research private and secure?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  <strong>Yes, absolutely.</strong> We don't store your uploaded PDFs after processing, and we never share or sell your data. Your research stays yours.
                  We only keep the bibliography entries you create (which you can delete anytime). All data transmission is encrypted and GDPR compliant.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  Can I really do this for free?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  <strong>Yes! You get 5 free entries (lifetime)—no credit card required.</strong> For most students, 5 entries is enough to complete a single annotated bibliography assignment.
                  If you need more, our Student plan is $9.99/month for unlimited entries. Most students complete their entire semester's worth of bibliographies with the free plan + one month of Student.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  What's the difference between Student and Researcher plans?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  <strong>Student Plan ($9.99/mo):</strong> Unlimited bibliography entries, all citation styles, priority support.
                  <br /><br />
                  <strong>Researcher Plan ($19.99/mo):</strong> Everything in Student PLUS the Topic & Outline Generator—which analyzes all your bibliography sources together to suggest research topics and generate complete paper outlines.
                  Perfect for dissertations, theses, or anyone writing multiple research papers.
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold text-charcoal font-playfair mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-charcoal/70 font-lato leading-relaxed">
                  <strong>Yes, cancel anytime with one click—no questions asked.</strong> If you're not happy within the first 30 days, email us for a full refund.
                  We want you to love ScholarlyAI, and if it doesn't work for you, we don't want your money.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-charcoal/70 mb-4">Still have questions?</p>
              <Link to="/help" className="btn btn-outline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/cta-background.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-5xl font-bold font-playfair mb-6">
              Ready to Save Hours on Every Paper?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-lato">
              Join 10,000+ researchers who've transformed their bibliography workflow
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link
                to={currentUser ? "/create" : "/signup"}
                className="bg-white text-chestnut hover:bg-bone transition-colors px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto"
              >
                {currentUser ? "Create Your First Entry" : "Start Free - No Credit Card"}
              </Link>
              <Link
                to="/pricing"
                className="border-2 border-white text-white hover:bg-white hover:text-chestnut transition-colors px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto"
              >
                View All Plans
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>5 free entries to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>2-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>

            <p className="text-white/70 text-sm mt-6">
              1,247 researchers signed up this week
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

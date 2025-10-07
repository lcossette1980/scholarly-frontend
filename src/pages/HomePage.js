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
            <div className="inline-flex items-center space-x-2 bg-chestnut/10 border border-chestnut/20 rounded-full px-4 py-2 mb-6">
              <Clock className="w-4 h-4 text-chestnut" />
              <span className="text-sm font-medium text-chestnut">Stop spending hours on annotated bibliographies</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal font-playfair mb-6 leading-tight">
              Let AI Create Your{' '}
              <span className="text-gradient">Annotated Bibliographies</span>
              {' '}in Minutes
            </h1>

            <p className="text-lg sm:text-xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed font-lato">
              Upload a research paper → Get a complete annotated bibliography entry with citation, summary, key findings, methodology analysis, and quotes. All formatted and ready to use.
            </p>

            {/* What You Get Preview */}
            <div className="bg-white/80 backdrop-blur rounded-xl border border-khaki/30 p-4 mb-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <FileText className="w-5 h-5 text-chestnut mb-1" />
                  <span className="text-charcoal/70 text-center">Citation</span>
                </div>
                <div className="flex flex-col items-center">
                  <BookOpen className="w-5 h-5 text-chestnut mb-1" />
                  <span className="text-charcoal/70 text-center">Summary</span>
                </div>
                <div className="flex flex-col items-center">
                  <Target className="w-5 h-5 text-chestnut mb-1" />
                  <span className="text-charcoal/70 text-center">Key Findings</span>
                </div>
                <div className="flex flex-col items-center">
                  <Brain className="w-5 h-5 text-chestnut mb-1" />
                  <span className="text-charcoal/70 text-center">Methodology</span>
                </div>
                <div className="flex flex-col items-center sm:col-span-1 col-span-2">
                  <Quote className="w-5 h-5 text-chestnut mb-1" />
                  <span className="text-charcoal/70 text-center">Smart Quotes</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link
                to={currentUser ? "/create" : "/signup"}
                className="btn btn-primary text-lg px-8 py-4 group w-full sm:w-auto"
              >
                {currentUser ? "Create Entry Now" : "Start Free - No Credit Card"}
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
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-charcoal/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>5 free entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>2-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Export to Word</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
              </div>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-charcoal/60">
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>Export to Word, PDF, or Copy</span>
                    </div>
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

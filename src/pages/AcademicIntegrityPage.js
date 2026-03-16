// src/pages/AcademicIntegrityPage.js
import React from 'react';
import { Shield, CheckCircle, BookOpen, Search, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/motion';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const AcademicIntegrityPage = () => {
  return (
    <div className="min-h-screen py-16 lg:py-20 bg-mesh">
      <SEO
        title="Ethical AI & Source Attribution"
        description="How DraftEngine handles your sources with integrity. Transparent AI writing, traceable attribution, and best practices for credible content."
        path="/ethical-ai"
      />
      <div className="container mx-auto px-6">
        <div className="h-1 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 max-w-5xl mx-auto" />
        <FadeIn direction="up">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12 mt-8">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              How We Handle <span className="text-gradient">Your Sources</span>
            </h1>
            <p className="text-lg text-secondary-800 leading-relaxed">
              Transparent AI, credible writing. Here's how DraftEngine uses your source material
              to produce content you can stand behind.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Our Approach */}
            <section className="card card-floating">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Our Approach to <span className="text-gradient">Ethical AI</span> Writing
              </h2>
              <p className="text-secondary-800 mb-6 leading-relaxed">
                DraftEngine is a <strong>writing assistant</strong>, not a replacement for your own thinking.
                We help you work faster while keeping your content credible, original, and grounded in real sources.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-secondary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">Source-Grounded Content</h3>
                  <p className="text-sm text-secondary-800">
                    All content is generated from YOUR uploaded sources, not from general AI knowledge.
                    Every claim traces back to something real.
                  </p>
                </div>
                <div className="bg-secondary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">Traceable Attribution</h3>
                  <p className="text-sm text-secondary-800">
                    Sources are referenced naturally in your content — by author name, research context,
                    or key findings — so readers know where ideas come from.
                  </p>
                </div>
                <div className="bg-secondary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">Transparent Process</h3>
                  <p className="text-sm text-secondary-800">
                    We show you which sources support each section so you can verify, edit,
                    and make the content truly yours.
                  </p>
                </div>
              </div>
            </section>

            {/* How Source Processing Works */}
            <section className="card card-floating">
              <div className="flex items-center space-x-3 mb-6">
                <Search className="w-8 h-8 text-accent" />
                <h2 className="text-3xl font-bold text-secondary-900">
                  How <span className="text-gradient">Source Processing</span> Works
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">PDF Text Extraction</h3>
                    <p className="text-secondary-800">
                      When you upload a PDF, we extract the full text while preserving structure and page numbers.
                      This ensures every piece of information can be traced back to its source.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">Metadata Detection</h3>
                    <p className="text-secondary-800">
                      Our AI identifies author names, publication details, key themes, and other metadata
                      to build a rich profile of each source.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">Smart Summarization</h3>
                    <p className="text-secondary-800">
                      We identify key findings, arguments, and insights directly from the source text.
                      All summaries reflect what the material actually says — not general knowledge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">Key Quote Extraction</h3>
                    <p className="text-secondary-800">
                      Important quotes are pulled with page numbers so you can reference or verify them
                      in your writing. No guessing — just accurate source material.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">Natural Attribution</h3>
                    <p className="text-secondary-800">
                      Sources are woven naturally into your content — referenced by name, context, and findings
                      the way a skilled journalist or essayist would handle them.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Generation Integrity */}
            <section className="card card-floating bg-gradient-to-br from-accent/5 to-secondary-50">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Content Generation & <span className="text-gradient">Source Integrity</span>
              </h2>
              <p className="text-secondary-800 mb-6 leading-relaxed">
                When you generate content with DraftEngine, every idea is grounded in your uploaded sources:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Natural source references:</strong> Authors and their work
                    are mentioned by name, woven into the narrative the way a great article would handle attribution.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Source-constrained generation:</strong> Our AI only
                    draws from information in your uploaded PDFs — it won't invent sources or pull from the internet.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Multi-source synthesis:</strong> Each section draws from
                    multiple sources, creating richer arguments instead of summarizing one source at a time.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Verifiable claims:</strong> Because all content traces back
                    to your sources, you can fact-check every reference before publishing.
                  </div>
                </li>
              </ul>
            </section>

            {/* What We Don't Do */}
            <section className="card card-floating border-2 border-red-200 bg-red-50/30">
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl font-bold text-secondary-900">
                  What We Don't Do
                </h2>
              </div>
              <p className="text-secondary-800 mb-6">
                To keep your writing credible, DraftEngine deliberately avoids certain practices:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't fabricate sources:</strong> Every reference
                    comes from material you uploaded. We never generate fake sources or made-up quotes.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't pull from general knowledge:</strong> Content
                    generation uses only information from YOUR sources, not Wikipedia or other databases.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't hide our role:</strong> DraftEngine is an AI
                    writing tool. We recommend being transparent about AI assistance and always revising
                    generated content into your own voice before publishing.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't replace your thinking:</strong> DraftEngine
                    is a writing assistant. You should always review, verify, and shape any generated content
                    to reflect your perspective.
                  </div>
                </li>
              </ul>
            </section>

            {/* Best Practices */}
            <section className="card card-floating">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Best Practices for Using <span className="text-gradient">DraftEngine</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-secondary-300/30 rounded-lg p-6">
                  <h3 className="font-bold text-secondary-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Do This
                  </h3>
                  <ul className="space-y-2 text-sm text-secondary-800">
                    <li>✓ Use source summaries to organize your material</li>
                    <li>✓ Verify key claims against the original sources</li>
                    <li>✓ Use generated outlines as a starting framework</li>
                    <li>✓ Revise AI-generated content into your own voice</li>
                    <li>✓ Add your own insights and perspective</li>
                    <li>✓ Fact-check before publishing</li>
                  </ul>
                </div>
                <div className="border border-red-300 rounded-lg p-6 bg-red-50/20">
                  <h3 className="font-bold text-secondary-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    Avoid This
                  </h3>
                  <ul className="space-y-2 text-sm text-secondary-800">
                    <li>✗ Publishing generated content without revision</li>
                    <li>✗ Using sources you haven't actually read</li>
                    <li>✗ Claiming AI-generated ideas as entirely original</li>
                    <li>✗ Skipping fact-checking of claims and references</li>
                    <li>✗ Relying on DraftEngine without understanding your topic</li>
                    <li>✗ Ignoring the sources behind each section</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Source Attribution Approach */}
            <section className="card card-floating">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                How Sources Appear in <span className="text-gradient">Your Content</span>
              </h2>
              <p className="text-secondary-800 mb-6">
                DraftEngine weaves sources naturally into your writing — the way a great essayist or journalist would:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">By Name</h4>
                  <p className="text-sm text-secondary-600">"Zaidi's research reveals..."</p>
                </div>
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">By Context</h4>
                  <p className="text-sm text-secondary-600">"The work coming out of MIT..."</p>
                </div>
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">By Discovery</h4>
                  <p className="text-sm text-secondary-600">"What De Santis found..."</p>
                </div>
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">By Argument</h4>
                  <p className="text-sm text-secondary-600">"Herremans makes the case..."</p>
                </div>
              </div>
              <p className="text-sm text-secondary-600 mt-6 text-center">
                Sources are treated as voices in a conversation, not footnotes — giving your writing
                credibility without breaking the flow.
              </p>
            </section>

            {/* Final Note */}
            <section className="bg-gradient-brand text-white rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Write Better, Write Honestly
              </h2>
              <p className="text-lg mb-6 text-white/90">
                DraftEngine helps you turn source material into compelling content while keeping
                every claim grounded and traceable. Use it as your writing partner, not a shortcut.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-3 rounded-lg font-semibold inline-block"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/features"
                    className="border-2 border-white text-white hover:bg-white hover:text-accent-600 transition-colors px-8 py-3 rounded-lg font-semibold inline-block"
                  >
                    Explore Features
                  </Link>
                </motion.div>
              </div>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default AcademicIntegrityPage;

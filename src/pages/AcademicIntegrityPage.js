// src/pages/AcademicIntegrityPage.js
import React from 'react';
import { Shield, CheckCircle, BookOpen, Search, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/motion';
import { motion } from 'framer-motion';

const AcademicIntegrityPage = () => {
  return (
    <div className="min-h-screen py-16 lg:py-20 bg-mesh">
      <div className="container mx-auto px-6">
        <div className="h-1 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 max-w-5xl mx-auto" />
        <FadeIn direction="up">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-12 mt-8">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              How We <span className="text-gradient">Cite & Verify</span> Sources
            </h1>
            <p className="text-lg text-secondary-800 leading-relaxed">
              Ethical AI use is at the core of DraftEngine. Here's exactly how we ensure every citation is accurate,
              verifiable, and properly formatted.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Our Approach */}
            <section className="card card-floating">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Our Approach to <span className="text-gradient">Ethical AI</span> Use
              </h2>
              <p className="text-secondary-800 mb-6 leading-relaxed">
                DraftEngine is designed to be a <strong>writing assistant</strong>, not a replacement for your own critical thinking.
                We help you work faster while maintaining the highest standards of integrity.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-secondary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">Source-Based Generation</h3>
                  <p className="text-sm text-secondary-800">
                    All content is generated from YOUR uploaded sources, not from general AI knowledge.
                  </p>
                </div>
                <div className="bg-secondary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">Citation Verification</h3>
                  <p className="text-sm text-secondary-800">
                    Every citation includes page numbers and can be traced back to the original source.
                  </p>
                </div>
                <div className="bg-secondary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-secondary-900 mb-2">Transparent Process</h3>
                  <p className="text-sm text-secondary-800">
                    We show you which sources support each claim so you can verify and understand.
                  </p>
                </div>
              </div>
            </section>

            {/* How Citation Works */}
            <section className="card card-floating">
              <div className="flex items-center space-x-3 mb-6">
                <Search className="w-8 h-8 text-accent" />
                <h2 className="text-3xl font-bold text-secondary-900">
                  How Our <span className="text-gradient">Citation Process</span> Works
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
                      When you upload a PDF, we extract the full text content while preserving page numbers.
                      This ensures we can trace every piece of information back to its exact location.
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
                      Our AI scans the paper for author names, publication year, journal title, DOI, and other
                      citation metadata. We cross-reference this with the document properties when available.
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
                      We identify key findings, methodologies, and conclusions directly from the source text.
                      All summaries are based on what the paper actually says—not general knowledge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">Quote Extraction with Page Numbers</h3>
                    <p className="text-secondary-800">
                      Important quotes are extracted with their exact page numbers, making it easy to verify
                      and use them in your own writing. No guessing—just accurate citations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 mb-2">Source Attribution</h3>
                    <p className="text-secondary-800">
                      Finally, we format source references for natural attribution in your writing.
                      Sources are woven conversationally into your content for readability and credibility.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Paper Generation Integrity */}
            <section className="card card-floating bg-gradient-to-br from-accent/5 to-secondary-50">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Document Generation & <span className="text-gradient">Citation Integrity</span>
              </h2>
              <p className="text-secondary-800 mb-6 leading-relaxed">
                When you use our document generation feature (Researcher plan), every claim is backed by citations
                from your uploaded sources:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">In-text citations:</strong> Every significant claim
                    includes (Author, Year) or (Author, Year, p. XX) citations pointing to your sources.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Source-constrained generation:</strong> Our AI only
                    references information present in your uploaded PDFs—it won't invent sources.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Full references list:</strong> A complete source summary
                    is automatically generated at the end with proper attribution.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-secondary-900">Verifiable claims:</strong> Because all content comes
                    from your sources, you (and your professor) can verify every citation.
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
                To maintain integrity, DraftEngine deliberately avoids certain practices:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't fabricate sources:</strong> Every citation
                    must come from a paper you uploaded. We never generate fake references.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't pull from general knowledge:</strong> Our
                    document generation only uses information from YOUR sources, not Wikipedia or other databases.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't hide our role:</strong> Your institution's
                    plagiarism checker may flag AI-generated text. We recommend using generated content as a draft
                    to revise in your own words.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0 mt-2" />
                  <div>
                    <strong className="text-secondary-900">We don't encourage plagiarism:</strong> DraftEngine
                    is a writing assistant tool. You should always review, verify, and revise any generated content
                    before submission.
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
                    <li>✓ Use source summaries to organize your research</li>
                    <li>✓ Verify all citations against the original sources</li>
                    <li>✓ Use generated outlines as a starting framework</li>
                    <li>✓ Revise AI-generated content into your own voice</li>
                    <li>✓ Check your institution's AI usage policy</li>
                    <li>✓ Add your own analysis and critical thinking</li>
                  </ul>
                </div>
                <div className="border border-red-300 rounded-lg p-6 bg-red-50/20">
                  <h3 className="font-bold text-secondary-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    Avoid This
                  </h3>
                  <ul className="space-y-2 text-sm text-secondary-800">
                    <li>✗ Submitting generated content without revision</li>
                    <li>✗ Using sources you haven't read or verified</li>
                    <li>✗ Claiming AI-generated ideas as entirely your own</li>
                    <li>✗ Violating your institution's policies</li>
                    <li>✗ Relying on DraftEngine without understanding your topic</li>
                    <li>✗ Skipping fact-checking of claims and citations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Citation Style Accuracy */}
            <section className="card card-floating">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Source Attribution <span className="text-gradient">Approach</span>
              </h2>
              <p className="text-secondary-800 mb-6">
                DraftEngine uses natural, conversational attribution to keep your writing credible and readable:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">Author Attribution</h4>
                  <p className="text-sm text-secondary-600">"According to Smith..."</p>
                </div>
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">Research References</h4>
                  <p className="text-sm text-secondary-600">"Research from MIT shows..."</p>
                </div>
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">Evidence Integration</h4>
                  <p className="text-sm text-secondary-600">"Studies have found that..."</p>
                </div>
                <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                  <h4 className="font-bold text-secondary-900 mb-1">Expert Voices</h4>
                  <p className="text-sm text-secondary-600">"As Johnson argues..."</p>
                </div>
              </div>
              <p className="text-sm text-secondary-600 mt-6 text-center">
                Always verify citations match your institution's specific requirements, as some departments
                have custom variations.
              </p>
            </section>

            {/* Final Note */}
            <section className="bg-gradient-brand text-white rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Your Success, Done Right
              </h2>
              <p className="text-lg mb-6 text-white/90">
                DraftEngine is designed to help you work smarter while upholding the highest standards of
                integrity. Use it as your writing assistant, not a shortcut.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-3 rounded-lg font-semibold inline-block"
                  >
                    Start Free Trial
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

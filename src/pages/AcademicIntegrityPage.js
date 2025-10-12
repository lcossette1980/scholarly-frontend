// src/pages/AcademicIntegrityPage.js
import React from 'react';
import { Shield, CheckCircle, BookOpen, Search, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AcademicIntegrityPage = () => {
  return (
    <div className="min-h-screen py-16 lg:py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 font-playfair mb-6">
            How We Cite & Verify Sources
          </h1>
          <p className="text-lg text-secondary-800 font-lato leading-relaxed">
            Academic integrity is at the core of ScholarlyAI. Here's exactly how we ensure every citation is accurate,
            verifiable, and properly formatted.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Our Approach */}
          <section className="card">
            <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-6">
              Our Approach to Academic Integrity
            </h2>
            <p className="text-secondary-800 mb-6 leading-relaxed">
              ScholarlyAI is designed to be a <strong>research assistant</strong>, not a replacement for your own critical thinking.
              We help you work faster while maintaining the highest standards of academic honesty.
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
          <section className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Search className="w-8 h-8 text-accent" />
              <h2 className="text-3xl font-bold text-secondary-900 font-playfair">
                How Our Citation Process Works
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
                  <h3 className="font-bold text-secondary-900 mb-2">Citation Formatting</h3>
                  <p className="text-secondary-800">
                    Finally, we format the complete citation in your chosen style (APA, MLA, Chicago, Harvard).
                    All formatting follows the latest edition guidelines for each style.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Paper Generation Integrity */}
          <section className="card bg-gradient-to-br from-accent/5 to-secondary-50">
            <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-6">
              Paper Generation & Citation Integrity
            </h2>
            <p className="text-secondary-800 mb-6 leading-relaxed">
              When you use our paper generation feature (Researcher plan), every claim is backed by citations
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
                  <strong className="text-secondary-900">Full references list:</strong> A complete bibliography
                  is automatically generated at the end in your chosen citation style.
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
          <section className="card border-2 border-red-200 bg-red-50/30">
            <div className="flex items-center space-x-3 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold text-secondary-900 font-playfair">
                What We Don't Do
              </h2>
            </div>
            <p className="text-secondary-800 mb-6">
              To maintain academic integrity, ScholarlyAI deliberately avoids certain practices:
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
                  paper generation only uses information from YOUR sources, not Wikipedia or other databases.
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
                  <strong className="text-secondary-900">We don't encourage plagiarism:</strong> ScholarlyAI
                  is a research assistant tool. You should always review, verify, and revise any generated content
                  before submission.
                </div>
              </li>
            </ul>
          </section>

          {/* Best Practices */}
          <section className="card">
            <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-6">
              Best Practices for Using ScholarlyAI
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-secondary-300/30 rounded-lg p-6">
                <h3 className="font-bold text-secondary-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Do This
                </h3>
                <ul className="space-y-2 text-sm text-secondary-800">
                  <li>✓ Use bibliographies to organize your research</li>
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
                  <li>✗ Violating your institution's academic policies</li>
                  <li>✗ Relying on ScholarlyAI without understanding your topic</li>
                  <li>✗ Skipping fact-checking of claims and citations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Citation Style Accuracy */}
          <section className="card">
            <h2 className="text-3xl font-bold text-secondary-900 font-playfair mb-6">
              Citation Style Accuracy
            </h2>
            <p className="text-secondary-800 mb-6">
              We support the latest editions of all major citation styles:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                <h4 className="font-bold text-secondary-900 mb-1">APA Style</h4>
                <p className="text-sm text-secondary-600">7th Edition (2020)</p>
              </div>
              <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                <h4 className="font-bold text-secondary-900 mb-1">MLA Style</h4>
                <p className="text-sm text-secondary-600">9th Edition (2021)</p>
              </div>
              <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                <h4 className="font-bold text-secondary-900 mb-1">Chicago</h4>
                <p className="text-sm text-secondary-600">17th Edition (2017)</p>
              </div>
              <div className="border border-secondary-300/30 rounded-lg p-4 text-center">
                <h4 className="font-bold text-secondary-900 mb-1">Harvard</h4>
                <p className="text-sm text-secondary-600">Latest Guidelines</p>
              </div>
            </div>
            <p className="text-sm text-secondary-600 mt-6 text-center">
              Always verify citations match your institution's specific requirements, as some departments
              have custom variations.
            </p>
          </section>

          {/* Final Note */}
          <section className="bg-gradient-brand text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold font-playfair mb-4">
              Your Academic Success, Done Right
            </h2>
            <p className="text-lg mb-6 text-white/90">
              ScholarlyAI is designed to help you work smarter while upholding the highest standards of
              academic integrity. Use it as your research assistant, not a shortcut.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/signup"
                className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-3 rounded-lg font-semibold"
              >
                Start Free Trial
              </Link>
              <Link
                to="/features"
                className="border-2 border-white text-white hover:bg-white hover:text-accent-600 transition-colors px-8 py-3 rounded-lg font-semibold"
              >
                Explore Features
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AcademicIntegrityPage;

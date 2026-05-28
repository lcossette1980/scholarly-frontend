// src/pages/AcademicIntegrityPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, FileText, Search, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';

const AcademicIntegrityPage = () => {
  return (
    <div className="bg-white">
      <SEO
        title="Responsible AI & Source Attribution"
        description="How DraftEngine handles your sources with integrity. Transparent AI writing, traceable attribution, and best practices for credible content."
        path="/ethical-ai"
      />

      {/* Hero */}
      <section className="border-b border-secondary-200">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20 text-center">
          <div className="eyebrow mb-4">Responsible AI</div>
          <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight leading-[1.1]">
            How we handle your sources.
          </h1>
          <p className="mt-4 text-lg text-secondary-600 max-w-2xl mx-auto">
            Transparent AI, credible writing. Here's how DraftEngine uses your material to produce content you can stand behind.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">

        {/* Our approach */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-3">
            Our approach
          </h2>
          <p className="text-sm text-secondary-700 leading-relaxed mb-6">
            DraftEngine is a <strong className="text-secondary-900">writing assistant</strong>, not a replacement for your thinking. We help you work faster while keeping your content credible, original, and grounded in real sources.
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
            {[
              { icon: FileText, title: 'Source-grounded', desc: 'All content is generated from YOUR sources, not AI knowledge. Every claim traces back to something real.' },
              { icon: Check, title: 'Traceable attribution', desc: 'Sources referenced naturally — by author, research context, or key findings.' },
              { icon: BookOpen, title: 'Transparent process', desc: 'We show which sources support each section so you can verify and edit.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white p-5">
                  <div className="w-7 h-7 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center mb-3">
                    <Icon className="w-3.5 h-3.5 text-secondary-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-secondary-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-secondary-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How source processing works */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-secondary-500" />
            <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight">
              How source processing works
            </h2>
          </div>
          <div className="space-y-5 mt-6">
            {[
              { num: '01', title: 'Text extraction', desc: 'When you upload a PDF, we extract the full text while preserving structure and page numbers.' },
              { num: '02', title: 'Metadata detection', desc: 'AI identifies author names, publication details, key themes, and other metadata to build a rich source profile.' },
              { num: '03', title: 'Smart summarization', desc: 'Key findings, arguments, and insights are identified directly from the source text — not general knowledge.' },
              { num: '04', title: 'Key quote extraction', desc: 'Important quotes are pulled with page numbers so you can reference or verify them.' },
              { num: '05', title: 'Natural attribution', desc: 'Sources are woven naturally into your content — by name, context, and findings.' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4 pb-5 border-b border-secondary-100 last:border-0">
                <span className="text-xs font-mono text-secondary-400 tabular-nums mt-1 flex-shrink-0">{step.num}</span>
                <div>
                  <h3 className="text-sm font-semibold text-secondary-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-secondary-700 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source integrity */}
        <div className="mb-16 rounded-lg border border-secondary-200 bg-secondary-50/40 p-6">
          <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
            Content generation & source integrity
          </h2>
          <p className="text-sm text-secondary-700 leading-relaxed mb-5">
            When you generate content with DraftEngine, every idea is grounded in your uploaded sources.
          </p>
          <ul className="space-y-3">
            {[
              ['Natural source references', 'Authors and their work are mentioned by name, woven into the narrative.'],
              ['Source-constrained generation', 'Our AI only draws from information in your uploaded sources — never invents or pulls from the internet.'],
              ['Multi-source synthesis', 'Each section draws from multiple sources, creating richer arguments.'],
              ['Verifiable claims', 'Every reference traces back to your sources — fact-check before publishing.'],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                <div className="text-sm">
                  <strong className="text-secondary-900">{title}.</strong>{' '}
                  <span className="text-secondary-700">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* What we don't do */}
        <div className="mb-16 rounded-lg border border-error-200 bg-error-50/40 p-6">
          <h2 className="text-xl font-semibold text-error-900 tracking-tight mb-3">
            What we don't do
          </h2>
          <p className="text-sm text-secondary-700 leading-relaxed mb-5">
            To keep your writing credible, DraftEngine deliberately avoids certain practices.
          </p>
          <ul className="space-y-3">
            {[
              ['We don\'t fabricate sources', 'Every reference comes from material you uploaded.'],
              ['We don\'t pull from general knowledge', 'Generation uses only your sources, not Wikipedia or other databases.'],
              ['We don\'t hide our role', 'We recommend being transparent about AI assistance.'],
              ['We don\'t replace your thinking', 'Always review, verify, and shape generated content.'],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2.5">
                <X className="w-3.5 h-3.5 text-error-600 mt-1 flex-shrink-0" strokeWidth={2.5} />
                <div className="text-sm">
                  <strong className="text-secondary-900">{title}.</strong>{' '}
                  <span className="text-secondary-700">{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Best practices */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-6">
            Best practices
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-secondary-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-secondary-900 mb-3 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Do this
              </h3>
              <ul className="space-y-2 text-sm text-secondary-700">
                {[
                  'Use source summaries to organize your material',
                  'Verify key claims against the original sources',
                  'Use generated outlines as a starting framework',
                  'Revise AI-generated content into your own voice',
                  'Add your own insights and perspective',
                  'Fact-check before publishing',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-secondary-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-secondary-900 mb-3 flex items-center gap-1.5">
                <X className="w-4 h-4 text-error-600" />
                Avoid this
              </h3>
              <ul className="space-y-2 text-sm text-secondary-700">
                {[
                  'Publishing generated content without revision',
                  'Using sources you haven\'t actually read',
                  'Claiming AI-generated ideas as entirely original',
                  'Skipping fact-checking of claims and references',
                  'Relying on DraftEngine without understanding your topic',
                  'Ignoring the sources behind each section',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <X className="w-3 h-3 text-error-500 mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-secondary-900 text-white px-8 py-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">
            Write better, write honestly.
          </h2>
          <p className="mt-3 text-secondary-300 max-w-xl mx-auto text-sm">
            Use DraftEngine as your writing partner, not a shortcut.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/features" className="inline-flex items-center gap-2 px-5 py-2.5 text-secondary-300 hover:text-white rounded-md font-medium text-sm transition-colors">
              Explore features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicIntegrityPage;

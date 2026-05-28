// src/pages/UseCaseStartupPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';

const UseCaseStartupPage = () => {
  const painPoints = [
    "You're reading industry research but can't turn it into polished investor-facing documents",
    'Hiring a content team costs $8-15K/month before they produce a single deliverable',
    "Generic AI content doesn't cite sources — and investors notice",
  ];

  const steps = [
    { num: '01', title: 'Import', text: 'Market research, competitor filings, and reports from PDFs, URLs, or DOIs.' },
    { num: '02', title: 'Extract', text: 'AI surfaces competitive insights, market data, and strategic angles.' },
    { num: '03', title: 'Generate', text: 'Market briefs, competitive analyses, or thought leadership with citations.' },
    { num: '04', title: 'Monitor', text: 'Research Feeds keep you ahead — new papers delivered automatically.' },
  ];

  const features = [
    'Market Brief and Case Study document types',
    '4 import methods including DOI for academic research',
    'Research Feeds for continuous market monitoring',
    'Professional and Executive writing tones',
    'Citations that make your content credible',
    'Export to Word for pitch decks and board materials',
  ];

  return (
    <div className="bg-white">
      <SEO
        title="DraftEngine for Startups — Research-Backed Content Without a Content Team"
        description="Market analyses, competitive briefs, and investor-facing content backed by real research. No content team required."
        path="/for/startups"
      />

      {/* Hero */}
      <section className="border-b border-secondary-200">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="up">
              <div className="eyebrow mb-4">For founders</div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight leading-[1.1]">
                Investor-grade content without a content team.
              </h1>
              <p className="mt-4 text-lg text-secondary-600 leading-relaxed">
                Market analyses, competitive briefs, and thought leadership backed by real research — at a fraction of the cost of hiring out.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <Link to="/signup" className="btn btn-primary btn-lg group">
                  Start free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link to="/features" className="btn btn-ghost btn-lg">
                  See features
                </Link>
              </div>
              <p className="mt-3 text-xs text-secondary-500">5 free sources · No credit card</p>
            </FadeIn>
            <FadeIn direction="up" delay={0.1}>
              <div className="rounded-lg border border-secondary-200 overflow-hidden bg-secondary-50">
                <img src="/images/usecase_startup.png" alt="DraftEngine for startups" className="w-full" loading="lazy" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        {/* Pain points */}
        <div className="mb-20">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-3">The problem</div>
            <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
              Founders need credible content, not generic AI output.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
            {painPoints.map((point, i) => (
              <div key={i} className="bg-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <X className="w-4 h-4 text-secondary-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-secondary-500">Problem {i + 1}</span>
                </div>
                <p className="text-sm text-secondary-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it solves */}
        <div className="mb-20">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-3">The solution</div>
            <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
              Research-grade content without research-grade timelines.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-6">
                <span className="text-xs font-mono text-secondary-400 tabular-nums">{step.num}</span>
                <h3 className="mt-2 text-sm font-semibold text-secondary-900">{step.title}</h3>
                <p className="mt-1.5 text-xs text-secondary-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20 max-w-4xl">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-3">Included</div>
            <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
              Built for founders who write their own narrative.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2.5 text-sm text-secondary-700 py-1">
                <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample workflow */}
        <div className="mb-20 max-w-4xl">
          <div className="rounded-lg border border-secondary-200 bg-secondary-50/40 p-6">
            <div className="eyebrow mb-3">Sample workflow</div>
            <p className="text-secondary-700 leading-relaxed mb-3">
              Before a board meeting, you import 6 market research reports and 4 competitor filings. DraftEngine analyzes each in 90 seconds. You generate an 8-page competitive market brief with citations and executive summary — in under 25 minutes. Send it to the board the same day.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-secondary-500">Total cost</span>
              <span className="text-lg font-semibold text-primary font-mono tabular-nums">$11.92</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-secondary-900 text-white px-8 py-12 lg:py-14 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Skip the content team.
          </h2>
          <p className="mt-3 text-secondary-300 max-w-xl mx-auto">
            Start free with 5 source entries. Publish investor-grade content today.
          </p>
          <Link to="/signup" className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors">
            Start free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-xs text-secondary-500">5 free sources · No credit card</p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseStartupPage;

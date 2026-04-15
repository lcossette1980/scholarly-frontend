// src/pages/UseCaseStartupPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import SEO from '../components/SEO';

const UseCaseStartupPage = () => {
  const painPoints = [
    "You're reading industry research but can't turn it into polished investor-facing documents",
    'Hiring a content team costs $8-15K/month before they produce a single deliverable',
    "Generic AI content doesn't cite sources — and investors notice",
  ];

  const steps = [
    { num: '01', text: 'Import market research, competitor filings, and industry reports from PDFs, URLs, or DOIs' },
    { num: '02', text: 'AI extracts competitive insights, market data, and strategic angles from every source' },
    { num: '03', text: 'Generate market briefs, competitive analyses, or thought leadership with proper citations' },
    { num: '04', text: 'Research Feeds keep you ahead — subscribe to your market and get new papers automatically' },
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
    <div className="min-h-screen bg-mesh">
      <SEO
        title="DraftEngine for Startups — Research-Backed Content Without a Content Team"
        description="Market analyses, competitive briefs, and investor-facing content backed by real research. No content team required."
        path="/for/startups"
      />

      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                  Sound Like You've Done Your Homework — Because You Have
                </h1>
                <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                  Market analyses, competitive briefs, and investor-facing content backed by real research. No content team required.
                </p>
                <Link
                  to="/signup"
                  className="btn btn-primary text-lg px-8 py-4 group inline-flex"
                >
                  Start Free — 5 Source Entries
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-sm text-secondary-400 mt-3">No credit card required</p>
              </div>
              <div>
                <img
                  src="/images/usecase_startup.png"
                  alt="DraftEngine for startups"
                  className="w-full rounded-lg shadow-card"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Pain Points */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-4">
              The Startup Content Problem
            </h2>
            <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
              You need credible, research-backed content — but you don't have a team to produce it.
            </p>
          </FadeIn>
          <StaggerChildren>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {painPoints.map((point, i) => (
                <StaggerItem key={i}>
                  <div className="border border-[#e5e7eb] rounded-lg shadow-card p-6 h-full bg-white">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                      <span className="text-red-500 font-bold text-lg">{i + 1}</span>
                    </div>
                    <p className="text-secondary-700 leading-relaxed">{point}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* How DraftEngine Solves It */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-4">
              How DraftEngine Solves It
            </h2>
            <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
              From market research to investor-ready content in under 30 minutes.
            </p>
          </FadeIn>
          <StaggerChildren>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {steps.map((step) => (
                <StaggerItem key={step.num}>
                  <div className="border border-[#e5e7eb] rounded-lg shadow-card p-6 bg-white flex items-start space-x-4">
                    <div className="text-xs font-mono font-semibold text-primary/60 tracking-widest mt-1 flex-shrink-0">
                      {step.num}
                    </div>
                    <p className="text-secondary-700 leading-relaxed">{step.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Feature Highlights */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
              Feature Highlights
            </h2>
          </FadeIn>
          <StaggerChildren>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {features.map((feature) => (
                <StaggerItem key={feature}>
                  <div className="flex items-start space-x-3 p-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-700">{feature}</span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Sample Workflow */}
      <section className="py-16 lg:py-20 bg-[#f5f6f8]">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-secondary-900 text-center mb-8">
                Sample Workflow
              </h2>
              <div className="border border-[#e5e7eb] rounded-lg shadow-card p-8 bg-white">
                <p className="text-secondary-700 leading-relaxed mb-4">
                  A startup founder imports 6 market research reports and 3 competitor analyses. DraftEngine generates a 10-page market landscape brief with data-backed competitive positioning, inline citations, and professional illustrations — in 20 minutes. She exports to Word and includes it in the next board package.
                </p>
                <p className="text-primary font-semibold">Total cost: $14.90</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Pricing Callout */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                Transparent Pricing
              </h2>
              <p className="text-lg text-secondary-600 mb-6">
                Market briefs start at $1.49/page. A 10-page competitive analysis costs $14.90 — less than one hour of an analyst's time.
              </p>
              <Link
                to="/pricing"
                className="text-primary hover:text-primary-700 font-medium"
              >
                See full pricing details →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* CTA */}
      <FadeIn direction="up">
        <section className="py-20 lg:py-24 bg-gradient-brand">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Start Free — 5 Source Entries, No Credit Card Required
              </h2>
              <p className="text-lg text-white/70 mb-8">
                Import your first market research and generate a brief today.
              </p>
              <Link
                to="/signup"
                className="bg-white text-primary hover:bg-secondary-50 transition-colors px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
};

export default UseCaseStartupPage;

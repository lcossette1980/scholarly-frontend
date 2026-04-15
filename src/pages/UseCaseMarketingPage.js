// src/pages/UseCaseMarketingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import SEO from '../components/SEO';

const UseCaseMarketingPage = () => {
  const painPoints = [
    'Content teams spend 15+ hours per article researching, reading, and synthesizing sources',
    'Freelance writers cost $500-2,000 per piece and still need heavy editing',
    'Generic AI content lacks credibility — no sources, no citations, no depth',
  ];

  const steps = [
    { num: '01', text: 'Import industry reports, analyst papers, and competitor research in seconds' },
    { num: '02', text: 'AI extracts arguments, angles, and quotable passages from every source' },
    { num: '03', text: 'Generate articles, blog posts, and white papers with inline citations and editorial illustrations' },
    { num: '04', text: 'Quality agents review every section before you see it — structural tics, coherence, source accuracy' },
  ];

  const features = [
    '4 import methods (PDF, URL, DOI, RSS)',
    'APA, MLA, Chicago citations auto-generated',
    'DALL-E editorial illustrations per section',
    'Quality review agents on every document',
    'Research Feeds — subscribe to industry topics',
    'Word export with images and references',
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <SEO
        title="DraftEngine for Marketing Teams — Research-Backed Content at Scale"
        description="Turn industry research into thought leadership articles with citations and illustrations. 10x faster than freelancers, grounded in real sources."
        path="/for/marketing-teams"
      />

      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                  Research-Backed Content at Scale
                </h1>
                <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                  Your competitors publish generic AI content. You publish thought leadership grounded in real research — and you do it 10x faster.
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
                  src="/images/usecase_marketing.png"
                  alt="DraftEngine for marketing teams"
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
              The Content Marketing Problem
            </h2>
            <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
              Producing credible, research-backed content is slow and expensive.
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
              From raw research to published thought leadership in under 30 minutes.
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
                  Your content lead imports 8 industry reports and analyst papers. DraftEngine analyzes each in 90 seconds. She generates topics, picks the strongest angle, and produces a 2,500-word thought leadership article with APA citations and editorial illustrations — in under 30 minutes.
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
                Articles start at $1.49/page. A 10-page thought leadership piece costs $14.90 — less than a single freelance hour.
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
                Import your first research sources and generate a document today.
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

export default UseCaseMarketingPage;

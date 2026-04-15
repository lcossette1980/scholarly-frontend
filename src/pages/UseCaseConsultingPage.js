// src/pages/UseCaseConsultingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import SEO from '../components/SEO';

const UseCaseConsultingPage = () => {
  const painPoints = [
    'A single white paper takes 20-40 hours to research, write, and format',
    'Every claim needs a source — but tracking down and citing 15 papers is tedious',
    'Junior analysts produce drafts that need heavy revision by senior partners',
  ];

  const steps = [
    { num: '01', text: 'Upload client reports, industry research, and competitor analyses' },
    { num: '02', text: 'AI extracts the arguments, data points, and quotable insights that matter' },
    { num: '03', text: 'Generate white papers, market briefs, or case studies with proper citations' },
    { num: '04', text: 'Two quality agents review every draft for coherence, contradictions, and structural quality' },
  ];

  const features = [
    'White Paper, Market Brief, Case Study document types',
    'Executive and Analytical writing tones',
    'Auto-generated references list (APA, MLA, Chicago)',
    'Document Coherence Agent checks argument arc',
    'DALL-E editorial illustrations',
    'Word export ready for client delivery',
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <SEO
        title="DraftEngine for Consultants — Client Deliverables in Hours, Not Weeks"
        description="White papers, industry briefs, and competitive analyses grounded in real research. Deliver to clients at the speed they expect."
        path="/for/consultants"
      />

      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-6">
          <FadeIn direction="up">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                  Client Deliverables in Hours, Not Weeks
                </h1>
                <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                  White papers, industry briefs, and competitive analyses — grounded in real research, delivered at the speed your clients expect.
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
                  src="/images/usecase_consulting.png"
                  alt="DraftEngine for consultants"
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
              The Consulting Deliverable Problem
            </h2>
            <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">
              Research-backed deliverables are your product — but producing them is painfully slow.
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
              From uploaded research to client-ready deliverable in under an hour.
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
                  A management consultant imports 12 industry reports and client documents. DraftEngine analyzes each, generates a topic, and produces a 15-page white paper with Chicago citations, executive tone, and professional illustrations — in under 45 minutes. She reviews, makes minor edits, and delivers to the client.
                </p>
                <p className="text-primary font-semibold">Total cost: $22.35</p>
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
                White papers start at $1.49/page. A 15-page client deliverable costs $22.35 — versus 30+ billable hours at your rate.
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
                Upload your first client research and generate a deliverable today.
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

export default UseCaseConsultingPage;

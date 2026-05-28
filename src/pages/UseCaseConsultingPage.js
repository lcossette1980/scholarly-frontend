// src/pages/UseCaseConsultingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X } from 'lucide-react';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';

const UseCaseConsultingPage = () => {
  const painPoints = [
    'A single white paper takes 20-40 hours to research, write, and format',
    'Every claim needs a source — but tracking down and citing 15 papers is tedious',
    'Junior analysts produce drafts that need heavy revision by senior partners',
  ];

  const steps = [
    { num: '01', title: 'Upload', text: 'Client reports, industry research, and competitor analyses.' },
    { num: '02', title: 'Extract', text: 'AI surfaces arguments, data points, and quotable insights.' },
    { num: '03', title: 'Generate', text: 'White papers, market briefs, or case studies with proper citations.' },
    { num: '04', title: 'Review', text: 'Quality agents check coherence, contradictions, and structure.' },
  ];

  const features = [
    'White Paper, Market Brief, Case Study types',
    'Executive and Analytical writing tones',
    'Auto-generated reference list (APA, MLA, Chicago)',
    'Document Coherence Agent checks argument arc',
    'DALL-E editorial illustrations',
    'Word export ready for client delivery',
  ];

  return (
    <div className="bg-white">
      <SEO
        title="DraftEngine for Consultants — Client Deliverables in Hours, Not Weeks"
        description="White papers, industry briefs, and competitive analyses grounded in real research. Deliver to clients at the speed they expect."
        path="/for/consultants"
      />

      {/* Hero */}
      <section className="border-b border-secondary-200">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="up">
              <div className="eyebrow mb-4">For consultants</div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight leading-[1.1]">
                Client deliverables in hours, not weeks.
              </h1>
              <p className="mt-4 text-lg text-secondary-600 leading-relaxed">
                White papers, industry briefs, and competitive analyses — grounded in real research, delivered at the speed your clients expect.
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
                <img src="/images/usecase_consulting.png" alt="DraftEngine for consultants" className="w-full" loading="lazy" />
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
              Quality deliverables are expensive and slow.
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
              From client brief to polished deliverable in under an hour.
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
              Built for client-ready output.
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
              You receive a client brief on emerging market trends. Import 12 industry reports and analyst papers. DraftEngine analyzes each in 90 seconds. You generate a 15-page white paper with APA citations, executive summary, and DALL-E illustrations — in under 45 minutes. Deliver to the client the same afternoon.
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-secondary-500">Total cost</span>
              <span className="text-lg font-semibold text-primary font-mono tabular-nums">$22.35</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-secondary-900 text-white px-8 py-12 lg:py-14 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Deliver faster. Win more business.
          </h2>
          <p className="mt-3 text-secondary-300 max-w-xl mx-auto">
            Start free with 5 source entries. Generate your first client deliverable today.
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

export default UseCaseConsultingPage;

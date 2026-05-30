// src/pages/HomePage.js
//
// Re-architected for conversion. Structure:
//   1. Hero (single CTA + receipts demo above the fold)
//   2. Real proof bar (verifiable truths, no fabricated metrics)
//   3. Five voices, one library (the unique differentiator)
//   4. Before / after transformation (chaos -> cited draft)
//   5. Research Feeds (kept, demoted from feature-hero to fold-below)
//   6. Cost comparison ($14.90 vs $2,000 freelancer — the strongest pitch)
//   7. Pricing + final CTA (merged so we don't double-ask)
//
// Notes for future edits:
//   - Hero must always lead with the differentiator copy, never a generic
//     "AI writing tool" headline. The headline IS the page.
//   - Never re-add fabricated review counts or user totals — see
//     index.html for the rationale.
//   - The HeroDemo and VoiceSwitcher components do the heavy proof
//     lifting; copy elsewhere can stay light.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Rss,
  Download,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';
import HeroDemo from '../components/HeroDemo';
import VoiceSwitcher from '../components/VoiceSwitcher';

const HomePage = () => {
  const { currentUser } = useAuth();
  const ctaTarget = currentUser ? '/create' : '/signup';
  const ctaLabel = currentUser ? 'Import your first source' : 'Start free';

  return (
    <div className="bg-white">
      <SEO
        description="DraftEngine turns the PDFs, URLs, DOIs, and RSS feeds you collected into research-grade drafts. Every citation traces back to a source in your library. Free for your first 5 sources."
        path="/"
      />

      {/* ─────────────────── 1. Hero ─────────────────── */}
      <section className="relative overflow-hidden border-b border-secondary-200">
        <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" aria-hidden />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-24 lg:pb-20">
          <FadeIn direction="up">
            <div className="flex justify-center mb-6">
              <span className="eyebrow-brand">
                <Sparkles className="w-3 h-3" />
                AI writing that cites your actual sources
              </span>
            </div>

            <h1 className="text-center text-4xl sm:text-5xl lg:text-[64px] font-semibold text-secondary-900 max-w-4xl mx-auto leading-[1.04] tracking-tight">
              The draft writes itself.{' '}
              <span className="text-primary">The citations stay yours.</span>
            </h1>

            <p className="mt-6 text-center text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Drop in PDFs, URLs, DOIs, or RSS feeds. DraftEngine extracts the
              arguments, pulls page-numbered quotes, and drafts a fully cited
              document in your voice. Every reference traces back to a source in
              your library. Nothing invented.
            </p>

            {/* Single primary CTA — no split-CTA dilution */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <Link to={ctaTarget} className="btn btn-primary btn-lg group">
                {ctaLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="text-xs text-secondary-500">
                5 free sources · No credit card · Takes 30 seconds
              </p>
            </div>
          </FadeIn>

          {/* Receipts demo */}
          <FadeIn direction="up" delay={0.1}>
            <div className="mt-14 lg:mt-16 max-w-5xl mx-auto">
              <HeroDemo />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────── 2. Real proof bar ─────────────────── */}
      <section className="border-b border-secondary-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
            {[
              {
                value: '4',
                label: 'Import methods',
                detail: 'PDF · URL · DOI · RSS',
              },
              {
                value: '5',
                label: 'Voice profiles',
                detail: 'Editorial → Reference',
              },
              {
                value: '17',
                label: 'Document types',
                detail: 'Essays to bibliographies',
              },
              {
                value: '0',
                label: 'Hallucinated citations',
                detail: 'Every ref is your source',
              },
            ].map((s) => (
              <div key={s.label} className="text-left">
                <div className="text-3xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] text-secondary-500 mt-1 uppercase tracking-wider font-medium">
                  {s.label}
                </div>
                <div className="text-xs text-secondary-600 mt-0.5">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 3. Five voices, one library ─────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="max-w-2xl mb-10">
              <div className="eyebrow mb-4">One library. Five voices.</div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
                The same evidence, written five different ways.
              </h2>
              <p className="mt-3 text-lg text-secondary-600 leading-relaxed">
                Most AI writers have one voice. Generic. DraftEngine routes your
                output to the right voice for the document you're actually
                writing. Click through to see how the same five sources read in
                each.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <VoiceSwitcher />
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────── 4. Before / after transformation ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200 bg-secondary-50/40">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="max-w-2xl mb-12">
              <div className="eyebrow mb-4">How it works</div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
                From source stack to publishable draft.
              </h2>
              <p className="mt-3 text-lg text-secondary-600 leading-relaxed">
                The reading was always the part that mattered. DraftEngine
                removes the busywork in between.
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            {/* BEFORE */}
            <FadeIn delay={0.05}>
              <div className="h-full rounded-xl border border-secondary-200 bg-white p-7 lg:p-9 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-500">
                    <X className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-secondary-500 font-medium">
                    Without DraftEngine
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4 tracking-tight">
                  Two weeks. Maybe three.
                </h3>
                <ul className="space-y-3 text-sm text-secondary-700 leading-relaxed flex-1">
                  <li className="flex gap-2.5">
                    <span className="text-secondary-300 font-mono text-xs mt-0.5 w-5 flex-shrink-0">01</span>
                    <span>Read 30 PDFs. Highlight everything. Re-read because you forgot what you highlighted.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-secondary-300 font-mono text-xs mt-0.5 w-5 flex-shrink-0">02</span>
                    <span>Re-find the one quote on page 47 about the productivity paradox.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-secondary-300 font-mono text-xs mt-0.5 w-5 flex-shrink-0">03</span>
                    <span>Draft from scratch at 11pm with 14 tabs open.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-secondary-300 font-mono text-xs mt-0.5 w-5 flex-shrink-0">04</span>
                    <span>Format every citation by hand.</span>
                  </li>
                </ul>
              </div>
            </FadeIn>

            {/* AFTER */}
            <FadeIn delay={0.1}>
              <div className="h-full rounded-xl border border-primary/30 bg-white p-7 lg:p-9 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" aria-hidden />
                <div className="relative flex items-center gap-2 mb-5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">
                    With DraftEngine
                  </span>
                </div>
                <h3 className="relative text-xl font-semibold text-secondary-900 mb-4 tracking-tight">
                  One afternoon. Coffee still warm.
                </h3>
                <ul className="relative space-y-3 text-sm text-secondary-700 leading-relaxed flex-1">
                  <li className="flex gap-2.5">
                    <span className="text-primary font-mono text-xs mt-0.5 w-5 flex-shrink-0">01</span>
                    <span>Drag your sources in. Each one returns key arguments and page-numbered quotes.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary font-mono text-xs mt-0.5 w-5 flex-shrink-0">02</span>
                    <span>Pick a topic. DraftEngine builds an outline shaped around your evidence.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary font-mono text-xs mt-0.5 w-5 flex-shrink-0">03</span>
                    <span>Generate the draft. Five voices, 17 document types, APA / MLA / Chicago.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-primary font-mono text-xs mt-0.5 w-5 flex-shrink-0">04</span>
                    <span>Export to Word. Every citation traces to a PDF on your laptop.</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────────── 5. Research Feeds (demoted) ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div>
                <div className="eyebrow-brand mb-4">
                  <Rss className="w-3 h-3" /> Research Feeds
                </div>
                <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
                  New sources, delivered while you sleep.
                </h2>
                <p className="mt-4 text-lg text-secondary-600 leading-relaxed">
                  Subscribe to a topic. DraftEngine monitors OpenAlex and
                  CrossRef and pulls new papers into your library as they
                  publish. No more scrolling Google Scholar at midnight.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Subscribe to any topic',
                    'Two academic databases monitored',
                    'Auto-delivered to your library',
                    'Future-dated junk filtered out',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-secondary-700">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-secondary-500">
                  Available on Pro · $19.99 / month
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative">
                <div className="rounded-xl border border-secondary-200 overflow-hidden bg-secondary-50">
                  <img
                    src="/images/feature_feeds.png"
                    alt="Research feeds interface"
                    className="w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────────── 6. Cost comparison ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200 bg-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-[0.08] pointer-events-none" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="eyebrow mb-6 text-secondary-400 border-secondary-700">
              The math
            </div>
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight leading-tight">
              A 10-page white paper{' '}
              <span className="text-white whitespace-nowrap">
                costs <span className="text-primary-300">$14.90</span>
              </span>
              <br className="hidden sm:block" /> with DraftEngine.
            </h2>
            <p className="mt-6 text-xl text-secondary-300 leading-relaxed">
              The same document from a freelancer?{' '}
              <span className="text-secondary-400 line-through">$2,000+</span>.
              From an agency? Add a zero.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <a
                href="/example_source_analysis.docx"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-secondary-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Sample source analysis
              </a>
              <a
                href="/content_example.docx"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 border border-white/10 text-secondary-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Sample generated document
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────── 7. Pricing + final CTA ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200 bg-secondary-50/40">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="max-w-2xl mb-12">
              <div className="eyebrow mb-4">Pricing</div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
                Start free. Upgrade when you ship.
              </h2>
              <p className="mt-3 text-lg text-secondary-600">
                No contracts, no annual lock-in. Plus and Pro can be canceled
                from your profile any time.
              </p>
            </div>
          </FadeIn>

          {/* Comparison table (single visual, easier to scan than three cards) */}
          <FadeIn delay={0.05}>
            <div className="rounded-xl border border-secondary-200 bg-white overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-secondary-200">
                {/* Starter */}
                <div className="p-7">
                  <div className="text-[11px] uppercase tracking-wider text-secondary-500 font-medium mb-1">
                    Starter
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                      $0
                    </span>
                    <span className="text-sm text-secondary-500">forever</span>
                  </div>
                  <div className="text-sm text-secondary-600 mb-5">
                    Try the full workflow.
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-700 mb-6">
                    {['5 source entries', 'AI source analysis', 'Word + PDF export'].map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="w-3.5 h-3.5 text-secondary-500 mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="btn btn-secondary w-full">
                    Get started
                  </Link>
                </div>

                {/* Plus — recommended */}
                <div className="p-7 bg-secondary-900 text-white relative">
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary-300 bg-primary/15 px-2 py-0.5 rounded-full">
                      Most popular
                    </span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-primary-300 font-medium mb-1">
                    Plus
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-semibold tabular-nums tracking-tight">
                      $9.99
                    </span>
                    <span className="text-sm text-secondary-400">/ month</span>
                  </div>
                  <div className="text-sm text-secondary-300 mb-5">
                    For regular writing.
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-200 mb-6">
                    {[
                      'Unlimited sources',
                      'Topic + outline generator',
                      'Content generation (pay-per-page)',
                      'APA, MLA, Chicago',
                    ].map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="w-3.5 h-3.5 text-primary-300 mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors"
                  >
                    Start Plus
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Pro */}
                <div className="p-7">
                  <div className="text-[11px] uppercase tracking-wider text-secondary-500 font-medium mb-1">
                    Pro
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                      $19.99
                    </span>
                    <span className="text-sm text-secondary-500">/ month</span>
                  </div>
                  <div className="text-sm text-secondary-600 mb-5">
                    For power users.
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-700 mb-6">
                    {[
                      'Everything in Plus',
                      '10 pages / month included',
                      'Research Feeds',
                      'Discounted page overage',
                    ].map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="w-3.5 h-3.5 text-secondary-500 mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="btn btn-secondary w-full">
                    Start Pro
                  </Link>
                </div>
              </div>

              {/* Per-page strip */}
              <div className="border-t border-secondary-200 px-6 py-4 bg-secondary-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                  <div className="text-secondary-700">
                    <span className="font-medium text-secondary-900">Per-page generation:</span>{' '}
                    Standard <span className="font-mono">$1.49</span>{' '}
                    <span className="text-secondary-500">(Claude Sonnet)</span> · Professional{' '}
                    <span className="font-mono">$2.49</span>{' '}
                    <span className="text-secondary-500">(Claude Opus)</span>
                  </div>
                  <Link to="/pricing" className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                    Full pricing
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Closing line + final CTA — folded into pricing so we don't repeat ourselves */}
          <FadeIn delay={0.1}>
            <div className="mt-14 text-center">
              <p className="text-sm text-secondary-600 mb-4">
                Spend less on freelancers. Ship more drafts. Cite your actual sources.
              </p>
              <Link to={ctaTarget} className="btn btn-primary btn-lg group">
                {ctaLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-3 text-xs text-secondary-500">
                5 free sources · No credit card · Cancel anytime
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

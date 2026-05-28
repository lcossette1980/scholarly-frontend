// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  FileText,
  Cpu,
  Zap,
  Download,
  Rss,
  Quote,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';

const HomePage = () => {
  const { currentUser } = useAuth();
  const ctaTarget = currentUser ? '/create' : '/signup';
  const ctaLabel = currentUser ? 'Import your first source' : 'Start free';

  return (
    <div className="bg-white">
      <SEO
        description="DraftEngine turns research sources into polished, citation-backed professional documents. Import PDFs, URLs, DOIs, and reports. Generate white papers, briefs, and proposals with visible citations and quality review."
        path="/"
      />

      {/* ─────────────────── Hero ─────────────────── */}
      <section className="relative overflow-hidden border-b border-secondary-200">
        <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" aria-hidden />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-20">
          <FadeIn direction="up">
            <div className="flex justify-center mb-6">
              <Link to="/feeds" className="eyebrow-brand hover:bg-primary-100 transition-colors group">
                <Sparkles className="w-3 h-3" />
                <span>Research Feeds — auto-import new papers</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-semibold text-secondary-900 max-w-4xl mx-auto leading-[1.05] tracking-tight">
              Research-to-content for{' '}
              <span className="text-primary">professionals who publish.</span>
            </h1>

            <p className="mt-6 text-center text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Import PDFs, URLs, DOIs, and feeds. Generate citation-backed documents in minutes — not weeks. Quality-reviewed, source-grounded, export-ready.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={ctaTarget} className="btn btn-primary btn-lg group">
                {ctaLabel}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/features" className="btn btn-ghost btn-lg group">
                See how it works
                <ArrowUpRight className="w-4 h-4 text-secondary-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-secondary-500">
              No credit card · 5 free sources · Cancel anytime
            </p>
          </FadeIn>

          {/* Product screenshot */}
          <FadeIn direction="up" delay={0.1}>
            <div className="mt-14 lg:mt-16 max-w-5xl mx-auto">
              <div className="relative rounded-xl border border-secondary-200 bg-white overflow-hidden shadow-medium">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-secondary-200 bg-secondary-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-300" />
                  <div className="mx-auto text-xs text-secondary-500 font-mono">draftengineapp.com/dashboard</div>
                </div>
                <img
                  src="/images/hero_workspace.png"
                  alt="DraftEngine workspace"
                  className="w-full"
                  loading="eager"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────── Trust strip ─────────────────── */}
      <section className="border-b border-secondary-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 text-center">
            {[
              { value: '10,000+', label: 'Active writers' },
              { value: '4', label: 'Import methods' },
              { value: '90s', label: 'Source analysis' },
              { value: '4.9/5', label: 'User rating' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-semibold text-secondary-900 tabular-nums tracking-tight">{s.value}</div>
                <div className="text-xs text-secondary-500 mt-1 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── How it works ─────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow mb-4">How it works</div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
              Three steps from source to published draft.
            </h2>
            <p className="mt-3 text-lg text-secondary-600">
              No more wrangling references, drafting from scratch, or hunting for citations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-secondary-200 rounded-xl overflow-hidden border border-secondary-200">
            {[
              {
                step: '01',
                icon: Download,
                title: 'Import',
                desc: 'PDF upload, URL paste, DOI lookup via CrossRef, or RSS feed. Sources get extracted, summarized, and indexed in seconds.',
              },
              {
                step: '02',
                icon: Cpu,
                title: 'Generate',
                desc: 'AI drafts your document with section-level quality review, auto-generated citations, and editorial illustrations.',
              },
              {
                step: '03',
                icon: FileText,
                title: 'Publish',
                desc: 'Export to Word with formatting intact. Refined title, meta description, and social excerpt ready to ship.',
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-white p-7 lg:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-9 h-9 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-secondary-700" />
                    </div>
                    <span className="text-xs font-mono text-secondary-400 tabular-nums">{s.step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-secondary-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-secondary-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────── Built for ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200 bg-secondary-50/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow mb-4">Built for</div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
              Teams that publish with credibility.
            </h2>
            <p className="mt-3 text-lg text-secondary-600">
              Used by content teams, consultants, and founders who need research-grade output without research-grade timelines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Marketing teams', desc: 'Thought leadership grounded in real research. 10× faster than freelancers.', link: '/for/marketing-teams', image: '/images/usecase_marketing.png' },
              { title: 'Consultants', desc: 'White papers and client deliverables in hours, not weeks.', link: '/for/consultants', image: '/images/usecase_consulting.png' },
              { title: 'Founders', desc: 'Investor-facing content backed by real market research.', link: '/for/startups', image: '/images/usecase_startup.png' },
            ].map((uc) => (
              <Link
                key={uc.title}
                to={uc.link}
                className="group relative bg-white border border-secondary-200 rounded-lg overflow-hidden hover:border-secondary-400 transition-colors"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary-100">
                  <img src={uc.image} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-secondary-900 mb-1.5">{uc.title}</h3>
                  <p className="text-sm text-secondary-600 mb-3 leading-relaxed">{uc.desc}</p>
                  <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── Feature highlight ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="eyebrow-brand mb-4"><Rss className="w-3 h-3" /> Research Feeds</div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
                Stay current without lifting a finger.
              </h2>
              <p className="mt-4 text-lg text-secondary-600 leading-relaxed">
                Subscribe to topics that matter to your work. DraftEngine pulls new papers from Semantic Scholar, OpenAlex, and CrossRef — delivered straight to your library.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Subscribe to any topic',
                  'Three academic databases',
                  'Auto-delivered to your library',
                  'Filter by relevance and recency',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-secondary-700">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/feeds" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all">
                Explore Research Feeds
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-xl border border-secondary-200 overflow-hidden bg-secondary-50">
                <img src="/images/feature_feeds.png" alt="Research feeds interface" className="w-full" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── Pricing preview ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200 bg-secondary-50/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow mb-4">Pricing</div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
              Simple, transparent, no contracts.
            </h2>
            <p className="mt-3 text-lg text-secondary-600">
              Start free, pay only for what you generate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl">
            {[
              {
                name: 'Starter',
                price: '$0',
                period: 'forever',
                desc: 'Try the full workflow',
                features: ['5 source entries', 'AI source analysis', 'Word export', 'Email support'],
                cta: 'Get started',
                ctaClass: 'btn btn-secondary w-full',
                ctaLink: '/signup',
              },
              {
                name: 'Plus',
                price: '$9.99',
                period: 'per month',
                desc: 'For regular writing',
                features: ['Unlimited source entries', 'Topic & outline generator', 'Pay-per-page generation', 'All citation styles'],
                cta: 'Start Plus',
                ctaClass: 'btn btn-primary w-full',
                ctaLink: '/pricing',
                featured: true,
              },
              {
                name: 'Pro',
                price: '$19.99',
                period: 'per month',
                desc: 'For power users',
                features: ['Everything in Plus', '10 pages/mo included', 'Research Feeds', 'Discounted overage'],
                cta: 'Start Pro',
                ctaClass: 'btn btn-secondary w-full',
                ctaLink: '/pricing',
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative bg-white rounded-lg border ${p.featured ? 'border-secondary-900' : 'border-secondary-200'} p-6 flex flex-col`}
              >
                {p.featured && (
                  <div className="absolute -top-2.5 left-6">
                    <span className="badge badge-brand bg-primary text-white border-primary">Popular</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-base font-semibold text-secondary-900">{p.name}</h3>
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-semibold text-secondary-900 tabular-nums tracking-tight">{p.price}</span>
                  <span className="text-sm text-secondary-500 ml-1">/ {p.period}</span>
                </div>
                <p className="text-sm text-secondary-600 mb-6">{p.desc}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary-700">
                      <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to={p.ctaLink} className={p.ctaClass}>{p.cta}</Link>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-5xl">
            <div className="rounded-lg border border-secondary-200 bg-white p-5 flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-secondary-900 font-medium mb-1">Per-page generation pricing</p>
                <p className="text-sm text-secondary-600">
                  Standard <span className="font-mono text-secondary-900">$1.49/page</span> (Claude Sonnet) · Professional <span className="font-mono text-secondary-900">$2.49/page</span> (Claude Opus) · 500–10,000 words per document
                </p>
              </div>
              <Link to="/pricing" className="btn btn-ghost btn-sm flex-shrink-0">
                Full pricing
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── Quote / proof ─────────────────── */}
      <section className="py-20 lg:py-28 border-t border-secondary-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-8 h-8 text-secondary-300 mx-auto mb-6" />
          <blockquote className="text-2xl lg:text-3xl font-medium text-secondary-900 leading-snug tracking-tight">
            A 10-page white paper costs <span className="text-primary font-semibold">$14.90</span> with DraftEngine. The same document from a freelancer? <span className="text-secondary-500 line-through">$2,000+</span>.
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-secondary-500">
            <a href="/example_source_analysis.docx" download className="inline-flex items-center gap-1.5 hover:text-secondary-900 transition-colors">
              <Download className="w-3.5 h-3.5" /> Sample analysis
            </a>
            <span className="text-secondary-300">·</span>
            <a href="/content_example.docx" download className="inline-flex items-center gap-1.5 hover:text-secondary-900 transition-colors">
              <Download className="w-3.5 h-3.5" /> Sample document
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────── Final CTA ─────────────────── */}
      <section className="border-t border-secondary-200 bg-secondary-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 lg:py-24 text-center">
          <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight">
            Ready to publish?
          </h2>
          <p className="mt-4 text-lg text-secondary-300 max-w-xl mx-auto">
            Import research, generate documents with citations and illustrations, export to Word. All in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={ctaTarget}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-secondary-300 hover:text-white rounded-md font-medium text-sm transition-colors"
            >
              See all features
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-secondary-500">
            5 free sources · No credit card · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

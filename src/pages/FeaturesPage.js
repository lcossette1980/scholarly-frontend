// src/pages/FeaturesPage.js
//
// Re-architected to match the homepage rebuild: leads with the
// differentiator (citations stay yours), reuses VoiceSwitcher to show
// the five-voices feature interactively, and fixes a pile of stale
// claims from before product changes:
//   - 17 document types (was "4")
//   - 7 tones (was "4")
//   - 3 approaches (added)
//   - OpenAlex + CrossRef (was "Semantic Scholar, OpenAlex, CrossRef")
//   - DALL-E illustrations softened to "optional"
//   - Removed "editorial agents" framing → just "quality + coherence agents"

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  ArrowRight,
  Upload,
  Brain,
  FileText,
  Quote,
  Rss,
  Zap,
  ShieldCheck,
  Edit3,
  Layers,
} from 'lucide-react';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';
import VoiceSwitcher from '../components/VoiceSwitcher';

const FeaturesPage = () => {
  // Core features ordered by differentiator priority. Citation traceability
  // is now #2 (was buried at #5). Voice routing is now its own hero section
  // (replaces the "topic & outline" tile which was a feature, not a moat).
  const coreFeatures = [
    {
      title: 'Multi-source import',
      description:
        'Bring research from anywhere. PDF upload, URL extraction, DOI lookup via CrossRef, or RSS subscription.',
      image: '/images/feature_import.png',
      icon: Upload,
      bullets: [
        'PDF up to 50MB',
        'URL with article text extraction',
        'DOI via CrossRef API',
        'RSS feeds with cherry-pick',
      ],
    },
    {
      title: 'Citations that trace back',
      description:
        'Every citation in your generated draft links to the exact passage in the source you uploaded. No invented references.',
      image: '/images/feature_citations.png',
      icon: Quote,
      bullets: [
        'APA, MLA, and Chicago citation styles',
        'Page-numbered quote extraction',
        'Hover any citation to see the source passage',
        'Reference list auto-appended',
      ],
    },
    {
      title: 'AI source analysis',
      description:
        'Each uploaded source returns the key arguments, surprising angles, perspective value, and notable quotes with page numbers.',
      image: '/images/feature_analysis.png',
      icon: Brain,
      bullets: [
        'Key arguments identified',
        'Surprising and counterintuitive angles surfaced',
        'Perspective value mapped',
        'Notable passages with page numbers',
      ],
    },
    {
      title: 'Topic & outline generator',
      description:
        'Pick a direction; DraftEngine reads across your selected sources and proposes topics with argument-driven outlines.',
      image: '/images/hero_pipeline.png',
      icon: FileText,
      bullets: [
        'Topic suggestions with central tension',
        'Voice-routed outlines (narrative, executive, scholarly, IMRAD)',
        'Section headings that make claims',
        'Editable before generation',
      ],
    },
    {
      title: 'Document generation',
      description:
        '500 to 10,000 word drafts. Section quality agent reviews every paragraph; coherence agent reviews the full arc.',
      image: '/images/feature_generate.png',
      icon: Zap,
      bullets: [
        '17 document types supported',
        '7 tones × 3 approaches',
        'Weak sections auto-regenerated',
        'Refined title, meta description, social excerpt',
      ],
    },
    {
      title: 'Research Feeds',
      description:
        'Subscribe to a research topic and DraftEngine pulls new papers from OpenAlex and CrossRef into your library as they publish.',
      image: '/images/feature_feeds.png',
      icon: Rss,
      bullets: [
        'Subscribe to any topic',
        'OpenAlex + CrossRef monitoring',
        'Direct library import',
        'Future-dated junk filtered out',
      ],
    },
  ];

  // Updated to match what the product actually ships now (no more "DALL-E
  // illustrations included" — they're optional add-ons; no more
  // "4 writing tones" — there are 7).
  const additionalFeatures = [
    {
      icon: Layers,
      title: '17 document types',
      description:
        'Articles, essays, op-eds, white papers, market briefs, research papers, lit reviews, lab reports, bibliographies, and more.',
    },
    {
      icon: Edit3,
      title: '7 tones × 3 approaches',
      description:
        'Executive, analytical, authoritative, persuasive, professional, conversational, or concise — crossed with logical, emotional, or balanced.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality + coherence agents',
      description:
        'Section agent scores every paragraph on 7 dimensions. Coherence agent reviews the full document arc.',
    },
    {
      icon: Zap,
      title: 'Optional AI illustrations',
      description:
        'Add a DALL-E illustration per section as an add-on when you generate. Skip it to save credits.',
    },
    {
      icon: Upload,
      title: 'Word, PDF, and text export',
      description:
        '.docx with formatting and references intact. PDF for share-ready output. Plain text for editor handoff.',
    },
    {
      icon: ShieldCheck,
      title: 'Private by default',
      description:
        'Your sources and documents stay in your account. Never shared with third parties. Delete anything anytime.',
    },
    {
      icon: Edit3,
      title: 'Fully editable output',
      description:
        'Every field — title, outline, body — is editable before you export. Strong draft, not a locked file.',
    },
    {
      icon: ShieldCheck,
      title: '100% refund on failure',
      description:
        "If generation can't finish, your charge is refunded automatically. You never pay for a broken job.",
    },
  ];

  const faqItems = [
    {
      question: 'Where do the citations actually come from?',
      answer:
        'Only from the sources you uploaded. DraftEngine does not invent references. Every citation in a generated draft traces back to a PDF in your library, and quoted passages include page numbers when the source provides them.',
    },
    {
      question: 'Can I edit the AI-generated content?',
      answer:
        'Yes. Every field is fully editable — title, outline, body — before you export. DraftEngine gives you a strong starting point; the final draft is yours to shape.',
    },
    {
      question: 'What do the quality agents check?',
      answer:
        'Two passes. The Section Quality Agent scores each section on seven dimensions (voice fit, claim specificity, evidence integration, etc.). The Document Coherence Agent reviews the full arc — contradictions, orphaned threads, pacing. Sections scoring below threshold are auto-regenerated before you see the draft.',
    },
    {
      question: 'How does voice routing work?',
      answer:
        'Each document type maps to one of five voice profiles (editorial, business, academic, scientific, reference). Pick "white paper" and you get executive prose with bullets. Pick "research paper" and you get formal academic register with inline citations. The routing happens automatically based on document type.',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Features"
        description="Multi-source import (PDF, URL, DOI, RSS). AI source analysis with page-numbered quotes. Topic and outline generator. 17 document types in 5 voices. Citations that trace back to your sources. Word + PDF export."
        path="/features"
      />

      {/* ─────────────────── Hero ─────────────────── */}
      <section className="border-b border-secondary-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-6 py-16 lg:py-20 text-center">
          <FadeIn direction="up">
            <div className="eyebrow mb-4">Features</div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Built for people whose editors check citations.
            </h1>
            <p className="mt-5 text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Every feature in DraftEngine serves one outcome: a draft you can
              ship without rewriting the references. Page-numbered quotes,
              traceable citations, voice routing for the document you're
              actually writing.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg group">
                Start free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-secondary-500">
              5 free sources · No credit card · Cancel anytime
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        {/* ─────────────────── Core features grid ─────────────────── */}
        <div className="mb-20">
          <FadeIn>
            <div className="max-w-2xl mb-10">
              <div className="eyebrow mb-3">Core features</div>
              <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
                The pieces that do the work.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {coreFeatures.map((f, idx) => {
              const Icon = f.icon;
              return (
                <FadeIn key={f.title} delay={Math.min(idx * 0.04, 0.2)}>
                  <div className="rounded-lg border border-secondary-200 bg-white overflow-hidden flex flex-col h-full">
                    <div className="aspect-[16/9] bg-secondary-100 overflow-hidden">
                      <img
                        src={f.image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-secondary-700" />
                        </div>
                        <h3 className="text-base font-semibold text-secondary-900">
                          {f.title}
                        </h3>
                      </div>
                      <p className="text-sm text-secondary-600 leading-relaxed mb-4">
                        {f.description}
                      </p>
                      <ul className="space-y-2 mt-auto">
                        {f.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm text-secondary-700"
                          >
                            <Check
                              className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0"
                              strokeWidth={2.5}
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* ─────────────────── Voice routing showcase ─────────────────── */}
        <div className="mb-20">
          <FadeIn>
            <div className="max-w-2xl mb-10">
              <div className="eyebrow-brand mb-3">
                <Layers className="w-3 h-3" /> Voice routing
              </div>
              <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
                One source library. Five voices.
              </h2>
              <p className="mt-3 text-secondary-600 leading-relaxed">
                Most AI writers have one voice — generic. DraftEngine routes
                your output to the right voice for the document you're
                actually writing. Click through to see the same evidence
                rendered five different ways.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <VoiceSwitcher />
          </FadeIn>
        </div>

        {/* ─────────────────── Manual vs DraftEngine ─────────────────── */}
        <div className="mb-20">
          <FadeIn>
            <div className="max-w-2xl mb-10">
              <div className="eyebrow mb-3">Time</div>
              <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
                Two weeks of work, in an afternoon.
              </h2>
              <p className="mt-3 text-secondary-600">
                Same outcome. Same quality of reasoning. Same traceability.
                A fraction of the time spent on the busywork between reading and writing.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
            {/* Manual */}
            <div className="rounded-lg border border-secondary-200 bg-white p-6">
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-base font-semibold text-secondary-900">
                  Manual method
                </h3>
                <span className="text-sm font-mono text-error-600 tabular-nums">
                  ~38 hrs
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  ['Read and annotate each source', '~15 hrs'],
                  ['Write summaries and pull quotes', '~6 hrs'],
                  ['Brainstorm topics and build the outline', '~4 hrs'],
                  ['Draft, format citations, revise', '~13 hrs'],
                ].map(([task, time]) => (
                  <li key={task} className="flex items-start gap-2.5 text-sm">
                    <X className="w-3.5 h-3.5 text-secondary-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-secondary-700">{task}</span>
                      <span className="text-xs font-mono text-secondary-500 tabular-nums whitespace-nowrap">
                        {time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-secondary-200 text-xs text-secondary-500">
                Inconsistent quality. No review pass before delivery.
              </p>
            </div>

            {/* DraftEngine */}
            <div className="relative rounded-lg border border-secondary-900 bg-white p-6">
              <div className="absolute -top-2.5 left-6">
                <span className="badge badge-brand bg-primary text-white border-primary">
                  ~95% faster
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-base font-semibold text-secondary-900">
                  DraftEngine
                </h3>
                <span className="text-sm font-mono text-primary tabular-nums">
                  ~2 hrs
                </span>
              </div>
              <ul className="space-y-3">
                {[
                  ['Import via PDF, URL, DOI, or RSS', '~2 min'],
                  ['AI extracts arguments and quotes', '~90 sec / source'],
                  ['Generate topics, customize outline', '~3 min'],
                  ['AI drafts the document with reviews', '~5 min'],
                  ['Review, edit, and export', '~90 min'],
                ].map(([task, time]) => (
                  <li key={task} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0"
                      strokeWidth={2.5}
                    />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-secondary-700">{task}</span>
                      <span className="text-xs font-mono text-secondary-500 tabular-nums whitespace-nowrap">
                        {time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-secondary-200 text-xs text-primary font-medium">
                Quality + coherence agents review before you see the draft.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────── Additional features grid ─────────────────── */}
        <div className="mb-20">
          <FadeIn>
            <div className="max-w-2xl mb-10">
              <div className="eyebrow mb-3">Also included</div>
              <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
                Everything else you'd ask for.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
            {additionalFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white p-5">
                  <div className="w-7 h-7 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center mb-3">
                    <Icon className="w-3.5 h-3.5 text-secondary-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-secondary-900 mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-secondary-600 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────── FAQ ─────────────────── */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-8 text-center">
            Common questions
          </h2>
          <div className="divide-y divide-secondary-200 border-y border-secondary-200">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base font-medium text-secondary-900 group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                  <span className="ml-4 flex-shrink-0 w-5 h-5 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-500 group-open:rotate-45 transition-transform">
                    <span className="text-sm leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-secondary-600 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* ─────────────────── Final CTA ─────────────────── */}
        <div className="rounded-xl bg-secondary-900 text-white px-8 py-12 lg:py-14 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div
            className="absolute inset-0 bg-dot-grid opacity-[0.06] pointer-events-none"
            aria-hidden
          />
          <div className="relative">
            {/* explicit text-white needed: index.css globally sets h2 to
                text-secondary-900 — invisible on this dark background */}
            <h2 className="text-white text-3xl lg:text-4xl font-semibold tracking-tight">
              Try it on your own sources.
            </h2>
            <p className="mt-3 text-secondary-300 max-w-xl mx-auto">
              Five sources free. No credit card. Your first cited draft, today.
            </p>
            <Link
              to="/signup"
              className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;

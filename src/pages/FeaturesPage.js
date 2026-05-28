// src/pages/FeaturesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Upload, Brain, FileText, Quote, Rss, Zap, Image, ShieldCheck, Edit3 } from 'lucide-react';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';

const FeaturesPage = () => {
  const coreFeatures = [
    {
      title: 'Multi-source import',
      description: 'Bring research from anywhere. PDF, URL, DOI lookup via CrossRef, or RSS subscription.',
      image: '/images/feature_import.png',
      icon: Upload,
      bullets: ['PDF up to 50MB', 'URL with article extraction', 'DOI via CrossRef API', 'RSS feeds with cherry-pick'],
    },
    {
      title: 'AI source analysis',
      description: 'Every source analyzed in ~90 seconds. Arguments, angles, and quotable passages — surfaced automatically.',
      image: '/images/feature_analysis.png',
      icon: Brain,
      bullets: ['Key arguments identified', 'Surprising angles surfaced', 'Perspective value mapped', 'Notable passages with page numbers'],
    },
    {
      title: 'Topic & outline generator',
      description: 'Three editorial-quality topic suggestions with argument-driven outlines. Section headings make claims.',
      image: '/images/hero_pipeline.png',
      icon: FileText,
      bullets: ['3 topic suggestions per analysis', 'Claim-based section headings', 'Editable AI outlines', 'Sources mapped across sections'],
    },
    {
      title: 'Document generation',
      description: 'Polished 500–10,000 word drafts. Quality agents review every section before you see it.',
      image: '/images/feature_generate.png',
      icon: Zap,
      bullets: ['4 document types', '4 tones, 3 approaches', 'Quality agents auto-regenerate weak sections', 'DALL-E illustrations included'],
    },
    {
      title: 'Citations & references',
      description: 'Proper attribution without the formatting drudgery. APA, MLA, Chicago — auto-inserted post-generation.',
      image: '/images/feature_citations.png',
      icon: Quote,
      bullets: ['APA, MLA, Chicago styles', 'Auto-generated reference list', 'Inline citation markers', 'Natural source attribution'],
    },
    {
      title: 'Research feeds',
      description: 'Stay ahead of the literature. Papers surfaced from Semantic Scholar, OpenAlex, CrossRef — direct to your library.',
      image: '/images/feature_feeds.png',
      icon: Rss,
      bullets: ['Subscribe to any topic', '3 academic databases', 'Direct library import', 'Daily or weekly delivery'],
    },
  ];

  const additionalFeatures = [
    { icon: Image, title: 'DALL-E illustrations', description: 'A custom DALL-E 3 illustration per section, included with every document.' },
    { icon: ShieldCheck, title: 'Quality review agents', description: 'Section agent checks 7 dimensions. Coherence agent reviews arc, pacing, and contradictions.' },
    { icon: FileText, title: 'Multiple document types', description: 'Article, essay, blog post, or op-ed — each follows distinct structural conventions.' },
    { icon: Edit3, title: '4 writing tones', description: 'Professional, conversational, bold, or intimate. Set the voice for your audience.' },
    { icon: Upload, title: 'Word & text export', description: 'Download as .docx with formatting, images, and references intact. Or plain text.' },
    { icon: Zap, title: 'Enhanced output', description: 'Refined title with 3 alternatives, 150-word meta description, social excerpt — all generated.' },
    { icon: ShieldCheck, title: 'Private & secure', description: 'Your sources and documents remain yours. Never shared with third parties.' },
    { icon: Edit3, title: 'Edit before download', description: 'Every field is editable — title, outline, body. Strong draft, not a locked file.' },
  ];

  const faqItems = [
    {
      question: 'Can I edit the AI-generated content?',
      answer: 'Yes. Every field is fully editable — title, outline, body text. DraftEngine gives you a strong starting point that you can customize however you want before exporting.',
    },
    {
      question: 'How does source attribution work?',
      answer: 'APA, MLA, and Chicago citation styles. Inline citation markers are inserted automatically after generation, and a complete reference list is appended. Sources are also woven naturally into prose for readability.',
    },
    {
      question: 'What do the quality agents do?',
      answer: 'Two AI agents review your document before you see it. The Section Quality Agent evaluates 7 dimensions per section. The Document Coherence Agent checks argument arc, contradictions, orphaned threads, and pacing. Sections scoring below threshold are auto-regenerated.',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Features"
        description="Multi-source import, AI analysis in 90 seconds, topic and outline generation, full document drafting up to 10,000 words, quality agents, citations, DALL-E illustrations, and export to Word."
        path="/features"
      />

      {/* Hero */}
      <section className="border-b border-secondary-200">
        <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20 text-center">
          <FadeIn direction="up">
            <div className="eyebrow mb-4">Features</div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Everything you need to turn research into published content.
            </h1>
            <p className="mt-4 text-lg text-secondary-600 max-w-2xl mx-auto">
              Import sources from anywhere, analyze them in seconds, generate quality-reviewed documents with citations, illustrations, and export-ready formatting.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">

        {/* Core features grid */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-4">
            {coreFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-lg border border-secondary-200 bg-white overflow-hidden flex flex-col">
                  <div className="aspect-[16/9] bg-secondary-100 overflow-hidden">
                    <img src={f.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-secondary-700" />
                      </div>
                      <h3 className="text-base font-semibold text-secondary-900">{f.title}</h3>
                    </div>
                    <p className="text-sm text-secondary-600 leading-relaxed mb-4">{f.description}</p>
                    <ul className="space-y-2 mt-auto">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-secondary-700">
                          <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-20">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-3">Why DraftEngine</div>
            <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
              The manual way vs. DraftEngine.
            </h2>
            <p className="mt-3 text-secondary-600">
              Same output, 95% less time. Quality-reviewed by AI agents before you ever see the draft.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
            {/* Manual */}
            <div className="rounded-lg border border-secondary-200 bg-white p-6">
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-base font-semibold text-secondary-900">Manual method</h3>
                <span className="text-sm font-mono text-error-600 tabular-nums">38+ hrs</span>
              </div>
              <ul className="space-y-3">
                {[
                  ['Reading and annotating each source', '~15 hrs'],
                  ['Writing summaries and pulling quotes', '~6 hrs'],
                  ['Brainstorming topics and outline', '~4 hrs'],
                  ['Drafting, formatting citations, revising', '~13 hrs'],
                ].map(([task, time]) => (
                  <li key={task} className="flex items-start gap-2.5 text-sm">
                    <X className="w-3.5 h-3.5 text-secondary-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-secondary-700">{task}</span>
                      <span className="text-xs font-mono text-secondary-500 tabular-nums whitespace-nowrap">{time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-secondary-200 text-xs text-secondary-500">
                Inconsistent quality. No review process.
              </p>
            </div>

            {/* DraftEngine */}
            <div className="relative rounded-lg border border-secondary-900 bg-white p-6">
              <div className="absolute -top-2.5 left-6">
                <span className="badge badge-brand bg-primary text-white border-primary">95% faster</span>
              </div>
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-base font-semibold text-secondary-900">DraftEngine</h3>
                <span className="text-sm font-mono text-primary tabular-nums">~2 hrs</span>
              </div>
              <ul className="space-y-3">
                {[
                  ['Import via PDF, URL, DOI, or RSS', '~2 min'],
                  ['AI analyzes arguments and passages', '~90 sec/source'],
                  ['Generate topics and customize outline', '~3 min'],
                  ['AI generates quality-reviewed document', '2–5 min'],
                  ['Review, edit, and export to Word', '~90 min'],
                ].map(([task, time]) => (
                  <li key={task} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <div className="flex-1 flex items-baseline justify-between gap-2">
                      <span className="text-secondary-700">{task}</span>
                      <span className="text-xs font-mono text-secondary-500 tabular-nums whitespace-nowrap">{time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-secondary-200 text-xs text-primary font-medium">
                Quality-reviewed by AI agents before you see it.
              </p>
            </div>
          </div>
        </div>

        {/* Additional features */}
        <div className="mb-20">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-3">Also included</div>
            <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
              Everything else you need.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
            {additionalFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white p-5">
                  <div className="w-7 h-7 rounded-md bg-secondary-100 border border-secondary-200 flex items-center justify-center mb-3">
                    <Icon className="w-3.5 h-3.5 text-secondary-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-secondary-900 mb-1.5">{f.title}</h3>
                  <p className="text-xs text-secondary-600 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-8 text-center">
            Common questions
          </h2>
          <div className="divide-y divide-secondary-200 border-y border-secondary-200">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base font-medium text-secondary-900">{item.question}</span>
                  <span className="ml-4 flex-shrink-0 w-5 h-5 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-500 group-open:rotate-45 transition-transform">
                    <span className="text-sm leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-secondary-600 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-secondary-900 text-white px-8 py-12 lg:py-14 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Ready to publish?
          </h2>
          <p className="mt-3 text-secondary-300 max-w-xl mx-auto">
            Start free with 5 source entries. No credit card required.
          </p>
          <Link to="/signup" className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors">
            Start free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;

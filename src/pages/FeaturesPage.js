// src/pages/FeaturesPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import SEO from '../components/SEO';

const FeaturesPage = () => {
  const coreFeatures = [
    {
      title: 'Multi-Source Import',
      description: 'Bring your research from anywhere. Upload PDFs up to 50MB, paste any URL for automatic article extraction, look up papers by DOI via CrossRef, or subscribe to RSS feeds and cherry-pick the articles that matter.',
      bullets: [
        'PDF upload (up to 50MB per file)',
        'URL paste with automatic article extraction',
        'DOI lookup via CrossRef API (metadata + abstract)',
        'RSS feed import — parse feeds and select articles',
      ],
    },
    {
      title: 'AI Source Analysis',
      description: 'Every source you import is analyzed in roughly 90 seconds. DraftEngine surfaces the arguments, angles, and passages that matter most — so you spend your time writing, not re-reading.',
      bullets: [
        'Key arguments — 3-4 main claims identified',
        'Interesting angles — surprising or counterintuitive elements',
        'Perspective value — the unique viewpoint each source brings',
        'Notable passages — 3-4 quotable excerpts with page numbers',
      ],
    },
    {
      title: 'Topic & Outline Generator',
      description: 'Analyze your sources together and let AI propose 3 editorial-quality topic suggestions with argument-driven outlines. Section headings make claims, not labels — and sources are woven across sections, never siloed.',
      bullets: [
        '3 editorial-quality topic suggestions per analysis',
        'Argument-driven outlines with claim-based headings',
        'Edit AI outlines or create your own from scratch',
        'Sources mapped across sections for cohesive arguments',
      ],
    },
    {
      title: 'Document Generation',
      description: 'Turn your outline into a polished draft of 500 to 10,000 words. Choose your document type, tone, and approach — then let quality agents review every section before you ever see the result.',
      bullets: [
        '4 document types: article, essay, blog post, op-ed',
        '4 tones: professional, conversational, bold, intimate',
        '3 approaches: emotional, logical, balanced',
        'Quality agents auto-review and regenerate weak sections',
      ],
    },
    {
      title: 'Citations & References',
      description: 'Proper attribution without the tedious formatting. DraftEngine inserts inline citation markers and generates a complete reference list in your preferred style — automatically, after generation.',
      bullets: [
        'APA, MLA, and Chicago citation styles',
        'Auto-generated reference list appended to your document',
        'Inline citation markers inserted post-generation',
        'Natural source attribution woven into prose',
      ],
    },
    {
      title: 'Research Feeds',
      description: 'Stay ahead of the literature without lifting a finger. Subscribe to research topics and DraftEngine surfaces new papers from Semantic Scholar, OpenAlex, and CrossRef — ready to import directly into your library.',
      bullets: [
        'Subscribe to any research topic',
        'Papers surfaced from 3 academic databases',
        'Import new papers directly to your library',
        'Daily or weekly delivery frequency',
      ],
    },
  ];

  const additionalFeatures = [
    { title: 'DALL-E Editorial Illustrations', description: 'Every section receives a custom DALL-E 3 illustration — included at no extra cost with document generation.' },
    { title: 'Quality Review Agents', description: 'Section Quality Agent checks 7 dimensions per section. Document Coherence Agent reviews argument arc, contradictions, and pacing across the full draft.' },
    { title: 'Multiple Document Types', description: 'Article, essay, blog post, or op-ed — each type follows distinct structural conventions tuned for its audience.' },
    { title: '4 Writing Tones', description: 'Professional, conversational, bold, or intimate. Set the voice that matches your audience and publication.' },
    { title: 'Word & Text Export', description: 'Download as Word (.docx) with formatting, inline images, and references — or as plain text. Section illustrations embedded automatically.' },
    { title: 'Enhanced Output', description: 'Every document comes with a refined title (3 alternatives), a 150-word meta description, and a social media excerpt ready to share.' },
    { title: 'Private & Secure', description: 'Your sources and documents remain yours. Data is processed securely and never shared with third parties.' },
    { title: 'Edit Before Download', description: 'Review and refine every field — title, outline, body — before you export. DraftEngine gives you a strong draft, not a locked file.' },
  ];

  const faqItems = [
    {
      question: 'Can I edit the AI-generated content?',
      answer: 'Yes. Every field is fully editable — title, outline, body text, and more. DraftEngine gives you a strong starting point that you can customize however you want before exporting.',
    },
    {
      question: 'How does source attribution work?',
      answer: 'DraftEngine supports APA, MLA, and Chicago citation styles. Inline citation markers are inserted automatically after generation, and a complete reference list is appended to your document. Sources are also woven naturally into prose for readability.',
    },
    {
      question: 'What do the quality agents do?',
      answer: 'Two AI agents review your document before you see it. The Section Quality Agent evaluates 7 dimensions per section — structural tics, source accuracy, paragraph architecture, and more. The Document Coherence Agent checks argument arc, contradictions, orphaned threads, and pacing across the full draft. Sections scoring below threshold are automatically regenerated.',
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-mesh">
      <SEO
        title="Features"
        description="Multi-source import, AI analysis in 90 seconds, topic and outline generation, full document drafting up to 10,000 words, quality agents, citations, DALL-E illustrations, and export to Word."
        path="/features"
      />
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 relative overflow-hidden">
          <FadeIn direction="up">
            <h1 className="text-5xl font-bold text-secondary-900 mb-6 relative z-10">
              Everything You Need to Turn Research into{' '}
              <span className="text-gradient">Published Content</span>
            </h1>
            <p className="text-xl text-secondary-700 max-w-3xl mx-auto relative z-10">
              Import sources from anywhere, analyze them in seconds, and generate quality-reviewed documents complete with citations, illustrations, and export-ready formatting.
            </p>
          </FadeIn>
        </div>

        {/* Core Features - 6 Main Tools */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Six <span className="text-gradient">Powerful Tools</span>, One Platform
          </h2>
          <StaggerChildren>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {coreFeatures.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <div className="card-floating h-full flex flex-col">
                      <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-secondary-700 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-3 mb-6 flex-1">
                        {feature.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start space-x-2 text-sm">
                            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                ))}
            </div>
          </StaggerChildren>
        </div>

        <div className="section-divider my-16" />

        {/* Before/After Comparison */}
        <div className="mb-20 py-20 lg:py-24 bg-gradient-to-br from-red-50 via-white to-green-50 -mx-6 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
              The Traditional Way vs. <span className="text-gradient">DraftEngine</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Manual Method */}
              <FadeIn direction="right">
                <div className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-lg">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-red-700">Manual Method</h3>
                    <p className="text-sm text-red-600 font-semibold">38+ hours per document</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-800 font-medium">Reading and annotating each source</p>
                        <p className="text-secondary-500 text-xs">~15 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-800 font-medium">Writing source summaries and pulling quotes</p>
                        <p className="text-secondary-500 text-xs">~6 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-800 font-medium">Brainstorming topics and building an outline</p>
                        <p className="text-secondary-500 text-xs">~4 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-800 font-medium">Drafting, formatting citations, and revising</p>
                        <p className="text-secondary-500 text-xs">~13 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-red-200 mt-4">
                    <p className="text-red-700 font-bold text-center">Total: 38+ hours</p>
                    <p className="text-xs text-red-600 text-center mt-1">Inconsistent quality, no review process</p>
                  </div>
                </div>
              </FadeIn>

              {/* DraftEngine Method */}
              <FadeIn direction="left">
                <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-xl relative">
                  <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    95% FASTER
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-green-700">DraftEngine</h3>
                    <p className="text-sm text-green-600 font-semibold">~2 hours total</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-900 font-medium">Import sources via PDF, URL, DOI, or RSS</p>
                        <p className="text-secondary-500 text-xs">~2 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-900 font-medium">AI analyzes arguments, angles, and passages</p>
                        <p className="text-secondary-500 text-xs">~90 seconds per source</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-900 font-medium">Generate topics, select and customize outline</p>
                        <p className="text-secondary-500 text-xs">~3 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-900 font-medium">AI generates quality-reviewed document with citations</p>
                        <p className="text-secondary-500 text-xs">2-5 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-secondary-900 font-medium">Review, edit, and export to Word</p>
                        <p className="text-secondary-500 text-xs">~90 minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-200 mt-4">
                    <p className="text-green-700 font-bold text-center">Total: ~2 hours</p>
                    <p className="text-xs text-green-700 text-center mt-1">Quality-reviewed by AI agents before you see it</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        <div className="section-divider my-16" />

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Everything Else You Need
          </h2>
          <StaggerChildren>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {additionalFeatures.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <div className="card-floating h-full flex flex-col">
                      <h3 className="text-lg font-bold text-secondary-900 mb-2">{feature.title}</h3>
                      <p className="text-secondary-700 text-sm flex-1">
                        {feature.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
            </div>
          </StaggerChildren>
        </div>

        <div className="section-divider my-16" />

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Common Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <FadeIn key={index} direction="up" delay={index * 0.05}>
                <div className="card">
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-secondary-700">
                    {item.answer}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="section-divider my-16" />

        {/* CTA Section */}
        <FadeIn direction="up">
          <div className="card bg-gradient-brand text-white text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start free with 5 source entries — no credit card required. See what DraftEngine can do with your research.
            </p>
            <Link to="/signup" className="inline-block bg-white text-primary hover:bg-secondary-50 transition-colors px-8 py-4 rounded-lg font-semibold text-lg">
              Start Free — 5 Source Entries, No Credit Card
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default FeaturesPage;

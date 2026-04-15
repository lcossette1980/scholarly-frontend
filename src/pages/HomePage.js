// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Download,
  Cpu,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroCarousel from '../components/HeroCarousel';
import { FadeIn, StaggerChildren, StaggerItem, AnimatedCounter } from '../components/motion';
import SEO from '../components/SEO';

const HomePage = () => {
  const { currentUser } = useAuth();

  const pricingCards = [
    {
      name: 'Starter',
      price: '$0',
      period: '/forever',
      description: 'Try the full workflow',
      features: [
        { text: '5 source entries (lifetime)', bold: false },
        { text: 'AI source analysis', bold: false },
        { text: 'Standard export to Word', bold: false },
        { text: 'Email support', bold: false },
      ],
      cta: 'Start Free',
      ctaLink: '/signup',
      ctaClass: 'btn btn-outline w-full',
      note: 'No credit card required',
      highlight: false,
    },
    {
      name: 'Plus',
      price: '$9.99',
      period: '/month',
      description: 'For regular writing',
      features: [
        { text: 'Unlimited source entries', bold: true },
        { text: 'Topic & Outline Generator', bold: true },
        { text: 'Research feeds', bold: false },
        { text: 'All citation styles', bold: false },
      ],
      cta: 'Start Trial',
      ctaLink: '/pricing',
      ctaClass: 'btn btn-primary w-full',
      note: 'Cancel anytime, no lock-in',
      highlight: true,
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      description: 'For power users',
      features: [
        { text: 'Everything in Plus', bold: true },
        { text: 'Premium AI analysis', bold: true },
        { text: 'All writing approaches', bold: false },
        { text: 'Priority support', bold: false },
      ],
      cta: 'Start Trial',
      ctaLink: '/pricing',
      ctaClass: 'btn btn-outline w-full',
      note: 'Cancel anytime, no lock-in',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <SEO
        description="AI writing platform that transforms source material into polished documents. Import PDFs, URLs, DOIs, and RSS feeds. Generate articles, essays, and blog posts with citations, quality review, and AI illustrations."
        path="/"
      />
      {/* Hero Section with Carousel */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <HeroCarousel />

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-4 mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col items-center">
                <Link
                  to={currentUser ? "/create" : "/signup"}
                  className="btn btn-primary text-lg px-8 py-4 group w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">{currentUser ? "Create Your First Entry" : "Try It Free — No Credit Card"}</span>
                  <span className="sm:hidden">{currentUser ? "Create Entry" : "Try Free"}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-secondary-500 mt-2">
                  Your data is private & never shared
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="/example_source_analysis.docx"
                  download
                  className="btn btn-secondary text-sm px-5 py-2.5 group flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Sample Source Analysis</span>
                </a>
                <a
                  href="/content_example.docx"
                  download
                  className="btn btn-secondary text-sm px-5 py-2.5 group flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Sample Generated Document</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <FadeIn direction="up">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-secondary-500 mt-8">
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-accent" /> 10,000+ writers</span>
              <span className="hidden sm:inline text-secondary-300">·</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-accent" /> 4 source import methods</span>
              <span className="hidden sm:inline text-secondary-300">·</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-accent" /> APA, MLA, Chicago citations</span>
              <span className="hidden sm:inline text-secondary-300">·</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-accent" /> AI quality review on every document</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Quick Stats */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <StaggerChildren>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { target: 10000, suffix: '+', label: 'Active Writers' },
                  { target: 4, suffix: '', label: 'Import Methods' },
                  { target: 90, suffix: 'sec', label: 'Source Analysis' },
                  { target: 4.9, suffix: '/5', label: 'User Rating' },
                ].map((stat) => (
                  <StaggerItem key={stat.label}>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-secondary-900 mb-1">
                        <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                      </p>
                      <p className="text-sm text-secondary-500">{stat.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          </div>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* How It Works */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Three steps to finished content
            </h2>
            <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
              Import your research, generate polished documents, and export — all in one workflow.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <StaggerChildren>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: '01', title: 'Import Your Research', desc: 'Upload PDFs, paste URLs, look up DOIs through CrossRef, or connect RSS feeds to stay current with your field.', image: '/images/step_import.png', imageAlt: 'Import your research' },
                  { step: '02', title: 'Generate & Review', desc: 'AI writes your document with section-level quality review, auto-generated citations, and DALL-E editorial illustrations. Two quality agents review every draft before you see it.', image: '/images/step_generate.png', imageAlt: 'Generate and review' },
                  { step: '03', title: 'Publish & Share', desc: 'Export to Word with images, references, and formatting. Get a refined title, meta description, and social media excerpt — ready to publish.', image: '/images/step_export.png', imageAlt: 'Publish and share' },
                ].map((item) => (
                  <StaggerItem key={item.step}>
                    <div className="card-floating text-center h-full flex flex-col">
                      <img src={item.image} alt={item.imageAlt} className="w-full rounded-lg mb-4" />
                      <div className="text-xs font-mono font-semibold text-primary/60 mb-4 tracking-widest">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-secondary-900 mb-3">{item.title}</h3>
                      <p className="text-secondary-500 leading-relaxed flex-1">{item.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to={currentUser ? "/create" : "/signup"}
                className="btn btn-primary text-lg px-8 py-4 group inline-flex"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex gap-6 items-center">
                <a href="/example.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-700 font-medium text-sm">
                  Sample Source Analysis →
                </a>
                <a href="/content_example.docx" download className="text-primary hover:text-primary-700 font-medium text-sm">
                  Sample Generated Document →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Who It's For */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-4">Built for Professionals Who Publish</h2>
          <p className="text-secondary-600 text-center mb-12 max-w-2xl mx-auto">Research-backed content for every team that needs credibility, speed, and depth.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Content Marketing Teams', desc: 'Thought leadership grounded in real research — 10x faster than freelancers.', image: '/images/usecase_marketing.png', link: '/for/marketing-teams' },
              { title: 'Consultants & Analysts', desc: 'White papers and client deliverables in hours, not weeks.', image: '/images/usecase_consulting.png', link: '/for/consultants' },
              { title: 'Startups & Founders', desc: 'Investor-facing content backed by real market research.', image: '/images/usecase_startup.png', link: '/for/startups' },
            ].map(uc => (
              <Link key={uc.title} to={uc.link} className="card card-hover group">
                <img src={uc.image} alt={uc.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary transition-colors">{uc.title}</h3>
                <p className="text-secondary-600 text-sm">{uc.desc}</p>
                <span className="text-primary text-sm font-medium mt-3 inline-block">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Pricing Preview */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No contracts, cancel anytime.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {pricingCards.map((card, index) => (
              <FadeIn key={card.name} direction="up" delay={index * 0.1}>
                <div className={`card flex flex-col h-full ${card.highlight ? 'ring-2 ring-primary relative' : ''}`}>
                  {card.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">{card.name}</h3>
                    <div className="mb-1">
                      <span className="text-4xl font-bold text-secondary-900">{card.price}</span>
                      <span className="text-secondary-400 text-sm">{card.period}</span>
                    </div>
                    <p className="text-sm text-secondary-500 mb-6">{card.description}</p>
                    <ul className="space-y-3 mb-8">
                      {card.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-secondary-600">
                          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className={feature.bold ? 'font-semibold text-secondary-900' : ''}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to={card.ctaLink} className={card.ctaClass}>{card.cta}</Link>
                  <p className="text-xs text-secondary-400 mt-2 text-center">{card.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <p className="text-center text-sm text-secondary-400 mt-8">
            All plans include secure data handling and Word export
          </p>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Content Generation Pricing */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Pay per page, only when you generate
            </h2>
            <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
              Document generation is pay-as-you-go. Every page includes quality agents, citations, and AI illustrations.
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <FadeIn direction="up" delay={0}>
              <div className="card flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900">Standard</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-secondary-900">$1.49</span>
                  <span className="text-secondary-400 text-sm">/page</span>
                </div>
                <p className="text-sm text-secondary-500 mb-6">Powered by Claude Sonnet</p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Quality agents review every section</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>DALL-E editorial illustrations</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Auto-generated citations</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Enhanced title & meta description</span>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <div className="card flex flex-col h-full ring-2 ring-primary relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    Deeper Synthesis
                  </span>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900">Professional</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-secondary-900">$2.49</span>
                  <span className="text-secondary-400 text-sm">/page</span>
                </div>
                <p className="text-sm text-secondary-500 mb-6">Powered by Claude Opus</p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Deeper source synthesis</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Quality agents review every section</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>DALL-E editorial illustrations</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm text-secondary-600">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Auto-generated citations</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>

          <p className="text-center text-sm text-secondary-400 mt-8">
            500 to 10,000 words per document. Articles, essays, blog posts, and op-eds.
          </p>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Final CTA */}
      <FadeIn direction="up">
        <section className="py-20 lg:py-24 bg-gradient-brand">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                From Sources to Published Content in Minutes
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Import research, generate documents with citations and illustrations, export to Word.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Link
                  to={currentUser ? "/create" : "/signup"}
                  className="bg-white text-primary hover:bg-secondary-50 transition-colors px-8 py-4 rounded-xl font-semibold text-lg"
                >
                  Start Free — No Credit Card Required
                </Link>
                <Link
                  to="/features"
                  className="border-2 border-white/30 text-white hover:bg-white/10 transition-colors px-8 py-4 rounded-xl font-semibold text-lg"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50">
                <span>5 free entries to start</span>
                <span>·</span>
                <span>4 import methods</span>
                <span>·</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
};

export default HomePage;

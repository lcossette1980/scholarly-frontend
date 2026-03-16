// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Download
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
      description: 'Perfect for trying it out',
      features: [
        { text: '5 source entries (lifetime)', bold: false },
        { text: 'AI-powered source analysis', bold: false },
        { text: 'Standard export formats', bold: false },
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
        { text: 'Advanced AI analysis', bold: false },
        { text: 'All reference styles', bold: false },
        { text: 'Priority support', bold: false },
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
        { text: 'Topic & Outline Generator', bold: true },
        { text: 'Source synthesis tools', bold: false },
        { text: 'Advanced customization', bold: false },
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
        description="AI writing assistant that transforms your source material into polished articles, essays, and blog posts. Upload PDFs, get source summaries, generate outlines, and draft complete documents."
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
                  href="/example.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-base px-6 py-3 group flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Sample Source Summary</span>
                </a>
                <a
                  href="/content_example.docx"
                  download
                  className="btn btn-secondary text-base px-6 py-3 group flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Sample Document</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <FadeIn direction="up">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-secondary-500 mt-8">
              <span>5 free entries</span>
              <span className="hidden sm:inline text-secondary-300">·</span>
              <span>90-second setup</span>
              <span className="hidden sm:inline text-secondary-300">·</span>
              <span>Export to Word/PDF</span>
              <span className="hidden sm:inline text-secondary-300">·</span>
              <span>Cancel anytime</span>
            </div>

            <p className="text-center text-sm text-secondary-400 mt-4">
              Join 10,000+ writers saving an average of 18 hours per month
            </p>
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
                  { target: 18, suffix: 'hrs', label: 'Saved Per Month' },
                  { target: 90, suffix: 'sec', label: 'Average Generation' },
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
              Three steps to finished drafts
            </h2>
            <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
              No complex setup. No learning curve. Just upload and go.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <StaggerChildren>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: '01', title: 'Upload Sources', desc: 'Drop your PDF documents or manually enter details. We support any PDF, any length.' },
                  { step: '02', title: 'AI Generates', desc: 'Our AI creates source summaries, ideas, outlines, or complete documents. Takes 90 seconds to 5 minutes.' },
                  { step: '03', title: 'Download & Submit', desc: 'Get professionally formatted documents ready for submission. Export to Word, PDF, or clipboard.' },
                ].map((item) => (
                  <StaggerItem key={item.step}>
                    <div className="card-floating text-center h-full flex flex-col">
                      <div className="text-xs font-mono font-semibold text-accent/60 mb-4 tracking-widest">
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
                <a href="/example.pdf" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-700 font-medium text-sm">
                  Sample Source Summary →
                </a>
                <a href="/content_example.docx" download className="text-accent hover:text-accent-700 font-medium text-sm">
                  Sample Document →
                </a>
              </div>
            </div>
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

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {pricingCards.map((card, index) => (
              <FadeIn key={card.name} direction="up" delay={index * 0.1}>
                <div className={`card flex flex-col h-full ${card.highlight ? 'ring-2 ring-accent relative' : ''}`}>
                  {card.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
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
            All plans include secure data handling and Word/PDF export
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
                Ready to save hours on every draft?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join 10,000+ writers who've transformed their writing workflow.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <Link
                  to={currentUser ? "/create" : "/signup"}
                  className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-4 rounded-xl font-semibold text-lg"
                >
                  {currentUser ? "Create Your First Entry" : "Start Free — No Credit Card"}
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
                <span>2-minute setup</span>
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

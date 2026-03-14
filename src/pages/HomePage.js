// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Star,
  Zap,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroCarousel from '../components/HeroCarousel';
import { FadeIn, StaggerChildren, StaggerItem, AnimatedCounter } from '../components/motion';

const HomePage = () => {
  const { currentUser } = useAuth();

  const pricingCards = [
    {
      name: 'Free',
      price: '$0',
      period: '/forever',
      description: 'Perfect for trying it out',
      features: [
        { text: '5 entries (lifetime)', bold: false },
        { text: 'Source Analyzer', bold: false },
        { text: 'Basic AI analysis', bold: false },
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
        { text: 'Unlimited entries', bold: true },
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
        { text: 'Premium AI', bold: false },
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
      {/* Hero Section with Carousel */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="gradient-orb w-96 h-96 bg-accent-300 -top-20 -right-20" />
        <div className="gradient-orb w-72 h-72 bg-primary-300 top-40 -left-10" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-4 mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col items-center">
                <Link
                  to={currentUser ? "/create" : "/signup"}
                  className="btn btn-primary text-lg px-8 py-4 group w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="hidden sm:inline">{currentUser ? "Create Your First Entry" : "Try It Free - No Credit Card"}</span>
                  <span className="sm:hidden">{currentUser ? "Create Entry" : "Try Free"}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-secondary-600 mt-2 flex items-center">
                  <svg className="w-3 h-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your data is private & never shared
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="/example.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-base px-6 py-3 group flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                  <span>Sample Source Summary</span>
                </a>
                <a
                  href="/content_example.docx"
                  download
                  className="btn btn-secondary text-base px-6 py-3 group flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                  <span>Sample Document</span>
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <FadeIn direction="up">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-800 mt-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">5 free entries (no card needed)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">90-second setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Export to Word/PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>

            {/* Social Proof */}
            <p className="text-center text-sm text-secondary-600 italic mt-4">
              Join 10,000+ writers who've saved an average of 18 hours per month
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Quick Stats Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-accent/5 via-white to-khaki/10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <StaggerChildren>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StaggerItem>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-secondary-900 mb-1">
                      <AnimatedCounter target={10000} suffix="+" />
                    </p>
                    <p className="text-sm text-secondary-600">Active Writers</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-secondary-900 mb-1">
                      <AnimatedCounter target={18} suffix="hrs" />
                    </p>
                    <p className="text-sm text-secondary-600">Saved Per Month</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-secondary-900 mb-1">
                      <AnimatedCounter target={90} suffix="sec" />
                    </p>
                    <p className="text-sm text-secondary-600">Average Generation</p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-secondary-900 mb-1">
                      <AnimatedCounter target={4.9} suffix="/5" />
                    </p>
                    <p className="text-sm text-secondary-600">User Rating</p>
                  </div>
                </StaggerItem>
              </div>
            </StaggerChildren>
          </div>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* How It Works - Simple 3 Steps */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Dead Simple. <span className="text-accent">3 Steps</span> to Perfect Results
            </h2>
            <p className="text-lg text-secondary-800 max-w-2xl mx-auto">
              No complex setup. No learning curve. Just upload and go.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <StaggerChildren>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <StaggerItem>
                  <div className="card-floating text-center group">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-accent">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">Upload Sources</h3>
                    <p className="text-secondary-800 leading-relaxed">
                      Drop your PDF documents or manually enter details. We support any PDF, any length.
                    </p>
                  </div>
                </StaggerItem>

                {/* Step 2 */}
                <StaggerItem>
                  <div className="card-floating text-center group">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-accent">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">AI Generates</h3>
                    <p className="text-secondary-800 leading-relaxed">
                      Our AI creates source summaries, ideas, outlines, or complete documents based on what you need. Takes 90 seconds to 5 minutes.
                    </p>
                  </div>
                </StaggerItem>

                {/* Step 3 */}
                <StaggerItem>
                  <div className="card-floating text-center group">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-accent">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3">Download & Submit</h3>
                    <p className="text-secondary-800 leading-relaxed">
                      Get professionally formatted documents ready for submission. Export to Word, PDF, or copy to clipboard.
                    </p>
                  </div>
                </StaggerItem>
              </div>
            </StaggerChildren>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={currentUser ? "/create" : "/signup"}
                className="btn btn-primary text-lg px-8 py-4 group inline-flex"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <a
                  href="/example.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-700 font-medium text-base flex items-center underline"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Sample Source Summary
                </a>
                <a
                  href="/content_example.docx"
                  download
                  className="text-accent hover:text-accent-700 font-medium text-base flex items-center underline"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Sample Document
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Pricing Preview */}
      <section className="py-20 lg:py-24 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-lg text-secondary-800 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No contracts, cancel anytime.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {pricingCards.map((card, index) => (
              <FadeIn key={card.name} direction="up" delay={index * 0.1}>
                <div className={`card text-center ${card.highlight ? 'ring-2 ring-accent relative' : ''}`}>
                  {card.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">{card.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-secondary-900">{card.price}</span>
                    <span className="text-secondary-600">{card.period}</span>
                  </div>
                  <p className="text-sm text-secondary-700 mb-6">{card.description}</p>
                  <ul className="space-y-3 text-left mb-6">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className={feature.bold ? 'font-semibold' : ''}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={card.ctaLink} className={card.ctaClass}>{card.cta}</Link>
                  <p className="text-xs text-secondary-600 mt-2 text-center">{card.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <p className="text-center text-sm text-secondary-600 mt-8">
            All plans include: Export to Word, secure & private, cancel anytime
          </p>
        </div>
      </section>

      <div className="section-divider my-16" />

      {/* Final CTA */}
      <FadeIn direction="up">
        <section className="py-20 lg:py-24 relative overflow-hidden bg-gradient-brand">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Ready to Save Hours on Every Draft?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join 10,000+ writers who've transformed their writing workflow
              </p>

              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={currentUser ? "/create" : "/signup"}
                    className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto"
                  >
                    {currentUser ? "Create Your First Entry" : "Start Free - No Credit Card"}
                  </Link>
                  <Link
                    to="/features"
                    className="border-2 border-white text-white hover:bg-white hover:text-accent-600 transition-colors px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto"
                  >
                    Learn More
                  </Link>
                </div>
                <p className="text-sm text-white/80 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure checkout • Your data stays private
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>5 free entries to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>2-minute setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              <p className="text-white/70 text-sm mt-6">
                1,247 writers signed up this week
              </p>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
};

export default HomePage;

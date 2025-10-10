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

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-12">
            <Link
              to={currentUser ? "/create" : "/signup"}
              className="btn btn-primary text-lg px-8 py-4 group w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="hidden sm:inline">{currentUser ? "Create Your First Entry" : "Try It Free - No Credit Card"}</span>
              <span className="sm:hidden">{currentUser ? "Create Entry" : "Try Free"}</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="/example.pdf"
              download
              className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto group"
            >
              <Download className="w-5 h-5 mr-2 group-hover:translate-y-0.5 transition-transform" />
              Download Example
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-charcoal/80 mt-8">
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
          <p className="text-center text-sm text-charcoal/60 italic mt-4">
            Join 10,000+ researchers who've saved an average of 18 hours per month
          </p>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-gradient-to-br from-chestnut/5 via-white to-khaki/10">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-chestnut" />
                </div>
                <p className="text-3xl font-bold text-charcoal font-playfair mb-1">10,000+</p>
                <p className="text-sm text-charcoal/60">Active Researchers</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-charcoal font-playfair mb-1">18hrs</p>
                <p className="text-sm text-charcoal/60">Saved Per Month</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-charcoal font-playfair mb-1">90sec</p>
                <p className="text-sm text-charcoal/60">Average Generation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-charcoal font-playfair mb-1">4.9/5</p>
                <p className="text-sm text-charcoal/60">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Simple 3 Steps */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Dead Simple. <span className="text-chestnut">3 Steps</span> to Perfect Results
            </h2>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto font-lato">
              No complex setup. No learning curve. Just upload and go.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card text-center group hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-chestnut">1</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">Upload Papers</h3>
              <p className="text-charcoal/80 font-lato leading-relaxed">
                Drop your PDF research papers or manually enter details. We support any academic PDF, any length.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card text-center group hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-chestnut">2</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">AI Generates</h3>
              <p className="text-charcoal/80 font-lato leading-relaxed">
                Our AI creates bibliographies, topics, outlines, or complete papers based on what you need. Takes 90 seconds to 5 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card text-center group hover:shadow-xl transition-shadow">
              <div className="w-20 h-20 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-chestnut">3</span>
              </div>
              <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">Download & Submit</h3>
              <p className="text-charcoal/80 font-lato leading-relaxed">
                Get professionally formatted documents ready for submission. Export to Word, PDF, or copy to clipboard.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to={currentUser ? "/create" : "/signup"}
              className="btn btn-primary text-lg px-8 py-4 group inline-flex"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-4">
              Simple, Transparent <span className="text-chestnut">Pricing</span>
            </h2>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto font-lato">
              Start free, upgrade when you need more. No contracts, cancel anytime.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$0</span>
                <span className="text-charcoal/60">/forever</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">Perfect for trying it out</p>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>5 entries (lifetime)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Bibliography Generator</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Basic AI analysis</span>
                </li>
              </ul>
              <Link to="/signup" className="btn btn-outline w-full">Start Free</Link>
            </div>

            {/* Student - Most Popular */}
            <div className="card text-center ring-2 ring-chestnut relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-chestnut text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">Student</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$9.99</span>
                <span className="text-charcoal/60">/month</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">For ongoing research</p>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Unlimited entries</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All citation styles</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/pricing" className="btn btn-primary w-full">Start Trial</Link>
            </div>

            {/* Researcher */}
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">Researcher</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$19.99</span>
                <span className="text-charcoal/60">/month</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">For power users</p>
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Everything in Student</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Topic & Outline Generator</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Research synthesis tools</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Premium AI</span>
                </li>
              </ul>
              <Link to="/pricing" className="btn btn-outline w-full">Start Trial</Link>
            </div>
          </div>

          <p className="text-center text-sm text-charcoal/60 mt-8">
            All plans include: Export to Word, secure & private, cancel anytime
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20 relative overflow-hidden bg-gradient-chestnut">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-5xl font-bold font-playfair mb-6">
              Ready to Save Hours on Every Paper?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-lato">
              Join 10,000+ researchers who've transformed their research workflow
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link
                to={currentUser ? "/create" : "/signup"}
                className="bg-white text-chestnut hover:bg-bone transition-colors px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto"
              >
                {currentUser ? "Create Your First Entry" : "Start Free - No Credit Card"}
              </Link>
              <Link
                to="/features"
                className="border-2 border-white text-white hover:bg-white hover:text-chestnut transition-colors px-8 py-4 rounded-lg font-semibold text-lg w-full sm:w-auto"
              >
                Learn More
              </Link>
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
              1,247 researchers signed up this week
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

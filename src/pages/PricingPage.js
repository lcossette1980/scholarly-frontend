// src/pages/PricingPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS, createCheckoutSession } from '../services/stripe';
import { FadeIn, StaggerChildren, StaggerItem, ScaleIn } from '../components/motion';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [estimatorPages, setEstimatorPages] = useState(10);
  const [estimatorTier, setEstimatorTier] = useState('standard');
  const { currentUser, userDocument } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (planId) => {
    if (!currentUser) {
      navigate('/signup');
      return;
    }

    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }

    setIsLoading(planId);

    try {
      const plan = SUBSCRIPTION_PLANS[planId];
      await createCheckoutSession(currentUser.uid, plan.priceId, planId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(null);
    }
  };

  const isCurrentPlan = (planId) => {
    return userDocument?.subscription?.plan === planId;
  };

  const estimatedCost = estimatorPages * (estimatorTier === 'standard' ? 1.49 : 2.49);

  const planCards = [
    {
      planId: 'free',
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
      ctaClass: 'btn btn-outline w-full justify-center',
      highlight: false,
    },
    {
      planId: 'student',
      name: 'Plus',
      price: '$9.99',
      period: '/month',
      description: 'For regular writing',
      features: [
        { text: 'Unlimited source entries', bold: true },
        { text: 'Topic & Outline Generator', bold: true },
        { text: 'Advanced AI analysis', bold: false },
        { text: 'Priority support', bold: false },
      ],
      ctaClass: 'btn btn-primary w-full justify-center',
      highlight: true,
    },
    {
      planId: 'researcher',
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      description: 'For power users',
      features: [
        { text: 'Everything in Plus', bold: true },
        { text: 'Premium AI analysis', bold: false },
        { text: 'Advanced customization', bold: false },
        { text: 'All writing approaches', bold: false },
      ],
      ctaClass: 'btn btn-outline w-full justify-center',
      highlight: false,
    },
  ];

  const getPlanDisplayName = (planId) => {
    const map = { free: 'Starter', trial: 'Starter', student: 'Plus', researcher: 'Pro' };
    return map[planId] || planId;
  };

  return (
    <div className="min-h-screen py-6 md:py-12 bg-mesh relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-secondary-900 mb-6">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-secondary-700 max-w-3xl mx-auto leading-relaxed">
              Start free with 5 lifetime entries, or upgrade for unlimited access. No contracts, cancel anytime.
            </p>
          </div>
        </FadeIn>

        {/* Pricing Cards — 3 columns */}
        <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {planCards.map((card) => {
            const isCurrent = isCurrentPlan(card.planId);
            return (
              <StaggerItem key={card.planId}>
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
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className={feature.bold ? 'font-semibold text-secondary-900' : ''}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleSubscribe(card.planId)}
                    disabled={isLoading === card.planId || isCurrent}
                    className={`${card.ctaClass} ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading === card.planId ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : card.planId === 'free' ? (
                      'Get Started Free'
                    ) : (
                      <>
                        Upgrade to {card.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-secondary-400 mt-2 text-center">
                    {card.planId === 'free' ? 'No credit card required' : 'Cancel anytime, no lock-in'}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* Current Plan Status */}
        {currentUser && userDocument?.subscription && (
          <FadeIn direction="up">
            <div className="card max-w-2xl mx-auto mb-16 bg-accent/5 border-accent-600/20">
              <div className="text-center">
                <h3 className="text-xl font-bold text-secondary-900 mb-2">
                  Your Current Plan
                </h3>
                <p className="text-secondary-700 mb-4">
                  You're currently on the{' '}
                  <span className="font-semibold text-accent">
                    {getPlanDisplayName(userDocument.subscription.plan)}
                  </span>{' '}
                  plan
                </p>

                {(userDocument.subscription.plan === 'free' || userDocument.subscription.plan === 'trial') ? (
                  <div className="bg-white/50 rounded-lg p-4 inline-block">
                    <p className="text-sm text-secondary-700 mb-1">Lifetime usage</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-secondary-200/30 rounded-full h-2 min-w-[200px]">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-secondary-900">
                        {userDocument.subscription.entriesUsed} / {userDocument.subscription.entriesLimit}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/50 rounded-lg p-4 inline-block">
                    <p className="text-lg font-semibold text-accent">Unlimited Source Entries</p>
                    <p className="text-sm text-secondary-700 mt-1">+ Topic & Outline Generator</p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Section Divider */}
        <div className="section-divider max-w-3xl mx-auto mb-16" />

        {/* Content Generation Pricing */}
        <FadeIn direction="up">
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-4">
              AI <span className="text-gradient">Content Generation</span> Pricing
            </h2>
            <p className="text-center text-secondary-700 mb-8">
              Pay only for what you generate. No subscription required for document generation.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Standard Tier */}
              <div className="card flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-secondary-900">Standard</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    GPT-4o
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-secondary-900">$1.49</span>
                  <span className="text-secondary-600">/page</span>
                </div>
                <p className="text-sm text-secondary-700 mb-6">High-quality generation for most use cases</p>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Fast generation (2-3 min for 10 pages)</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Natural source attribution in all content</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Multiple document types</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Export to Word/PDF</span>
                  </li>
                </ul>
              </div>

              {/* Pro Tier */}
              <div className="card flex flex-col h-full ring-2 ring-accent relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-secondary-900">Pro</h3>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    GPT-4 Turbo
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-secondary-900">$2.49</span>
                  <span className="text-secondary-600">/page</span>
                </div>
                <p className="text-sm text-secondary-700 mb-6">Premium quality with priority processing</p>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Everything in Standard, plus:</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Superior writing quality & coherence</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Priority queue (2x faster)</span>
                  </li>
                  <li className="flex items-start space-x-2 text-sm">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Better source integration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Cost Estimator Widget */}
            <ScaleIn delay={0.2}>
              <div className="glass-card mt-8 p-6 md:p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-secondary-900 text-center mb-2">
                  Cost Estimator
                </h3>
                <p className="text-center text-secondary-700 mb-6">
                  Calculate the exact cost for your document before you generate
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Pages Input */}
                  <div>
                    <label className="form-label">Number of Pages</label>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      value={estimatorPages}
                      onChange={(e) => setEstimatorPages(Number(e.target.value))}
                      className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <div className="flex justify-between text-sm text-secondary-600 mt-2">
                      <span>2 pages</span>
                      <span className="font-bold text-accent">{estimatorPages} pages</span>
                      <span>40 pages</span>
                    </div>
                    <p className="text-xs text-secondary-600 mt-2 text-center">
                      ≈ {estimatorPages * 250} words
                    </p>
                  </div>

                  {/* Tier Selection */}
                  <div>
                    <label className="form-label">Quality Tier</label>
                    <div className="space-y-3">
                      <button
                        onClick={() => setEstimatorTier('standard')}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          estimatorTier === 'standard'
                            ? 'border-accent bg-accent/5'
                            : 'border-secondary-300/30 hover:border-secondary-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-secondary-900">Standard</p>
                            <p className="text-xs text-secondary-600">GPT-4o — $1.49/page</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            estimatorTier === 'standard'
                              ? 'bg-accent border-accent'
                              : 'border-secondary-300'
                          }`}>
                            {estimatorTier === 'standard' && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => setEstimatorTier('pro')}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          estimatorTier === 'pro'
                            ? 'border-accent bg-accent/5'
                            : 'border-secondary-300/30 hover:border-secondary-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-secondary-900">Pro</p>
                            <p className="text-xs text-secondary-600">GPT-4 Turbo — $2.49/page</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            estimatorTier === 'pro'
                              ? 'bg-accent border-accent'
                              : 'border-secondary-300'
                          }`}>
                            {estimatorTier === 'pro' && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cost Display */}
                <div className="bg-white rounded-xl p-6 text-center border border-secondary-300/30">
                  <p className="text-sm text-secondary-600 mb-2">Estimated Cost</p>
                  <p className="text-5xl font-bold text-accent mb-2">
                    ${estimatedCost.toFixed(2)}
                  </p>
                  <p className="text-sm text-secondary-700">
                    {estimatorPages} pages × ${estimatorTier === 'standard' ? '1.49' : '2.49'} per page
                  </p>
                  <div className="mt-4 pt-4 border-t border-secondary-300/30">
                    <p className="text-xs text-secondary-600">
                      Pay after generation — 100% refund if generation fails
                    </p>
                  </div>
                </div>
              </div>
            </ScaleIn>
          </div>
        </FadeIn>

        {/* Section Divider */}
        <div className="section-divider max-w-3xl mx-auto mb-16" />

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </FadeIn>

          <StaggerChildren className="space-y-6">
            <StaggerItem>
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Can I change plans at any time?
                </h3>
                <p className="text-secondary-700">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  What's the difference between Plus and Pro?
                </h3>
                <p className="text-secondary-700">
                  Both Plus and Pro include unlimited source entries and the Topic & Outline Generator. Pro adds premium AI analysis and advanced customization for power users who need the best output quality.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  How does content generation pricing work?
                </h3>
                <p className="text-secondary-700">
                  Content generation (AI document writing) is pay-per-use. You only pay for documents you generate, based on length. Choose Standard ($1.49/page) or Pro ($2.49/page) tier. This is separate from source analysis subscriptions.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Is there a starter discount?
                </h3>
                <p className="text-secondary-700">
                  Our Starter plan is completely free with 5 lifetime source entries — no credit card required. Plus is designed for individual writers at an affordable price, and Pro is for power users who need advanced features.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-secondary-700">
                  We accept all major credit cards and PayPal. All payments are processed securely through Stripe.
                </p>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>

        {/* Section Divider */}
        <div className="section-divider max-w-3xl mx-auto mb-16" />

        {/* CTA Section */}
        <FadeIn direction="up">
          <div className="card max-w-4xl mx-auto text-center bg-gradient-brand text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Writing?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of writers who save hours every week with DraftEngine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {!currentUser ? (
                <>
                  <Link
                    to="/signup"
                    className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-accent-600 transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/create"
                  className="bg-white text-accent hover:bg-secondary-50 transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Create Your First Entry
                </Link>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default PricingPage;

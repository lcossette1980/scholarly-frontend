// src/pages/PricingPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, GraduationCap, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS, createCheckoutSession } from '../services/stripe';
import { FadeIn } from '../components/motion';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

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

  const isCurrentPlan = (planId) => userDocument?.subscription?.plan === planId;
  const estimatedCost = estimatorPages * (estimatorTier === 'standard' ? 1.49 : 2.49);

  const planCards = [
    {
      planId: 'free',
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Try the full workflow',
      features: [
        '5 lifetime source entries',
        'AI source analysis',
        'All 4 import methods',
        'Word & text export',
        'Email support',
      ],
      cta: 'Get started',
      ctaClass: 'btn btn-secondary w-full',
    },
    {
      planId: 'student',
      name: 'Plus',
      price: '$9.99',
      period: 'per month',
      description: 'For regular writing',
      features: [
        'Unlimited source entries',
        'Topic & Outline Generator',
        'Pay-per-page document generation',
        'All citation styles',
        'Email support',
      ],
      cta: 'Start Plus',
      ctaClass: 'btn btn-secondary w-full',
    },
    {
      planId: 'researcher',
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      description: 'Best value for publishers',
      features: [
        'Everything in Plus',
        '10 pages included monthly ($14.90 value)',
        'Discounted overage: $1 / $2 per page',
        'Research Feeds — auto-import papers',
        'Priority support',
      ],
      cta: 'Start Pro',
      ctaClass: 'btn btn-primary w-full',
      featured: true,
    },
  ];

  const planNameMap = { free: 'Starter', trial: 'Starter', student: 'Plus', researcher: 'Pro' };

  const isAcademicUser = (() => {
    const role = userDocument?.onboardingRole;
    const purpose = userDocument?.onboardingPurpose;
    return ['researcher', 'student'].includes(role) || ['research-summaries', 'academic-papers', 'bibliographies'].includes(purpose);
  })();

  return (
    <div className="bg-white">
      <SEO
        title="Pricing Plans"
        description="Simple, transparent pricing for AI-powered writing. Start free with 5 source entries. Plus and Pro plans for unlimited access. Pay-per-use document generation available to all plans."
        path="/pricing"
      />

      {/* Hero */}
      <section className="border-b border-secondary-200">
        <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20 text-center">
          <FadeIn direction="up">
            <div className="eyebrow mb-4">Pricing</div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight">
              Simple, transparent, no contracts.
            </h1>
            <p className="mt-4 text-lg text-secondary-600 max-w-2xl mx-auto">
              Start free, pay only for what you generate. Cancel anytime.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        {/* Academic recommendation */}
        {currentUser && isAcademicUser && (
          <FadeIn direction="up">
            <div className="max-w-5xl mx-auto mb-8 rounded-lg border border-primary-200 bg-primary-50/50 p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-secondary-900 mb-0.5">Recommended for academic writers</p>
                <p className="text-secondary-600">
                  <span className="font-medium text-secondary-900">Plus</span> covers most academic workflows — unlimited sources, all import methods, and the Topic & Outline Generator.
                </p>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
          {planCards.map((card) => {
            const isCurrent = isCurrentPlan(card.planId);
            return (
              <div
                key={card.planId}
                className={`relative bg-white rounded-lg border p-6 flex flex-col ${
                  card.featured ? 'border-secondary-900' : 'border-secondary-200'
                }`}
              >
                {card.featured && (
                  <div className="absolute -top-2.5 left-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-md bg-primary text-white">
                      <Sparkles className="w-3 h-3" /> Best value
                    </span>
                  </div>
                )}

                <h3 className="text-base font-semibold text-secondary-900 mb-1">{card.name}</h3>
                <p className="text-sm text-secondary-600 mb-4">{card.description}</p>

                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-semibold text-secondary-900 tabular-nums tracking-tight">{card.price}</span>
                  <span className="text-sm text-secondary-500 ml-1.5">/ {card.period}</span>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {card.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-700">
                      <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(card.planId)}
                  disabled={isLoading === card.planId || isCurrent}
                  className={`${card.ctaClass} ${isCurrent ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isLoading === card.planId ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isCurrent ? (
                    'Current plan'
                  ) : (
                    <>
                      {card.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-secondary-500 mt-2 text-center">
                  {card.planId === 'free' ? 'No credit card required' : 'Cancel anytime'}
                </p>
              </div>
            );
          })}
        </div>

        {/* Current plan status */}
        {currentUser && userDocument?.subscription && (
          <FadeIn direction="up">
            <div className="max-w-3xl mx-auto mb-16 rounded-lg border border-secondary-200 bg-secondary-50/50 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-secondary-500 font-medium mb-1">Current plan</p>
                  <p className="text-base font-semibold text-secondary-900">
                    {planNameMap[userDocument.subscription.plan] || userDocument.subscription.plan}
                  </p>
                </div>
                {(userDocument.subscription.plan === 'free' || userDocument.subscription.plan === 'trial') ? (
                  <div className="flex items-center gap-3">
                    <div className="w-40 bg-secondary-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 transition-all"
                        style={{
                          width: `${Math.min(
                            ((userDocument.subscription.entriesUsed || 0) / (userDocument.subscription.entriesLimit || 5)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-900 tabular-nums">
                      {userDocument.subscription.entriesUsed || 0} / {userDocument.subscription.entriesLimit || 5}
                    </span>
                  </div>
                ) : (
                  <span className="badge badge-brand">Unlimited sources</span>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Per-page generation */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="mb-10">
            <div className="eyebrow mb-3">Document generation</div>
            <h2 className="text-3xl font-semibold text-secondary-900 tracking-tight">
              Pay per page — available on every plan.
            </h2>
            <p className="mt-3 text-secondary-600">
              Choose your tier when you generate. A 10-page white paper costs <span className="font-mono text-secondary-900">$14.90</span> vs. <span className="line-through">$2,000+</span> from a freelancer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-lg border border-secondary-200 bg-white p-6">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-base font-semibold text-secondary-900">Standard</h3>
                <span className="badge badge-neutral font-mono">Claude Sonnet</span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-semibold text-secondary-900 tabular-nums tracking-tight">$1.49</span>
                <span className="text-sm text-secondary-500 ml-1">/ page</span>
              </div>
              <ul className="space-y-2.5 text-sm text-secondary-700">
                {[
                  'Quality agents review every section',
                  'Document coherence agent',
                  'DALL-E editorial illustrations',
                  'APA / MLA / Chicago citations',
                  'Refined title, meta, social excerpt',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-lg border border-secondary-900 bg-white p-6">
              <div className="absolute -top-2.5 left-6">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-md bg-primary text-white">
                  Deeper synthesis
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-base font-semibold text-secondary-900">Professional</h3>
                <span className="badge badge-brand font-mono">Claude Opus</span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-semibold text-secondary-900 tabular-nums tracking-tight">$2.49</span>
                <span className="text-sm text-secondary-500 ml-1">/ page</span>
              </div>
              <ul className="space-y-2.5 text-sm text-secondary-700">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                  <span className="font-medium text-secondary-900">Everything in Standard, plus:</span>
                </li>
                {[
                  'Deeper source synthesis',
                  'Superior writing quality',
                  'More nuanced argumentation',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cost estimator */}
          <div className="rounded-lg border border-secondary-200 bg-secondary-50/40 p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold text-secondary-900">Cost estimator</h3>
            </div>
            <p className="text-sm text-secondary-600 mb-6">Know the exact cost before you generate.</p>

            <div className="grid md:grid-cols-3 gap-6 items-start">
              {/* Pages */}
              <div className="md:col-span-1">
                <label className="form-label">Pages</label>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={estimatorPages}
                  onChange={(e) => setEstimatorPages(Number(e.target.value))}
                  className="w-full h-1.5 bg-secondary-200 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-secondary-500 mt-2 tabular-nums">
                  <span>2</span>
                  <span className="font-medium text-secondary-900">{estimatorPages} pages · {(estimatorPages * 250).toLocaleString()} words</span>
                  <span>40</span>
                </div>
              </div>

              {/* Tier */}
              <div className="md:col-span-1">
                <label className="form-label">Tier</label>
                <div className="space-y-2">
                  {[
                    { id: 'standard', label: 'Standard', sub: '$1.49 / page · Claude Sonnet' },
                    { id: 'pro', label: 'Professional', sub: '$2.49 / page · Claude Opus' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setEstimatorTier(t.id)}
                      className={`w-full p-3 rounded-md border text-left transition-colors ${
                        estimatorTier === t.id
                          ? 'border-secondary-900 bg-white'
                          : 'border-secondary-200 bg-white hover:border-secondary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-secondary-900">{t.label}</p>
                          <p className="text-xs text-secondary-500">{t.sub}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          estimatorTier === t.id ? 'bg-secondary-900 border-secondary-900' : 'border-secondary-300'
                        }`}>
                          {estimatorTier === t.id && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost display */}
              <div className="md:col-span-1">
                <label className="form-label">Estimate</label>
                <div className="rounded-md border border-secondary-200 bg-white p-5 text-center">
                  <p className="text-4xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                    ${estimatedCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-secondary-500 mt-2 tabular-nums">
                    {estimatorPages} × ${estimatorTier === 'standard' ? '1.49' : '2.49'}
                  </p>
                  <p className="text-xs text-secondary-500 mt-3 pt-3 border-t border-secondary-200">
                    100% refund if generation fails
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-8 text-center">
            Frequently asked questions
          </h2>

          <div className="divide-y divide-secondary-200 border-y border-secondary-200">
            {[
              {
                q: 'Can free users generate documents?',
                a: 'Yes. Document generation is pay-per-use and available to all plans, including Starter. Choose Standard ($1.49/page) or Professional ($2.49/page) each time you generate.',
              },
              {
                q: 'What\'s included in document generation?',
                a: 'Every generated document includes quality agent review, full-document coherence review, DALL-E 3 editorial illustrations per section, citations in your chosen style, refined title with alternatives, meta description, and social media excerpt.',
              },
              {
                q: 'What citation styles are supported?',
                a: 'APA, MLA, and Chicago. Inline markers are inserted automatically and a complete reference list is appended.',
              },
              {
                q: 'How do Research Feeds work?',
                a: 'Subscribe to any research topic and DraftEngine surfaces new papers from Semantic Scholar, OpenAlex, and CrossRef. Choose daily or weekly delivery and import directly into your library. Available on Plus and Pro.',
              },
              {
                q: 'What\'s the difference between Plus and Pro?',
                a: 'Plus ($9.99) gives unlimited sources and the Outline Generator. Generation is full pay-per-page. Pro ($19.99) adds 10 included pages monthly ($14.90 value), discounted overage rates, and Research Feeds. Pro pays for itself if you publish even one document a month.',
              },
              {
                q: 'Can I change plans anytime?',
                a: 'Yes. Upgrades take effect immediately. Downgrades take effect at the next billing cycle. Billing is prorated.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'All major credit cards and PayPal, processed securely through Stripe.',
              },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base font-medium text-secondary-900 group-hover:text-primary transition-colors">{item.q}</span>
                  <span className="ml-4 flex-shrink-0 w-5 h-5 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-500 group-open:rotate-45 transition-transform">
                    <span className="text-sm leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-secondary-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto rounded-xl bg-secondary-900 text-white px-8 py-12 lg:py-14 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Ready to publish?
          </h2>
          <p className="mt-3 text-secondary-300 max-w-xl mx-auto">
            Start free with 5 source entries. Generate documents on any plan.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!currentUser ? (
              <>
                <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors">
                  Start free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 text-secondary-300 hover:text-white rounded-md font-medium text-sm transition-colors">
                  Sign in
                </Link>
              </>
            ) : (
              <Link to="/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors">
                Create your first entry
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

// src/pages/PricingPage.js
//
// Re-architected for pricing-page conversion. Structure:
//   1. Hero with anchor — "Less than a freelance hour" so visitors land
//      with the right reference price already framed
//   2. Plan cards (Starter / Plus / Pro) with per-page rates VISIBLE
//      inside Plus and Pro (no need to scroll to find generation cost)
//   3. Cost estimator — promoted from middle of the page to right
//      next to the cards so visitors can test the math while deciding
//   4. "What does this replace?" comparison (freelancer / agency /
//      generic AI / DraftEngine). Anchors price psychologically.
//   5. Feature comparison table — scannable decision aid for visitors
//      who want to verify what each plan actually includes
//   6. FAQ
//   7. Final CTA
//
// Notes for future edits:
//   - Real numbers only. Never re-add fabricated review counts or
//     user totals (see index.html and HomePage.js for the rationale).
//   - Pro's value math: $19.99 - $9.99 = $10 upcharge. 10 included
//     Standard pages = $14.90 value. So Pro PAYS YOU $4.90/mo if you
//     generate >= 10 pages. That story must stay visible in the Pro
//     card and the alternatives section.
//   - We use OpenAlex + CrossRef in Research Feeds (not Semantic
//     Scholar — that integration was deprecated). Keep FAQ accurate.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';
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
  const perPageRate = estimatorTier === 'standard' ? 1.49 : 2.49;
  const estimatedCost = estimatorPages * perPageRate;
  // Pro includes 10 pages at the Standard rate, so net cost on Pro
  // factoring the included pages:
  const includedValue = 10 * 1.49;
  const proOverageRate = estimatorTier === 'standard' ? 1.0 : 2.0; // discounted overage
  const proPagesOver = Math.max(0, estimatorPages - 10);
  const proGenerationCost = proPagesOver * proOverageRate;
  const proTotalIfPro = 19.99 + proGenerationCost;
  const plusTotalIfPlus = 9.99 + estimatedCost;

  const planNameMap = {
    free: 'Starter',
    trial: 'Starter',
    student: 'Plus',
    researcher: 'Pro',
  };

  const isAcademicUser = (() => {
    const role = userDocument?.onboardingRole;
    const purposes =
      userDocument?.onboardingPurposes ||
      (userDocument?.onboardingPurpose ? [userDocument.onboardingPurpose] : []);
    const academicPurposes = [
      'research-summaries',
      'academic-papers',
      'bibliographies',
    ];
    return (
      ['researcher', 'student'].includes(role) ||
      purposes.some((p) => academicPurposes.includes(p))
    );
  })();

  const planCards = [
    {
      planId: 'free',
      name: 'Starter',
      price: '$0',
      period: 'forever',
      tagline: 'Try the full workflow.',
      perPageNote: 'Per-page generation available at $1.49 / $2.49',
      features: [
        '5 lifetime source entries',
        'AI source analysis with page-numbered quotes',
        'All four import methods (PDF, URL, DOI, RSS)',
        'Word & PDF export',
      ],
      cta: 'Get started',
      ctaSecondary: 'No credit card required',
    },
    {
      planId: 'student',
      name: 'Plus',
      price: '$9.99',
      period: 'per month',
      tagline: 'For regular writing.',
      perPageNote: 'Per-page generation: $1.49 / $2.49',
      features: [
        'Unlimited source entries',
        'Topic & outline generator',
        'Five voice profiles, 17 document types',
        'APA, MLA, and Chicago citation styles',
      ],
      cta: 'Start Plus',
      ctaSecondary: 'Cancel anytime',
    },
    {
      planId: 'researcher',
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      tagline: 'For people who publish weekly.',
      perPageNote: '10 pages included ($14.90 value) + discounted overage',
      features: [
        'Everything in Plus',
        '10 included generation pages / month',
        'Discounted overage: $1.00 (Standard) / $2.00 (Pro)',
        'Research Feeds — auto-import new papers',
      ],
      cta: 'Start Pro',
      ctaSecondary: 'Cancel anytime',
      featured: true,
      valueNote: 'Pays for itself with one 10-page generation.',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Pricing"
        description="Start free with 5 sources. Plus is $9.99/mo for unlimited sources. Pro is $19.99/mo with 10 included generation pages and Research Feeds. Pay-per-page on every plan. No contracts."
        path="/pricing"
      />

      {/* ─────────────────── 1. Hero with anchor ─────────────────── */}
      <section className="border-b border-secondary-200 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-5xl mx-auto px-6 py-16 lg:py-20 text-center">
          <FadeIn direction="up">
            <div className="eyebrow mb-4">Pricing</div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-secondary-900 tracking-tight">
              Less than a freelance hour.{' '}
              <span className="text-primary">More than a freelance month.</span>
            </h1>
            <p className="mt-5 text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              A 10-page white paper costs{' '}
              <span className="font-mono font-medium text-secondary-900">
                $14.90
              </span>{' '}
              with DraftEngine. The same document from a freelancer runs{' '}
              <span className="line-through text-secondary-400">$2,000+</span>.
              Start free. No contracts.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        {/* Academic recommendation banner — personalized for academic users */}
        {currentUser && isAcademicUser && (
          <FadeIn direction="up">
            <div className="max-w-5xl mx-auto mb-8 rounded-lg border border-primary-200 bg-primary-50/50 p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-secondary-900 mb-0.5">
                  Recommended for academic writers
                </p>
                <p className="text-secondary-600">
                  <span className="font-medium text-secondary-900">Plus</span>{' '}
                  covers most academic workflows: unlimited sources, all import
                  methods, and the topic & outline generator.
                </p>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ─────────────────── 2. Plan cards ─────────────────── */}
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
          {planCards.map((card) => {
            const isCurrent = isCurrentPlan(card.planId);
            const isLoadingThis = isLoading === card.planId;
            return (
              <div
                key={card.planId}
                className={`relative bg-white rounded-xl border p-7 flex flex-col ${
                  card.featured
                    ? 'border-secondary-900 shadow-medium'
                    : 'border-secondary-200'
                }`}
              >
                {card.featured && (
                  <div className="absolute -top-2.5 left-7">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-md bg-primary text-white">
                      <Sparkles className="w-3 h-3" /> Best value
                    </span>
                  </div>
                )}

                <h3 className="text-base font-semibold text-secondary-900 mb-1">
                  {card.name}
                </h3>
                <p className="text-sm text-secondary-600 mb-5">{card.tagline}</p>

                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                    {card.price}
                  </span>
                  <span className="text-sm text-secondary-500 ml-1.5">
                    / {card.period}
                  </span>
                </div>

                {/* Per-page hint inside each card — answers "what's generation cost?" */}
                <p
                  className={`text-xs mb-5 leading-relaxed ${
                    card.featured ? 'text-primary font-medium' : 'text-secondary-500'
                  }`}
                >
                  {card.perPageNote}
                </p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {card.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-secondary-700"
                    >
                      <Check
                        className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0"
                        strokeWidth={2.5}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {card.valueNote && (
                  <p className="text-xs text-primary font-medium mb-4 leading-relaxed">
                    💡 {card.valueNote}
                  </p>
                )}

                <button
                  onClick={() => handleSubscribe(card.planId)}
                  disabled={isLoadingThis || isCurrent}
                  className={`${
                    card.featured ? 'btn btn-primary w-full' : 'btn btn-secondary w-full'
                  } ${isCurrent ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isLoadingThis ? (
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
                  {card.ctaSecondary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Current plan banner */}
        {currentUser && userDocument?.subscription && (
          <FadeIn direction="up">
            <div className="max-w-5xl mx-auto mb-12 rounded-lg border border-secondary-200 bg-secondary-50/50 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-secondary-500 font-medium mb-1">
                    Current plan
                  </p>
                  <p className="text-base font-semibold text-secondary-900">
                    {planNameMap[userDocument.subscription.plan] ||
                      userDocument.subscription.plan}
                  </p>
                </div>
                {userDocument.subscription.plan === 'free' ||
                userDocument.subscription.plan === 'trial' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-40 bg-secondary-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 transition-all"
                        style={{
                          width: `${Math.min(
                            ((userDocument.subscription.entriesUsed || 0) /
                              (userDocument.subscription.entriesLimit || 5)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-900 tabular-nums">
                      {userDocument.subscription.entriesUsed || 0} /{' '}
                      {userDocument.subscription.entriesLimit || 5}
                    </span>
                  </div>
                ) : (
                  <span className="badge badge-brand">Unlimited sources</span>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ─────────────────── 3. Cost estimator (promoted) ─────────────────── */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="mb-6">
            <div className="eyebrow-brand mb-3">
              <Zap className="w-3 h-3" /> Cost estimator
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight">
              Test your real per-document cost.
            </h2>
            <p className="mt-2 text-secondary-600">
              See exactly what generation will cost you on Plus vs Pro before
              you decide.
            </p>
          </div>

          <div className="rounded-xl border border-secondary-200 bg-white p-6 lg:p-8">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Pages slider */}
              <div className="lg:col-span-1">
                <label className="form-label">Pages per document</label>
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
                  <span className="font-medium text-secondary-900">
                    {estimatorPages} pages ·{' '}
                    {(estimatorPages * 250).toLocaleString()} words
                  </span>
                  <span>40</span>
                </div>
              </div>

              {/* Tier */}
              <div className="lg:col-span-1">
                <label className="form-label">Generation tier</label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'standard',
                      label: 'Standard',
                      sub: '$1.49 / page · Claude Sonnet',
                    },
                    {
                      id: 'pro',
                      label: 'Professional',
                      sub: '$2.49 / page · Claude Opus',
                    },
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
                          <p className="text-sm font-medium text-secondary-900">
                            {t.label}
                          </p>
                          <p className="text-xs text-secondary-500">{t.sub}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            estimatorTier === t.id
                              ? 'bg-secondary-900 border-secondary-900'
                              : 'border-secondary-300'
                          }`}
                        >
                          {estimatorTier === t.id && (
                            <Check
                              className="w-2.5 h-2.5 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost breakdown — shows Plus vs Pro side-by-side */}
              <div className="lg:col-span-1">
                <label className="form-label">Monthly total</label>
                <div className="space-y-2">
                  {/* Plus row */}
                  <div className="rounded-md border border-secondary-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase tracking-wider text-secondary-500 font-medium">
                        On Plus
                      </span>
                      <span className="text-xs text-secondary-500 tabular-nums">
                        $9.99 + ${estimatedCost.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                      ${plusTotalIfPlus.toFixed(2)}
                      <span className="text-xs text-secondary-500 font-normal ml-1">
                        / mo
                      </span>
                    </p>
                  </div>
                  {/* Pro row — highlighted if cheaper */}
                  <div
                    className={`rounded-md border p-4 transition-colors ${
                      proTotalIfPro <= plusTotalIfPlus
                        ? 'border-primary bg-primary/[0.04]'
                        : 'border-secondary-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                        On Pro
                      </span>
                      <span className="text-xs text-secondary-500 tabular-nums">
                        $19.99 + ${proGenerationCost.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-2xl font-semibold text-secondary-900 tabular-nums tracking-tight">
                      ${proTotalIfPro.toFixed(2)}
                      <span className="text-xs text-secondary-500 font-normal ml-1">
                        / mo
                      </span>
                    </p>
                    {proTotalIfPro <= plusTotalIfPlus && (
                      <p className="text-xs text-primary font-medium mt-1">
                        Save ${(plusTotalIfPlus - proTotalIfPro).toFixed(2)} on
                        Pro
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-secondary-500 mt-3 leading-relaxed">
                  Pro includes 10 pages monthly (~${includedValue.toFixed(2)}{' '}
                  value) + cheaper overage at $
                  {proOverageRate.toFixed(2)} / page.
                </p>
              </div>
            </div>
            <p className="text-xs text-secondary-500 mt-6 pt-6 border-t border-secondary-200 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success-500" />
              100% refund if generation fails. You're never charged for a broken job.
            </p>
          </div>
        </div>

        {/* ─────────────────── 4. What this replaces ─────────────────── */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="mb-6">
            <div className="eyebrow mb-3">Anchor check</div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight">
              What you'd otherwise pay for the same document.
            </h2>
            <p className="mt-2 text-secondary-600">
              Real-world cost for a 10-page research-backed white paper.
            </p>
          </div>

          <div className="rounded-xl border border-secondary-200 bg-white overflow-hidden">
            {[
              {
                label: 'Freelance writer (Upwork avg.)',
                price: '$2,000 – $4,000',
                detail: '1–2 week turnaround. You source the research.',
                tone: 'normal',
              },
              {
                label: 'Content agency',
                price: '$8,000 – $15,000',
                detail: '3–6 week turnaround. Strategy + writing.',
                tone: 'normal',
              },
              {
                label: 'Generic AI tool (ChatGPT Plus)',
                price: '$20 / month',
                detail: 'Hallucinated citations. No traceability. Generic voice.',
                tone: 'warn',
              },
              {
                label: 'DraftEngine Plus',
                price: '$24.89',
                detail:
                  '$9.99 subscription + $14.90 generation. Real citations from your sources.',
                tone: 'good',
                featured: true,
              },
              {
                label: 'DraftEngine Pro',
                price: '$19.99',
                detail:
                  'Subscription only — generation is included. Plus Research Feeds.',
                tone: 'good',
              },
            ].map((row, idx) => (
              <div
                key={row.label}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-5 ${
                  idx !== 0 ? 'border-t border-secondary-200' : ''
                } ${row.featured ? 'bg-primary/[0.03]' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      row.tone === 'good'
                        ? 'text-secondary-900'
                        : row.tone === 'warn'
                        ? 'text-secondary-700'
                        : 'text-secondary-900'
                    }`}
                  >
                    {row.label}
                    {row.featured && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-semibold">
                        <Sparkles className="w-2.5 h-2.5" /> Same outcome
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    {row.detail}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <p
                    className={`text-lg font-semibold tabular-nums tracking-tight ${
                      row.tone === 'good'
                        ? 'text-primary'
                        : row.tone === 'warn'
                        ? 'text-secondary-500 line-through'
                        : 'text-secondary-400 line-through'
                    }`}
                  >
                    {row.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────── 5. Feature comparison table ─────────────────── */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="mb-6">
            <div className="eyebrow mb-3">Compare plans</div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight">
              Everything, side by side.
            </h2>
          </div>

          <div className="rounded-xl border border-secondary-200 bg-white overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-5 py-4 font-medium text-secondary-500 text-xs uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="text-center px-5 py-4 font-medium text-secondary-900">
                    Starter
                  </th>
                  <th className="text-center px-5 py-4 font-medium text-secondary-900">
                    Plus
                  </th>
                  <th className="text-center px-5 py-4 font-medium text-primary bg-primary/[0.04]">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {[
                  ['Source entries', '5 lifetime', 'Unlimited', 'Unlimited'],
                  ['Import methods (PDF, URL, DOI, RSS)', true, true, true],
                  ['AI source analysis (arguments, quotes, angles)', true, true, true],
                  ['Page-numbered quote extraction', true, true, true],
                  ['Topic generator', false, true, true],
                  ['Outline generator', false, true, true],
                  ['Voice profiles (5 voices)', false, true, true],
                  ['Document types (17 supported)', false, true, true],
                  ['Citation styles (APA, MLA, Chicago)', true, true, true],
                  ['Pay-per-page generation', '$1.49 / $2.49', '$1.49 / $2.49', '$1.00 / $2.00'],
                  ['Included pages / month', '—', '—', '10 ($14.90 value)'],
                  ['Research Feeds (OpenAlex + CrossRef)', false, false, true],
                  ['Word + PDF + text export', true, true, true],
                  ['Email support', true, true, 'Priority'],
                  ['100% refund on generation failures', true, true, true],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-secondary-50/30 transition-colors">
                    <td className="px-5 py-3.5 text-secondary-700">{row[0]}</td>
                    {[1, 2, 3].map((col) => {
                      const val = row[col];
                      const isPro = col === 3;
                      return (
                        <td
                          key={col}
                          className={`px-5 py-3.5 text-center ${
                            isPro ? 'bg-primary/[0.03]' : ''
                          }`}
                        >
                          {val === true ? (
                            <Check
                              className={`w-4 h-4 inline-block ${
                                isPro ? 'text-primary' : 'text-secondary-700'
                              }`}
                              strokeWidth={2.5}
                            />
                          ) : val === false ? (
                            <X className="w-4 h-4 inline-block text-secondary-300" strokeWidth={2} />
                          ) : (
                            <span
                              className={`text-xs font-medium ${
                                isPro ? 'text-primary' : 'text-secondary-700'
                              }`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-secondary-200 bg-secondary-50/50">
                  <td className="px-5 py-4"></td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleSubscribe('free')}
                      className="text-xs font-medium text-secondary-700 hover:text-secondary-900 inline-flex items-center gap-1"
                    >
                      Start free <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleSubscribe('student')}
                      className="text-xs font-medium text-secondary-700 hover:text-secondary-900 inline-flex items-center gap-1"
                    >
                      Start Plus <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center bg-primary/[0.04]">
                    <button
                      onClick={() => handleSubscribe('researcher')}
                      className="text-xs font-semibold text-primary hover:text-primary-700 inline-flex items-center gap-1"
                    >
                      Start Pro <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ─────────────────── 6. FAQ ─────────────────── */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-8 text-center">
            Frequently asked questions
          </h2>

          <div className="divide-y divide-secondary-200 border-y border-secondary-200">
            {[
              {
                q: 'Can free users generate documents?',
                a: 'Yes. Document generation is pay-per-use on every plan, including Starter. You pick Standard ($1.49 / page) or Professional ($2.49 / page) each time you generate.',
              },
              {
                q: 'Where do the citations come from?',
                a: "Only from the sources you uploaded. DraftEngine never invents references. Every citation traces back to a PDF in your library, and quoted passages include page numbers when the source provides them.",
              },
              {
                q: "What's actually included with each generation?",
                a: 'Per-section quality review, full-document coherence review, voice routing for the document type you chose, citations in your chosen style, refined title alternatives, meta description, and social-media excerpt. Optional AI illustrations are available as an add-on.',
              },
              {
                q: 'What citation styles are supported?',
                a: 'APA, MLA, and Chicago. Inline markers are inserted automatically and a full reference list is appended at the end.',
              },
              {
                q: 'How do Research Feeds work?',
                a: 'Subscribe to any research topic and DraftEngine pulls new papers from OpenAlex and CrossRef as they publish. Pick daily or weekly delivery and import straight into your library. Available on Pro.',
              },
              {
                q: "What's the real difference between Plus and Pro?",
                a: 'Plus ($9.99) gives you unlimited sources, the topic & outline generator, and pay-per-page generation. Pro ($19.99) adds 10 included generation pages monthly ($14.90 value), discounted overage rates, and Research Feeds. If you generate more than 7–8 pages a month, Pro is cheaper than Plus.',
              },
              {
                q: 'What if a generation fails?',
                a: "You get a 100% automatic refund. If our watchdog can't finish your draft for any reason, you're never charged. Your Stripe receipt and the refund happen in the same minute.",
              },
              {
                q: 'Can I change plans anytime?',
                a: 'Yes. Upgrades take effect immediately. Downgrades take effect at the next billing cycle. Billing is prorated automatically.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'All major credit cards, processed securely through Stripe.',
              },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-base font-medium text-secondary-900 group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                  <span className="ml-4 flex-shrink-0 w-5 h-5 rounded-full border border-secondary-300 flex items-center justify-center text-secondary-500 group-open:rotate-45 transition-transform">
                    <span className="text-sm leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-secondary-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* ─────────────────── 7. Final CTA ─────────────────── */}
        <div className="max-w-4xl mx-auto rounded-xl bg-secondary-900 text-white px-8 py-12 lg:py-14 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 bg-dot-grid opacity-[0.06] pointer-events-none"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              Five sources free. No card.
            </h2>
            <p className="mt-3 text-secondary-300 max-w-xl mx-auto">
              Try the full workflow on your own research. Upgrade when you ship
              your first draft.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              {!currentUser ? (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors"
                  >
                    Start free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-secondary-300 hover:text-white rounded-md font-medium text-sm transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-secondary-900 hover:bg-secondary-100 rounded-md font-medium text-sm transition-colors"
                >
                  Import your first source
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

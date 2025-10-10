// src/pages/PricingPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Building, Users, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS, createCheckoutSession } from '../services/stripe';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const [isLoading, setIsLoading] = useState(null);
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

  const PlanCard = ({ plan, planId, featured = false }) => {
    const isPopular = planId === 'researcher';
    const isCurrent = isCurrentPlan(planId);

    return (
      <div className={`relative card card-hover ${featured ? 'ring-2 ring-chestnut border-chestnut/30' : ''} ${isPopular ? 'md:scale-105' : ''}`}>
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-chestnut text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Most Popular</span>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {planId === 'free' && <Zap className="w-8 h-8 text-chestnut" />}
            {planId === 'student' && <Users className="w-8 h-8 text-chestnut" />}
            {planId === 'researcher' && <Crown className="w-8 h-8 text-chestnut" />}
            {planId === 'institution' && <Building className="w-8 h-8 text-chestnut" />}
          </div>
          
          <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">
            {plan.name}
          </h3>
          
          <div className="mb-4">
            <span className="text-4xl font-bold text-charcoal font-playfair">
              ${plan.price}
            </span>
            {plan.price > 0 && (
              <span className="text-charcoal/60 text-lg font-lato">
                /month
              </span>
            )}
          </div>

          {planId === 'free' ? (
            <p className="text-sm text-charcoal/70 font-lato">
              5 lifetime entries
            </p>
          ) : (
            <p className="text-sm text-charcoal/70 font-lato">
              Unlimited entries
            </p>
          )}
        </div>


        <button
          onClick={() => handleSubscribe(planId)}
          disabled={isLoading === planId || isCurrent}
          className={`btn w-full justify-center ${
            featured || isPopular
              ? 'btn-primary'
              : 'btn-outline'
          } ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading === planId ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isCurrent ? (
            'Current Plan'
          ) : planId === 'free' ? (
            'Get Started Free'
          ) : (
            <>
              Upgrade to {plan.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>

        {isCurrent && (
          <p className="text-center text-sm text-chestnut font-medium mt-2">
            ✓ Active subscription
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-6 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-charcoal font-playfair mb-6">
            Choose Your <span className="text-chestnut">Research Plan</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-charcoal/70 max-w-3xl mx-auto font-lato leading-relaxed">
            From individual researchers to large institutions, we have a plan that fits your bibliography generation needs.
          </p>
        </div>


        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <PlanCard plan={SUBSCRIPTION_PLANS.free} planId="free" />
          <PlanCard plan={SUBSCRIPTION_PLANS.student} planId="student" />
          <PlanCard plan={SUBSCRIPTION_PLANS.researcher} planId="researcher" featured={true} />
        </div>

        {/* Current Plan Status */}
        {currentUser && userDocument?.subscription && (
          <div className="card max-w-2xl mx-auto mb-16 bg-chestnut/5 border-chestnut/20">
            <div className="text-center">
              <h3 className="text-xl font-bold text-charcoal font-playfair mb-2">
                Your Current Plan
              </h3>
              <p className="text-charcoal/70 mb-4 font-lato">
                You're currently on the{' '}
                <span className="font-semibold text-chestnut capitalize">
                  {userDocument.subscription.plan}
                </span>{' '}
                plan
              </p>

              {/* Only show usage bar for Free/Trial users */}
              {(userDocument.subscription.plan === 'free' || userDocument.subscription.plan === 'trial') ? (
                <div className="bg-white/50 rounded-lg p-4 inline-block">
                  <p className="text-sm text-charcoal/70 mb-1">Lifetime usage</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-khaki/30 rounded-full h-2 min-w-[200px]">
                      <div
                        className="bg-chestnut h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (userDocument.subscription.entriesUsed / userDocument.subscription.entriesLimit) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {userDocument.subscription.entriesUsed} / {userDocument.subscription.entriesLimit}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 rounded-lg p-4 inline-block">
                  <p className="text-lg font-semibold text-chestnut">✓ Unlimited Bibliography Entries</p>
                  {userDocument.subscription.plan === 'researcher' && (
                    <p className="text-sm text-charcoal/70 mt-1">+ Topic & Outline Generator</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Generation Pricing */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-charcoal font-playfair text-center mb-4">
            AI Content Generation Pricing
          </h2>
          <p className="text-center text-charcoal/70 mb-8">
            Pay only for what you generate. No subscription required for paper generation.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard Tier */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-charcoal font-playfair">Standard</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  GPT-4o
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$1.49</span>
                <span className="text-charcoal/60">/page</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">High-quality generation for most use cases</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Fast generation (2-3 minutes for 10 pages)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All citation styles (APA, MLA, Chicago, Harvard)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Multiple document types</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Export to Word/PDF</span>
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="card ring-2 ring-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>PREMIUM</span>
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-charcoal font-playfair">Pro</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  GPT-4 Turbo
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-bold text-charcoal">$2.49</span>
                <span className="text-charcoal/60">/page</span>
              </div>
              <p className="text-sm text-charcoal/70 mb-6">Premium quality with priority processing</p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">Everything in Standard, plus:</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Superior writing quality & coherence</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Priority queue (2x faster)</span>
                </li>
                <li className="flex items-start space-x-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Better source integration</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-charcoal/60">
            <p>Example: A 10-page research paper costs $14.90 (Standard) or $24.90 (Pro)</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-charcoal font-playfair text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                Can I change plans at any time?
              </h3>
              <p className="text-charcoal/70 font-lato">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                What's the difference between Student and Researcher plans?
              </h3>
              <p className="text-charcoal/70 font-lato">
                <strong>Student Plan:</strong> Unlimited bibliography entries with all citation styles.<br />
                <strong>Researcher Plan:</strong> Everything in Student PLUS Topic & Outline Generator, which analyzes your sources to suggest research topics and generate complete paper outlines.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                How does content generation pricing work?
              </h3>
              <p className="text-charcoal/70 font-lato">
                Content generation (AI paper writing) is pay-per-use. You only pay for papers you generate, based on length. Choose Standard ($1.49/page) or Pro ($2.49/page) tier. This is separate from bibliography subscriptions.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                Is there a student discount?
              </h3>
              <p className="text-charcoal/70 font-lato">
                Our Student plan is specifically designed for individual students and researchers at an affordable price. For additional institutional discounts, contact our sales team.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-charcoal/70 font-lato">
                We accept all major credit cards, PayPal, and bank transfers for institutional plans. All payments are processed securely through Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="card max-w-4xl mx-auto text-center bg-gradient-chestnut text-white">
          <h2 className="text-3xl lg:text-4xl font-bold font-playfair mb-4">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-white/90 mb-8 font-lato">
            Join thousands of researchers who save hours every week with ScholarlyAI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {!currentUser ? (
              <>
                <Link 
                  to="/signup" 
                  className="bg-white text-chestnut hover:bg-bone transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Start Free Trial
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-white text-white hover:bg-white hover:text-chestnut transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link 
                to="/create" 
                className="bg-white text-chestnut hover:bg-bone transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Create Your First Entry
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
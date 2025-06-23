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
              5 lifetime uses
            </p>
          ) : planId === 'student' ? (
            <p className="text-sm text-charcoal/70 font-lato">
              20 per month
            </p>
          ) : (
            <p className="text-sm text-charcoal/70 font-lato">
              50 per month
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
              <div className="bg-white/50 rounded-lg p-4 inline-block">
                <p className="text-sm text-charcoal/70 mb-1">Usage this month</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-khaki/30 rounded-full h-2">
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
                    {userDocument.subscription.entriesUsed} / {
                      userDocument.subscription.entriesLimit === -1 
                        ? '∞' 
                        : userDocument.subscription.entriesLimit
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
                What happens if I exceed my entry limit?
              </h3>
              <p className="text-charcoal/70 font-lato">
                You'll be prompted to upgrade your plan. Don't worry - your work is saved and you can continue once you upgrade.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                Is there a student discount?
              </h3>
              <p className="text-charcoal/70 font-lato">
                Our Student plan is specifically designed for individual students and researchers. For additional institutional discounts, contact our sales team.
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
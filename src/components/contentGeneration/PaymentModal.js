// src/components/contentGeneration/PaymentModal.js
/**
 * Payment Modal Component
 *
 * Displays Stripe Elements payment form for content generation payment.
 *
 * FLOW:
 * 1. Parent passes client_secret from backend
 * 2. Stripe Elements loads payment form
 * 3. User enters card details
 * 4. Stripe processes payment
 * 5. Calls onSuccess with payment_intent_id
 *
 * SECURITY:
 * - Stripe Elements handles all card data (never touches our code)
 * - Card data goes directly to Stripe (PCI compliant)
 * - We only receive payment_intent_id after success
 */

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Lock, CreditCard, X, AlertCircle } from 'lucide-react';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/**
 * PaymentForm Component
 *
 * Inner form component that uses Stripe hooks.
 * Must be wrapped in <Elements> provider.
 */
const PaymentForm = ({ onSuccess, onError, totalCost, tier, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Fallback for redirect-based payments
        },
        redirect: 'if_required' // Handle in-page when possible
      });

      if (error) {
        // Payment failed
        setErrorMessage(error.message);
        onError(error.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded!
        onSuccess(paymentIntent.id);
        // Don't set loading false - parent will handle transition
      } else {
        // Unknown state
        setErrorMessage('Payment status unclear. Please contact support.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage('Unexpected error occurred. Please try again.');
      onError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-br from-accent/5 to-khaki/10 rounded-xl p-6 border border-accent-600/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-secondary-700 font-lato">Total Amount:</span>
          <span className="text-3xl font-bold text-secondary-900 font-playfair">${totalCost}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary-600">Quality Tier:</span>
          <span className="font-medium text-secondary-900">
            {tier === 'pro' ? 'Professional (GPT-4 Turbo)' : 'Standard (GPT-4o)'}
          </span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                email: ''
              }
            }
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">Payment Failed</p>
            <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
          !stripe || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-brand text-white hover:shadow-lg'
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Pay ${totalCost} Securely</span>
          </>
        )}
      </button>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="w-full text-secondary-600 hover:text-secondary-900 text-sm transition-colors disabled:opacity-50"
      >
        Cancel Payment
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-xs text-secondary-500">
        <Lock className="w-3 h-3" />
        <span>Secured by Stripe • Your payment information is encrypted</span>
      </div>
    </form>
  );
};

/**
 * PaymentModal Component
 *
 * Main modal component that wraps payment form in Stripe Elements.
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Called when user cancels
 * @param {string} clientSecret - Stripe Payment Intent client_secret
 * @param {function} onSuccess - Called with payment_intent_id when payment succeeds
 * @param {function} onError - Called with error message if payment fails
 * @param {string} totalCost - Formatted price string (e.g., "14.90")
 * @param {string} tier - "standard" or "pro"
 */
const PaymentModal = ({
  isOpen,
  onClose,
  clientSecret,
  onSuccess,
  onError,
  totalCost,
  tier
}) => {
  if (!isOpen) return null;

  // Stripe Elements options
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#A44A3F', // chestnut
        colorBackground: '#ffffff',
        colorText: '#2A2A2A', // charcoal
        colorDanger: '#df1b41',
        fontFamily: 'Lato, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-50 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-secondary-50 border-b border-secondary-300/30 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 font-playfair">
                Complete Payment
              </h2>
              <p className="text-sm text-secondary-600 font-lato">
                To start content generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-600 hover:text-secondary-900 transition-colors p-2 hover:bg-secondary-200/20 rounded-lg"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                onSuccess={onSuccess}
                onError={onError}
                totalCost={totalCost}
                tier={tier}
                onCancel={onClose}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-accent-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-secondary-700">Loading payment form...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

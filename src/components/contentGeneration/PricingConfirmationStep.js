// src/components/contentGeneration/PricingConfirmationStep.js
import React, { useState } from 'react';
import { Check, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { contentGenerationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PricingConfirmationStep = ({
  selectedSources,
  outline,
  settings,
  selectedTier,
  setSelectedTier,
  onNext,
  onBack,
  setJobId
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const estimatedPages = Math.ceil(settings.target_words / 250);

  const tiers = [
    {
      id: 'standard',
      name: 'Standard',
      icon: Zap,
      pricePerPage: 1.49,
      model: 'GPT-4o',
      features: [
        'High-quality AI generation',
        'Proper citations & references',
        'APA, MLA, Chicago, Harvard styles',
        'Basic editing & revision',
        'Download as Word/PDF'
      ],
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Professional',
      icon: Sparkles,
      pricePerPage: 2.49,
      model: 'GPT-4 Turbo',
      features: [
        'Premium AI model (GPT-4 Turbo)',
        'Enhanced research depth',
        'Advanced citation validation',
        'Priority processing speed',
        'Unlimited revisions',
        'Priority support'
      ],
      color: 'purple',
      badge: 'RECOMMENDED'
    }
  ];

  const selectedTierData = tiers.find(t => t.id === selectedTier);
  const totalCost = (estimatedPages * selectedTierData.pricePerPage).toFixed(2);

  const handleConfirmAndPay = async () => {
    try {
      setLoading(true);

      // Create content generation job
      const response = await contentGenerationAPI.createJob(
        currentUser.uid,
        selectedSources.map(s => s.id),
        outline,
        settings,
        selectedTier
      );

      if (!response || !response.job_id) {
        throw new Error('Invalid response from server - no job ID received');
      }

      setJobId(response.job_id);
      toast.success('Job created! Starting generation...');
      onNext();
    } catch (error) {
      console.error('Error creating job:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create generation job';
      toast.error(errorMessage);
      // Don't advance to next step if there's an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
        Choose Your Quality Tier
      </h2>
      <p className="text-gray-600 mb-6">
        Select the AI model quality and features that best fit your needs.
      </p>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {tiers.map(tier => {
          const Icon = tier.icon;
          const isSelected = selectedTier === tier.id;
          const tierCost = (estimatedPages * tier.pricePerPage).toFixed(2);

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                isSelected
                  ? `border-${tier.color}-500 bg-${tier.color}-50 shadow-lg`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {tier.badge}
                </span>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${tier.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${tier.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-charcoal">{tier.name}</h3>
                    <p className="text-xs text-gray-600">{tier.model}</p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? `bg-${tier.color}-500 border-${tier.color}-500`
                    : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-charcoal">${tier.pricePerPage}</span>
                  <span className="text-gray-600">/page</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Your document: <span className="font-semibold">${tierCost}</span>
                </p>
              </div>

              <ul className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                    <Check className={`w-4 h-4 text-${tier.color}-600 mt-0.5 flex-shrink-0`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-lg text-charcoal mb-4">Order Summary</h3>

        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sources Selected</span>
            <span className="font-medium text-charcoal">{selectedSources.length} sources</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Document Type</span>
            <span className="font-medium text-charcoal capitalize">
              {settings.document_type.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Target Length</span>
            <span className="font-medium text-charcoal">
              {settings.target_words} words ({estimatedPages} pages)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Citation Style</span>
            <span className="font-medium text-charcoal">{settings.citation_style}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quality Tier</span>
            <span className="font-medium text-charcoal">{selectedTierData.name}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-charcoal">Total</span>
          <div className="text-right">
            <span className="font-bold text-2xl text-charcoal">${totalCost}</span>
            <p className="text-xs text-gray-600">Pay after generation</p>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-900 mb-1">Payment After Generation</p>
          <p className="text-xs text-yellow-700">
            You'll be charged <strong>${totalCost}</strong> only after your content is successfully generated.
            If generation fails, you won't be charged.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
        >
          ← Back
        </button>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray-600">Step 4 of 6</p>
          <button
            onClick={handleConfirmAndPay}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
            }`}
          >
            {loading ? 'Creating Job...' : `Start Generation - $${totalCost}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingConfirmationStep;

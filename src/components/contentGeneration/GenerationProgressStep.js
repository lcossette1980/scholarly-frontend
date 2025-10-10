// src/components/contentGeneration/GenerationProgressStep.js
import React, { useState, useEffect } from 'react';
import { Loader, CheckCircle, XCircle, FileText, Sparkles } from 'lucide-react';
import { contentGenerationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const GenerationProgressStep = ({ jobId, onComplete }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided. Please go back and try again.');
      return;
    }

    // Poll for status every 3 seconds
    const pollInterval = setInterval(async () => {
      try {
        const jobStatus = await contentGenerationAPI.getJobStatus(jobId);
        setStatus(jobStatus);

        // Check if completed or failed
        if (jobStatus.status === 'completed') {
          clearInterval(pollInterval);
          toast.success('Content generated successfully!');
          setTimeout(() => onComplete(), 1000);
        } else if (jobStatus.status === 'failed') {
          clearInterval(pollInterval);
          setError(jobStatus.error_message || 'Generation failed');
          toast.error('Content generation failed');
        }
      } catch (err) {
        console.error('Error polling status:', err);
        // Don't set error here, continue polling
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [jobId, onComplete]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-charcoal mb-2">Generation Failed</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const progress = status?.progress || 0;
  const currentSection = status?.current_section || 'Initializing...';
  const completedSections = status?.completed_sections || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4 text-center">
        Generating Your Content
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Please wait while our AI creates your document. This usually takes 3-5 minutes.
      </p>

      {/* Progress Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#3B82F6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{progress}%</p>
              <Sparkles className="w-4 h-4 text-blue-400 mx-auto mt-1 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Loader className="w-5 h-5 text-blue-600 animate-spin" />
          <div>
            <p className="text-sm font-medium text-blue-900">Currently Writing</p>
            <p className="text-sm text-blue-700">{currentSection}</p>
          </div>
        </div>
      </div>

      {/* Completed Sections */}
      {completedSections.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Completed Sections ({completedSections.length})</span>
          </h3>
          <div className="space-y-2">
            {completedSections.map((section, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{section}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fun Facts */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Did you know?</h3>
        <p className="text-sm text-gray-600">
          On average, it takes a student <strong>4-6 hours</strong> to write a 2,500-word research paper manually.
          With ScholarlyAI, you're getting it done in under 5 minutes! 🚀
        </p>
      </div>

      {/* Info */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Step 5 of 6 • Don't close this page
        </p>
      </div>
    </div>
  );
};

export default GenerationProgressStep;

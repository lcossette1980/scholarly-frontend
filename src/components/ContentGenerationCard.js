// src/components/ContentGenerationCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, ArrowRight, Zap } from 'lucide-react';

const ContentGenerationCard = ({ entries }) => {
  const navigate = useNavigate();

  // Don't show if user has no entries
  if (!entries || entries.length === 0) {
    return null;
  }

  const handleStart = () => {
    navigate('/content/generate');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 mb-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-secondary-900 font-playfair">
              New: AI Content Generator
            </h3>
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </span>
          </div>

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            Turn your annotated bibliographies into complete papers, articles, or blog posts.
            Our AI uses <strong>YOUR sources</strong> to generate well-cited, academic content in minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">Generate 5-10 page papers</p>
                <p className="text-xs text-gray-600">In under 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">APA, MLA, Chicago</p>
                <p className="text-xs text-gray-600">Proper citations included</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-800">From $1.49/page</p>
                <p className="text-xs text-gray-600">Pay only for what you use</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-md"
            >
              <span>Generate Content</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-600">
              You have {entries.length} {entries.length === 1 ? 'source' : 'sources'} ready to use
            </p>
          </div>
        </div>

        {/* Preview visualization */}
        <div className="hidden lg:block ml-6">
          <div className="bg-white rounded-lg shadow-md p-4 w-48 border border-blue-200">
            <div className="space-y-2">
              <div className="h-2 bg-blue-200 rounded w-full"></div>
              <div className="h-2 bg-blue-200 rounded w-5/6"></div>
              <div className="h-2 bg-blue-200 rounded w-4/6"></div>
              <div className="h-2 bg-blue-100 rounded w-full mt-3"></div>
              <div className="h-2 bg-blue-100 rounded w-5/6"></div>
              <div className="h-2 bg-blue-100 rounded w-3/6"></div>
            </div>
            <div className="mt-3 flex items-center justify-center space-x-1 text-xs text-gray-500">
              <FileText className="w-3 h-3" />
              <span>Generated Content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationCard;

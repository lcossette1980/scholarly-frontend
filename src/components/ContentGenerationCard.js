// src/components/ContentGenerationCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn } from './motion';

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
    <FadeIn direction="up">
      <div className="card border border-primary/20 bg-primary/5 p-6 mb-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-secondary-900 mb-2">
              AI Content Generator
            </h3>

            <p className="text-secondary-600 mb-4 text-sm leading-relaxed">
              Turn your source library into complete articles, essays, or blog posts.
              AI uses <strong>your sources</strong> to generate compelling, source-backed content in minutes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-secondary-800">5-10 page papers</p>
                <p className="text-xs text-secondary-500">In under 5 minutes</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary-800">Natural attribution</p>
                <p className="text-xs text-secondary-500">Sources woven naturally</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary-800">From $1.49/page</p>
                <p className="text-xs text-secondary-500">Pay only for what you use</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="btn btn-primary text-sm px-5 py-2"
              >
                <span>Generate Content</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
              <p className="text-xs text-secondary-500">
                {entries.length} {entries.length === 1 ? 'source' : 'sources'} ready
              </p>
            </div>
          </div>

          {/* Preview visualization */}
          <div className="hidden lg:block ml-6">
            <div className="bg-white rounded-lg shadow-sm p-4 w-44 border border-secondary-200">
              <div className="space-y-2">
                <div className="h-2 bg-secondary-200 rounded w-full"></div>
                <div className="h-2 bg-secondary-200 rounded w-5/6"></div>
                <div className="h-2 bg-secondary-200 rounded w-4/6"></div>
                <div className="h-2 bg-secondary-100 rounded w-full mt-3"></div>
                <div className="h-2 bg-secondary-100 rounded w-5/6"></div>
                <div className="h-2 bg-secondary-100 rounded w-3/6"></div>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-1 text-xs text-secondary-400">
                <FileText className="w-3 h-3" />
                <span>Generated Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default ContentGenerationCard;

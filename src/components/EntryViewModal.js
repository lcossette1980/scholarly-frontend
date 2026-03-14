// src/components/EntryViewModal.js
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EntryViewModal = ({ entry, onClose }) => {
  const getCitation = () => {
    if (!entry) return '';
    if (typeof entry.citation === 'string') {
      return entry.citation;
    } else if (typeof entry.citation === 'object') {
      return entry.citation.title || 'Untitled';
    }
    return 'No citation available';
  };

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-secondary-200"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-secondary-200">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-secondary-900 mb-1">
                  Source Summary Entry
                </h2>
                <p className="text-sm text-secondary-500">
                  {entry.researchFocus || entry.research_focus || 'Uncategorized'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors flex-shrink-0 text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Citation */}
              <Section title="Citation">
                <div className="bg-secondary-50 rounded-xl p-4 font-serif text-sm leading-relaxed text-secondary-800 border border-secondary-100">
                  {getCitation()}
                </div>
              </Section>

              {/* Narrative Overview */}
              {(entry.narrative_overview || entry.narrativeOverview) && (
                <Section title="Narrative Overview">
                  <p className="text-secondary-700 leading-relaxed">
                    {entry.narrative_overview || entry.narrativeOverview}
                  </p>
                </Section>
              )}

              {/* Research Components */}
              {entry.research_components && (
                <Section title="Research Components">
                  <div className="space-y-4">
                    {Object.entries(entry.research_components).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-semibold text-secondary-800 mb-1 capitalize text-sm">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-secondary-600 leading-relaxed text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Core Findings */}
              {(entry.core_findings || entry.coreFindingsSummary) && (
                <Section title="Core Findings">
                  <p className="text-secondary-700 leading-relaxed">
                    {entry.core_findings || entry.coreFindingsSummary}
                  </p>
                </Section>
              )}

              {/* Methodological Value */}
              {entry.methodological_value && (
                <Section title="Methodological Value">
                  <div className="space-y-4">
                    {Object.entries(entry.methodological_value).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-semibold text-secondary-800 mb-1 capitalize text-sm">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-secondary-600 leading-relaxed text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Key Quotes */}
              {entry.key_quotes && entry.key_quotes.length > 0 && (
                <Section title="Key Quotes">
                  <div className="space-y-3">
                    {entry.key_quotes.map((quote, index) => (
                      <div key={index} className="bg-secondary-50 border-l-2 border-accent p-4 rounded-r-xl">
                        <p className="text-secondary-700 italic text-sm mb-1">"{quote.quote || quote}"</p>
                        {quote.page && (
                          <p className="text-xs text-secondary-500">Page {quote.page}</p>
                        )}
                        {quote.relevance && (
                          <p className="text-xs text-secondary-500 mt-1">{quote.relevance}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-secondary-200 bg-secondary-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-500">
                  Created: {entry.createdAt ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </p>
                <button
                  onClick={onClose}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Section = ({ title, children }) => {
  return (
    <div>
      <h3 className="font-semibold text-sm text-secondary-900 mb-3 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
};

export default EntryViewModal;

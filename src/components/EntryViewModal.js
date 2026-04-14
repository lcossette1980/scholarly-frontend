// src/components/EntryViewModal.js
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EntryViewModal = ({ entry, onClose }) => {
  const getSourceInfo = () => {
    if (!entry) return '';
    // New format: source_info object with author, title, publication, year
    if (entry.source_info) {
      const { author, title, publication, year } = entry.source_info;
      const parts = [];
      if (author) parts.push(author);
      if (year) parts.push(`(${year})`);
      if (title) parts.push(`. ${title}`);
      if (publication) parts.push(`. ${publication}`);
      return parts.join('') || 'No source info available';
    }
    // Fallback to old citation field
    if (typeof entry.citation === 'string') {
      return entry.citation;
    } else if (typeof entry.citation === 'object') {
      return entry.citation.title || 'Untitled';
    }
    return 'No source info available';
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
                  Source Analysis
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
              {/* Source Info */}
              <Section title="Source Info">
                <div className="bg-secondary-50 rounded-xl p-4 font-serif text-sm leading-relaxed text-secondary-800 border border-secondary-100">
                  {getSourceInfo()}
                </div>
              </Section>

              {/* Key Arguments & Ideas */}
              {(entry.key_arguments || entry.narrative_overview || entry.narrativeOverview) && (
                <Section title="Key Arguments & Ideas">
                  <p className="text-secondary-700 leading-relaxed">
                    {entry.key_arguments || entry.narrative_overview || entry.narrativeOverview}
                  </p>
                </Section>
              )}

              {/* Interesting Angles */}
              {(entry.interesting_angles || entry.research_components || entry.narrative_overview) && (
                <Section title="Interesting Angles">
                  <p className="text-secondary-700 leading-relaxed">
                    {entry.interesting_angles || (typeof entry.research_components === 'string' ? entry.research_components : null) || entry.narrative_overview}
                  </p>
                </Section>
              )}

              {/* Perspective & Value */}
              {(entry.perspective_value || entry.methodological_value) && (
                <Section title="Perspective & Value">
                  <p className="text-secondary-700 leading-relaxed">
                    {entry.perspective_value || entry.methodological_value?.strengths || (typeof entry.methodological_value === 'string' ? entry.methodological_value : '')}
                  </p>
                </Section>
              )}

              {/* Notable Passages */}
              {((entry.notable_passages && entry.notable_passages.length > 0) || (entry.key_quotes && entry.key_quotes.length > 0)) && (
                <Section title="Notable Passages">
                  <div className="space-y-3">
                    {(entry.notable_passages || entry.key_quotes).map((passage, index) => (
                      <div key={index} className="bg-secondary-50 border-l-2 border-primary p-4 rounded-r-xl">
                        <p className="text-secondary-700 italic text-sm mb-1">"{passage.text || passage.quote || passage}"</p>
                        {passage.page && (
                          <p className="text-xs text-secondary-500">Page {passage.page}</p>
                        )}
                        {passage.relevance && (
                          <p className="text-xs text-secondary-500 mt-1">{passage.relevance}</p>
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

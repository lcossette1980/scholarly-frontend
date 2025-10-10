// src/components/EntryViewModal.js
import React from 'react';
import { X, Quote, BookOpen, Target, Lightbulb, FileText } from 'lucide-react';

const EntryViewModal = ({ entry, onClose }) => {
  if (!entry) return null;

  // Parse citation
  const getCitation = () => {
    if (typeof entry.citation === 'string') {
      return entry.citation;
    } else if (typeof entry.citation === 'object') {
      return entry.citation.title || 'Untitled';
    }
    return 'No citation available';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-2">
              Bibliography Entry
            </h2>
            <p className="text-sm text-gray-600">
              {entry.researchFocus || entry.research_focus || 'Uncategorized'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Citation */}
          <Section icon={FileText} title="Citation" color="blue">
            <div className="bg-gray-50 rounded-lg p-4 font-serif text-sm leading-relaxed">
              {getCitation()}
            </div>
          </Section>

          {/* Narrative Overview */}
          {(entry.narrative_overview || entry.narrativeOverview) && (
            <Section icon={BookOpen} title="Narrative Overview" color="green">
              <p className="text-gray-700 leading-relaxed">
                {entry.narrative_overview || entry.narrativeOverview}
              </p>
            </Section>
          )}

          {/* Research Components */}
          {entry.research_components && (
            <Section icon={Target} title="Research Components" color="purple">
              <div className="space-y-3">
                {Object.entries(entry.research_components).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-semibold text-gray-800 mb-1 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Core Findings */}
          {(entry.core_findings || entry.coreFindingsSummary) && (
            <Section icon={Lightbulb} title="Core Findings" color="yellow">
              <p className="text-gray-700 leading-relaxed">
                {entry.core_findings || entry.coreFindingsSummary}
              </p>
            </Section>
          )}

          {/* Methodological Value */}
          {entry.methodological_value && (
            <Section icon={Target} title="Methodological Value" color="indigo">
              <div className="space-y-3">
                {Object.entries(entry.methodological_value).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-semibold text-gray-800 mb-1 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Key Quotes */}
          {entry.key_quotes && entry.key_quotes.length > 0 && (
            <Section icon={Quote} title="Key Quotes" color="pink">
              <div className="space-y-4">
                {entry.key_quotes.map((quote, index) => (
                  <div key={index} className="bg-gray-50 border-l-4 border-pink-400 p-4 rounded-r-lg">
                    <p className="text-gray-700 italic mb-2">"{quote.quote || quote}"</p>
                    {quote.page && (
                      <p className="text-sm text-gray-600">Page {quote.page}</p>
                    )}
                    {quote.relevance && (
                      <p className="text-sm text-gray-600 mt-1">{quote.relevance}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Created: {entry.createdAt ? new Date(entry.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, color, children }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600'
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
        <h3 className="font-bold text-lg text-charcoal font-playfair">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default EntryViewModal;

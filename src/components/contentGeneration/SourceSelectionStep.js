// src/components/contentGeneration/SourceSelectionStep.js
import React, { useState } from 'react';
import { Check, BookOpen, Calendar, Search } from 'lucide-react';

const SourceSelectionStep = ({ entries, selectedSources, setSelectedSources, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSource = (entry) => {
    const isSelected = selectedSources.find(s => s.id === entry.id);
    if (isSelected) {
      setSelectedSources(selectedSources.filter(s => s.id !== entry.id));
    } else {
      setSelectedSources([...selectedSources, entry]);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
        Select Your Sources
      </h2>
      <p className="text-gray-600 mb-6">
        Choose the bibliography entries you want to use as sources for your content.
        Selected sources will be cited and referenced in the generated document.
      </p>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sources by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Selection summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-blue-900">
          {selectedSources.length} {selectedSources.length === 1 ? 'source' : 'sources'} selected
        </p>
        <p className="text-xs text-blue-700 mt-1">
          We recommend selecting 3-10 sources for best results
        </p>
      </div>

      {/* Sources list */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {filteredEntries.map(entry => {
          const isSelected = selectedSources.find(s => s.id === entry.id);
          return (
            <div
              key={entry.id}
              onClick={() => toggleSource(entry)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-all ${
                  isSelected
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal mb-1">
                    {entry.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {entry.authors || 'Unknown Author'}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{entry.year || 'N/A'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{entry.journal || entry.researchFocus || 'N/A'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Step 1 of 6
        </p>
        <button
          onClick={onNext}
          disabled={selectedSources.length === 0}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            selectedSources.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Outline
        </button>
      </div>
    </div>
  );
};

export default SourceSelectionStep;

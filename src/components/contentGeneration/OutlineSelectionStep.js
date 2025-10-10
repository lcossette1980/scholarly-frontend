// src/components/contentGeneration/OutlineSelectionStep.js
import React, { useState } from 'react';
import { Check, Edit3, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const OutlineSelectionStep = ({
  outlines,
  selectedOutline,
  setSelectedOutline,
  customOutline,
  setCustomOutline,
  onNext,
  onBack
}) => {
  const [expandedOutline, setExpandedOutline] = useState(null);
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSections, setCustomSections] = useState([
    { heading: 'Introduction', description: '', key_points: [] }
  ]);

  const selectOutline = (outline) => {
    setSelectedOutline(outline);
    setCustomOutline(null);
  };

  const toggleExpand = (outlineId) => {
    setExpandedOutline(expandedOutline === outlineId ? null : outlineId);
  };

  const addCustomSection = () => {
    setCustomSections([...customSections, { heading: '', description: '', key_points: [] }]);
  };

  const updateCustomSection = (index, field, value) => {
    const updated = [...customSections];
    updated[index][field] = value;
    setCustomSections(updated);
  };

  const removeCustomSection = (index) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const saveCustomOutline = () => {
    if (!customTitle.trim()) {
      return;
    }

    const outline = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      sections: customSections.filter(s => s.heading.trim())
    };

    setCustomOutline(outline);
    setSelectedOutline(null);
    setCreatingCustom(false);
  };

  const selectedItem = selectedOutline || customOutline;

  return (
    <div>
      <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
        Choose or Create an Outline
      </h2>
      <p className="text-gray-600 mb-6">
        Select one of the AI-generated outlines based on your sources, or create your own custom outline.
      </p>

      {/* Selection summary */}
      {selectedItem && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-green-900">
            Selected: {selectedItem.title}
          </p>
          <p className="text-xs text-green-700 mt-1">
            {selectedItem.sections.length} sections
          </p>
        </div>
      )}

      {!creatingCustom ? (
        <>
          {/* AI-Generated Outlines */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">AI-Generated Outlines</h3>
            {outlines.map(outline => {
              const isSelected = selectedOutline?.id === outline.id;
              const isExpanded = expandedOutline === outline.id;

              return (
                <div
                  key={outline.id}
                  className={`border rounded-lg transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => selectOutline(outline)}
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
                        <h4 className="font-semibold text-charcoal mb-1">{outline.title}</h4>
                        <p className="text-xs text-gray-500">{outline.sections.length} sections</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(outline.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        {outline.sections.map((section, idx) => (
                          <li key={idx}>{section.heading}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom Outline Option */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Edit3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-700 mb-2">Create Custom Outline</h4>
            <p className="text-sm text-gray-600 mb-4">
              Prefer to structure your content your own way? Create a custom outline from scratch.
            </p>
            <button
              onClick={() => setCreatingCustom(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Start Custom Outline
            </button>
          </div>
        </>
      ) : (
        /* Custom Outline Creator */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Outline Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g., The Impact of AI on Modern Education"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Sections</label>
              <button
                onClick={addCustomSection}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-3">
              {customSections.map((section, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <span className="text-sm font-medium text-gray-500 mt-2">#{idx + 1}</span>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateCustomSection(idx, 'heading', e.target.value)}
                        placeholder="Section heading"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={section.description}
                        onChange={(e) => updateCustomSection(idx, 'description', e.target.value)}
                        placeholder="Brief description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {customSections.length > 1 && (
                      <button
                        onClick={() => removeCustomSection(idx)}
                        className="text-red-500 hover:text-red-700 text-sm mt-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={saveCustomOutline}
              disabled={!customTitle.trim() || customSections.filter(s => s.heading.trim()).length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                customTitle.trim() && customSections.filter(s => s.heading.trim()).length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Custom Outline
            </button>
            <button
              onClick={() => setCreatingCustom(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray-600">Step 2 of 6</p>
          <button
            onClick={onNext}
            disabled={!selectedItem}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedItem
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutlineSelectionStep;

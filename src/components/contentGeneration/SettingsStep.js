// src/components/contentGeneration/SettingsStep.js
import React from 'react';
import { FileText, Target, Quote, Feather } from 'lucide-react';

const SettingsStep = ({ settings, setSettings, onNext, onBack }) => {
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const documentTypes = [
    { value: 'research_paper', label: 'Research Paper', icon: FileText },
    { value: 'essay', label: 'Essay', icon: Feather },
    { value: 'article', label: 'Article', icon: FileText },
    { value: 'blog_post', label: 'Blog Post', icon: Feather }
  ];

  const citationStyles = ['APA', 'MLA', 'Chicago', 'Harvard'];
  const tones = ['academic', 'professional', 'conversational', 'persuasive'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
        Configure Your Document
      </h2>
      <p className="text-gray-600 mb-8">
        Customize the style, length, and format of your generated content.
      </p>

      <div className="space-y-6">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Document Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {documentTypes.map(type => {
              const Icon = type.icon;
              const isSelected = settings.document_type === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => updateSetting('document_type', type.value)}
                  className={`p-4 border-2 rounded-lg transition-all text-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Word Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Target Word Count
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={settings.target_words}
              onChange={(e) => updateSetting('target_words', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-32 bg-gray-100 rounded-lg px-4 py-2 text-center">
              <span className="font-semibold text-secondary-900">{settings.target_words}</span>
              <span className="text-xs text-gray-600 block">words</span>
              <span className="text-xs text-gray-500">≈{Math.ceil(settings.target_words / 250)} pages</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>500 words (2 pages)</span>
            <span>10,000 words (40 pages)</span>
          </div>
        </div>

        {/* Citation Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Citation Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {citationStyles.map(style => {
              const isSelected = settings.citation_style === style;
              return (
                <button
                  key={style}
                  onClick={() => updateSetting('citation_style', style)}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <Quote className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{style}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Writing Tone
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tones.map(tone => {
              const isSelected = settings.tone === tone;
              return (
                <button
                  key={tone}
                  onClick={() => updateSetting('tone', tone)}
                  className={`p-3 border-2 rounded-lg transition-all capitalize ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{tone}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Options
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.include_abstract}
                onChange={(e) => updateSetting('include_abstract', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Include Abstract</span>
                <p className="text-xs text-gray-500">Add a summary at the beginning</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.include_conclusion}
                onChange={(e) => updateSetting('include_conclusion', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Include Conclusion</span>
                <p className="text-xs text-gray-500">Add a concluding section</p>
              </div>
            </label>
          </div>
        </div>

        {/* Estimated Output */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Estimated Output</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-medium">Pages</p>
              <p className="text-blue-900 text-lg font-bold">
                {Math.ceil(settings.target_words / 250)}
              </p>
            </div>
            <div>
              <p className="text-blue-700 font-medium">Generation Time</p>
              <p className="text-blue-900 text-lg font-bold">
                ≈{Math.ceil(settings.target_words / 500)} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray-600">Step 3 of 6</p>
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsStep;

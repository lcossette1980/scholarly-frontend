// src/components/contentGeneration/SettingsStep.js
import React from 'react';
import { FileText, Target, Compass, Feather, BookOpen, Users } from 'lucide-react';

const SettingsStep = ({ settings, setSettings, onNext, onBack }) => {
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const documentTypes = [
    { value: 'blog_post', label: 'Blog Post', icon: Feather },
    { value: 'article', label: 'Article', icon: FileText },
    { value: 'essay', label: 'Essay', icon: Feather },
    { value: 'op_ed', label: 'Op-Ed', icon: FileText },
    { value: 'white_paper', label: 'White Paper', icon: FileText },
    { value: 'market_brief', label: 'Market Brief', icon: FileText },
    { value: 'case_study', label: 'Case Study', icon: FileText },
    { value: 'competitive_analysis', label: 'Competitive Analysis', icon: FileText, description: 'Compare market players with evidence-backed positioning' },
    { value: 'executive_briefing', label: 'Executive Briefing', icon: FileText, description: 'Decision-ready intelligence for senior leadership' },
    { value: 'proposal_memo', label: 'Proposal Memo', icon: FileText, description: 'Research-backed case for a specific course of action' },
    { value: 'industry_brief', label: 'Industry Brief', icon: FileText, description: 'Sector-specific research distilled into actionable intelligence' }
  ];

  const approaches = [
    { value: 'emotional', label: 'Emotional', description: 'Heart, stories, human impact' },
    { value: 'logical', label: 'Logical', description: 'Evidence, data, structured reasoning' },
    { value: 'balanced', label: 'Balanced', description: 'Blend of both approaches' }
  ];
  const tones = [
    { value: 'executive', label: 'Executive', description: 'Authoritative, data-driven, boardroom-ready' },
    { value: 'analytical', label: 'Analytical', description: 'Precise, evidence-focused, methodical' },
    { value: 'authoritative', label: 'Authoritative', description: 'Confident, expert-level, commanding' },
    { value: 'persuasive', label: 'Persuasive', description: 'Evidence-backed argumentation, calls to action' },
    { value: 'professional', label: 'Professional', description: 'Clear, balanced, business-appropriate' },
    { value: 'conversational', label: 'Conversational', description: 'Accessible, engaging, approachable' },
    { value: 'concise', label: 'Concise', description: 'Tight, scannable, no-filler' }
  ];

  const targetAudiences = [
    { value: 'c_suite', label: 'C-Suite / Executives' },
    { value: 'board_investors', label: 'Board / Investors' },
    { value: 'industry_peers', label: 'Industry Peers' },
    { value: 'general_professional', label: 'General Professional' },
    { value: 'public', label: 'Public / General Audience' }
  ];

  const citationStyles = [
    { value: 'none', label: 'None', description: 'No formal citations. Sources referenced naturally in text.' },
    { value: 'apa', label: 'APA', description: 'Author-date style. Common in social sciences.' },
    { value: 'mla', label: 'MLA', description: 'Author-page style. Common in humanities.' },
    { value: 'chicago', label: 'Chicago', description: 'Numbered notes. Common in history and arts.' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-900 mb-4">
        Configure Your Document
      </h2>
      <p className="text-secondary-600 mb-6">
        Customize the style, length, and format of your generated content.
      </p>

      <div className="space-y-4">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
            Document Type
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {documentTypes.map(type => {
              const Icon = type.icon;
              const isSelected = settings.document_type === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => updateSetting('document_type', type.value)}
                  className={`p-2.5 border-2 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary-200 hover:border-primary/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-secondary-400'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-secondary-700'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Word Count */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
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
              className="flex-1 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="w-24 bg-secondary-50 rounded-xl px-3 py-2 text-center border border-secondary-100">
              <span className="font-semibold text-secondary-900">{settings.target_words}</span>
              <span className="text-xs text-secondary-500 block">words</span>
              <span className="text-xs text-secondary-400">≈{Math.ceil(settings.target_words / 250)} pages</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-secondary-400 mt-2">
            <span>500 words (2 pages)</span>
            <span>10,000 words (40 pages)</span>
          </div>
        </div>

        {/* Approach */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
            Approach
          </label>
          <div className="grid grid-cols-3 gap-2">
            {approaches.map(approach => {
              const isSelected = settings.approach === approach.value;
              return (
                <button
                  key={approach.value}
                  onClick={() => updateSetting('approach', approach.value)}
                  className={`p-3 border-2 rounded-xl transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary-200 hover:border-primary/40'
                  }`}
                >
                  <Compass className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-primary' : 'text-secondary-400'}`} />
                  <span className={`text-sm font-medium block ${isSelected ? 'text-primary' : 'text-secondary-700'}`}>
                    {approach.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
            Writing Tone
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tones.map(tone => {
              const isSelected = settings.tone === tone.value;
              return (
                <button
                  key={tone.value}
                  onClick={() => updateSetting('tone', tone.value)}
                  className={`p-3 border-2 rounded-xl transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary-200 hover:border-primary/40'
                  }`}
                >
                  <span className={`text-sm font-medium block ${isSelected ? 'text-primary' : 'text-secondary-700'}`}>
                    {tone.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
            <Users className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Target Audience
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {targetAudiences.map(audience => {
              const isSelected = (settings.target_audience || 'general_professional') === audience.value;
              return (
                <button
                  key={audience.value}
                  onClick={() => updateSetting('target_audience', audience.value)}
                  className={`p-2.5 border-2 rounded-xl transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary-200 hover:border-primary/40'
                  }`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-secondary-700'}`}>
                    {audience.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Citation Style */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
            <BookOpen className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Citation Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {citationStyles.map(style => {
              const isSelected = (settings.citation_style || 'none') === style.value;
              return (
                <button
                  key={style.value}
                  onClick={() => updateSetting('citation_style', style.value)}
                  className={`p-2.5 border-2 rounded-xl transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary-200 hover:border-primary/40'
                  }`}
                >
                  <span className={`text-sm font-medium block ${isSelected ? 'text-primary' : 'text-secondary-700'}`}>
                    {style.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-secondary-500 mb-2">
            Additional Options
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-xl hover:bg-secondary-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.include_hook}
                onChange={(e) => updateSetting('include_hook', e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-secondary-800">Include Opening Hook</span>
                <p className="text-xs text-secondary-500">Start with an engaging hook to draw readers in</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-xl hover:bg-secondary-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.include_conclusion}
                onChange={(e) => updateSetting('include_conclusion', e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-secondary-800">Include Conclusion</span>
                <p className="text-xs text-secondary-500">Add a concluding section</p>
              </div>
            </label>
          </div>
        </div>

        {/* Estimated Output */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h4 className="font-semibold text-secondary-900 mb-2 flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Estimated Output</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-secondary-600 font-medium">Pages</p>
              <p className="text-secondary-900 text-lg font-bold">
                {Math.ceil(settings.target_words / 250)}
              </p>
            </div>
            <div>
              <p className="text-secondary-600 font-medium">Generation Time</p>
              <p className="text-secondary-900 text-lg font-bold">
                ≈{Math.ceil(settings.target_words / 500)} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-secondary-200 mt-8">
        <button
          onClick={onBack}
          className="btn btn-outline"
        >
          ← Back
        </button>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-secondary-500">Step 3 of 6</p>
          <button
            onClick={onNext}
            className="btn btn-primary"
          >
            Continue to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsStep;

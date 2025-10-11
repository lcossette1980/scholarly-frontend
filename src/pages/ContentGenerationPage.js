// src/pages/ContentGenerationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserBibliographyEntries } from '../services/bibliography';
import { analysisAPI } from '../services/api';
import SourceSelectionStep from '../components/contentGeneration/SourceSelectionStep';
import OutlineSelectionStep from '../components/contentGeneration/OutlineSelectionStep';
import SettingsStep from '../components/contentGeneration/SettingsStep';
import PricingConfirmationStep from '../components/contentGeneration/PricingConfirmationStep';
import GenerationProgressStep from '../components/contentGeneration/GenerationProgressStep';
import ReviewEditStep from '../components/contentGeneration/ReviewEditStep';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

const ContentGenerationPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // User's bibliography entries
  const [entries, setEntries] = useState([]);

  // Step 1: Source Selection
  const [selectedSources, setSelectedSources] = useState([]);

  // Step 2: Outline Selection
  const [outlines, setOutlines] = useState([]);
  const [selectedOutline, setSelectedOutline] = useState(null);
  const [customOutline, setCustomOutline] = useState(null);

  // Step 3: Settings
  const [settings, setSettings] = useState({
    document_type: 'research_paper',
    target_words: 2500,
    citation_style: 'APA',
    tone: 'academic',
    include_abstract: true,
    include_conclusion: true
  });

  // Step 4: Pricing
  const [selectedTier, setSelectedTier] = useState('standard');

  // Step 5: Generation
  const [jobId, setJobId] = useState(null);

  // Load user's bibliography entries on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        const result = await getUserBibliographyEntries(currentUser.uid, 100);

        if (result.success) {
          // Transform entries to include parsed citation data
          const transformedEntries = result.entries.map(entry => {
            const citation = entry.citation || {};
            return {
              id: entry.id,
              title: typeof citation === 'string' ? citation : (citation.title || 'Untitled'),
              authors: typeof citation === 'string' ? '' : (citation.authors || 'Unknown Author'),
              year: typeof citation === 'string' ? '' : (citation.year || ''),
              journal: entry.researchFocus || '',
              researchFocus: entry.researchFocus || '',
              narrativeOverview: entry.narrative_overview || '',
              coreFindingsSummary: entry.core_findings || '',
              createdAt: entry.createdAt
            };
          });

          setEntries(transformedEntries);

          if (transformedEntries.length === 0) {
            toast.error('You need to create bibliography entries first');
            navigate('/create');
          }
        } else {
          throw new Error(result.error || 'Failed to load entries');
        }
      } catch (error) {
        console.error('Error loading entries:', error);
        toast.error('Failed to load your bibliography entries');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadEntries();
    }
  }, [currentUser, navigate]);

  // Generate outlines from selected sources
  const generateOutlines = async () => {
    if (selectedSources.length === 0) {
      toast.error('Please select at least one source');
      return false;
    }

    try {
      setLoading(true);
      const response = await analysisAPI.generateTopics(
        selectedSources.map(s => s.id),
        currentUser.uid,
        { outputType: settings.document_type, numTopics: 3 }
      );

      // Convert topics to outlines
      const generatedOutlines = response.topics.map(topic => ({
        id: `outline-${Date.now()}-${Math.random()}`,
        title: topic.title,
        sections: topic.suggested_structure.map((section, idx) => ({
          heading: section,
          description: '',
          key_points: []
        }))
      }));

      setOutlines(generatedOutlines);
      return true;
    } catch (error) {
      console.error('Error generating outlines:', error);
      toast.error('Failed to generate outlines');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Navigate between steps
  const nextStep = async () => {
    // Validation for each step
    if (currentStep === 1) {
      if (selectedSources.length === 0) {
        toast.error('Please select at least one source');
        return;
      }
      // Generate outlines when moving from step 1 to step 2
      const success = await generateOutlines();
      if (!success) return;
    }

    if (currentStep === 2) {
      if (!selectedOutline && !customOutline) {
        toast.error('Please select or create an outline');
        return;
      }
    }

    setCurrentStep(curr => Math.min(curr + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep(curr => Math.max(curr - 1, 1));
  };

  // Step progress
  const steps = [
    { number: 1, name: 'Sources', completed: currentStep > 1 },
    { number: 2, name: 'Outline', completed: currentStep > 2 },
    { number: 3, name: 'Settings', completed: currentStep > 3 },
    { number: 4, name: 'Pricing', completed: currentStep > 4 },
    { number: 5, name: 'Generate', completed: currentStep > 5 },
    { number: 6, name: 'Review', completed: false }
  ];

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-6">
          <LoadingSkeleton variant="form" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-4xl font-bold text-secondary-900 font-playfair mb-2">
            AI Content Generator
          </h1>
          <p className="text-secondary-700 font-lato">
            Generate well-cited academic content from your bibliography sources
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : currentStep === step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep === step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {currentStep === 1 && (
            <SourceSelectionStep
              entries={entries}
              selectedSources={selectedSources}
              setSelectedSources={setSelectedSources}
              onNext={nextStep}
              loading={loading}
            />
          )}

          {currentStep === 2 && (
            <OutlineSelectionStep
              outlines={outlines}
              selectedOutline={selectedOutline}
              setSelectedOutline={setSelectedOutline}
              customOutline={customOutline}
              setCustomOutline={setCustomOutline}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === 3 && (
            <SettingsStep
              settings={settings}
              setSettings={setSettings}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === 4 && (
            <PricingConfirmationStep
              selectedSources={selectedSources}
              outline={selectedOutline || customOutline}
              settings={settings}
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              onNext={nextStep}
              onBack={prevStep}
              setJobId={setJobId}
            />
          )}

          {currentStep === 5 && (
            <GenerationProgressStep
              jobId={jobId}
              onComplete={() => setCurrentStep(6)}
            />
          )}

          {currentStep === 6 && (
            <ReviewEditStep
              jobId={jobId}
              onBack={() => navigate('/dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationPage;

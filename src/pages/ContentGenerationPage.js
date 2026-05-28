// src/pages/ContentGenerationPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [outlines, setOutlines] = useState([]);
  const [selectedOutline, setSelectedOutline] = useState(null);
  const [customOutline, setCustomOutline] = useState(null);
  const [settings, setSettings] = useState({
    document_type: 'article',
    target_words: 2500,
    approach: 'balanced',
    tone: 'professional',
    target_audience: 'general_professional',
    include_hook: true,
    include_conclusion: true,
    generate_images: false,
    citation_style: 'none',
  });
  const [selectedTier, setSelectedTier] = useState('standard');
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        const result = await getUserBibliographyEntries(currentUser.uid, 100);
        if (result.success) {
          const transformedEntries = result.entries.map((entry) => {
            const citation = entry.citation || {};
            return {
              id: entry.id,
              title: typeof citation === 'string' ? citation : citation.title || 'Untitled',
              authors: typeof citation === 'string' ? '' : citation.authors || 'Unknown Author',
              year: typeof citation === 'string' ? '' : citation.year || '',
              journal: entry.researchFocus || '',
              researchFocus: entry.researchFocus || '',
              narrativeOverview: entry.narrative_overview || '',
              coreFindingsSummary: entry.core_findings || '',
              createdAt: entry.createdAt,
            };
          });
          setEntries(transformedEntries);
          if (transformedEntries.length === 0) {
            toast.error('You need to create source entries first');
            navigate('/create');
          }
        } else {
          throw new Error(result.error || 'Failed to load entries');
        }
      } catch (error) {
        console.error('Error loading entries:', error);
        toast.error('Failed to load your source entries');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) loadEntries();
  }, [currentUser, navigate]);

  const generateOutlines = async () => {
    if (selectedSources.length < 2) {
      toast.error('Please select at least 2 sources for topic generation');
      return false;
    }
    try {
      setLoading(true);
      const response = await analysisAPI.generateTopics(
        selectedSources.map((s) => s.id),
        currentUser.uid,
        { outputType: settings.document_type, numTopics: 3 }
      );
      // Topic suggestions now return structure as either string[] (legacy)
      // OR {heading, role, what_this_adds}[] (new). Normalize so the outline
      // selection step + content generator both see role / what_this_adds.
      const generatedOutlines = response.topics.map((topic) => ({
        id: `outline-${Date.now()}-${Math.random()}`,
        title: topic.title,
        central_tension: topic.central_tension || '',
        sections: (topic.suggested_structure || []).map((section) => {
          if (typeof section === 'string') {
            return { heading: section, description: '', key_points: [] };
          }
          return {
            heading: section.heading || '',
            description: section.what_this_adds || '',
            key_points: [],
            role: section.role || null,
            what_this_adds: section.what_this_adds || null,
          };
        }),
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

  const nextStep = async () => {
    if (currentStep === 1) {
      if (selectedSources.length === 0) {
        toast.error('Please select at least one source');
        return;
      }
      const success = await generateOutlines();
      if (!success) return;
    }
    if (currentStep === 2) {
      if (!selectedOutline && !customOutline) {
        toast.error('Please select or create an outline');
        return;
      }
    }
    setCurrentStep((curr) => Math.min(curr + 1, 6));
  };

  const prevStep = () => setCurrentStep((curr) => Math.max(curr - 1, 1));

  const steps = [
    { number: 1, name: 'Sources' },
    { number: 2, name: 'Outline' },
    { number: 3, name: 'Settings' },
    { number: 4, name: 'Pricing' },
    { number: 5, name: 'Generate' },
    { number: 6, name: 'Review' },
  ];

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50/40 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <LoadingSkeleton variant="form" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50/40 py-8">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-secondary-500 hover:text-secondary-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to dashboard
          </button>
          <h1 className="text-2xl lg:text-3xl font-semibold text-secondary-900 tracking-tight">
            Generate document
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            Turn your sources into a polished, citation-backed document.
          </p>
        </div>

        {/* Progress steps */}
        <div className="mb-6">
          <div className="rounded-lg border border-secondary-200 bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const isComplete = currentStep > step.number;
                const isActive = currentStep === step.number;
                return (
                  <React.Fragment key={step.number}>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors tabular-nums ${
                          isComplete
                            ? 'bg-primary text-white'
                            : isActive
                            ? 'bg-secondary-900 text-white'
                            : 'bg-secondary-100 text-secondary-500 border border-secondary-200'
                        }`}
                      >
                        {isComplete ? <Check className="w-3 h-3" strokeWidth={3} /> : step.number}
                      </div>
                      <span
                        className={`text-xs font-medium whitespace-nowrap hidden sm:inline ${
                          isActive ? 'text-secondary-900' : isComplete ? 'text-secondary-600' : 'text-secondary-400'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="flex-1 h-px mx-3 bg-secondary-200 relative overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-primary transition-all duration-300 ${
                            isComplete ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg border border-secondary-200 bg-white p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
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
                  loading={loading}
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationPage;

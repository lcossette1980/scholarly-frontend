// src/components/OnboardingModal.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  BookOpen,
  BarChart3,
  Briefcase,
  Search,
  Target,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

const purposeOptions = [
  { id: 'thought-leadership', label: 'Thought leadership & articles', icon: FileText },
  { id: 'white-papers', label: 'White papers & briefs', icon: BookOpen },
  { id: 'market-analysis', label: 'Market & competitive analysis', icon: BarChart3 },
  { id: 'client-deliverables', label: 'Client deliverables', icon: Briefcase },
  { id: 'research-summaries', label: 'Research summaries', icon: Search },
  { id: 'academic-papers', label: 'Academic papers & essays', icon: GraduationCap },
  { id: 'bibliographies', label: 'Bibliographies & literature reviews', icon: BookOpen },
];

const roleOptions = [
  { id: 'marketing', label: 'Marketing team', icon: Target },
  { id: 'consultant', label: 'Consultant / analyst', icon: Briefcase },
  { id: 'founder', label: 'Founder / operator', icon: Rocket },
  { id: 'researcher', label: 'Researcher / academic', icon: BookOpen },
  { id: 'student', label: 'Student', icon: GraduationCap },
];

const templateRecommendations = {
  'thought-leadership': ['Blog Post', 'Opinion Article', 'LinkedIn Thought Piece'],
  'white-papers': ['White Paper', 'Policy Brief', 'Technical Report'],
  'market-analysis': ['Market Report', 'Competitive Analysis', 'Industry Overview'],
  'client-deliverables': ['Client Report', 'Strategy Deck', 'Executive Summary'],
  'research-summaries': ['Literature Review', 'Research Summary', 'Annotated Bibliography'],
  'academic-papers': ['Academic Essay', 'Research Paper', 'Thesis Chapter'],
  'bibliographies': ['Annotated Bibliography', 'Bibliography', 'Literature Review'],
};

const OnboardingModal = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedPurposes, setSelectedPurposes] = useState([]); // now an array
  const [selectedRole, setSelectedRole] = useState(null);
  const [completing, setCompleting] = useState(false);

  const togglePurpose = (id) => {
    setSelectedPurposes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Just advance — do NOT set completing here, that's what gated the step 3 button
  const advanceToWelcome = () => {
    if (!selectedRole || selectedPurposes.length === 0) return;
    setStep(3);
  };

  const handleFinish = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      // Pass purposes as an ARRAY. First entry stays as the "primary" purpose
      // for backward-compatible reads. Full array is the canonical value.
      await onComplete(selectedRole, selectedPurposes);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Re-enable the button so the user can retry
      setCompleting(false);
    }
    // Note: do not setCompleting(false) on success — the modal unmounts after
    // onComplete (navigate to /create), so the state reset is irrelevant.
  };

  if (!isOpen) return null;

  // Recommended templates: union of all selected purposes' recommendations, deduped
  const recommended = Array.from(
    new Set(selectedPurposes.flatMap((p) => templateRecommendations[p] || []))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Progress bar (pinned top) */}
            <div className="h-1 bg-[#e5e7eb] flex-shrink-0">
              <motion.div
                className="h-full bg-[#316094]"
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 min-h-0">
              <AnimatePresence mode="wait">
                {/* Step 1: Purposes (multi-select) */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <p className="text-xs font-medium text-[#316094] uppercase tracking-wide mb-2">
                        Step 1 of 2
                      </p>
                      <h2 className="text-2xl font-bold text-secondary-900">
                        What are you creating?
                      </h2>
                      <p className="text-sm text-secondary-500 mt-1">
                        Pick as many as apply — we'll tailor your templates.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {purposeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedPurposes.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => togglePurpose(option.id)}
                            type="button"
                            className={`w-full flex items-center space-x-4 p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#316094] bg-[#316094]/5'
                                : 'border-[#e5e7eb] hover:border-[#316094]/40 bg-white'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-[#316094] text-white' : 'bg-[#f5f6f8] text-secondary-500'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`font-medium flex-1 ${
                                isSelected ? 'text-[#316094]' : 'text-secondary-700'
                              }`}
                            >
                              {option.label}
                            </span>
                            {/* Checkbox-style indicator (multi-select) */}
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? 'bg-[#316094] border-[#316094]'
                                  : 'border-secondary-300 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                      <p className="text-xs text-secondary-500">
                        {selectedPurposes.length === 0
                          ? 'Select at least one'
                          : `${selectedPurposes.length} selected`}
                      </p>
                      <button
                        onClick={() => setStep(2)}
                        disabled={selectedPurposes.length === 0}
                        type="button"
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                          selectedPurposes.length > 0
                            ? 'bg-[#316094] text-white hover:bg-[#2a5280]'
                            : 'bg-[#e5e7eb] text-secondary-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Role (single-select) */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <p className="text-xs font-medium text-[#316094] uppercase tracking-wide mb-2">
                        Step 2 of 2
                      </p>
                      <h2 className="text-2xl font-bold text-secondary-900">
                        What best describes you?
                      </h2>
                      <p className="text-sm text-secondary-500 mt-1">
                        Pick one — we'll personalize your suggestions.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {roleOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedRole === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => setSelectedRole(option.id)}
                            type="button"
                            className={`w-full flex items-center space-x-4 p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#316094] bg-[#316094]/5'
                                : 'border-[#e5e7eb] hover:border-[#316094]/40 bg-white'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-[#316094] text-white' : 'bg-[#f5f6f8] text-secondary-500'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`font-medium flex-1 ${
                                isSelected ? 'text-[#316094]' : 'text-secondary-700'
                              }`}
                            >
                              {option.label}
                            </span>
                            {/* Radio-style indicator (single-select) */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'border-[#316094]' : 'border-secondary-300'
                              }`}
                            >
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#316094]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex justify-between flex-wrap gap-3">
                      <button
                        onClick={() => setStep(1)}
                        type="button"
                        className="flex items-center space-x-2 px-4 py-3 text-secondary-600 hover:text-secondary-800 font-medium transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        onClick={advanceToWelcome}
                        disabled={!selectedRole}
                        type="button"
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                          selectedRole
                            ? 'bg-[#316094] text-white hover:bg-[#2a5280]'
                            : 'bg-[#e5e7eb] text-secondary-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Finish Setup</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Welcome */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-[#47763b]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Sparkles className="w-8 h-8 text-[#47763b]" />
                    </div>

                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                      Welcome to DraftEngine!
                    </h2>
                    <p className="text-secondary-500 mb-6">
                      Based on your answers, here are templates we recommend:
                    </p>

                    {recommended.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {recommended.map((template) => (
                          <span
                            key={template}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#316094]/10 text-[#316094] border border-[#316094]/20"
                          >
                            {template}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleFinish}
                      disabled={completing}
                      type="button"
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#316094] text-white rounded-lg font-medium hover:bg-[#2a5280] transition-colors disabled:opacity-60"
                    >
                      {completing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Setting up...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Your First Source Entry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;

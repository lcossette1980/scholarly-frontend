import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Brain,
  BarChart3,
  Quote,
  CheckCircle,
  Eye,
  Edit,
  FileDown,
  Plus,
  Target,
  ArrowLeft,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry, incrementEntriesUsed } from '../services/stripe';
import { saveBibliographyEntry } from '../services/bibliography';
import { sanitizeResearchFocus, sanitizeBibliographyContent, cleanMarkdownFormatting } from '../utils/sanitization';
import { bibliographyAPI, healthCheck } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, ScaleIn } from '../components/motion';
import toast from 'react-hot-toast';
import { exportToBibliography } from '../utils/exportUtils';

const CreateEntryPage = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [researchFocus, setResearchFocus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [bibliographyEntry, setBibliographyEntry] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const { currentUser, userDocument } = useAuth();
  const navigate = useNavigate();

  const processingSteps = [
    { icon: FileText, label: 'Reading Document', description: 'Extracting text from PDF...' },
    { icon: Brain, label: 'Analyzing Structure', description: 'Understanding document structure...' },
    { icon: Brain, label: 'Identifying Source', description: 'Extracting source details...' },
    { icon: BarChart3, label: 'Finding Arguments', description: 'Identifying key claims and arguments...' },
    { icon: Target, label: 'Discovering Angles', description: 'Finding surprising angles and unique perspectives...' },
    { icon: Quote, label: 'Selecting Passages', description: 'Finding the most quotable passages...' }
  ];

  const steps = [
    { key: 'upload', label: 'Upload' },
    { key: 'processing', label: 'Processing' },
    { key: 'preview', label: 'Preview' }
  ];

  const stepIndex = steps.findIndex(s => s.key === currentStep);

  const canCreate = canCreateEntry(userDocument);

  React.useEffect(() => {
    if (!canCreate) {
      toast.error('You have reached your free trial limit. Please upgrade your plan.');
      navigate('/pricing');
    }
  }, [canCreate, navigate]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    if (!researchFocus.trim()) {
      toast.error('Please enter your writing focus first');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to upload documents');
      navigate('/login');
      return;
    }

    setUploadedFile(file);
    setCurrentStep('processing');
    setIsLoading(true);

    try {
      // Test backend connectivity first
      console.log('Testing backend connectivity...');
      await healthCheck();
      console.log('Backend is accessible');

      // Sanitize research focus before sending
      const sanitizedResearchFocus = sanitizeResearchFocus(researchFocus);

      // Upload file to backend using the API service
      console.log('Starting file upload...');
      const response = await bibliographyAPI.uploadDocument(file, sanitizedResearchFocus);

      const { task_id } = response;
      setTaskId(task_id);

      // Start polling for progress
      pollProcessingStatus(task_id);

    } catch (error) {
      console.error('Error uploading file:', error);
      console.error('Error details:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to upload file. Please try again.';
      toast.error(errorMessage);
      setCurrentStep('upload');
      setIsLoading(false);
    }
  };

  const pollProcessingStatus = async (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await bibliographyAPI.getProcessingStatus(taskId);

        const { status, progress } = response;

        setProcessingProgress(progress);
        setCurrentProcessingStep(Math.floor(progress / 17));

        if (status === 'completed') {
          clearInterval(interval);
          await fetchResult(taskId);
        } else if (status === 'error') {
          clearInterval(interval);
          toast.error('Processing failed. Please try again.');
          setCurrentStep('upload');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(interval);
        toast.error('Failed to check processing status');
        setCurrentStep('upload');
        setIsLoading(false);
      }
    }, 1000);

    // Cleanup after 5 minutes
    setTimeout(() => {
      clearInterval(interval);
      if (currentStep === 'processing') {
        toast.error('Processing timeout. Please try again.');
        setCurrentStep('upload');
        setIsLoading(false);
      }
    }, 300000);
  };

  const fetchResult = async (taskId) => {
    try {
      const response = await bibliographyAPI.getResult(taskId);

      setBibliographyEntry(response);

      // Save to Firestore
      const saveResult = await saveBibliographyEntry(
        currentUser.uid,
        response,
        researchFocus
      );

      if (saveResult.success) {
        // Increment user's entries used
        await incrementEntriesUsed(currentUser.uid);

        setCurrentStep('preview');
        setIsLoading(false);

        toast.success('Source entry generated and saved successfully!');
      } else {
        throw new Error(saveResult.error || 'Failed to save entry');
      }
    } catch (error) {
      console.error('Error fetching or saving result:', error);
      toast.error('Failed to save source entry. Please try again.');
      setCurrentStep('upload');
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleExportToWord = async () => {
    if (!bibliographyEntry) return;

    try {
      // Use the centralized export function with a single entry array
      await exportToBibliography([bibliographyEntry], 'word');
      toast.success('Document exported successfully!');
    } catch (error) {
      console.error('Error exporting document:', error);
      toast.error('Failed to export document');
    }
  };

  const resetProcess = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setProcessingProgress(0);
    setCurrentProcessingStep(0);
    setTaskId(null);
    setBibliographyEntry(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-mesh py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900">
                  Create Source Entry
                </h1>
                <p className="text-sm sm:text-base text-secondary-700 hidden sm:block">
                  Upload a document and generate a comprehensive source summary entry
                </p>
              </div>
            </div>

            {currentStep !== 'upload' && (
              <motion.button
                onClick={resetProcess}
                className="btn btn-outline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-5 h-5 mr-2" />
                Start Over
              </motion.button>
            )}
          </div>
        </FadeIn>

        {/* Step Indicator */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center mb-10">
            {steps.map((step, index) => {
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;

              return (
                <React.Fragment key={step.key}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-gradient-to-br from-accent to-indigo-600 text-white shadow-lg shadow-accent/25'
                          : 'border-2 border-secondary-300 text-secondary-400 bg-white'
                      }`}
                    >
                      {isCompleted ? (
                        <ScaleIn>
                          <CheckCircle className="w-5 h-5" />
                        </ScaleIn>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      isActive ? 'text-accent' : isCompleted ? 'text-green-600' : 'text-secondary-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="w-16 sm:w-24 h-1 mx-2 rounded-full overflow-hidden bg-secondary-200 relative -mt-5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-indigo-600 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: isCompleted ? '100%' : isActive ? '50%' : '0%' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </FadeIn>

        {/* Step Content with Transitions */}
        <AnimatePresence mode="wait">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <FadeIn>
                <div className="space-y-8">
                  {/* Writing Focus */}
                  <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-xl font-bold text-secondary-900">
                        Writing Focus
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <label className="form-label">
                        What is your writing focus area?
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., AI Ethics, Climate Narratives, Startup Culture, Leadership"
                        value={researchFocus}
                        onChange={(e) => setResearchFocus(sanitizeResearchFocus(e.target.value))}
                        maxLength={200}
                      />
                      <p className="text-sm text-secondary-600">
                        This helps our AI tailor the analysis to your specific writing interests.
                      </p>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="text-xl font-bold text-secondary-900">
                        Upload Document
                      </h2>
                    </div>

                    <motion.div
                      className={`upload-zone relative ${isDragOver ? 'dragover' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        borderImage: isDragOver
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7) 1'
                          : undefined,
                        borderColor: isDragOver ? 'transparent' : undefined,
                        borderWidth: '2px',
                        borderStyle: 'dashed'
                      }}
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-2">
                            Drop your PDF here or click to browse
                          </h3>
                          <p className="text-sm sm:text-base text-secondary-600 mb-2">
                            Supports articles, books, reports, essays, and blog posts
                          </p>
                          <p className="text-sm text-secondary-500">
                            Maximum file size: 10MB
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </FadeIn>
            </motion.div>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card">
                <div className="text-center space-y-8">
                  <ScaleIn>
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-charcoal rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </ScaleIn>

                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                      Analyzing Your Document
                    </h2>
                    <p className="text-secondary-700">
                      Our AI is carefully reading and analyzing your source
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-700">Progress</span>
                      <span className="text-accent font-medium">{processingProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-pearl/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-charcoal rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${processingProgress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Processing Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                    {processingSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentProcessingStep;
                      const isCompleted = index < currentProcessingStep;

                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            isActive
                              ? 'bg-accent/10 border-accent-600/30 scale-105'
                              : isCompleted
                              ? 'bg-pearl/30 border-secondary-300/30'
                              : 'bg-white/50 border-secondary-300/20'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                isActive
                                  ? 'bg-accent text-white animate-pulse'
                                  : isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'bg-pearl/50 text-secondary-500'
                              }`}
                            >
                              {isCompleted ? (
                                <ScaleIn>
                                  <CheckCircle className="w-5 h-5" />
                                </ScaleIn>
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <h4 className={`font-semibold ${isActive || isCompleted ? 'text-secondary-900' : 'text-secondary-500'}`}>
                                {step.label}
                              </h4>
                              <p className={`text-sm ${isActive || isCompleted ? 'text-secondary-700' : 'text-secondary-400'}`}>
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && bibliographyEntry && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <FadeIn>
                <div className="space-y-8">
                  <div className="card">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-secondary-900">
                          Preview & Edit Your Entry
                        </h2>
                      </div>
                      <motion.button
                        onClick={handleExportToWord}
                        className="btn btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Export to Word
                      </motion.button>
                    </div>

                    {/* Source Entry Preview */}
                    <div className="space-y-6">
                      {/* Citation */}
                      <div className="card-floating bg-secondary-50 rounded-lg p-6">
                        <div className="font-bold text-secondary-900 leading-relaxed text-lg">
                          {bibliographyEntry.source_info
                            ? `${bibliographyEntry.source_info.author || 'Unknown Author'} (${bibliographyEntry.source_info.year || 'n.d.'}). ${bibliographyEntry.source_info.title || 'Untitled'}. ${bibliographyEntry.source_info.publication || ''}`
                            : cleanMarkdownFormatting(bibliographyEntry.citation || '')}
                        </div>
                      </div>

                      {/* Key Arguments & Ideas */}
                      {(bibliographyEntry.key_arguments || bibliographyEntry.core_findings) && (
                        <div className="card-floating bg-secondary-50 rounded-lg p-6">
                          <h3 className="font-bold text-secondary-900 mb-3 text-lg flex items-center space-x-2">
                            <Brain className="w-5 h-5 text-accent" />
                            <span>Key Arguments & Ideas</span>
                          </h3>
                          <div className="text-secondary-900/90 leading-relaxed whitespace-pre-wrap">
                            {cleanMarkdownFormatting(bibliographyEntry.key_arguments || bibliographyEntry.core_findings)}
                          </div>
                        </div>
                      )}

                      {/* Interesting Angles */}
                      {(bibliographyEntry.interesting_angles || bibliographyEntry.narrative_overview) && (
                        <div className="card-floating bg-secondary-50 rounded-lg p-6">
                          <h3 className="font-bold text-secondary-900 mb-3 text-lg flex items-center space-x-2">
                            <Target className="w-5 h-5 text-accent" />
                            <span>Interesting Angles</span>
                          </h3>
                          <div className="text-secondary-900/90 leading-relaxed whitespace-pre-wrap">
                            {cleanMarkdownFormatting(bibliographyEntry.interesting_angles || bibliographyEntry.narrative_overview)}
                          </div>
                        </div>
                      )}

                      {/* Perspective & Value */}
                      {(bibliographyEntry.perspective_value || bibliographyEntry.methodological_value?.strengths) && (
                        <div className="card-floating bg-secondary-50 rounded-lg p-6">
                          <h3 className="font-bold text-secondary-900 mb-3 text-lg flex items-center space-x-2">
                            <Eye className="w-5 h-5 text-accent" />
                            <span>Perspective & Value</span>
                          </h3>
                          <div className="text-secondary-900/90 leading-relaxed whitespace-pre-wrap">
                            {cleanMarkdownFormatting(bibliographyEntry.perspective_value || bibliographyEntry.methodological_value?.strengths)}
                          </div>
                        </div>
                      )}

                      {/* Notable Passages */}
                      {((bibliographyEntry.notable_passages && bibliographyEntry.notable_passages.length > 0) ||
                        (bibliographyEntry.key_quotes && bibliographyEntry.key_quotes.length > 0)) && (
                        <div className="card-floating bg-secondary-50 rounded-lg p-6">
                          <h3 className="font-bold text-secondary-900 mb-4 text-lg flex items-center space-x-2">
                            <Quote className="w-5 h-5 text-accent" />
                            <span>Notable Passages</span>
                          </h3>
                          <div className="space-y-3">
                            {(bibliographyEntry.notable_passages || bibliographyEntry.key_quotes).map((passage, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border border-secondary-300/20">
                                <p className="text-secondary-900/90 italic leading-relaxed">
                                  "{cleanMarkdownFormatting(passage.text)}"
                                </p>
                                {passage.page && (
                                  <p className="text-sm text-secondary-600 mt-2 font-medium">
                                    p. {passage.page}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <motion.button
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-outline"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back to Dashboard
                    </motion.button>
                    <motion.button
                      onClick={resetProcess}
                      className="btn btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Another Entry
                    </motion.button>
                  </div>
                </div>
              </FadeIn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateEntryPage;

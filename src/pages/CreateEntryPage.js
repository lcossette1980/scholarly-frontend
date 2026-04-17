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
  X,
  Globe,
  Search,
  Rss
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canCreateEntry, incrementEntriesUsed } from '../services/stripe';
import { saveBibliographyEntry } from '../services/bibliography';
import { sanitizeBibliographyContent, cleanMarkdownFormatting } from '../utils/sanitization';
import SampleProjectCard from '../components/SampleProjectCard';
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
  const [importTab, setImportTab] = useState('pdf');
  const [urlInput, setUrlInput] = useState('');
  const [doiInput, setDoiInput] = useState('');
  const [rssInput, setRssInput] = useState('');
  const [rssArticles, setRssArticles] = useState([]);
  const [selectedRssArticles, setSelectedRssArticles] = useState([]);
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

  // Simple getter for research focus value
  const getResearchFocus = () => researchFocus.trim();

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

    if (!getResearchFocus()) {
      toast.error('Please enter a research topic');
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

      const focus = getResearchFocus();

      // Upload file to backend using the API service
      console.log('Starting file upload...');
      const response = await bibliographyAPI.uploadDocument(file, focus);

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

  const handleURLImport = async () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(urlInput);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    if (!getResearchFocus()) {
      toast.error('Please enter a research topic');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to import articles');
      navigate('/login');
      return;
    }

    setCurrentStep('processing');
    setIsLoading(true);

    try {
      await healthCheck();
      const focus = getResearchFocus();
      const response = await bibliographyAPI.uploadURL(urlInput, focus);
      const { task_id } = response;
      setTaskId(task_id);
      pollProcessingStatus(task_id);
    } catch (error) {
      console.error('Error importing URL:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to import URL. Please try again.';
      toast.error(errorMessage);
      setCurrentStep('upload');
      setIsLoading(false);
    }
  };

  const handleDOILookup = async () => {
    if (!doiInput.trim()) {
      toast.error('Please enter a DOI');
      return;
    }

    if (!getResearchFocus()) {
      toast.error('Please enter a research topic');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to look up DOIs');
      navigate('/login');
      return;
    }

    setCurrentStep('processing');
    setIsLoading(true);

    try {
      await healthCheck();
      const focus = getResearchFocus();
      const response = await bibliographyAPI.lookupDOI(doiInput, focus);
      const { task_id } = response;
      setTaskId(task_id);
      pollProcessingStatus(task_id);
    } catch (error) {
      console.error('Error looking up DOI:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to look up DOI. Please try again.';
      toast.error(errorMessage);
      setCurrentStep('upload');
      setIsLoading(false);
    }
  };

  const handleRSSLoad = async () => {
    if (!rssInput.trim()) {
      toast.error('Please enter an RSS feed URL');
      return;
    }

    try {
      new URL(rssInput);
    } catch {
      toast.error('Please enter a valid RSS feed URL');
      return;
    }

    setIsLoading(true);

    try {
      const response = await bibliographyAPI.importRSSFeed(rssInput);
      setRssArticles(response.articles || []);
      setSelectedRssArticles([]);
      if (!response.articles || response.articles.length === 0) {
        toast.error('No articles found in this feed');
      }
    } catch (error) {
      console.error('Error loading RSS feed:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to load RSS feed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSSImport = async () => {
    if (selectedRssArticles.length === 0) {
      toast.error('Please select at least one article');
      return;
    }

    if (!getResearchFocus()) {
      toast.error('Please enter a research topic');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to import articles');
      navigate('/login');
      return;
    }

    setCurrentStep('processing');
    setIsLoading(true);

    try {
      await healthCheck();
      const focus = getResearchFocus();
      const firstArticle = rssArticles.find(a => selectedRssArticles.includes(a.url));
      if (!firstArticle) {
        throw new Error('No valid article selected');
      }
      const response = await bibliographyAPI.uploadURL(firstArticle.url, researchFocus);
      const { task_id } = response;
      setTaskId(task_id);
      pollProcessingStatus(task_id);
    } catch (error) {
      console.error('Error importing RSS articles:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to import article. Please try again.';
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

        setProcessingProgress(progress || 0);

        // Map progress ranges to processing step states
        let step = 0;
        if (progress >= 85) step = 5;
        else if (progress >= 65) step = 4;
        else if (progress >= 45) step = 3;
        else if (progress >= 30) step = 2;
        else if (progress >= 20) step = 1;
        else step = 0;
        setCurrentProcessingStep(step);

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
        getResearchFocus()
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
    setResearchFocus('');
    setTaskId(null);
    setBibliographyEntry(null);
    setIsLoading(false);
    setImportTab('pdf');
    setUrlInput('');
    setDoiInput('');
    setRssInput('');
    setRssArticles([]);
    setSelectedRssArticles([]);
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
                          ? 'bg-primary text-white shadow-soft'
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
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-secondary-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="w-16 sm:w-24 h-1 mx-2 rounded-full overflow-hidden bg-secondary-200 relative -mt-5">
                      <motion.div
                        className="h-full bg-primary rounded-full"
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
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-secondary-900">
                        Writing Focus
                      </h2>
                    </div>

                    <div className="space-y-2">
                      <label className="form-label">
                        Research Focus
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., AI Ethics, Climate Policy, Leadership"
                        value={researchFocus}
                        onChange={(e) => setResearchFocus(e.target.value)}
                      />
                      <p className="text-xs text-secondary-500">
                        Describe your writing focus. Separate multiple topics with commas.
                      </p>
                    </div>
                  </div>

                  {/* Import Source */}
                  <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-secondary-900">
                        Import Source
                      </h2>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex border-b border-[#e5e7eb] mb-6">
                      {[
                        { id: 'pdf', label: 'Upload PDF', icon: FileText },
                        { id: 'url', label: 'From URL', icon: Globe },
                        { id: 'doi', label: 'DOI Lookup', icon: Search },
                        { id: 'rss', label: 'RSS Feed', icon: Rss }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setImportTab(tab.id)}
                          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            importTab === tab.id
                              ? 'border-primary text-primary'
                              : 'border-transparent text-secondary-600 hover:text-primary'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* PDF Tab */}
                    {importTab === 'pdf' && (
                      <motion.div
                        className={`upload-zone relative ${isDragOver ? 'dragover' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          borderImage: isDragOver
                            ? 'linear-gradient(135deg, #254a73, #316094, #4a7ab5) 1'
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
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-primary" />
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
                    )}

                    {/* URL Tab */}
                    {importTab === 'url' && (
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="w-5 h-5 text-secondary-400" />
                          </div>
                          <input
                            type="url"
                            className="form-input pl-10"
                            placeholder="https://example.com/article"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                          />
                        </div>
                        <motion.button
                          onClick={handleURLImport}
                          disabled={isLoading || !urlInput.trim()}
                          className="bg-primary text-white hover:bg-primary-700 rounded-lg px-6 py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Import Article
                        </motion.button>
                      </div>
                    )}

                    {/* DOI Tab */}
                    {importTab === 'doi' && (
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-secondary-400" />
                          </div>
                          <input
                            type="text"
                            className="form-input pl-10"
                            placeholder="e.g., 10.1038/s41586-021-03819-2"
                            value={doiInput}
                            onChange={(e) => setDoiInput(e.target.value)}
                          />
                        </div>
                        <motion.button
                          onClick={handleDOILookup}
                          disabled={isLoading || !doiInput.trim()}
                          className="bg-primary text-white hover:bg-primary-700 rounded-lg px-6 py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Look Up
                        </motion.button>
                      </div>
                    )}

                    {/* RSS Tab */}
                    {importTab === 'rss' && (
                      <div className="space-y-4">
                        <div className="flex space-x-3">
                          <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Rss className="w-5 h-5 text-secondary-400" />
                            </div>
                            <input
                              type="url"
                              className="form-input pl-10"
                              placeholder="https://example.com/feed.xml"
                              value={rssInput}
                              onChange={(e) => setRssInput(e.target.value)}
                            />
                          </div>
                          <motion.button
                            onClick={handleRSSLoad}
                            disabled={isLoading || !rssInput.trim()}
                            className="bg-primary text-white hover:bg-primary-700 rounded-lg px-6 py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Load Feed
                          </motion.button>
                        </div>

                        {/* RSS Article List */}
                        {rssArticles.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm text-secondary-700 font-medium">
                              {rssArticles.length} article{rssArticles.length !== 1 ? 's' : ''} found
                            </p>
                            <div className="max-h-80 overflow-y-auto space-y-2 border border-[#e5e7eb] rounded-lg p-3">
                              {rssArticles.map((article, index) => (
                                <label
                                  key={index}
                                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    className="mt-1 rounded border-secondary-300 text-primary focus:ring-primary"
                                    checked={selectedRssArticles.includes(article.url)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedRssArticles([...selectedRssArticles, article.url]);
                                      } else {
                                        setSelectedRssArticles(selectedRssArticles.filter(u => u !== article.url));
                                      }
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-secondary-900 truncate">
                                      {article.title}
                                    </p>
                                    {article.published && (
                                      <p className="text-xs text-secondary-500 mt-0.5">
                                        {new Date(article.published).toLocaleDateString()}
                                      </p>
                                    )}
                                    {article.summary && (
                                      <p className="text-xs text-secondary-600 mt-1 line-clamp-2">
                                        {article.summary}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                            <motion.button
                              onClick={handleRSSImport}
                              disabled={isLoading || selectedRssArticles.length === 0}
                              className="bg-primary text-white hover:bg-primary-700 rounded-lg px-6 py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Import Selected ({selectedRssArticles.length})
                            </motion.button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sample Projects */}
                  {userDocument?.subscription?.entriesUsed === 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-secondary-900 mb-4">Try a Sample Project</h3>
                      <p className="text-sm text-secondary-500 mb-6">See how DraftEngine works before importing your own sources.</p>
                      <div className="grid md:grid-cols-3 gap-5">
                        <SampleProjectCard
                          title="SaaS Thought Leadership"
                          description="See how 4 analyst reports become a thought leadership article"
                          sourceCount={4}
                          outputDesc="2,500-word article with citations"
                          sampleKey="thought-leadership"
                          icon="FileText"
                        />
                        <SampleProjectCard
                          title="Industry White Paper"
                          description="See how 5 research papers become an executive white paper"
                          sourceCount={5}
                          outputDesc="5,000-word white paper with references"
                          sampleKey="white-paper"
                          icon="BarChart3"
                        />
                        <SampleProjectCard
                          title="Competitive Analysis"
                          description="See how reports and URLs become a competitive landscape brief"
                          sourceCount={3}
                          outputDesc="3,000-word competitive analysis"
                          sampleKey="competitive-analysis"
                          icon="Target"
                        />
                      </div>
                    </div>
                  )}
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
                      <span className="text-primary font-medium">{processingProgress}%</span>
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
                              ? 'bg-primary/10 border-primary/30 scale-105'
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
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Eye className="w-5 h-5 text-primary" />
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
                            <Brain className="w-5 h-5 text-primary" />
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
                            <Target className="w-5 h-5 text-primary" />
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
                            <Eye className="w-5 h-5 text-primary" />
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
                            <Quote className="w-5 h-5 text-primary" />
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

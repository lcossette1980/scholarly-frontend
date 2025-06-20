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
import axios from 'axios';
import toast from 'react-hot-toast';

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
    { icon: FileText, label: 'Extracting Text', description: 'Reading PDF content' },
    { icon: Brain, label: 'Analyzing Content', description: 'Understanding structure' },
    { icon: Brain, label: 'Generating Overview', description: 'Creating narrative' },
    { icon: BarChart3, label: 'Finding Key Data', description: 'Extracting insights' },
    { icon: Quote, label: 'Selecting Quotes', description: 'Identifying impact' },
    { icon: CheckCircle, label: 'Finalizing Entry', description: 'Completing analysis' }
  ];

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
      toast.error('Please enter your research focus first');
      return;
    }

    setUploadedFile(file);
    setCurrentStep('processing');
    setIsLoading(true);

    try {
      // Upload file to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('research_focus', researchFocus);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { task_id } = response.data;
      setTaskId(task_id);

      // Start polling for progress
      pollProcessingStatus(task_id);

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
      setCurrentStep('upload');
      setIsLoading(false);
    }
  };

  const pollProcessingStatus = async (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/status/${taskId}`
        );

        const { status, progress } = response.data;
        
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
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/result/${taskId}`
      );

      setBibliographyEntry(response.data);
      
      // Increment user's entries used
      await incrementEntriesUsed(currentUser.uid);
      
      setCurrentStep('preview');
      setIsLoading(false);
      
      toast.success('Bibliography entry generated successfully!');
    } catch (error) {
      console.error('Error fetching result:', error);
      toast.error('Failed to fetch result. Please try again.');
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
      // Create Word document content
      const content = `
${bibliographyEntry.citation}

Narrative Overview
${bibliographyEntry.narrative_overview}

Key Research Components
Research Purpose: ${bibliographyEntry.research_components.research_purpose || ''}
Methodology: ${bibliographyEntry.research_components.methodology || ''}
Theoretical Framework: ${bibliographyEntry.research_components.theoretical_framework || ''}

Core Findings & Key Statistics
${bibliographyEntry.core_findings}

Methodological Value
Strengths: ${bibliographyEntry.methodological_value.strengths || ''}
Limitations: ${bibliographyEntry.methodological_value.limitations || ''}

Key Quotes
${bibliographyEntry.key_quotes?.map((quote, index) => 
  `${index + 1}. "${quote.text}" (p. ${quote.page})`
).join('\n') || 'No quotes available'}
      `;

      // Create and download file
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bibliography-entry-${Date.now()}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-charcoal font-playfair">
                Create Bibliography Entry
              </h1>
              <p className="text-charcoal/70 font-lato">
                Upload an academic paper and generate a comprehensive annotated bibliography entry
              </p>
            </div>
          </div>
          
          {currentStep !== 'upload' && (
            <button
              onClick={resetProcess}
              className="btn btn-outline"
            >
              <X className="w-5 h-5 mr-2" />
              Start Over
            </button>
          )}
        </div>

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div className="space-y-8">
            {/* Research Focus */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-chestnut" />
                </div>
                <h2 className="text-xl font-bold text-charcoal font-playfair">
                  Research Focus
                </h2>
              </div>
              
              <div className="space-y-2">
                <label className="form-label">
                  What is your research focus area?
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., AI Leadership, Digital Transformation, Machine Learning Ethics"
                  value={researchFocus}
                  onChange={(e) => setResearchFocus(e.target.value)}
                />
                <p className="text-sm text-charcoal/60 font-lato">
                  This helps our AI tailor the analysis to your specific research interests.
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-chestnut" />
                </div>
                <h2 className="text-xl font-bold text-charcoal font-playfair">
                  Upload Academic Paper
                </h2>
              </div>

              <div
                className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-chestnut" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2 font-lato">
                      Drop your PDF here or click to browse
                    </h3>
                    <p className="text-charcoal/60 font-lato mb-2">
                      Supports research articles, journal papers, and academic reports
                    </p>
                    <p className="text-sm text-charcoal/50 font-lato">
                      Maximum file size: 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {currentStep === 'processing' && (
          <div className="card">
            <div className="text-center space-y-8">
              <div className="w-16 h-16 bg-gradient-to-br from-chestnut to-charcoal rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-charcoal font-playfair mb-2">
                  Analyzing Your Document
                </h2>
                <p className="text-charcoal/70 font-lato">
                  Our AI is carefully reading and analyzing your research paper
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-sm font-lato">
                  <span className="text-charcoal/70">Progress</span>
                  <span className="text-chestnut font-medium">{processingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-pearl/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-chestnut to-charcoal rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>

              {/* Processing Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {processingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentProcessingStep;
                  const isCompleted = index < currentProcessingStep;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        isActive
                          ? 'bg-chestnut/10 border-chestnut/30 scale-105'
                          : isCompleted
                          ? 'bg-pearl/30 border-khaki/30'
                          : 'bg-white/50 border-khaki/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-chestnut text-white animate-pulse'
                              : isCompleted
                              ? 'bg-khaki text-white'
                              : 'bg-pearl/50 text-charcoal/50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`font-semibold font-lato ${isActive || isCompleted ? 'text-charcoal' : 'text-charcoal/50'}`}>
                            {step.label}
                          </h4>
                          <p className={`text-sm font-lato ${isActive || isCompleted ? 'text-charcoal/70' : 'text-charcoal/40'}`}>
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
        )}

        {/* Preview Step */}
        {currentStep === 'preview' && bibliographyEntry && (
          <div className="space-y-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-chestnut/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-chestnut" />
                  </div>
                  <h2 className="text-2xl font-bold text-charcoal font-playfair">
                    Preview & Edit Your Entry
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="btn btn-outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Entry
                  </button>
                  <button onClick={handleExportToWord} className="btn btn-primary">
                    <FileDown className="w-4 h-4 mr-2" />
                    Export to Word
                  </button>
                </div>
              </div>

              {/* Bibliography Entry Preview */}
              <div className="bg-white rounded-lg border border-khaki/20 p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
                <div className="space-y-6">
                  {/* Citation */}
                  <div className="font-bold text-charcoal leading-relaxed">
                    {bibliographyEntry.citation}
                  </div>

                  {/* Narrative Overview */}
                  <div>
                    <h3 className="font-bold text-charcoal mb-3 text-lg font-playfair">
                      Narrative Overview
                    </h3>
                    <p className="text-charcoal/90 leading-relaxed">
                      {bibliographyEntry.narrative_overview}
                    </p>
                  </div>

                  {/* Key Research Components */}
                  <div>
                    <h3 className="font-bold text-charcoal mb-3 text-lg font-playfair">
                      Key Research Components
                    </h3>
                    <div className="space-y-3">
                      {bibliographyEntry.research_components?.research_purpose && (
                        <div>
                          <span className="font-semibold text-charcoal">Research Purpose:</span>
                          <p className="text-charcoal/90 mt-1">{bibliographyEntry.research_components.research_purpose}</p>
                        </div>
                      )}
                      {bibliographyEntry.research_components?.methodology && (
                        <div>
                          <span className="font-semibold text-charcoal">Methodology:</span>
                          <p className="text-charcoal/90 mt-1">{bibliographyEntry.research_components.methodology}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Quotes */}
                  {bibliographyEntry.key_quotes && bibliographyEntry.key_quotes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-charcoal mb-3 text-lg font-playfair">
                        Key Quotes
                      </h3>
                      <ol className="text-charcoal/90 space-y-2 list-decimal ml-6">
                        {bibliographyEntry.key_quotes.map((quote, index) => (
                          <li key={index}>
                            "{quote.text}" (p. {quote.page})
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
              >
                Back to Dashboard
              </button>
              <button
                onClick={resetProcess}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Another Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEntryPage;
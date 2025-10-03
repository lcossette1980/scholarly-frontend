import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  FileText,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Download,
  Eye,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import toast from 'react-hot-toast';

const AnalyzePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Get selected entries from navigation state
  const selectedEntryData = location.state?.selectedEntries || [];
  const [outputType, setOutputType] = useState('article');
  const [numTopics, setNumTopics] = useState(5);
  const [focusArea, setFocusArea] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [topics, setTopics] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Redirect if no entries selected
    if (selectedEntryData.length < 2) {
      toast.error('Please select at least 2 entries to analyze');
      navigate('/bibliography');
    }
  }, [selectedEntryData, navigate]);

  const handleGenerateTopics = async () => {
    if (!currentUser) {
      toast.error('Please sign in to use analysis features');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 1000);

    try {
      const entryIds = selectedEntryData.map(e => e.id);

      const result = await analysisAPI.generateTopics(
        entryIds,
        currentUser.uid,
        {
          outputType,
          numTopics,
          focusArea: focusArea.trim() || null
        }
      );

      clearInterval(progressInterval);
      setProgress(100);
      setTopics(result);
      toast.success(`Generated ${result.topics.length} topic suggestions!`);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating topics:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate topics. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewOutline = (topic) => {
    navigate('/analyze/outline', {
      state: {
        topic,
        selectedEntries: selectedEntryData
      }
    });
  };

  const TopicCard = ({ topic, index }) => {
    const scorePercentage = Math.round(topic.relevance_score * 100);

    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-8 h-8 bg-chestnut/10 text-chestnut rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <TrendingUp
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round((topic.relevance_score * 5))
                        ? 'text-chestnut fill-chestnut'
                        : 'text-charcoal/20'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium text-charcoal/70 ml-2">
                  {scorePercentage}% relevance
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-charcoal font-playfair mb-3">
              {topic.title}
            </h3>

            <p className="text-charcoal/80 font-lato mb-4 leading-relaxed">
              {topic.rationale}
            </p>

            <div className="bg-pearl/30 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-semibold text-charcoal mb-2">Suggested Structure:</h4>
              <ol className="text-sm text-charcoal/70 space-y-1 list-decimal ml-4">
                {topic.suggested_structure.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleViewOutline(topic)}
            className="btn btn-primary flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Detailed Outline
          </button>
          <button
            onClick={() => {
              // TODO: Quick export functionality
              toast.success('Export feature coming soon!');
            }}
            className="btn btn-outline"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (!selectedEntryData || selectedEntryData.length < 2) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/bibliography')}
              className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-khaki/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal font-playfair">
                Topic & Outline Generator
              </h1>
              <p className="text-charcoal/70 font-lato">
                AI-powered research synthesis for {selectedEntryData.length} selected entries
              </p>
            </div>
          </div>
        </div>

        {/* Selected Entries Summary */}
        <div className="card mb-8 bg-gradient-to-br from-chestnut/5 to-khaki/5">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-chestnut/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-chestnut" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                Selected Entries ({selectedEntryData.length})
              </h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedEntryData.map((entry, idx) => (
                  <div key={idx} className="text-sm text-charcoal/70 truncate">
                    • {entry.citation}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        {!topics && (
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-chestnut/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-chestnut" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal font-playfair">
                Configure Your Analysis
              </h2>
            </div>

            <div className="space-y-6">
              {/* Output Type */}
              <div>
                <label className="form-label">Output Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'article', label: 'Research Article', desc: 'Peer-reviewed academic article' },
                    { value: 'blog', label: 'Blog Post', desc: 'Accessible content for general audience' },
                    { value: 'paper', label: 'Conference Paper', desc: 'Graduate-level research paper' }
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setOutputType(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        outputType === type.value
                          ? 'border-chestnut bg-chestnut/5'
                          : 'border-khaki/30 hover:border-khaki/50'
                      }`}
                    >
                      <div className="font-semibold text-charcoal mb-1">{type.label}</div>
                      <div className="text-sm text-charcoal/60">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Topics */}
              <div>
                <label className="form-label">
                  Number of Topics: {numTopics}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={numTopics}
                  onChange={(e) => setNumTopics(parseInt(e.target.value))}
                  className="w-full h-2 bg-khaki/30 rounded-lg appearance-none cursor-pointer accent-chestnut"
                />
                <div className="flex justify-between text-sm text-charcoal/60 mt-1">
                  <span>3 topics</span>
                  <span>10 topics</span>
                </div>
              </div>

              {/* Focus Area (Optional) */}
              <div>
                <label className="form-label">
                  Focus Area <span className="text-charcoal/40">(optional)</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., ethical implications, practical applications, methodological approaches"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  maxLength={200}
                />
                <p className="text-sm text-charcoal/60 mt-1">
                  Narrow your topic suggestions to a specific angle or theme
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateTopics}
                disabled={isAnalyzing}
                className="btn btn-primary w-full text-lg py-4"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing Your Research...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Topic Suggestions
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="card">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-chestnut to-charcoal rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-charcoal font-playfair mb-2">
                  Analyzing Your Research
                </h3>
                <p className="text-charcoal/70 font-lato">
                  Our AI is synthesizing {selectedEntryData.length} entries to generate compelling topic suggestions...
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/70">Progress</span>
                  <span className="text-chestnut font-medium">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-pearl/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-chestnut to-charcoal transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {topics && !isAnalyzing && (
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-green-50 to-khaki/10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal font-playfair mb-1">
                    Analysis Complete!
                  </h3>
                  <p className="text-charcoal/70 font-lato">
                    Generated {topics.topics.length} topic suggestions from {topics.entry_count} entries
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-charcoal font-playfair">
                Suggested Topics
              </h2>
              <button
                onClick={() => setTopics(null)}
                className="btn btn-outline"
              >
                Generate New Topics
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topics.topics.map((topic, index) => (
                <TopicCard key={index} topic={topic} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;

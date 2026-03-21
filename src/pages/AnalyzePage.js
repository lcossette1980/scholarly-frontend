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
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerChildren, StaggerItem, ScaleIn } from '../components/motion';
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
      navigate('/sources');
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
      toast.success(`Generated ${result.topics.length} content ideas!`);
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
      <div className="card card-floating hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <TrendingUp
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round((topic.relevance_score * 5))
                        ? 'text-accent fill-chestnut'
                        : 'text-secondary-900/20'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium text-secondary-700 ml-2">
                  {scorePercentage}% relevance
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-secondary-900 mb-3">
              {topic.title}
            </h3>

            <p className="text-secondary-800 mb-4 leading-relaxed">
              {topic.rationale}
            </p>

            <div className="bg-pearl/30 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-semibold text-secondary-900 mb-2">Suggested Structure:</h4>
              <ol className="text-sm text-secondary-700 space-y-1 list-decimal ml-4">
                {topic.suggested_structure.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <motion.button
            onClick={() => handleViewOutline(topic)}
            className="btn btn-primary flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Detailed Outline
          </motion.button>
          <motion.button
            onClick={() => {
              // TODO: Quick export functionality
            }}
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  };

  if (!selectedEntryData || selectedEntryData.length < 2) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <FadeIn direction="left">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/sources')}
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200/10 rounded-lg transition-colors"
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
                  Idea & Outline Generator
                </h1>
                <p className="text-secondary-700">
                  AI-powered content synthesis for {selectedEntryData.length} selected entries
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Selected Entries Summary */}
        <FadeIn delay={0.1}>
          <div className="glass-card mb-8 bg-gradient-to-br from-accent/5 to-khaki/5">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Selected Entries ({selectedEntryData.length})
                </h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedEntryData.map((entry, idx) => (
                    <div key={idx} className="text-sm text-secondary-700 truncate break-words">
                      • {entry.citation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Configuration Section */}
        <AnimatePresence>
          {!topics && (
            <FadeIn delay={0.2}>
              <div className="glass-card mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Configure Your Analysis
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Output Type */}
                  <FadeIn delay={0.25}>
                    <div>
                      <label className="form-label">Output Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'article', label: 'Article', desc: 'Well-structured written article' },
                          { value: 'blog', label: 'Blog Post', desc: 'Accessible content for general audience' },
                          { value: 'paper', label: 'Essay', desc: 'In-depth analytical essay' }
                        ].map(type => (
                          <motion.button
                            key={type.value}
                            onClick={() => setOutputType(type.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              outputType === type.value
                                ? 'border-accent-600 bg-accent/5'
                                : 'border-secondary-300/30 hover:border-secondary-300/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="font-semibold text-secondary-900 mb-1">{type.label}</div>
                            <div className="text-sm text-secondary-600">{type.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </FadeIn>

                  {/* Number of Topics */}
                  <FadeIn delay={0.3}>
                    <div>
                      <label className="form-label">
                        Number of Ideas: {numTopics}
                      </label>
                      <input
                        type="range"
                        min="3"
                        max="10"
                        value={numTopics}
                        onChange={(e) => setNumTopics(parseInt(e.target.value))}
                        className="w-full h-2 bg-secondary-200/30 rounded-lg appearance-none cursor-pointer accent-chestnut"
                      />
                      <div className="flex justify-between text-sm text-secondary-600 mt-1">
                        <span>3 ideas</span>
                        <span>10 ideas</span>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Focus Area (Optional) */}
                  <FadeIn delay={0.35}>
                    <div>
                      <label className="form-label">
                        Focus Area <span className="text-secondary-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., ethical implications, practical applications, creative angles"
                        value={focusArea}
                        onChange={(e) => setFocusArea(e.target.value)}
                        maxLength={200}
                      />
                      <p className="text-sm text-secondary-600 mt-1">
                        Narrow your content ideas to a specific angle or theme
                      </p>
                    </div>
                  </FadeIn>

                  {/* Generate Button */}
                  <FadeIn delay={0.4}>
                    <motion.button
                      onClick={handleGenerateTopics}
                      disabled={isAnalyzing}
                      className="btn btn-primary w-full text-lg py-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Analyzing Your Sources...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Content Ideas
                        </>
                      )}
                    </motion.button>
                  </FadeIn>
                </div>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <FadeIn>
              <div className="glass-card">
                <div className="text-center space-y-6">
                  <ScaleIn>
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-charcoal rounded-full flex items-center justify-center mx-auto">
                      <Brain className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </ScaleIn>

                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      Analyzing Your Sources
                    </h3>
                    <p className="text-secondary-700">
                      Our AI is synthesizing {selectedEntryData.length} entries to generate compelling content ideas...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-700">Progress</span>
                      <span className="text-accent font-medium">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-pearl/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-charcoal rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>

        {/* Results */}
        {topics && !isAnalyzing && (
          <div className="space-y-6">
            <FadeIn>
              <div className="card bg-gradient-to-br from-green-50 to-khaki/10">
                <div className="flex items-start space-x-4">
                  <ScaleIn>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </ScaleIn>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      Analysis Complete!
                    </h3>
                    <p className="text-secondary-700">
                      Generated {topics.topics.length} content ideas from {topics.entry_count} entries
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-900">
                  Suggested Ideas
                </h2>
                <motion.button
                  onClick={() => setTopics(null)}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate New Ideas
                </motion.button>
              </div>
            </FadeIn>

            <StaggerChildren>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {topics.topics.map((topic, index) => (
                  <StaggerItem key={index}>
                    <TopicCard topic={topic} index={index} />
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;

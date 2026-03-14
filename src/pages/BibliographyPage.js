import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Filter,
  Check,
  Square,
  CheckSquare,
  ArrowLeft,
  BookOpen,
  List,
  FileDown,
  Search,
  X,
  Trash2,
  Brain,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserBibliographyEntries, deleteBibliographyEntry } from '../services/bibliography';
import { canAccessFeature } from '../services/stripe';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { exportToBibliography } from '../utils/exportUtils';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

const BibliographyPage = () => {
  const { currentUser, userDocument } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, [currentUser]);

  const fetchEntries = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserBibliographyEntries(currentUser.uid, 100);

      if (result.success) {
        setEntries(result.entries);

        // Extract unique categories
        const uniqueCategories = [...new Set(result.entries.map(e => e.researchFocus))];
        setCategories(uniqueCategories);
      } else {
        toast.error('Failed to load source entries');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load source entries');
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch =
      entry.citation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.narrative_overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.researchFocus.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || entry.researchFocus === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = () => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map(e => e.id)));
    }
  };

  const handleSelectEntry = (entryId) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedEntries(newSelected);
  };

  const handleDeleteEntry = async (entryId, e) => {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this reference? This action cannot be undone.')) {
      try {
        const result = await deleteBibliographyEntry(entryId);
        if (result.success) {
          setEntries(entries.filter(entry => entry.id !== entryId));
          setSelectedEntries(prev => {
            const newSet = new Set(prev);
            newSet.delete(entryId);
            return newSet;
          });
          toast.success('Reference deleted successfully');
        } else {
          toast.error('Failed to delete reference');
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast.error('Failed to delete reference');
      }
    }
  };

  const exportAnnotatedBibliography = async () => {
    const selectedData = entries.filter(e => selectedEntries.has(e.id));

    if (selectedData.length === 0) {
      toast.error('Please select at least one entry to export');
      return;
    }

    try {
      await exportToBibliography(selectedData, 'word');
      toast.success(`Exported ${selectedData.length} entries as detailed source summary`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export sources');
    }
  };

  const exportReferencesList = async () => {
    const selectedData = entries.filter(e => selectedEntries.has(e.id));

    if (selectedData.length === 0) {
      toast.error('Please select at least one entry to export');
      return;
    }

    try {
      // Sort alphabetically by citation
      const sortedData = [...selectedData].sort((a, b) => a.citation.localeCompare(b.citation));

      // Create document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "REFERENCES",
                  bold: true,
                  size: 32,
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 480,
              }
            }),
            ...sortedData.map(entry =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: entry.citation,
                    size: 24,
                  })
                ],
                spacing: {
                  after: 240,
                }
              })
            )
          ]
        }]
      });

      // Generate and download
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `references-list-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${selectedData.length} references`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export references');
    }
  };

  const EntryCard = ({ entry, index }) => {
    const isSelected = selectedEntries.has(entry.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <div
          className={`card-floating cursor-pointer transition-all ${
            isSelected ? 'ring-2 ring-accent bg-accent-50/50' : ''
          }`}
          onClick={() => handleSelectEntry(entry.id)}
        >
          <div className="flex items-start space-x-4">
            <motion.div
              className="pt-1"
              whileTap={{ scale: 0.85 }}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-accent" />
              ) : (
                <Square className="w-5 h-5 text-secondary-400" />
              )}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-xs font-medium">
                  {entry.researchFocus}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDeleteEntry(entry.id, e)}
                  className="p-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete reference"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="font-semibold text-secondary-900 mb-2 line-clamp-3">
                {entry.citation}
              </div>

              <p className="text-secondary-600 text-sm line-clamp-2">
                {entry.narrative_overview}
              </p>

              <div className="mt-3 text-xs text-secondary-400">
                Added on {new Date(entry.createdAt?.toDate ? entry.createdAt.toDate() : entry.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-accent to-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FileText className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-secondary-600">Loading your sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Breadcrumb */}
        <FadeIn direction="up">
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/dashboard" className="text-secondary-500 hover:text-accent transition-colors">
                Dashboard
              </Link>
              <span className="text-secondary-300">/</span>
              <span className="text-secondary-900 font-medium">Source Library</span>
            </div>
          </div>
        </FadeIn>

        {/* Header */}
        <FadeIn direction="left">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2.5 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-xl transition-colors shadow-sm border border-secondary-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900">
                  Source <span className="text-gradient">Library</span>
                </h1>
                <p className="text-sm sm:text-base text-secondary-500 mt-1">
                  Advanced search, bulk operations, and export
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Actions Bar */}
        <FadeIn direction="up" delay={0.1}>
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Left side - Search and Filter */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10 pr-4 py-2.5 w-full sm:w-64 focus:shadow-glow-sm"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-input py-2.5"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Right side - Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                {canAccessFeature(userDocument, 'topic_outline') ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (selectedEntries.size < 2) {
                        toast.error('Please select at least 2 entries to analyze');
                        return;
                      }
                      const selectedData = entries.filter(e => selectedEntries.has(e.id));
                      navigate('/analyze', { state: { selectedEntries: selectedData } });
                    }}
                    disabled={selectedEntries.size < 2}
                    className={`btn ${
                      selectedEntries.size >= 2 ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'
                    }`}
                    title={selectedEntries.size < 2 ? 'Select at least 2 entries to analyze' : 'Generate topics and outlines'}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Selected
                  </motion.button>
                ) : (
                  <div className="relative group">
                    <button
                      disabled
                      className="btn btn-outline opacity-50 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Analyze Selected
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-primary-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      Idea & Outline Generator requires Researcher plan
                      <br />
                      <Link to="/pricing" className="text-accent-300 hover:underline underline">
                        Upgrade now →
                      </Link>
                    </div>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportReferencesList}
                  disabled={selectedEntries.size === 0}
                  className={`btn btn-outline ${
                    selectedEntries.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Export References
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportAnnotatedBibliography}
                  disabled={selectedEntries.size === 0}
                  className={`btn btn-outline ${
                    selectedEntries.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Export Detailed
                </motion.button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Selection Info */}
        <FadeIn direction="up" delay={0.15}>
          <div className="bg-secondary-50/50 rounded-xl p-4 mb-6 border border-secondary-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-secondary-900 hover:text-accent transition-colors"
                >
                  {selectedEntries.size === filteredEntries.length && filteredEntries.length > 0 ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                  <span className="font-medium">Select All</span>
                </button>
                <span className="text-secondary-500">
                  {selectedEntries.size} of {filteredEntries.length} entries selected
                </span>
              </div>

              <AnimatePresence>
                {selectedEntries.size > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSelectedEntries(new Set())}
                    className="text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>

        {/* Entries Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} variant="entry-card" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <FadeIn direction="up">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-secondary-300" />
              </div>
              <p className="text-secondary-500 text-lg">
                {searchTerm || selectedCategory !== 'all'
                  ? 'No entries found matching your filters'
                  : 'No source entries yet'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/create')}
                  className="btn btn-primary mt-6"
                >
                  Add Your First Source
                </motion.button>
              )}
            </div>
          </FadeIn>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredEntries.map((entry, index) => (
                <EntryCard key={entry.id} entry={entry} index={index} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* AI Analysis Feature Highlight */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-12 card-floating bg-gradient-to-br from-accent-50/50 to-primary-50/30">
            <div className="flex items-start space-x-4">
              <motion.div
                className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Brain className="w-6 h-6 text-accent-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  NEW: AI Writing Assistant
                </h3>
                <ul className="text-secondary-600 space-y-1 list-disc ml-4">
                  <li>Generate content ideas & detailed outlines from your selected entries</li>
                  <li>AI synthesizes your sources to suggest compelling angles</li>
                  <li>Maps evidence to outline sections automatically</li>
                  <li>Export publication-ready outlines to Word</li>
                </ul>
                <AnimatePresence>
                  {selectedEntries.size >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-3 bg-accent-50 rounded-xl"
                    >
                      <p className="text-accent-700 font-medium flex items-center">
                        <Brain className="w-4 h-4 mr-2" />
                        You have {selectedEntries.size} entries selected - perfect for analysis!
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            const selectedData = entries.filter(e => selectedEntries.has(e.id));
                            navigate('/analyze', { state: { selectedEntries: selectedData } });
                          }}
                          className="ml-auto btn btn-primary btn-sm"
                        >
                          Try It Now
                        </motion.button>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default BibliographyPage;

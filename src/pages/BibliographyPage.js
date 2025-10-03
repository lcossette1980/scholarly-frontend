import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserBibliographyEntries, deleteBibliographyEntry } from '../services/bibliography';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { exportToBibliography } from '../utils/exportUtils';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

const BibliographyPage = () => {
  const { currentUser } = useAuth();
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
        toast.error('Failed to load bibliography entries');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load bibliography entries');
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
      toast.success(`Exported ${selectedData.length} entries as annotated bibliography`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export bibliography');
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

  const EntryCard = ({ entry }) => {
    const isSelected = selectedEntries.has(entry.id);
    
    return (
      <div 
        className={`card cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-chestnut bg-chestnut/5' : 'hover:shadow-md'
        }`}
        onClick={() => handleSelectEntry(entry.id)}
      >
        <div className="flex items-start space-x-4">
          <div className="pt-1">
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-chestnut" />
            ) : (
              <Square className="w-5 h-5 text-charcoal/40" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <span className="px-2 py-1 bg-chestnut/10 text-chestnut rounded-full text-xs font-medium">
                {entry.researchFocus}
              </span>
              <button
                onClick={(e) => handleDeleteEntry(entry.id, e)}
                className="p-1 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete reference"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="font-semibold text-charcoal mb-2 line-clamp-3">
              {entry.citation}
            </div>
            
            <p className="text-charcoal/70 text-sm line-clamp-2">
              {entry.narrative_overview}
            </p>
            
            <div className="mt-3 text-xs text-charcoal/50">
              Added on {new Date(entry.createdAt?.toDate ? entry.createdAt.toDate() : entry.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-chestnut to-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-charcoal/70">Loading your bibliography...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal font-playfair">
                Bibliography Manager
              </h1>
              <p className="text-sm sm:text-base text-charcoal/70 font-lato">
                Select and export your bibliography entries
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Left side - Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 pr-4 py-2 w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Right side - Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
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
              </button>
              <button
                onClick={exportReferencesList}
                disabled={selectedEntries.size === 0}
                className={`btn btn-outline ${
                  selectedEntries.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Export References
              </button>
              <button
                onClick={exportAnnotatedBibliography}
                disabled={selectedEntries.size === 0}
                className={`btn btn-outline ${
                  selectedEntries.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Export Annotated
              </button>
            </div>
          </div>
        </div>

        {/* Selection Info */}
        <div className="bg-pearl/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-charcoal hover:text-chestnut transition-colors"
              >
                {selectedEntries.size === filteredEntries.length && filteredEntries.length > 0 ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span className="font-medium">Select All</span>
              </button>
              <span className="text-charcoal/70">
                {selectedEntries.size} of {filteredEntries.length} entries selected
              </span>
            </div>
            
            {selectedEntries.size > 0 && (
              <button
                onClick={() => setSelectedEntries(new Set())}
                className="text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Entries Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} variant="entry-card" />
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
            <p className="text-charcoal/60">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No entries found matching your filters' 
                : 'No bibliography entries yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* AI Analysis Feature Highlight */}
        <div className="mt-12 card bg-gradient-to-br from-chestnut/10 to-khaki/10">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-chestnut/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-chestnut" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-charcoal font-playfair mb-2">
                🚀 NEW: AI Research Assistant
              </h3>
              <ul className="text-charcoal/70 font-lato space-y-1 list-disc ml-4">
                <li>Generate article topics & detailed outlines from your selected entries</li>
                <li>AI synthesizes your research to suggest compelling angles</li>
                <li>Maps evidence to outline sections automatically</li>
                <li>Export publication-ready outlines to Word</li>
              </ul>
              {selectedEntries.size >= 2 && (
                <div className="mt-4 p-3 bg-chestnut/10 rounded-lg">
                  <p className="text-chestnut font-medium flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    You have {selectedEntries.size} entries selected - perfect for analysis!
                    <button
                      onClick={() => {
                        const selectedData = entries.filter(e => selectedEntries.has(e.id));
                        navigate('/analyze', { state: { selectedEntries: selectedData } });
                      }}
                      className="ml-auto btn btn-primary btn-sm"
                    >
                      Try It Now
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibliographyPage;
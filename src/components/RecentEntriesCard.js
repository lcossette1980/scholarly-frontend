// src/components/RecentEntriesCard.js
import React from 'react';
import { Eye, Brain, Trash2, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentEntriesCard = ({ entries, loading, onView, onAnalyze, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bibliography Entries Yet</h3>
        <p className="text-gray-600 mb-6">
          Start by uploading a research paper to create your first annotated bibliography entry.
        </p>
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <span>Create Your First Entry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-charcoal font-playfair">Recent Bibliography Entries</h2>
        <Link
          to="/bibliography"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Entries List */}
      <div className="divide-y divide-gray-200">
        {entries.map((entry, index) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            onView={onView}
            onAnalyze={onAnalyze}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {entries.length} most recent {entries.length === 1 ? 'entry' : 'entries'}
        </p>
        <Link
          to="/bibliography"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Manage All Entries →
        </Link>
      </div>
    </div>
  );
};

const EntryRow = ({ entry, onView, onAnalyze, onDelete }) => {
  // Parse citation to extract key info
  const parseAuthorYear = (citation) => {
    if (typeof citation === 'string') {
      // Try to extract author and year from string
      const yearMatch = citation.match(/\((\d{4})\)/);
      const year = yearMatch ? yearMatch[1] : '';

      // Get first author (everything before first comma or parenthesis)
      const authorMatch = citation.match(/^([^,(]+)/);
      const author = authorMatch ? authorMatch[1].trim() : 'Unknown Author';

      return { author, year };
    } else if (typeof citation === 'object') {
      return {
        author: citation.authors || 'Unknown Author',
        year: citation.year || ''
      };
    }
    return { author: 'Unknown', year: '' };
  };

  const getTitle = (entry) => {
    if (typeof entry.citation === 'object' && entry.citation.title) {
      return entry.citation.title;
    }
    // If citation is a string, use narrative overview or first 80 chars of citation
    return entry.narrative_overview
      ? entry.narrative_overview.substring(0, 80) + (entry.narrative_overview.length > 80 ? '...' : '')
      : typeof entry.citation === 'string'
      ? entry.citation.substring(0, 80) + (entry.citation.length > 80 ? '...' : '')
      : 'Untitled';
  };

  const { author, year } = parseAuthorYear(entry.citation);
  const title = getTitle(entry);
  const researchFocus = entry.researchFocus || entry.research_focus || 'Uncategorized';

  // Format date
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    try {
      // Handle Firestore Timestamp
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        return new Date(dateValue.toDate()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      // Handle plain object with seconds
      if (dateValue.seconds) {
        return new Date(dateValue.seconds * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      // Handle date string or Date object
      return new Date(dateValue).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start justify-between space-x-4">
        {/* Entry Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-charcoal mb-1 truncate group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span className="font-medium">{author}</span>
              {year && <span>({year})</span>}
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span className="truncate">{researchFocus}</span>
            </span>
            {entry.createdAt && (
              <>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="flex items-center space-x-1 hidden sm:inline-flex">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(entry.createdAt)}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onView(entry)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAnalyze(entry)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
            title="Analyze & Generate Topics"
          >
            <Brain className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentEntriesCard;

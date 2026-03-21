// src/components/RecentEntriesCard.js
import React from 'react';
import { Eye, Trash2, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn, StaggerChildren, StaggerItem } from './motion';

const RecentEntriesCard = ({ entries, loading, onView, onAnalyze, onDelete }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-secondary-100 rounded w-48 loading-shimmer"></div>
          <div className="h-5 bg-secondary-100 rounded w-20 loading-shimmer"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border border-secondary-100 rounded-xl p-4 loading-shimmer">
              <div className="h-5 bg-secondary-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-secondary-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-5xl mb-4 text-secondary-200 font-bold">0</p>
        <h3 className="text-lg font-semibold text-secondary-800 mb-2">No Source Entries Yet</h3>
        <p className="text-secondary-500 mb-6 text-sm">
          Upload a document to create your first source summary entry.
        </p>
        <Link
          to="/create"
          className="btn btn-primary inline-flex"
        >
          <span>Create Your First Entry</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <FadeIn direction="up" delay={0.2}>
      <div className="card overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Source Entries</h2>
          <Link
            to="/sources"
            className="text-accent hover:text-accent-700 font-medium text-sm flex items-center space-x-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Entries List */}
        <StaggerChildren className="divide-y divide-secondary-100">
          {entries.map((entry) => (
            <StaggerItem key={entry.id}>
              <EntryRow
                entry={entry}
                onView={onView}
                onAnalyze={onAnalyze}
                onDelete={onDelete}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Footer */}
        <div className="p-4 bg-secondary-50/50 border-t border-secondary-100 flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Showing {entries.length} most recent {entries.length === 1 ? 'entry' : 'entries'}
          </p>
          <Link
            to="/sources"
            className="text-sm font-medium text-accent hover:text-accent-700 transition-colors"
          >
            Manage All Entries
          </Link>
        </div>
      </div>
    </FadeIn>
  );
};

const EntryRow = ({ entry, onView, onAnalyze, onDelete }) => {
  const parseAuthorYear = (entry) => {
    // Try new source_info format first
    if (entry.source_info) {
      return {
        author: entry.source_info.author || 'Unknown Author',
        year: entry.source_info.year || ''
      };
    }
    // Fallback to old citation parsing
    const citation = entry.citation;
    if (typeof citation === 'string') {
      const yearMatch = citation.match(/\((\d{4})\)/);
      const year = yearMatch ? yearMatch[1] : '';
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
    // Try new source_info format first
    if (entry.source_info?.title) {
      return entry.source_info.title;
    }
    if (typeof entry.citation === 'object' && entry.citation.title) {
      return entry.citation.title;
    }
    const preview = entry.key_arguments || entry.narrative_overview;
    return preview
      ? preview.substring(0, 80) + (preview.length > 80 ? '...' : '')
      : typeof entry.citation === 'string'
      ? entry.citation.substring(0, 80) + (entry.citation.length > 80 ? '...' : '')
      : 'Untitled';
  };

  const { author, year } = parseAuthorYear(entry);
  const title = getTitle(entry);
  const researchFocus = entry.researchFocus || entry.research_focus || 'Uncategorized';

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    try {
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        return new Date(dateValue.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      if (dateValue.seconds) {
        return new Date(dateValue.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return new Date(dateValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="p-4 hover:bg-secondary-50/50 transition-colors group">
      <div className="flex items-start justify-between space-x-4">
        {/* Entry Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 mb-1 truncate group-hover:text-accent transition-colors text-sm">
            {title}
          </h3>
          <div className="flex items-center space-x-3 text-xs text-secondary-500">
            <span className="font-medium">{author}</span>
            {year && <span>({year})</span>}
            <span className="text-secondary-300">·</span>
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span className="truncate">{researchFocus}</span>
            </span>
            {entry.createdAt && (
              <>
                <span className="text-secondary-300 hidden sm:inline">·</span>
                <span className="flex items-center space-x-1 hidden sm:inline-flex">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(entry.createdAt)}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(entry)}
            className="p-2 text-secondary-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(entry)}
            className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Entry"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RecentEntriesCard;

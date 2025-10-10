// src/components/DashboardStats.js
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Brain, Sparkles } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

const DashboardStats = ({ entries, loading }) => {
  const { currentUser } = useAuth();
  const [generatedCount, setGeneratedCount] = useState(0);
  const [loadingGenerated, setLoadingGenerated] = useState(true);

  // Fetch generated content count from Firestore
  useEffect(() => {
    const fetchGeneratedCount = async () => {
      if (!currentUser) {
        setLoadingGenerated(false);
        return;
      }

      try {
        const jobsRef = collection(db, 'content_generation_jobs');
        const q = query(
          jobsRef,
          where('userId', '==', currentUser.uid),
          where('status', '==', 'completed')
        );
        const snapshot = await getDocs(q);
        setGeneratedCount(snapshot.size);
      } catch (error) {
        console.error('Error fetching generated content count:', error);
      } finally {
        setLoadingGenerated(false);
      }
    };

    fetchGeneratedCount();
  }, [currentUser]);

  const calculateStats = () => {
    if (!entries || entries.length === 0) {
      return {
        totalEntries: 0,
        thisMonth: 0,
        analysisReady: 0,
        generated: generatedCount
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonth = entries.filter(entry => {
      if (!entry.createdAt) return false;
      try {
        let entryDate;
        // Handle Firestore Timestamp
        if (entry.createdAt.toDate && typeof entry.createdAt.toDate === 'function') {
          entryDate = entry.createdAt.toDate();
        }
        // Handle plain object with seconds
        else if (entry.createdAt.seconds) {
          entryDate = new Date(entry.createdAt.seconds * 1000);
        }
        // Handle date string or Date object
        else {
          entryDate = new Date(entry.createdAt);
        }

        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;

    // Count entries that have been analyzed (have narrative_overview or analysis data)
    const analysisReady = entries.filter(entry =>
      entry.narrative_overview ||
      entry.narrativeOverview ||
      entry.analysis ||
      entry.core_findings ||
      entry.coreFindingsSummary
    ).length;

    return {
      totalEntries: entries.length,
      thisMonth: thisMonth,
      analysisReady: analysisReady,
      generated: generatedCount
    };
  };

  const stats = calculateStats();

  if (loading || loadingGenerated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={FileText}
        title="Total Entries"
        value={stats.totalEntries}
        color="blue"
      />
      <StatCard
        icon={Calendar}
        title="This Month"
        value={stats.thisMonth}
        subtitle={stats.thisMonth > 0 ? `${stats.thisMonth} new ${stats.thisMonth === 1 ? 'entry' : 'entries'}` : 'No new entries yet'}
        color="green"
      />
      <StatCard
        icon={Brain}
        title="Analysis Ready"
        value={stats.analysisReady}
        subtitle={stats.analysisReady > 0 ? `${Math.round((stats.analysisReady / stats.totalEntries) * 100)}% of total` : 'No entries analyzed'}
        color="purple"
      />
      <StatCard
        icon={Sparkles}
        title="Content Generated"
        value={stats.generated}
        subtitle="Papers created"
        color="orange"
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center space-x-4">
        <div className={`${colors.bg} rounded-lg p-3`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-charcoal">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

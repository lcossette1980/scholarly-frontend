// src/components/DashboardStats.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { StaggerChildren, StaggerItem, AnimatedCounter } from './motion';

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
        if (entry.createdAt.toDate && typeof entry.createdAt.toDate === 'function') {
          entryDate = entry.createdAt.toDate();
        } else if (entry.createdAt.seconds) {
          entryDate = new Date(entry.createdAt.seconds * 1000);
        } else {
          entryDate = new Date(entry.createdAt);
        }
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length;

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    { title: 'Total Entries', value: stats.totalEntries },
    { title: 'This Month', value: stats.thisMonth, subtitle: stats.thisMonth > 0 ? `${stats.thisMonth} new` : 'No new entries' },
    { title: 'Analysis Ready', value: stats.analysisReady, subtitle: stats.analysisReady > 0 ? `${Math.round((stats.analysisReady / Math.max(stats.totalEntries, 1)) * 100)}% of total` : 'None analyzed' },
    { title: 'Content Generated', value: stats.generated, subtitle: 'Documents created' },
  ];

  return (
    <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat) => (
        <StaggerItem key={stat.title}>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="bg-white rounded-xl border border-secondary-200 p-6 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-secondary-500 mb-1">{stat.title}</p>
              <AnimatedCounter
                target={stat.value}
                className="text-3xl font-bold text-secondary-900"
                duration={1}
              />
              {stat.subtitle && (
                <p className="text-xs text-secondary-400 mt-1">{stat.subtitle}</p>
              )}
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
};

export default DashboardStats;

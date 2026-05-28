// src/components/DashboardStats.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { AnimatedCounter } from './motion';

const DashboardStats = ({ entries, loading }) => {
  const { currentUser } = useAuth();
  const [generatedCount, setGeneratedCount] = useState(0);
  const [loadingGenerated, setLoadingGenerated] = useState(true);

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
      return { totalEntries: 0, thisMonth: 0, analysisReady: 0, generated: generatedCount };
    }
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonth = entries.filter((entry) => {
      if (!entry.createdAt) return false;
      try {
        let entryDate;
        if (entry.createdAt.toDate && typeof entry.createdAt.toDate === 'function') entryDate = entry.createdAt.toDate();
        else if (entry.createdAt.seconds) entryDate = new Date(entry.createdAt.seconds * 1000);
        else entryDate = new Date(entry.createdAt);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      } catch {
        return false;
      }
    }).length;
    const analysisReady = entries.filter((entry) =>
      (entry.key_arguments && entry.key_arguments.length > 0) ||
      (entry.core_findings && entry.core_findings.length > 0) ||
      (entry.interesting_angles && entry.interesting_angles.length > 0)
    ).length;
    return { totalEntries: entries.length, thisMonth, analysisReady, generated: generatedCount };
  };

  const stats = calculateStats();

  if (loading || loadingGenerated) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5">
            <div className="loading-shimmer h-3 rounded w-20 mb-3" />
            <div className="loading-shimmer h-7 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    { title: 'Total sources', value: stats.totalEntries, subtitle: null },
    { title: 'This month', value: stats.thisMonth, subtitle: stats.thisMonth > 0 ? 'new this month' : null },
    {
      title: 'Analyzed',
      value: stats.analysisReady,
      subtitle: stats.analysisReady > 0 ? `${Math.round((stats.analysisReady / Math.max(stats.totalEntries, 1)) * 100)}% of total` : null,
    },
    { title: 'Documents', value: stats.generated, subtitle: stats.generated > 0 ? 'completed' : null },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-secondary-200 rounded-lg overflow-hidden border border-secondary-200">
      {statItems.map((stat) => (
        <div key={stat.title} className="bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-secondary-500 font-medium mb-2">{stat.title}</p>
          <div className="flex items-baseline gap-2">
            <AnimatedCounter
              target={stat.value}
              className="text-2xl font-semibold text-secondary-900 tabular-nums tracking-tight"
              duration={0.8}
            />
            {stat.subtitle && (
              <span className="text-xs text-secondary-500">{stat.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

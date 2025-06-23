import React from 'react';

const LoadingSkeleton = ({ variant = 'default' }) => {
  if (variant === 'dashboard-stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-24 bg-charcoal/10 rounded mb-2"></div>
                <div className="h-8 w-16 bg-charcoal/10 rounded"></div>
              </div>
              <div className="w-12 h-12 bg-charcoal/10 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'entry-card') {
    return (
      <div className="card animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="w-5 h-5 bg-charcoal/10 rounded mt-1"></div>
          <div className="flex-1">
            <div className="h-6 w-20 bg-charcoal/10 rounded mb-3"></div>
            <div className="h-5 bg-charcoal/10 rounded mb-2"></div>
            <div className="h-4 bg-charcoal/10 rounded w-3/4 mb-3"></div>
            <div className="h-3 w-32 bg-charcoal/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <tr className="animate-pulse">
        <td className="px-6 py-4">
          <div className="h-4 bg-charcoal/10 rounded w-3/4"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-20 bg-charcoal/10 rounded"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-24 bg-charcoal/10 rounded"></div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-charcoal/10 rounded"></div>
            <div className="h-8 w-8 bg-charcoal/10 rounded"></div>
          </div>
        </td>
      </tr>
    );
  }

  // Default skeleton
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-charcoal/10 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-charcoal/10 rounded w-1/2"></div>
    </div>
  );
};

export default LoadingSkeleton;
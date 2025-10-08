import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Current Stage Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Events Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-3 text-gray-600">
            <FiRefreshCw className="animate-spin" size={20} />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
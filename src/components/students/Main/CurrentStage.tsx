import React from 'react';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import type { CurrentStage as CurrentStageType, DashboardStats } from '../../../lib/types/dashboardTypes';

interface CurrentStageProps {
  currentStage: CurrentStageType | null;
  stats: DashboardStats;
  errors: { [key: string]: string };
  onRetry: () => void;
}


const CurrentStage: React.FC<CurrentStageProps> = ({ currentStage, stats, errors, onRetry }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FiCheckCircle className="w-4 h-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <FiClock className="w-4 h-4 text-blue-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
    }
  };

  if (errors.stage) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiTrendingUp className="text-blue-600" />
            Current Stage Progress
          </h3>
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-red-600">
          <FiAlertCircle className="text-xl" />
          <p>Failed to load stage information</p>
        </div>
      </div>
    );
  }

  if (!currentStage) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <FiTrendingUp className="text-blue-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Current Stage Progress</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiClock className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Stage</h4>
          <p className="text-gray-500">You haven't been assigned to any stage yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiTrendingUp className="text-blue-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Current Stage Progress</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentStage.status)}`}>
          {currentStage.status.replace('_', ' ')}
        </span>
      </div>

      {/* Stage Info */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{currentStage.stageName}</h4>
        <p className="text-gray-600 mb-4">
          Started on {new Date(currentStage.started_at).toLocaleDateString()}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">{currentStage.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentStage.progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Activities */}
      {currentStage.activities && currentStage.activities.length > 0 && (
        <div>
          <h5 className="text-md font-semibold text-gray-900 mb-4">
            Activities ({stats.completedActivities}/{stats.totalActivities} completed)
          </h5>
          <div className="space-y-3">
            {currentStage.activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${activity.status === 'COMPLETED'
                    ? 'bg-green-50 border-green-200'
                    : activity.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <div className="flex-shrink-0">
                  {getActivityStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${activity.status === 'COMPLETED' ? 'text-green-900' : 'text-gray-900'
                    }`}>
                    {activity.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activity.required && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      Required
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${activity.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : activity.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {activity.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {currentStage.activities.length > 5 && (
              <p className="text-sm text-gray-500 text-center py-2">
                +{currentStage.activities.length - 5} more activities
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentStage;
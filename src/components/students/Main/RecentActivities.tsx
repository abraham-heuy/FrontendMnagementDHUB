import React from 'react';
import { FiActivity, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { Activity } from '../../../lib/types/dashboardTypes';

interface RecentActivitiesProps {
  activities: Activity[] | undefined;
  errors: { [key: string]: string };
  onRetry: () => void;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, errors, onRetry }) => {
  if (errors.stage) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiActivity className="text-purple-600" />
            Recent Activities
          </h3>
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiAlertCircle size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-red-600">
          <FiAlertCircle className="text-xl" />
          <p>Failed to load activities</p>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <FiActivity className="text-purple-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiActivity className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Activities Yet</h4>
          <p className="text-gray-500">Activities will appear here once you're assigned to a stage.</p>
        </div>
      </div>
    );
  }

  const recentActivities = activities.slice(0, 6);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <FiActivity className="text-purple-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
      </div>

      <div className="space-y-3">
        {recentActivities.map((activity) => (
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
              {activity.status === 'COMPLETED' ? (
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              ) : activity.status === 'IN_PROGRESS' ? (
                <FiClock className="w-5 h-5 text-blue-600" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-300"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${activity.status === 'COMPLETED' ? 'text-green-900' : 'text-gray-900'
                }`}>
                {activity.name}
              </p>
              <p className={`text-xs ${activity.status === 'COMPLETED' ? 'text-green-700' : 'text-gray-500'
                }`}>
                {activity.status.replace('_', ' ')}
              </p>
            </div>
            {activity.required && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                Required
              </span>
            )}
          </div>
        ))}
      </div>

      {activities.length > 6 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing 6 of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
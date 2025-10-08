import React from 'react';
import { FiBell, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import type { Notification } from '../../../lib/types/dashboardTypes';

interface RecentNotificationsProps {
  notifications: Notification[];
  errors: { [key: string]: string };
  onRetry: () => void;
}

const RecentNotifications: React.FC<RecentNotificationsProps> = ({ notifications, errors, onRetry }) => {
  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (errors.notifications) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiBell className="text-red-600" />
            Recent Notifications
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
          <p>Failed to load notifications</p>
        </div>
      </div>
    );
  }

  if (recentNotifications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <FiBell className="text-red-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBell className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h4>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FiBell className="text-red-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="space-y-3">
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border ${notification.is_read
                ? 'bg-gray-50 border-gray-200'
                : 'bg-red-50 border-red-200'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${notification.is_read ? 'bg-gray-200' : 'bg-red-500'
                }`}>
                {notification.is_read ? (
                  <FiCheckCircle className="w-4 h-4 text-gray-600" />
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${notification.is_read ? 'text-gray-900' : 'text-red-900'
                  }`}>
                  {notification.title}
                </h4>
                <p className={`text-xs mt-1 ${notification.is_read ? 'text-gray-600' : 'text-red-700'
                  }`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.created_at).toLocaleDateString()} at{' '}
                  {new Date(notification.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Showing 5 of {notifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentNotifications;
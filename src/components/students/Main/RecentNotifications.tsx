import React, { useState } from 'react';
import { FiBell, FiAlertCircle, FiCheckCircle, FiChevronRight, FiX, FiCheck, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../../lib/types/dashboardTypes';

interface RecentNotificationsProps {
  notifications: Notification[];
  errors: { [key: string]: string };
  onRetry: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (notificationId: string) => void;
  onClearAll: () => void;
}

const RecentNotifications: React.FC<RecentNotificationsProps> = ({
  notifications,
  errors,
  onRetry,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll
}) => {
  const navigate = useNavigate();
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);

  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasUnread = unreadCount > 0;

  const handleViewAll = () => {
    navigate('/dashboard/student/notifications');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    setExpandedNotification(expandedNotification === notification.id ? null : notification.id);
  };

  const getPriorityIcon = (notification: Notification) => {
    // You can customize this based on your notification types/priorities
    const type = notification.type || 'info';
    
    switch (type.toLowerCase()) {
      case 'alert':
      case 'warning':
        return <FiAlertCircle className="w-4 h-4 text-orange-500" />;
      case 'success':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FiBell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (notification: Notification) => {
    const type = notification.type || 'info';
    
    switch (type.toLowerCase()) {
      case 'alert':
      case 'warning':
        return 'border-l-orange-500 bg-orange-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  // --- Error State UI ---
  if (errors.notifications) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiBell className="text-green-600" />
            Recent Notifications
          </h3>
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
            title="Retry loading notifications"
          >
            <FiAlertCircle size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
          <FiAlertCircle className="text-xl flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Failed to load notifications</p>
            <p className="text-xs text-red-600 mt-1">Please try again</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Empty State UI ---
  if (recentNotifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiBell className="text-green-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-400 text-3xl" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">All Caught Up!</h4>
          <p className="text-gray-500 text-sm mb-4">No new notifications to show.</p>
          <button
            onClick={handleViewAll}
            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-2 mx-auto"
          >
            View Notification History
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // --- Main Content UI ---
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiBell className="text-green-600 text-xl" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
            <p className="text-xs text-gray-500 mt-1">Stay updated with latest activities</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnread && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        {hasUnread && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-2 text-xs text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
          >
            <FiCheck size={14} />
            Mark all read
          </button>
        )}
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <FiTrash2 size={14} />
          Clear all
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-xl border transition-all duration-200 cursor-pointer group ${
              !notification.is_read
                ? `${getPriorityColor(notification)} border-l-4 border-gray-200 hover:border-gray-300`
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Priority Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  !notification.is_read ? 'bg-white shadow-sm' : 'bg-gray-100'
                }`}>
                  {getPriorityIcon(notification)}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold leading-tight ${
                      !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></span>
                    )}
                  </div>
                  
                  <p className={`text-sm mt-2 ${
                    !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                  } ${expandedNotification === notification.id ? '' : 'line-clamp-2'}`}>
                    {notification.message}
                  </p>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} • {' '}
                      {new Date(notification.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          title="Mark as read"
                        >
                          <FiCheck size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear(notification.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Clear notification"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={handleViewAll}
            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FiEye size={16} />
            View All Notifications
            <FiChevronRight size={16} />
          </button>
          
          <span className="text-xs text-gray-500">
            Showing {recentNotifications.length} of {notifications.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentNotifications;
import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import { notificationService, type NotificationItem } from "../../../lib/services/notificationService";

const NotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const handleClearNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "success":
      case "SUCCESS":
        return <FiCheckCircle className="text-green-500" />;
      case "warning":
      case "WARNING":
        return <FiAlertTriangle className="text-yellow-500" />;
      case "error":
      case "ERROR":
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiInfo className="text-blue-500" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-green-600 text-3xl mr-3" />
          <span className="text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-8">
          <FiAlertCircle className="mx-auto text-3xl text-red-500 mb-3" />
          <p className="text-red-500 mb-2">Unable to load notifications</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiBell className="mr-3 text-green-600" />
            Notifications
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {notifications.filter((n) => !n.is_read).length} unread notification
            {notifications.filter((n) => !n.is_read).length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          {/* Mark All as Read */}
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FiCheckCircle size={16} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBell className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No notifications
          </h3>
          <p className="text-gray-600">
            {filter === "unread"
              ? "You're all caught up!"
              : "You don't have any notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${notification.is_read
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-200"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${notification.is_read
                        ? "text-gray-800"
                        : "text-gray-900"
                        }`}
                    >
                      {notification.type || "Notification"}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.message}
                    </p>
                    {notification.sender && (
                      <p className="text-gray-500 text-xs mt-1">
                        From: {notification.sender.name || notification.sender.email}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      {notification.created_at ? new Date(notification.created_at).toLocaleString() : "Just now"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <FiCheck size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleClearNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove notification"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
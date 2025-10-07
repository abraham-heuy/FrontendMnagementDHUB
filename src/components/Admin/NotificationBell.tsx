import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAsRead } from "../../lib/services/notificationService";

interface Notification {
  id: string;
  message: string;
  created_at?: string;
  is_read?: boolean;
}

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch notifications from backend
  useEffect(() => {
    const fetchUserNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getNotifications();

        // Deduplicate (just in case)
        const unique = Array.from(
          new Map(data.map((n) => [n.id, n])).values()
        );

        // Sort latest first
        unique.sort(
          (a, b) =>
            new Date(b.created_at ?? 0).getTime() -
            new Date(a.created_at ?? 0).getTime()
        );

        setNotifications(unique);
        setUnreadCount(unique.filter((n) => !n.is_read).length);
      } catch (err: any) {
        setError("Failed to load notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotifications();
  }, []);

  // ✅ Toggle popup visibility
  const togglePopup = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setUnreadCount(0); // Clear badge when opened
  };

  // ✅ Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // ✅ Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={togglePopup}
        className="relative focus:outline-none transition-transform hover:scale-105"
      >
        <Bell className="text-gray-600 w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {isOpen && (
        <>
          {/* Mobile background overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Popup container */}
          <div
            className={`
              absolute mt-2 w-72 bg-white rounded-xl shadow-xl border z-50 
              transform transition-all duration-200 
              origin-top-right 
              md:right-0 md:translate-x-0
              ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
              md:block
            `}
            style={{
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-center text-sm text-gray-500 py-6">
                  Loading...
                </p>
              ) : error ? (
                <p className="text-center text-sm text-red-500 py-6">
                  {error}
                </p>
              ) : notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                      n.is_read ? "opacity-70" : ""
                    }`}
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(n.created_at ?? "").toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-6">
                  No new notifications
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;

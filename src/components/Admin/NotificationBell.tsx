// src/components/Admin/NotificationBell.tsx
import React, { useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: 1, message: "New student registered", time: "2m ago" },
  { id: 2, message: "Event schedule updated", time: "10m ago" },
  // { id: 3, message: "Application received", time: "1h ago" },
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(mockNotifications.length);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset unread count when opening
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      {/* Bell with Badge */}
      <button onClick={togglePopup} className="relative focus:outline-none">
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
          {/* Background Blur for mobile modal feel */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl border z-50">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => setNotifications([])}
              >
                Clear All
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <span className="text-xs text-gray-500">{n.time}</span>
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

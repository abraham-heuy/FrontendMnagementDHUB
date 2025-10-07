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
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(mockNotifications.length);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
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

      {/* Notification Popup */}
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
              // Center on mobile for better look
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
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

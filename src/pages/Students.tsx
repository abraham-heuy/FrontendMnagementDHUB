import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiBell, FiMenu, FiPlus } from "react-icons/fi";
import Sidebar from "../components/students/Sidebar";
import { profileService } from "../lib/services/profileService";
import { notificationService } from "../lib/services/notificationService";
import type { NotificationItem } from "../lib/services/notificationService";

const apiURL = import.meta.env.VITE_API_URL;

interface User {
  name: string;
  email: string;
  role: string;
  image?: string;
}

const StudentPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ name: "", email: "", role: "" });
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // 🔔 Unread notifications
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Get logged-in user info
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${apiURL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setUser({
            name: data.fullName,
            email: data.email,
            role: data.role,
          });

          // After auth, check if profile exists; if not, redirect
          try {
            const profile = await profileService.getMyProfile();
            const isOnProfile = location.pathname.includes("/dashboard/student/profile");
            if (!profile && !isOnProfile) {
              navigate("/dashboard/student/profile");
            }
          } catch (_err) {
            // ignore profile fetch errors here
          }

          // 🔔 Fetch notifications
          try {
            const notifs: NotificationItem[] = await notificationService.getMyNotifications();
            const unread = notifs.filter((n) => !n.is_read).length;
            setUnreadCount(unread);
          } catch (err) {
            console.error("Failed to load notifications", err);
          }

        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        navigate("/auth/login");
      }
    };

    checkAuthStatus();
  }, [navigate, location.pathname]);

  // ✅ Get current tab name
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.endsWith("/student") || path.endsWith("/student/")) return "startup";
    return path.split("/").pop() as string;
  };

  return (
    <div className="bg-secondary h-screen overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar active={getCurrentTab()} open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Nav */}
        <div className="bg-white/60 backdrop-blur-md fixed w-full shadow-md z-10 top-0 left-0">
          <div className="flex items-center justify-between p-4 md:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setOpen(true)}
                className="mr-4 cursor-pointer text-gray-400 lg:hidden"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-600 capitalize">
                {getCurrentTab() === "home" ? "Dashboard" : getCurrentTab()}
              </h1>
            </div>

            {/* Avatar + Notifications */}
            <div className="flex items-center gap-4 space-x-4">
              <div className="flex gap-5 items-center bg-secondary rounded-lg py-1 px-3">
                {user.image ? (
                  <img className="w-8 h-8 rounded-full" src={user.image} alt={user.name} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-dark/20 text-gray-700 flex items-center justify-center font-bold text-sm">
                    {user.name && user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-md font-medium text-gray-800">
                  <FiPlus
                    className="inline-block mr-1 text-dark cursor-pointer"
                    size={24}
                    onClick={() => navigate("/dashboard/student/profile")}
                  />
                </span>
              </div>


              {/* 🔔 Notifications */}
              <button
                onClick={() => navigate("/dashboard/student/notifications")}
                className="relative p-2 text-dark hover:text-green-600 transition-colors"
              >
                <FiBell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0  bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 -right-1">
                    {unreadCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="space-y-6 p-4 md:p-6 mt-20   overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;

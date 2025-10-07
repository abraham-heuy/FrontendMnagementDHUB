import { useEffect, useState } from "react";
import Sidebar from "../components/Admin/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import NotificationBell from "../components/Admin/NotificationBell";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string;
}

const apiURL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ name: "", email: "", role: "" });
  const [open, setOpen] = useState(false);

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
            image: data.image,
          });
        } else {
          navigate("/admin/login");
        }
      } catch {
        navigate("/admin/login");
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.endsWith("/admin") || path.endsWith("/admin/")) return "dashboard";
    return path.split("/").pop() as string;
  };

  return (
    <div className="flex h-screen bg-secondary overflow-hidden">
      {/* Sidebar (fixed, non-scrollable) */}
      <Sidebar active={getCurrentTab()} open={open} setOpen={setOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpen(true)}
                className="mr-4 cursor-pointer text-gray-600 hover:text-green-600 transition lg:hidden"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-800 capitalize tracking-wide">
                {getCurrentTab() === "home" ? "Dashboard" : getCurrentTab()}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full transition cursor-pointer">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ✅ Scrollable Content Only */}
        <main className="flex-1 mt-16 overflow-y-auto bg-gray-50 p-4 md:p-6 rounded-t-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;

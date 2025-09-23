import { useEffect, useState } from "react";
import Sidebar from "../components/Admin/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { FiBell, FiMenu } from "react-icons/fi";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string;
}

const apiURL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: ""
  });
  const [open, setOpen] = useState(false);

  // Fetches user information from the API on component mount.
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${apiURL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          // Update the user state with fetched data, including the image.
          setUser({
            name: data.fullName,
            email: data.email,
            role: data.role,
            image: data.image // Make sure your API returns an image URL.
          });
        } else {
          // Redirect to login if authentication fails.
          navigate("/admin/login");
        }
      } catch (error) {
        // Redirect to login on network or other errors.
        navigate("/admin/login");
      }
    };
    checkAuthStatus();
  }, [navigate]);

  // Gets the current tab name from the URL pathname.
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.endsWith("/admin") || path.endsWith("/admin/")) return "dashboard";
    return path.split("/").pop() as string;
  };

  return (
    <div className="bg-secondary h-screen overflow-hidden flex">
      {/* Sidebar - Positioned separately */}
      <Sidebar
        active={getCurrentTab()}
        open={open}
        setOpen={setOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navigation Bar - Fixed Position */}
        <div className="bg-white/60 backdrop-blur-md fixed w-full shadow-md z-10 top-0 left-0">
          <div className="flex items-center justify-between p-4 md:px-6">
            {/* Left side: Menu toggle + Title */}
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

            {/* Right side: Avatar and Notifications */}
            <div className="flex items-center space-x-4">
              {/* Avatar Component: Renders image or initial */}
              <div className="flex gap-2 items-center bg-secondary rounded-lg py-1 px-3">
                {user.image ? (
                  // If a user image exists, display it.
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.image}
                    alt={user.name}
                  />
                ) : (
                  // If no image, display a circular placeholder with the first initial. 
                  <div className="w-8 h-8 rounded-full bg-secondary text-gray-700 flex items-center justify-center font-bold text-sm">
                    {user.name && user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-md font-medium text-gray-800">{user.name}</span>
              </div>

              {/* Notifications Button */}
              <button
                onClick={() => navigate("/dashboard/admin/notifications")}
                className="relative p-2 text-gray-500 hover:text-green-600 transition-colors"
              >
                <FiBell size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Adjusted to not be hidden by the fixed nav */}
        <div className="space-y-6 p-4 md:p-6 mt-20 mb-20 min-h-screen overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
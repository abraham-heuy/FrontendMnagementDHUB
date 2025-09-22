import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import baseURL from "../lib/environment";
import { FiBell, FiMenu } from "react-icons/fi";
import Sidebar from "../components/students/Sidebar";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string;
}
const Students = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ name: "", email: "", role: "" });
  const [open, setOpen] = useState(false);

  // get user infomation from the current user?
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${baseURL}/auth/current`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setUser({
            name: data.name,
            email: data.email,
            role: data.role,
          });
        } else {
          console.log(data);
          navigate("/auth/login");
        }
      } catch (error) {
        console.log(error);
        navigate("/auth/login");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // function to get current tab from the url
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.endsWith("/student") || path.endsWith("/student/")) return "startup";
    return path.split("/").pop() as string;
  };

  return (
    <div className="bg-secondary min-h-screen overflow-auto flex">
      {/* Sidebar */}
      <Sidebar active={getCurrentTab()} open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navigation */}
        <div className="bg-white/60 backdrop-blur-md fixed w-full shadow-md z-10">
          <div className="flex items-center justify-between p-4 md:px-6">
            {/* Left: Menu toggle + Title */}
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

            {/* Right: Notifications + Avatar */}
            <div className="mx-auto flex items-center space-x-4">
              {/* Avatar */}
              <div className="flex gap-5 items-center space-x-2 bg-gray-100 rounded-full py-1 px-3">
                <img
                  className="w-8 h-8 rounded-full md:flex hidden"
                  src={user.image}
                  alt={user.name}
                />
                <span className="text-md font-medium text-gray-800">{user.name}</span>
              </div>

              {/* Notifications */}
              <button
                onClick={() => navigate("notifications")}
                className="relative p-2 text-gray-500 hover:text-green-600 transition-colors"
              >
                <FiBell size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6 p-4 md:p-6 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Students
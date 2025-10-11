import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Bell, User, LogOut, Menu, X } from "lucide-react";
import { fetchMe, logout } from "../../utils/api";

const DedanGreen = "#0f5132";

interface NavLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function MentorNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mentorName, setMentorName] = useState("Mentor");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const notificationCount = 3;

  useEffect(() => {
    const loadMentor = async () => {
      try {
        const data = await fetchMe();
        if (data?.fullName) {
          setMentorName(data.fullName);
        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Failed to fetch mentor:", error);
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    loadMentor();
  }, [navigate]);

  const initials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const navLinks: NavLink[] = [
    { label: "Home", path: "/dashboard/mentor/home", icon: <Home size={18} /> },
    {
      label: "Notifications",
      path: "/dashboard/mentor/notifications",
      icon: (
        <div className="relative">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <nav className="bg-white shadow-md border-b border-emerald-100 py-4 text-center text-emerald-700 font-semibold">
        Loading mentor info...
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md border-b border-emerald-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: DedanGreen }}
          >
            M
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-900">
            Mentor Dashboard
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 relative">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition text-sm md:text-base"
            >
              {item.icon} {item.label}
            </Link>
          ))}

          {/* Profile Avatar (initials only) */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-emerald-700 text-white font-semibold flex items-center justify-center hover:bg-emerald-800 transition"
            >
              {initials}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-44 bg-white border border-emerald-100 rounded-lg shadow-lg py-2 animate-fadeIn">
                <div className="px-4 py-2 text-sm text-emerald-700 border-b border-emerald-100">
                  {mentorName}
                </div>
                <Link
                  to="/dashboard/mentor/profile"
                  className="flex items-center gap-2 px-4 py-2 text-emerald-800 hover:bg-emerald-50 w-full text-left"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/dashboard/mentor/logout"
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={16} /> Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-emerald-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 animate-slideDown">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-emerald-800 py-2 px-2 rounded-lg hover:bg-emerald-50 transition"
              >
                {item.icon} {item.label}
              </Link>
            ))}

            <Link
              to="/dashboard/mentor/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-2 text-emerald-800 hover:bg-emerald-50 rounded-lg"
            >
              <User size={18} /> Profile
            </Link>
            <Link
              to="/dashboard/mentor/logout"
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut size={16} /> Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

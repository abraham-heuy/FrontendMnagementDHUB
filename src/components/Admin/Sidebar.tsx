import React from "react";
import {
  Home,
  Calendar,
  FileText,
  Users,
  UserCheck,
  Bell,
  BarChart2,
  FileBarChart,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiX } from "react-icons/fi";
const apiURL = import.meta.env.VITE_API_URL;


export type DashboardTab =
  | "dashboard"
  | "events"
  | "applications"
  | "students"
  | "mentors"
  | "notifications"
  | "analytics"
  | "reports"
  | "settings"


const menuGroups: {
  title: string;
  items: { key: DashboardTab; label: string; icon: React.ReactElement; path: string }[];
}[] = [
    {
      title: "Main",
      items: [
        { key: "dashboard", label: "Home", icon: <Home />, path: "/dashboard/admin/home" },

        { key: "events", label: "Events", icon: <Calendar />, path: "/dashboard/admin/events" },

        { key: "applications", label: "Applications", icon: <FileText />, path: "/dashboard/admin/applications" },
      ]
    },
    {
      title: "People",
      items: [
        { key: "students", label: "Student Management", icon: <Users />, path: "/dashboard/admin/students" },

        { key: "mentors", label: "Mentors", icon: <UserCheck />, path: "/dashboard/admin/mentors" },

        { key: "notifications", label: "Notifications", icon: <Bell />, path: "/dashboard/admin/notifications" },
      ]
    },

    {
      title: "Data",
      items: [
        { key: "analytics", label: "Analytics", icon: <BarChart2 />, path: "/dashboard/admin/analytics" },
        { key: "reports", label: "Reports", icon: <FileBarChart />, path: "/dashboard/admin/reports" },
      ]
    },
  ];

const bottomMenu = [
  { key: "settings" as DashboardTab, lable: "Settings", icon: <Settings />, path: "/dashboard/admin/settings" },
]






const Sidebar = ({
  active,
  open,
  setOpen,
}: {
  active: string;
  open: boolean;
  setOpen: (o: boolean) => void;
}) => {

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.log(localStorage.getItem("token"));
        throw new Error("Logout failed");
      }
      console.log(`Logged out successfully, ${response.status}`);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {open && (
        <div
          className="absolute inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-secondary shadow-xl p-4 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-auto`}
      >
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb:4 sm:mb-6 ">
            <h2 className="text-base font-serif sm:text-lg font-semibold text-green-200 tracking-wide">
              Admin Dashboard
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-800"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="flex flex-col gap-4 sm:gap-6 overflow-y-auto">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <div className="rounded-md mb-4 flex justify-center items-center flex-col">
                  <p className="text-green-100 text-[11px] sm:text-xs font-serif italic">
                    {group.title}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.key}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-4 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base
                          ${active === item.key
                          ? "bg-green-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-green-50"
                        }`}
                    >
                      <span
                        className={`text-base sm:text-lg ${active === item.key
                          ? "text-white"
                          : "text-green-600"
                          }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        {/* Bottom Section */}
        <div className="flex-shrink-0 mt-2">
          <div className="flex flex-col gap-1">
            {bottomMenu.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base
                            ${active === item.key
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-green-50"
                  }`}
              >
                <span
                  className={`text-base sm:text-lg ${active === item.key ? "text-white" : "text-green-600"
                    }`}
                >
                  {item.icon}
                </span>
                <span>{item.lable}</span>
              </Link>
            ))}
          </div>
          <button
            onClick={() => handleLogout()}
            className="mt-2 mb-2 py-3 cursor-pointer px-4 flex items-center gap-2 w-full"
          >
            <FiLogOut className="text-base sm:text-lg text-green-600 font-semibold" />
            <span className="text-dark">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;



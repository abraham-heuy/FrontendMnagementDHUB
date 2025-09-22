import React from "react";
import {
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiLayers,
  FiLogOut,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import baseURL from "../../lib/environment";

export type DashboardTab =
  | "startup"
  | "progress"
  | "events"
  | "mentors"
  | "resources"
  | "notifications"
  | "profile";



const menuGroups: {
  title: string;
  items: { key: DashboardTab; label: string; icon: React.ReactElement; path: string }[];
}[] = [
    {
      title: "Main",
      items: [
        { key: "startup", label: "Dashboard", icon: <FiLayers />, path: "/dashboard/student" },
        { key: "progress", label: "Progress", icon: <FiTrendingUp />, path: "/dashboard/student/progress" },
        { key: "events", label: "Events", icon: <FiCalendar />, path: "/dashboard/student/events" }
      ]
    },
    {
      title: "Resources",
      items: [
        { key: "mentors", label: "Mentors", icon: <FiUsers />, path: "/dashboard/student/mentors" },
        { key: "resources", label: "Resources", icon: <FiBookOpen />, path: "/dashboard/student/resources" },
        { key: "notifications", label: "Notifications", icon: <FiBell />, path: "/dashboard/student/notifications" }
      ]
    }
  ];

const bottomMenu = [
  { key: "profile" as DashboardTab, lable: "Profile", icon: <FiUser />, path: "/dashboard/student/profile" }
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.log(localStorage.getItem("token"));
        throw new Error("Logout failed");
      }
      console.log(`Logged out successfully, ${response.status}`);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <>
      {/* Mobile overlay */}
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
  )
};

export default Sidebar;
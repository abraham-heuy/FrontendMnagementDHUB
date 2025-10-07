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
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

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
  | "logout";

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
    ],
  },
  {
    title: "People",
    items: [
      { key: "students", label: "Student Management", icon: <Users />, path: "/dashboard/admin/students" },
      { key: "mentors", label: "Mentors", icon: <UserCheck />, path: "/dashboard/admin/mentors" },
      { key: "notifications", label: "Notifications", icon: <Bell />, path: "/dashboard/admin/notifications" },
    ],
  },
  {
    title: "Data",
    items: [
      { key: "analytics", label: "Analytics", icon: <BarChart2 />, path: "/dashboard/admin/analytics" },
      { key: "reports", label: "Reports", icon: <FileBarChart />, path: "/dashboard/admin/reports" },
    ],
  },
];

const bottomMenu = [
  { key: "settings" as DashboardTab, label: "Settings", icon: <Settings />, path: "/dashboard/admin/settings" },
  { key: "logout" as DashboardTab, label: "Logout", icon: <LogOut />, path: "/dashboard/admin/logout" },
];

const Sidebar = ({
  active,
  open,
  setOpen,
}: {
  active: string;
  open: boolean;
  setOpen: (o: boolean) => void;
}) => {
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
        {/* Scrollable Area */}
        <div className="flex flex-col h-full overflow-y-auto justify-between pb-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-6">
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
            <nav className="flex flex-col gap-6">
              {menuGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-green-100 text-xs font-serif italic mb-2 px-2">
                    {group.title}
                  </p>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.key}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm
                          ${active === item.key
                            ? "bg-green-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-green-50"
                          }`}
                      >
                        <span
                          className={`text-lg ${active === item.key ? "text-white" : "text-green-600"
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

          {/* Bottom Section (Settings + Logout) */}
          <div className="mt-8 border-t border-green-200 pt-4">
            {bottomMenu.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm
                  ${active === item.key
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-green-50"
                  }`}
              >
                <span
                  className={`text-lg ${active === item.key ? "text-white" : "text-green-600"
                    }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

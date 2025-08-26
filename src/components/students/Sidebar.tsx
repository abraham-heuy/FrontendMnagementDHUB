import React from "react";
import {
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiLayers,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

export type DashboardTab =
  | "startup"
  | "progress"
  | "events"
  | "mentors"
  | "resources"
  | "notifications"
  | "profile";

const items: { key: DashboardTab; label: string; icon: React.ReactElement }[] = [
  { key: "startup", label: "Startup Info", icon: <FiLayers /> },
  { key: "progress", label: "Progress", icon: <FiTrendingUp /> },
  { key: "events", label: "Events", icon: <FiCalendar /> },
  { key: "mentors", label: "Mentorship", icon: <FiUsers /> },
  { key: "resources", label: "Resources", icon: <FiBookOpen /> },
  { key: "notifications", label: "Notifications", icon: <FiBell /> },
  { key: "profile", label: "Profile", icon: <FiUser /> },
];

const Sidebar = ({
  active,
  onChange,
  open,
  setOpen,
}: {
  active: DashboardTab;
  onChange: (t: DashboardTab) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className=" absolute inset-0 bg-black/80  z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-5 flex flex-col justify-between z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-screen`}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-green-600 tracking-wide">
              Incubation Dashboard
            </h2>
            <button 
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-800"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onChange(item.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
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
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-6 text-xs text-gray-400 text-center border-t mt-6">
          © 2025 Dekut Incubation
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
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

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen,
}) => {
  const sections = [
    {
      title: "Main",
      items: [
        { id: "dashboard", label: "Home", icon: Home },
        { id: "events", label: "Events", icon: Calendar },
        { id: "applications", label: "Applications", icon: FileText },
      ],
    },
    {
      title: "People",
      items: [
        { id: "students", label: "Student Management", icon: Users },
        { id: "mentors", label: "Mentors", icon: UserCheck },
        { id: "notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      title: "Data",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart2 },
        { id: "reports", label: "Reports", icon: FileBarChart },
      ],
    },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  return (
    <div
      className={`fixed md:static top-0 left-0 h-full w-64 bg-white text-gray-800 border-r border-gray-200 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}
    >
      <h2 className="text-2xl font-bold text-green-700 text-center py-6 border-b border-gray-200">
        DeSIC Admin
      </h2>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="mt-4">
            <p className="px-6 text-xs uppercase text-green-600 font-semibold">
              {section.title}
            </p>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false); // close sidebar after click (mobile)
                }}
                className={`flex items-center w-full px-6 py-3 text-left text-sm gap-3 rounded-md transition ${
                  activeSection === item.id
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-700"
                }`}
              >
                <item.icon
                  size={18}
                  className={`${
                    activeSection === item.id ? "text-green-700" : "text-gray-500"
                  }`}
                />
                {item.label}
              </button>
            ))}
            <hr className="my-3 border-gray-200" />
          </div>
        ))}
      </div>

      {/* Bottom Items */}
      <div className="border-t border-gray-200 mt-auto">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setIsOpen(false);
            }}
            className={`flex items-center w-full px-6 py-3 text-left text-sm gap-3 rounded-md transition ${
              activeSection === item.id
                ? "bg-green-100 text-green-700 font-medium"
                : "text-gray-700 hover:bg-gray-100 hover:text-green-700"
            }`}
          >
            <item.icon
              size={18}
              className={`${
                activeSection === item.id ? "text-green-700" : "text-gray-500"
              }`}
            />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

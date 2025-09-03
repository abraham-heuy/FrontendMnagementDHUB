import React, { useState } from "react";
import Sidebar from "../components/Admin/sidebar";
import DashboardOverview from "../components/Admin/home";
import Students from "../components/Admin/students";
import { Search, Bell, Settings, Menu, X } from "lucide-react";
import Events from "../components/Admin/events";
import Applications from "../components/Admin/applications";
import MentorManagement from "../components/Admin/mentors";
import Notifications from "../components/Admin/notifications";
import AccountSettings from "../components/Admin/settings";
import Logout from "../components/Admin/logout";
import Analytics from "../components/Admin/analytics";
import Reports from "../components/Admin/reports";

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview setActiveSection={setActiveSection} />;
      case "events":
        return <Events />;
      case "students":
        return <Students />;
      case "applications":
        return <Applications />;
      case "mentors":
        return <MentorManagement />;
      case "notifications":
        return <Notifications />;
      case "analytics":
        return <Analytics />;
      case "reports":
        return <Reports />;
      case "settings":
        return <AccountSettings />;
      case "logout":
        return <Logout />;
      default:
        return <DashboardOverview setActiveSection={setActiveSection} />;
    }
  };
  

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-white shadow px-4 md:px-6 py-4">
          {/* Hamburger only on mobile */}
          <button
            className="md:hidden text-green-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Search Bar */}
          <div className="flex items-center gap-2 border px-3 py-2 rounded-md w-1/2 md:w-1/3">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none text-sm"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            <Bell className="text-gray-600 cursor-pointer" />
            <Settings className="text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">Admin User</span>
            </div>
          </div>
        </div>

        {/* Dynamic Section */}
        <div className="flex-1 overflow-y-auto p-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminPage;

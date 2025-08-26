// Enhanced Students.tsx
import { useState } from "react";
import Sidebar, { type DashboardTab } from "../components/students/Sidebar";
import Topbar from "../components/students/Topbar";
import StartupStageTracker from "../components/students/StartupStageTracker";
import { events, mentors, notes, resources } from "../data/data";
import EventsList from "../components/students/EventsList";
import MentorsCard from "../components/students/MentorsCard";
import ResourcesGrid from "../components/students/ResourcesGrid";
import NotificationsPanel from "../components/students/NotificationsPanel";
import { FiLogOut, FiMenu, FiBell, FiUser } from "react-icons/fi";
import proImage from '../assets/images/success.png'
import { useNavigate } from "react-router-dom";

const STAGES = [
  { name: "Pre-Incubation", subStages: ["Ideation", "Concept & Problem", "Market Research", "Prototype", "Monthly Report"] },
  { name: "Incubation", subStages: ["BMC", "Business Plan", "Proof of Concept", "Team", "Pitch", "Monthly Report"] },
  { name: "Startup", subStages: ["Pitch", "Funding", "Product/Service", "Market Report"] },
];

const Students = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState<DashboardTab>("startup");
  const [open, setOpen] = useState(false);
  const [startup, setStartup] = useState({
    title: "AgroSense Analytics",
    stageIndex: 0,
    subStageIndex: 0,
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    image: proImage,
    email: "alex.johnson@example.com",
    startup: "AgroSense Analytics"
  };

  // Stage navigation
  const next = () => {
    const s = STAGES[startup.stageIndex];
    if (startup.subStageIndex < s.subStages.length - 1) {
      setStartup({ ...startup, subStageIndex: startup.subStageIndex + 1 });
    } else if (startup.stageIndex < STAGES.length - 1) {
      setStartup({ ...startup, stageIndex: startup.stageIndex + 1, subStageIndex: 0 });
    }
  };

  const prev = () => {
    if (startup.subStageIndex > 0) {
      setStartup({ ...startup, subStageIndex: startup.subStageIndex - 1 });
    } else if (startup.stageIndex > 0) {
      const prevStageIdx = startup.stageIndex - 1;
      const lastSub = STAGES[prevStageIdx].subStages.length - 1;
      setStartup({ ...startup, stageIndex: prevStageIdx, subStageIndex: lastSub });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar active={active} onChange={setActive} open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1  flex flex-col lg:ml-0">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4 md:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setOpen(true)}
                className="mr-4 text-gray-500 lg:hidden"
              >
                <FiMenu size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Incubation Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-green-600 transition-colors"
              >
                <FiBell size={20} />
                {notes.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notes.length}
                  </span>
                )}
              </button>

              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full py-1 px-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.image}
                  alt={user.name}
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.startup}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="hidden md:flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors"
              >
                <FiLogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              className="w-10 h-10 rounded-full"
              src={user.image}
              alt={user.name}
            />
            <div>
              <p className="font-medium text-gray-800">Welcome, {user.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">{user.startup}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-1 text-green-600"
          >
            <FiLogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 space-y-6">
          <Topbar
            title={
              active === "startup"
                ? "Startup Information"
                : active === "progress"
                  ? "Progress Tracking"
                  : active === "events"
                    ? "Events & Workshops"
                    : active === "mentors"
                      ? "Mentorship Program"
                      : active === "resources"
                        ? "Learning Resources"
                        : active === "profile"
                          ? "Profile Settings"
                          : "Notifications"
            }
            badge={active === "startup" ? STAGES[startup.stageIndex].name : undefined}
          />

          {/* Dashboard Content */}
          <div className="space-y-6">
            {active === "startup" && (
              <StartupStageTracker
                title={startup.title}
                stageIndex={startup.stageIndex}
                subStageIndex={startup.subStageIndex}
                stages={STAGES}
                onTitleChange={(v) => setStartup({ ...startup, title: v })}
              />
            )}

            {active === "progress" && (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <p className="text-blue-700">
                    Visualize all milestones across stages with a timeline and submissions. (Coming soon)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-700 font-medium">Completed Stages</p>
                    <p className="text-2xl font-bold text-green-800">2/7</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-700 font-medium">Pending Tasks</p>
                    <p className="text-2xl font-bold text-yellow-800">5</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">Days in Program</p>
                    <p className="text-2xl font-bold text-blue-800">64</p>
                  </div>
                </div>
              </section>
            )}

            {active === "events" && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <EventsList events={events} />
              </div>
            )}

            {active === "mentors" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <MentorsCard mentors={mentors} />
              </div>
            )}

            {active === "resources" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <ResourcesGrid resources={resources} />
              </div>
            )}

            {active === "notifications" && <NotificationsPanel items={notes} />}

            {active === "profile" && (
              <section className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Settings</h3>
                <div className="max-w-md space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={user.image}
                      alt={user.name}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                      <input
                        type="text"
                        defaultValue={user.startup}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <div className="w-full max-w-sm bg-white h-full shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <NotificationsPanel items={notes} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
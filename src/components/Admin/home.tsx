import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./flipcard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";



const DashboardOverview = () => {

  const navigate = useNavigate();

  // Dummy data for chart
  const data = [
    { day: "Mon", hours: 6 },
    { day: "Tue", hours: 7 },
    { day: "Wed", hours: 5 },
    { day: "Thu", hours: 8 },
    { day: "Fri", hours: 4 },
    { day: "Sat", hours: 6 },
    { day: "Sun", hours: 2 },
  ];

  // Dummy tasks
  const tasks = [
    { title: "Complete dashboard design", due: "02 Sep 2025", status: "Completed" },
    { title: "Prepare meeting notes", due: "03 Sep 2025", status: "In Progress" },
    { title: "Update mentor applications", due: "05 Sep 2025", status: "Pending" },
  ];

  // Flip card data
  const summaryCards = [
    { label: "Total Staff", value: 24 },
    { label: "Total Users", value: 20 },
    { label: "Active Events", value: 6 },
    { label: "Revenue", value: "Ksh.12.4K" },
  ];

  // Status badge colors
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Greeting */}
          <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Good Morning, Abraham
                </h2>
                <p className="text-sm text-slate-500">Here’s your daily overview</p>
              </div>
              <button
                className="mt-3 sm:mt-0 px-4 py-2 text-sm font-medium border border-sky-400 text-sky-500 rounded-xl hover:bg-sky-50"
                onClick={() => navigate("/dashboard/admin/settings")}
              >
                Account Settings
              </button>
            </div>
          </div>

          {/* My Tasks */}
          <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">My Tasks</h3>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-slate-700">{task.title}</p>
                    <p className="text-xs text-slate-500">Due: {task.due}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClasses(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Calendar</h3>
            <Calendar className="rounded-lg border border-slate-200" />
          </div>

          {/* Bar Graph */}
          <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Working Hours</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* Flip Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            {summaryCards.map((card, idx) => (
              <div key={idx} className="group perspective w-full h-28">
                <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                  {/* Front */}
                  <div className="absolute inset-0 bg-white shadow rounded-2xl p-4 flex flex-col items-center justify-center backface-hidden">
                    <p className="text-sm text-slate-500">{card.label}</p>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 bg-sky-500 text-white rounded-2xl p-4 flex items-center justify-center rotate-y-180 backface-hidden">
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Events Timeline */}
          <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Events</h3>
            <ul className="space-y-3 text-sm">
              <li className="border-l-2 border-sky-400 pl-3">
                <p className="font-medium text-slate-700">Team Meeting</p>
                <p className="text-xs text-slate-500">02 Sep 2025</p>
              </li>
              <li className="border-l-2 border-yellow-400 pl-3">
                <p className="font-medium text-slate-700">Project Deadline</p>
                <p className="text-xs text-slate-500">05 Sep 2025</p>
              </li>
              <li className="border-l-2 border-pink-400 pl-3">
                <p className="font-medium text-slate-700">Hackathon</p>
                <p className="text-xs text-slate-500">10 Sep 2025</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

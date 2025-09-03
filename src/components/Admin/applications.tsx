import React, { useState } from "react";

// Types
interface Application {
  id: number;
  name: string;
  event: string;
  status: "Pending" | "Approved" | "Rejected";
  idea: string;
}

const Applications: React.FC = () => {
  // Dummy data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      name: "John Doe",
      event: "Startup Pitch",
      status: "Pending",
      idea: "An AI-powered farming solution to optimize crop yields.",
    },
    {
      id: 2,
      name: "Jane Smith",
      event: "Tech Innovation Fair",
      status: "Pending",
      idea: "A mobile app for real-time traffic and accident reporting.",
    },
    {
      id: 3,
      name: "David Kim",
      event: "Hackathon 2025",
      status: "Pending",
      idea: "A blockchain-based student voting platform.",
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDownload, setShowDownload] = useState(false);

  // Handle approve/reject
  const handleDecision = (id: number, newStatus: "Approved" | "Rejected") => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    setSelectedApp(null); // Close modal
  };

  // Status badge styles
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-emerald-200 text-emerald-800"; // softer green
      case "Rejected":
        return "bg-rose-200 text-rose-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Applications</h2>
          <p className="text-sm text-slate-500">
            Manage and review student event applications
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring focus:ring-sky-300"
          />
          <select className="px-3 py-2 text-sm border rounded-xl text-slate-600">
            <option>All Events</option>
            <option>Startup Pitch</option>
            <option>Hackathon</option>
            <option>Innovation Fair</option>
          </select>

          {/* Download dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownload((prev) => !prev)}
              className="px-3 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
            >
              Download 
            </button>

            {showDownload && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border animate-fadeIn z-10">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">
                  All Applicants
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">
                  Reviewed
                </button>
                <div className="border-t my-1" />
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">
                  Approved Only
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">
                  Rejected Only
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications (Pending) */}
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Pending Applications
          </h3>
          <div className="space-y-4">
            {applications.filter((a) => a.status === "Pending").length === 0 && (
              <p className="text-sm text-slate-500">No pending applications</p>
            )}
            {applications
              .filter((a) => a.status === "Pending")
              .map((app) => (
                <div
                  key={app.id}
                  className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-700">{app.name}</h4>
                      <p className="text-xs text-slate-500">{app.event}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClasses(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {app.idea}
                  </p>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="mt-3 px-3 py-1 text-sm text-sky-500 border border-sky-400 rounded-lg hover:bg-sky-50 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Reviewed Applications */}
        <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Reviewed Applications
          </h3>
          <div className="space-y-4">
            {applications.filter((a) => a.status !== "Pending").length === 0 && (
              <p className="text-sm text-slate-500">No reviewed applications</p>
            )}
            {applications
              .filter((a) => a.status !== "Pending")
              .map((app) => (
                <div
                  key={app.id}
                  className="border rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-700">{app.name}</h4>
                      <p className="text-xs text-slate-500">{app.event}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClasses(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {app.idea}
                  </p>
                </div>
              ))}
          </div>
          {/* Download button placeholder */}
          <button className="mt-4 px-4 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition">
            Download Reviewed
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-slideUp">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              {selectedApp.name} - {selectedApp.event}
            </h3>
            <p className="text-sm text-slate-600 mb-4">{selectedApp.idea}</p>
            <textarea
              placeholder="Admin comments (optional)"
              className="w-full border rounded-lg p-2 mb-4 text-sm focus:outline-none focus:ring focus:ring-sky-300"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision(selectedApp.id, "Rejected")}
                className="px-4 py-2 text-sm rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => handleDecision(selectedApp.id, "Approved")}
                className="px-4 py-2 text-sm rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

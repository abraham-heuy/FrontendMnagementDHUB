import React, { useEffect, useState } from "react";
import { getEvents } from "../../lib/services/eventService";
import { getApplicationsForEvent, markApplicationResult } from "../../lib/services/applicationService";
import type { Application, EventSummary, TeamMember, } from "../../lib/types/appliction";

// === Types ===
type ApplicationView = {
  id: string;
  name?: string;
  event: string;
  status: "Pending" | "Approved" | "Rejected";
  businessIdea?: string;
  regNo?: string;
  email?: string;
  phone?: string;
  teamMembers?: string | TeamMember[];
  problemStatement?: string;
  solution?: string;
  targetMarket?: string;
  revenueModel?: string;
  appliedAt?: string;
  isPassed?: boolean;
};

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
}

const Applications: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<ApplicationView[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationView | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  // === Fetch events once ===
  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch((err) => console.error("Failed to load events", err));
  }, []);

  // === Fetch applications for a given event ===
  const handleViewApplicants = async (eventId: string) => {
    setSelectedEvent(eventId);
    setLoading(true);
    try {
      const apps = await getApplicationsForEvent(eventId);
      const formatted: ApplicationView[] = apps.map((a: any) => ({
        id: a.id,
        name: a.name,
        event: a.event?.title ?? "Untitled Event",
        status: a.isPassed === true ? "Approved" : (a.isPassed === false && a.result === "Rejected") ? "Rejected" : "Pending",
        businessIdea: a.businessIdea ?? "No idea provided.",
        regNo: a.regNo,
        email: a.email,
        phone: a.phone,
        teamMembers: a.teamMembers,
        appliedAt: a.appliedAt,
        isPassed: a.isPassed,
      }));
      setApplications(formatted);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  // === Approve / Reject handler ===
  const handleDecision = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      await markApplicationResult(id, newStatus === "Approved");
      setApplications((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus, isPassed: newStatus === "Approved" } : a
        )
      );
      setSelectedApp(null);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // === Status badge colors ===
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-emerald-200 text-emerald-800";
      case "Rejected":
        return "bg-rose-200 text-rose-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full">
      {/* === Header === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Applications</h2>
          <p className="text-sm text-slate-500">
            Manage and review applications for your events
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring focus:ring-sky-300"
          />
          <div className="relative">
            <button
              onClick={() => setShowDownload((prev) => !prev)}
              className="px-3 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition"
            >
              Download
            </button>
            {showDownload && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border animate-fadeIn z-10">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">All Applicants</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">Reviewed</button>
                <div className="border-t my-1" />
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">Approved Only</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-sky-50">Rejected Only</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === Events List === */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">Available Events</h3>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-2xl p-4 bg-white shadow hover:shadow-lg transition">
                <h4 className="font-medium text-slate-700">{event.title}</h4>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
                  <span>{new Date(event.date).toDateString()}</span>
                  <span>{event.location}</span>
                </div>
                <button
                  onClick={() => handleViewApplicants(event.id)}
                  className={`mt-3 px-3 py-1 text-sm rounded-lg w-full text-center ${
                    selectedEvent === event.id
                      ? "bg-sky-600 text-white"
                      : "border border-sky-400 text-sky-500 hover:bg-sky-50"
                  } transition`}
                >
                  View Applicants
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === Applications List === */}
      {selectedEvent && (
        <>
          {loading ? (
            <p className="text-center text-slate-500">Loading applicants...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Applications */}
              <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Pending Applications</h3>
                <div className="space-y-4">
                  {applications.filter((a) => a.status === "Pending").length === 0 && (
                    <p className="text-sm text-slate-500">No pending applications</p>
                  )}
                  {applications
                    .filter((a) => a.status === "Pending")
                    .map((app) => (
                      <div key={app.id} className="border rounded-xl p-4 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-700">{app.name}</h4>
                            <p className="text-xs text-slate-500">{app.event}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClasses(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{app.businessIdea}</p>
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
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Reviewed Applications</h3>
                <div className="space-y-4">
                  {applications.filter((a) => a.status !== "Pending").length === 0 && (
                    <p className="text-sm text-slate-500">No reviewed applications</p>
                  )}
                  {applications
                    .filter((a) => a.status !== "Pending")
                    .map((app) => (
                      <div key={app.id} className="border rounded-xl p-4 hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-700">{app.name}</h4>
                            <p className="text-xs text-slate-500">{app.event}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClasses(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{app.businessIdea}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* === Modal for Details === */}
      {selectedApp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-slideUp">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              {selectedApp.name} - {selectedApp.event}
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p><span className="font-medium text-slate-700">Registration No:</span> {selectedApp.regNo}</p>
              <p><span className="font-medium text-slate-700">Email:</span> {selectedApp.email}</p>
              <p><span className="font-medium text-slate-700">Phone:</span> {selectedApp.phone}</p>

              {selectedApp.teamMembers && (
                <div>
                  <span className="font-medium text-slate-700">Team Members:</span>
                  <ul className="list-disc list-inside ml-2">
                    {typeof selectedApp.teamMembers === "string"
                      ? selectedApp.teamMembers.split(",").map((m, idx) => <li key={idx}>{m.trim()}</li>)
                      : selectedApp.teamMembers.map((m: any, idx) => <li key={idx}>{m.name} ({m.email})</li>)}
                  </ul>
                </div>
              )}

              <p><span className="font-medium text-slate-700">Business Idea:</span> {selectedApp.businessIdea}</p>              <p>
          <span className="font-medium text-slate-700">Applied At:</span>{" "}
          {selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleString() : "—"}
        </p>
              <p><span className="font-medium text-slate-700">Status:</span>
                <span className={`px-2 py-1 ml-2 rounded-full text-white font-medium ${selectedApp.isPassed ? "bg-emerald-500" : "bg-yellow-500"}`}>
                  {selectedApp.isPassed ? "Approved" : "Pending"}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              {!selectedApp.isPassed && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;

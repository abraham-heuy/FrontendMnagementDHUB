import React, { useEffect, useState } from "react";
import { getEvents } from "../../lib/services/eventService";
import {
  approvePitchingApplication,
  getAllPitchingApplications,
  getApplicationsForEvent,
  markApplicationResult,
  rejectPitchingApplication,
} from "../../lib/services/applicationService";

interface TeamMember {
  name: string;
  email: string;
}

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

interface PitchApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  businessIdea: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  revenueModel: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const Applications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"event" | "pitch">("event");
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<ApplicationView[]>([]);
  const [pitchApps, setPitchApps] = useState<PitchApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // === Load events ===
  useEffect(() => {
    if (activeTab === "event") {
      getEvents()
        .then(setEvents)
        .catch((err) => console.error("Failed to load events", err));
    } else if (activeTab === "pitch") {
      loadPitchApplications();
    }
  }, [activeTab]);

  // === Load pitch applications ===
  const loadPitchApplications = async () => {
    setLoading(true);
    try {
      const list = await getAllPitchingApplications();
      const formatted = list.map((a: any) => ({
        id: a.application_id,
        first_name: a.first_name,
        last_name: a.last_name,
        email: a.email,
        phone: a.phone,
        businessIdea: a.businessIdea,
        problemStatement: a.problemStatement,
        solution: a.solution,
        targetMarket: a.targetMarket,
        revenueModel: a.revenueModel,
        status: a.status,
        createdAt: a.createdAt,
      }));
      setPitchApps(formatted);
    } catch (err) {
      console.error("Failed to fetch pitch apps:", err);
    } finally {
      setLoading(false);
    }
  };

  // === View event applicants ===
  const handleViewApplicants = async (eventId: string) => {
    setSelectedEvent(eventId);
    setLoading(true);
    try {
      const apps = await getApplicationsForEvent(eventId);
      const formatted: ApplicationView[] = apps.map((a: any) => ({
        id: a.id,
        name: a.name,
        event: a.event?.title ?? "Untitled Event",
        status:
          a.isPassed === true
            ? "Approved"
            : a.isPassed === false && a.result === "Rejected"
            ? "Rejected"
            : "Pending",
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

  // === Approve / Reject ===
  const handleDecision = async (
    id: string,
    newStatus: "Approved" | "Rejected"
  ) => {
    if (activeTab === "event") {
      try {
        await markApplicationResult(id, newStatus === "Approved");
        setApplications((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, status: newStatus, isPassed: newStatus === "Approved" }
              : a
          )
        );
      } catch (error) {
        console.error("Failed to update event app status", error);
      }
    } else {
      try {
        if (newStatus === "Approved") {
          await approvePitchingApplication(id);
        } else {
          await rejectPitchingApplication(id);
        }
        setPitchApps((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: newStatus.toLowerCase() as any } : a
          )
        );
      } catch (err) {
        console.error("Failed to update pitch app status:", err);
      }
    }
    setSelectedApp(null);
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-emerald-200 text-emerald-800";
      case "rejected":
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
            Manage and review applications
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("event")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              activeTab === "event"
                ? "bg-sky-500 text-white"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            Event Applications
          </button>
          <button
            onClick={() => setActiveTab("pitch")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              activeTab === "pitch"
                ? "bg-sky-500 text-white"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            Pitch Applications
          </button>
        </div>
      </div>

      {/* === EVENT TAB === */}
      {activeTab === "event" && (
        <>
          {/* Events List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Available Events
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-slate-500">No events found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-2xl p-4 bg-white shadow hover:shadow-lg transition"
                  >
                    <h4 className="font-medium text-slate-700">
                      {event.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {event.description}
                    </p>
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

          {/* Applicants */}
          {selectedEvent && (
            <>
              {loading ? (
                <p className="text-center text-slate-500">
                  Loading applicants...
                </p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending */}
                  <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Pending Applications
                    </h3>
                    <div className="space-y-4">
                      {applications
                        .filter((a) => a.status === "Pending")
                        .map((app) => (
                          <div
                            key={app.id}
                            className="border rounded-xl p-4 hover:shadow-lg transition"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-700">
                                  {app.name}
                                </h4>
                                <p className="text-xs text-slate-500">
                                  {app.event}
                                </p>
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
                              {app.businessIdea}
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

                  {/* Reviewed */}
                  <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Reviewed Applications
                    </h3>
                    <div className="space-y-4">
                      {applications
                        .filter((a) => a.status !== "Pending")
                        .map((app) => (
                          <div
                            key={app.id}
                            className="border rounded-xl p-4 hover:shadow-lg transition"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-700">
                                  {app.name}
                                </h4>
                                <p className="text-xs text-slate-500">
                                  {app.event}
                                </p>
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
                              {app.businessIdea}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* === PITCH TAB === */}
      {activeTab === "pitch" && (
        <div>
          {loading ? (
            <p className="text-center text-slate-500">Loading pitch apps...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending */}
              <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Pending Pitch Applications
                </h3>
                <div className="space-y-4">
                  {pitchApps
                    .filter((a) => a.status === "pending")
                    .map((app) => (
                      <div
                        key={app.id}
                        className="border rounded-xl p-4 hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-700">
                              {app.first_name} {app.last_name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {app.email}
                            </p>
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
                          {app.businessIdea}
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

              {/* Reviewed */}
              <div className="bg-white shadow rounded-2xl p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Reviewed Pitch Applications
                </h3>
                <div className="space-y-4">
                  {pitchApps
                    .filter((a) => a.status !== "pending")
                    .map((app) => (
                      <div
                        key={app.id}
                        className="border rounded-xl p-4 hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-700">
                              {app.first_name} {app.last_name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {app.email}
                            </p>
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
                          {app.businessIdea}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === Shared Modal === */}
      {/* === EVENT APPLICATION MODAL === */}
{selectedApp && activeTab === "event" && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-slideUp">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        {selectedApp.name} — {selectedApp.event}
      </h3>

      <div className="space-y-3 text-sm text-slate-700">
        <p><strong>Reg No:</strong> {selectedApp.regNo ?? "N/A"}</p>
        <p><strong>Email:</strong> {selectedApp.email ?? "N/A"}</p>
        <p><strong>Phone:</strong> {selectedApp.phone ?? "N/A"}</p>
        <p><strong>Business Idea:</strong> {selectedApp.businessIdea}</p>
        {selectedApp.teamMembers && (
          <p>
            <strong>Team Members:</strong>{" "}
            {Array.isArray(selectedApp.teamMembers)
              ? selectedApp.teamMembers.map((m: any) => m.name).join(", ")
              : selectedApp.teamMembers}
          </p>
        )}
        <p><strong>Status:</strong> {selectedApp.status}</p>
        <p>
          <strong>Applied On:</strong>{" "}
          {selectedApp.appliedAt
            ? new Date(selectedApp.appliedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setSelectedApp(null)}
          className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50 transition"
        >
          Close
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

{/* === PITCH APPLICATION MODAL === */}
{selectedApp && activeTab === "pitch" && (
  <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-slideUp max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">
        {selectedApp.first_name} {selectedApp.last_name}
      </h3>

      <div className="space-y-3 text-sm text-slate-700">
        <p><strong>Email:</strong> {selectedApp.email}</p>
        <p><strong>Phone:</strong> {selectedApp.phone}</p>
        <p><strong>Business Idea:</strong> {selectedApp.businessIdea}</p>
        <p><strong>Problem Statement:</strong> {selectedApp.problemStatement}</p>
        <p><strong>Solution:</strong> {selectedApp.solution}</p>
        <p><strong>Target Market:</strong> {selectedApp.targetMarket}</p>
        <p><strong>Revenue Model:</strong> {selectedApp.revenueModel}</p>
        <p><strong>Status:</strong> {selectedApp.status}</p>
        <p><strong>Applied On:</strong> {new Date(selectedApp.createdAt).toLocaleString()}</p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setSelectedApp(null)}
          className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-50 transition"
        >
          Close
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


import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  PenSquare,
  Plus,
  Info,
  X,
  Trash2,
  Edit,
  ChevronRight,
} from "lucide-react";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../../lib/services/eventService";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  objective: "",
  date: "",
  timeFrom: "",
  timeTo: "",
  details: "",
  category: "hackathon",
};
import type { Event } from "../../lib/types/events";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(""); // filter by date (optional)

  const [modalOpen, setModalOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<Event | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  //fetch the events!
  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getEvents();
        setEvents(list);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchData();
  }, []);
  const filteredEvents = useMemo(() => {
    let list = [...events].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }
    if (selectedDate) list = list.filter((e) => e.date === selectedDate);
    return list;
  }, [events, query, selectedDate]);

  // --- validators
  const validate = (payload: typeof form) => {
    const next: Record<string, string> = {};
    if (!payload.title.trim()) next.title = "Title is required.";
    if (!payload.description.trim())
      next.description = "Description is required.";
    if (!payload.location.trim()) next.location = "Location is required.";
    if (!payload.objective.trim()) next.objective = "Objective is required.";
    if (!payload.date) next.date = "Date is required.";
    if (!payload.timeFrom) next.timeFrom = "Start time is required.";
    if (!payload.timeTo) next.timeTo = "End time is required.";
    // simple time window check
    if (
      payload.timeFrom &&
      payload.timeTo &&
      payload.timeFrom >= payload.timeTo
    ) {
      next.timeTo = "End time must be after start time.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // --- helpers
  const resetForm = () => {
    setForm({ ...emptyForm });
    setErrors({});
  };
  const openDetails = (item: Event) => {
    setActiveEvent(item);
    setEditDraft(null);
    setEditing(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveEvent(null);
    setEditing(false);
    setEditDraft(null);
  };
  // ✅ Create event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setSubmitting(true);
    setMessage(null);

    const payload = {
      ...form,
      category:
        form.category === "other" && customCategory.trim()
          ? customCategory.toLowerCase()
          : form.category?.toLowerCase(),
    };

    try {
      const newEvent = await createEvent(payload);
      setEvents((prev) => [newEvent, ...prev]);
      resetForm();
      setMessage({ type: "success", text: "✅ Event created successfully!" });
    } catch (err) {
      console.error("Error creating event:", err);
      setMessage({ type: "error", text: "❌ Failed to create event." });
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Edit event
  const saveEdit = async () => {
    if (!editDraft) return;
    setMessage(null);
    try {
      const updated = await updateEvent(editDraft.id, {
        ...editDraft,
        category: editDraft.category?.toLowerCase(),
      });
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setActiveEvent(updated);
      setEditing(false);
      setMessage({ type: "success", text: "✅ Event updated successfully!" });
    } catch (err) {
      console.error("Failed to update event:", err);
      setMessage({ type: "error", text: "❌ Failed to update event." });
    }
  };

  // ✅ Delete event
  const handleDelete = async (id: string) => {
    setMessage(null);
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      closeModal();
      setMessage({ type: "success", text: "🗑️ Event deleted successfully!" });
    } catch (err) {
      console.error("Error deleting event:", err);
      setMessage({ type: "error", text: "❌ Failed to delete event." });
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full space-y-6">
      {/* HEADER / FILTERS (mobile first) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
            Events Management
          </h1>
          <p className="text-slate-500 text-sm">
            Create, preview, and manage events for DeSIC.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-300"
          />
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 pr-9 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-300"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* TOP: POST AN EVENT CARD */}
      <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-500" /> Post an event
            </h2>
            <p className="text-sm text-slate-500">
              Fill in the details below to publish a new event. All fields are
              required.
            </p>
          </div>
          <Info className="w-5 h-5 text-slate-300 hidden sm:block" />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* LEFT column */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                  errors.title
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-sky-300"
                }`}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-xs text-red-600">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Short Description
              </label>
              <input
                className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                  errors.description
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-sky-300"
                }`}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className={`mt-1 w-full rounded-xl border pl-9 pr-3 py-2 text-sm outline-none transition focus:ring-2 ${
                    errors.location
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-sky-300"
                  }`}
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-xs text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Objective
              </label>
              <input
                className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                  errors.objective
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-sky-300"
                }`}
                value={form.objective}
                onChange={(e) =>
                  setForm({ ...form, objective: e.target.value })
                }
              />
              {errors.objective && (
                <p className="mt-1 text-xs text-red-600">{errors.objective}</p>
              )}
            </div>
          </div>

          {/* RIGHT column */}
          <div className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  className={`mt-1 w-full rounded-xl border pr-9 px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                    errors.date
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-sky-300"
                  }`}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Time Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Time
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="time"
                    className={`w-full rounded-xl border pr-9 px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.timeFrom
                        ? "border-red-300 focus:ring-red-200"
                        : "border-slate-200 focus:ring-sky-300"
                    }`}
                    value={form.timeFrom}
                    onChange={(e) =>
                      setForm({ ...form, timeFrom: e.target.value })
                    }
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    className={`w-full rounded-xl border pr-9 px-3 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.timeTo
                        ? "border-red-300 focus:ring-red-200"
                        : "border-slate-200 focus:ring-sky-300"
                    }`}
                    value={form.timeTo}
                    onChange={(e) =>
                      setForm({ ...form, timeTo: e.target.value })
                    }
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              {(errors.timeFrom || errors.timeTo) && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.timeFrom || errors.timeTo}
                </p>
              )}
            </div>

            {/* Other details */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Other details
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-sky-300"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Add any instructions, materials, or notes..."
              />
            </div>

            {/* ✅ Category dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-sky-300 bg-white"
              >
                <option value="hackathon">Hackathon</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="training">Training</option>
                <option value="other">Other</option>
              </select>

              {form.category === "other" && (
                <input
                  type="text"
                  placeholder="Specify other category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                />
              )}
            </div>
          </div>

          {/* SUBMIT + message row */}
          <div className="md:col-span-2 flex flex-col items-start mt-2 space-y-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-medium shadow hover:brightness-110 active:brightness-95 transition disabled:opacity-60"
            >
              <PenSquare className="w-4 h-4" />
              {submitting ? "Posting…" : "Post Event"}
            </button>

            {message && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* BOTTOM: EVENTS LIST */}
      <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Events
            </h3>
            <p className="text-sm text-slate-500">Most recent first</p>
          </div>
          <button className="text-sky-600 text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
            More events <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-200 p-4 hover:shadow-md transition bg-white"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-slate-800">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {item.timeFrom}–{item.timeTo}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.objective}
                </p>
                <button
                  onClick={() => openDetails(item)}
                  className="text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  More details
                </button>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full p-6 text-center text-slate-500">
              No events match your filters.
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && activeEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 opacity-100 transition-opacity"
            onClick={closeModal}
          />
          {/* Panel */}
          <div className="relative w-[95vw] max-w-2xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-[fadeIn_.2s_ease-out]">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-800">
                {editing ? "Edit Event" : "Event Details"}
              </h4>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {!editing && (
              <div className="mt-4 space-y-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase text-slate-400">Title</p>
                    <p className="font-medium text-slate-800">
                      {activeEvent.title}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase text-slate-400">
                      Objective
                    </p>
                    <p className="font-medium text-slate-800">
                      {activeEvent.objective}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase text-slate-400">Date</p>
                    <p className="font-medium text-slate-800">
                      {activeEvent.date}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase text-slate-400">Time</p>
                    <p className="font-medium text-slate-800">
                      {activeEvent.timeFrom}–{activeEvent.timeTo}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs uppercase text-slate-400">Location</p>
                    <p className="font-medium text-slate-800">
                      {activeEvent.location}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 sm:col-span-2">
                    <p className="text-xs uppercase text-slate-400">
                      Description
                    </p>
                    <p className="text-slate-700">{activeEvent.description}</p>
                  </div>
                  {activeEvent.details && (
                    <div className="rounded-xl border border-slate-200 p-3 sm:col-span-2">
                      <p className="text-xs uppercase text-slate-400">
                        Details
                      </p>
                      <p className="text-slate-700">{activeEvent.details}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {editing && editDraft && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, title: e.target.value })
                  }
                  placeholder="Title"
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                  value={editDraft.objective}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, objective: e.target.value })
                  }
                  placeholder="Objective"
                />
                <input
                  type="date"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                  value={editDraft.date}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, date: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                    value={editDraft.timeFrom}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, timeFrom: e.target.value })
                    }
                  />
                  <input
                    type="time"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                    value={editDraft.timeTo}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, timeTo: e.target.value })
                    }
                  />
                </div>
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                  value={editDraft.location}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, location: e.target.value })
                  }
                  placeholder="Location"
                />
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                  value={editDraft.description}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, description: e.target.value })
                  }
                  placeholder="Short description"
                />
                <textarea
                  rows={3}
                  className="sm:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300"
                  value={editDraft.details ?? ""}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, details: e.target.value })
                  }
                  placeholder="Other details"
                />
              </div>
            )}

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
              {!editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(true);
                      setEditDraft({ ...activeEvent }); // initialize the edit draft
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activeEvent.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
                  >
                    <PenSquare className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditDraft(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
                  >
                    Cancel
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

export default Events;

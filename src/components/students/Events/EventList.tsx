// EventList.tsx
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import type { Event } from "../../../lib/types/events";
import { getEvents } from "../../../lib/services/eventService";
import { FiCalendar, FiLoader, FiAlertCircle, FiSearch } from "react-icons/fi";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search and filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;

    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "upcoming") return matchesSearch && eventDate >= today;
    if (filter === "past") return matchesSearch && eventDate < today;

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <div className="text-gray-600 flex items-center">
          <FiLoader className="mr-2" />
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load events</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="bg-white/60 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text flex items-center">
              <FiCalendar className="mr-3 text-green-200" />
              Upcoming Events
            </h2>
            <p className="text-light text-sm italic mt-1">
              {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Events</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back later for upcoming events"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
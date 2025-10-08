import React from 'react';
import { FiCalendar, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';
import type { Event } from '../../../lib/types/dashboardTypes';

interface UpcomingEventsProps {
  events: Event[];
  errors: { [key: string]: string };
  onRetry: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, errors, onRetry }) => {
  const upcomingEvents = events.filter(event => {
    try {
      return new Date(event.date) >= new Date();
    } catch {
      return false;
    }
  }).slice(0, 4);

  if (errors.events) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-indigo-600" />
            Upcoming Events
          </h3>
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiAlertCircle size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-red-600">
          <FiAlertCircle className="text-xl" />
          <p>Failed to load events</p>
        </div>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <FiCalendar className="text-indigo-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h4>
          <p className="text-gray-500">Check back later for new events.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <FiCalendar className="text-indigo-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => {
          const eventDate = new Date(event.date);
          const isToday = eventDate.toDateString() === new Date().toDateString();
          const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

          return (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm leading-tight">{event.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${isToday
                    ? 'bg-red-100 text-red-700'
                    : isTomorrow
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                  {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : eventDate.toLocaleDateString()}
                </span>
              </div>

              {event.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{event.description}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              {event.category && (
                <div className="mt-2">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {events.length > upcomingEvents.length && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            {events.length - upcomingEvents.length} past events
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
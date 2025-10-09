import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import type { Event } from '../../../lib/types/dashboardTypes';

interface UpcomingEventsProps {
  events: Event[];
  errors: { [key: string]: string };
  onRetry: () => void;
}

interface EventWithCountdown extends Event {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  eventDate: Date;
  isToday: boolean;
  isTomorrow: boolean;
  isThisWeek: boolean;
  isPast: boolean;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, errors, onRetry }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateCountdown = (eventDate: Date) => {
    const now = currentTime.getTime();
    const eventTime = eventDate.getTime();
    const timeDiff = eventTime - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const formatCountdown = (event: EventWithCountdown) => {
    if (event.days > 0) {
      return `${event.days}d ${event.hours}h ${event.minutes}m ${event.seconds}s`;
    } else if (event.hours > 0) {
      return `${event.hours}h ${event.minutes}m ${event.seconds}s`;
    } else {
      return `${event.minutes}m ${event.seconds}s`;
    }
  };

  const getUrgencyColor = (event: EventWithCountdown) => {
    if (event.days === 0 && event.hours < 24) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (event.days < 3) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (event.days < 7) {
      return 'bg-green-50 text-green-200  border-green-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Filter only upcoming events (no past events)
  const upcomingEvents = events
    .map(event => {
      try {
        const eventDate = new Date(event.date);
        const countdown = calculateCountdown(eventDate);

        // Only include future events (with at least 1 second remaining)
        if (countdown.isPast) {
          return null;
        }

        const isToday = eventDate.toDateString() === new Date().toDateString();
        const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
        const isThisWeek = countdown.days < 7;

        return {
          ...event,
          eventDate,
          isToday,
          isTomorrow,
          isThisWeek,
          ...countdown
        };
      } catch {
        return null;
      }
    })
    .filter((event): event is EventWithCountdown => event !== null)
    .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
    .slice(0, 4);

  const handleEventClick = () => {
    navigate('/dashboard/student/events');
  };

  if (errors.events) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiCalendar className="text-green-600" />
            Upcoming Events
          </h3>
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiAlertCircle size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 text-red-500">
          <FiAlertCircle className="text-xl" />
          <p>Failed to load events</p>
        </div>
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiCalendar className="text-green-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
        </div>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="text-gray-400 text-2xl" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Upcoming Events</h4>
          <p className="text-gray-500 text-sm">Check back later for new events.</p>
          <button
            onClick={handleEventClick}
            className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 mx-auto"
          >
            View all events
            <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiCalendar className="text-green-600 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
        </div>
        <button
          onClick={handleEventClick}
          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
        >
          View all
          <FiArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            // onClick={handleEventClick}
            className="border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-2 group-hover:text-green-700 transition-colors">
                  {event.title}
                </h4>

                {/* Event Date & Time */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    <span>All day</span>
                  </div>
                </div>
              </div>

              {/* Countdown Badge - Only for events within 7 days */}
              {event.isThisWeek ? (
                <div className={`flex flex-col items-center px-3 py-2 rounded-lg border ${getUrgencyColor(event)} min-w-[100px]`}>
                  <span className="text-xs font-medium mb-1">
                    {event.isToday ? 'Starts' : event.isTomorrow ? 'Tomorrow' : 'In'}
                  </span>
                  <span className="text-sm font-bold font-mono">
                    {formatCountdown(event)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 min-w-[100px]">
                  <span className="text-xs font-medium mb-1">
                    On
                  </span>
                  <span className="text-sm font-bold">
                    {event.eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {event.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    <span className="max-w-[100px] truncate">{event.location}</span>
                  </div>
                )}
              </div>

              {event.category && (
                <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-md ">
                  {formatCategory(event.category)}
                </span>
              )}
            </div>

            {/* Countdown for upcoming events (similar to EventCard) */}
            {event.isThisWeek && event.days <= 7 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between text-center">
                  {event.days > 0 && (
                    <div>
                      <div className="text-xl font-bold text-green-800">{event.days}</div>
                      <div className="text-xs text-green-600">Days</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xl font-bold text-green-800">{event.hours}</div>
                    <div className="text-xs text-green-600">Hours</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-800">{event.minutes}</div>
                    <div className="text-xs text-green-600">Minutes</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-800">{event.seconds}</div>
                    <div className="text-xs text-green-600">Seconds</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            {upcomingEvents.filter(e => e.isThisWeek).length} event{upcomingEvents.filter(e => e.isThisWeek).length !== 1 ? 's' : ''} this week
          </span>
          <span className="text-green-600 font-medium">
            Real-time updates
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
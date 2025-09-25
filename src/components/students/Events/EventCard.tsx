// EventCard.tsx
import React, { useState, useEffect } from "react";
import type { Event } from "../../../lib/types/events";
import {
  FiMapPin,
  FiClock,
  FiUser,
  FiArrowRight,
  FiExternalLink,
  FiShare2,
  FiUsers,
  FiTarget,
  FiImage
} from "react-icons/fi";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  // Combine date and time for proper datetime calculation
  const getEventDateTime = () => {
    return new Date(`${event.date}T${event.timeFrom}`);
  };

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDateTime = getEventDateTime();
      const now = new Date();
      const difference = eventDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPast: false
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    // Update countdown every second for upcoming events
    const eventDateTime = getEventDateTime();
    const now = new Date();
    if (eventDateTime > now) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event.date, event.timeFrom]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTimeRange = () => {
    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return `${formatTime(event.timeFrom)} - ${formatTime(event.timeTo)}`;
  };

  const getTimeRemaining = () => {
    const eventDateTime = getEventDateTime();
    const now = new Date();
    const diffTime = eventDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Event passed", type: "past" };
    if (diffDays === 0) return { text: "Today", type: "today" };
    if (diffDays === 1) return { text: "Tomorrow", type: "upcoming" };
    if (diffDays <= 7) return { text: `In ${diffDays} days`, type: "upcoming" };
    return { text: formatDate(event.date), type: "future" };
  };

  const timeInfo = getTimeRemaining();
  const isPastEvent = timeInfo.type === "past";

  // Format category name
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const isImageUrl = event.imageUrl && !imageError;

  // Countdown display component
  const CountdownDisplay = () => {
    if (!timeLeft) return null;

    if (timeLeft.isPast) {
      return (
        <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
          Event passed
        </div>
      );
    }

    if (timeLeft.days > 7) {
      return (
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
          {formatDate(event.date)}
        </div>
      );
    }

    return (
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1 ${isPastEvent ? 'opacity-80' : ''
      }`}>
      {/* Event Image */}
      <div className="relative h-40 bg-gray-100">
        {isImageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <FiImage className="text-gray-400 text-4xl mb-2" />
            <span className="text-gray-500 text-sm">No image available</span>
          </div>
        )}

        {/* Date Badge */}
        <div className={`absolute top-4 left-4 px-3 py-2 rounded-lg ${isPastEvent ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-md'
          }`}>
          <div className="text-center">
            <div className="text-sm font-bold">{getEventDateTime().getDate()}</div>
            <div className="text-xs uppercase">
              {getEventDateTime().toLocaleString('default', { month: 'short' })}
            </div>
          </div>
        </div>

        {/* Countdown/Status Badge */}
        <div className="absolute top-4 right-4">
          <CountdownDisplay />
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {formatCategory(event.category || 'event')}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{event.title}</h3>

        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
        )}

        {/* Objective */}
        {event.objective && (
          <div className="flex items-start text-sm text-gray-600 mb-3">
            <FiTarget className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{event.objective}</span>
          </div>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FiClock className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{formatTimeRange()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {event.createdBy && (
            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="mr-2 text-gray-400 flex-shrink-0" />
              <span>By {event.createdBy.fullName}</span>
            </div>
          )}

          {/* Applications Count */}
          {event.applications && event.applications.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <FiUsers className="mr-2 text-gray-400 flex-shrink-0" />
              <span>{event.applications.length} registered</span>
            </div>
          )}
        </div>

        {/* Countdown for upcoming events */}
        {timeLeft && !timeLeft.isPast && timeLeft.days <= 7 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between text-center">
              {timeLeft.days > 0 && (
                <div>
                  <div className="text-2xl font-bold text-green-800">{timeLeft.days}</div>
                  <div className="text-xs text-green-600">Days</div>
                </div>
              )}
              <div>
                <div className="text-2xl font-bold text-green-800">{timeLeft.hours}</div>
                <div className="text-xs text-green-600">Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">{timeLeft.minutes}</div>
                <div className="text-xs text-green-600">Minutes</div>
              </div>
              {timeLeft.days === 0 && (
                <div>
                  <div className="text-2xl font-bold text-green-800">{timeLeft.seconds}</div>
                  <div className="text-xs text-green-600">Seconds</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Details */}
        {event.details && (
          <details className="group mb-4">
            <summary className="text-sm text-green-600 font-medium cursor-pointer hover:text-green-700 list-none">
              More details
            </summary>
            <p className="text-gray-600 text-sm mt-2 pl-4 border-l-2 border-green-200">
              {event.details}
            </p>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button className={`flex items-center text-sm font-medium transition-colors ${isPastEvent
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-green-600 hover:text-green-700'
            }`}>
            {isPastEvent ? 'View Recap' : 'Register Now'}
            <FiArrowRight className="ml-1" />
          </button>

          <div className="flex space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Share event"
            >
              <FiShare2 size={16} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="View event details"
            >
              <FiExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
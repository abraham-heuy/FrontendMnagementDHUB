import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSignInAlt,
} from "react-icons/fa";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiX,
  FiArrowRight,
  FiTag
} from "react-icons/fi";
import { getEvents, getEventsByCategory } from "../lib/services/eventService";
import type { Event } from "../lib/types/events";
import { motion, AnimatePresence } from "framer-motion";
import { heroImg, loginBanner, mentorIllustration, galleryImages } from "../constants/Index";
import { formatTime } from "../constants/Formats";

// Login Modal Component
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: "admin",
      color: "bg-green-600 hover:bg-green-700",
      label: "Administrator",
      icon: <FaUserShield className="text-lg" />,
      description: "Manage platform operations"
    },
    {
      id: "mentor",
      color: "bg-emerald-600 hover:bg-emerald-700",
      label: "Mentor",
      icon: <FaChalkboardTeacher className="text-lg" />,
      description: "Guide and support students"
    },
    {
      id: "mentee",
      color: "bg-blue-600 hover:bg-blue-700",
      label: "Student / Mentee",
      icon: <FaUserGraduate className="text-lg" />,
      description: "Embark on your journey"
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    onClose();
    navigate(`/auth?role=${roleId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <FaSignInAlt className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-xs md:text-sm text-gray-600">Choose your role to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Role Selection */}
        <div className="p-4 md:p-5">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full flex items-center gap-3 p-3 md:p-4 text-left text-white rounded-lg shadow-md transition-all ${role.color}`}
                  >
                    <div className="flex-shrink-0">
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm md:text-base">
                        {role.label}
                      </div>
                      <div className="text-xs text-white/90">
                        {role.description}
                      </div>
                    </div>
                    <FiArrowRight className="flex-shrink-0 text-white/80 text-sm" />
                  </motion.button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-center text-gray-600 text-xs md:text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  navigate("/apply");
                }}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Apply to become a mentee
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Landing = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [limit, setLimit] = useState(5);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<typeof galleryImages[0] | null>(null);
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Sarah W.",
      message:
        "LearnHub transformed the way I learn! The mentorship program helped me gain real-world confidence.",
      rating: 5,
    },
    {
      name: "James K.",
      message:
        "The events are insightful and engaging. The mentors are truly supportive and inspiring.",
      rating: 4,
    },
    {
      name: "Amina L.",
      message:
        "I love how LearnHub connects learners with real experts. Highly recommended!",
      rating: 5,
    },
    {
      name: "Kevin M.",
      message:
        "An incredible space for young innovators. The support system here is unmatched!",
      rating: 5,
    },
  ];

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        const today = new Date();
        const upcoming = data
          .filter((e) => new Date(e.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(upcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Carousel auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () =>
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  // Slice events based on limit
  const displayedEvents = events.slice(0, limit);



  return (
    <main className="relative">
      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* ===== Hero Section ===== */}
      <section className="relative h-full">
        <Navigation
          onFilter={async (category) => {
            try {
              const data = await getEventsByCategory(category);
              const today = new Date();
              const upcoming = data
                .filter((e) => new Date(e.date) >= today)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              setEvents(upcoming);
            } catch (error) {
              console.error("Error filtering events:", error);
            }
          }}
          onLogin={() => setShowLoginModal(true)}
        />
        <Hero onLogin={() => setShowLoginModal(true)} />
      </section>

      {/* ===== Events Section ===== */}
      <section id="events-section" className="py-12 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <div className="flex justify-center items-center  flex-col w-full text-start">
              <h2 className="text-xl md:text-2xl font-bold text-green-800 mb-0.5">
                Upcoming Events
              </h2>
              <p className="text-sm text-gray-600">
                Workshops, seminars, and networking opportunities
              </p>
            </div>
            {events.length > limit && (
              <button
                onClick={() => setLimit(events.length)}
                className="text-xs font-semibold text-green-800 hover:text-green-900 flex items-center gap-1.5"
              >
                View All ({events.length})
                <FiArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-green-50 border border-gray-200 rounded-lg p-4 hover:border-green-800 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-800 text-white p-2 rounded">
                      <FiCalendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-800">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs italic font-extralight text-dark">
                        {formatTime(event.timeFrom)} - {formatTime(event.timeTo)}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-gray-100 text-green-800 text-sm font-semibold rounded flex-shrink-0">
                    <FiTag className="w-3 h-3 inline mr-1" />
                    {event.category || "General"}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-lg font-semibold text-dark mb-2 line-clamp-2 group-hover:text-green-800 transition-colors leading-tight">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Location */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
                  <FiMapPin className="w-3.5 h-3.5 text-green-800 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>

                {/* Action Button */}
                <button className="w-fit px-2 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-green-800 hover:text-green-900 transition-colors group cursor-pointer hover:bg-dark/20 rounded ">
                  View Details
                  <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {events.length > limit && (
            <div className="text-center mt-6">
              <button
                onClick={() => setLimit(events.length)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-800 text-white text-sm font-semibold rounded-lg hover:bg-green-900 transition-colors shadow-sm"
              >
                View All {events.length} Events
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {displayedEvents.length === 0 && (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-600 mb-1">No upcoming events</p>
              <p className="text-xs text-gray-500">Check back soon for exciting opportunities!</p>
            </div>
          )}
        </div>
      </section>      {/* ===== Modal for Event Details ===== */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative bg-green-900 text-white p-5">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 pr-8">
                  <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                    <FiCalendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 text-green-800 text-xs font-bold rounded mb-2">
                      <FiTag className="w-3 h-3" />
                      {selectedEvent.category || "General Event"}
                    </span>
                    <h2 className="text-xl font-bold leading-tight mb-1">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-xs italic font-extralight  text-secondary leading-snug">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto max-h-[calc(85vh-220px)]">
                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-green-200/60">
                  <div className="text-center ">
                    <FiCalendar className="w-4 h-4 text-green-800 mx-auto mb-1.5" />
                    <div className="text-xs text-gray-500 mb-1 font-semibold">Date</div>
                    <div className="text-sm font-bold text-black">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <FiClock className="w-4 h-4 text-green-800 mx-auto mb-1.5" />
                    <div className="text-xs text-gray-500 mb-1 font-semibold">Time</div>
                    <div className="text-sm font-semibold text-black">
                      {formatTime(selectedEvent.timeFrom)} - {formatTime(selectedEvent.timeTo)}
                    </div>
                  </div>
                  <div className="text-center">
                    <FiMapPin className="w-4 h-4 text-green-800 mx-auto mb-1.5" />
                    <div className="text-xs text-gray-500 mb-1 font-semibold">Location</div>
                    <div className="text-sm font-bold text-black line-clamp-1">
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>

                {/* Event Objective */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-green-800 rounded"></span>
                    Objective
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedEvent.objective}
                  </p>
                </div>

                {/* Event Details */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-green-800 rounded"></span>
                    Details
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedEvent.details}
                  </p>
                </div>

                {/* Organizer Info */}
                {selectedEvent.createdBy && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-bold text-green-800">Organized by:</span>{" "}
                      <span className="font-semibold text-black">{selectedEvent.createdBy.fullName}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate(`/apply/${selectedEvent.id}`);
                  }}
                  className="px-5 py-2 bg-green-800 text-white rounded-lg text-sm font-semibold hover:bg-green-900 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Apply Now
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====== Gallery Section ====== */}

      <section className="relative flex items-center py-16 md:py-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 pointer-events-none"></div>

        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 shadow-sm min-h-[75vh]">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center border-b border-green-800/20 py-2 mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">
              Gallery
            </h2>
            <p className="text-sm md:text-base text-green-600 max-w-2xl mx-auto">
              Capturing moments of innovation, collaboration, and success from our vibrant community
            </p>
          </motion.div>

          {/* Infinite Scrolling Gallery Container */}
          <div className="relative overflow-hidden rounded-xl">
            {/* Add custom CSS for smooth animation */}
            <style>{`
              @keyframes smoothScroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              
              .gallery-scroll {
                animation: smoothScroll 60s linear infinite;
                will-change: transform;
              }
              
              .gallery-scroll:hover {
                animation-play-state: paused;
              }
              
              .gallery-card {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }
              
              .gallery-card:hover {
                transform: translateY(-8px) scale(1.05);
                z-index: 20;
              }
              
              .gallery-overlay {
                backdrop-filter: blur(1px);
              }
            `}</style>

            {/* Gradient Overlays for Edge Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-dark/40 via-dark/20 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-dark/40 via-dark/20 to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Container */}
            <div className="flex gallery-scroll gap-4 py-4">
              {/* First set of images */}
              {galleryImages.map((image, index) => (
                <motion.div
                  key={`first-${image.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedGalleryImage(image)}
                  className="gallery-card relative flex-shrink-0 w-[240px] md:w-[280px] h-[200px] md:h-[240px] rounded-lg overflow-hidden shadow-md hover:shadow-2xl group bg-gray-100 cursor-pointer"
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay with event details - shows on hover */}
                  <div className="gallery-overlay absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all duration-400 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                      <h3 className="text-white font-bold text-base mb-1.5 leading-tight">
                        {image.title}
                      </h3>
                      <p className="text-white/90 text-xs mb-2 leading-relaxed line-clamp-2">
                        {image.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/90">
                        <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full backdrop-blur-sm">
                          <FiCalendar className="w-3 h-3" />
                          {image.date}
                        </span>
                        <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full backdrop-blur-sm">
                          <FaUserGraduate className="w-3 h-3" />
                          {image.participants}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"></div>
                </motion.div>
              ))}

              {/* Duplicate set for seamless loop */}
              {galleryImages.map((image) => (
                <motion.div
                  key={`second-${image.id}`}
                  onClick={() => setSelectedGalleryImage(image)}
                  className="gallery-card relative flex-shrink-0 w-[240px] md:w-[280px] h-[200px] md:h-[240px] rounded-lg overflow-hidden shadow-md hover:shadow-2xl group bg-gray-100 cursor-pointer"
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay with event details - shows on hover */}
                  <div className="gallery-overlay absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-all duration-400 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                      <h3 className="text-white font-bold text-base mb-1.5 leading-tight">
                        {image.title}
                      </h3>
                      <p className="text-white/90 text-xs mb-2 leading-relaxed line-clamp-2">
                        {image.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/90">
                        <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full backdrop-blur-sm">
                          <FiCalendar className="w-3 h-3" />
                          {image.date}
                        </span>
                        <span className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full backdrop-blur-sm">
                          <FaUserGraduate className="w-3 h-3" />
                          {image.participants}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Decorative Text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 md:mt-16"
          >
            <p className="text-xs md:text-sm text-gray-500 italic">
              Hover to pause • Click to view full image
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Improved Gallery Lightbox Modal ===== */}
      <AnimatePresence>
        {selectedGalleryImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
              className="relative w-full max-w-5xl h-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedGalleryImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-green-400 transition-colors p-2 rounded-full hover:bg-white/10 z-20"
                aria-label="Close"
              >
                <FiX className="w-7 h-7 md:w-8 md:h-8" />
              </button>

              {/* Main Content Container */}
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Image Container - Takes 60% of modal height */}
                <div className="relative bg-gray-900 w-full  p-3  flex items-center justify-center" style={{ height: '55vh', minHeight: '200px', maxHeight: '55vh' }}>
                  <img
                    src={selectedGalleryImage.src}
                    alt={selectedGalleryImage.title}
                    className="w-full h-full object-contain  my-2"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                  />

                  {/* Subtle overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>

                {/* Details Panel - Compact bottom section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-t-2 border-green-200">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 mb-1.5 truncate">
                          {selectedGalleryImage.title}
                        </h3>
                        <p className="text-green-700 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                          {selectedGalleryImage.description}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 text-xs sm:text-sm">
                        <span className="flex items-center gap-1.5 text-green-800 font-semibold bg-white/60 px-3 py-1.5 rounded-full">
                          <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{selectedGalleryImage.date}</span>
                          <span className="sm:hidden">{selectedGalleryImage.date.split(',')[0]}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-green-800 font-semibold bg-white/60 px-3 py-1.5 rounded-full">
                          <FaUserGraduate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {selectedGalleryImage.participants}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ===== Mentorship Section ===== */}
      <section className="relative py-12 md:py-20 text-white overflow-hidden bg-gradient-to-br from-green-800 to-emerald-900">

        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3 md:mb-4">
                <span className="text-xs md:text-sm font-semibold text-white">
                  🎓 Transform Your Future
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-5">
                The Mentorship Programme
              </h2>

              <p className="max-w-xl text-sm md:text-base text-emerald-100 mb-6 md:mb-8 leading-relaxed">
                Become part of a transformative journey where knowledge meets
                purpose. Learn from industry leaders, receive one-on-one guidance,
                and inspire the next generation of innovators.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/auth?role=mentor")}
                  className="px-5 md:px-6 py-2.5 md:py-3 bg-white text-green-800 font-semibold text-sm md:text-base rounded-lg hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                >
                  I am a Mentor
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-5 md:px-6 py-2.5 md:py-3 bg-transparent border-2 border-white text-white font-semibold text-sm md:text-base rounded-lg hover:bg-white hover:text-green-800 transition-all"
                >
                  Sign In as Student
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl blur-2xl opacity-30"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={mentorIllustration}
                  alt="Mentorship"
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Testimonials Carousel ===== */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 mb-2">
              What Our Learners Say
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Success stories from our community
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 mx-4"
            >
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map(
                  (_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm md:text-base mx-0.5" />
                  )
                )}
              </div>

              <p className="text-gray-700 italic mb-4 md:mb-6 text-sm md:text-base lg:text-lg text-center leading-relaxed">
                "{testimonials[currentTestimonial].message}"
              </p>

              <p className="font-semibold text-green-700 text-sm md:text-base text-center">
                — {testimonials[currentTestimonial].name}
              </p>
            </motion.div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 md:p-3 hover:bg-green-50 transition-colors text-green-700"
            >
              <FaChevronLeft className="text-sm md:text-base" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 md:p-3 hover:bg-green-50 transition-colors text-green-700"
            >
              <FaChevronRight className="text-sm md:text-base" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentTestimonial
                    ? "bg-green-700 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-gradient-to-br from-green-800 to-emerald-900 text-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div>
              <h3 className="font-bold text-white text-base md:text-lg mb-3 md:mb-4">Students</h3>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-100">
                <li className="hover:text-white transition-colors cursor-pointer">Learning Paths</li>
                <li className="hover:text-white transition-colors cursor-pointer">Join Events</li>
                <li className="hover:text-white transition-colors cursor-pointer">Community Challenges</li>
                <li className="hover:text-white transition-colors cursor-pointer">Resources & Materials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-base md:text-lg mb-3 md:mb-4">Events</h3>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-100">
                <li className="hover:text-white transition-colors cursor-pointer">Upcoming Events</li>
                <li className="hover:text-white transition-colors cursor-pointer">Workshops</li>
                <li className="hover:text-white transition-colors cursor-pointer">Seminars</li>
                <li className="hover:text-white transition-colors cursor-pointer">Hackathons</li>
                <li className="hover:text-white transition-colors cursor-pointer">Training</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-base md:text-lg mb-3 md:mb-4">Mentorship</h3>
              <ul className="space-y-2 text-xs md:text-sm text-emerald-100">
                <li className="hover:text-white transition-colors cursor-pointer">Become a Mentor</li>
                <li className="hover:text-white transition-colors cursor-pointer">Find a Mentor</li>
                <li className="hover:text-white transition-colors cursor-pointer">Guidelines</li>
                <li className="hover:text-white transition-colors cursor-pointer">Success Stories</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-10 pt-6 border-t border-emerald-800 text-center text-emerald-200 text-xs md:text-sm">
            <p>© {new Date().getFullYear()} Dedan Kimathi Startup & Incubation Centre — Empowering Innovators.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
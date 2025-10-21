import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Modal from "../components/Modal";
import mentor_illustration from "../assets/images/mentor_illustrator.jpg";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaTimes,
  FaSignInAlt,
} from "react-icons/fa";
import { getEvents, getEventsByCategory } from "../lib/services/eventService";
import type { Event } from "../lib/types/events";
import { motion, AnimatePresence } from "framer-motion";

const DedanGreen = "#0f5132";

// Login Modal Component
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: "admin",
      color: "bg-green-600 hover:bg-green-700",
      label: "Administrator",
      icon: <FaUserShield className="text-xl" />,
      description: "Manage platform operations"
    },
    {
      id: "mentor",
      color: "bg-emerald-600 hover:bg-emerald-700",
      label: "Mentor",
      icon: <FaChalkboardTeacher className="text-xl" />,
      description: "Guide and support students"
    },
    {
      id: "mentee",
      color: "bg-green-100 hover:bg-green-700",
      label: "Student / Mentee",
      icon: <FaUserGraduate className="text-xl" />,
      description: "Embarck on journey"
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    // Close modal and navigate to login page with role parameter
    onClose();
    navigate(`/auth?role=${roleId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-secondary rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <FaSignInAlt className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-600">Choose your role to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Role Selection */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full flex items-center space-x-4 p-4 text-left text-white rounded-xl shadow-md transition-all duration-200 ${role.color}`}
                  >
                    <div className="flex-shrink-0">
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {role.label}
                      </div>
                      <div className="text-sm text-white/90 font-light">
                        {role.description}
                      </div>
                    </div>
                    <FaArrowRight className="flex-shrink-0 text-white/80" />
                  </motion.button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  navigate("/apply");
                }}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
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
  const [limit, setLimit] = useState(4);
  const [showLoginModal, setShowLoginModal] = useState(false);
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
      <section className="py-16 md:py-24 bg-green-50 relative">
        <div className="wrapper">
          <div className="flex justify-between items-center">
            <h2 className="subHeading" style={{ color: DedanGreen }}>Upcoming Events</h2>
            {events.length > limit && (
              <button
                onClick={() => setLimit(events.length)}
                className="text-green-700 font-medium hover:underline flex items-center gap-1"
              >
                View More <FaArrowRight />
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-green-100"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-green-100 p-3 rounded-full" style={{ color: DedanGreen }}>
                    <FaCalendarAlt className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: DedanGreen }}>
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {event.date} • {event.location}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-base mb-6 flex-grow">
                  {event.description}
                </p>
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center font-medium group"
                  style={{ color: DedanGreen }}
                >
                  Learn more
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Modal for Event Details ===== */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          message={
            <div className="space-y-3">
              <p>{selectedEvent.description}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {selectedEvent.timeFrom} -{" "}
                {selectedEvent.timeTo}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Objective:</strong> {selectedEvent.objective}
              </p>
              <p>
                <strong>Details:</strong> {selectedEvent.details}
              </p>
            </div>
          }
        >
          <button
            onClick={() => {
              setSelectedEvent(null);
              navigate(`/apply/${selectedEvent.id}`);
            }}
            style={{ backgroundColor: DedanGreen }}
            className="hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
          >
            Apply
          </button>
        </Modal>
      )}

      {/* ===== Mentorship Section ===== */}
      <section
        className="relative py-24 text-white overflow-hidden"
        style={{ backgroundColor: DedanGreen }}
      >
        <div className="wrapper grid md:grid-cols-2 items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Mentorship Programme
            </h2>
            <p className="max-w-xl text-emerald-100 mb-8 leading-relaxed text-lg">
              Become part of a transformative journey where knowledge meets
              purpose. Learn from industry leaders, receive one-on-one guidance,
              and inspire the next generation of innovators.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/auth?role=mentor")}
                className="bg-white text-[#0f5132] font-semibold px-8 py-3 rounded-full hover:bg-emerald-100 transition-all"
              >
                I am a Mentor
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-[#0f5132] transition-all"
              >
                Sign In as Student
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={mentor_illustration}
                alt="Mentorship"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Testimonials Carousel ===== */}
      <section className="py-20 bg-green-50 text-center relative">
        <div className="wrapper">
          <h2 className="subHeading mb-12" style={{ color: DedanGreen }}>
            What Our Learners Say
          </h2>

          <div className="relative max-w-3xl mx-auto overflow-hidden">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8 mx-4"
            >
              <p className="text-gray-600 italic mb-6 text-lg">
                "{testimonials[currentTestimonial].message}"
              </p>
              <div className="flex justify-center mb-3">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map(
                  (_, i) => (
                    <FaStar key={i} className="text-yellow-400 mx-1" />
                  )
                )}
              </div>
              <p className="font-semibold" style={{ color: DedanGreen }}>
                {testimonials[currentTestimonial].name}
              </p>
            </motion.div>

            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-green-100 transition-colors"
              style={{ color: DedanGreen }}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-green-100 transition-colors"
              style={{ color: DedanGreen }}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer
        className="text-gray-100 py-16 mt-10"
        style={{ backgroundColor: DedanGreen }}
      >
        <div className="wrapper grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Students</h3>
            <ul className="space-y-2 text-emerald-100">
              <li>Learning Paths</li>
              <li>Join Events</li>
              <li>Community Challenges</li>
              <li>Resources & Materials</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Events</h3>
            <ul className="space-y-2 text-emerald-100">
              <li>Upcoming Events</li>
              <li>Workshops</li>
              <li>Seminars</li>
              <li>Hackathons</li>
              <li>Training</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Mentorship</h3>
            <ul className="space-y-2 text-emerald-100">
              <li>Become a Mentor</li>
              <li>Find a Mentor</li>
              <li>Guidelines</li>
              <li>Success Stories</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-emerald-800 pt-6 text-center text-emerald-200 text-sm">
          © {new Date().getFullYear()} Dedan Kimathi Startup & Incubation Centre
          — Empowering Innovators.
        </div>
      </footer>
    </main>
  );
};

export default Landing;
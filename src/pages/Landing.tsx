import Navigation from "../components/Navigation";
import Carousel from "../components/Carousel";
import { FaCalendarAlt, FaUsers, FaArrowRight } from "react-icons/fa";

const Landing = () => {
  return (
    <main>
      {/* ===== Hero Section ===== */}
      <section className="relative h-full">
        <Navigation />
        <Carousel />
      </section>

      {/* ===== Events Section ===== */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="wrapper">
          <h2 className="subHeading">Upcoming Events</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-white hover:border-green-100/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-green-100/10 p-3 rounded-full">
                    <FaCalendarAlt className="text-green-200 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark mb-1">
                      Hackathon 2025
                    </h3>
                    <p className="text-sm text-text-light mb-2">
                      May 15-17, 2025 • Virtual Event
                    </p>
                  </div>
                </div>
                <p className="text-text-light text-base mb-6 flex-grow">
                  Join the annual hackathon challenge to build innovative solutions for real-world problems. Open to all students.
                </p>
                <button className="flex items-center text-green-200 font-medium group">
                  Learn more
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="border-2 border-green-200 text-green-200 hover:bg-green-200 hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="py-16 md:py-24">
        <div className="wrapper">
          <h2 className="subHeading">About Us</h2>
          
          <div className="mt-12 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-video" />
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="text-3xl font-bold text-dark mb-6">
                Empowering the Next Generation of Learners
              </h3>
              <p className="text-lg text-text leading-relaxed mb-6">
                At LearnHub, we're passionate about unlocking every student's potential through innovative learning experiences. Our platform combines mentorship, practical challenges, and community-driven education.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: "5K+", label: "Active Students" },
                  { value: "200+", label: "Expert Mentors" },
                  { value: "50+", label: "Learning Paths" },
                  { value: "24/7", label: "Community Support" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-green-100/5 p-4 rounded-lg border border-green-100/10">
                    <p className="text-2xl font-bold text-green-200">{stat.value}</p>
                    <p className="text-sm text-text-light">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-green-200 hover:bg-green-100 text-white px-6 py-3 rounded-full font-medium flex items-center transition-all">
                  <FaUsers className="mr-2" />
                  Join Community
                </button>
                <button className="border-2 border-green-200 text-green-200 hover:bg-green-200 hover:text-white px-6 py-3 rounded-full font-medium transition-all">
                  Our Mission
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
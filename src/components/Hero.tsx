import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaLightbulb, FaUsers, FaArrowRight } from "react-icons/fa";
import { loginBanner } from "../constants/Index";

interface HeroProps {
  onLogin?: () => void;
}

const Hero = ({ onLogin }: HeroProps) => {
  const navigate = useNavigate();

  const features = [
    { icon: <FaRocket className="text-base" />, text: "Launch Your Startup" },
    { icon: <FaLightbulb className="text-base" />, text: "Innovative Ideas" },
    { icon: <FaUsers className="text-base" />, text: "Expert Mentorship" },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 md:mt-10  md:py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content - Text with Animations */}
          <div className="space-y-6 md:space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
                <span className="text-green-600 text-lg">🚀</span>
                <span className="text-sm font-semibold text-green-700">
                  Innovation Hub
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Dedan Kimathi
              </h1>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Startup & Incubation Centre
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl"
            >
              Empowering students and innovators with resources, mentorship, and
              opportunities to transform their startup ideas into reality.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 hover:border-green-200 transition-colors"
                >
                  <span className="text-green-600">{feature.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <button
                onClick={() => navigate("/apply")}
                className="group px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Apply Now
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>

              {onLogin && (
                <button
                  onClick={onLogin}
                  className="px-8 py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => {
                  document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Right Image - Static with Elegant Presentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Decorative Background Elements */}
            <div className="absolute -inset-4 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-3xl blur-3xl"></div>

            {/* Main Image Container */}
            <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/60">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={loginBanner}
                  alt="DeSIC Innovation"
                  className="w-full h-auto object-cover"
                />
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-600/5 to-transparent"></div>
              </div>
            </div>

            {/* Accent Dots */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-teal-400 to-green-500 rounded-full opacity-20 blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLogin from "../components/Admin/LoginPage";
import MenteeLogin from "../components/students/Auth/login";
import MentorLogin from "../components/Mentor/auth";
import {
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaArrowLeft,
  FaSignInAlt,
  FaHome,
} from "react-icons/fa";
import { loginBanner } from "../constants/Index";

// Imports of assets

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
    color: "bg-blue-600 hover:bg-blue-700",
    label: "Student / Mentee",
    icon: <FaUserGraduate className="text-xl" />,
    description: "Learn and grow with mentorship"
  },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check for role in URL parameters
  useEffect(() => {
    const role = searchParams.get('role');
    if (role && ['admin', 'mentee', 'mentor'].includes(role)) {
      setSelectedRole(role);
    }
  }, [searchParams]);

  const backToRoleSelect = () => {
    setSelectedRole(null);
    navigate('/auth');
  };

  const backToLanding = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex"
          >
            {/* Image Section - Hidden on mobile, visible on large devices */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-12 shadow-dark">
              <div className="max-w-lg w-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-start text-gray-800"
                >
                  <div className="mb-8 p-4">
                    <img
                      src={loginBanner}
                      alt="Login"
                      className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="px-6">
                    <p className="text-gray-600 text-lg">
                      Join our community of innovators to transform ideas into reality.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Role Selection Card */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
                  {/* Header with Back to Landing Button */}
                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={backToLanding}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
                    >
                      <FaHome className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                      <span className="text-sm font-medium">Back to Home</span>
                    </button>
                    <div className="text-green-600 font-bold text-lg">
                      DeSIC
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full mb-4">
                      <FaSignInAlt className="text-2xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back
                    </h1>
                    <p className="text-gray-600">
                    </p>
                  </div>

                  {/* Role Selection Buttons */}
                  <div className="space-y-4">
                    {roles.map((role) => (
                      <motion.button
                        key={role.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole(role.id)}
                        className={`w-full flex items-center gap-4 p-4 text-left text-white rounded-xl shadow-md transition-all duration-200 ${role.color}`}
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
                        <div className="flex-shrink-0">
                          <FaArrowLeft className="w-5 h-5 text-white/80 rotate-180" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-600 text-sm">
                      Don't have an account?{" "}
                      <button
                        onClick={() => navigate("/apply")}
                        className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                      >
                        Apply to become a mentee
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex "
          >
            {/* Image Section for Login Forms - Hidden on mobile, visible on large devices */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-12">
              <div className="max-w-lg w-full">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-start"
                >
                  <div className="mb-8 p-4">
                    <img
                      src={loginBanner}
                      alt="Login"
                      className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                  <div className="px-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {roles.find(r => r.id === selectedRole)?.label} Portal
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Access your dedicated workspace and continue your journey
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Login Form Section */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 ">
              <div className="w-full max-w-md py-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 ">
                  {/* Header with Back Button and Role Badge */}
                  <div className="bg-green-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={backToRoleSelect}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200 group"
                      >
                        <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="text-sm font-medium">Change Role</span>
                      </button>
                      <button
                        onClick={backToLanding}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200 group"
                      >
                        <FaHome className="w-4 h-4" />
                        <span className="text-sm font-medium">Home</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        {roles.find(r => r.id === selectedRole)?.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {roles.find(r => r.id === selectedRole)?.label} Login
                        </h2>
                        <p className="text-white/80 text-sm">
                          Please enter your credentials to continue
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role-specific login form */}
                  <div className="p-6">
                    {selectedRole === "admin" && (
                      <AdminLogin
                        onLogin={backToRoleSelect}
                      />
                    )}
                    {selectedRole === "mentor" && (
                      <MentorLogin />
                    )}
                    {selectedRole === "mentee" && (
                      <MenteeLogin
                        onLogin={backToRoleSelect}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
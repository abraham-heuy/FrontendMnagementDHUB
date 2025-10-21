import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { loginMentor } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const apiURL = import.meta.env.VITE_API_URL;

export default function MentorLogin() {
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginMentor(email, password);

      setModalConfig({
        title: "Success ✅",
        message: `Welcome back ${data.user.fullName}`,
      });
      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/dashboard/mentor");
      }, 1500);
    } catch (error: any) {
      setModalConfig({
        title: "Error ⚠️",
        message: error.message || "Login failed",
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalConfig({
        title: "Error ⚠️",
        message: "Passwords do not match",
      });
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Password reset failed");

      setModalConfig({
        title: "Password Reset 🔑",
        message: "Your password has been reset successfully.",
      });
      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setIsResetMode(false);
      }, 1500);
    } catch (error: any) {
      setModalConfig({
        title: "Error ⚠️",
        message: error.message,
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Login Form */}
      {!isResetMode ? (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            <button
              type="button"
              onClick={() => setIsResetMode(true)}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
            >
              Forgot password?
            </button>
          </p>
        </form>
      ) : (
        /* Reset Password Form */
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-600 transition-colors duration-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>

          <p className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <ArrowLeft size={16} />
            <button
              type="button"
              onClick={() => setIsResetMode(false)}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
            >
              Back to Login
            </button>
          </p>
        </form>
      )}

      {/* Success/Error Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            >
              <h3 className={`text-lg font-semibold mb-3 ${
                modalConfig.title.includes("Error") ? "text-red-600" : "text-green-600"
              }`}>
                {modalConfig.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{modalConfig.message}</p>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                {modalConfig.title.includes("Error") ? (
                  <div className="w-6 h-6 text-red-500">⚠️</div>
                ) : (
                  <div className="w-6 h-6 text-green-500">✅</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
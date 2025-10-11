import React, { useState } from "react";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { loginMentor } from "../../utils/api";
import { useNavigate } from "react-router-dom";
const apiURL = import.meta.env.VITE_API_URL;
const DedanGreen = "#0f5132";


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
      const data = await loginMentor(email, password); // or loginStudent if same endpoint

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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
        {/* Header */}
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: DedanGreen }}
        >
          {isResetMode ? "Reset Password" : "Mentor Login"}
        </h1>

        {/* Login Form */}
        {!isResetMode ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock size={18} className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-2 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              <button
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-emerald-700 hover:underline"
              >
                Forgot password?
              </button>
            </p>
          </form>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock size={18} className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full outline-none text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Confirm Password
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock size={18} className="text-gray-400 mr-2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full outline-none text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-500 hover:text-emerald-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-2 rounded-lg font-semibold hover:bg-emerald-800 transition"
            >
              Reset Password
            </button>

            <p className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-3">
              <ArrowLeft size={14} />
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="text-emerald-700 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginStudent } from "../../../utils/api";
import success from "../../../assets/images/success.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import InputField from "../../InputField";
import Modal from "../../Modal";
import { FaEnvelope, FaLock } from "react-icons/fa";

interface LoginProps {
  onLogin?: () => void;
}

const MenteeLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await loginStudent(form.email, form.password);
      if (onLogin) onLogin();

      setModalConfig({
        title: "Success",
        message: `Welcome back ${data.user.fullName}`,
      })
      setIsModalOpen(true)

      setTimeout(() => {
        setIsModalOpen(false)
        navigate("/dashboard/student/main")
      }, 1500)

    } catch (error: any) {
      setModalConfig({
        title: "Error ⚠️",
        message: error.message || "Something went wrong",
      });
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
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
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>
        </div>

        {/* Password */}
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
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-colors duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        image={success}
      />
    </div>
  )
}

export default MenteeLogin;
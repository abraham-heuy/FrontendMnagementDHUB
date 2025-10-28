import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginStudent, getMyMenteeProfile } from "../../../utils/api";
import type { MenteeProfile } from "../../../utils/api";
import success from "../../../assets/images/success.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import Modal from "../../Modal";
import { FaEnvelope, FaLock } from "react-icons/fa";
import ProfileCompletionModal from "../Profile/ProfileCompletionModal";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Profile gate state
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<MenteeProfile | null>(null)

  // Auto-dismiss error after 5 seconds
  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage(null)
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const data: any = await loginStudent(form.email, form.password);
      if (!data || !data.user) {
        throw new Error("Login response malformed. Please try again.");
      }
      if (onLogin) onLogin();

      setModalConfig({
        title: "Success",
        message: `Welcome back ${data.user.fullName}`,
      })
      setIsModalOpen(true)

      // Navigate to dashboard immediately, then check profile in background
      setTimeout(() => {
        setIsModalOpen(false)
        navigate("/dashboard/student/main")
      }, 1200)

      // Check profile completion in background after navigation
      setTimeout(async () => {
        try {
          const res = await getMyMenteeProfile();
          const profile = (res.profile || {}) as MenteeProfile;

          // Compute completion percentage
          // Categories: "Student" and "Non-Student" only
          const common: (keyof MenteeProfile)[] = [
            "category", "bio", "skills", "phone", "field", "linkedIn", "website", "resumeUrl",
          ];
          let applicable: (keyof MenteeProfile)[] = common;

          // If Student, add student-specific fields
          if (profile.category === "Student") {
            applicable = [...common, "institution", "course", "yearOfStudy"]
          }
          // For Non-Student, just use common fields

          const total = applicable.length
          const filled = applicable.reduce((acc, key) => {
            const v = (profile as any)[key]
            if (v === undefined || v === null) return acc
            const s = String(v).trim()
            return s.length > 0 ? acc + 1 : acc
          }, 0)
          const percent = total ? Math.round((filled / total) * 100) : 0

          // If profile is incomplete (<25%), show completion modal
          if (percent < 25) {
            setCurrentProfile(profile || null)
            setShowProfileModal(true)
          }
        } catch (err) {
          console.error("Failed to check profile:", err)
          // If profile check fails, user stays on dashboard
        }
      }, 1500)

    } catch (error: any) {
      // Inline error message handler
      setErrorMessage(error?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Animated inline error */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm animate-shake flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Login Failed</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
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

      {/* Success Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        image={success}
      />

      {/* Profile Completion Gate */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => {
          // Don't navigate if user closes prematurely; keep them on login page
          setShowProfileModal(false)
        }}
        initialProfile={currentProfile}
        onCompleted={() => {
          setShowProfileModal(false)
          setIsModalOpen(false)
          navigate("/dashboard/student/main")
        }}
      />
    </div>
  )
}

export default MenteeLogin;
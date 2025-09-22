import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import baseURL from "../../lib/environment";
import success from "../../assets/images/success.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import InputField from "../InputField";
import Modal from "../Modal";

// login component for user authentication
const Login = () => {
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

  // handle input change
  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  // handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call to login endpoint
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        setModalConfig({
          title: "Error",
          message: data.message || "Something went wrong",
        })
        setIsModalOpen(true)
        return
      }

      // success modal
      setModalConfig({
        title: "Success",
        message: `Welcome back ${data.user.name}`,
      })
      setIsModalOpen(true)

      setTimeout(() => {
        setIsModalOpen(false)
        if (data.user.role === "Admin") {
          navigate("/dashboard/admin")
        } else {
          navigate("/dashboard/student")
        }
      }, 1500)
      setLoading(false)
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
    <div className="bg-secondary min-h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-3">
        <h2 className="text-2xl font-bold text-center text-green-600">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <div className="relative">
            <InputField
              label="Password"
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <Link
            to="/auth/forgot-password"
            className="block underline italic text-xs text-end px-3 text-green-600 hover:text-green-700 cursor-pointer"
          >
            Forgot Password?
          </Link>
        </form>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalConfig.title}
          message={modalConfig.message}
          image={success}
        />
      </div>
    </div>
  )
}

export default Login
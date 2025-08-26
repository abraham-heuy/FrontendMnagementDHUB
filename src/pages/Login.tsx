import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import success from "../assets/images/success.png";
import baseURL from "../lib/environment";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"login" | "forgot">("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  // loading state
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  });

  // password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⬅️ ensures cookies (JWT) are stored
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ success modal
      setModalConfig({
        title: "Success 🎉",
        message: `Welcome back ${data.user.name}!`,
      });
      setIsModalOpen(true);

      // redirect based on role
      setTimeout(() => {
        setIsModalOpen(false);
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/students");
        }
      }, 1500);
    } catch (error: any) {
      setModalConfig({
        title: "Error ⚠️",
        message: error.message || "Something went wrong",
      });
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false)
      }, 2500);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsModalOpen(false)
      }, 2500);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setModalConfig({
        title: "Error ⚠️",
        message: "Passwords do not match",
      });
      setIsModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
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
        setAuthMode("login");
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
    <div className="bg-secondary min-h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-3">
        <h2 className="text-2xl font-bold text-center text-green-100 ">
          {authMode === "login" ? "Welcome Back 👋" : "Reset Your Password 🔑"}
        </h2>

        {/* form */}
        {authMode === "login" ? (
          <form onSubmit={handleLogin} className=" space-y-4">
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />

            {/* Password with visibility toggle */}
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
                className=" absolute right-5 top-12"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* submit btn */}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-100 text-primary py-2 rounded-xl font-semibold hover:green-200 transition cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p
              onClick={() => setAuthMode("forgot")}
              className=" underline italic text-xs text-end px-3 text-green-100 hover:text-green-200 cursor-pointer"
            >
              Forgot Password?
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgot} className=" space-y-4">
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />

            {/* New Password */}
            <div className="relative">
              <InputField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-5 top-12"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <InputField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
              />
              <button
                type="button"
                className=" absolute right-5 top-12"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-100 text-primary py-2 rounded-xl font-semibold hover:green-200 transition cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p
              onClick={() => setAuthMode("login")}
              className=" underline italic text-xs text-end px-3 text-green-100 hover:text-green-200 cursor-pointer"
            >
              Back to Login
            </p>
          </form>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalConfig.title}
          message={modalConfig.message}
          image={success}
        />
      </div>
    </div>
  );
};

export default Login;

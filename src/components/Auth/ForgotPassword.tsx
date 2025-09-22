
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import baseURL from "../../lib/environment";
import InputField from "../InputField"; 
import success from "../../assets/images/success.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import Modal from "../Modal";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
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
        navigate("/auth/login");
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
        <h2 className="text-2xl font-bold text-center text-green-600">
          Reset Your Password 🔑
        </h2>

        <form onSubmit={handleForgot} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

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
              className="absolute right-3 top-10 text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

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
              className="absolute right-3 top-10 text-gray-500"
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
            className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <Link
            to="/auth/login"
            className="block underline italic text-xs text-end px-3 text-green-600 hover:text-green-700 cursor-pointer"
          >
            Back to Login
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
  );
};

export default ForgotPassword;
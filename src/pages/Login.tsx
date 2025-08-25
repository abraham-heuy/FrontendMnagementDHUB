import { useState } from "react";
import { useNavigate } from "react-router-dom"
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import success from '../assets/images/success.png'

const Login = () => {

  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"login" | "forgot">("login")
  const [form, setForm] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: ""
  })

  // loading state
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
  })

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setModalConfig({
        title: "Success 🎉",
        message: "Welcome back! You are now logged in.",
      });
      setIsModalOpen(true);

      // ⏳ wait a moment so user sees modal, then navigate
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/students");
      }, 1500);
    }, 1500);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setModalConfig({
        title: "Password Reset 🔑",
        message: "Your password has been successfully reset.",
      });
      setIsModalOpen(true);

      // close modal and go back to login form
      setTimeout(() => {
        setIsModalOpen(false);
        setAuthMode("login");
      }, 1500);
    }, 1500);
  }

  return (
    <div className="bg-secondary min-h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-3">
        <h2 className="text-2xl font-bold text-center text-green-100 ">
          {authMode === "login" ? "Welcome Back 👋" : " Reset Your Password 🔑"}
        </h2>

        {/* form  */}
        {authMode === "login" ? (
          <form onSubmit={handleLogin} className=" space-y-4">
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <InputField
              label="Password"
              required
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {/* button to submit */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-green-100 text-primary py-2 rounded-xl font-semibold hover:green-200 transition cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p
              onClick={() => setAuthMode('forgot')}
              className=" underline italic text-xs text-end px-3 text-green-100 hover:text-green-200 cursor-pointer">
              Forgot Password?
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgot} className=" space-y-4">
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <InputField
              label="New Password"
              type="password"
              value={form.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              required
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />
            {/* button to submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-100 text-primary py-2 rounded-xl font-semibold hover:green-200 transition cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p
              onClick={() => setAuthMode('login')}
              className=" underline italic text-xs text-end px-3 text-green-100 hover:text-green-200 cursor-pointer">
              Back to Login
            </p>
          </form>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={()=>setIsModalOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          image={success}
        />
      </div>
    </div>
  )
}

export default Login
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens if stored
    localStorage.removeItem("authToken");
    // Redirect to login
    navigate("/admin/login");
  };

  const handleCancel = () => {
    // Go back to dashboard overview
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center"
      >
        {/* Title */}
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Confirm Logout
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to log out? You’ll need to sign in again to
          access the admin dashboard.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm rounded-xl border text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Logout;

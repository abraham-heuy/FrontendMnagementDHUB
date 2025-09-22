// src/components/Error/AccessDenied.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full"
      >
        {/* Emoji */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl mb-4"
        >
          🚫
        </motion.div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Sorry, you don’t have permission to view this page.  
          Please log in with the right account or return home.
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/login")}
          className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition w-full"
        >
          Go Back To Login
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AccessDenied;

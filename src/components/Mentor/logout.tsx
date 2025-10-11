import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../utils/api";

const LogoutMentor: React.FC = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async() => {
    setLoggingOut(true); // start animation
    
    //handle the logout.
    try{
      await logout();

    }catch(err: any){
      console.error("Logout error:", err.message)
    }finally{
      navigate("/")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <AnimatePresence>
        {!loggingOut && (
          <motion.div
            key="logout-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
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

            {/* Logout button only */}
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional overlay animation (fade-out background) */}
      {loggingOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"
          />
        </motion.div>
      )}
    </div>
  );
};

export default LogoutMentor;

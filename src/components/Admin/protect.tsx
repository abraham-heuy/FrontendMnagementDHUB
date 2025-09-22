import React, { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { fetchMe } from "../../utils/api"; // calls /auth/me
import AccessDenied from "./limitedaccess";
import { motion, AnimatePresence } from "framer-motion";

interface ProtectedRouteProps {
  element: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await fetchMe();
        if (me && me.id) {
          setUser(me);
        } else {
          setUser(null);
          setNotLoggedIn(true);
          setTimeout(() => setRedirect(true), 2000);
        }
      } catch (err) {
        setUser(null);
        setNotLoggedIn(true);
        setTimeout(() => setRedirect(true), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Checking authentication...</p>;

  if (redirect) {
    return <Navigate to="/admin/login" replace />;
  }

  if (notLoggedIn) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <p className="text-red-600 font-semibold text-lg">
              🚫 You are not logged in
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              Please login to access this page!
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              Redirecting to login page...
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied />;
  }

  return element;
};

export default ProtectedRoute;

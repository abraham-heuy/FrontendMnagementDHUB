import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 text-center p-6">
      {/* Animated 404 */}
      <motion.h1
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-8xl font-extrabold text-green-600 drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Animated message */}
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-4 text-lg text-gray-600"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      {/* Animated button */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        onClick={() => navigate("/")}
        className="mt-8 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-medium transition-all"
      >
        <FaHome /> Back to Home
      </motion.button>
    </div>
  );
};

export default NotFound;

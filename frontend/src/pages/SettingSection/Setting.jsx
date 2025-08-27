import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/user.service";
import useUserStore from "../../store/useUserStore";
import useThemeStore from "../../store/themeStore";
import { FaSignOutAlt, FaMoon, FaSun, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const Setting = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { clearUser } = useUserStore();
  const { theme, setTheme } = useThemeStore();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      clearUser();
      toast.success("Logged out successfully");
      navigate("/user-login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`h-screen p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div
            className={`flex items-center justify-between p-4 rounded-lg cursor-pointer ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            } transition-colors`}
            onClick={toggleTheme}
          >
            <div className="flex items-center space-x-3">
              {theme === "dark" ? (
                <FaMoon className="text-blue-400" />
              ) : (
                <FaSun className="text-yellow-500" />
              )}
              <span className="font-medium">Theme</span>
            </div>
            <span className="text-sm text-gray-500 capitalize">{theme}</span>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg ${
              isLoggingOut
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            } text-white transition-colors`}
          >
            {isLoggingOut ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSignOutAlt />
            )}
            <span className="font-medium">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Setting;

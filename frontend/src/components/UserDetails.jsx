import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../services/user.service";
import useUserStore from "../store/useUserStore";
import useThemeStore from "../store/themeStore";
import {
  FaSignOutAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";

const UserDetails = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, clearUser } = useUserStore();
  const { theme } = useThemeStore();

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

  if (!user) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <p>Loading user data...</p>
      </div>
    );
  }

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
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/")}
          className={`flex items-center space-x-2 mb-6 ${
            theme === "dark"
              ? "text-gray-300 hover:text-white"
              : "text-gray-700 hover:text-black"
          }`}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                  }`}
                >
                  <FaUser className="text-3xl text-gray-500" />
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            {user.username && (
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                </div>
              </div>
            )}

            {user.email && (
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {user.phoneNumber && (
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {user.about && (
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <p className="text-sm text-gray-500">About</p>
                    <p className="font-medium">{user.about}</p>
                  </div>
                </div>
              </div>
            )}
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

export default UserDetails;

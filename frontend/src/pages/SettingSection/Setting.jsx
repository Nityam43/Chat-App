import { useState } from "react";
import useThemeStore from "../../store/themeStore";
import { logoutUser } from "../../services/user.service";
import useUserStore from "../../store/useUserStore";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import {
  FaComment,
  FaMoon,
  FaQuestionCircle,
  FaSearch,
  FaSignInAlt,
  FaSun,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Setting = () => {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const { theme } = useThemeStore();
  const { user, clearUser } = useUserStore();

  const toggleThemeDialog = () => {
    setIsThemeDialogOpen(!isThemeDialogOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUser();
      toast.success("User Logged out successfully");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const menuItems = [
    { icon: FaUser, label: "Account", href: "/user-profile" },
    { icon: FaComment, label: "Chats", href: "/" },
    { icon: FaQuestionCircle, label: "Help", href: "/help" },
  ];

  return (
    <Layout
      isThemeDialogOpen={isThemeDialogOpen}
      toggleThemeDialog={toggleThemeDialog}
    >
      <div
        className={`flex h-screen ${
          theme === "dark"
            ? "bg-[rgb(17,27,33)] text-white"
            : "bg-gray-50 text-black"
        }`}
      >
        <div
          className={`w-[400px] border-r ${
            theme === "dark" ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>

            {/* Search */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search settings"
                className={`w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none
                  ${
                    theme === "dark"
                      ? "bg-[#202c33] text-white placeholder-gray-400"
                      : "bg-gray-100 text-black placeholder-gray-500"
                  }`}
              />
            </div>

            {/* Profile Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer shadow-sm
                ${
                  theme === "dark"
                    ? "bg-[#202c33]"
                    : "bg-white hover:bg-gray-100"
                } mb-6`}
            >
              <img
                src={user?.profilePicture}
                alt="profile"
                className="w-14 h-14 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-lg">{user?.username}</h2>
                <p className="text-sm text-gray-400">{user?.about}</p>
              </div>
            </motion.div>

            {/* Menu Items */}
            <div className="h-[calc(100vh-250px)] overflow-y-auto space-y-3">
              {menuItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm transition-all
                      ${
                        theme === "dark"
                          ? "bg-[#202c33] hover:bg-[#2a3942] text-white"
                          : "bg-white hover:bg-gray-100 text-black"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Theme Toggle */}
              <motion.button
                onClick={toggleThemeDialog}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl shadow-sm
                  ${
                    theme === "dark"
                      ? "bg-[#202c33] hover:bg-[#2a3942] text-white"
                      : "bg-white hover:bg-gray-100 text-black"
                  }`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    theme === "dark" ? "bg-[#2c2c2c]" : "bg-gray-100"
                  }`}
                >
                  {theme === "dark" ? (
                    <FaMoon className="h-5 w-5" />
                  ) : (
                    <FaSun className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex flex-col flex-1 text-left">
                  <span className="text-base font-semibold">Theme</span>
                  <span className="text-sm text-gray-400">
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </span>
                </div>
              </motion.button>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`mt-10 w-full flex items-center gap-4 p-4 rounded-2xl shadow-sm
                ${
                  theme === "dark"
                    ? "bg-[#2c2c2c] hover:bg-[#3a4a52] text-red-400"
                    : "bg-white hover:bg-gray-100 text-red-500"
                }`}
              onClick={handleLogout}
            >
              <FaSignInAlt className="h-5 w-5" />
              <span className="font-semibold">Log Out</span>
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Setting;

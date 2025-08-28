// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { logoutUser } from "../../services/user.service";
// import useUserStore from "../../store/useUserStore";
// import useThemeStore from "../../store/themeStore";
// import { FaSignOutAlt, FaMoon, FaSun, FaSpinner } from "react-icons/fa";
// import { motion } from "framer-motion";

// const Setting = () => {
//   const navigate = useNavigate();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const { clearUser } = useUserStore();
//   const { theme, setTheme } = useThemeStore();

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       await logoutUser();
//       clearUser();
//       toast.success("Logged out successfully");
//       navigate("/user-login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       toast.error("Failed to logout. Please try again.");
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`h-screen p-6 ${
//         theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <div className="max-w-md mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Settings</h1>

//         <div className="space-y-4">
//           {/* Theme Toggle */}
//           <div
//             className={`flex items-center justify-between p-4 rounded-lg cursor-pointer ${
//               theme === "dark"
//                 ? "bg-gray-800 hover:bg-gray-700"
//                 : "bg-gray-100 hover:bg-gray-200"
//             } transition-colors`}
//             onClick={toggleTheme}
//           >
//             <div className="flex items-center space-x-3">
//               {theme === "dark" ? (
//                 <FaMoon className="text-blue-400" />
//               ) : (
//                 <FaSun className="text-yellow-500" />
//               )}
//               <span className="font-medium">Theme</span>
//             </div>
//             <span className="text-sm text-gray-500 capitalize">{theme}</span>
//           </div>

//           {/* Logout Button */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg ${
//               isLoggingOut
//                 ? "bg-red-400 cursor-not-allowed"
//                 : "bg-red-500 hover:bg-red-600"
//             } text-white transition-colors`}
//           >
//             {isLoggingOut ? (
//               <FaSpinner className="animate-spin" />
//             ) : (
//               <FaSignOutAlt />
//             )}
//             <span className="font-medium">
//               {isLoggingOut ? "Logging out..." : "Logout"}
//             </span>
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Setting;

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
  FaSign,
  FaSignInAlt,
  FaSun,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";


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

  return (
    <Layout
      isThemeDialogOpen={isThemeDialogOpen}
      toggleThemeDialog={toggleThemeDialog}
    >
      <div
        className={`flex h-screen ${
          theme === "dark"
            ? "bg-[rgb(17,27,33)] text-white"
            : "bg-white text-black"
        }`}
      >
        <div
          className={`w-[400px] border-r ${
            theme === "dark" ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Settings</h1>

            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search settings"
                className={`w-full ${
                  theme === "dark"
                    ? "bg-[#202c33] text-white"
                    : "bg-gray-100 text-black"
                } border-none pl-10 placeholder-gray-400 rounded p-2`}
              />
            </div>

            <div
              className={`flex items-center gap-4 p-3 ${
                theme === "dark" ? "hover:bg-[#202c33]" : "hover:bg-gray-100"
              } rounded-lg cursor-pointer mb-4`}
            >
              <img
                src={user.profilePicture}
                alt="profile"
                className="w-14 h-14 rounded-full"
              />

              <div>
                <h2 className="font-semibold">{user?.username}</h2>
                <p className="text-sm">{user?.about}</p>
              </div>
            </div>

            {/* Menu Items */}

            <div className="h-[calc(100vh - 200px)] overflow-y-auto">
              <div className="space-y-1">
                {[
                  { icon: FaUser, lable: "Account", href: "/user-profile" },
                  { icon: FaComment, lable: "Chats", href: "/" },
                  { icon: FaQuestionCircle, lable: "Help", href: "/help" },
                ].map((item) => (
                  <Link
                    to={item.href}
                    key={item.lable}
                    className={`w-full flex items-center gap-3 p-2 rounded ${
                      theme === "dark"
                        ? "text-white hover:bg-[#202c33]"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <div
                      className={`border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      } w-full p-4`}
                    >
                      {item.lable}
                    </div>
                  </Link>
                ))}

                {/* Theme Button */}

                <button
                  onClick={toggleThemeDialog}
                  className={`w-full flex items-center gap-3 p-2 rounded ${
                    theme === "dark"
                      ? "text-white hover:bg-[#202c33]"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  {theme === "dark" ? (
                    <FaMoon className="h-5 w-5" />
                  ) : (
                    <FaSun className="h-5 w-5" />
                  )}

                  <div
                    className={`flex flex-col text-start border-b ${
                      theme === "dark" ? "border-gray-700" : " border-gray-200"
                    } w-full p-2`}
                  >
                    Theme{" "}
                    <span className="ml-auto text-sm text-gray-400">
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </span>
                  </div>
                </button>
              </div>

              <button
                className={`w-full flex items-center gap-3 p-2 rounded text-red-500 ${
                  theme === "dark"
                    ? "text-white hover:bg-[#202c33]"
                    : "text-black hover:bg-gray-100"
                } mt-10 md:mt-36`}
                onClick={handleLogout}
              >
                <FaSignInAlt className="h-5 w-5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Setting;

import { useLocation } from "react-router-dom";
import useLayoutStore from "../store/layoutStore";
import { useEffect, useState } from "react";
import useThemeStore from "../store/themeStore";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import ChatWindow from "../pages/chatSection/ChatWindow";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdComputer } from "react-icons/md";

const Layout = ({
  children,
  isThemeDialogOpen,
  toggleThemeDialog,
  isStatusPreviewOpen,
  statusPreviewContent,
}) => {
  const selectedContact = useLayoutStore((state) => state.selectedContact);
  const setSelectedContact = useLayoutStore(
    (state) => state.setSelectedContact
  );
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme, setTheme, mode } = useThemeStore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      icon: <FaSun className="text-yellow-500" />,
    },
    { id: "dark", label: "Dark", icon: <FaMoon className="text-blue-400" /> },
    {
      id: "system",
      label: "System",
      icon: <MdComputer className="text-gray-500" />,
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#111b21] text-white" : "bg-gray-100 text-black"
      } flex relative`}
    >
      {!isMobile && <Sidebar />}
      <div
        className={`flex-1 flex overflow-hidden ${isMobile ? "flex-col" : ""}`}
      >
        <AnimatePresence initial={false}>
          {(!selectedContact || !isMobile) && (
            <motion.div
              key="chatlist"
              initial={{ x: isMobile ? "-100%" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className={`w-full md:w-2/5 h-full ${isMobile ? "pb-16" : ""}`}
            >
              {children}
            </motion.div>
          )}

          {(selectedContact || !isMobile) && (
            <motion.div
              key="chatWindow"
              initial={{ x: isMobile ? "-100%" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="w-full h-full"
            >
              <ChatWindow
                selectedContact={selectedContact}
                setSelectedContact={setSelectedContact}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isMobile && <Sidebar />}

      {/* Theme Dialog */}
      <AnimatePresence>
        {isThemeDialogOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${
                theme === "dark"
                  ? "bg-[#202c33] text-white"
                  : "bg-white text-black"
              } p-6 rounded-2xl shadow-2xl max-w-sm w-full`}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Choose a Theme
              </h2>

              <div className="space-y-3 mb-6">
                {themeOptions.map((t) => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-4 p-4 w-full rounded-xl border transition-all shadow-sm
                      ${
                        mode === t.id
                          ? "border-blue-500 bg-blue-50 dark:bg-[#2a3942]"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <div className="text-xl">{t.icon}</div>
                    <span className="text-base font-medium">{t.label}</span>
                    {mode === t.id && (
                      <span className="ml-auto text-blue-500 font-semibold">
                        ✓
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={toggleThemeDialog}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Preview */}
      {isStatusPreviewOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {statusPreviewContent}
        </div>
      )}
    </div>
  );
};

export default Layout;

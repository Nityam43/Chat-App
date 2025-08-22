import { useState } from "react";
import useLayoutStore from "../../store/layoutStore";
import useThemeStore from "../../store/themeStore";
import useUserStore from "../../store/useUserStore";
import { FaPlus, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const ChatList = ({ contacts }) => {
  const setSelectedContact = useLayoutStore(
    (state) => state.setSelectedContact
  );
  const selectedContact = useLayoutStore((state) => state.selectedContact);
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const [searchTerms, setSearchTerms] = useState("");
  const filteredContacts = contacts?.filter((contact) => {
    const username = contact?.username || contact?.email || 'Unknown User';
    return username.toLowerCase().includes(searchTerms.toLowerCase());
  });

  console.log(filteredContacts);

  return (
    <div
      className={`w-full border-r h-screen ${
        theme === "dark"
          ? "bg-[rgb(17,27,33)] border-gray-600"
          : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 flex justify-between ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        <h2 className="text-xl font-semibold">Chats</h2>
        <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
          <FaPlus />
        </button>
      </div>

      <div className="p-2">
        <div className="relative">
          <FaSearch
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-800"
            }`}
          />
          <input
            type="text"
            placeholder="Search or start new chat"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500"
                : "bg-gray-100 text-black border-gray-200 placeholder-gray-400"
            }`}
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh - 120px)]">
        {filteredContacts && filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <motion.div
              key={contact?._id}
              onClick={() => setSelectedContact(contact)}
              className={`p-3 flex items-center cursor-pointer ${
                theme === "dark"
                  ? selectedContact?._id === contact._id
                    ? "bg-gray-700"
                    : " hover:bg-gray-800"
                  : selectedContact?._id === contact?._id
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={contact?.profilePicture || '/default-avatar.png'}
                alt={contact?.username || 'User'}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48x48/999/fff?text=U';
                }}
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h2
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {contact?.username || contact?.email || 'Unknown User'}
                  </h2>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={`p-4 text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {contacts && contacts.length === 0 ? (
              <p>No users found. Make sure you're logged in and the backend is running.</p>
            ) : (
              <p>No users match your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;

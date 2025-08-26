import { useEffect, useState } from "react";
import ChatList from "../pages/chatSection/ChatList";
import Layout from "./Layout";
import { motion } from "framer-motion";
import { getAllUsers } from "../services/user.service";
import useUserStore from "../store/useUserStore";

const HomePage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useUserStore();
  
  const getAllUser = async () => {
    try {
      setLoading(true);
      console.log('Fetching all users...');
      const result = await getAllUsers();
      console.log('API Response:', result);
      if (result.status === "success") {
        console.log('Users data:', result.data);
        setAllUsers(result.data);
      } else {
        console.error('API returned error status:', result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Check if it's a network error or authentication error
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <ChatList contacts={allUsers}/>
      </motion.div>
    </Layout>
  );
};

export default HomePage;

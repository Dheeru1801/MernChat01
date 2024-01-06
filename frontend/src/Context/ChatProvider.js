import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from '@chakra-ui/react'; // Import useToast
import axios from 'axios';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const [notification, setNotification] = useState([]);

  const history = useHistory();
  const toast = useToast(); // Initialize useToast

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      // Use history.push only if history is defined
      history && history.push("/");
    } else {
      const fetchChats = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get("/api/chat", config);
          setChats(data);
        } catch (error) {
          toast({
            title: "Error Occurred!!!!",
            description: "Failed to Load the Chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };

      fetchChats();
    }
  }, [history, toast, setChats, setUser]);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

import { useToast } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from "axios";
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Text } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { Stack } from '@chakra-ui/layout';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogics';
import { getProfilePic } from '../config/ChatLogics';
import { Image } from '@chakra-ui/image';
import GroupChatModal from './miscellaneous/GroupChatModal';


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const [selectedChatId, setSelectedChatId] = useState(null);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const deselectChat = () => {
    setSelectedChat(null);
    setSelectedChatId(null);
};

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        deselectChat();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
};
  }, [fetchAgain]);


  const filteredChats = chats.filter(chat => {
    return chat.users.some(user => user._id === loggedUser?._id);
  });

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      // alignItems="center"
      p={2}
      bg="black"
      w={{ base: "100%", md: "30%" }}
      // w="25%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pd={5}
        px={1}
        fontSize={{ base: "30px", md: "20px" }}
        fontFamily="Work Sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={1}
        bg="white"
        w="100%"
        h="100%"
        overflowY="hidden"
        borderRadius="lg"
      >
        {filteredChats ? (
          <Stack overflowY="scroll">
            {filteredChats.map(chat => (
              <Box
                onClick={() => {
                  setSelectedChatId(chat._id);
                  setSelectedChat(chat);
                  console.log(chat)
}}                cursor="pointer"
                bg={selectedChat === chat ? "black" : "black"}
                color={selectedChat === chat ? "white" : "black"}
                px={5}
                py={5}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                _hover={{ bg: "green", background: "green.600" }}
              >
                <Image src={getProfilePic(loggedUser, chat.users)} alt="Profile Pic" boxSize="40px" objectFit="cover" borderRadius="full" mr="2" />
                <Text color="white">
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

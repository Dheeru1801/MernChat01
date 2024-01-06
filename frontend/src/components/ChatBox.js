import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const {selectedChat,setSelectedChat} = ChatState();

  return (
    <Box 
      display={{base: selectedChat ? "flex" : "none", md: "flex"}} 
      alignItems="center"
      flexDir="column"
      p={3}
      bg="black"
      w={{base: "100%", md: "75%"}}
      borderRadius="lg"
      borderWidth="1px"
      color="black"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />    
    </Box>
  )
};

export default ChatBox;

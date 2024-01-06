import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import {Text}from '@chakra-ui/layout';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import { Image } from '@chakra-ui/image';

import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; //server port changed on deployment
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const toast = useToast();
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        if(!selectedChat)  return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            // console.log(messages);
            setMessages(data);
            setLoading(false);
            
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    // console.log(messages);

    useEffect(() => {
    socket = io(ENDPOINT);    
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));   
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false)); 
    }, []);

    

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // console.log(notification, "------------");

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if(
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if(!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });



    const sendMessage = async (event) => {
        if(event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                // console.log(data);

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to Send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
        }
    };

    



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // typing indicator logic
        if(!socketConnected) return;

        if(!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 2000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

  return (
    <>
        {selectedChat ? (
            <>
            <Text
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work Sans"
                display="flex"
                justifyContent={{ base: "flex-start"}}
                alignItems="center"
                color="white"
                
            >
                <IconButton
                    display={{ base: "flex", md: "none" }} //for the back button
                    icon={<ArrowBackIcon />}
                    onClick={() => setSelectedChat("")}
                    color="black"
                />

             {!selectedChat.isGroupChat ? (
                <>
                {getSender(user, selectedChat.users) }
                <ProfileModel user={getSenderFull(user, selectedChat.users) }/>
                
                
                </>
                ) : (
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                        
                    />
                    </>
                )}
                
            </Text>
            <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                // bg="#E8E8E8"
                bgImage="url('https://th.bing.com/th/id/OIP.FFfZxnm1nues2Fnm3YPSLwAAAA?rs=1&pid=ImgDetMain')"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {loading ? (
                    <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        margin="auto"
                    />
                ) : (
                    <div className="messages">
                        <ScrollableChat messages={messages} />
                        {/* messages */}
                    </div>
                )}
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping ? <div>Loading...</div> : <></>}
                    <Input
                        variant="filled"
                        bg="E0E0E0"
                        color="white"
                        placeholder="Type your message here..."
                        onChange={typingHandler}
                        value={newMessage}
                    />
                </FormControl>
            </Box>
            </>
        ) : (
            <Box  alignItems="center" justifyContent="center" h="100%" display="flex" >
<Image
    src='https://th.bing.com/th/id/OIP.7BZ9pcHgRQ0G0fjrhPSx4gHaHa?w=189&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    alt="Logo"
    boxSize="100px"  // Adjust the box size as needed
    objectFit="cover"
    borderRadius="full"
    mr={3}
    mb={3}  // Add margin-bottom for spacing
  />                <Text fontSize="3xl" pb={3} fontFamily="Work Sans" color="white" >
                    Select a Chat
                </Text>
            </Box>
        )}
    </>
  );
};

export default SingleChat

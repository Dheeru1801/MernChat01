import { Spinner } from '@chakra-ui/spinner';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { Image } from '@chakra-ui/image';
import { Button } from '@chakra-ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { Avatar } from "@chakra-ui/avatar";
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModel';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { getSender } from '../../config/ChatLogics';




const SideDrawer = () => {
    // const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState("");

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const toast = useToast();

    // const handleSearch = async (query) => {
    //     if(!search) {
    //         toast({
    //             title: "Please enter something to search",
    //             status: "warning",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "top-left",
    //         });
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //         }; 

    //         const { data } = await axios.get(
    //             `/api/user?/search=${query}`, config);
    //         setLoading(false);
    //         setSearchResult(data);
            
    //     } catch(error) {
    //         toast({
    //             title: "Error Occured!",
    //             description: "Failed to Load the Search Results",
    //             status: "error",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "bottom-left",
    //         });
    //     }

    // }; 
    const handleSearch = async (query) => {
    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }; 

        const { data } = await axios.get(`/api/user?/search=${query}`, config);
        setLoading(false);

        // Filter the search results based on the query
        const filteredResults = data.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
        setSearchResult(filteredResults);
        
    } catch(error) {
        toast({
            title: "Error Occurred!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }
}; 


    const accessChat = async (userId) => {
    try {
        setLoadingChat(true);

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.post("/api/chat", { userId }, config);

        // Check if the chat already exists based on its ID
        const chatExists = chats.find((c) => c._id === data._id);

        if (!chatExists) {
            // Add the new chat to the existing chats
            setChats([...chats, data]);
        }

        setLoadingChat(false);
        setSelectedChat(data);
        onClose();
    } catch (error) {
        // Error handling
        toast({
            title: "Error Fetching the chats!",
            description: "Failed to Load the Chat",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }
};


    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="1px"
            >
                <Tooltip label="Search Users to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" style={{ background: "black" }} onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass" style={{ color: "#ffffff" }}></i>
                        {/* <Text style={{ base: "none", md: "flex", color: "white" }} px='4' >Search User</Text> */}
                    </Button>
                </Tooltip>

                <Box display="flex" alignItems="center">
                    {/* Add your image source in the src attribute */}
                    <Image src="https://i.pinimg.com/originals/9a/c7/7e/9ac77ed57a967f10a8ff8c6dcd6e0308.png" alt="Logo" boxSize="40px" objectFit="cover" borderRadius="full" mr="0" />

                    <Text fontSize="2xl" fontFamily="WorkSans" color="black" ml="0">My Chat</Text>
                </Box>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon color="black" fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList color="black" p={3}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem key={notif._id} color="blue" 
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(
                                            notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user,notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
                           <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem color="Black">My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandler} color="Black">Logout</MenuItem>
                        </MenuList>
                    </Menu>

                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="2px">Search Users</DrawerHeader>
                    <DrawerBody>
                    <Box display='flex' pb={2} width="100%">
                        <Input
                            // backgroundColor="black"
                            placeholder="Search users... "
                            mr={2}
                            // value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {/* <Button
                            onClick={handleSearch}
                            colorScheme="green"
                        >
                            Search
                        </Button> */}

                    </Box>
                    {loading ? (
                        <ChatLoading/>
                    ): (
                    searchResult?.map((user) => (
                        <UserListItem 
                        key={user._id}
                        user={user}
                        handleFunction={()=>accessChat(user._id)}
                        />
                    ))
                    )}
                    {loadingChat && <Spinner ml="auto" display="flex" />}
                </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    );
};

export default SideDrawer;
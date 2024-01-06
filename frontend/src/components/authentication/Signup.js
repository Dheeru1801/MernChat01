import { VStack } from "@chakra-ui/layout";
import React, { useState } from "react"
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
// import { set } from "mongoose";
import { useToast } from "@chakra-ui/react";
// import { set } from "mongoose";
import axios from "axios";
import { useHistory } from "react-router-dom";  



const Signup = () => {
    const [show,setShow] = useState(false);
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [confirmPassword,setConfirmPassword] = useState();
    const [password,setPassword] = useState();
    const [pic,setpic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();


    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined){
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dn8ihhgnc");
            fetch("https://api.cloudinary.com/v1_1/dn8ihhgnc/image/upload",{//error here
                method: "post",
                body: data,
            })
            .then((res) => res.json())
            .then((data) => {
                setpic(data.url.toString());
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if(password !== confirmPassword){
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
        };
        const { data } = await axios.post(
            "/api/user",
            { name, email, password, pic },
            config
        );
        toast({
            title: "Account Created Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        history.push("/chats");

        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

  return (<VStack spacing='5px'>
    <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
        placeholder='Enter Your Name'
        onChange={(e)=>setName(e.target.value)}
        />
    </FormControl>
    <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
        placeholder='Enter Your Email'
        onChange={(e)=>setEmail(e.target.value)}
        />
    </FormControl>

    <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input 
            type={show? "text": "password"}
            placeholder='Enter Your Password'
            onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input 
            type={show? "text": "password"}
            placeholder='Confirm Your Password'
            onChange={(e)=>setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    </FormControl>

    <FormControl id='profile-pic'>
        <FormLabel>Profile Picture</FormLabel>
        <Input 
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e)=>postDetails(e.target.files[0])}
        />
    </FormControl>

    <Button
    colorScheme="green"
    width="100%"
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading={loading}
    >
        Sign Up
    </Button>

  </VStack>
  );
};

export default Signup

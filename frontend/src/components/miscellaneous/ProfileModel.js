import {useDisclosure} from "@chakra-ui/hooks";
import { IconButton } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";
import React from "react";
import { Image } from "@chakra-ui/image";
import { Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Button } from "@chakra-ui/button";

const ProfileModel = ({ user, children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    {children? (
        <span onClick={onOpen}>{children}</span>
    ): (
        <IconButton display={{ base :"flex"}} icon={<ViewIcon />} onClick={onOpen}/>
    )}
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
            // p={3}
          >
            {user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
            />
            <Text 
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work Sans"
            >
                Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    );
};

export default ProfileModel;

import React from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="gray.100"
      _hover={{
        background: '#38B2AC',
        color: 'white',
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={2}
      py={1}
      mb={3}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />

      <Box>
        <Text fontSize="sm" fontFamily="Work Sans" color="black">
          {user.name}
        </Text>
        <Text fontSize="sm" fontFamily="Work Sans" color="black">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

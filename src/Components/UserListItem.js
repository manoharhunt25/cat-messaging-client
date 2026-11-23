import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Flex
      onClick={handleFunction}
      cursor="pointer"
      bg="white"
      border="1px solid"
      borderColor="ink.100"
      _hover={{ bg: "cat.500", borderColor: "cat.500" }}
      transition="background 0.15s"
      w="100%"
      align="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="md"
    >
      <Avatar
        mr={3}
        size="sm"
        name={user.name}
        src={user.pic}
        bg="black"
        color="cat.500"
      />
      <Box minW={0}>
        <Text fontWeight="700" noOfLines={1}>
          {user.name}
        </Text>
        <Text fontSize="xs" color="ink.600" noOfLines={1}>
          {user.email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;

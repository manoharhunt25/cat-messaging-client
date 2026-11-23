import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { Avatar, Button } from "@chakra-ui/react";
import { GroupIcon } from "./Icons";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { API_URL } from "../config";
import { useEffect } from "react";
import { getSender } from "./ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { ChatState } from "./ChatProvider";


const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const preview = (chat) => {
    const m = chat.latestMessage;
    if (!m) return chat.isGroupChat ? "Group chat" : "No messages yet";
    const who = m.sender?._id === user._id ? "You" : m.sender?.name;
    return who ? `${who}: ${m.content}` : m.content;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      bg="white"
      w={{ base: "100%", md: "32%" }}
      maxW={{ md: "380px" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="ink.100"
      boxShadow="sm"
      overflow="hidden"
    >
      <Flex
        px={4}
        py={3}
        w="100%"
        justify="space-between"
        align="center"
        borderBottom="1px solid"
        borderColor="ink.100"
      >
        <Heading
          as="h2"
          fontSize={{ base: "xl", md: "2xl" }}
          textTransform="uppercase"
          letterSpacing="0.02em"
        >
          Chats
        </Heading>
        <GroupChatModal>
          <Button variant="dark" size="sm" leftIcon={<AddIcon boxSize={3} />}>
            New Group
          </Button>
        </GroupChatModal>
      </Flex>
      <Box flex="1" overflowY="auto" p={2}>
        {chats ? (
          <Stack spacing={1}>
            {chats.length === 0 && (
              <Text color="ink.400" textAlign="center" mt={8} px={4}>
                No chats yet. Use Search User to start a conversation.
              </Text>
            )}
            {chats.map((chat) => {
              const isSelected = selectedChat?._id === chat._id;
              const name = !chat.isGroupChat
                ? getSender(user, chat.users)
                : chat.chatName;
              return (
                <Flex
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  align="center"
                  gap={3}
                  px={3}
                  py={2.5}
                  borderRadius="md"
                  bg={isSelected ? "cat.500" : "transparent"}
                  borderLeft="4px solid"
                  borderColor={isSelected ? "black" : "transparent"}
                  _hover={{ bg: isSelected ? "cat.500" : "cat.50" }}
                  transition="background 0.15s"
                >
                  <Avatar
                    size="sm"
                    name={chat.isGroupChat ? undefined : name}
                    icon={chat.isGroupChat ? <GroupIcon /> : undefined}
                    bg={isSelected ? "black" : "ink.800"}
                    color="cat.500"
                  />
                  <Box minW={0} flex="1">
                    <Text fontWeight="700" noOfLines={1}>
                      {name}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={isSelected ? "ink.800" : "ink.500"}
                      noOfLines={1}
                    >
                      {preview(chat)}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

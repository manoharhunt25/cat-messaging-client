// Import necessary libraries and components
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { ChatState } from "./ChatProvider";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  Image,
  Spinner,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { addMessage, getSenderFull } from "./ChatLogics";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import { API_URL } from "../config";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { GroupIcon, SendIcon } from "./Icons";
import io from "socket.io-client";

// Define the endpoint for socket connection
const ENDPOINT = API_URL;


// Define variables outside the component function
let socket;
let selectedChatCompare;

// Define the SingleChat component
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // Define state variables
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  // Get user and selectedChat from context
  const { user, selectedChat, setSelectedChat, setNotification } = ChatState();

  // Define function to fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${API_URL}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT, { auth: { token: user.token } });
    socket.emit("setup", user);
    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Function to handle message sending
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      //socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${API_URL}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);

        setMessages((prev) => addMessage(prev, data));
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  // Fetch messages when selectedChat changes
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // Handle new messages received. Registered once per socket and removed on
  // cleanup, so each incoming message is handled exactly one time.
  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        setNotification((prev) =>
          prev.some((n) => n._id === newMessageRecieved._id)
            ? prev
            : [newMessageRecieved, ...prev]
        );
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prev) => addMessage(prev, newMessageRecieved));
      }
    };

    socket.on("message recieved", handleMessageReceived);
    return () => {
      socket.off("message recieved", handleMessageReceived);
    };
  }, [user, setNotification, setFetchAgain]);

  // Function to handle typing
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const otherUser =
    selectedChat && !selectedChat.isGroupChat
      ? getSenderFull(user, selectedChat.users)
      : null;

  // Render component
  return (
    <>
      {selectedChat ? (
        <Flex direction="column" h="100%" w="100%">
          {/* Chat header */}
          <Flex
            align="center"
            gap={3}
            px={{ base: 3, md: 5 }}
            py={3}
            borderBottom="1px solid"
            borderColor="ink.100"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              aria-label="Back to chats"
              variant="ghost"
              size="sm"
            />
            <Avatar
              size="md"
              name={otherUser ? otherUser.name : undefined}
              src={otherUser?.pic}
              icon={otherUser ? undefined : <GroupIcon fontSize="1.4rem" />}
              bg="black"
              color="cat.500"
              border="3px solid"
              borderColor="cat.500"
            />
            <Box minW={0} flex="1">
              <Heading
                as="h2"
                fontSize={{ base: "lg", md: "xl" }}
                textTransform="uppercase"
                letterSpacing="0.02em"
                noOfLines={1}
              >
                {otherUser ? otherUser.name : selectedChat.chatName}
              </Heading>
              <Text fontSize="sm" color="ink.500" noOfLines={1}>
                {otherUser
                  ? otherUser.email
                  : `${selectedChat.users.length} members`}
              </Text>
            </Box>
            {selectedChat.isGroupChat && (
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
          </Flex>

          {/* Messages */}
          <Flex
            direction="column"
            justify="flex-end"
            flex="1"
            minH={0}
            px={{ base: 2, md: 5 }}
            py={3}
            bg="ink.50"
          >
            {loading ? (
              <Spinner
                size="xl"
                thickness="4px"
                color="cat.500"
                emptyColor="ink.200"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
          </Flex>

          {/* Composer */}
          <Flex
            as="form"
            gap={2}
            p={3}
            borderTop="1px solid"
            borderColor="ink.100"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({ key: "Enter" });
            }}
          >
            <Input
              placeholder="Enter a message here"
              onChange={typingHandler}
              value={newMessage}
              bg="white"
              size="lg"
              borderColor="ink.200"
              _hover={{ borderColor: "ink.400" }}
            />
            <IconButton
              type="submit"
              variant="brand"
              size="lg"
              aria-label="Send message"
              icon={<SendIcon />}
              isDisabled={!newMessage.trim()}
            />
          </Flex>
        </Flex>
      ) : (
        // Placeholder when no chat is selected
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          w="100%"
          bg="ink.50"
          textAlign="center"
          px={6}
        >
          <Image
            src="/brand/cat-logo.png"
            alt=""
            h="90px"
            opacity={0.9}
            mb={6}
          />
          <Heading
            as="h2"
            fontSize="2xl"
            textTransform="uppercase"
            letterSpacing="0.02em"
          >
            Select a chat
          </Heading>
          <Box w="50px" h="4px" bg="cat.500" my={3} />
          <Text color="ink.500" maxW="320px">
            Pick a conversation on the left, or use Search User to start a new
            one.
          </Text>
        </Flex>
      )}
    </>
  );
};

// Export the SingleChat component
export default SingleChat;

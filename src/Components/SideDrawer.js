import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Badge,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Image,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getSender } from "./ChatLogics";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import { ChatState } from "./ChatProvider";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { API_URL } from "../config";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/react";
// Import UserListItem from appropriate location
import UserListItem from "./UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
 const {
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat(undefined);
    setChats([]);
    setNotification([]);
    setUser(null);
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/api/user?search=${encodeURIComponent(search)}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
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
      const { data } = await axios.post(`${API_URL}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };



  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        bg="black"
        color="white"
        w="100%"
        h="64px"
        px={{ base: 3, md: 5 }}
        borderBottom="4px solid"
        borderColor="cat.500"
        gap={3}
      >
        {/* Brand */}
        <Flex align="center" gap={3} flexShrink={0}>
          <Flex
            bg="white"
            borderRadius="md"
            h="40px"
            px={2}
            align="center"
            justify="center"
          >
            <Image src="/brand/cat-logo.png" alt="CAT" h="32px" />
          </Flex>
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize="lg"
            letterSpacing="0.15em"
            textTransform="uppercase"
            display={{ base: "none", sm: "block" }}
          >
            Messaging
          </Text>
        </Flex>

        {/* Search */}
        <Tooltip
          label="Search users to start chatting"
          hasArrow
          placement="bottom"
        >
          <Button
            onClick={onOpen}
            flex={{ base: "0 0 auto", md: "0 1 360px" }}
            justifyContent="flex-start"
            bg="ink.800"
            color="ink.300"
            fontWeight="400"
            border="1px solid"
            borderColor="ink.600"
            _hover={{ bg: "ink.700", borderColor: "cat.500", color: "white" }}
            leftIcon={<SearchIcon color="cat.500" />}
            aria-label="Search User"
          >
            <Text display={{ base: "none", md: "block" }}>Search User</Text>
          </Button>
        </Tooltip>

        {/* Notifications and profile */}
        <Flex align="center" gap={1} flexShrink={0}>
          <Menu>
            <MenuButton
              as={IconButton}
              variant="ghost"
              aria-label="Notifications"
              color="cat.500"
              _hover={{ bg: "ink.700" }}
              _active={{ bg: "ink.700" }}
              position="relative"
              icon={
                <>
                  <BellIcon fontSize="2xl" />
                  {notification.length > 0 && (
                    <Badge
                      position="absolute"
                      top="2px"
                      right="2px"
                      bg="cat.500"
                      color="black"
                      borderRadius="full"
                      fontSize="0.65rem"
                      minW="18px"
                      textAlign="center"
                    >
                      {notification.length}
                    </Badge>
                  )}
                </>
              }
            />
            <MenuList color="black" py={1}>
              {!notification.length && (
                <Text px={3} py={2} color="ink.500">
                  No new messages
                </Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              px={2}
              _hover={{ bg: "ink.700" }}
              _active={{ bg: "ink.700" }}
              rightIcon={<ChevronDownIcon color="white" />}
              aria-label="Profile menu"
            >
              <Avatar
                size="sm"
                bg="cat.500"
                color="black"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList color="black">
              <MenuItem isDisabled opacity="1 !important" cursor="default">
                <Box>
                  <Text fontWeight="bold">{user.name}</Text>
                  <Text fontSize="xs" color="ink.500">
                    {user.email}
                  </Text>
                </Box>
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            bg="black"
            color="white"
            borderBottom="4px solid"
            borderColor="cat.500"
            fontFamily="heading"
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Search Users
          </DrawerHeader>
          <DrawerBody pt={4}>
            <Box
              as="form"
              display="flex"
              pb={3}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Input
                placeholder="Search by name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" variant="brand">
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
              </>
            )}
            {loadingChat && <Spinner ml="auto" display="flex" color="cat.500" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

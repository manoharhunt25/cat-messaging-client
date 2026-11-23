import React, { useState } from 'react'
import { FormControl, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import {
    IconButton,
    Input,
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from './ChatProvider';
import UserBadgeItem from './UserBadgeItem';
// import { Form } from 'react-router-dom';
import axios from "axios";
import { API_URL } from "../config";

import UserListItem from './UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleAddUser= async(user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)) {

         toast({
            title: "User already in group.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position:"bottom"
            }) ;
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
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
            
            const{ data } = await axios.put(`${API_URL}/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id
            },
            config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            });
            setLoading(false);
        }
       
    };
    const handleRemove= async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title: "Only admins can remove someone.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            });
            return;
        }
        
        try{
            setLoading(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`${API_URL}/api/chat/groupremove`,{
                chatId: selectedChat._id,
                userId:user1._id
            },
            config
            );
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        }catch(error){
            toast({
                title: "Error Occured!",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            });
            setLoading(false);
        }

    };
    const handleRename= async() => {
        if(!groupChatName) return

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };
            const{ data } = await axios.put(`${API_URL}/api/chat/rename`, 
            {
                chatId: selectedChat._id,
                chatName:groupChatName,
            },
            config
             );

             setSelectedChat(data);
             setFetchAgain(!fetchAgain);
             setRenameLoading(false);
        } 
        catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setRenameLoading(false);
        }

        setGroupChatName("");
    };

    const handleSearch = async(query) => {
        if(!query){
            return;
        }
        try{
           setLoading(true);
           const config = {
             headers: {
               Authorization: `Bearer ${user.token}`,
             },
           };
                 const { data } = await axios.get(
                   `${API_URL}/api/user?search=${encodeURIComponent(query)}`,
                   config
                 );
                 setLoading(false);
                 setSearchResult(data);
        }
        catch(error){
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

    return (
        <>
          <IconButton
            display="flex"
            icon={<ViewIcon />}
            onClick={onOpen}
            aria-label="Group settings"
            variant="dark"
          />

          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay bg="blackAlpha.700" />
            <ModalContent mx={3}>
              <ModalHeader fontSize="xl">{selectedChat.chatName}</ModalHeader>

              <ModalCloseButton />
              <ModalBody
               display="flex"
               flexDir="column"
               alignItems="center">
                <Text
                  alignSelf="flex-start"
                  fontSize="xs"
                  fontWeight="700"
                  color="ink.500"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  mb={1}
                >
                  Members
                </Text>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                    {selectedChat.users.map((u) => (
                    <UserBadgeItem
                    key={u._id}
                    user={u}
                    // admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                    />
                 ))}   
                </Box>
                <FormControl display="flex">
                    <Input
                        placeholder="Chat Name"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                        variant="dark"
                        ml={2}
                        isLoading={renameloading}
                        onClick={handleRename}
                    >
                        Update
                    </Button>
                </FormControl>
                <FormControl>
                    <Input
                        placeholder="Add User to group"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? (
                    <Spinner size="lg" color="cat.500" my={3} />
                ) : (
                    searchResult?.map((user) => (
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                        />
                     ))
                 )}

              </ModalBody>
              <ModalFooter>
                <Button onClick={()  => handleRemove(user)} colorScheme="red" variant="outline">
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }

export default UpdateGroupChatModal
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./ChatLogics";
import { ChatState } from "./ChatProvider";
import { Avatar, Box, Text, Tooltip } from "@chakra-ui/react";

const formatTime = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  bg="black"
                  color="cat.500"
                  alignSelf="flex-end"
                />
              </Tooltip>
            )}
            {(() => {
              const mine = m.sender._id === user._id;
              const showName =
                !mine && m.chat?.isGroupChat && !isSameUser(messages, m, i);
              return (
                <Box
                  as="span"
                  bg={mine ? "cat.500" : "white"}
                  color="black"
                  border="1px solid"
                  borderColor={mine ? "cat.500" : "ink.100"}
                  boxShadow="0 1px 2px rgba(0,0,0,0.06)"
                  borderRadius="16px"
                  borderBottomRightRadius={mine ? "4px" : "16px"}
                  borderBottomLeftRadius={mine ? "16px" : "4px"}
                  px={3.5}
                  py={2}
                  maxW={{ base: "80%", md: "65%" }}
                  wordBreak="break-word"
                  ml={isSameSenderMargin(messages, m, i, user._id)}
                  mt={isSameUser(messages, m, i, user._id) ? "3px" : "10px"}
                >
                  {showName && (
                    <Text
                      as="span"
                      display="block"
                      fontSize="xs"
                      fontWeight="700"
                      color="ink.600"
                      mb={0.5}
                    >
                      {m.sender.name}
                    </Text>
                  )}
                  {m.content}
                  <Text
                    as="span"
                    display="block"
                    textAlign="right"
                    fontSize="2xs"
                    color={mine ? "ink.700" : "ink.400"}
                    mt={0.5}
                  >
                    {formatTime(m.createdAt)}
                  </Text>
                </Box>
              );
            })()}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

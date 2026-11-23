import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";
import SideDrawer from "../Components/SideDrawer";
import { ChatState } from "../Components/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <Box width="100%" bg="ink.50" minH="100vh">
      {user && <SideDrawer />}
      <Flex
        justifyContent="space-between"
        gap={{ base: 0, md: 4 }}
        h="calc(100vh - 68px)"
        p={{ base: 2, md: 4 }}
      >
        {/* MyChats and Chatbox switch visibility themselves on small screens */}
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </Box>
  );
};

export default Chatpage;

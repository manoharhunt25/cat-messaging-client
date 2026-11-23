import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Flex
      w="100%"
      minH="100vh"
      bg="black"
      position="relative"
      overflow="hidden"
      align="center"
      justify="center"
      px={4}
      py={{ base: 8, md: 12 }}
    >
      {/* Yellow triangle in the background, echoing the logo */}
      <Box
        position="absolute"
        bottom="0"
        left={{ base: "50%", lg: "70%" }}
        transform="translateX(-50%)"
        w={{ base: "180%", md: "120%", lg: "100%" }}
        h={{ base: "40%", md: "45%", lg: "62%" }}
        bg="cat.500"
        clipPath="polygon(50% 0, 100% 100%, 0 100%)"
        opacity={0.95}
        aria-hidden="true"
      />

      <Flex
        position="relative"
        direction={{ base: "column", lg: "row" }}
        align="center"
        gap={{ base: 8, lg: 16 }}
        maxW="1100px"
        w="100%"
      >
        {/* Brand message */}
        <Box flex="1" color="white" textAlign={{ base: "center", lg: "left" }}>
          <Text
            color="cat.500"
            fontFamily="heading"
            fontWeight="700"
            letterSpacing="0.2em"
            fontSize="sm"
            mb={3}
          >
            CAT MESSAGING
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl" }}
            lineHeight="1.05"
            textTransform="uppercase"
          >
            Stay connected
            <br />
            with your team.
          </Heading>
          <Box
            w="80px"
            h="6px"
            bg="cat.500"
            mt={5}
            mx={{ base: "auto", lg: 0 }}
          />
          <Text
            mt={5}
            color="ink.200"
            fontSize={{ base: "md", md: "lg" }}
            maxW="420px"
            mx={{ base: "auto", lg: 0 }}
            display={{ base: "none", md: "block" }}
          >
            Real-time one-to-one and group conversations, built for the people
            who keep the world moving.
          </Text>
        </Box>

        {/* Sign-in card */}
        <Box
          bg="white"
          w="100%"
          maxW="440px"
          borderRadius="xl"
          boxShadow="0 24px 60px rgba(0,0,0,0.45)"
          overflow="hidden"
        >
          <Box h="8px" bg="cat.500" />
          <Box px={{ base: 6, md: 8 }} pt={7} pb={8}>
            <Image
              src="/brand/caterpillar-wordmark.webp"
              alt="Caterpillar"
              h={{ base: "34px", md: "40px" }}
              mx="auto"
              mb={2}
            />
            <Text
              textAlign="center"
              fontFamily="heading"
              fontWeight="700"
              letterSpacing="0.25em"
              fontSize="sm"
              color="ink.600"
              mb={6}
            >
              MESSAGING
            </Text>

            <Tabs variant="brand" isFitted>
              <TabList mb={5}>
                <Tab>Login</Tab>
                <Tab>Register</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <Login />
                </TabPanel>
                <TabPanel p={0}>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Homepage;

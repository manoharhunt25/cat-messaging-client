import React from "react";
import { Stack, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          height="52px"
          borderRadius="md"
          startColor="ink.100"
          endColor="cat.100"
        />
      ))}
    </Stack>
  );
};

export default ChatLoading;

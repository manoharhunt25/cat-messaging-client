import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Components/ChatProvider";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";

const root = createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);

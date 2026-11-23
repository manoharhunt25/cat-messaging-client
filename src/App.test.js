import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import ChatProvider from "./Components/ChatProvider";

const renderApp = (route = "/") =>
  render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[route]}>
        <ChatProvider>
          <App />
        </ChatProvider>
      </MemoryRouter>
    </ChakraProvider>
  );

beforeEach(() => {
  localStorage.clear();
});

test("shows the login and register tabs when logged out", () => {
  renderApp("/");
  expect(screen.getByRole("tab", { name: /login/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /register/i })).toBeInTheDocument();
});

test("redirects a logged-out user from /chats to the home page", async () => {
  renderApp("/chats");
  expect(
    await screen.findByRole("tab", { name: /login/i })
  ).toBeInTheDocument();
});

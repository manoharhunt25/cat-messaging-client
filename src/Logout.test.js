import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import ChatProvider from "./Components/ChatProvider";

// The chat page loads chats over HTTP and opens a socket; stub both.
// Plain functions, not jest.fn(): CRA's resetMocks would wipe jest.fn()
// implementations before each test.
jest.mock("axios", () => ({
  get: () => Promise.resolve({ data: [] }),
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
}));

const mockSocket = {
  disconnected: false,
  emit() {},
  on() {},
  off() {},
  disconnect() {
    mockSocket.disconnected = true;
  },
};
jest.mock("socket.io-client", () => () => mockSocket);

test("logging out clears the session and returns to the login page", async () => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({
      _id: "u1",
      name: "Test User",
      email: "test@example.com",
      token: "fake-token",
    })
  );

  render(
    <ChakraProvider>
      <MemoryRouter initialEntries={["/chats"]}>
        <ChatProvider>
          <App />
        </ChatProvider>
      </MemoryRouter>
    </ChakraProvider>
  );

  fireEvent.click(await screen.findByRole("button", { name: /profile menu/i }));
  fireEvent.click(await screen.findByRole("menuitem", { name: /logout/i }));

  expect(await screen.findByRole("tab", { name: /login/i })).toBeInTheDocument();
  expect(localStorage.getItem("userInfo")).toBeNull();
  expect(mockSocket.disconnected).toBe(true);
});

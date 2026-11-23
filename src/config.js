// Base URL of the backend (REST API and socket.io).
// Set REACT_APP_API_URL in a .env file to point at another server;
// it is read at build time, so restart `npm start` or rebuild after changing it.
export const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

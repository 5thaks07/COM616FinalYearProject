import { io } from "socket.io-client";

// Get the base URL from environment variables
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

// Retrieve token from local storage
const token = localStorage.getItem("token");

// Initialize socket connection with or without authentication based on token presence
const socket = token
  ? io(URL, {
    transports: ["websocket"],
      auth: {
        token: token,
      },
    })
  : null;
console.log("socket:", socket);
console.log("URL:", URL);

export default socket;

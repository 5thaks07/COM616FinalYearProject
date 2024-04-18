import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

const initializeSocket = (token) => {
  if (token) {
    return io(URL, {
      transports: ["websocket"],
      auth: {
        token: token,
      },
    });
  }
  return null;
};

export default initializeSocket;

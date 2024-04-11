import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import socket from "../socket";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!socket) {
      // Socket is null, meaning user is not logged in
      console.log("User is not logged in");
      setIsLoggedIn(false);
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    console.log("socket:", socket);

    socket.on("connect", () => {
      console.log("Connected to socket", socket.id);
      setIsLoggedIn(true);
    });

    socket.on("message", (message) => {
      console.log("New message:", message);
      setMessages((messages) => [...messages, message]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setIsLoggedIn(false);
    });

    return () => {
      if (socket.connected) {
        console.log("Disconnecting socket");
        socket.disconnect();
      }
    };
  }, []);

  const handleSendMessage = () => {
    console.log("Sending message:", newMessage);
    setMessages([...messages, { text: newMessage, user: "You" }]);
    setNewMessage("");
    socket.emit("message", newMessage);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
      }}
    >
      {isLoggedIn ? (
        <>
          <h2>Chat</h2>
          <div
            style={{
              height: "300px",
              border: "1px solid #ddd",
              overflowY: "auto",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            {messages.map((message, index) => (
              <div key={index}>
                <strong>{message.user}:</strong> {message.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: "1", marginRight: "10px" }}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      ) : (
        <div className="container mt-5 text-center">
          <p className="fs-4">
            You must be logged in to use Chat Feature.
          </p>
          <p className="mb-0">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Chat;

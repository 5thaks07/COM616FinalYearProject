import React, { useState, useEffect } from "react";
import socket from "../socket";

function Chat() {
  // connect to socket
  useEffect(() => {
    if (!socket) return;
    console.log("socket:", socket);

    socket.on("connect", () => {
      console.log("Connected to socket", socket.id);
    });

    // Socket event listener for incoming messages
    socket.on("message", (message) => {
      console.log("New message:", message);
      setMessages((messages) => [...messages, message]);
    });


    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    console.log("Sending message:", newMessage);
    setMessages([...messages, { text: newMessage, user: "You" }]);
    setNewMessage("");
    socket.emit("message", { text: newMessage });
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
    </div>
  );
}

export default Chat;

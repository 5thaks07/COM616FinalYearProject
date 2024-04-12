import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import initializeSocket from "../socket";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null); // Store socket instance in state

console.log("socket",socket);

  useEffect(() => {
    // Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token not found. Please log in.");
      return;
    }

    // Initialize socket with token when component mounts
    const initializedSocket = initializeSocket(token);
    setSocket(initializedSocket);
    setIsLoggedIn(true); // Set isLoggedIn to true

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (initializedSocket && initializedSocket.connected) {
        initializedSocket.disconnect();
      }
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  // Check if socket is connected and user is logged in
 /*  useEffect(() => {
    console.log("Socket:", socket);
    if (socket && socket.connected) {
      setIsLoggedIn(true);
      console.log("User is logged in");
    } else {
      setIsLoggedIn(false);
      console.log("User is not logged in");
    }
  }, [socket]); // Listen for changes to the socket */

  const handleSendMessage = () => {
    
      socket.emit("message", newMessage);
    
    setMessages([...messages, { text: newMessage, user: "You" }]);
    setNewMessage("");
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
            You must be logged in to use the chat feature.
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
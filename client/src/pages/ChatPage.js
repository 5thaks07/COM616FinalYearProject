import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import initializeSocket from "../socket";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null); // Store socket instance in state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for opening chat

  console.log("socket", socket);
  useEffect(() => {
    // Fetch users from the backend
    fetchUsers();

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

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/user/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Users data", data);
        setUsers(data.users);
      } else {
        console.log("Failed to fetch users");
      }
    } catch (error) {
      console.log("Failed to fetch users", error);
    }
  };

  // Handle click on a user to open chat
  const handleUserClick = (user) => {
    setSelectedUser(user);
    console.log("Selected user", user);
    
    // fetch the chatId between the logged in user and the selected user
  const fetchChatId = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/chat/create/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Chat data", data);
        console.log("ChatId", data.chat._id);
        // join the chat room
       // socket.emit("joinRoom", data.chatId);
        // fetch messages for the chat
        fetchMessages(data.chat._id);
      } else {
        console.log("Failed to fetch chatId");
      }
    } catch (error) {
      console.log("Failed to fetch chatId", error);
    }     
  }
    fetchChatId();
  };


  // Fetch messages for the chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/message/get/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Messages data", data);
        setMessages(data.messages);
      } else {
        console.log("Failed to fetch messages");
      }
    } catch (error) {
      console.log("Failed to fetch messages", error);
    }
  };


  const handleSendMessage = () => {
    socket.emit("message", newMessage);
    setMessages([...messages, { text: newMessage, user: "You" }]);
    setNewMessage("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h3>Users</h3>
            </div>
            <ul className="list-group list-group-flush">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item"
                  onClick={() => handleUserClick(user)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          {isLoggedIn ? (
            <>
              <div className="card">
                <div className="card-header">
                  {selectedUser ? (
                    <h2>Chat with {selectedUser.name}</h2>
                  ) : (
                    <h2>Chat</h2>
                  )}
                </div>
                <div className="card-body">
                  {selectedUser ? (
                    <>
                      <div className="message-container">
                        {messages.map((message, index) => (
                          <div key={index}>
                            <strong>{message.user}:</strong> {message.text}
                          </div>
                        ))}
                      </div>
                      <div className="message-input">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="form-control"
                          placeholder="Type your message..."
                        />
                        <button
                          onClick={handleSendMessage}
                          className="btn btn-primary"
                        >
                          Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-center">
                      Select a user to start chatting
                    </p>
                  )}
                </div>
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
      </div>
    </div>
  );
}

export default Chat;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import initializeSocket from "../socket";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null); // Store socket instance in state
  const [users, setUsers] = useState([]);
  const [onlineusers, setOnlineUsers] = useState([]); // Store online users in state
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for opening chat
  const [chatId, setChatId] = useState(null);

  const chatContainerRef = useRef(null);

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

  // get all the online users
  useEffect(() => {
    if (socket) {
      socket.on("onlineusers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [socket]);

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

    // fetch the chatId between the logged in user and the selected user
    const fetchChatId = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/chat/create/${user._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();

          setChatId(data.chat._id);

          // fetch messages for the chat
          fetchMessages(data.chat._id);
        } else {
          console.log("Failed to fetch chatId");
        }
      } catch (error) {
        console.log("Failed to fetch chatId", error);
      }
    };
    fetchChatId();
  };

  // Fetch messages for the chat
  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/message/get/${chatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    if (!newMessage) {
      return;
    }

    // Emit the message to the backend with the recipient's ID
    socket.emit("sendmessage", {
      text: newMessage,
      recipientId: selectedUser._id,
    });

    setMessages([...messages, { text: newMessage, user: "You" }]);
    setNewMessage("");
    // send the message to the backend
    const sendMessage = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/message/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId: chatId,
            text: newMessage,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Message data", data);
        } else {
          console.log("Failed to send message");
        }
      } catch (error) {
        console.log("Failed to send message", error);
      }
    };
    sendMessage();
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages

  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    if (socket) {
      socket.on("getmessage", (msg) => {
        setMessages([
          ...messages,
          { text: msg.text, senderId: selectedUser._id },
        ]);
        console.log("Incoming message", msg);
      });

      return () => {
        socket.off("getmessage");
      };
    }
  }, [socket, messages, selectedUser]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <div className="card mt-4 ">
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
                  {onlineusers.some(
                    (onlineUser) => onlineUser.userId === user._id
                  ) && <span className="online-indicator"></span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          {isLoggedIn ? (
            <>
              <div className="card mt-4">
                <div className="card-header">
                  {selectedUser ? (
                    <h2>Chat with {selectedUser.name}</h2>
                  ) : (
                    <h2>Chat</h2>
                  )}
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "80vh", overflowY: "auto" }}
                  ref={chatContainerRef}
                >
                  {selectedUser ? (
                    <>
                      <div className="message-container">
                        {/* Display messages */}
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`message-row ${
                              message.senderId === selectedUser._id
                                ? "other-user-message"
                                : "user-message"
                            }`}
                            ref={chatContainerRef}
                          >
                            <div className="message-content">
                              {/* Render message sender based on whether it matches the selected user's ID */}
                              {message.senderId === selectedUser._id ? (
                                <div className="message-sender">
                                  {selectedUser.name}
                                </div>
                              ) : (
                                <div className="message-sender">You</div>
                              )}
                              <div className="message-text">{message.text}</div>
                            </div>
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

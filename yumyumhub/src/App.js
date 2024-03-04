import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from "./pages/UploadPage";
import "./App.css"; // Import the CSS file

const App = () => {
  // Mock user data
  const user = {
    id: 1,
    username: "exampleUser",
    // other user details
    image: "path_to_user_image",
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Sidebar userImage={user.image} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

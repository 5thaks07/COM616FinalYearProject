import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from "./pages/UploadPage";
import SavedRecipes from "./pages/SavedRecipes";
import UserProfile from "./pages/UserProfile";
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
        <Sidebar userImage={user.image} />
        <div className="content">
          <Routes>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

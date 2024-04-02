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
import ReadMorePage from "./pages/ReadMorePage";
import UserProfilePage from "./pages/UserProfilePage";
import UploadedRecipesPage from "./pages/UploadedRecipesPage";
import UpdateRecipePage from "./pages/UpdateRecipePage";
import SavedRecipesPage from "./pages/SavedRecipesPage";
import  socket  from "./socket";
import { useEffect } from "react";

// import css file
import "./App.css"; 



const App = () => {

  // connect to socket
useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected to socket", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket");
  });

  return () => {
    socket.disconnect();
  };
}, []);


  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
            <Route path="/recipe/detail/:id" element={<ReadMorePage />} />
            <Route path="/user-profile/:id" element={<UserProfilePage />} />
            <Route path="/uploaded-recipes" element={<UploadedRecipesPage />} />
            <Route path="/update-recipe/:id" element={<UpdateRecipePage />} />
            <Route path="/saved-recipes-list" element={<SavedRecipesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

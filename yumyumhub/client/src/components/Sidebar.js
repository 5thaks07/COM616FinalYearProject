import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaCloudUploadAlt } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { LuBookMarked } from "react-icons/lu";

const Sidebar = ({ userImage }) => {
  return (
    <div className="sidebar">
      <Link to="/user-profile">
        <FaUser />
        {userImage ? (
          <img src={userImage} alt="User Profile" />
        ) : (
          <FaUser /> // Use the default user icon if no image
        )}
      </Link>
      <Link to="/">
        {" "}
        <FaHome /> Home
      </Link>
      <Link to="/chat">
        {" "}
        <IoIosChatbubbles /> Chat
      </Link>
      <Link to="/saved-recipes">
        {" "}
        <LuBookMarked /> Saved Recipes
      </Link>
      <Link to="/upload">
        {" "}
        <FaCloudUploadAlt />
        Upload
      </Link>
    </div>
  );
};

export default Sidebar;

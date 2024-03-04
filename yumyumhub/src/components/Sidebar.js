import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userImage }) => {
  return (
    <div className="sidebar">
      <Link to="/user-profile">
        <img src={userImage || 'path_to_default_image'} alt="User Profile" />
      </Link>
      <Link to="/">Home</Link>
      <Link to="/chat">Chat</Link>
      <Link to="/saved-recipes">Saved Recipes</Link>
      <Link to="/upload">Upload</Link>
    </div>
  );
};

export default Sidebar;

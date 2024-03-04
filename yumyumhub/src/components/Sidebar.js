import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ userImage }) => {
  return (
    <div className="sidebar">
      <img src={userImage || 'path_to_default_image'} alt="User Profile" />
      <Link to="/">Home</Link>
      <Link to="/saved-recipes">Saved Recipes</Link>
      <Link to="/upload">Upload</Link>
    </div>
  );
};

export default Sidebar;

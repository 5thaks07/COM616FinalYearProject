import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">YumYumHub</div>
      <input type="text" placeholder="Search recipes..." />
      <Link to="/chat">
        <div className="chat-logo">Chat</div>
      </Link>
    </div>
  );
};

export default Navbar;

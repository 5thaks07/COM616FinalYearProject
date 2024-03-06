import React from "react";
import { BiSolidDish } from "react-icons/bi";

const Navbar = () => {
  return (
    <nav>
      <div className="navbar">
        <div className="logo">
          {" "}
          <BiSolidDish />
          YumYumHub
        </div>
        <input type="text" placeholder="Search recipes... " /> 
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { BiSolidDish } from "react-icons/bi";

const Navbar = ({ onSearchSubmit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(searchTerm);
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <div className="navbar-brand">
          <BiSolidDish /> YumYumHub
        </div>
        <form className="d-flex" onSubmit={handleSubmit} role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search by recipe name"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;

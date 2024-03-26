import React from "react";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await fetch("http://localhost:5000/user/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      localStorage.removeItem("token");
      if (response.ok) {
        alert(data.message);
        // Redirect to login page after successful logout
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to logout User");
    }
  };

  // Check if the user is logged in based on the presence of a token in localStorage
  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <div>
      <h1>User Profile</h1>
      {isLoggedIn ? (
        <>
          {/* Other user profile content */}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>
          Please <Link to="/login">Login</Link> to view your profile.
        </p>
      )}
    </div>
  );
};

export default UserProfile;

import React from "react";
import { Link } from "react-router-dom";


const UserProfile = ({ userImage, isLoggedIn }) => {
  return (
    <div>
      <h1>User Profile</h1>
      {isLoggedIn ? (
        <>
          <img src={userImage} alt="User" />
          {/* Other user profile content */}
        </>
      ) : (
        <p>Please <Link to="/login"></Link> to view your profile.</p>
      )}
    </div>
  );
};

export default UserProfile;

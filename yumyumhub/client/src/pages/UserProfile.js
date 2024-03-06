import React from 'react';

const UserProfile = ({ userImage }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <img src={userImage} alt="User" />
      {/* Other user profile content */}
    </div>
  );
};

export default UserProfile;

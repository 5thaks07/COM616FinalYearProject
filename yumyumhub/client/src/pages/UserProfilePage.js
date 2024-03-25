import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log("Fetching user profile... with id:", id);
        const response = await fetch(`http://localhost:5000/user/${id}`);

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error("Failed to fetch user profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default UserProfilePage;

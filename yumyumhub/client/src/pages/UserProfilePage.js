import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/profile/${id}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
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
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">User Profile</h1>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Name:</strong> {user.name}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {user.email}
            </li>
            <li className="list-group-item">
              <strong>Uploaded Recipes Count:</strong>{" "}
              {user.uploadedRecipesCount}
            </li>
          </ul>
          {/* Add more user details as needed */}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUserDetails(data);
          setName(data.name);
          setEmail(data.email);
        } else {
          console.error("Failed to fetch user profile:", data.message);
          // Redirect to login page if unauthorized or token expired
          if (response.status === 401) {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password })   
      });
      console.log(response);
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Update local state with new user details
        setUserDetails(data.user);
      } else {
        console.error("Failed to update user details:", data.message);
        alert("Failed to update user details. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update user details. Please try again later.");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
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
    <div className="container mt-5">
      <h1>User Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : isLoggedIn && userDetails ? (
        <div>
          <form onSubmit={handleUpdateUser}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Update</button>
          </form>
          <p><strong>Uploaded Recipes Count:</strong> {userDetails.uploadedRecipesCount}</p>
          <p><strong>Saved Recipes Count:</strong> {userDetails.savedRecipesCount}</p>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          Please <Link to="/login"><strong>Login</strong></Link> to view your profile.
        </div>
      )}
    </div>
  );
};

export default UserProfile;

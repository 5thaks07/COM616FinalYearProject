import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
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

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/user/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Failed to delete user account:", data.message);
          alert("Failed to delete user account. Please try again later.");
        }
      } catch (error) {
        console.error("Error deleting user account:", error);
        alert("Failed to delete user account. Please try again later.");
      }
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
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to logout User");
    }
  };

  const isLoggedIn = localStorage.getItem("token") !== null;

  return (
    <div className="container mt-5">
      {loading ? (
        <p>Loading...</p>
      ) : isLoggedIn && userDetails ? (
        <div>
          <h1 className="mb-4">User Profile</h1>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleUpdateUser}>
              Update
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="mt-4">
            <p>
              <strong>
                <Link to="/uploaded-recipes" className="btn btn-primary">
                  <i className="fas fa-upload"></i> Uploaded Recipes: {userDetails.uploadedRecipesCount}
                </Link>
              </strong>{" "}
            </p>
            <p>
              <strong>
                <Link to="/saved-recipes-list" className="btn btn-success">
                  <i className="fas fa-save"></i> Saved Recipes: {userDetails.savedRecipesCount}
                </Link>
              </strong>{" "}
            </p>
          </div>
        </div>
      ) : (
        <div className="container mt-5 text-center">
          <p className="fs-4">You must be logged in to view your profile.</p>
          <p className="mb-0">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

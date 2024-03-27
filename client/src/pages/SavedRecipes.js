import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

const SavedRecipes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is logged in
      setIsLoggedIn(true);
      fetchSavedRecipes(token);
    }
  }, []);

  const fetchSavedRecipes = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/user/savedrecipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Check if data.savedRecipes is an array
        if (Array.isArray(data.savedRecipes)) {
          setSavedRecipes(data.savedRecipes);
        } else {
          console.error("Invalid savedRecipes data:", data.savedRecipes);
        }
      } else {
        console.error("Failed to fetch saved recipes:", data.message);
      }
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <div>
          <h1 className="mb-4">Saved Recipes</h1>
          {loading ? (
            <p>Loading...</p>
          ) : savedRecipes.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {savedRecipes.map((recipe, index) => (
                <div key={index} className="col">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <p>No saved recipes found.</p>
          )}
        </div>
      ) : (
        <div className="container mt-5 text-center">
          <p className="fs-4">
            You must be logged in to access your saved recipes.
          </p>
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

export default SavedRecipes;

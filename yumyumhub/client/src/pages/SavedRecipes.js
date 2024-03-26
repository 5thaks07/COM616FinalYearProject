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
      const response = await fetch('http://localhost:5000/user/savedrecipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Check if data.savedRecipes is an array
        if (Array.isArray(data.savedRecipes)) {
          setSavedRecipes(data.savedRecipes);
          console.log(data.savedRecipes);
        } else {
          console.error('Invalid savedRecipes data:', data.savedRecipes);
        }
      } else {
        console.error('Failed to fetch saved recipes:', data.message);
      }
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Saved Recipes</h1>
          {loading ? (
            <p>Loading...</p>
          ) : savedRecipes.length > 0 ? (
            <div className="row">
              {savedRecipes.map((recipe, index) => (
                <div key={index} className="col-md-4 mb-3">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <p>No saved recipes found.</p>
          )}
        </div>
      ) : (
        <div>
          <p>You need to be logged in to view saved recipes.</p>
          <p>
            Please <Link to="/login">login</Link> to access your saved recipes.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;

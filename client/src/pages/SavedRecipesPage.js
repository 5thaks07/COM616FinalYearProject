import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SavedRecipesPage = () => {
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

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/user/savedrecipes/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Remove the deleted recipe from the savedRecipes state
        setSavedRecipes(
          savedRecipes.filter((recipe) => recipe._id !== recipeId)
        );
        alert(data.message);
        console.log("Recipe deleted successfully:", data.message);
      } else {
        console.error("Failed to delete recipe:", data.message);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
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
            <div className="list-group">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">{recipe.name}</h5>
                    <p className="mb-1">{recipe.shortDescription}</p>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRecipe(recipe._id)}
                  >
                    Delete
                  </button>
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

export default SavedRecipesPage;

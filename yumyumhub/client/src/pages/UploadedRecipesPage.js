import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadedRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/recipe/uploadedlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Data:", data);
        if (response.ok) {
          setRecipes(data);
        } else {
          console.error("Failed to fetch recipes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleUpdate = (recipeId) => {
    // navigate to the update recipe page
    navigate(`/update-recipe/${recipeId}`);
  };

  const handleDelete = async (recipeId) => {
    // Send a request to the backend to delete the recipe
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/recipe/delete/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Remove the deleted recipe from the UI
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );
      } else {
        console.error("Failed to delete the recipe:", data.message);
        alert("Failed to delete the recipe. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting the recipe:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Uploaded Recipes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p>No uploaded recipes found.</p>
      ) : (
        <ul className="list-group">
          {recipes.map((recipe) => (
            <li
              key={recipe._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 className="mb-1">{recipe.name}</h5>
                <p className="mb-1">{recipe.shortDescription}</p>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={() => handleUpdate(recipe._id)}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(recipe._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadedRecipesPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const ReadMorePage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate hook for navigation

  const [recipe, setRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/recipe/detail/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setRecipe(data.recipe);
          setUser(data.user);
        } else {
          console.error("Failed to fetch recipe detail:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recipe detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [id]);

  const goToUserProfile = () => {
    if (user) {
      // Redirect to the user profile page using navigate
      navigate(`/user-profile/${user._id}`);
    }
  };

  const handleSaveRecipe = () => {
    // Logic to save the recipe
    console.log("Recipe saved!");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-4">
                {recipe.images.map((image, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <img
                      src={image}
                      alt={`Recipe ${index + 1}`}
                      className="img-fluid"
                    />
                  </div>
                ))}
              </div>
              <h1 className="card-title">{recipe.name}</h1>
              <p className="card-text">{recipe.shortDescription}</p>
              <div className="mb-3">
                Uploaded by -{" "}
                <Button variant="primary" onClick={goToUserProfile}>
                  {user ? user.name : "Unknown"}
                </Button>
              </div>
              <div className="mb-3">
                <Button variant="success" onClick={handleSaveRecipe}>
                  Save Recipe
                </Button>
              </div>
              <hr />
              <p>
                <strong>Full Description:</strong> {recipe.fullDescription}
              </p>
              <p>
                <strong>Ingredients:</strong> {recipe.ingredients}
              </p>
              <p>
                <strong>Servings:</strong> {recipe.servings}
              </p>
              <p>
                <strong>Time:</strong> {recipe.time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadMorePage;

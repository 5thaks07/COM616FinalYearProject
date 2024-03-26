import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const [liked, setLiked] = useState(false);

  // Ensure recipe object is valid before rendering
  if (!recipe || typeof recipe !== 'object') {
    return null; // Return null or render a placeholder component
  }

  const handleLike = async () => {
    // Send a request to the backend to like the recipe
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/recipe/like/${recipe._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // If the like was successful, update the UI
        setLiked(true);
        // You can also update the like count in the UI
      } else if (response.status === 401) {
        console.error("Failed to like the recipe: Unauthorized");
        alert("Please login to like the recipe");
      } else {
        console.error("Failed to like the recipe");
        response.json().then((data) => alert(data.message));
      }
    } catch (error) {
      console.error("Error liking the recipe:", error);
    }
  };

  return (
    <Card style={{ marginBottom: "20px" }}>
      {/* Display only the first image if it exists */}
      {recipe.images && recipe.images.length > 0 && (
        <Card.Img variant="top" src={recipe.images[0]} alt={recipe.name} />
      )}
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>{recipe.shortDescription}</Card.Text>
        <Card.Text>
          <strong>Servings:</strong> {recipe.servings}
        </Card.Text>
        <Card.Text>
          <strong>Time:</strong> {recipe.time}
        </Card.Text>
        <Card.Text>
          <strong>Likes:</strong> {recipe.likes}
        </Card.Text>
        {!liked && (
          <Button variant="primary" onClick={handleLike}>
            Like
          </Button>
        )}
        <Link
          to={`/recipe/detail/${recipe._id}`}
          style={{ textDecoration: "none" }}
        >
          <Button variant="secondary" style={{ marginLeft: "10px" }}>
            Read More
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};


export default RecipeCard;

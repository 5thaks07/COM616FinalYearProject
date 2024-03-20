import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  // Check if recipe is defined
  if (!recipe) {
    return null; // or handle it in some way
  }

  // Extract details from the recipe prop
  const { name, shortDescription, servings, time, likes, images } = recipe;

  console.log(images);
  return (
    <div
      className="recipe-card"
      style={{
        border: "4px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      {/* Display only the first image */}
      {images.length > 0 && (
        <img
          src={images[0]} // Display the first image
          alt={name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px 8px 0 0",
          }}
        />
      )}
      <div style={{ padding: "15px" }}>
        <h3>{name}</h3>
        <p>Description: {shortDescription}</p>
        <p>Servings: {servings}</p>
        <p>Time: {time}</p>
        <p>Likes: {likes}</p>
        {/* Add a "Read More" link */}
        <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: "none" }}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;

import React from "react";

const RecipeCard = ({ recipe }) => {
  // Check if recipe is defined
  if (!recipe) {
    return null; // or handle it in some way
  }

  // Extract details from the recipe prop
  const { name, type, shortDescription, ingredients, servings, time, images } =
    recipe;

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
      {/* Assuming the first image in the images array is the main image */}
      {images.length > 0 && (
        <img
          src={images[0]}
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
        <p>Type: {type}</p>
        <p>Description: {shortDescription}</p>
        <p>Ingredients: {ingredients}</p>
        <p>Servings: {servings}</p>
        <p>Time: {time}</p>
      </div>
    </div>
  );
};

export default RecipeCard;

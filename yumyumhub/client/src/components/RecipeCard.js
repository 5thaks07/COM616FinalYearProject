// RecipeCard.js
import React from 'react';

const RecipeCard = ({ recipe }) => {
  // Check if recipe is defined
  if (!recipe) {
    return null; // or handle it in some way
  }

  // Extract details from the recipe prop
  const { image, title, description } = recipe;

  return (
    <div className="recipe-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default RecipeCard;

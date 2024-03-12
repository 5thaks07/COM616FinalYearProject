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
    <div className="recipe-card" style={{ border: '4px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
      <img src={image} alt={title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
      <div style={{ padding: '15px' }}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default RecipeCard;

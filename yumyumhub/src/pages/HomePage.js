import React from 'react';
import RecipeCard from '../components/RecipeCard';
import Navbar from "../components/Navbar";

function RecipeList() {
  const recipes = [
    {
      id: 1,
      image: 'pasta.jpg',
      title: 'Delicious Pasta',
      description: 'A simple and tasty pasta recipe that you can make in under 30 minutes.',
    },
    // Add more recipes as needed
    {
      id: 2,
      image: 'burger.jpg',
      title: 'Classic Burger',
      description: 'The all-time favorite classic burger with a juicy patty and fresh veggies.',
    },
    {
      id: 3,
      image: 'salad.jpg',
      title: 'Fresh Salad',
      description: 'A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.',
    },
  ];

  return (
    <div>
      <Navbar />
      <h1>Recipes</h1>
      <p>Explore a wide range of recipes from around the world.</p>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          image={recipe.image}
          title={recipe.title}
          description={recipe.description}
        />
      ))}
    </div>
      
      
      
    
  );
}

export default RecipeList;

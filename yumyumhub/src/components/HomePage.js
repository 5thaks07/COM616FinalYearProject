import React from 'react';
import RecipeCard from './RecipeCard';

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
    <main style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
      <h2>Featured Recipes</h2>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          image={recipe.image}
          title={recipe.title}
          description={recipe.description}
        />
      ))}
    </main>
  );
}

export default RecipeList;

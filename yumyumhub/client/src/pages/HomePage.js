import React from "react";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function RecipeList() {
  const recipes = [
    {
      id: 1,
      image: "pasta.jpg",
      title: "Delicious Pasta",
      description:
        "A simple and tasty pasta recipe that you can make in under 30 minutes.",
    },
    // Add more recipes as needed
    {
      id: 2,
      image: "burger.jpg",
      title: "Classic Burger",
      description:
        "The all-time favorite classic burger with a juicy patty and fresh veggies.",
    },
    {
      id: 3,
      image: "salad.jpg",
      title: "Fresh Salad",
      description:
        "A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.",
    },
    // Repeat the recipes to demonstrate the scrolling effect
    // Add more recipes as needed
    {
      id: 4,
      image: "pasta.jpg",
      title: "Delicious Pasta",
      description:
        "A simple and tasty pasta recipe that you can make in under 30 minutes.",
    },
    {
      id: 5,
      image: "burger.jpg",
      title: "Classic Burger",
      description:
        "The all-time favorite classic burger with a juicy patty and fresh veggies.",
    },
    {
      id: 6,
      image: "salad.jpg",
      title: "Fresh Salad",
      description:
        "A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="Home">
        <h1>Recipes</h1>
        <p>Explore a wide range of recipes from around the world.</p>
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RecipeList;

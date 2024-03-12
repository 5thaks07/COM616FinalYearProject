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
      score: 8.8,
      duration: "30 mins",
    },
    // Add more recipes as needed
    {
      id: 2,
      image: "burger.jpg",
      title: "Classic Burger",
      description:
        "The all-time favorite classic burger with a juicy patty and fresh veggies.",
      score: 9.0,
      duration: "20 mins",
    },
    {
      id: 3,
      image: "salad.jpg",
      title: "Fresh Salad",
      description:
        "A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.",
      score: 8.5,
      duration: "15 mins",
    },
    // Repeat the recipes to demonstrate the scrolling effect
    // Add more recipes as needed
    {
      id: 4,
      image: "pasta.jpg",
      title: "Delicious Pasta",
      description:
        "A simple and tasty pasta recipe that you can make in under 30 minutes.",
      score: 8.8,
      duration: "30 mins",
    },
    {
      id: 5,
      image: "burger.jpg",
      title: "Classic Burger",
      description:
        "The all-time favorite classic burger with a juicy patty and fresh veggies.",
      score: 9.0,
      duration: "20 mins",
    },
    {
      id: 6,
      image: "salad.jpg",
      title: "Fresh Salad",
      description:
        "A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.",
      score: 8.5,
      duration: "15 mins",
    },
  ];

  return (
    <>
      <Navbar />
      <main role="main">
        <section className="jumbotron text-center">
          <div className="container">
            <h1>The Largest Collection of Recipes in the World</h1>
            <p className="lead text-muted">Search, Explore, Upload and Enjoy.</p>
            <h2>Discover Recipes From All Over The World</h2>
          </div>
        </section>

        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
              {recipes.map((recipe) => (
                <div className="col-md-4" key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default RecipeList;

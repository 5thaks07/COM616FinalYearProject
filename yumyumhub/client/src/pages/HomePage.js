import React from "react";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TestImage from "../assests/daylily-flower-and-buds-blur2.jpg";

function RecipeList() {
  const recipes = [
    {
      id: 1,
      name: "Delicious Pasta",
      type: "Pasta",
      shortDescription:
        "A simple and tasty pasta recipe that you can make in under 30 minutes.",
      ingredients: "Pasta, Sauce, Cheese, Olive Oil, Salt, Pepper",
      servings: 2,
      time: "30 mins",
      likes: 20,
      rating: 4.5,
      images: [TestImage],
    },

    {
      id: 2,
      name: "Classic Burger",
      type: "Burger",
      shortDescription:
        "The all-time favorite classic burger with a juicy patty and fresh veggies.",
      ingredients: "Beef Patty, Buns, Lettuce, Tomato, Onion, Ketchup, Mustard",
      servings: 1,
      time: "20 mins",
      likes: 15,
      rating: 4.8,
      images: ["burger.jpg"],
    },
    {
      id: 3,
      name: "Fresh Salad",
      type: "Salad",
      shortDescription:
        "A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.",
      ingredients: "Lettuce, Tomatoes, Cucumbers, Dressing",
      servings: 4,
      time: "15 mins",
      likes: 25,
      rating: 4.2,
      images: ["salad.jpg"],
    },
    {
      id: 4,
      name: "Delicious Pasta",
      type: "Pasta",
      shortDescription:
        "A simple and tasty pasta recipe that you can make in under 30 minutes.",
      ingredients: "Pasta, Sauce, Cheese, Olive Oil, Salt, Pepper",
      servings: 2,
      time: "30 mins",
      likes: 20,
      rating: 4.5,
      images: ["pasta.jpg"],
    },
    {
      id: 5,
      name: "Classic Burger",
      type: "Burger",
      shortDescription:
        "The all-time favorite classic burger with a juicy patty and fresh veggies.",
      ingredients: "Beef Patty, Buns, Lettuce, Tomato, Onion, Ketchup, Mustard",
      servings: 1,
      time: "20 mins",
      likes: 15,
      rating: 4.8,
      images: ["burger.jpg"],
    },
    {
      id: 6,
      name: "Fresh Salad",
      type: "Salad",
      shortDescription:
        "A healthy and refreshing salad with a mix of greens, tomatoes, and dressing.",
      ingredients: "Lettuce, Tomatoes, Cucumbers, Dressing",
      servings: 4,
      time: "15 mins",
      likes: 25,
      rating: 4.2,
      images: ["salad.jpg"],
    },
  ];

  return (
    <>
      <Navbar />
      <main role="main">
        <section className="jumbotron text-center">
          <div className="container">
            <h1>The Largest Collection of Recipes in the World</h1>
            <p className="lead text-muted">
              Search, Explore, Upload and Enjoy.
            </p>
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

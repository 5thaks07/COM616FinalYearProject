import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from your API endpoint
    fetch("http://localhost:5000/recipe/list")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

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

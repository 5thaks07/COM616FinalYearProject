import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [initialRecipes, setInitialRecipes] = useState([]);

  // Function to fetch recipes from the API
  const fetchRecipes = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/recipe/list");
      const data = await response.json();
      setRecipes(data);
      setInitialRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  }, []);

  // Fetch recipes when the component mounts
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Function to handle search form submission
  const handleSearchSubmit = (searchTerm) => {
    const filteredRecipes = initialRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRecipes(filteredRecipes);
  };

  // Function to reset the recipes list to the initial list
  const resetRecipes = () => {
    setRecipes(initialRecipes);
  };

  return (
    <>
      <Navbar onSearchSubmit={handleSearchSubmit} onReset={resetRecipes} />
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
                <div className="col-md-4" key={recipe._id}>
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

import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [initialRecipes, setInitialRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  // Function to fetch recipes from the API
  const fetchRecipes = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/recipe/list");
      const data = await response.json();
      setRecipes(data);
      setInitialRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
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
    setCurrentPage(1); // Reset to first page when searching
  };

  // Function to reset the recipes list to the initial list
  const resetRecipes = () => {
    setRecipes(initialRecipes);
    setCurrentPage(1); // Reset to first page when resetting
  };

  // Logic to get current recipes to display based on pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            {loading ? (
              <p>Loading...</p>
            ) : currentRecipes.length === 0 ? (
              <p>No recipes found.</p>
            ) : (
              <div className="row">
                {currentRecipes.map((recipe) => (
                  <div className="col-md-4" key={recipe._id}>
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            )}
            {/* Pagination */}
            <nav>
              <ul className="pagination justify-content-center">
                {[...Array(Math.ceil(recipes.length / recipesPerPage)).keys()].map((number) => (
                  <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                    <button onClick={() => paginate(number + 1)} className="page-link">{number + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default RecipeList;

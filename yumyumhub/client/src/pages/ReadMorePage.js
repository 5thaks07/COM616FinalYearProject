import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReadMorePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipe/detail/${id}`);
        const data = await response.json();
        if (response.ok) {
          setRecipe(data.recipe);
          setUser(data.user);
        } else {
          console.error('Failed to fetch recipe detail:', data.message);
        }
      } catch (error) {
        console.error('Error fetching recipe detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-4">
                {recipe.images.map((image, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <img
                      src={image}
                      alt={`Recipe ${index + 1}`}
                      className="img-fluid"
                    />
                  </div>
                ))}
              </div>
              <h1 className="card-title">{recipe.name}</h1>
              <p><strong>Short Description:</strong> {recipe.shortDescription}</p>
              <p><strong>Full Description:</strong> {recipe.fullDescription}</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
              <p><strong>Time:</strong> {recipe.time}</p>
              {user && <p><strong>Uploaded by:</strong> {user.name}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadMorePage;

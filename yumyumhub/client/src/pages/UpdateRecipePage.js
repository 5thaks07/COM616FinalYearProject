import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UpdateRecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/recipe/detail/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setRecipe(data.recipe);
        } else {
          console.error("Failed to fetch recipe:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataWithImages = new FormData();

      // Append only the form fields to the FormData object
      formDataWithImages.append("name", recipe.name);
      formDataWithImages.append("type", recipe.type);
      formDataWithImages.append("shortDescription", recipe.shortDescription);
      formDataWithImages.append("fullDescription", recipe.fullDescription);
      formDataWithImages.append("ingredients", recipe.ingredients);
      formDataWithImages.append("servings", recipe.servings);
      formDataWithImages.append("time", recipe.time);

      // Append each image separately to the FormData object
      recipe.images.forEach((image, index) => {
        formDataWithImages.append(`image${index}`, image);
      });

      // Send the form data with images to the server
      const response = await fetch(
        `http://localhost:5000/recipe/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataWithImages,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        console.error("Failed to update recipe:", data.message);
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Update Recipe</h1>
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type:</label>
          <input
            type="text"
            className="form-control"
            name="type"
            value={recipe.type}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Short Description:</label>
          <input
            type="text"
            className="form-control"
            name="shortDescription"
            value={recipe.shortDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Full Description:</label>
          <textarea
            className="form-control"
            name="fullDescription"
            value={recipe.fullDescription}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Ingredients:</label>
          <textarea
            className="form-control"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Servings:</label>
          <input
            type="number"
            className="form-control"
            name="servings"
            value={recipe.servings}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Time:</label>
          <input
            type="text"
            className="form-control"
            name="time"
            value={recipe.time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Images:</label>
          <input
            type="file"
            className="form-control"
            name="images"
            accept=".jpg, .jpeg"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipePage;

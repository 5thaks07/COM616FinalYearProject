import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UploadRecipeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    shortDescription: "",
    fullDescription: "",
    ingredients: "",
    servings: "",
    time: "",
    images: [],
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of the token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      // Create a new FormData object
      const formDataWithImages = new FormData();
  
      // Append all form data fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithImages.append(key, value);
      });
  
      // Append images to FormData
      formData.images.forEach((image, index) => {
        formDataWithImages.append(`image_${index}`, image);
      });
  
      // Send the form data with images to the server
      const response = await fetch("http://localhost:5000/recipe/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataWithImages,
      });
  
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      }
  
      // Reset form fields
      setFormData({
        name: "",
        type: "",
        shortDescription: "",
        fullDescription: "",
        ingredients: "",
        servings: "",
        time: "",
        images: [],
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  if (!isLoggedIn) {
    return (
      <div className="container mt-5 text-center">
        <p className="fs-4">You must be logged in to upload a recipe.</p>
        <p className="mb-0">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upload Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
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
            value={formData.type}
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
            value={formData.shortDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Full Description:</label>
          <textarea
            className="form-control"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Ingredients:</label>
          <textarea
            className="form-control"
            name="ingredients"
            value={formData.ingredients}
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
            value={formData.servings}
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
            value={formData.time}
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadRecipeForm;

import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const RecipeCard = ({ recipe }) => {
  // Check if recipe is defined
  if (!recipe) {
    return null; // or handle it in some way
  }

  // Extract details from the recipe prop
  const { name, shortDescription, servings, time, likes, images } = recipe;

  return (
    <Card style={{ marginBottom: "20px" }}>
      {/* Display only the first image */}
      {images.length > 0 && (
        <Card.Img
          variant="top"
          src={images[0]} // Display the first image
          alt={name}
        />
      )}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{shortDescription}</Card.Text>
        <Card.Text>
          <strong>Servings:</strong> {servings}
        </Card.Text>
        <Card.Text>
          <strong>Time:</strong> {time}
        </Card.Text>
        <Card.Text>
          <strong>Likes:</strong> {likes}
        </Card.Text>
        <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: "none" }}>
          <Button variant="primary">Read More</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import RecipeCard from "./RecipeCard";

describe("RecipeCard component", () => {
  const recipe = {
    _id: "123",
    name: "Test Recipe",
    shortDescription: "This is a test recipe",
    servings: 4,
    time: "30 minutes",
    likes: 10,
    images: ["test.jpg"],
  };

  test("renders recipe details correctly", () => {
    render(
      <Router>
        <RecipeCard recipe={recipe} />
      </Router>
    );
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("This is a test recipe")).toBeInTheDocument();
  });

  test("renders like button", () => {
    render(
      <Router>
        <RecipeCard recipe={recipe} />
      </Router>
    );
    const likeButton = screen.getByText("Like");
    expect(likeButton).toBeInTheDocument();
  });

  test("renders read more button with correct link", () => {
    render(
      <Router>
        <RecipeCard recipe={recipe} />
      </Router>
    );
    const readMoreButton = screen.getByText("Read More");
    expect(readMoreButton).toBeInTheDocument();
    const anchorElement = screen.getByRole("link", { name: /Read More/i });
    expect(anchorElement).toHaveAttribute(
      "href",
      `/recipe/detail/${recipe._id}`
    );
  });
});

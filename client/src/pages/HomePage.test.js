import React from "react";
import { render, screen } from "@testing-library/react";

import RecipeList from "./HomePage";

describe("RecipeList component", () => {
  test("renders loading state initially", () => {
    render(<RecipeList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

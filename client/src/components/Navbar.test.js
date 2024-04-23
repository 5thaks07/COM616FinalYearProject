import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar component", () => {
  test("renders navbar with correct title", () => {
    render(<Navbar />);
    expect(screen.getByText("YumYumHub")).toBeInTheDocument();
  });

  test("updates search term when user types", () => {
    render(<Navbar />);
    const searchInput = screen.getByPlaceholderText("Search by recipe name");
    fireEvent.change(searchInput, { target: { value: "vadapav" } });
    expect(searchInput.value).toBe("vadapav");
  });

  test("calls onSearchSubmit prop when form is submitted", () => {
    const mockOnSearchSubmit = jest.fn();
    render(<Navbar onSearchSubmit={mockOnSearchSubmit} />);
    const searchInput = screen.getByPlaceholderText("Search by recipe name");
    fireEvent.change(searchInput, { target: { value: "pizza" } });
    fireEvent.submit(screen.getByRole("search"));
    expect(mockOnSearchSubmit).toHaveBeenCalledWith("pizza");
  });
});

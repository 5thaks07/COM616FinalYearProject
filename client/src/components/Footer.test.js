import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer component", () => {
  test("renders social media buttons", () => {
    render(<Footer />);
    expect(screen.getByTestId("facebook-button")).toBeInTheDocument();
    expect(screen.getByTestId("youtube-button")).toBeInTheDocument();
    expect(screen.getByTestId("instagram-button")).toBeInTheDocument();
    expect(screen.getByTestId("twitter-button")).toBeInTheDocument();
  });

  test("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText("© 2024 YumYumHub")).toBeInTheDocument();
  });
});

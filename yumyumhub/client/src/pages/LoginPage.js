import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const loginUser = async (email, password) => {
  const user = { email, password };
  try {
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      return { success: true };
    } else {
      return { success: false, message: data.message || "Login failed" };
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "An error occurred, please try again later" };
  }
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { success, message } = await loginUser(email, password);
    if (success) {
      navigate("/user-profile");
    } else {
      setErrorMessage(message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;

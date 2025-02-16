import React, { useState } from "react";
import { Link } from "react-router-dom"; // Voor navigatie naar oaRegister

function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token); // Sla token op in localStorage
        setIsLoggedIn(true); // Zet gebruikerstatus naar ingelogd
        setMessage("Login successful");
      } else {
        setMessage(result.message); // Toon foutmelding
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Login failed.");
    }
  };

  return (
    <div className="container login-page d-flex">
      {/* Linker kolom */}
      <div className="col-6 register-section d-flex flex-column justify-content-center align-items-center bg-indigo text-white p-4">
        <h2>Don't have an account?</h2>
        <p>Sign up today and explore the universe!</p>
        <Link to="/register">
          <button className="btn btn-light">Register</button>
        </Link>
      </div>

      {/* Rechter kolom */}
      <div className="col-6 login-section d-flex flex-column justify-content-center p-4">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        {message && <p className="mt-3">{message}</p>} {/* Feedback bericht */}
      </div>
    </div>
  );
}

export default Login;

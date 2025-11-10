// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data); // store user + token
      navigate("/dashboard"); // redirect
    } catch (err) {
      setError(err.response?.data?.message || "❌ Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.header}>🧾 Invoice Generator Website</h1>

        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back </h2>
          <p style={styles.subtitle}>Login to manage your invoices</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.link}>
            Don’t have an account?{" "}
            <Link to="/signup" style={styles.anchor}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  header: {
    color: "white",
    marginBottom: "25px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
  },
  card: {
    backgroundColor: "white",
    padding: "40px 30px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  title: {
    color: "#333",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#555",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
  error: {
    color: "red",
    marginTop: "15px",
    fontWeight: "500",
  },
  link: { marginTop: "20px", color: "#333" },
  anchor: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
};

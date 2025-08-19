import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/logo.png"; 
import Message from "../components/Message";  

export default function Login({ setUser }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      } else {
        setError(data.error|| "Login failed. Please try again.");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while logging in.");
      setSuccess("");
    }
  };

  return (
    <div className="auth-wrapper" style={{ marginTop: "5%" }}>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="auth-container">
        <h2>Login</h2>
        <Message type="success" text={success} />
        <Message type="error" text={error} />
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p className="switch-text">
          Not registered? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

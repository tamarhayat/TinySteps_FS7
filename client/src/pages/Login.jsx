import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/logo.png"; 
import Message from "../components/Message";  

export default function Login({ setUser ,setChildren, setSelectedChild}) {
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
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user?.role === "parent") {
          // Fetch children
          const url = `http://localhost:3000/api/children/parent/${data.user.id}`;
          fetch(url)
            .then((res) => {
              if (!res.ok) throw new Error(`Request failed: ${res.status}`);
              return res.json();
            })
            .then((childrenData) => {
              const list = Array.isArray(childrenData) ? childrenData : [];
              setChildren(list);

              localStorage.setItem("children", JSON.stringify(list));
              localStorage.setItem("selectedChild", JSON.stringify(null));
              navigate("/");
            })
            .catch((err) => {
              console.error("Fetch children error:", err);
              navigate("/"); 
            });
        } else {
          
          navigate("/");
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
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
        <Message className="message" type="success" text={success} />
        <Message className="message" type="error" text={error} />
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

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/logo.png";
import Message from "../components/Message";

export default function Register({ setUser, setChildren }) {
  const [id, setId] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState(""); // שדה חדש
  const [role, setRole] = useState("parent");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const isIdValid = /^[0-9]{9}$/.test(id);

  const handleRegister = async (e) => {
    e.preventDefault();

    // בדיקות בסיסיות
    if (!isIdValid) {
      setError("ID must be exactly 9 digits.");
      setSuccess("");
      return;
    }

    if (password !== retypePassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, first_name, last_name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setSuccess("");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user?.role === "parent") {
        try {
          const childrenRes = await fetch(`http://localhost:3000/api/children/parent/${data.user.id}`);
          if (!childrenRes.ok) throw new Error(`Request failed: ${childrenRes.status}`);
          const childrenData = await childrenRes.json();
          const list = Array.isArray(childrenData) ? childrenData : [];
          setChildren?.(list);
          localStorage.setItem("children", JSON.stringify(list));
          localStorage.setItem("selectedChild", JSON.stringify(null));
        } catch (err) {
          console.error("Fetch children error:", err);
          setChildren?.([]);
          localStorage.setItem("children", JSON.stringify([]));
          localStorage.setItem("selectedChild", JSON.stringify(null));
        }
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("An error occurred while registering.");
      setSuccess("");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="auth-container">
        <h2 style={{ marginTop: "5%" }}>Register</h2>
        <Message type="success" text={success} />
        <Message type="error" text={error} />
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value.replace(/\D/g, "").slice(0, 9))}
            inputMode="numeric"
            required
          />

          <input
            type="text"
            placeholder="First Name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Retype Password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="parent">Parent</option>
            <option value="nurse">Nurse</option>
          </select>

          <button type="submit">Register</button>
        </form>
        <p className="switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

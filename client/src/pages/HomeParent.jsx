import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChild } from "react-icons/fa"; // אייקון חמוד
import "./Home.css";

export default function HomeParent() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const url = `http://localhost:3000/api/children/parent/${user.id}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setChildren(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your children...</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="no-children">
        <FaChild className="no-children-icon" />
        <h3>No children found</h3>
        <p>It looks like you don’t have any children registered yet.</p>
      </div>
    );
  }

  return (
    <div className="home-parent-page">
      <div className="header">
        <p className="header-icon">🍼</p>
        <h1 className="main-title"> Welcome Back!</h1>
        <p className="subtitle">Choose your child to continue:</p>
        <div className="divider"></div>
      </div>

      <div className="children-grid">
        {children.map((child) => (
          <button
            key={child.id}
            className="child-card"
            onClick={() => navigate(`/child/${child.id}`)}
          >
            <div className="child-card-header">
              <FaChild className="child-icon" />
              <h3>{child.name}</h3>
            </div>
            <p className="child-id">ID: {child.id}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

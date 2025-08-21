import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChild } from "react-icons/fa";
import "./Home.css";

export default function HomeParent({children, setChildren, setSelectedChild}) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedChildren = JSON.parse(localStorage.getItem("children")) || [];
    setChildren(storedChildren);
  }, []);

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
            onClick={() => {
              localStorage.setItem("selectedChild", JSON.stringify(child));
              setSelectedChild(child);
              navigate(`/child/${child.id}`);
            }}
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

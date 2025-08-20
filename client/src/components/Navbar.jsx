import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Baby, LogOut } from "lucide-react";
import "./Navbar.css";
import logo from "../assets/logo copy.png"; 

export default function Navbar({ user, setUser , children, selectedChild ,setChildren, setSelectedChild}) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user?.role === "parent") {
      const storedChildren = JSON.parse(localStorage.getItem("children")) || [];
      const storedSelected = JSON.parse(localStorage.getItem("selectedChild")) || null;
      setChildren(storedChildren);
      setSelectedChild(storedSelected);
    }
  }, [user]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const child = children.find((c) => String(c.id) === childId);
    setSelectedChild(child);
    localStorage.setItem("selectedChild", JSON.stringify(child));
    navigate(`/child/${childId}`);
  };

  const goHome = () => {
    if (user?.role === "nurse") {
      navigate("/nurse");
    } else if (user?.role === "parent") {
      if (selectedChild) {
        navigate(`/child/${selectedChild.id}`);
      } else {
        navigate("/parent");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("children");
    localStorage.removeItem("selectedChild");
    setUser(null);
    setChildren([]);
    setSelectedChild(null);
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
  return (
    <nav className="navbar">
      <div className="flex items-center gap-4">
        <button onClick={goHome} className="nav-btn">
          <div className="logo-nav">
            <img src={logo} alt="Logo" />
          </div>
        </button>
      </div>

      {user?.role === "parent" && (
        <div className="child-selector">
          <Baby size={24} />
      {selectedChild&& <select
            className="child-dropdown"
            value={selectedChild ? selectedChild.id : ""}
            onChange={handleChildChange}
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={logout} className="nav-btn">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </nav>
  );
}

// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Baby, Home, User, LogOut } from "lucide-react";
import "./Navbar.css";
import logo from "../assets/logo copy.png"; 


export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "parent") {
      setLoading(true);
      const url = `http://localhost:3000/api/children/parent/${user.id}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setChildren(list);
          if (list.length > 0 && !selectedChild) {
            setSelectedChild(list[0]); // ברירת מחדל הילד הראשון
          }
        })
        .catch((err) => console.error("Fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const child = children.find((c) => String(c.id) === childId);
    setSelectedChild(child);
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
    setUser(null);
    navigate("/login");
  };

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="flex items-center gap-4">
        <button onClick={goHome} className="nav-btn">
          <div className="logo-nav" >
            <img src={logo} alt="Logo" />
          </div>
        </button>
      </div>

      {user?.role === "parent" && (
        <div className="child-selector">
          <Baby size={24} />
          <select
            className="child-dropdown"
            value={selectedChild?.id || ""}
            onChange={handleChildChange}
          >
            {loading ? (
              <option>Loading...</option>
            ) : (
              children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))
            )}
          </select>
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

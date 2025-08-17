import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        // ה-controller מחזיר מערך ישיר
        setChildren(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (children.length === 0) return <p>No children found for this parent.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Children</h2>
      {children.map((child) => (
        <button
          key={child.id}
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "200px" }}
          onClick={() => navigate(`/child/${child.id}`)}
        >
          {child.name} ({child.id})
        </button>
      ))}
    </div>
  );
}

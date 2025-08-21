import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "../assets/logo.png";


export default function AddPatient() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [parentId, setParentId] = useState("");
  const [parents, setParents] = useState([]);
  const navigate = useNavigate();

  // Fetch parents list (only users with role=parent)
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/parent");
        const data = await res.json();
        if (res.ok) {
          setParents(data);
        } else {
          alert("Failed to load parents");
        }
      } catch (err) {
        console.error(err);
        alert("Error loading parents");
      }
    };
    fetchParents();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, birth_date: birthDate, parent_id: parentId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Patient added successfully");
        navigate("/nurse/:nurseId/children"); // redirect to patient list
      } else {
        alert(data.error || "Failed to add patient");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding patient");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="auth-container">
        <h2 style={{ marginTop: "5%" }}>
          Add Patient
        </h2>
        <form onSubmit={handleAddPatient}>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            required
          >
            <option value="">Select Parent</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} ({p.id})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Patient ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Patient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
          <button type="submit">Add Patient</button>
        </form>
      </div>
    </div>
  );
}

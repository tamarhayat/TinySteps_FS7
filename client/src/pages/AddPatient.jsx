import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "./Auth.css";
import logo from "../assets/logo.png";


export default function AddPatient() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [parentId, setParentId] = useState("");
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
          setError("Failed to load parents");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading parents");
      }
    };
    fetchParents();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("http://localhost:3000/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, birth_date: birthDate, parent_id: parentId }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        // Clear form
        setId("");
        setName("");
        setBirthDate("");
        setParentId("");

        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate("/nurse/:nurseId/children");
        }, 2000);
      } else {
        setError(data.error || "Failed to add patient");
      }
    } catch (err) {
      console.error(err);
      setError("Error adding patient");
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="auth-wrapper">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="auth-container">
        <h2 style={{ marginTop: "5%" }}>
          Add Patient
        </h2>

        {success && (
          <div className="message success-message">
            <CheckCircle className="message-icon" />
            <p>Patient added successfully! Redirecting...</p>
          </div>
        )}

        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

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

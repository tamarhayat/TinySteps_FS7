import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const { childId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          child_id: childId,
          type: form.type,
          date: form.date,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save appointment");
      }

      // נחזור לרשימת התורים של הילד
      navigate(`/child/${childId}/appointments`);
    } catch (err) {
      console.error(err);
      setError("Error saving appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Book New Appointment for Child {childId}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input
          type="text"
          name="type"
          placeholder="Appointment type"
          value={form.type}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Appointment"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

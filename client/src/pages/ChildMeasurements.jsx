import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Loader2, Calendar, Ruler, Weight, Activity, PlusCircle, Upload, Trash2, Edit2 } from "lucide-react";
import "./Measurements.css";

export default function ChildMeasurements() {
  const { childId } = useParams();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const location = useLocation();
  const from = location.state?.from;


  const fetchMeasurements = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/measurements/child/${childId}`);
      if (!res.ok) throw new Error("Failed to fetch measurements");
      const data = await res.json();
      setMeasurements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, [childId]);

  const handleSubmitMeasurement = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        child_id: childId,
        date: today,
        weight_kg: parseFloat(weight),
        height_cm: parseFloat(height),
      };

      const res = await fetch("http://localhost:3000/api/measurements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save measurement");

      // const newMeasurement = await res.json();
      // setMeasurements((prev) => [newMeasurement, ...prev]); // update list

      // Reset form
      setWeight("");
      setHeight("");
      setShowMeasurementForm(false);

      fetchMeasurements();
    } catch (err) {
      console.error(err);
      alert("Error saving measurement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeasurement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this measurement?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/measurements/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setMeasurements((prev) => prev.filter((m) => m.id !== id));
      alert("Measurement deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete measurement");
    }
  };

  const handleUpdateMeasurement = async (id) => {
    const newWeight = prompt("Enter new weight (kg):");
    const newHeight = prompt("Enter new height (cm):");

    if (!newWeight || !newHeight) return;

    try {
      const res = await fetch(`http://localhost:3000/api/measurements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight_kg: parseFloat(newWeight),
          height_cm: parseFloat(newHeight),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setMeasurements((prev) =>
        prev.map((m) => (m.id === id ? updated.measurement : m))
      );
      alert("Measurement updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update measurement");
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading measurements...</p>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="appointment-page">
        <div className="container">
          <div className="header">
            <h1 className="main-title">🍼 My measurement</h1>
            <div className="divider"></div>
          </div>

          <div className="no-appointments">
            <Ruler className="no-appointments-icon" />
            <h3>No measurements found</h3>
            <p>Please check again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">🍼 My measurements</h1>
          <div className="divider"></div>
        </div>
        {/* navigated from nurse */}
        {from === "nurse" && (
          <div className="add-measurement-section">
            <button
              className="btn-add"
              onClick={() => setShowMeasurementForm(!showMeasurementForm)}
            ><PlusCircle />{showMeasurementForm ? "Cancel" : "Add Measurement"}
            </button>

            {showMeasurementForm && (
              <form className="measurement-card" onSubmit={handleSubmitMeasurement}>
                <div className="measurement-header">
                  <div className="measurement-icon">
                    <PlusCircle className="icon" />
                  </div>
                  <div>
                    <h3 className="measurement-title">New Measurement</h3>
                    <p className="measurement-date">
                      <Calendar className="detail-icon" />
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="measurement-details">
                  <div className="detail-item">
                    <Weight className="detail-icon" />
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="input-text"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="detail-item">
                    <Ruler className="detail-icon" />
                    <input
                      type="number"
                      placeholder="Height (cm)"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="input-text"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-submit">
                  <button type="submit" disabled={submitting} className="btn-upload">
                    <Upload />
                    {submitting ? "Saving..." : "Save Measurement"}
                  </button>
                </div>
              </form>

            )}
          </div>

        )}

        {/* Measurements Grid */}
        <div className="measurements-grid">
          {measurements.map((m) => {
            const measurementDate = new Date(m.date);
            return (
              <div key={`measurement-${m.id}`} className="measurement-card">
                <div className="measurement-header">
                  <div className="measurement-icon">
                    <Activity className="icon" />
                  </div>
                  <div>
                    <h3 className="measurement-title">Measurement Record</h3>
                    <p className="measurement-date">
                      <Calendar className="detail-icon" />
                      {measurementDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="measurement-details">
                  <div className="detail-item">
                    <Weight className="detail-icon" />
                    <span>Weight: {parseFloat(m.weight_kg).toFixed(2)} kg</span>
                  </div>
                  <div className="detail-item">
                    <Ruler className="detail-icon" />
                    <span>Height: {parseFloat(m.height_cm).toFixed(2)} cm</span>
                  </div>
                </div>

                {/* Nurse-only actions */}
                {from === "nurse" && (
                  <div className="file-actions">
                    {/* <button
                      onClick={() => handleUpdateMeasurement(m.id)}
                    >
                      <Edit2 /> Update
                    </button> */}

                    <button
                      onClick={() => handleDeleteMeasurement(m.id)}
                    >
                      <Trash2 /> Delete
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Loader2, Calendar, User2, Ruler, Weight, Activity, PlusCircle, Upload, Trash2, Edit2, CheckCircle, AlertCircle } from "lucide-react";
import "./Measurements.css";

export default function ChildMeasurements() {
  const { childId } = useParams();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);


  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const from = location.state?.from;


  const fetchMeasurements = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/measurements/child/${childId}`);
      if (!res.ok) throw new Error("Failed to fetch measurements");
      const data = await res.json();
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMeasurements(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load measurements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchChild = async () => {
      try {
        if (from === "nurse") {
          const res = await fetch(`http://localhost:3000/api/children/${childId}`);
          if (!res.ok) throw new Error("Failed to fetch child");
          const data = await res.json();
          setSelectedChild(data);
        } else {
          const child = JSON.parse(localStorage.getItem("selectedChild"));
          setSelectedChild(child);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load child info");
      }
    };

    fetchChild();
  }, [childId, from]);

  useEffect(() => {
    fetchMeasurements();
  }, [childId]);

  const handleSubmitMeasurement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

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
      setSuccess("Measurement saved successfully!");


      fetchMeasurements();
    } catch (err) {
      console.error(err);
      setError("Error saving measurement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeasurement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this measurement?")) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:3000/api/measurements/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setMeasurements((prev) => prev.filter((m) => m.id !== id));
      setSuccess("Measurement deleted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to delete measurement. Please try again.");
    }
  };

  // const handleUpdateMeasurement = async (id) => {
  //   const newWeight = prompt("Enter new weight (kg):");
  //   const newHeight = prompt("Enter new height (cm):");

  //   if (!newWeight || !newHeight) return;

  //   setError("");
  //   setSuccess("");

  //   try {
  //     const res = await fetch(`http://localhost:3000/api/measurements/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         weight_kg: parseFloat(newWeight),
  //         height_cm: parseFloat(newHeight),
  //       }),
  //     });

  //     if (!res.ok) throw new Error("Update failed");

  //     const updated = await res.json();
  //     setMeasurements((prev) =>
  //       prev.map((m) => (m.id === id ? updated.measurement : m))
  //     );
  //     setSuccess("Measurement updated successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to update measurement. Please try again.");
  //   }
  // };

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
          {/* Success and Error Messages */}
          {success && (
            <div className="message success-message">
              <CheckCircle className="message-icon" />
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="message error-message">
              <AlertCircle className="message-icon" />
              <p>{error}</p>
            </div>
          )}

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
          <h1 className="main-title"> My measurements 🍼</h1>
          <div className="divider"></div>
        </div>

        {/* Success and Error Messages */}
        {success && (
          <div className="message success-message">
            <CheckCircle className="message-icon" />
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

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
                      className="input-measurement-text"
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
                      className="input-measurement-text"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-submit">
                  <button type="submit" disabled={submitting} className="btn-save">
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

            if (!selectedChild) return null;
            const birthDate = new Date(selectedChild.birth_date);

            // חישוב גיל בעת המדידה
            const ageDiff = measurementDate - birthDate;
            const ageDate = new Date(ageDiff);

            const years = ageDate.getUTCFullYear() - 1970;
            const months = ageDate.getUTCMonth();
            const days = ageDate.getUTCDate() - 1;

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
                    <User2 className="detail-icon" />
                    <span>
                      Age:{" "}
                      {years > 0
                        ? `${years} years ${months} months`
                        : months > 0
                          ? `${months} month ${days} days`
                          : `${days} days`}
                    </span>
                  </div>
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
                {
                  from === "nurse" && (
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
                  )
                }

              </div>
            );
          })}

        </div>
      </div>
    </div >
  );
}

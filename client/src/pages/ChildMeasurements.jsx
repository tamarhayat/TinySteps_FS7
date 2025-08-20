import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Calendar, Ruler, Weight, Activity } from "lucide-react"; 
import "./Measurements.css"; 

export default function ChildMeasurements() {
  const { childId } = useParams();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/measurements/child/${childId}`);
        if (!res.ok) throw new Error("Failed to fetch measurements");
        const data = await res.json();
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMeasurements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [childId]);

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
          <h1 className="main-title"> My measurements 🍼</h1>
          <div className="divider"></div>
        </div>

        {/* Measurements Grid */}
        <div className="measurements-grid">
          {measurements.map((m) => {
  const measurementDate = new Date(m.date);

  // שליפת הילד מה-LS
  const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));
  const birthDate = new Date(selectedChild.birth_date);

  // חישוב גיל בעת המדידה
  const ageDiff = measurementDate - birthDate;
  const ageDate = new Date(ageDiff);

  const years = ageDate.getUTCFullYear() - 1970;
  const months = ageDate.getUTCMonth();
  const days = ageDate.getUTCDate() - 1;

  return (
    <div key={m.id} className="measurement-card">
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
          <p className="measurement-age">
            Age:{" "}
            {years > 0
              ? `${years} years ${months} months`
              : months > 0
              ? `${months}m ${days}d`
              : `${days}d`}
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
    </div>
  );
})}

        </div>
      </div>
    </div>
  );
}

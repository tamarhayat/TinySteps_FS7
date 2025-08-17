import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Measurements.css"; 

export default function ChildMeasurements() {
  const { childId } = useParams();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/measurements/child/${childId}`);
        const data = await res.json();
        setMeasurements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [childId]);

  if (loading) return <p>Loading...</p>;

  if (measurements.length === 0) {
    return (
      <div className="measurements-container">
        <h2>Measurements for Child {childId}</h2>
        <p>No measurements found.</p>
      </div>
    );
  }

  return (
    <div className="measurements-container">
      <h2>Measurements for Child {childId}</h2>
      <div className="measurements-grid">
        {measurements.map((m) => {
          const measurementDate = new Date(m.date);
          return (
            <div key={m.id} className="measurement-card">
              <p><strong>Date:</strong> {measurementDate.toLocaleDateString("en-GB")}</p>
              <p><strong>Weight:</strong> {parseFloat(m.weight_kg).toFixed(2)} kg</p>
              <p><strong>Height:</strong> {parseFloat(m.height_cm).toFixed(2)} cm</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

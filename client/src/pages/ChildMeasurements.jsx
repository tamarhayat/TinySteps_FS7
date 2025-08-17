import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChildMeasurements() {
  const { childId } = useParams();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/measurements/child/${childId}`)
      .then(res => res.json())
      .then(data => {
        setMeasurements(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [childId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Measurements for Child {childId}</h2>
      {measurements.length === 0 ? (
        <p>No measurements found.</p>
      ) : (
        <ul>
          {measurements.map(m => (
            <li key={m.id}>
              {new Date(m.date).toLocaleDateString()} – {m.weight}kg, {m.height}cm
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

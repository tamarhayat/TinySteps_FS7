import { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import {Loader2,Baby,Cake,User,AlertCircle} from "lucide-react";
import { FaRuler, FaFileAlt } from "react-icons/fa";
import "./AllPatients.css";

export default function AllPatients() {
  const { nurseId } = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/children/nurse/${nurseId}`);
        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [nurseId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="container">
        <div className="header">
          <h1 className="main-title">👶 Patients</h1>
          <h2 className="subtitle">All Registered Children</h2>
          <div className="divider"></div>
        </div>

        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

        {patients.length === 0 ? (
          <div className="no-appointments">
            <User className="no-appointments-icon" />
            <h3>No patients found</h3>
            <p>There are no registered children yet</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {patients.map((p) => (
              <div key={p.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-icon">
                    <User className="icon" />
                  </div>
                  <h3>{p.name}</h3>
                </div>

                <div className="appointment-details">

                  <div className="detail-item">
                    <Baby className="detail-icon" />
                    <span>Chiled ID: {p.id || "N/A"}</span>
                  </div>

                  <div className="detail-item">
                    <Cake className="detail-icon" />
                    <span>
                      DOB:{" "}
                      {p.birth_date
                        ? new Date(p.birth_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="detail-item">
                    <User className="detail-icon" />
                    <span>Parent ID: {p.parent_id || "N/A"}</span>
                  </div>

                </div>

                {/* Buttons Section */}
                <div className="appointment-actions">
                  <Link to={`/child/${p.id}/measurements`} state={{ from: "nurse" }} className="action-button">
                    <FaRuler style={{ marginRight: "0.5rem" }} />
                    Measurements
                  </Link>
                  <Link to={`/child/${p.id}/files`} className="action-button">
                    <FaFileAlt style={{ marginRight: "0.5rem" }} />
                    Files
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

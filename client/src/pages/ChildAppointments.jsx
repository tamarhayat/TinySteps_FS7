import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Calendar, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import "./Appointments.css";

export default function ChildAppointments() {
  const { childId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/appointments/child/${childId}`);
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();

        const appointmentsWithNurse = await Promise.all(
          data.map(async (a) => {
            try {
              const resNurse = await fetch(`http://localhost:3000/api/users/nurse/${a.nurse_id}`);
              const nurse = await resNurse.json();

              return {
                ...a,
                nurse_name: `${nurse.first_name} ${nurse.last_name}`,
              };
            } catch {
              return { ...a, nurse_name: "Unknown Nurse" };
            }
          })
        );
        setAppointments(appointmentsWithNurse);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [childId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading child appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="main-title">🍼 My Appointments</h1>
          <h2 className="subtitle">ID {childId}</h2>
          <div className="divider"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

        {/* No Appointments */}
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar className="no-appointments-icon" />
            <h3>No appointments found</h3>
            <p>Please check again later</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((a) => {
              const appointmentDate = new Date(a.appointment_time);
              const isPast = appointmentDate < new Date();

              return (
                <div
                  key={a.id}
                  className={`appointment-card ${isPast ? "past" : "upcoming"}`}
                >
                  <div className="appointment-header">
                    <div className="appointment-icon">
                      {isPast ? (
                        <CheckCircle className="icon" />
                      ) : (
                        <Calendar className="icon" />
                      )}
                    </div>
                    <div className="appointment-title">
                      <h3>{isPast ? "Completed Appointment" : "Upcoming Appointment"}</h3>
                      <p className="appointment-id">Appointment #{a.id}</p>
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span>
                        {appointmentDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>
                        {appointmentDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    <div className="detail-item">
                      <User className="detail-icon" />
                      <span>{a.nurse_name}</span>
                    </div>

                    <div className="detail-item">
                      <AlertCircle className="detail-icon" />
                      <span>Status: {a.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

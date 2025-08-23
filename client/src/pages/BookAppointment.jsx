import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, User, CheckCircle, Loader2, AlertCircle, X } from "lucide-react";
import "./BookAppointments.css";

export default function BookAppointment() {
  const { childId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [nurseMap, setNurseMap] = useState({});

  const fetchAvailableAppointments = async () => {
    try {
      const resAppointments = await fetch("http://localhost:3000/api/appointments/available");
      const appointmentsData = await resAppointments.json();

      const resNurses = await fetch("http://localhost:3000/api/users?role=nurse");
      const nursesData = await resNurses.json();
      const map = Object.fromEntries(
        nursesData.map(n => [n.id, `${n.first_name} ${n.last_name}`])
      );
      setNurseMap(map);
      const now = new Date();

    const upcomingAppointments = appointmentsData.filter(
      (appointment) => new Date(appointment.appointment_time) >= now
    );

    const sortedAppointments = upcomingAppointments.sort(
      (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
    );

      setAppointments(sortedAppointments);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch available appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableAppointments();
  }, []);

  const handleSelect = (appointment) => {
    setSelected(selected?.id === appointment.id ? null : appointment);
    setError("");
    setSuccess(false);
  };

  const handleBook = async () => {
    if (!selected) return;
    setBooking(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ child_id: childId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to book appointment");
      }

      setSuccess(true);
      setSelected(null);
      fetchAvailableAppointments(); 
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', hour12: true 
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading available appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="container">
        <div className="header">
          <h1 className="main-title">🍼</h1>
          <h2 className="subtitle">Choose an available appointment</h2>
          <div className="divider"></div>
        </div>

        {success && (
          <div className="message success-message">
            <CheckCircle className="message-icon" />
            <p>Appointment booked successfully!</p>
          </div>
        )}

        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar className="no-appointments-icon" />
            <h3>No available appointments</h3>
            <p>Please try again later or contact the clinic</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((appointment) => (
              <button
                key={appointment.id}
                className={`appointment-card ${selected?.id === appointment.id ? 'selected' : ''}`}
                onClick={() => handleSelect(appointment)}
              >
                <div className="appointment-header">
                  <div className={`appointment-icon ${selected?.id === appointment.id ? 'selected' : ''}`}>
                    <Calendar className="icon" />
                  </div>
                  <div className="appointment-title">
                    <h3 className="appointment-id">Appointment #{appointment.id}</h3>
                  </div>
                </div>
                <div className="appointment-details">
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <span>{formatDate(appointment.appointment_time)}</span>
                  </div>
                  <div className="detail-item">
                    <Clock className="detail-icon" />
                    <span>{formatTime(appointment.appointment_time)}</span>
                  </div>
                  <div className="detail-item">
                    <User className="detail-icon" />
                    <span>{nurseMap[appointment.nurse_id] || "Not assigned"}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Modal for Booking */}
        {selected && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setSelected(null)}>
                <X />
              </button>
              <h3 className="modal-title">
                <CheckCircle className="booking-title-icon" /> Selected Appointment
              </h3>
              <div className="modal-details">
                <p><strong>Date:</strong> {formatDate(selected.appointment_time)}</p>
                <p><strong>Time:</strong> {formatTime(selected.appointment_time)}</p>
                <p><strong>Provider:</strong> {nurseMap[selected.nurse_id] || "Not assigned"}</p>
                <p><strong>Child:</strong> ID #{childId}</p>
              </div>
              <div className="modal-actions">
                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="book-button"
                >
                  {booking ? <> <Loader2 className="button-spinner" /> Booking... </> : <> <CheckCircle className="button-icon" /> Book Now </>}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Calendar, User, Clock, CheckCircle, AlertCircle, Trash2, PlusCircle, X} from "lucide-react";
import "./Appointments.css";

export default function NurseAppointments() {
  const { nurseId } = useParams();
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [childIdInput, setChildIdInput] = useState("");
  const [booking, setBooking] = useState(false);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/appointments/nurse/${nurseId}`
      );
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
        const now = new Date();

        const upcomingAppointments = data.filter(
        (appointment) => new Date(appointment.appointment_time) >= now
        );
        // Sort appointments by appointment_time (ascending)
        const sortedAppointments = upcomingAppointments.sort(
          (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
        );

      setAppointments(sortedAppointments);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [nurseId]);

  const handleDeleteAppointment = async (id, appointmentDate) => {
    if (appointmentDate < new Date()) {
      setError("Cannot delete past appointments.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setSuccess("Appointment deleted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to delete appointment. Please try again.");
    }
  };

  const handleBookAppointment = async () => {
    if (!childIdInput) {
      setError("Please enter a child ID.");
      return;
    }
    
    setBooking(true);
    try {


      const res = await fetch(
        `http://localhost:3000/api/appointments/${selectedAppointment.id}/book`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ child_id: childIdInput }),
        }
      );

      if (!res.ok) throw new Error("Failed to book appointment");

      const updated = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );

      setSuccess("Appointment booked successfully!");
      setSelectedAppointment(null);
      setChildIdInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to book appointment. Please try again.");
      setSelectedAppointment(null);
      setChildIdInput("");
    } finally {
      setBooking(false);
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="container">
        <div className="header">
          <h1 className="main-title">🩺 Nurse Appointments</h1>
          <h2 className="subtitle">Nurse ID: {nurseId}</h2>
          <div className="divider"></div>
        </div>

        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="message success-message">
            <CheckCircle className="message-icon" />
            <p>{success}</p>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar className="no-appointments-icon" />
            <h3>No appointments found</h3>
            <p>You have no scheduled appointments currently</p>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((a) => {
              const appointmentDate = new Date(a.appointment_time);
              const isPast = appointmentDate < new Date();

              return (
                <div
                  key={a.id}
                  className={`appointments-card ${isPast ? "past" : "upcoming"}`}
                >
                  <div className="appointment-header">
                    <div className="appointment-icon">
                      {a.status === "booked" ? (
                        <CheckCircle className="icon" />
                      ) : (
                        <Calendar className="icon" />
                      )}
                    </div>
                    <div className="appointment-title">
                      <h3>{a.status === "booked" ? "Booked" : "Available"}</h3>
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
                      <span>Child ID: {a.child_id || ""}</span>
                    </div>

                    <div className="detail-item">
                      <AlertCircle className="detail-icon" />
                      <span>Status: {a.status}</span>
                    </div>
                  </div>

                  {/* Actions for future appointments */}
                  {!isPast && (
                    <div className="appointments-actions">
                      {a.status === "available" && (
                        <button
                          onClick={() => setSelectedAppointment(a)}
                        >
                          <PlusCircle /> Book
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAppointment(a.id, appointmentDate)}
                      >
                        <Trash2 /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Modal */}
      {
        selectedAppointment && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setSelectedAppointment(null)}
              >
                <X />
              </button>
              <h3 className="modal-title">
                <CheckCircle className="booking-title-icon" /> Book Appointment
              </h3>
              <div className="modal-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedAppointment.appointment_time).toDateString()}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(
                    selectedAppointment.appointment_time
                  ).toLocaleTimeString()}
                </p>
              </div>
              <input
                type="text"
                placeholder="Enter Child ID"
                value={childIdInput}
                onChange={(e) => setChildIdInput(e.target.value)}
                className="input-text"
              />
              <div className="modal-actions">
                <button
                  onClick={handleBookAppointment}
                  disabled={booking}
                  className="book-button"
                >
                  {booking ? (
                    <>
                      <Loader2 className="button-spinner" /> Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="button-icon" /> Book Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
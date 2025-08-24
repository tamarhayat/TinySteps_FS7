import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "./CreateAppointment.css";

export default function CreateAppointment() {
  const { nurseId } = useParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

  const handleCreate = async () => {
    setError("");
    setSuccess(false);

    if (!date || !time) {
      setError("Please select both date and time");
      return;
    }

    const appointmentDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();

    if (appointmentDateTime < now) {
      setError("You cannot select a past date or time");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/nurse/${nurseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nurse_id: nurseId,
          appointment_time: appointmentDateTime.toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create appointment");
      }

      setSuccess(true);
      setDate("");
      setTime("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-page">
      <div className="container">
        <div className="header">
          <h1 className="main-title">📅 Create Appointment</h1>
          <h2 className="subtitle">Nurse ID: {nurseId}</h2>
          <div className="divider"></div>
        </div>

        {success && (
          <div className="message success-message">
            <CheckCircle className="message-icon" />
            <p>Appointment created successfully!</p>
          </div>
        )}

        {error && (
          <div className="message error-message">
            <AlertCircle className="message-icon" />
            <p>{error}</p>
          </div>
        )}

        <div className="form-container">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="date">
                <Calendar className="detail-icon" /> Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                min={new Date().toISOString().split("T")[0]} // מונע בחירה בתאריך עבר
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="time">
                <Clock className="detail-icon" /> Time
              </label>
              <div className="time-input-wrapper">
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              onClick={handleCreate}
              className="book-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="button-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="button-icon" />
                  Create Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import "./CreateAppointment.css";

export default function CreateAppointment() {
  const { nurseId } = useParams(); // or pull from logged-in user
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");


  const handleCreate = async () => {
    setError("");
    setSuccess(false);

    if (!date || !time) {
      setError("Please select both date and time");
      return;
    }

    const appointmentDateTime = `${date} ${time}:00`;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/appointments/nurse/${nurseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nurse_id: nurseId,
          appointment_time: appointmentDateTime,
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
              <label htmlFor="date"><Calendar className="detail-icon" /> Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="time">
                <Clock className="detail-icon" />Time
              </label>
              <div className="select-wrapper">
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="" disabled>
                    HH:MM
                  </option>
                  {Array.from({ length: (20 - 8) * 4 + 1 }, (_, i) => {
                    const h = 8 + Math.floor(i / 4);       // hour from 8 to 20
                    const m = (i % 4) * 15;               // 0, 15, 30, 45
                    const hourStr = h.toString().padStart(2, "0");
                    const minStr = m.toString().padStart(2, "0");
                    return (
                      <option key={i} value={`${hourStr}:${minStr}`}>
                        {hourStr}:{minStr}
                      </option>
                    );
                  })}
                </select>
                <Clock className="select-icon" />
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
    </div>
  );
}

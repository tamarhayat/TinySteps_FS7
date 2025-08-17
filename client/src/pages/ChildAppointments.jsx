import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Appointments.css";

export default function ChildAppointments() {
  const { childId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/appointments/child/${childId}`);
        const data = await res.json();

        const appointmentsWithNurse = await Promise.all(
          data.map(async (a) => {
            try {
              const resNurse = await fetch(`http://localhost:3000/api/users/${Number(a.nurse_id)}`);
              const nurse = await resNurse.json();
              console.log(nurse);
              return {
                ...a,
                nurse_name:`Norse: ${nurse.first_name} ${nurse.last_name}` 
              };
            } catch (err) {
              console.error(err);
              return {
                ...a,
                nurse_name: "Unknown Nurse"
              };
            }
          })
        );

        setAppointments(appointmentsWithNurse);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [childId]);

  if (loading) return <p>Loading...</p>;

  if (appointments.length === 0) {
    return (
      <div className="appointments-container">
        <h2>Appointments for Child {childId}</h2>
        <p>No appointments found.</p>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="appointments-container">
      <h2>Appointments for Child {childId}</h2>
      <div className="appointments-grid">
        {appointments.map((a) => {
          const appointmentDate = new Date(a.appointment_time);
          const isPast = appointmentDate < now;

          return (
            <div
              key={a.id}
              className={`appointment-card ${isPast ? "past" : "upcoming"}`}
            >
              <h3>{a.nurse_name}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {appointmentDate.toLocaleString("en-GB", { hour12: false })}
              </p>
              <p>
                <strong>Status:</strong> {a.status}
              </p>
              {isPast && <span className="status past-status">✅ </span>}
              {!isPast && <span className="status upcoming-status">📅 </span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

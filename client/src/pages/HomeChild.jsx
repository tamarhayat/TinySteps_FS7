// pages/HomeChild.jsx
import { useParams, Link } from "react-router-dom";

export default function HomeChild() {
  const { childId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Child Dashboard</h2>
      <p>Child ID: {childId}</p>

      <ul>
        <li><Link to={`/child/${childId}/files`}>Uploaded Files</Link></li>
        <li><Link to={`/child/${childId}/appointments`}>Upcoming Appointments</Link></li>
        <li><Link to={`/child/${childId}/new-appointment`}>Book New Appointment</Link></li>
        <li><Link to={`/child/${childId}/measurements`}>Measurements</Link></li>
      </ul>
    </div>
  );
}

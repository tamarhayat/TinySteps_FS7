import { useParams, Link } from "react-router-dom";
import { FaFileAlt, FaCalendarAlt, FaPlusCircle, FaRuler } from "react-icons/fa";
import "./home.css";

export default function HomeChild() {
  const { childId } = useParams();
  

  return (
    <div className="home-child-page">
      <div className="header">
        <h2 className="main-title">My Dashboard 👶</h2>
        <p className="subtitle">Child ID: {childId}</p>
        <div className="divider"></div>
      </div>

      <div className="links">
        <Link to={`/child/${childId}/files`} className="link-card">
          <FaFileAlt className="link-icon" />
          <span>Uploaded Files</span>
        </Link>
        <Link to={`/child/${childId}/appointments`} className="link-card">
          <FaCalendarAlt className="link-icon" />
          <span>Upcoming Appointments</span>
        </Link>
        <Link to={`/child/${childId}/appointments/new`} className="link-card">
          <FaPlusCircle className="link-icon" />
          <span>Book New Appointment</span>
        </Link>
        <Link to={`/child/${childId}/measurements`} className="link-card">
          <FaRuler className="link-icon" />
          <span>Measurements</span>
        </Link>
      </div>
    </div>
  );
}

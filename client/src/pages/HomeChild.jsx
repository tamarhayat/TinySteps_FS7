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

      <div className="child-links">
        <Link to={`/child/${childId}/files`} className="child-link-card">
          <FaFileAlt className="child-link-icon" />
          <span>Uploaded Files</span>
        </Link>
        <Link to={`/child/${childId}/appointments`} className="child-link-card">
          <FaCalendarAlt className="child-link-icon" />
          <span>Upcoming Appointments</span>
        </Link>
        <Link to={`/child/${childId}/appointments/new`} className="child-link-card">
          <FaPlusCircle className="child-link-icon" />
          <span>Book New Appointment</span>
        </Link>
        <Link to={`/child/${childId}/measurements`} className="child-link-card">
          <FaRuler className="child-link-icon" />
          <span>Measurements</span>
        </Link>
      </div>
    </div>
  );
}

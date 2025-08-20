import { useParams, Link } from "react-router-dom";
import { FaFileAlt, FaCalendarAlt, FaPlusCircle, FaRuler } from "react-icons/fa";
import "./home.css";

export default function HomeChild() {
  const { childId } = useParams();

  // שליפת הילד הנבחר מ-LS
  const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));

  if (!selectedChild || selectedChild.id !== childId) {
    return (
      <div className="home-child-page">
        <h2 className="main-title">No child selected ❌</h2>
        <p className="subtitle">Please go back and select a child.</p>
      </div>
    );
  }

  // פונקציה לעיצוב תאריך לידה יפה
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="home-child-page">
      <div className="header">
        <h2 className="main-title">Welcome, {selectedChild.name} 👶</h2>
        <p className="subtitle">ID: {selectedChild.id}</p>
        <p>Birth Date: {new Date(selectedChild.birth_date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        })}</p>
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

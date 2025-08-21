import { Link } from "react-router-dom";
import { FaCalendarAlt, FaPlusCircle, FaChild, FaUserPlus} from "react-icons/fa";
import "./home.css";

export default function HomeNurse() {
  
    const user = JSON.parse(localStorage.getItem("user"));
    const nurseId = user?.id;
    const nurseName = user?.first_name;

   return (
    <div className="home-Nurse-page">
      <div className="header">
        <h2 className="main-title">{nurseName}'s Dashboard 🩺</h2>
        <div className="divider"></div>
      </div>

      <div className="links">
        <Link to={`/nurse/${nurseId}/appointments`} className="link-card">
          <FaCalendarAlt className="link-icon" />
          <span>Upcoming Appointments</span>
        </Link>
        <Link to={`/nurse/${nurseId}/appointments/new`} className="link-card">
          <FaPlusCircle className="link-icon" />
          <span>Create New Appointment</span>
        </Link>
        <Link to={`/nurse/${nurseId}/children`} className="link-card">
          <FaChild className="link-icon" />
          <span>Patients</span>
        </Link>
        <Link to={`/nurse/${nurseId}/child/new`} className="link-card">
          <FaUserPlus className="link-icon" />
          <span>Add Patient</span>
        </Link>

      </div>
    </div>
  );
}

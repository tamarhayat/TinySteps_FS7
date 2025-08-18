import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeNurse from "./pages/HomeNurse";
import HomeParent from "./pages/HomeParent";
import HomeChild from "./pages/HomeChild";
import ChildFiles from "./pages/ChildFiles";
import ChildAppointments from "./pages/ChildAppointments";
import ChildMeasurements from "./pages/ChildMeasurements";
import BookAppointment from "./pages/BookAppointment";
import Navbar from "./components/Navbar";
import "./App.css"; // Assuming you have a global CSS file for styles

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  useEffect(() => {
    if (!user) {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login");
      }
    }
  }, [navigate, user, location]);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={
          user ? (
            user.role === "nurse" ? <HomeNurse /> : <HomeParent />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/login" element={
          user ? (
            user.role === "nurse" ? <Navigate to="/nurse" /> : <Navigate to="/parent" />
          ) : (
            <Login setUser={setUser} />
          )
        } />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/nurse" element={<HomeNurse />} />
        <Route path="/parent" element={<HomeParent />} />
        <Route path="/child/:childId" element={<HomeChild />} />
        <Route path="/child/:childId/files" element={<ChildFiles />} />
        <Route path="/child/:childId/appointments" element={<ChildAppointments />} />
        <Route path="/child/:childId/measurements" element={<ChildMeasurements />} />
        <Route path="/child/:childId/appointments/new" element={<BookAppointment />} />
      </Routes>
    </>
  );
}
export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
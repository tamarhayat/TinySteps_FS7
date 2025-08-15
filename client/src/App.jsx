import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeNurse from "./pages/HomeNurse";
import HomeParent from "./pages/HomeParent";

function AppRoutes() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
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
        ) : <Login /> 
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/nurse" element={<HomeNurse />} />
      <Route path="/parent" element={<HomeParent />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

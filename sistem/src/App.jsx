import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./component/LandingPage.jsx";
import Login from "./component/Login.jsx";
import SignUpPage from "./component/SignUpPage.jsx";
import Home from "./component/Home.jsx";
import Admin from "./component/Admin.jsx";
import AdminLogin from "./component/AdminLogin.jsx";
import Bonus from "./component/Bonus.jsx";
import Rangkaian from "./component/Rangkaian.jsx";
import Contact from "./component/Contact.jsx";
import Total from "./component/Total.jsx";
import Jana from "./component/Jana.jsx";
import Inquiry from "./component/inquiry.jsx";
import ProtectedRoute from "./config/ProtectedRoute.jsx";
import PrivateAdminRoute from "./config/PrivateAdminRoute.jsx";

function App() {
  return (
    <Router>
     <Routes>
     <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUpPage />} /> 
        <Route path="/loginadmin" element={<AdminLogin />} />

        <Route element={<PrivateAdminRoute />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/total" element={<Total />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/pin" element={<Jana />} />
        </Route>

        {/* 🔒 Protected routes (Only logged-in users can access) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/bonus" element={<Bonus />} />
          <Route path="/rangkaian" element={<Rangkaian />} />
          <Route path="/contact" element={<Contact />} />
          
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

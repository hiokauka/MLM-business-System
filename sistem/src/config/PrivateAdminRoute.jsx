import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const PrivateAdminRoute = () => {
  const adminSession = JSON.parse(localStorage.getItem("adminSession"));
  const location = useLocation();

  useEffect(() => {
    if (!adminSession) {
      window.location.href = "/login"; // Hard redirect to prevent going back
    } else if (adminSession.role !== "admin") {
      window.location.href = "/home"; // Redirect logged-in non-admin users to home
    }
  }, [location]); // Runs when location changes

  return adminSession && adminSession.role === "admin" ? <Outlet /> : null;
};

export default PrivateAdminRoute;

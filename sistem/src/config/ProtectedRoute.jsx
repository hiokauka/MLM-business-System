import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userSession = localStorage.getItem("userSession");

  if (!userSession) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

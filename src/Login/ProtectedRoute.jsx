import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const department = localStorage.getItem("department");

  if (!token || !role) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // If Department Admin → department must exist
  if (role.toUpperCase() === "DEPARTMENT_ADMIN" && !department) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

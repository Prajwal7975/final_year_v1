import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const department = localStorage.getItem("department");

  if (!token || !role) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const exp = decoded?.exp;

    if (!exp) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (role.toUpperCase() === "DEPARTMENT_ADMIN" && !department) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

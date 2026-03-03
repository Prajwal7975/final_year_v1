import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login/login";
import Register from "./Login/Register";
import ProtectedRoute from "./Login/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ REQUIRED
import SuperAdminDashboard from "./pages/SuperAdmin_Dashboard"; // ✅ ADD THIS
import RegisterAdmin from "./Login/Register"; // ✅ ADD THIS
import ManageDepartments from "./superAdmin_components/ManageDepartments"; // ✅ ADD THIS

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Register Admin Page */}
        <Route
          path="/super-admin/register-admin"
          element={
            <ProtectedRoute>
              <RegisterAdmin />
            </ProtectedRoute>
          }
        />

        {/* Dynamic admin dashboard */}
        <Route
          path="/admin/:department"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/super-admin/manage-departments" element={<ManageDepartments />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

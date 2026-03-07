import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import IncidentsFilterView from "./pages/IncidentsFilterView";

import Login from "./Login/login";
import ProtectedRoute from "./Login/ProtectedRoute";
import Register from "./Login/Register";

import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdmin_Dashboard";

import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement";
import SystemReports from "./pages/SystemReports";

import RegisterAdmin from "./Login/Register";
import ManageDepartments from "./superAdmin_components/ManageDepartments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Incidents Filter - Super Admin */}
        <Route
        path="/super-admin/incidents"
  element={
    <ProtectedRoute>
      <IncidentsFilterView />
    </ProtectedRoute>
  }
  />
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Super Admin Dashboard */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Register Department Admin */}
        <Route
          path="/super-admin/register-admin"
          element={
            <ProtectedRoute>
              <RegisterAdmin />
            </ProtectedRoute>
          }
        />

        {/* Manage Departments */}
        <Route
          path="/super-admin/manage-departments"
          element={
            <ProtectedRoute>
              <ManageDepartments />
            </ProtectedRoute>
          }
        />
        {/* Incidents Filter */}
        <Route
        path="/super-admin/incidents"
        element={
        <ProtectedRoute>
          <IncidentsFilterView />
          </ProtectedRoute>
        }
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* User Management */}
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* System Reports */}
        <Route
          path="/system-reports"
          element={
            <ProtectedRoute>
              <SystemReports />
            </ProtectedRoute>
          }
        />

        {/* Department Admin Dashboard */}
        <Route
          path="/admin/:department"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
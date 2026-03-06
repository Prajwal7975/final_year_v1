import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="super-admin-container">
        <h2 className="dashboard-title">Super Admin Dashboard</h2>

        <div className="dashboard-grid">
          <div
            className="dashboard-card"
            onClick={() => navigate("/super-admin/register-admin")}
          >
            <h3>Register Department Admin</h3>
            <p>Create and manage department administrators</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/super-admin/manage-departments")}
          >
            <h3>Manage Departments</h3>
            <p>Add, update or remove departments</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/analytics")}
            style={{ cursor: "pointer" }}
          >
            <h3>View Analytics</h3>
            <p>See complaints statistics and reports</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/user-management")}
            style={{ cursor: "pointer" }}
          >
            <h3>Manage Users</h3>
            <p>View and manage citizen accounts</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/system-reports")}
            style={{ cursor: "pointer" }}
          >
            <h3>System Reports</h3>
            <p>Department performance and statistics</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;
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

          <div className="dashboard-card"
            onClick={() => navigate("/super-admin/manage-departments")}
          >
            <h3>Manage Departments</h3>
            <p>Add, update or remove departments</p>
          </div>

          <div className="dashboard-card">
            <h3>View Analytics</h3>
            <p>See complaints statistics and reports</p>
          </div>

          <div className="dashboard-card">
            <h3>Manage Wards</h3>
            <p>Configure ward-level management</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
      "https://76pd12y747.execute-api.ap-south-1.amazonaws.com/admin/analytics",
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <div className="sr-topbar">
        <button
          className="sr-back-btn"
          onClick={() => navigate("/super-admin")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="analytics-container">
        <h1>Complaint Analytics Dashboard</h1>

        {/* Statistics Section */}

        <div className="statistics-section">
          <h2>Overview</h2>

          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-number">{data.overview.total}</div>
                <div className="stat-label">Total Complaints</div>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{data.overview.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>

            <div className="stat-card progress">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-number">{data.overview.in_progress}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>

            <div className="stat-card resolved">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{data.overview.resolved}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Table */}

        <div className="table-section">
          <h2>Complaints per Department</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total</th>
                  <th>Pending</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                </tr>
              </thead>

              <tbody>
                {data.departments.map((dep, index) => {
                  return (
                    <tr key={index}>
                      <td className="dept-name">{dep.department}</td>

                      <td className="total-no">{dep.total}</td>

                      <td className="pending-cell">{dep.pending}</td>

                      <td className="progress-cell">{dep.in_progress}</td>

                      <td className="resolved-cell">{dep.resolved}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
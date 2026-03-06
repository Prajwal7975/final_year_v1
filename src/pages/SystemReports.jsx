import React from 'react';
import './SystemReports.css';
import { useNavigate } from 'react-router-dom';

function SystemReports() {
  const navigate = useNavigate();

  const departmentData = [
    { department: 'Water Supply', total: 45, resolved: 38, pending: 7, avgTime: '2.3 days' },
    { department: 'Electricity', total: 62, resolved: 55, pending: 7, avgTime: '1.8 days' },
    { department: 'Roads', total: 38, resolved: 28, pending: 10, avgTime: '4.1 days' },
    { department: 'Sanitation', total: 51, resolved: 44, pending: 7, avgTime: '2.7 days' },
    { department: 'Health', total: 29, resolved: 27, pending: 2, avgTime: '1.2 days' },
  ];

  const topAreas = [
    { area: 'Ward 5 - Mangalore North', complaints: 34 },
    { area: 'Ward 12 - City Centre', complaints: 28 },
    { area: 'Ward 3 - Kadri', complaints: 22 },
    { area: 'Ward 8 - Bejai', complaints: 19 },
    { area: 'Ward 15 - Bondel', complaints: 15 },
  ];

  const monthlyData = [
    { month: 'October', filed: 42, resolved: 38 },
    { month: 'November', filed: 55, resolved: 48 },
    { month: 'December', filed: 61, resolved: 54 },
    { month: 'January', filed: 48, resolved: 45 },
    { month: 'February', filed: 70, resolved: 60 },
    { month: 'March', filed: 49, resolved: 42 },
  ];

  const maxComplaints = Math.max(...topAreas.map(a => a.complaints));
  const maxMonthly = Math.max(...monthlyData.map(m => m.filed));

  return (
    <div className="sr-container">
      <div className="sr-topbar">
        <button className="sr-back-btn" onClick={() => navigate('/super-admin')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="sr-header">
        <h1 className="sr-title">System Reports</h1>
        <p className="sr-subtitle">Overview of complaint statistics and department performance</p>
      </div>

      {/* Summary Cards */}
      <div className="sr-summary">
        <div className="sr-card sr-card-blue">
          <div className="sr-card-number">225</div>
          <div className="sr-card-label">Total Complaints</div>
        </div>
        <div className="sr-card sr-card-green">
          <div className="sr-card-number">192</div>
          <div className="sr-card-label">Resolved</div>
        </div>
        <div className="sr-card sr-card-orange">
          <div className="sr-card-number">33</div>
          <div className="sr-card-label">Pending</div>
        </div>
        <div className="sr-card sr-card-purple">
          <div className="sr-card-number">85%</div>
          <div className="sr-card-label">Resolution Rate</div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="sr-section">
        <h2 className="sr-section-title">📊 Department Performance</h2>
        <div className="sr-table-container">
          <table className="sr-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total</th>
                <th>Resolved</th>
                <th>Pending</th>
                <th>Avg Resolution Time</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, i) => {
                const rate = Math.round((dept.resolved / dept.total) * 100);
                return (
                  <tr key={i}>
                    <td className="sr-dept-name">{dept.department}</td>
                    <td>{dept.total}</td>
                    <td className="sr-resolved">{dept.resolved}</td>
                    <td className="sr-pending">{dept.pending}</td>
                    <td>{dept.avgTime}</td>
                    <td>
                      <div className="sr-progress-bar">
                        <div className="sr-progress-fill" style={{ width: `${rate}%` }}></div>
                      </div>
                      <span className="sr-rate">{rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Reported Areas */}
      <div className="sr-section">
        <h2 className="sr-section-title">📍 Most Reported Areas</h2>
        <div className="sr-areas">
          {topAreas.map((area, i) => (
            <div key={i} className="sr-area-row">
              <div className="sr-area-rank">#{i + 1}</div>
              <div className="sr-area-info">
                <div className="sr-area-name">{area.area}</div>
                <div className="sr-area-bar">
                  <div className="sr-area-fill" style={{ width: `${(area.complaints / maxComplaints) * 100}%` }}></div>
                </div>
              </div>
              <div className="sr-area-count">{area.complaints}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Statistics */}
      <div className="sr-section">
        <h2 className="sr-section-title">📅 Monthly Statistics</h2>
        <div className="sr-monthly-wrap">
          <div className="sr-monthly">
            {monthlyData.map((m, i) => (
              <div key={i} className="sr-month-col">
                <div className="sr-bars">
                  <div className="sr-bar-wrap">
                    <div className="sr-bar sr-bar-filed" style={{ height: `${(m.filed / maxMonthly) * 120}px` }}></div>
                  </div>
                  <div className="sr-bar-wrap">
                    <div className="sr-bar sr-bar-resolved" style={{ height: `${(m.resolved / maxMonthly) * 120}px` }}></div>
                  </div>
                </div>
                <div className="sr-month-label">{m.month.slice(0, 3)}</div>
                <div className="sr-month-nums">{m.filed} / {m.resolved}</div>
              </div>
            ))}
          </div>
          <div className="sr-legend">
            <span className="sr-legend-filed">■ Filed</span>
            <span className="sr-legend-resolved">■ Resolved</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SystemReports;

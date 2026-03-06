import React, { useState } from 'react';  // ✅ ADD useState
import './Analytics.css';
import ReassignModal from '../components/ReassignModal';  // ✅ ADD this import

function Analytics() {
  // Dummy data - later replace with real data from backend
  const stats = {
    totalComplaints: 245,
    pendingComplaints: 87,
    inProgressComplaints: 45,
    resolvedComplaints: 158
  };

  const departmentData = [
    { id: 1, department: 'Water Department', total: 85, pending: 32, inProgress: 15, resolved: 53 },
    { id: 2, department: 'Drainage Department', total: 62, pending: 21, inProgress: 10, resolved: 41 },
    { id: 3, department: 'Electricity Department', total: 48, pending: 18, inProgress: 8, resolved: 30 },
    { id: 4, department: 'Road Maintenance', total: 35, pending: 12, inProgress: 7, resolved: 23 },
    { id: 5, department: 'Sanitation', total: 15, pending: 4, inProgress: 5, resolved: 11 }
  ];

  const areaData = [
    { id: 1, area: 'Ward 1 - Downtown', complaints: 45 },
    { id: 2, area: 'Ward 2 - East Side', complaints: 38 },
    { id: 3, area: 'Ward 3 - West Side', complaints: 52 },
    { id: 4, area: 'Ward 4 - North Zone', complaints: 41 },
    { id: 5, area: 'Ward 5 - South Zone', complaints: 34 }
  ];

  // ✅ ADD THESE STATE VARIABLES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ✅ ADD THESE FUNCTIONS
  const handleReassignClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <div className="analytics-container">
      <h1>Complaint Analytics Dashboard</h1>

      {/* Statistics Cards */}
      <section className="statistics-section">
        <h2>Overview</h2>
        <div className="stats-grid">
          
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalComplaints}</div>
              <div className="stat-label">Total Complaints</div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pendingComplaints}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-number">{stats.inProgressComplaints}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.resolvedComplaints}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>

        </div>
      </section>

      {/* Complaints per Department */}
      <section className="table-section">
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
                <th>Completion %</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map(dept => {
                const completionRate = ((dept.resolved / dept.total) * 100).toFixed(1);
                return (
                  <tr key={dept.id}>
                    <td className="dept-name">{dept.department}</td>
                    <td>{dept.total}</td>
                    <td className="pending-cell">{dept.pending}</td>
                    <td className="progress-cell">{dept.inProgress}</td>
                    <td className="resolved-cell">{dept.resolved}</td>
                    <td>
                      <div className="completion-bar">
                        <div 
                          className="completion-fill" 
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <span className="completion-text">{completionRate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Complaints per Area */}
      <section className="table-section">
        <h2>Complaints per Area</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Area/Ward</th>
                <th>Total Complaints</th>
              </tr>
            </thead>
            <tbody>
              {areaData.map(area => (
                <tr key={area.id}>
                  <td className="area-name">{area.area}</td>
                  <td>{area.complaints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Complaints with Reassign Option */}
      <section className="table-section">
        <h2>Recent Complaints</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Description</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CMP001</td>
                <td>John Doe</td>
                <td>Water leakage in main pipe</td>
                <td>Water Department</td>
                <td><span className="pending-cell">Pending</span></td>
                <td>
                  <button className="reassign-btn-small" onClick={() => handleReassignClick({
                    id: 'CMP001',
                    user: 'John Doe',
                    description: 'Water leakage in main pipe',
                    department: 'Water Department'
                  })}>
                    Reassign
                  </button>
                </td>
              </tr>
              <tr>
                <td>CMP002</td>
                <td>Jane Smith</td>
                <td>Blocked drainage near market</td>
                <td>Water Department</td>
                <td><span className="progress-cell">In Progress</span></td>
                <td>
                  <button className="reassign-btn-small" onClick={() => handleReassignClick({
                    id: 'CMP002',
                    user: 'Jane Smith',
                    description: 'Blocked drainage near market',
                    department: 'Water Department'
                  })}>
                    Reassign
                  </button>
                </td>
              </tr>
              <tr>
                <td>CMP003</td>
                <td>Bob Wilson</td>
                <td>Street light not working</td>
                <td>Electricity Department</td>
                <td><span className="pending-cell">Pending</span></td>
                <td>
                  <button className="reassign-btn-small" onClick={() => handleReassignClick({
                    id: 'CMP003',
                    user: 'Bob Wilson',
                    description: 'Street light not working',
                    department: 'Electricity Department'
                  })}>
                    Reassign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ✅ ADD THIS - Reassign Modal */}
      <ReassignModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        complaint={selectedComplaint}
      />
    </div>
  );
}

export default Analytics;
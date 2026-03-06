import React, { useState } from 'react';
import './UserManagement.css';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@email.com', phone: '9876543210', complaints: 5, blocked: false },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', phone: '9876543211', complaints: 2, blocked: false },
    { id: 3, name: 'Bob Wilson', email: 'bob@email.com', phone: '9876543212', complaints: 8, blocked: false },
    { id: 4, name: 'Alice Brown', email: 'alice@email.com', phone: '9876543213', complaints: 3, blocked: false },
    { id: 5, name: 'Charlie Davis', email: 'charlie@email.com', phone: '9876543214', complaints: 15, blocked: false }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleBlockUser = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, blocked: !user.blocked } : user
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="um-container">
      <div className="um-topbar">
        <button className="um-back-btn" onClick={() => navigate('/super-admin')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="um-header">
        <h1 className="um-title">User Management</h1>
        <p className="um-subtitle">Manage citizen accounts and access</p>
      </div>

      <div className="um-stats">
        <div className="um-stat-card um-stat-total">
          <div className="um-stat-number">{users.length}</div>
          <div className="um-stat-label">Total Users</div>
        </div>
        <div className="um-stat-card um-stat-active">
          <div className="um-stat-number">{users.filter(u => !u.blocked).length}</div>
          <div className="um-stat-label">Active Users</div>
        </div>
        <div className="um-stat-card um-stat-blocked">
          <div className="um-stat-number">{users.filter(u => u.blocked).length}</div>
          <div className="um-stat-label">Blocked Users</div>
        </div>
      </div>

      <div className="um-search-section">
        <div className="um-search-wrapper">
          <span className="um-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="um-search-input"
          />
          {searchTerm && (
            <button className="um-search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
      </div>

      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Complaints</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className={user.blocked ? 'um-row-blocked' : ''}>
                  <td className="um-id">#{user.id}</td>
                  <td className="um-name">{user.name}</td>
                  <td className="um-email">{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`um-complaints ${user.complaints >= 10 ? 'um-complaints-high' : ''}`}>
                      {user.complaints}
                    </span>
                  </td>
                  <td>
                    <span className={`um-badge ${user.blocked ? 'um-badge-blocked' : 'um-badge-active'}`}>
                      {user.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="um-actions">
                    <button
                      className={user.blocked ? 'um-btn um-btn-unblock' : 'um-btn um-btn-block'}
                      onClick={() => toggleBlockUser(user.id)}
                    >
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button className="um-btn um-btn-view">View Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="um-no-results">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;

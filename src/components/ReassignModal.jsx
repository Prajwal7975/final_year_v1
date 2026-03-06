import React, { useState } from 'react';
import './ReassignModal.css';

function ReassignModal({ isOpen, onClose, complaint }) {
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // List of all departments
  const departments = [
    'Water Department',
    'Drainage Department',
    'Electricity Department',
    'Road Maintenance',
    'Sanitation',
    
  ];

  const handleReassign = () => {
    if (!selectedDepartment) {
      alert('Please select a department');
      return;
    }

    // For now, just show alert (later will update database)
    alert(`Complaint #${complaint?.id} reassigned to ${selectedDepartment}`);
    
    // Close the modal
    onClose();
  };

  // Don't show modal if isOpen is false
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <h2>Reassign Complaint</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="complaint-info">
            <p><strong>Complaint ID:</strong> {complaint?.id}</p>
            <p><strong>User:</strong> {complaint?.user}</p>
            <p><strong>Current Department:</strong> {complaint?.department}</p>
            <p><strong>Description:</strong> {complaint?.description}</p>
          </div>

          <div className="form-group">
            <label>Reassign to Department:</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-select"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="reassign-btn" onClick={handleReassign}>
            Reassign Complaint
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReassignModal;
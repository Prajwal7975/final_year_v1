import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./ManageDepartments.css";

const API_BASE = "https://your-api-id.execute-api.region.amazonaws.com/prod";

function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ===============================
  // Fetch All Departments
  // ===============================
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`);
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ===============================
  // Add or Update Department
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Department name is required");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/departments/${editingId}`
      : `${API_BASE}/departments`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setName("");
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  // ===============================
  // Delete Department
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      const res = await fetch(`${API_BASE}/departments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete");
        return;
      }

      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  // ===============================
  // Edit Department
  // ===============================
  const handleEdit = (dept) => {
    setName(dept.name);
    setEditingId(dept.id);
  };

  return (
    <>
      <Header />

      <div className="manage-container">
        <h2>Manage Departments</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="department-form">
          <input
            type="text"
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit">
            {editingId ? "Update Department" : "Add Department"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Table */}
        <table className="department-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="2">No departments found</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(dept)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(dept.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageDepartments;

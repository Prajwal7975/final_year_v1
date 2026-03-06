import { useState, useEffect } from "react";

function RegisterAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "DEPARTMENT_ADMIN",
  });

  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://76pd12y747.execute-api.ap-south-1.amazonaws.com/api/super-admin/admins",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const admins = typeof data.body === "string" ? JSON.parse(data.body) : data;
        const filtered = admins.filter((admin) => admin.role !== "SUPER_ADMIN");
        setAdminsList(filtered);
      } else {
        setAdminsList([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdminsList([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://76pd12y747.execute-api.ap-south-1.amazonaws.com/api/super-admin/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Admin Registered Successfully");

        setFormData({
          name: "",
          email: "",
          password: "",
          department: "",
          role: "DEPARTMENT_ADMIN",
        });

        fetchAdmins();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      
      {/* Register Form */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", maxWidth: "500px", marginBottom: "30px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Register Department Admin</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Role</option>
            <option value="DEPARTMENT_ADMIN">DEPARTMENT_ADMIN</option>
          </select>

          <input
            type="text"
            name="department"
            placeholder="Department Name"
            value={formData.department}
            required
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={submitStyle}>
            Register Admin
          </button>
        </form>
      </div>

      {/* Admins Table */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Registered Admins</h2>

        {loading ? (
          <p>Loading admins...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fb" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Registered On</th>
                </tr>
              </thead>

              <tbody>
                {adminsList.length > 0 ? (
                  adminsList.map((admin) => (
                    <tr key={admin.admin_id}>
                      <td style={tdStyle}>{admin.full_name}</td>
                      <td style={tdStyle}>{admin.department_id || "N/A"}</td>
                      <td style={tdStyle}>{admin.role}</td>
                      <td style={tdStyle}>
                        {admin.is_active ? "Active" : "Inactive"}
                      </td>
                      <td style={tdStyle}>{formatDate(admin.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                      No admins registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
};

const submitStyle = {
  padding: "12px 24px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  marginTop: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  fontWeight: "600",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee",
};

export default RegisterAdmin;
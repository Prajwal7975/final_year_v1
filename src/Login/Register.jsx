import { useState } from "react";

function RegisterAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "DEPARTMENT_ADMIN",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://fu1ep6kw0i.execute-api.eu-north-1.amazonaws.com/api/super-admin/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Admin Registered Successfully");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Register Department Admin</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
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
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <button type="submit" style={submitStyle}>
          Register Admin
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "10px 0",
};

const submitStyle = {
  padding: "10px 20px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default RegisterAdmin;

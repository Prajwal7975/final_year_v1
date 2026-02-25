import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://fu1ep6kw0i.execute-api.eu-north-1.amazonaws.com/login",
        { email: email.trim(), password: password.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const { access_token, role, department } = res.data;

      

      // 🔐 Store auth details
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("department", department);

      // ✅ Role-based redirect
      if (role.includes("SUPER_ADMIN")) {
        navigate("/super-admin");
      } else if (role.includes("DEPARTMENT_ADMIN")) {
        navigate(`/admin/${department.toLowerCase()}`);
      } else {
        alert("Unauthorized role");
        localStorage.clear();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Invalid email or password");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;

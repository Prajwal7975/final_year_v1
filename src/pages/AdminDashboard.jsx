import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ComplaintsTable from "../components/ComplaintsTable";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { department } = useParams();

  const token = localStorage.getItem("token");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // 🔥 filter from sidebar

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        let url = `https://76pd12y747.execute-api.ap-south-1.amazonaws.com/api/admin/${department}/complaints`;

        if (status) {
          url += `?status=${status}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data = await res.json();
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [token, department, status, navigate]);

  return (
    <>
      <Header department={department} />

      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar with filter */}
        <Sidebar setStatus={setStatus} />

        <div style={{ flex: 1, padding: "20px" }}>
          <ComplaintsTable complaints={complaints} loading={loading} />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
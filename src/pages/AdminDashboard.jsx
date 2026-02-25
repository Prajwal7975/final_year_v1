import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ComplaintsTable from "../components/ComplaintsTable";

function AdminDashboard() {
  const navigate = useNavigate();
  const { department } = useParams(); // 🔥 READ FROM URL

  const token = localStorage.getItem("token");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await fetch(
          `https://cwmhpuwvsf.execute-api.eu-north-1.amazonaws.com/api/admin/${department}/complaints`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
  }, [token, department, navigate]);

  return (
    <>
      <Header department={department} />
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <ComplaintsTable complaints={complaints} loading={loading} />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ComplaintsTable from "../components/ComplaintsTable";

function AdminDashboard() {
  const navigate = useNavigate();
  const { department } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // ✅ New states
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchComplaints = async () => {
      try {
        setLoading(true);

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

  // ✅ Helper: Generate automatic message
  const generateStatusMessage = (status) => {
    return `Your complaint status has been updated to "${status}". Please check the portal for more details.`;
  };

  // ✅ Update complaint status + AUTO NOTIFICATION
  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;

    try {
      const res = await fetch(
        `https://76pd12y747.execute-api.ap-south-1.amazonaws.com/api/admin/update-status/${selectedComplaint.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        // 🔥 AUTO TRIGGER NOTIFICATION (SQS-ready)
        const autoMessage = generateStatusMessage(newStatus);

        await fetch(
          "https://76pd12y747.execute-api.ap-south-1.amazonaws.com/api/notify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: selectedComplaint.email,
              message: autoMessage,
              complaintId: selectedComplaint.id,
              type: "STATUS_UPDATE",
            }),
          }
        );

        alert("Status updated & notification sent");

        setSelectedComplaint(null);
        setNewStatus("");

        // refresh complaints
        setStatus("");
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // ✅ Manual notification
  const handleSendNotification = async () => {
    if (!email || !message) return alert("Fill all fields");

    try {
      const res = await fetch(
        "https://76pd12y747.execute-api.ap-south-1.amazonaws.com/api/notify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            message,
            type: "MANUAL",
          }),
        }
      );

      if (res.ok) {
        alert("Manual notification sent");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        setStatus={setStatus}
        isOpen={isSidebarOpen}
        activeStatus={status}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header
          department={department}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
          <ComplaintsTable
            complaints={complaints}
            loading={loading}
            onSelectComplaint={(c) => {
              setSelectedComplaint(c);
              setEmail(c.email || "");
            }}
          />

          <div className="section-card">

          {/* ✅ Status Update Section */}
          {selectedComplaint && (
            <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}>
              <h3>Update Complaint Status</h3>

              <p><b>Selected Complaint ID:</b> {selectedComplaint.id}</p>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button onClick={handleStatusUpdate} style={{ marginLeft: "10px" }}>
                Update + Notify
              </button>
            </div>
            )}
            </div>

          {/* ✅ Manual Notification Section */}
          <div style={{ marginTop: "30px", border: "1px solid #aaa", padding: "15px" }}>
            <h3>Send Manual Notification</h3>

            <input
              type="email"
              placeholder="User Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "300px" }}
            />

            <textarea
              placeholder="Enter custom message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ display: "block", marginBottom: "10px", width: "300px" }}
            />

            <button onClick={handleSendNotification}>Send Manual Notification</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

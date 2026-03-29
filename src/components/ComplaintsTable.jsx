import { useState } from "react";

function ComplaintsTable({ complaints, onSelectComplaint }) {
  // ✅ ALWAYS call hooks first
  const [selectedId, setSelectedId] = useState(null);

  if (!Array.isArray(complaints)) {
    return <p>No complaints data</p>;
  }

  const formatId = (id) => (id ? "CMP-" + id.slice(0, 6) : "N/A");

  const copy = (id) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <div className="complaints-card">
      <h3>Recent Complaints</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Description</th>
            <th>Ward</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="7">No data</td>
            </tr>
          ) : (
            complaints.map((c) => (
              <tr
                key={c.id}
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()} // 🔥 critical fix
                className={selectedId === c.id ? "selected-row" : ""}
                onClick={() => {
                  onSelectComplaint(c);
                  setSelectedId(c.id);
                }}
              >
                <td
                  title={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(c.id);
                  }}
                  style={{ cursor: "pointer", fontWeight: "600" }}
                >
                  {formatId(c.id)}
                </td>

                <td>{c.user_id}</td>
                <td>{c.description}</td>
                <td>{c.address}</td>

                <td>
                  <span className={`status ${c.status}`}>{c.status}</span>
                </td>

                <td>{new Date(c.created_at).toLocaleString()}</td>

                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComplaint(c);
                      setSelectedId(c.id);
                    }}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintsTable;

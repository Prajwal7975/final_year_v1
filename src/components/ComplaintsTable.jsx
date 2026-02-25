function ComplaintsTable({ complaints }) {
  if (!Array.isArray(complaints)) {
    return <p style={{ padding: "20px" }}>No complaints data</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3>Recent Complaints</h3>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Description</th>
            <th>Ward</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No complaints found
              </td>
            </tr>
          ) : (
            complaints.map((c) => (
              <tr key={c.complaint_id}>
                <td>{c.complaint_id}</td>
                <td>{c.user_id}</td>
                <td>{c.description}</td>
                <td>{c.ward}</td>
                <td>{c.status}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintsTable;

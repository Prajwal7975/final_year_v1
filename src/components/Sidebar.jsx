function Sidebar({ setStatus }) {
  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#f1f5f9",
        padding: "20px",
      }}
    >
      <h3 style={{ color: "black" }}>Complaints</h3>

      <button onClick={() => setStatus("pending")}>Pending</button>
      <br />
      <br />
      <button onClick={() => setStatus("inprogress")}>In Progress</button>
      <br />
      <br />
      <button onClick={() => setStatus("resolved")}>Resolved</button>
    </div>
  );
}

export default Sidebar;

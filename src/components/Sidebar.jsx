function Sidebar({ setStatus, isOpen, activeStatus }) {
  const styles = {
    sidebar: {
      width: isOpen ? "240px" : "0px",
      background: "#1e293b",
      padding: isOpen ? "20px" : "0px",
      overflow: "hidden",
      transition: "0.3s",
      height: "calc(100vh - 70px)", // 👈 avoids header overlap
      color: "white",
    },

    title: {
      marginBottom: "20px",
      marginTop: "10px",
    },

    button: {
      width: "100%",
      marginBottom: "12px",
      padding: "10px",
      border: "none",
      borderRadius: "8px",
      background: "#334155",
      color: "white",
      cursor: "pointer",
      textAlign: "left",
    },

    activeButton: {
      background: "#3b82f6",
    },
  };

  return (
    <div style={styles.sidebar}>
      {isOpen && (
        <>
          <h3 style={styles.title}>Complaints</h3>

          <button
            style={{
              ...styles.button,
              ...(activeStatus === "pending" && styles.activeButton),
            }}
            onClick={() => setStatus("pending")}
          >
            Pending
          </button>

          <button
            style={{
              ...styles.button,
              ...(activeStatus === "in_progress" && styles.activeButton),
            }}
            onClick={() => setStatus("in_progress")}
          >
            In Progress
          </button>

          <button
            style={{
              ...styles.button,
              ...(activeStatus === "resolved" && styles.activeButton),
            }}
            onClick={() => setStatus("resolved")}
          >
            Resolved
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;

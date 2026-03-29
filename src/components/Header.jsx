function Header({ department, toggleSidebar }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "15px 25px",
        backgroundColor: "#1e293b",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      {/* ☰ Toggle INSIDE header */}
      <button
        onClick={toggleSidebar}
        style={{
          fontSize: "20px",
          marginRight: "15px",
          padding: "6px 10px",
          background: "#334155",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* TITLE */}
      <h2 style={{ margin: 0 }}>
        {department ? `Admin Panel – ${department}` : "Super Admin Panel"}
      </h2>

      {/* RIGHT */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "12px",
        }}
      >
        <button>Profile</button>
        <button>Settings</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Header;

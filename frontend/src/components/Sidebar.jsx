import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ hasAccount }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/auth");
  };

  const linkStyle = {
    color: "#CBD5E1",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    transition: "0.3s",
  };

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0F172A, #1E3A8A)",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* BRAND */}
      <h4
        style={{
          marginBottom: "30px",
          fontWeight: "700",
          letterSpacing: "1px",
        }}
      >
        Juloo Finance
      </h4>

      {/* NAV LINKS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        {(hasAccount ?? true) && (
          <>
            <Link to="/accounts" style={linkStyle}>
              🏦 Accounts
            </Link>

            <Link to="/transactions" style={linkStyle}>
              💸 Transactions
            </Link>

            <Link to="/loans" style={linkStyle}>
              🧾 Loans
            </Link>
          </>
        )}

        <Link to="/create-account" style={linkStyle}>
          ➕ Create Account
        </Link>
      </div>

      {/* SPACER */}
      <div style={{ flex: 1 }}></div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#EF4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#DC2626")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#EF4444")}
      >
        Logout
      </button>
    </div>
  );
}
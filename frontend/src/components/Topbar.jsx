import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserCircle, LogOut, LayoutDashboard } from "lucide-react";
import logo from "../assets/logo.jpg";
import { useUser } from "../context/UserContext";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div style={styles.topbar}>
      <div style={styles.left}>
        <img src={logo} alt="Bank Logo" style={styles.logo} />

        <div>
          <h4 style={styles.title}>Juloo Finance</h4>
          <p style={styles.subtitle}>Secure Digital Banking Platform</p>
        </div>

        <div style={styles.pageTag}>
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.iconBtn}>
          <Bell size={18} />
        </div>

        <div style={{ position: "relative" }}>
          <div style={styles.userCard} onClick={() => setOpen((v) => !v)}>
            <UserCircle size={18} />
            <span>Welcome, {user?.username || "User"}</span>
          </div>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.menuItem} onClick={() => navigate("/dashboard")}>
                <LayoutDashboard size={16} />
                Dashboard
              </div>

              <div style={styles.divider} />

              <div style={{ ...styles.menuItem, color: "#DC2626" }} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    height: "65px",
    padding: "0 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(90deg, #0F172A, #1E3A8A)",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.2)",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "800",
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#CBD5E1",
  },
  pageTag: {
    marginLeft: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  iconBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    cursor: "pointer",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    width: "180px",
    background: "white",
    color: "#0F172A",
    borderRadius: "12px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
    zIndex: 100,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    fontSize: "13px",
    cursor: "pointer",
  },
  divider: {
    height: "1px",
    background: "#E5E7EB",
    margin: "5px 0",
  },
};

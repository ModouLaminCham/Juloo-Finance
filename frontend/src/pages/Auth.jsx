import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { useUser } from "../context/UserContext";
import logo from "../assets/logo.jpg";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { isAuthenticated, loginWithTokens } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.username || !form.password || (!isLogin && !form.email)) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await api.post("auth/token/", {
          username: form.username,
          password: form.password,
        });

        await loginWithTokens({
          access: res.data.access,
          refresh: res.data.refresh,
        });
        navigate("/dashboard", { replace: true });
        return;
      }

      await api.post("auth/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setIsLogin(true);
      setForm((prev) => ({ ...prev, password: "" }));
      setError("Registration successful. You can now login.");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail) {
        setError(detail);
      } else if (err.response?.data) {
        setError("Unable to complete request. Please check your input.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <img src={logo} alt="logo" style={styles.logo} />
        <h1 style={styles.brand}>Juloo Finance</h1>
        <p style={styles.tagline}>
          Secure. Fast. Modern Digital Banking for The Gambia.
        </p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.title}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p style={styles.subtitle}>
            {isLogin
              ? "Login to access your banking dashboard"
              : "Register to start your digital banking journey"}
          </p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            {!isLogin && (
              <input
                style={styles.input}
                name="email"
                value={form.email}
                placeholder="Email Address"
                onChange={handleChange}
              />
            )}

            <input
              style={styles.input}
              name="username"
              value={form.username}
              placeholder="Username"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />

            <div style={styles.passwordBox}>
              <input
                style={styles.input}
                name="password"
                value={form.password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />

              <div style={styles.eyeIcon} onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>

            <p style={styles.switchText}>
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <span style={styles.switchLink} onClick={() => setIsLogin((v) => !v)}>
                {isLogin ? "Create account" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  leftPanel: {
    width: "45%",
    background: "linear-gradient(135deg, #0F172A, #1E3A8A)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  logo: {
    width: "90px",
    height: "90px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  brand: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "10px",
  },
  tagline: {
    textAlign: "center",
    color: "#CBD5E1",
    fontSize: "14px",
    maxWidth: "280px",
  },
  rightPanel: {
    width: "55%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F8FAFC",
  },
  card: {
    width: "380px",
    background: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
    border: "1px solid #E2E8F0",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748B",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    outline: "none",
  },
  passwordBox: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer",
    color: "#64748B",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#1E3A8A",
    color: "white",
    fontWeight: "600",
    marginTop: "10px",
  },
  switchText: {
    marginTop: "15px",
    fontSize: "13px",
    textAlign: "center",
    color: "#64748B",
  },
  switchLink: {
    color: "#1E3A8A",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorBox: {
    background: "#FEE2E2",
    color: "#991B1B",
    borderRadius: "10px",
    padding: "10px",
    marginTop: "10px",
    fontSize: "13px",
  },
};

import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useUser } from "../context/UserContext";

export default function Loans() {
  const { hasAccount } = useUser();
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ loan_type: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLoans = async () => {
    try {
      const res = await api.get("loans/mine/");
      setLoans(res.data);
      setError("");
    } catch (_err) {
      setError("Failed to load loans");
    }
  };

  useEffect(() => {
    if (hasAccount) {
      fetchLoans();
    }
  }, [hasAccount]);

  const apply = async () => {
    if (!form.loan_type || Number(form.amount) <= 0) {
      setError("Enter a valid loan type and amount");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await api.post("loans/apply/", {
        loan_type: form.loan_type,
        amount: form.amount,
      });
      setForm({ loan_type: "", amount: "" });
      await fetchLoans();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to apply for loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Sidebar hasAccount={hasAccount} />

      <div style={styles.main}>
        <Topbar />

        <div style={styles.container}>
          <h2 style={styles.title}>Loan Management</h2>

          {!hasAccount ? (
            <div style={styles.card}>Create an account first before applying for loans.</div>
          ) : (
            <>
              <div style={styles.card}>
                <h4>Apply for a Loan</h4>

                <div style={styles.formRow}>
                  <input
                    style={styles.input}
                    placeholder="Loan Type (Business, Personal...)"
                    value={form.loan_type}
                    onChange={(e) => setForm({ ...form, loan_type: e.target.value })}
                  />

                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Amount (GMD)"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />

                  <button style={styles.applyBtn} onClick={apply} disabled={loading}>
                    {loading ? "Submitting..." : "Apply"}
                  </button>
                </div>

                {error && <p style={styles.error}>{error}</p>}
              </div>

              <div style={styles.card}>
                <h4>Your Loans</h4>

                {loans.length === 0 ? (
                  <p style={styles.empty}>No loans yet</p>
                ) : (
                  loans.map((loan) => (
                    <div key={loan.id} style={styles.loanItem}>
                      <div>
                        <strong>{loan.loan_type}</strong>
                        <p style={styles.subText}>Created: {new Date(loan.created_at).toLocaleString()}</p>
                      </div>

                      <div style={styles.rightSection}>
                        <span style={styles.amount}>GMD {Number(loan.amount).toLocaleString()}</span>
                        <span style={styles.status}>{loan.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #1E3A8A)",
  },
  main: { flex: 1 },
  container: { padding: "25px", color: "white" },
  title: { marginBottom: "20px" },
  card: {
    background: "white",
    color: "#0F172A",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  formRow: { display: "flex", gap: "10px", marginTop: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
  },
  applyBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2563EB",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
  loanItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid #E5E7EB",
  },
  rightSection: { textAlign: "right" },
  amount: { display: "block", fontWeight: "700" },
  status: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    marginTop: "5px",
    display: "inline-block",
    color: "#92400E",
    background: "#FEF9C3",
  },
  subText: { fontSize: "12px", color: "#64748B" },
  empty: { color: "#64748B", marginTop: "10px" },
  error: { color: "#991B1B", marginTop: "8px" },
};

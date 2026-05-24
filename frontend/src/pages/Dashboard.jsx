import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { account, hasAccount } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!hasAccount) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    api
      .get("transactions/history/")
      .then((res) => setTransactions(res.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [hasAccount]);

  const applyLoan = async () => {
    if (!loanAmount || Number(loanAmount) <= 0) {
      return;
    }

    try {
      await api.post("loans/apply/", { loan_type: "General", amount: loanAmount });
      setLoanAmount("");
      alert("Loan request submitted");
    } catch (err) {
      alert(err.response?.data?.detail || "Loan request failed");
    }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <Sidebar hasAccount={hasAccount} />

      <div style={styles.main}>
        <Topbar />

        {!hasAccount ? (
          <div style={styles.emptyWrapper}>
            <div style={styles.emptyCard}>
              <h2>No Account Found</h2>
              <p>Create an account to start banking</p>
              <button style={styles.primaryBtn} onClick={() => navigate("/create-account")}>
                Open Account
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.container}>
            <h2 style={{ marginBottom: 20 }}>Juloo Dashboard</h2>

            <div style={styles.balanceCard}>
              <p>Total Balance</p>
              <h1>GMD {Number(account.balance).toLocaleString()}</h1>
            </div>

            <div style={styles.loanSection}>
              <h3>Apply for Loan</h3>

              <div style={styles.loanForm}>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  style={styles.input}
                />

                <button onClick={applyLoan} style={styles.loanBtn}>
                  Apply Loan
                </button>
              </div>
            </div>

            <div style={styles.transactionBox}>
              <h3>Recent Transactions</h3>

              {transactions.length === 0 ? (
                <p>No transactions yet</p>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} style={styles.txItem}>
                    <div>
                      <strong>{tx.transaction_type}</strong>
                      <p style={styles.txDate}>{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>

                    <span
                      style={{
                        color: tx.transaction_type === "DEPOSIT" ? "#22C55E" : "#EF4444",
                        fontWeight: "600",
                      }}
                    >
                      {tx.transaction_type === "DEPOSIT" ? "+" : "-"} GMD {Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
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
  balanceCard: {
    padding: "25px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #2563EB, #1E40AF)",
    marginBottom: "25px",
  },
  loanSection: { marginBottom: "25px" },
  loanForm: { display: "flex", gap: "10px", marginTop: "10px" },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "200px",
  },
  loanBtn: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#2563EB",
    color: "white",
    cursor: "pointer",
  },
  transactionBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    color: "black",
  },
  txItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  txDate: { fontSize: "12px", color: "#666" },
  emptyWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  emptyCard: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
  },
  primaryBtn: {
    marginTop: "15px",
    padding: "12px 20px",
    background: "#1E3A8A",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

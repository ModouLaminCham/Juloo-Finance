import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useUser } from "../context/UserContext";

const STATUS_META = {
  PENDING:  { bg: "#FEF9C3", color: "#92400E", label: "Pending" },
  APPROVED: { bg: "#DBEAFE", color: "#1E40AF", label: "Approved" },
  ACTIVE:   { bg: "#DCFCE7", color: "#166534", label: "Active" },
  REJECTED: { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
  CLOSED:   { bg: "#F1F5F9", color: "#475569", label: "Closed" },
};

const TRANSITIONS = {
  PENDING:  ["APPROVED", "REJECTED"],
  APPROVED: ["ACTIVE", "REJECTED"],
  ACTIVE:   ["CLOSED"],
  REJECTED: [],
  CLOSED:   [],
};

export default function AdminLoans() {
  const { hasAccount, isStaff } = useUser();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get("loans/admin/loans/");
      setLoans(res.data);
    } catch {
      setError("Failed to load loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff) fetchLoans();
  }, [isStaff]);

  const updateStatus = async (loanId, newStatus) => {
    setError("");
    setSuccess("");
    try {
      await api.patch(`loans/admin/loans/${loanId}/`, { status: newStatus });
      setSuccess(`Loan #${loanId} updated to ${newStatus}.`);
      await fetchLoans();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update loan.");
    }
  };

  const statusBadge = (status) => {
    const m = STATUS_META[status] || STATUS_META.CLOSED;
    return (
      <span
        className="px-3 py-1 rounded-pill fw-semibold d-inline-flex align-items-center gap-1"
        style={{ fontSize: 11, background: m.bg, color: m.color, whiteSpace: "nowrap" }}
      >
        {m.label}
      </span>
    );
  };

  const actionButtons = (loan) => {
    const allowed = TRANSITIONS[loan.status] || [];
    return allowed.map((next) => (
      <button
        key={next}
        className="btn btn-sm"
        style={{
          fontSize: 11,
          ...(next === "APPROVED" || next === "ACTIVE"
            ? { background: "#DCFCE7", color: "#166534", border: "0.5px solid #86EFAC" }
            : next === "REJECTED"
            ? { background: "#FEE2E2", color: "#991B1B", border: "0.5px solid #FCA5A5" }
            : { background: "#E2E8F0", color: "#475569", border: "0.5px solid #CBD5E1" }),
        }}
        onClick={() => updateStatus(loan.id, next)}
      >
        {next === "APPROVED" ? "Approve" : next === "REJECTED" ? "Reject" : next === "ACTIVE" ? "Activate" : next}
      </button>
    ));
  };

  return (
    <div className="d-flex min-vh-100" style={{ background: "#F8FAFC" }}>
      <Sidebar hasAccount={hasAccount} />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Topbar />

        <div className="p-4">
          <div className="mb-4">
            <h5 className="fw-semibold mb-0">Admin — Loan Management</h5>
            <p className="text-secondary mb-0" style={{ fontSize: 13 }}>
              Approve, reject, and manage all loan applications.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: 13 }}>
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2 px-3 mb-3" style={{ fontSize: 13 }}>
              <i className="bi bi-check-circle me-2"></i>{success}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "#1E3A8A" }}></div>
            </div>
          ) : loans.length === 0 ? (
            <div className="bg-white rounded-3 p-5 text-center" style={{ border: "0.5px solid #E2E8F0" }}>
              <i className="bi bi-inbox fs-2 text-secondary"></i>
              <p className="mt-3 text-secondary mb-0" style={{ fontSize: 14 }}>No loan applications yet.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white rounded-3 p-4"
                  style={{ border: "0.5px solid #E2E8F0" }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="fw-semibold" style={{ fontSize: 14 }}>
                        {loan.loan_type} Loan — #{loan.id}
                      </div>
                      <div className="text-secondary" style={{ fontSize: 12 }}>
                        {loan.borrower} &middot; Applied{" "}
                        {new Date(loan.created_at).toLocaleDateString(undefined, {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </div>
                    </div>
                    {statusBadge(loan.status)}
                  </div>

                  <div className="row g-2 mb-3">
                    {[
                      { label: "Amount", value: `GMD ${Number(loan.amount).toLocaleString()}` },
                      { label: "Total repayment", value: `GMD ${Number(loan.total_repayment).toLocaleString()}` },
                      { label: "Remaining", value: `GMD ${Number(loan.remaining_balance).toLocaleString()}` },
                      { label: "Duration", value: `${loan.duration_months} months` },
                      { label: "Collateral", value: loan.collateral || "None" },
                      { label: "Account #", value: loan.account_number?.slice(0, 8) + "…" },
                    ].map(({ label, value }) => (
                      <div key={label} className="col-6 col-md-4">
                        <div
                          className="rounded-3 p-2"
                          style={{ background: "#F8FAFC", border: "0.5px solid #E2E8F0" }}
                        >
                          <div className="text-secondary" style={{ fontSize: 11 }}>{label}</div>
                          <div className="fw-semibold" style={{ fontSize: 13 }}>{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {actionButtons(loan).length > 0 && (
                    <div className="d-flex gap-2">
                      {actionButtons(loan)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

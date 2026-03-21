import React from "react";
import { CreditCard, Download, CheckCircle, Clock, XCircle, RotateCcw } from "lucide-react";

const statusConfig = {
  completed: { icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Paid" },
  pending: { icon: Clock, color: "#fbbf24", bg: "rgba(251,191,36,0.1)", label: "Pending" },
  failed: { icon: XCircle, color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Failed" },
  refunded: { icon: RotateCcw, color: "#60a5fa", bg: "rgba(96,165,250,0.1)", label: "Refunded" },
};

export default function PaymentHistorySection({ payments }) {
  const totalSpent = payments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);

  const printReceipt = (p) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html><html>
      <head>
        <title>Receipt - ${p.course_title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body { margin:0; background:#020817; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'Inter',sans-serif; color:#e2e8f0; }
          .receipt { width:480px; background:#0f172a; border:1px solid rgba(167,139,250,0.25); border-radius:20px; padding:40px; }
          .logo { font-family:'Poppins',sans-serif; font-size:24px; font-weight:900; background:linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:4px; }
          .tag { font-size:11px; color:#475569; letter-spacing:2px; text-transform:uppercase; margin-bottom:32px; }
          h2 { font-family:'Poppins',sans-serif; font-size:18px; color:#a78bfa; margin-bottom:24px; }
          .row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:13px; }
          .label { color:#475569; }
          .value { color:#e2e8f0; font-weight:500; }
          .total-row { display:flex; justify-content:space-between; padding:16px 0 0; font-size:16px; }
          .total-label { color:#94a3b8; font-weight:600; }
          .total-value { color:#34d399; font-family:'Poppins',sans-serif; font-weight:900; font-size:20px; }
          .footer { text-align:center; margin-top:28px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); font-size:11px; color:#334155; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="logo">SkyBrisk</div>
          <div class="tag">Payment Receipt</div>
          <h2>Purchase Confirmation</h2>
          <div class="row"><span class="label">Course</span><span class="value">${p.course_title || "—"}</span></div>
          <div class="row"><span class="label">Student</span><span class="value">${p.student_name || p.student_email}</span></div>
          <div class="row"><span class="label">Payment Method</span><span class="value">${p.payment_method || "—"}</span></div>
          <div class="row"><span class="label">Transaction ID</span><span class="value">${p.transaction_id || "—"}</span></div>
          <div class="row"><span class="label">Status</span><span class="value" style="color:#34d399">${p.status}</span></div>
          <div class="row"><span class="label">Date</span><span class="value">${p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }) : "—"}</span></div>
          <div class="total-row"><span class="total-label">Amount Paid</span><span class="total-value">$${p.amount}</span></div>
          <div class="footer"><p>Thank you for learning with SkyBrisk!</p><p>For support: support@skybrisk.com</p></div>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment History</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>All your course purchases and receipts</p>
        </div>
        <div className="text-right px-4 py-2.5 rounded-2xl" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <p className="text-xs" style={{ color: "#475569" }}>Total Spent</p>
          <p className="text-xl font-black" style={{ color: "#34d399" }}>${totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([status, cfg]) => {
          const Icon = cfg.icon;
          const count = payments.filter(p => p.status === status).length;
          return (
            <div key={status} className="rounded-xl p-3" style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                <span className="text-xs font-semibold capitalize" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
              <p className="text-xl font-black text-white mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Payments list */}
      <div className="space-y-3">
        {payments.map(p => {
          const cfg = statusConfig[p.status] || statusConfig.pending;
          const Icon = cfg.icon;
          return (
            <div key={p.id} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg }}>
                    <CreditCard className="w-4.5 h-4.5" style={{ color: cfg.color, width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.course_title || "Course Purchase"}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                      {p.payment_method ? `${p.payment_method} · ` : ""}{p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </p>
                    {p.transaction_id && <p className="text-xs mt-0.5 font-mono" style={{ color: "#334155" }}>TXN: {p.transaction_id}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-lg font-black" style={{ color: "#34d399" }}>${p.amount}</p>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      <Icon className="w-3 h-3" />{cfg.label}
                    </span>
                    {p.status === "completed" && (
                      <button onClick={() => printReceipt(p)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-105"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b" }}>
                        <Download className="w-3 h-3" /> Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-16">
          <CreditCard className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
          <p className="text-base font-semibold text-white mb-1">No payments yet</p>
          <p className="text-sm" style={{ color: "#334155" }}>Your purchase history will appear here</p>
        </div>
      )}
    </div>
  );
}
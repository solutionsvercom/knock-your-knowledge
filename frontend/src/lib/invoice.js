import { CONTACT_EMAIL, CONTACT_PHONE } from "@/config/contact";

const SITE = "https://knockyourknowledge.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInr(n) {
  return `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function itemRows(items, amountInr) {
  const list = Array.isArray(items) && items.length ? items : [{ title: "KYK program", type: "course", taxable: amountInr, gst: 0, payable: amountInr }];
  return list.map((item) => {
    const payable = Number(item.payable ?? item.amountPaid ?? amountInr) || 0;
    const taxable = Number(item.taxable ?? item.taxableAmount ?? payable) || 0;
    const gst = Number(item.gst ?? item.gstAmount ?? Math.max(0, payable - taxable)) || 0;
    return {
      title: item.title || item.itemTitle || "KYK program",
      type: item.type || item.itemType || "course",
      taxable,
      gst,
      payable,
    };
  });
}

export function paymentToInvoice(p) {
  return {
    invoiceNumber: p.invoiceNumber || `INV-${String(p.id || "").slice(-8).toUpperCase()}`,
    date: p.createdAt || p.created_date,
    status: p.status || "paid",
    customer: {
      name: p.customer?.name || p.student_name || "Student",
      email: p.customer?.email || p.student_email || "",
      phone: p.customer?.contact || p.customer?.phone || p.student_phone || "",
    },
    items: p.items || [],
    coupon: p.coupon || "",
    amountInr: p.amountInr ?? p.amount ?? 0,
    orderId: p.orderId || "",
    paymentId: p.paymentId || p.transaction_id || "",
    provider: p.provider || "Cashfree",
  };
}

export function enrollmentToInvoice(e) {
  return {
    invoiceNumber: e.invoiceNumber || "—",
    date: e.createdAt,
    status: e.status || "paid",
    customer: {
      name: e.studentName || "Student",
      email: e.studentEmail || "",
      phone: e.studentPhone || "",
    },
    items: [
      {
        title: e.itemTitle,
        type: e.itemType,
        taxable: e.taxableAmount,
        gst: e.gstAmount,
        payable: e.amountPaid,
      },
    ],
    coupon: e.coupon || "",
    amountInr: e.amountPaid || 0,
    orderId: e.orderId || "",
    paymentId: e.paymentId || "",
    provider: "Cashfree",
  };
}

export function buildInvoiceHtml(invoice) {
  const rows = itemRows(invoice.items, invoice.amountInr);
  const taxableTotal = rows.reduce((s, r) => s + r.taxable, 0);
  const gstTotal = rows.reduce((s, r) => s + r.gst, 0);
  const payableTotal = rows.reduce((s, r) => s + r.payable, 0) || Number(invoice.amountInr) || 0;
  const status = String(invoice.status || "paid").toUpperCase();
  const tableRows = rows
    .map(
      (r) => `
      <tr>
        <td>
          <strong>${escapeHtml(r.title)}</strong>
          <div class="muted">${escapeHtml(String(r.type).replace(/_/g, " "))}</div>
        </td>
        <td class="right">${formatInr(r.taxable)}</td>
        <td class="right">${formatInr(r.gst)}</td>
        <td class="right">${formatInr(r.payable)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(invoice.invoiceNumber)} — Knock Your Knowledge</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, Segoe UI, Arial, sans-serif; color: #0f172a; background: #e2e8f0; padding: 24px; }
    .sheet { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px 44px; border-radius: 12px; box-shadow: 0 10px 40px rgba(15,23,42,.08); }
    .top { display: flex; justify-content: space-between; gap: 24px; border-bottom: 3px solid #7c3aed; padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 26px; font-weight: 800; color: #6d28d9; }
    .brand span { display: block; font-size: 12px; font-weight: 500; color: #64748b; margin-top: 4px; }
    .meta { text-align: right; }
    .meta h1 { font-size: 22px; letter-spacing: 2px; color: #7c3aed; }
    .meta p { font-size: 13px; color: #475569; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
    .box p { font-size: 14px; line-height: 1.6; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: #64748b; background: #f8fafc; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
    .right { text-align: right; white-space: nowrap; }
    .muted { font-size: 11px; color: #94a3b8; text-transform: capitalize; margin-top: 2px; }
    .totals td { border: 0; padding: 6px 12px; }
    .totals .grand td { font-size: 16px; font-weight: 800; color: #0f172a; border-top: 2px solid #7c3aed; padding-top: 12px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; }
    .badge.failed, .badge.created { background: #fef3c7; color: #b45309; }
    .foot { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
    .actions { text-align: right; margin-bottom: 16px; }
    .actions button { background: #7c3aed; color: #fff; border: 0; border-radius: 8px; padding: 10px 16px; font-weight: 700; cursor: pointer; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { box-shadow: none; border-radius: 0; padding: 0; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="actions">
      <button type="button" onclick="window.print()">Save / Print PDF</button>
    </div>
    <div class="top">
      <div>
        <div class="brand">Knock Your Knowledge<span>Internship &amp; career programs · ${escapeHtml(SITE)}</span></div>
      </div>
      <div class="meta">
        <h1>INVOICE</h1>
        <p><strong>${escapeHtml(invoice.invoiceNumber)}</strong></p>
        <p>${escapeHtml(formatDate(invoice.date))}</p>
        <p><span class="badge ${escapeHtml(String(invoice.status || "").toLowerCase())}">${escapeHtml(status)}</span></p>
      </div>
    </div>
    <div class="grid">
      <div class="box">
        <h3>Billed to</h3>
        <p>
          <strong>${escapeHtml(invoice.customer?.name || "Student")}</strong><br/>
          ${escapeHtml(invoice.customer?.email || "")}<br/>
          ${escapeHtml(invoice.customer?.phone || "")}
        </p>
      </div>
      <div class="box">
        <h3>Payment details</h3>
        <p>
          Gateway: ${escapeHtml(invoice.provider || "Cashfree")}<br/>
          Order ID: ${escapeHtml(invoice.orderId || "—")}<br/>
          Transaction ID: ${escapeHtml(invoice.paymentId || "—")}<br/>
          ${invoice.coupon ? `Coupon: ${escapeHtml(invoice.coupon)}<br/>` : ""}
        </p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Course / program</th>
          <th class="right">Taxable</th>
          <th class="right">GST</th>
          <th class="right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
      <tfoot class="totals">
        <tr>
          <td colspan="3" class="right">Taxable total</td>
          <td class="right">${formatInr(taxableTotal)}</td>
        </tr>
        <tr>
          <td colspan="3" class="right">GST</td>
          <td class="right">${formatInr(gstTotal)}</td>
        </tr>
        <tr class="grand">
          <td colspan="3" class="right">Amount paid</td>
          <td class="right">${formatInr(payableTotal)}</td>
        </tr>
      </tfoot>
    </table>
    <div class="foot">
      <p>This is a computer-generated invoice from Knock Your Knowledge and does not require a signature.</p>
      <p>Support: ${escapeHtml(CONTACT_EMAIL)} · ${escapeHtml(CONTACT_PHONE)}</p>
    </div>
  </div>
</body>
</html>`;
}

function downloadHtmlFile(html, filename) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** Opens a print-ready invoice and also downloads an HTML copy. */
export function downloadInvoice(invoice) {
  const html = buildInvoiceHtml(invoice);
  const safeName = String(invoice.invoiceNumber || "invoice").replace(/[^\w.-]+/g, "-");
  downloadHtmlFile(html, `KYK-Invoice-${safeName}.html`);

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

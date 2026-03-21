import React, { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Award, Download, Plus } from "lucide-react";

export default function CertificatesSection({ user, enrollments }) {
  const qc = useQueryClient();

  const { data: certificates = [] } = useQuery({
    queryKey: ["s-certificates", user.email],
    queryFn: () => api.certificates.mine()
  });

  const completedEnrollments = enrollments.filter(e => e.status === "completed");
  // Enrollments that have no certificate yet
  const uncertified = completedEnrollments.filter(e => !certificates.some(c => c.course_id === e.course_id));

  const issue = useMutation({
    mutationFn: (enrollment) => api.certificates.create({
      student_email: user.email,
      student_name: user.full_name,
      course_id: enrollment.course_id,
      course_title: enrollment.course_title,
      issued_date: new Date().toISOString().split("T")[0],
      certificate_id: `CERT-${Date.now()}-${enrollment.course_id.slice(-4).toUpperCase()}`
    }),
    onSuccess: () => qc.invalidateQueries(["s-certificates", user.email])
  });

  const printCert = (cert) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.course_title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
          .cert { width: 900px; padding: 60px; border: 3px solid #7c3aed; border-radius: 20px; text-align: center; position: relative; background: linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%); }
          .border-inner { position: absolute; inset: 10px; border: 1px solid rgba(124,58,237,0.3); border-radius: 14px; pointer-events: none; }
          h1 { font-family: 'Poppins', sans-serif; font-size: 48px; font-weight: 900; background: linear-gradient(90deg, #7c3aed, #2563eb); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; }
          .subtitle { font-size: 14px; color: #6366f1; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; }
          .presented { color: #64748b; font-size: 16px; margin-bottom: 12px; }
          .name { font-family: 'Poppins', sans-serif; font-size: 42px; font-weight: 700; color: #1e1b4b; margin: 10px 0 30px; }
          .for { color: #64748b; font-size: 16px; margin-bottom: 12px; }
          .course { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: #7c3aed; margin-bottom: 40px; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(124,58,237,0.2); }
          .sig { text-align: center; }
          .sig-line { width: 180px; border-top: 2px solid #334155; margin: 0 auto 8px; }
          .sig-label { font-size: 12px; color: #64748b; }
          .cert-id { font-size: 11px; color: #94a3b8; text-align: center; }
          @media print { body { background: white; } }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="border-inner"></div>
          <h1>SkyBrisk</h1>
          <p class="subtitle">Certificate of Completion</p>
          <p class="presented">This is to certify that</p>
          <p class="name">${cert.student_name}</p>
          <p class="for">has successfully completed the course</p>
          <p class="course">${cert.course_title}</p>
          <div class="footer">
            <div class="sig">
              <div class="sig-line"></div>
              <p class="sig-label">${cert.instructor || "Instructor"}</p>
              <p style="font-size:11px;color:#94a3b8">Course Instructor</p>
            </div>
            <div class="cert-id">
              <p>Issued: ${new Date(cert.issued_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <p>Certificate ID: ${cert.certificate_id}</p>
            </div>
            <div class="sig">
              <div class="sig-line"></div>
              <p class="sig-label">SkyBrisk Platform</p>
              <p style="font-size:11px;color:#94a3b8">Authorized Signature</p>
            </div>
          </div>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>My Certificates</h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Certificates earned from completed courses</p>
      </div>

      {/* Uncertified completed courses */}
      {uncertified.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <p className="text-sm font-semibold text-white mb-3">🎓 Ready to claim!</p>
          <div className="space-y-2">
            {uncertified.map(e => (
              <div key={e.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm text-white">{e.course_title}</p>
                <button onClick={() => issue.mutate(e)} disabled={issue.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #d97706, #fbbf24)" }}>
                  <Plus className="w-3 h-3" /> Claim Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {certificates.map(cert => (
          <div key={cert.id} className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.08))", border: "1px solid rgba(167,139,250,0.25)" }}>
            {/* Decorative */}
            <div className="absolute top-3 right-3 opacity-10">
              <Award style={{ width: 64, height: 64, color: "#a78bfa" }} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5" style={{ color: "#fbbf24" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a78bfa" }}>Certificate of Completion</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">{cert.course_title}</h3>
            <p className="text-xs mb-4" style={{ color: "#64748b" }}>
              Issued on {cert.issued_date ? new Date(cert.issued_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono" style={{ color: "#334155" }}>{cert.certificate_id}</p>
              <button onClick={() => printCert(cert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}>
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && uncertified.length === 0 && (
        <div className="text-center py-16">
          <Award className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
          <p className="text-base font-semibold text-white mb-1">No certificates yet</p>
          <p className="text-sm" style={{ color: "#334155" }}>Complete a course to earn your certificate</p>
        </div>
      )}
    </div>
  );
}
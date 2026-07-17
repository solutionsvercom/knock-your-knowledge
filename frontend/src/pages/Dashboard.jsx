import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/api/apiClient";
import { Loader2 } from "lucide-react";
import TeacherDashboard from "../components/crm/TeacherDashboard";
import StudentDashboard from "../components/crm/StudentDashboard";
import SalesDashboard from "../components/crm/SalesDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      api.auth.redirectToLogin("/Dashboard");
      return;
    }
    api.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      api.auth.redirectToLogin("/Dashboard");
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#a78bfa" }} />
      </div>
    );
  }

  const role = user?.role || "student";

  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "teacher") return <TeacherDashboard user={user} />;
  if (role === "sales") return <SalesDashboard user={user} />;
  return <StudentDashboard user={user} />;
}
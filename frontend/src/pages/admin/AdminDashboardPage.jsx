import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import OverviewSection from "@/components/crm/admin/OverviewSection";

export default function AdminDashboardPage() {
  const { data: users = [] } = useQuery({ queryKey: ["crm-users"], queryFn: () => api.users.list() });
  const { data: courses = [] } = useQuery({
    queryKey: ["crm-courses"],
    queryFn: async () => asArray(await api.courses.list("-createdAt")),
  });
  const { data: payments = [] } = useQuery({ queryKey: ["crm-payments"], queryFn: () => api.payments.list() });
  const { data: tickets = [] } = useQuery({ queryKey: ["crm-tickets"], queryFn: () => api.supportTickets.list() });
  const { data: enrollments = [] } = useQuery({ queryKey: ["crm-enrollments"], queryFn: () => api.enrollments.list() });

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Dashboard
      </h1>
      <OverviewSection
        users={users}
        courses={courses}
        payments={payments}
        tickets={tickets}
        enrollments={enrollments}
      />
    </div>
  );
}

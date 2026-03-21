import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import UsersSection from "@/components/crm/admin/UsersSection";

export default function AdminUsersPage() {
  const { data: users = [] } = useQuery({ queryKey: ["crm-users"], queryFn: () => api.users.list() });

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Users
      </h1>
      <UsersSection users={users} />
    </div>
  );
}

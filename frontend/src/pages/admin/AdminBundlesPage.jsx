import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import BundlesSection from "@/components/crm/admin/BundlesSection";

export default function AdminBundlesPage() {
  const { data: bundles = [] } = useQuery({ queryKey: ["crm-bundles"], queryFn: () => api.bundles.list("-createdAt") });

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Bundles
      </h1>
      <BundlesSection bundles={bundles} />
    </div>
  );
}

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";

const ROLES = ["student", "teacher", "sales", "admin", "user"];

export default function UsersSection({ users = [] }) {
  const qc = useQueryClient();
  const updateRole = useMutation({
    mutationFn: ({ id, role }) => api.users.update(id, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-users"] }),
  });
  const remove = useMutation({
    mutationFn: (id) => api.users.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-users"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Users</h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
          {users.length} registered users
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Name", "Email", "Role", "Created", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td className="px-4 py-3 text-white">{u.full_name || "—"}</td>
                <td className="px-4 py-3" style={{ color: "#94a3b8" }}>{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role || "student"}
                    onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                    className="px-2 py-1.5 rounded-lg text-xs outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3" style={{ color: "#64748b" }}>
                  {u.created_date ? new Date(u.created_date).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this user?")) remove.mutate(u.id);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


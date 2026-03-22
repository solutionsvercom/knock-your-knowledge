import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Bell, CheckCheck, Video, BookOpen, CreditCard, Award, Megaphone, Info } from "lucide-react";

const typeConfig = {
  announcement: { icon: Megaphone, color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  session: { icon: Video, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  course: { icon: BookOpen, color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  payment: { icon: CreditCard, color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  certificate: { icon: Award, color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  system: { icon: Info, color: "#475569", bg: "rgba(71,85,105,0.1)" },
};

export default function NotificationsSection({ user }) {
  const qc = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["s-notifications", user.email],
    queryFn: () => api.notifications.mine()
  });

  const markRead = useMutation({
    mutationFn: (id) => api.notifications.markRead(id),
    onSuccess: () => qc.invalidateQueries(["s-notifications", user.email])
  });

  const markAllRead = useMutation({
    mutationFn: async () => api.notifications.markAllRead(),
    onSuccess: () => qc.invalidateQueries(["s-notifications", user.email])
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Notifications</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllRead.mutate()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const cfg = typeConfig[n.type] || typeConfig.system;
          const Icon = cfg.icon;
          return (
            <div key={n.id}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className="flex items-start gap-4 px-4 py-4 rounded-2xl transition-all cursor-pointer hover:scale-[1.005]"
              style={{
                background: n.is_read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${n.is_read ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)"}`,
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}>
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: n.is_read ? "#64748b" : "#e2e8f0" }}>{n.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!n.is_read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#60a5fa" }} />}
                    <p className="text-xs whitespace-nowrap" style={{ color: "#334155" }}>
                      {n.created_date ? new Date(n.created_date).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{n.message}</p>
                {n.sender_name && <p className="text-xs mt-1" style={{ color: "#334155" }}>From: {n.sender_name}</p>}
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
            <p className="text-base font-semibold text-white mb-1">No notifications</p>
            <p className="text-sm" style={{ color: "#334155" }}>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
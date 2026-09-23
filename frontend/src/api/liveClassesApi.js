import { apiUrl } from "@/config/api";

export async function fetchLiveClasses() {
  const res = await fetch(apiUrl("/live-classes"));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not load live classes.");
  }
  return data;
}

export async function fetchMyNotifications(email) {
  const key = String(email || "").trim().toLowerCase();
  if (!key) return { notifications: [], unread: 0, count: 0 };

  const res = await fetch(`${apiUrl("/notifications/mine")}?email=${encodeURIComponent(key)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not load notifications.");
  }
  return data;
}

export async function markNotificationRead(id, email) {
  const res = await fetch(
    `${apiUrl(`/notifications/${encodeURIComponent(id)}/read`)}?email=${encodeURIComponent(email)}`,
    { method: "PATCH" }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Could not mark as read.");
  return data;
}

export async function markAllNotificationsRead(email) {
  const res = await fetch(apiUrl("/notifications/mark-all-read"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Could not mark all as read.");
  return data;
}

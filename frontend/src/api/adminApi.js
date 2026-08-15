const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "kyk-admin-local";

async function adminFetch(path, options = {}) {
  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Admin request failed (${res.status})`);
  }
  return data;
}

export const adminApi = {
  overview: () => adminFetch("/overview"),
  enrollments: () => adminFetch("/enrollments"),
  students: () => adminFetch("/students"),
  payments: () => adminFetch("/payments"),
  sales: {
    list: () => adminFetch("/sales"),
    create: (body) => adminFetch("/sales", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      adminFetch(`/sales/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  coupons: {
    list: () => adminFetch("/coupons"),
    create: (body) => adminFetch("/coupons", { method: "POST", body: JSON.stringify(body) }),
  },
  tickets: {
    list: () => adminFetch("/tickets"),
    create: (body) => adminFetch("/tickets", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      adminFetch(`/tickets/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  leads: () => adminFetch("/leads"),
};

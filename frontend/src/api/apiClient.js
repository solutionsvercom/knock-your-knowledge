/**
 * KYK frontend API — Axios client; `API_BASE` from src/config/api.js (runtime, no build env).
 */
import axios from "axios";
import { API_BASE } from "@/config/api";

const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

const setToken = (token) => {
  try {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  } catch {
    // ignore
  }
};

function normalizeAxiosError(error) {
  const res = error.response;
  const payload = res?.data;
  let message = error.message || res?.statusText || "Request failed";

  if (payload && typeof payload === "object") {
    const pm = payload.message;
    if (typeof pm === "string" && pm.trim()) message = pm;
    else if (payload.code) message = String(payload.code);
    const details = payload.details;
    if (Array.isArray(details) && details.length > 0) {
      const d0 = details[0];
      if (typeof d0 === "string") message = d0;
      else if (d0?.message) message = d0.message;
    }
  } else if (typeof payload === "string" && payload.trim()) {
    message = payload.trim().slice(0, 300);
  }

  const err = new Error(message);
  err.status = res?.status;
  err.data = typeof payload === "object" && payload !== null ? payload : { message: payload };
  if (payload?.code) err.code = payload.code;
  return err;
}

const httpClient = axios.create({
  baseURL: API_BASE || undefined,
  timeout: 120_000,
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const m = (config.method || "get").toLowerCase();
  if (m === "get" || m === "head") {
    config.headers["Cache-Control"] = "no-cache";
    config.headers.Pragma = "no-cache";
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status >= 500) {
      const data = error.response?.data;
      const fullUrl = `${error.config?.baseURL || ""}${error.config?.url || ""}`;
      let detail = "";
      if (data == null || data === "") detail = "(empty response body — often wrong API URL)";
      else if (typeof data === "string") detail = data.slice(0, 300);
      else if (typeof data?.message === "string" && data.message) detail = data.message;
      else
        try {
          detail = JSON.stringify(data).slice(0, 300);
        } catch {
          detail = "(unreadable error body)";
        }
      console.warn("[API 500]", error.response.status, fullUrl, detail);
    }
    return Promise.reject(normalizeAxiosError(error));
  }
);

const http = async (path, { method = "GET", body, headers } = {}) => {
  const url = path.startsWith("/api/") ? path : `/api${path.startsWith("/") ? "" : "/"}${path}`;
  return httpClient.request({
    url,
    method,
    data: body,
    headers: headers || {},
  });
};

const toQueryString = (params) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
};

export const api = {
  auth: {
    me: async () => http("/api/auth/me"),
    signup: async ({ email, full_name, password } = {}) => {
      const result = await httpClient.post("/api/auth/signup", { email, full_name, password });
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    register: async (body) => {
      const result = await httpClient.post("/api/auth/register", body);
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    login: async ({ email, password } = {}) => {
      const result = await httpClient.post("/api/auth/login", { email, password });
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    adminLogin: async ({ email, password } = {}) => {
      const result = await httpClient.post("/api/auth/admin/login", { email, password });
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    clearSession: () => setToken(null),
    logout: (redirectTo) => {
      setToken(null);
      if (redirectTo) window.location.href = redirectTo;
    },
    redirectToLogin: (fromUrl) => {
      const next = fromUrl ? `?next=${encodeURIComponent(fromUrl)}` : "";
      window.location.href = `/login${next}`;
    },
  },
  ai: {
    invokeLLM: async (payload) =>
      http("/api/integrations/core/invoke-llm", { method: "POST", body: payload }),
    sendEmail: async (payload) =>
      http("/api/integrations/core/send-email", { method: "POST", body: payload }),
    uploadFile: async ({ file }) => {
      const token = getToken();
      const form = new FormData();
      form.append("file", file);
      return httpClient
        .post("/api/integrations/core/upload-file", form, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          transformRequest: [(data) => data],
        })
        .catch((e) => Promise.reject(normalizeAxiosError(e)));
    },
  },
  users: {
    list: async () => http("/api/users"),
    update: async (id, data) => http(`/api/users/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" }),
    inviteUser: async (email, role) =>
      http("/api/users/invite", { method: "POST", body: { email, role } }),
  },
  courses: {
    list: async (sort, limit, instructor) =>
      http(`/api/courses${toQueryString({ sort, limit, instructor })}`),
    getById: async (id) => http(`/api/courses/${encodeURIComponent(id)}`),
    create: async (data) => http("/api/courses", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/courses/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/courses/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  bundles: {
    list: async (sort, limit) => http(`/api/bundles${toQueryString({ sort, limit })}`),
    getById: async (id) => http(`/api/bundles/${encodeURIComponent(id)}`),
    create: async (data) => http("/api/bundles", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/bundles/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/bundles/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  internships: {
    list: async () => http("/api/internships"),
    create: async (data) => http("/api/internships", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/internships/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/internships/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  liveClasses: {
    list: async () => http("/api/live-classes"),
    create: async (data) => http("/api/live-classes", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/live-classes/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/live-classes/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  supportTickets: {
    list: async () => http("/api/support-tickets"),
    mine: async () => http("/api/support-tickets/mine"),
    create: async (data) => http("/api/support-tickets", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/support-tickets/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    replies: async (ticket_id) => http(`/api/support-tickets/replies${toQueryString({ ticket_id })}`),
    reply: async (data) => http("/api/support-tickets/replies", { method: "POST", body: data }),
  },
  notifications: {
    mine: async () => http("/api/notifications/mine"),
    markRead: async (id) => http(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }),
    markAllRead: async () => http("/api/notifications/read-all", { method: "PATCH" }),
    create: async (data) => http("/api/notifications", { method: "POST", body: data }),
  },
  aiConversations: {
    mine: async () => http("/api/ai-conversations/mine"),
    list: async () => http("/api/ai-conversations"),
    create: async (data) => http("/api/ai-conversations", { method: "POST", body: data }),
  },
  enrollments: {
    list: async () => http("/api/enrollments"),
    mine: async () => http("/api/enrollments/mine"),
    create: async ({ course_id }) => http("/api/enrollments", { method: "POST", body: { course_id } }),
    updateProgress: async (id, progress) =>
      http(`/api/enrollments/${encodeURIComponent(id)}/progress`, { method: "PUT", body: { progress } }),
  },
  payments: {
    list: async () => http("/api/payments"),
    mine: async () => http("/api/payments/mine"),
    createCoursePayment: async ({ course_id, amount }) =>
      http("/api/payments/course", { method: "POST", body: { course_id, amount } }),
    createBundlePurchase: async ({ bundle_id }) =>
      http("/api/payments/bundle", { method: "POST", body: { bundle_id } }),
    updateStatus: async (id, data) =>
      http(`/api/payments/${encodeURIComponent(id)}`, { method: "PATCH", body: data }),
  },
  leads: {
    list: async () => http("/api/leads"),
    create: async (data) => http("/api/leads", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/leads/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/leads/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  courseInterests: {
    list: async () => http("/api/course-interests"),
    mine: async () => http("/api/course-interests/mine"),
    track: async (data) => http("/api/course-interests", { method: "POST", body: data }),
  },
  doubtSessions: {
    list: async (teacher_email) => http(`/api/doubt-sessions${toQueryString({ teacher_email })}`),
    create: async (data) => http("/api/doubt-sessions", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/doubt-sessions/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/doubt-sessions/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  lessons: {
    listByCourse: async (courseId) => http(`/api/lessons${toQueryString({ course_id: courseId })}`),
    create: async (data) => http("/api/lessons", { method: "POST", body: data }),
    update: async (id, data) => http(`/api/lessons/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
    delete: async (id) => http(`/api/lessons/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  quizzes: {
    listByCourse: async (courseId) => http(`/api/quizzes${toQueryString({ course_id: courseId })}`),
    create: async (data) => http("/api/quizzes", { method: "POST", body: data }),
    delete: async (id) => http(`/api/quizzes/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  resources: {
    listByCourse: async (courseId) => http(`/api/resources${toQueryString({ course_id: courseId })}`),
    create: async (data) => http("/api/resources", { method: "POST", body: data }),
    delete: async (id) => http(`/api/resources/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  certificates: {
    mine: async () => http("/api/certificates/mine"),
    create: async (data) => http("/api/certificates", { method: "POST", body: data }),
  },
  appLogs: {
    logUserInApp: async (pageName) =>
      http("/api/app-logs/log-user-in-app", { method: "POST", body: { pageName } }),
  },
};

export default api;

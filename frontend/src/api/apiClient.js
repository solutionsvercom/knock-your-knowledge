/**
 * KYK frontend API — Axios client for Express `/api`.
 * - Local dev: leave VITE_API_BASE_URL unset → `/api` + Vite dev proxy (vite.config.js).
 * - Production: set VITE_API_BASE_URL at build time to your API base URL ending in `/api`.
 *   On the API server, FRONTEND_URL / CORS must allow your site origin.
 */
import axios from 'axios';

function normalizeApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw == null || raw === '') return '/api';
  const trimmed = String(raw).replace(/\/$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

const API_BASE = normalizeApiBase();

/** Obvious template hostnames from docs — must never be deployed */
const PLACEHOLDER_API_RE =
  /your-express-host|your-api-host|changeme|placeholder|replace\s*me|example\.invalid/i;

if (import.meta.env.PROD) {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const trimmed = raw == null ? '' : String(raw).trim();
  if (trimmed && PLACEHOLDER_API_RE.test(trimmed)) {
    // eslint-disable-next-line no-console
    console.error(
      '[KYK] VITE_API_BASE_URL looks like a placeholder. Set a real API URL (…/api) for production builds (see README).'
    );
  }
}

const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const setToken = (token) => {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch {
    // ignore
  }
};

function normalizeAxiosError(error) {
  const res = error.response;
  const payload = res?.data;
  let message = error.message || res?.statusText || 'Request failed';

  if (payload && typeof payload === 'object') {
    const pm = payload.message;
    if (typeof pm === 'string' && pm.trim()) message = pm;
    else if (payload.code) message = String(payload.code);
    const details = payload.details;
    if (Array.isArray(details) && details.length > 0) {
      const d0 = details[0];
      if (typeof d0 === 'string') message = d0;
      else if (d0?.message) message = d0.message;
    }
  } else if (typeof payload === 'string' && payload.trim()) {
    message = payload.trim().slice(0, 300);
  }

  const err = new Error(message);
  err.status = res?.status;
  err.data = typeof payload === 'object' && payload !== null ? payload : { message: payload };
  if (payload?.code) err.code = payload.code;
  return err;
}

const httpClient = axios.create({
  baseURL: API_BASE,
  timeout: 120_000,
  withCredentials: false,
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const m = (config.method || 'get').toLowerCase();
  if (m === 'get' || m === 'head') {
    config.headers['Cache-Control'] = 'no-cache';
    config.headers.Pragma = 'no-cache';
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status >= 500) {
      const data = error.response?.data;
      const fullUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      let detail = '';
      if (data == null || data === '') detail = '(empty response body — often wrong API URL or proxy)';
      else if (typeof data === 'string') detail = data.slice(0, 300);
      else if (typeof data?.message === 'string' && data.message) detail = data.message;
      else
        try {
          detail = JSON.stringify(data).slice(0, 300);
        } catch {
          detail = '(unreadable error body)';
        }
      console.warn('[API 500]', error.response.status, fullUrl, detail);
    }
    return Promise.reject(normalizeAxiosError(error));
  }
);

/**
 * JSON request helper (returns parsed body only).
 * @param {string} path - e.g. `/courses`
 * @param {{ method?: string, body?: unknown, headers?: Record<string, string> }} opts
 */
const http = async (path, { method = 'GET', body, headers } = {}) => {
  return httpClient.request({
    url: path,
    method,
    data: body,
    headers: headers || {},
  });
};

const toQueryString = (params) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === '') continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
};

export const api = {
  auth: {
    me: async () => http('/auth/me'),
    signup: async ({ email, full_name, password } = {}) => {
      const result = await http('/auth/signup', {
        method: 'POST',
        body: { email, full_name, password },
      });
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    register: async (body) => {
      const result = await http('/auth/register', {
        method: 'POST',
        body,
      });
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    login: async ({ email, password } = {}) => {
      const result = await http('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (result?.token) setToken(result.token);
      return result?.user;
    },
    clearSession: () => setToken(null),
    logout: (redirectTo) => {
      setToken(null);
      if (redirectTo) window.location.href = redirectTo;
    },
    redirectToLogin: (fromUrl) => {
      const next = fromUrl ? `?next=${encodeURIComponent(fromUrl)}` : '';
      window.location.href = `/login${next}`;
    },
  },
  ai: {
    invokeLLM: async (payload) =>
      http('/integrations/core/invoke-llm', { method: 'POST', body: payload }),
    sendEmail: async (payload) =>
      http('/integrations/core/send-email', { method: 'POST', body: payload }),
    uploadFile: async ({ file }) => {
      const token = getToken();
      const form = new FormData();
      form.append('file', file);
      return httpClient
        .post('/integrations/core/upload-file', form, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          transformRequest: [(data) => data],
        })
        .catch((e) => Promise.reject(normalizeAxiosError(e)));
    },
  },
  users: {
    list: async () => http('/users'),
    update: async (id, data) => http(`/users/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    inviteUser: async (email, role) =>
      http('/users/invite', { method: 'POST', body: { email, role } }),
  },
  courses: {
    list: async (sort, limit, instructor) =>
      http(`/courses${toQueryString({ sort, limit, instructor })}`),
    getById: async (id) => http(`/courses/${encodeURIComponent(id)}`),
    create: async (data) => http('/courses', { method: 'POST', body: data }),
    update: async (id, data) => http(`/courses/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/courses/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  bundles: {
    list: async (sort, limit) => http(`/bundles${toQueryString({ sort, limit })}`),
    getById: async (id) => http(`/bundles/${encodeURIComponent(id)}`),
    create: async (data) => http('/bundles', { method: 'POST', body: data }),
    update: async (id, data) => http(`/bundles/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/bundles/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  internships: {
    list: async () => http('/internships'),
    create: async (data) => http('/internships', { method: 'POST', body: data }),
    update: async (id, data) => http(`/internships/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/internships/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  liveClasses: {
    list: async () => http('/live-classes'),
    create: async (data) => http('/live-classes', { method: 'POST', body: data }),
    update: async (id, data) => http(`/live-classes/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/live-classes/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  supportTickets: {
    list: async () => http('/support-tickets'),
    mine: async () => http('/support-tickets/mine'),
    create: async (data) => http('/support-tickets', { method: 'POST', body: data }),
    update: async (id, data) => http(`/support-tickets/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    replies: async (ticket_id) => http(`/support-tickets/replies${toQueryString({ ticket_id })}`),
    reply: async (data) => http('/support-tickets/replies', { method: 'POST', body: data }),
  },
  notifications: {
    mine: async () => http('/notifications/mine'),
    markRead: async (id) => http(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),
    markAllRead: async () => http('/notifications/read-all', { method: 'PATCH' }),
    create: async (data) => http('/notifications', { method: 'POST', body: data }),
  },
  aiConversations: {
    mine: async () => http('/ai-conversations/mine'),
    list: async () => http('/ai-conversations'),
    create: async (data) => http('/ai-conversations', { method: 'POST', body: data }),
  },
  enrollments: {
    list: async () => http('/enrollments'),
    mine: async () => http('/enrollments/mine'),
    create: async ({ course_id }) => http('/enrollments', { method: 'POST', body: { course_id } }),
    updateProgress: async (id, progress) =>
      http(`/enrollments/${encodeURIComponent(id)}/progress`, { method: 'PUT', body: { progress } }),
  },
  payments: {
    list: async () => http('/payments'),
    mine: async () => http('/payments/mine'),
    createCoursePayment: async ({ course_id, amount }) =>
      http('/payments/course', { method: 'POST', body: { course_id, amount } }),
    createBundlePurchase: async ({ bundle_id }) =>
      http('/payments/bundle', { method: 'POST', body: { bundle_id } }),
    updateStatus: async (id, data) =>
      http(`/payments/${encodeURIComponent(id)}`, { method: 'PATCH', body: data }),
  },
  leads: {
    list: async () => http('/leads'),
    create: async (data) => http('/leads', { method: 'POST', body: data }),
    update: async (id, data) => http(`/leads/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/leads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  courseInterests: {
    list: async () => http('/course-interests'),
    mine: async () => http('/course-interests/mine'),
    track: async (data) => http('/course-interests', { method: 'POST', body: data }),
  },
  doubtSessions: {
    list: async (teacher_email) => http(`/doubt-sessions${toQueryString({ teacher_email })}`),
    create: async (data) => http('/doubt-sessions', { method: 'POST', body: data }),
    update: async (id, data) => http(`/doubt-sessions/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/doubt-sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  lessons: {
    listByCourse: async (courseId) => http(`/lessons${toQueryString({ course_id: courseId })}`),
    create: async (data) => http('/lessons', { method: 'POST', body: data }),
    update: async (id, data) => http(`/lessons/${encodeURIComponent(id)}`, { method: 'PUT', body: data }),
    delete: async (id) => http(`/lessons/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  quizzes: {
    listByCourse: async (courseId) => http(`/quizzes${toQueryString({ course_id: courseId })}`),
    create: async (data) => http('/quizzes', { method: 'POST', body: data }),
    delete: async (id) => http(`/quizzes/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  resources: {
    listByCourse: async (courseId) => http(`/resources${toQueryString({ course_id: courseId })}`),
    create: async (data) => http('/resources', { method: 'POST', body: data }),
    delete: async (id) => http(`/resources/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  certificates: {
    mine: async () => http('/certificates/mine'),
    create: async (data) => http('/certificates', { method: 'POST', body: data }),
  },
  appLogs: {
    logUserInApp: async (pageName) =>
      http('/app-logs/log-user-in-app', { method: 'POST', body: { pageName } }),
  },
};

export default api;

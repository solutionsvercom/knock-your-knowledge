/**
 * Frontend-only API — localStorage + static demo data (no backend).
 */
import {
  DEMO_ADMIN,
  DEMO_BUNDLES,
  DEMO_COURSES,
  DEMO_INTERNSHIPS,
  DEMO_LIVE_CLASSES,
  lessonsForCourse,
} from "@/data/demoData";

const KEYS = {
  token: "token",
  users: "kyk_users",
  courses: "kyk_courses_v3",
  bundles: "kyk_bundles_v2",
  internships: "kyk_internships_v3",
  liveClasses: "kyk_live_classes",
  enrollments: "kyk_enrollments",
  payments: "kyk_payments",
  tickets: "kyk_tickets",
  ticketReplies: "kyk_ticket_replies",
  notifications: "kyk_notifications",
  aiConversations: "kyk_ai_conversations",
  leads: "kyk_leads",
  courseInterests: "kyk_course_interests",
  doubtSessions: "kyk_doubt_sessions",
  lessons: "kyk_lessons_v3",
  quizzes: "kyk_quizzes",
  resources: "kyk_resources",
  certificates: "kyk_certificates",
};

function delay(ms = 80) {
  return new Promise((r) => setTimeout(r, ms));
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getToken() {
  try {
    return localStorage.getItem(KEYS.token);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(KEYS.token, token);
    else localStorage.removeItem(KEYS.token);
  } catch {
    // ignore
  }
}

function ensureSeed() {
  if (!read(KEYS.users, null)) {
    write(KEYS.users, [
      {
        id: DEMO_ADMIN.id,
        email: DEMO_ADMIN.email,
        full_name: DEMO_ADMIN.full_name,
        password: DEMO_ADMIN.password,
        role: DEMO_ADMIN.role,
        created_date: new Date().toISOString(),
      },
    ]);
  }
  if (!read(KEYS.courses, null)) write(KEYS.courses, DEMO_COURSES);
  if (!read(KEYS.bundles, null)) write(KEYS.bundles, DEMO_BUNDLES);
  if (!read(KEYS.internships, null)) write(KEYS.internships, DEMO_INTERNSHIPS);
  if (!read(KEYS.liveClasses, null)) write(KEYS.liveClasses, DEMO_LIVE_CLASSES);
  if (!read(KEYS.enrollments, null)) write(KEYS.enrollments, []);
  if (!read(KEYS.payments, null)) write(KEYS.payments, []);
  if (!read(KEYS.tickets, null)) write(KEYS.tickets, []);
  if (!read(KEYS.ticketReplies, null)) write(KEYS.ticketReplies, []);
  if (!read(KEYS.notifications, null)) write(KEYS.notifications, []);
  if (!read(KEYS.aiConversations, null)) write(KEYS.aiConversations, []);
  if (!read(KEYS.leads, null)) write(KEYS.leads, []);
  if (!read(KEYS.courseInterests, null)) write(KEYS.courseInterests, []);
  if (!read(KEYS.doubtSessions, null)) write(KEYS.doubtSessions, []);
  if (!read(KEYS.lessons, null)) {
    const all = DEMO_COURSES.flatMap((c) => lessonsForCourse(c));
    write(KEYS.lessons, all);
  }
  if (!read(KEYS.quizzes, null)) write(KEYS.quizzes, []);
  if (!read(KEYS.resources, null)) write(KEYS.resources, []);
  if (!read(KEYS.certificates, null)) write(KEYS.certificates, []);
}

ensureSeed();

function publicUser(u) {
  if (!u) return null;
  const { password: _p, ...rest } = u;
  return rest;
}

function currentUser() {
  const token = getToken();
  if (!token) return null;
  const users = read(KEYS.users, []);
  return users.find((u) => u.id === token || u.email === token) || null;
}

function requireUser() {
  const u = currentUser();
  if (!u) {
    const err = new Error("Not authenticated");
    err.status = 401;
    throw err;
  }
  return u;
}

function sortList(list, sort) {
  if (!sort) return [...list];
  const desc = String(sort).startsWith("-");
  const field = desc ? String(sort).slice(1) : String(sort);
  const key =
    field === "createdAt" || field === "created_date"
      ? "created_date"
      : field === "rating"
        ? "rating"
        : field;
  return [...list].sort((a, b) => {
    const av = a[key] ?? a.createdAt ?? "";
    const bv = b[key] ?? b.createdAt ?? "";
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return desc ? -cmp : cmp;
  });
}

function apiError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  err.data = { message };
  return err;
}

export const api = {
  auth: {
    me: async () => {
      await delay();
      const u = currentUser();
      if (!u) throw apiError("Not authenticated", 401);
      return publicUser(u);
    },
    signup: async ({ email, full_name, password } = {}) => {
      await delay();
      const users = read(KEYS.users, []);
      const e = String(email || "").trim().toLowerCase();
      if (!e || !password) throw apiError("Email and password are required");
      if (users.some((u) => u.email.toLowerCase() === e)) {
        throw apiError("An account with this email already exists");
      }
      const user = {
        id: uid("user"),
        email: e,
        full_name: full_name || e.split("@")[0],
        password: String(password),
        role: "user",
        created_date: new Date().toISOString(),
      };
      users.push(user);
      write(KEYS.users, users);
      setToken(user.id);
      return publicUser(user);
    },
    register: async (body) => api.auth.signup(body),
    login: async ({ email, password } = {}) => {
      await delay();
      const users = read(KEYS.users, []);
      const e = String(email || "").trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === e && u.password === String(password));
      if (!user) throw apiError("Invalid email or password", 401);
      setToken(user.id);
      return publicUser(user);
    },
    adminLogin: async ({ email, password } = {}) => {
      await delay();
      const users = read(KEYS.users, []);
      const e = String(email || "").trim().toLowerCase();
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === e &&
          u.password === String(password) &&
          (u.role === "admin" || u.role === "teacher")
      );
      if (!user) throw apiError("Invalid admin credentials", 401);
      setToken(user.id);
      return publicUser(user);
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
    invokeLLM: async (payload) => {
      await delay(200);
      const prompt = String(payload?.prompt || payload?.message || "");
      const lower = prompt.toLowerCase();

      // Skill roadmap generator (Home → AISkillGenerator)
      if (lower.includes("learning roadmap") || lower.includes('"steps"')) {
        const skillMatch = prompt.match(/learn:\s*"([^"]+)"/i);
        const skill = skillMatch?.[1] || "your skill";
        return {
          skill,
          timeline: "8–12 weeks",
          summary: `${skill} is a high-demand skill — this roadmap gets you job-ready with focused practice.`,
          steps: [
            {
              step: 1,
              title: "Foundations",
              topics: ["Core concepts", "Terminology", "Setup"],
              duration: "1–2 weeks",
              tip: "Practice 30 minutes daily and take short notes.",
            },
            {
              step: 2,
              title: "Core skills",
              topics: ["Hands-on drills", "Common patterns", "Mini exercises"],
              duration: "2–3 weeks",
              tip: "Build tiny examples after each concept.",
            },
            {
              step: 3,
              title: "Projects",
              topics: ["Portfolio project", "Debugging", "Best practices"],
              duration: "2–3 weeks",
              tip: "Ship one small public demo you can show employers.",
            },
            {
              step: 4,
              title: "Polish & apply",
              topics: ["Interview prep", "Resume bullets", "Next steps"],
              duration: "1–2 weeks",
              tip: "Explain your project out loud — it locks in learning.",
            },
          ],
        };
      }

      // Course relevance checker
      if (lower.includes("relevance checker") || lower.includes('"relevant"')) {
        return { relevant: true };
      }

      // Practice questions
      if (lower.includes("practice questions") || lower.includes("conceptual")) {
        return {
          conceptual: "Explain the main idea of this lesson in your own words.",
          practical: "Write a short example that applies what you just learned.",
          mcq: {
            question: "Which statement best matches this lesson?",
            options: {
              a: "It is unrelated to the topic",
              b: "It builds on the core concept taught here",
              c: "It only covers history",
              d: "It requires no practice",
            },
            answer: "b",
          },
        };
      }

      // Chat replies — return a plain string (AIChat stores content: response)
      return `Great question! Here's a clear takeaway:\n\n• Start with the core idea\n• Try a tiny example yourself\n• Review once more to lock it in\n\n(This AI tutor runs fully in your browser — no backend.)`;
    },
    sendEmail: async () => {
      await delay();
      return { ok: true };
    },
    uploadFile: async ({ file }) => {
      await delay();
      const name = file?.name || "file";
      return {
        file_url: `https://placehold.co/600x400?text=${encodeURIComponent(name)}`,
      };
    },
  },

  users: {
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.users, []).map(publicUser);
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const users = read(KEYS.users, []);
      const i = users.findIndex((u) => u.id === id);
      if (i < 0) throw apiError("User not found", 404);
      users[i] = { ...users[i], ...data, id: users[i].id, email: users[i].email };
      write(KEYS.users, users);
      return publicUser(users[i]);
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.users,
        read(KEYS.users, []).filter((u) => u.id !== id)
      );
      return { ok: true };
    },
    inviteUser: async (email, role) => {
      await delay();
      requireUser();
      const users = read(KEYS.users, []);
      const e = String(email || "").trim().toLowerCase();
      if (users.some((u) => u.email.toLowerCase() === e)) throw apiError("User already exists");
      const user = {
        id: uid("user"),
        email: e,
        full_name: e.split("@")[0],
        password: "changeme",
        role: role || "user",
        created_date: new Date().toISOString(),
      };
      users.push(user);
      write(KEYS.users, users);
      return publicUser(user);
    },
  },

  courses: {
    list: async (sort, limit, instructor) => {
      await delay();
      let list = read(KEYS.courses, DEMO_COURSES);
      if (instructor) {
        list = list.filter((c) => String(c.instructor || "") === String(instructor));
      }
      list = sortList(list, sort || "-createdAt");
      if (limit) list = list.slice(0, Number(limit));
      return list;
    },
    getById: async (id) => {
      await delay();
      const c = read(KEYS.courses, DEMO_COURSES).find((x) => x.id === id);
      if (!c) throw apiError("Course not found", 404);
      return c;
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.courses, []);
      const course = {
        ...data,
        id: uid("course"),
        status: data.status || "published",
        created_date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      list.unshift(course);
      write(KEYS.courses, list);
      return course;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.courses, []);
      const i = list.findIndex((c) => c.id === id);
      if (i < 0) throw apiError("Course not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.courses, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.courses,
        read(KEYS.courses, []).filter((c) => c.id !== id)
      );
      return { ok: true };
    },
  },

  bundles: {
    list: async (sort, limit) => {
      await delay();
      let list = sortList(read(KEYS.bundles, DEMO_BUNDLES), sort || "-createdAt");
      if (limit) list = list.slice(0, Number(limit));
      return list;
    },
    getById: async (id) => {
      await delay();
      const b = read(KEYS.bundles, DEMO_BUNDLES).find((x) => x.id === id);
      if (!b) throw apiError("Bundle not found", 404);
      return { ...b, courses: b.course_ids || b.courses || [] };
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.bundles, []);
      const ids = data.course_ids || data.courses || [];
      const bundle = {
        ...data,
        id: uid("bundle"),
        course_ids: ids,
        courses: ids,
        name: data.name || data.title || "Bundle",
        title: data.title || data.name || "Bundle",
        created_date: new Date().toISOString(),
      };
      list.unshift(bundle);
      write(KEYS.bundles, list);
      return bundle;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.bundles, []);
      const i = list.findIndex((b) => b.id === id);
      if (i < 0) throw apiError("Bundle not found", 404);
      const ids = data.course_ids || data.courses || list[i].course_ids;
      list[i] = { ...list[i], ...data, id, course_ids: ids, courses: ids };
      write(KEYS.bundles, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.bundles,
        read(KEYS.bundles, []).filter((b) => b.id !== id)
      );
      return { ok: true };
    },
  },

  internships: {
    list: async () => {
      await delay();
      return read(KEYS.internships, DEMO_INTERNSHIPS);
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.internships, []);
      const row = { ...data, id: uid("intern") };
      list.unshift(row);
      write(KEYS.internships, list);
      return row;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.internships, []);
      const i = list.findIndex((x) => x.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.internships, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.internships,
        read(KEYS.internships, []).filter((x) => x.id !== id)
      );
      return { ok: true };
    },
  },

  liveClasses: {
    list: async () => {
      await delay();
      return read(KEYS.liveClasses, DEMO_LIVE_CLASSES);
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.liveClasses, []);
      const row = { ...data, id: uid("live") };
      list.unshift(row);
      write(KEYS.liveClasses, list);
      return row;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.liveClasses, []);
      const i = list.findIndex((x) => x.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.liveClasses, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.liveClasses,
        read(KEYS.liveClasses, []).filter((x) => x.id !== id)
      );
      return { ok: true };
    },
  },

  supportTickets: {
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.tickets, []);
    },
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.tickets, []).filter((t) => t.user_email === u.email || t.user_id === u.id);
    },
    create: async (data) => {
      await delay();
      const u = requireUser();
      const list = read(KEYS.tickets, []);
      const row = {
        ...data,
        id: uid("ticket"),
        user_email: u.email,
        user_id: u.id,
        status: data.status || "open",
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.tickets, list);
      return row;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.tickets, []);
      const i = list.findIndex((t) => t.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.tickets, list);
      return list[i];
    },
    replies: async (ticket_id) => {
      await delay();
      const all = read(KEYS.ticketReplies, []);
      return ticket_id ? all.filter((r) => r.ticket_id === ticket_id) : all;
    },
    reply: async (data) => {
      await delay();
      const u = requireUser();
      const list = read(KEYS.ticketReplies, []);
      const row = {
        ...data,
        id: uid("reply"),
        author_email: u.email,
        created_date: new Date().toISOString(),
      };
      list.push(row);
      write(KEYS.ticketReplies, list);
      return row;
    },
  },

  notifications: {
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.notifications, []).filter((n) => n.user_id === u.id || n.user_email === u.email);
    },
    markRead: async (id) => {
      await delay();
      requireUser();
      const list = read(KEYS.notifications, []);
      const i = list.findIndex((n) => n.id === id);
      if (i >= 0) {
        list[i] = { ...list[i], read: true };
        write(KEYS.notifications, list);
      }
      return list[i] || { ok: true };
    },
    markAllRead: async () => {
      await delay();
      const u = requireUser();
      const list = read(KEYS.notifications, []).map((n) =>
        n.user_id === u.id || n.user_email === u.email ? { ...n, read: true } : n
      );
      write(KEYS.notifications, list);
      return { ok: true };
    },
    create: async (data) => {
      await delay();
      const list = read(KEYS.notifications, []);
      const row = { ...data, id: uid("notif"), read: false, created_date: new Date().toISOString() };
      list.unshift(row);
      write(KEYS.notifications, list);
      return row;
    },
  },

  aiConversations: {
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.aiConversations, []).filter((c) => c.user_id === u.id || c.user_email === u.email);
    },
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.aiConversations, []);
    },
    create: async (data) => {
      await delay();
      const u = currentUser();
      const list = read(KEYS.aiConversations, []);
      const row = {
        ...data,
        id: uid("ai"),
        user_id: u?.id,
        user_email: u?.email,
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.aiConversations, list);
      return row;
    },
  },

  enrollments: {
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.enrollments, []);
    },
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.enrollments, []).filter((e) => e.user_id === u.id || e.user_email === u.email);
    },
    create: async ({ course_id }) => {
      await delay();
      const u = requireUser();
      const list = read(KEYS.enrollments, []);
      const existing = list.find(
        (e) => e.course_id === course_id && (e.user_id === u.id || e.user_email === u.email)
      );
      if (existing) return existing;
      const course = read(KEYS.courses, DEMO_COURSES).find((c) => c.id === course_id);
      const row = {
        id: uid("enroll"),
        course_id,
        course_title: course?.title || "",
        user_id: u.id,
        user_email: u.email,
        progress: 0,
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.enrollments, list);
      return row;
    },
    updateProgress: async (id, progress) => {
      await delay();
      requireUser();
      const list = read(KEYS.enrollments, []);
      const i = list.findIndex((e) => e.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], progress };
      write(KEYS.enrollments, list);
      return list[i];
    },
  },

  payments: {
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.payments, []);
    },
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.payments, []).filter((p) => p.user_id === u.id || p.user_email === u.email);
    },
    createCoursePayment: async ({ course_id, amount }) => {
      await delay();
      const u = requireUser();
      const list = read(KEYS.payments, []);
      const row = {
        id: uid("pay"),
        type: "course",
        course_id,
        amount: Number(amount) || 0,
        status: "completed",
        user_id: u.id,
        user_email: u.email,
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.payments, list);
      return row;
    },
    createBundlePurchase: async ({ bundle_id }) => {
      await delay();
      const u = requireUser();
      const bundle = read(KEYS.bundles, DEMO_BUNDLES).find((b) => b.id === bundle_id);
      const list = read(KEYS.payments, []);
      const row = {
        id: uid("pay"),
        type: "bundle",
        bundle_id,
        amount: bundle?.price || 0,
        status: "completed",
        user_id: u.id,
        user_email: u.email,
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.payments, list);
      return row;
    },
    updateStatus: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.payments, []);
      const i = list.findIndex((p) => p.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.payments, list);
      return list[i];
    },
  },

  leads: {
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.leads, []);
    },
    create: async (data) => {
      await delay();
      const list = read(KEYS.leads, []);
      const row = { ...data, id: uid("lead"), created_date: new Date().toISOString() };
      list.unshift(row);
      write(KEYS.leads, list);
      return row;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.leads, []);
      const i = list.findIndex((l) => l.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.leads, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.leads,
        read(KEYS.leads, []).filter((l) => l.id !== id)
      );
      return { ok: true };
    },
  },

  courseInterests: {
    list: async () => {
      await delay();
      requireUser();
      return read(KEYS.courseInterests, []);
    },
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.courseInterests, []).filter((i) => i.user_id === u.id);
    },
    track: async (data) => {
      await delay();
      const u = currentUser();
      const list = read(KEYS.courseInterests, []);
      const row = {
        ...data,
        id: uid("interest"),
        user_id: u?.id,
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.courseInterests, list);
      return row;
    },
  },

  doubtSessions: {
    list: async (teacher_email) => {
      await delay();
      let list = read(KEYS.doubtSessions, []);
      if (teacher_email) list = list.filter((d) => d.teacher_email === teacher_email);
      return list;
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.doubtSessions, []);
      const row = { ...data, id: uid("doubt"), status: data.status || "scheduled" };
      list.unshift(row);
      write(KEYS.doubtSessions, list);
      return row;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.doubtSessions, []);
      const i = list.findIndex((d) => d.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.doubtSessions, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.doubtSessions,
        read(KEYS.doubtSessions, []).filter((d) => d.id !== id)
      );
      return { ok: true };
    },
  },

  lessons: {
    listByCourse: async (courseId) => {
      await delay();
      return read(KEYS.lessons, []).filter((l) => l.course_id === courseId);
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.lessons, []);
      const row = { ...data, id: uid("lesson") };
      list.push(row);
      write(KEYS.lessons, list);
      return row;
    },
    update: async (id, data) => {
      await delay();
      requireUser();
      const list = read(KEYS.lessons, []);
      const i = list.findIndex((l) => l.id === id);
      if (i < 0) throw apiError("Not found", 404);
      list[i] = { ...list[i], ...data, id };
      write(KEYS.lessons, list);
      return list[i];
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.lessons,
        read(KEYS.lessons, []).filter((l) => l.id !== id)
      );
      return { ok: true };
    },
  },

  quizzes: {
    listByCourse: async (courseId) => {
      await delay();
      return read(KEYS.quizzes, []).filter((q) => q.course_id === courseId);
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.quizzes, []);
      const row = { ...data, id: uid("quiz") };
      list.push(row);
      write(KEYS.quizzes, list);
      return row;
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.quizzes,
        read(KEYS.quizzes, []).filter((q) => q.id !== id)
      );
      return { ok: true };
    },
  },

  resources: {
    listByCourse: async (courseId) => {
      await delay();
      return read(KEYS.resources, []).filter((r) => r.course_id === courseId);
    },
    create: async (data) => {
      await delay();
      requireUser();
      const list = read(KEYS.resources, []);
      const row = { ...data, id: uid("res") };
      list.push(row);
      write(KEYS.resources, list);
      return row;
    },
    delete: async (id) => {
      await delay();
      requireUser();
      write(
        KEYS.resources,
        read(KEYS.resources, []).filter((r) => r.id !== id)
      );
      return { ok: true };
    },
  },

  certificates: {
    mine: async () => {
      await delay();
      const u = requireUser();
      return read(KEYS.certificates, []).filter((c) => c.user_id === u.id || c.user_email === u.email);
    },
    create: async (data) => {
      await delay();
      const u = requireUser();
      const list = read(KEYS.certificates, []);
      const row = {
        ...data,
        id: uid("cert"),
        user_id: u.id,
        user_email: u.email,
        created_date: new Date().toISOString(),
      };
      list.unshift(row);
      write(KEYS.certificates, list);
      return row;
    },
  },

  appLogs: {
    logUserInApp: async () => {
      await delay(10);
      return { ok: true };
    },
  },
};

export default api;

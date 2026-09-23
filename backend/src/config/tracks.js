export const INTERNSHIP_TRACKS = [
  { id: "intern-development", title: "Development" },
  { id: "intern-ai-prompt", title: "AI & Prompt Engineering" },
  { id: "intern-business-analytics", title: "Business Analytics" },
  { id: "intern-digital-marketing", title: "Advanced Digital Marketing" },
];

export const LIVE_CLASS_TYPES = ["lecture", "doubt_session", "workshop", "webinar", "mock_interview"];

export function getTrack(trackId) {
  return INTERNSHIP_TRACKS.find((t) => t.id === String(trackId || "").trim()) || null;
}

export function enrollmentMatchesTrack(enrollment, track) {
  if (!track) return false;
  const id = String(enrollment?.itemId || "").toLowerCase();
  const title = String(enrollment?.itemTitle || "").toLowerCase();
  const trackTitle = track.title.toLowerCase();
  return id === track.id.toLowerCase() || title === trackTitle || title.includes(trackTitle);
}

export function dayBounds(dateInput) {
  const d = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput || Date.now());
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

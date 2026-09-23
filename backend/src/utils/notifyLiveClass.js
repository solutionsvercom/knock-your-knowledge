import { Enrollment } from "../models/Enrollment.js";
import { Notification } from "../models/Notification.js";
import { dayBounds, enrollmentMatchesTrack } from "../config/tracks.js";

export async function notifyStudentsForLiveClass(track, liveClass) {
  const enrollments = await Enrollment.find({ status: "paid" }).lean();
  const emails = new Set();

  for (const e of enrollments) {
    if (enrollmentMatchesTrack(e, track) && e.studentEmail) {
      emails.add(String(e.studentEmail).toLowerCase());
    }
  }

  if (emails.size === 0) {
    for (const e of enrollments) {
      if (e.studentEmail) emails.add(String(e.studentEmail).toLowerCase());
    }
  }

  const { start } = dayBounds(liveClass.date);
  await Notification.deleteMany({
    trackId: track.id,
    type: "session",
    isRead: false,
    createdAt: { $gte: start },
  });

  const when = new Date(liveClass.date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const title = `Today's ${track.title} class`;
  const message = `${liveClass.title} · ${when}${
    liveClass.meetLink ? ` · Join link is in your dashboard` : ""
  }`;

  const docs = [...emails].map((userEmail) => ({
    userEmail,
    title,
    message,
    type: "session",
    isRead: false,
    senderName: "KYK Admin",
    trackId: track.id,
    liveClassId: String(liveClass._id),
    meetLink: liveClass.meetLink || "",
  }));

  if (docs.length) {
    await Notification.insertMany(docs);
  }

  return docs.length;
}

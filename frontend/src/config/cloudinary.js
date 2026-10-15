import { apiUrl } from "@/config/api";

/** Public Cloudinary cloud name (safe to expose). Prefer runtime API, then Vite env. */
export const VITE_CLOUDINARY_CLOUD_NAME = String(
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
).trim();

export const CLOUDINARY_COURSES_FOLDER = "kyk/courses";

export function cloudinaryVideoUrl(publicId, cloudName = VITE_CLOUDINARY_CLOUD_NAME) {
  const cloud = String(cloudName || "").trim();
  const id = String(publicId || "").replace(/^\/+|\/+$/g, "");
  if (!cloud || !id) return "";
  return `https://res.cloudinary.com/${cloud}/video/upload/q_auto,f_auto/${id}`;
}

export async function fetchCloudinaryStatus() {
  try {
    const res = await fetch(apiUrl("/cloudinary/status"));
    const data = await res.json().catch(() => ({}));
    return {
      ready: Boolean(data?.ready && data?.cloudName),
      cloudName: String(data?.cloudName || VITE_CLOUDINARY_CLOUD_NAME || "").trim(),
    };
  } catch {
    return {
      ready: Boolean(VITE_CLOUDINARY_CLOUD_NAME),
      cloudName: VITE_CLOUDINARY_CLOUD_NAME,
    };
  }
}

export async function uploadCourseVideoToCloudinary({ file, publicId, folder, sign }) {
  if (!file) throw new Error("Choose a video file first.");
  const payload = sign;
  if (!payload?.cloudName || !payload?.signature || !payload?.apiKey) {
    throw new Error("Cloudinary is not configured on the server.");
  }
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", payload.apiKey);
  body.append("timestamp", String(payload.timestamp));
  body.append("signature", payload.signature);
  if (payload.folder) body.append("folder", payload.folder);
  if (payload.publicId) body.append("public_id", payload.publicId);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${payload.cloudName}/video/upload`, {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed.");
  }
  return {
    url: data.secure_url || data.url || "",
    publicId: data.public_id || publicId || "",
    folder: folder || payload.folder || "",
  };
}

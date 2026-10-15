import crypto from "node:crypto";

export function cloudinaryCloudName() {
  return String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
}

export function cloudinaryConfigured() {
  return Boolean(
    cloudinaryCloudName() &&
      String(process.env.CLOUDINARY_API_KEY || "").trim() &&
      String(process.env.CLOUDINARY_API_SECRET || "").trim()
  );
}

export function signCloudinaryUpload({ folder, publicId } = {}) {
  const cloudName = cloudinaryCloudName();
  const apiKey = String(process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = String(process.env.CLOUDINARY_API_SECRET || "").trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp };
  if (folder) params.folder = folder;
  if (publicId) params.public_id = publicId;

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder: folder || "",
    publicId: publicId || "",
  };
}

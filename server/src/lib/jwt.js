import jwt from "jsonwebtoken";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s === "dev_secret_change_me") {
    if (process.env.NODE_ENV === "production") {
      console.error("FATAL: Set JWT_SECRET in server/.env for production.");
    }
  }
  return s || "dev_secret_change_me";
};

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "30d" });
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}


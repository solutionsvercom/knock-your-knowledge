import mongoose from "mongoose";
import { verifyToken } from "../lib/jwt.js";
import { User } from "../models/User.js";

function parseBearer(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

async function loadUser(req, token) {
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    err.code = "INVALID_TOKEN";
    throw err;
  }
  if (!decoded?.sub) {
    const err = new Error("Invalid token payload");
    err.status = 401;
    err.code = "INVALID_TOKEN";
    throw err;
  }
  if (!mongoose.isValidObjectId(decoded.sub)) {
    const err = new Error("Invalid token payload");
    err.status = 401;
    err.code = "INVALID_TOKEN";
    throw err;
  }
  let user;
  try {
    user = await User.findById(decoded.sub);
  } catch (e) {
    if (e?.name === "CastError") {
      const err = new Error("Invalid token payload");
      err.status = 401;
      err.code = "INVALID_TOKEN";
      throw err;
    }
    throw e;
  }
  if (!user) {
    const err = new Error("User no longer exists");
    err.status = 401;
    err.code = "USER_NOT_FOUND";
    throw err;
  }
  req.user = user.toJSON();
}

export const authMiddleware = {
  required: async (req, _res, next) => {
    try {
      const token = parseBearer(req);
      if (!token) {
        const err = new Error("Unauthorized");
        err.status = 401;
        throw err;
      }
      await loadUser(req, token);
      next();
    } catch (e) {
      next(e);
    }
  },
  optional: async (req, _res, next) => {
    try {
      const token = parseBearer(req);
      if (token) await loadUser(req, token);
      next();
    } catch (e) {
      next(e);
    }
  },
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) {
    const err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }
  if (!roles.includes(req.user.role)) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  return next();
};


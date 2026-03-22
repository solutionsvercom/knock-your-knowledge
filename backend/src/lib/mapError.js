/**
 * Turn Mongo / Mongoose failures into clearer HTTP errors (avoid opaque 500s).
 */
export function mapDbError(err) {
  if (!err || typeof err !== "object") return err;
  const name = err.name;
  const code = err.code;

  if (
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoExpiredSessionError" ||
    name === "MongoWaitQueueTimeoutError"
  ) {
    const e = new Error(
      "Database not reachable. Start MongoDB locally or fix MONGODB_URI in backend/.env"
    );
    e.status = 503;
    e.code = "DB_UNAVAILABLE";
    e.detail = err.message;
    return e;
  }

  if (name === "MongooseError" && /buffering timed out/i.test(String(err.message))) {
    const e = new Error(
      "Database not reachable. Start MongoDB locally or fix MONGODB_URI in backend/.env"
    );
    e.status = 503;
    e.code = "DB_UNAVAILABLE";
    e.detail = err.message;
    return e;
  }

  if (name === "MongoServerError" && code === 11000) {
    const e = new Error("Duplicate key");
    e.status = 409;
    e.code = "DUPLICATE";
    return e;
  }

  if (name === "CastError") {
    const e = new Error(err.message || "Invalid id or value");
    e.status = 400;
    e.code = "CAST_ERROR";
    return e;
  }

  if (name === "ValidationError") {
    const e = new Error(err.message || "Validation failed");
    e.status = 400;
    e.code = "VALIDATION_ERROR";
    return e;
  }

  const msg = String(err.message || "");
  if (
    /not connected|connection.*closed|topology.*destroyed|ECONNREFUSED|ETIMEDOUT|getaddrinfo|MongoNetworkError/i.test(
      msg
    ) ||
    /Server selection timed out|connection timed out/i.test(msg)
  ) {
    const e = new Error(
      "Database not reachable. Check MONGODB_URI, network, and Atlas IP allowlist (0.0.0.0/0 for testing)."
    );
    e.status = 503;
    e.code = "DB_UNAVAILABLE";
    e.detail = msg;
    return e;
  }

  return err;
}

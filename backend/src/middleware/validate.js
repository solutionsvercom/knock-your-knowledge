import { z, ZodError } from "zod";

export const validate =
  ({ body, params, query }) =>
  (req, _res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const first = e.issues[0];
        const msg = first?.message || "Validation failed";
        const err = new Error(msg);
        err.status = 400;
        err.code = "VALIDATION_ERROR";
        err.details = e.issues;
        return next(err);
      }
      return next(e);
    }
  };


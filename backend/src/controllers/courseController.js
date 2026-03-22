import { courseService } from "../services/courseService.js";

export const courseController = {
  list: async (req, res, next) => {
    try {
      const docs = await courseService.list(req.query);
      if (!Array.isArray(docs)) {
        const err = new Error("Invalid courses query result");
        err.status = 500;
        throw err;
      }
      const payload = docs.map((d) => d.toJSON());
      res.json(payload);
    } catch (e) {
      next(e);
    }
  },
  getById: async (req, res, next) => {
    try {
      const doc = await courseService.getById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Course not found" });
      res.json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  create: async (req, res, next) => {
    try {
      const doc = await courseService.create(req.body);
      res.status(201).json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const doc = await courseService.update(req.params.id, req.body);
      res.json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      await courseService.remove(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
};


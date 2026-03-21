import { Bundle } from "../models/Bundle.js";
import { bundleService } from "../services/bundleService.js";

function bundleDetailJson(doc) {
  const courses = (doc.course_ids || []).map((c) => (c && c.toJSON ? c.toJSON() : c));
  const plain = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(doc._id),
    name: plain.name || plain.title,
    title: plain.title || plain.name,
    description: plain.description || "",
    price: plain.price ?? 0,
    status: plain.status || "published",
    course_ids: courses.map((c) => c.id || String(c._id)),
    courses,
    created_date: doc.createdAt,
    updated_date: doc.updatedAt,
  };
}

export const bundleController = {
  list: async (req, res, next) => {
    try {
      const docs = await bundleService.list(req.query);
      res.json(docs.map((d) => d.toJSON()));
    } catch (e) {
      next(e);
    }
  },
  getById: async (req, res, next) => {
    try {
      const doc = await Bundle.findById(req.params.id).populate({
        path: "course_ids",
        model: "Course",
      });
      if (!doc) return res.status(404).json({ message: "Bundle not found" });
      res.json(bundleDetailJson(doc));
    } catch (e) {
      next(e);
    }
  },
  create: async (req, res, next) => {
    try {
      const doc = await bundleService.create(req.body);
      res.status(201).json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const doc = await bundleService.update(req.params.id, req.body);
      res.json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      await bundleService.remove(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
};


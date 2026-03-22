import { Bundle } from "../models/Bundle.js";
import mongoose from "mongoose";
import { listQueryLimit, listQuerySort } from "../lib/querySort.js";

function normalizeBundlePayload(body, partial = false) {
  const { courses, course_ids, ...rest } = body || {};
  const hasIds = Object.prototype.hasOwnProperty.call(body || {}, "courses") ||
    Object.prototype.hasOwnProperty.call(body || {}, "course_ids");
  const ids = courses !== undefined ? courses : course_ids;
  const out = { ...rest };
  if (hasIds && Array.isArray(ids)) {
    out.course_ids = ids.filter(Boolean).map((id) => new mongoose.Types.ObjectId(id));
  } else if (!partial && !hasIds) {
    out.course_ids = [];
  }
  if (out.name && !out.title) out.title = out.name;
  if (out.title && !out.name) out.name = out.title;
  delete out.courses;
  return out;
}

const BUNDLE_SORT_FIELDS = ["createdAt", "updatedAt", "price", "name", "title"];

export const bundleService = {
  list: async (query = {}) => {
    const sort = listQuerySort(query.sort, BUNDLE_SORT_FIELDS);
    const limit = listQueryLimit(query.limit);
    const q = Bundle.find({}).sort(sort);
    if (limit) q.limit(limit);
    return q.exec();
  },
  getById: (id) => Bundle.findById(id),
  create: (data) => Bundle.create(normalizeBundlePayload(data)),
  update: async (id, data) => {
    const payload = normalizeBundlePayload(data, true);
    const doc = await Bundle.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!doc) {
      const err = new Error("Bundle not found");
      err.status = 404;
      throw err;
    }
    return doc;
  },
  remove: async (id) => {
    const doc = await Bundle.findByIdAndDelete(id);
    if (!doc) {
      const err = new Error("Bundle not found");
      err.status = 404;
      throw err;
    }
    return true;
  },
};


import { Course } from "../models/Course.js";
import { listQueryLimit, listQuerySort } from "../lib/querySort.js";

const COURSE_SORT_FIELDS = ["createdAt", "updatedAt", "rating", "title", "price"];

export const courseService = {
  list: async (query = {}) => {
    const { instructor } = query;
    const sort = listQuerySort(query.sort, COURSE_SORT_FIELDS);
    const limit = listQueryLimit(query.limit);
    const filter = {};
    if (instructor) filter.instructor = String(instructor);
    // Omit heavy / risky fields for list (bad `modules` data can break JSON serialization → 500)
    const q = Course.find(filter).sort(sort).select("-modules");
    if (limit) q.limit(limit);
    return q.exec();
  },
  getById: (id) => Course.findById(id),
  create: (data) => Course.create(data),
  update: async (id, data) => {
    const doc = await Course.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!doc) {
      const err = new Error("Course not found");
      err.status = 404;
      throw err;
    }
    return doc;
  },
  remove: async (id) => {
    const doc = await Course.findByIdAndDelete(id);
    if (!doc) {
      const err = new Error("Course not found");
      err.status = 404;
      throw err;
    }
    return true;
  },
};


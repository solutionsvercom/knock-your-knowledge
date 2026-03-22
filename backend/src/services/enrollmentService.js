import { Enrollment } from "../models/Enrollment.js";
import { Course } from "../models/Course.js";
import mongoose from "mongoose";

export const enrollmentService = {
  listAll: () => Enrollment.find({}).sort({ createdAt: -1 }),
  listForStudent: (email) => Enrollment.find({ student_email: email }).sort({ createdAt: -1 }),
  enrollInCourse: async ({ student_email, course_id }) => {
    const course = await Course.findById(course_id);
    if (!course) {
      const err = new Error("Course not found");
      err.status = 404;
      throw err;
    }
    const existing = await Enrollment.findOne({ student_email, course_id: new mongoose.Types.ObjectId(course_id) });
    if (existing) return existing;
    return Enrollment.create({
      student_email,
      course_id: course._id,
      course_title: course.title,
      progress: 0,
      status: "active",
    });
  },
  updateProgress: async ({ id, progress }) => {
    const doc = await Enrollment.findByIdAndUpdate(
      id,
      { $set: { progress, updatedAt: new Date() } },
      { new: true }
    );
    if (!doc) {
      const err = new Error("Enrollment not found");
      err.status = 404;
      throw err;
    }
    return doc;
  },
};


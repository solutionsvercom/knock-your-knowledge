import { Payment } from "../models/Payment.js";
import { Course } from "../models/Course.js";
import { Bundle } from "../models/Bundle.js";
import mongoose from "mongoose";
import { enrollmentService } from "./enrollmentService.js";

export const paymentService = {
  listAll: () => Payment.find({}).sort({ createdAt: -1 }),
  listForStudent: (email) => Payment.find({ student_email: email }).sort({ createdAt: -1 }),
  updateStatus: async (id, status) => {
    const doc = await Payment.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!doc) {
      const err = new Error("Payment not found");
      err.status = 404;
      throw err;
    }
    return doc;
  },
  createCoursePayment: async ({ student_email, course_id, amount }) => {
    const course = await Course.findById(course_id);
    if (!course) {
      const err = new Error("Course not found");
      err.status = 404;
      throw err;
    }
    return Payment.create({
      student_email,
      course_id: new mongoose.Types.ObjectId(course_id),
      amount: amount ?? course.price ?? 0,
      status: "completed",
    });
  },

  /** Split bundle price across courses; record payments + enroll in each course */
  createBundlePurchase: async ({ student_email, bundle_id }) => {
    const bundle = await Bundle.findById(bundle_id).populate("course_ids");
    if (!bundle) {
      const err = new Error("Bundle not found");
      err.status = 404;
      throw err;
    }
    const courseDocs = (bundle.course_ids || []).filter(Boolean);
    if (courseDocs.length === 0) {
      const err = new Error("Bundle has no courses");
      err.status = 400;
      throw err;
    }
    const total = Number(bundle.price) || 0;
    const n = courseDocs.length;
    const share = n > 0 ? Math.floor((total / n) * 100) / 100 : 0;
    let paid = 0;
    const payments = [];
    for (let i = 0; i < n; i++) {
      const cid = courseDocs[i]._id;
      const amount = i === n - 1 ? Math.round((total - paid) * 100) / 100 : share;
      paid += amount;
      const p = await Payment.create({
        student_email,
        course_id: cid,
        amount,
        status: "completed",
      });
      payments.push(p);
      await enrollmentService.enrollInCourse({
        student_email,
        course_id: String(cid),
      });
    }
    return { bundle_id: String(bundle._id), payments: payments.map((p) => p.toJSON()) };
  },
};


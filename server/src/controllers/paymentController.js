import { paymentService } from "../services/paymentService.js";

export const paymentController = {
  listAll: async (_req, res, next) => {
    try {
      const docs = await paymentService.listAll();
      res.json(docs.map((d) => d.toJSON()));
    } catch (e) {
      next(e);
    }
  },
  listMine: async (req, res, next) => {
    try {
      const docs = await paymentService.listForStudent(req.user.email);
      res.json(docs.map((d) => d.toJSON()));
    } catch (e) {
      next(e);
    }
  },
  createCoursePayment: async (req, res, next) => {
    try {
      const doc = await paymentService.createCoursePayment({
        student_email: req.user.email,
        course_id: req.body.course_id,
        amount: req.body.amount,
      });
      res.status(201).json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  createBundlePurchase: async (req, res, next) => {
    try {
      const result = await paymentService.createBundlePurchase({
        student_email: req.user.email,
        bundle_id: req.body.bundle_id,
      });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  },
  updateStatus: async (req, res, next) => {
    try {
      const doc = await paymentService.updateStatus(req.params.id, req.body.status);
      res.json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
};


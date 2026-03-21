import { enrollmentService } from "../services/enrollmentService.js";

export const enrollmentController = {
  listAll: async (_req, res, next) => {
    try {
      const docs = await enrollmentService.listAll();
      res.json(docs.map((d) => d.toJSON()));
    } catch (e) {
      next(e);
    }
  },
  listMine: async (req, res, next) => {
    try {
      const docs = await enrollmentService.listForStudent(req.user.email);
      res.json(docs.map((d) => d.toJSON()));
    } catch (e) {
      next(e);
    }
  },
  enroll: async (req, res, next) => {
    try {
      const doc = await enrollmentService.enrollInCourse({
        student_email: req.user.email,
        course_id: req.body.course_id,
      });
      res.status(201).json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
  updateProgress: async (req, res, next) => {
    try {
      const doc = await enrollmentService.updateProgress({
        id: req.params.id,
        progress: req.body.progress,
      });
      res.json(doc.toJSON());
    } catch (e) {
      next(e);
    }
  },
};


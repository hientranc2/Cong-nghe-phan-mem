import express from "express";
import mongoose from "mongoose";

export const createCrudRouter = (Model) => {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const documents = await Model.find();
      res.json(documents.map((doc) => doc.toJSON()));
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = req.body ?? {};
      const id = payload.id ?? payload._id ?? new mongoose.Types.ObjectId().toString();
      const created = await Model.create({ ...payload, _id: id });
      res.status(201).json(created.toJSON());
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: false });

      if (!updated) {
        return res.status(404).json({});
      }

      res.json(updated.toJSON());
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await Model.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({});
      }

      res.json({});
    } catch (error) {
      next(error);
    }
  });

  return router;
};

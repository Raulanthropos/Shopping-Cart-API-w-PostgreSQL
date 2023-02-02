import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ReviewModel from "../reviews/model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ReviewModel.create(req.body);

    res.status(201).send(id);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ReviewModel.update(
      req.body,
      {
        where: { id: req.params.reviewId },
        returning: true,
      }
    );

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ReviewModel.destroy({
      where: { id: req.params.reviewId },
    });

    if (numberOfDeletedRows) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `review with id ${req.params.reviewId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
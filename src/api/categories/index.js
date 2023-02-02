import express from "express";
import CategoriesModel from "./model.js";
import createHttpError from "http-errors";
import { Op } from "sequelize";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await CategoriesModel.create(req.body);
    res.send({ id });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/:categoryId", async (req, res, next) => {
  try {
    const category = await CategoriesModel.findByPk(req.params.categoryId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (category) {
      res.send(category);
    } else {
      next(
        createHttpError(
          404,
          `category with id ${req.params.categoryId} is not found! `
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

categoriesRouter.put("/:categoryId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await CategoriesModel.update(
      req.body,
      {
        where: { id: req.params.categoryId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404),
        `category with id ${req.params.categoryId} is not found!`
      );
    }
  } catch (error) {
    next(error);
  }
});

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await CategoriesModel.destroy({
      where: { id: req.params.categoryId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `category with id ${req.params.categoryId} is not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
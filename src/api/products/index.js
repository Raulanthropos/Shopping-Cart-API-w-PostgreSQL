import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoriesModel from "../categories/model.js";
import ReviewModel from "../reviews/model.js";
import ProductModel from "./model.js";
import ProductsCategoryModel from "./productsCategoryModel.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    if (req.body.categories) {
      await ProductsCategoryModel.bulkCreate(
        req.body.categories.map((category) => {
          return { categoryId: category, productId: id };
        })
      );
    }
    res.status(201).send(id);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    if (req.query.price)
      query.price = { [Op.between]: req.query.price.split(",") };

    const products = await ProductModel.findAll({
      where: {
        ...query,
      },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
      include: [
        {
          model: CategoriesModel,
          attributes: ["name"],
          through: { attributes: [] },
        },
        "reviews",
      ],
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.productId, {
      include: {
        model: CategoriesModel,
        attributes: ["name"],
        through: { attributes: [] },
      },
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductModel.update(
      req.body,
      {
        where: { id: req.params.productId },
        returning: true,
      }
    );

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductModel.destroy({
      where: { id: req.params.productId },
    });

    if (numberOfDeletedRows) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/:productId/category", async (req, res, next) => {
  try {
    const { id } = await ProductsCategoryModel.create({
      productId: req.params.productId,
      categoryId: req.body.categoryId,
    });
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.productId, {
      include: {
        model: ReviewModel,
        attributes: ["title", "content"],
        through: { attributes: [] },
      },
    });
    if (product) {
      res.send(product);
    } else {
      next(createHttpError(404, `Product not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
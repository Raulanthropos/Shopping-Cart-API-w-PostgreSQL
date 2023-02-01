import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import ProductsModel from "./model.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body)
    res.status(201).send({ id })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {}
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` }
    if (req.query.category) query.category = { [Op.iLike]: `%${req.query.category}%` }
    if (req.query.price_gt) query.price = { [Op.gt]: `${req.query.price_gt}` }
    if (req.query.price_gte) query.price = { [Op.gte]: `${req.query.price_gte}` }
    if (req.query.price_lt) query.price = { [Op.lt]: `${req.query.price_lt}` }
    if (req.query.price_lte) query.price = { [Op.lte]: `${req.query.price_lte}` }
    const products = await ProductsModel.findAll({
      where: { ...query },
      attributes: ["name", "category", "description", "price"],
    }) // (SELECT) pass an array for the include list
    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // (SELECT) pass an object with exclude property for the omit list
    })
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(req.body, {
      where: { id: req.params.productId },
      returning: true,
    })
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const response = await ProductsModel.destroy({ where: { id: req.params.productId } })
    console.log("This is what you deleted, it should be 1", response)
    if (response === 1) {
      res.send()
    } else {
      next(createHttpError(404, `product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default productsRouter
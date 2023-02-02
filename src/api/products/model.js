import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import CategoriesModel from "../categories/model.js";
import ProductsCategoryModel from "./productsCategoryModel.js";

const ProductModel = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

ProductModel.belongsToMany(CategoriesModel, {
    through: ProductsCategoryModel,
    foreignKey: {
        name: "productId",
        allowNull: false
    },
})
CategoriesModel.belongsToMany(ProductModel, {
    through: ProductsCategoryModel,
    foreignKey: {
        name: "categoryId",
        allowNull: false
    }
})

export default ProductModel
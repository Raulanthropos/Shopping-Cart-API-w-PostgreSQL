import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ProductModel from "../products/model.js";
import UsersModel from "../users/model.js";

const ReviewModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

UsersModel.hasMany(ReviewModel, {as: "reviews"});

ProductModel.hasMany(ReviewModel, {as: "reviews"});

ReviewModel.belongsTo(UsersModel, {
    foreignKey: "userId",
    as: "user"
});

ReviewModel.belongsTo(ProductModel, {
    foreignKey: "productId",
    as: "product"
})

export default ReviewModel;
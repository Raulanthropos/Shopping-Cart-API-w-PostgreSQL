import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
const UsersModel = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
},
  surname: {
    type: DataTypes.STRING,
    allowNull: false
},
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
});

export default UsersModel;

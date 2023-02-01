import { Sequelize } from "sequelize"

const { PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } = process.env

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
})

export const pgConnect = async () => {
  try {
    await sequelize.authenticate()
    console.log("Succesfully connected to Postgres!")
  } catch (error) {
    console.log(error)
    process.exit(1) // kills node.js process
  }
}

export const syncModels = async () => {
  await sequelize.sync({ alter: true })
  console.log("All tables successfully synchronized!")
}

export default sequelize
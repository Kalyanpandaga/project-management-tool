const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./constants");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

module.exports = sequelize;

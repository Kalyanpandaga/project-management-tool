const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectUsers = sequelize.define(
  "ProjectUsers",
  {},
  { timestamps: false }
);

module.exports = ProjectUsers;

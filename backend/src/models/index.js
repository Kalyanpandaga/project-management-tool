const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const Comment = require("./Comment");
const UserStory = require("./UserStory");
const ProjectUsers = require("./ProjectUsers");

// TASK ↔ USER
User.hasMany(Task, { foreignKey: "assignedTo", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignedToUser" });

// COMMENT ↔ USER
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

// COMMENT ↔ TASK
Task.hasMany(Comment, { foreignKey: "taskId", onDelete: "CASCADE" });
Comment.belongsTo(Task, { foreignKey: "taskId" });

// TASK ↔ PROJECT
Project.hasMany(Task, { foreignKey: "projectId", onDelete: "CASCADE" });
Task.belongsTo(Project, { foreignKey: "projectId" });

// USER STORY ↔ PROJECT
Project.hasMany(UserStory, { foreignKey: "projectId", onDelete: "CASCADE" });
UserStory.belongsTo(Project, { foreignKey: "projectId" });

// PROJECT ↔ USER (Many-to-Many)
Project.belongsToMany(User, { through: ProjectUsers });
User.belongsToMany(Project, { through: ProjectUsers });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  Comment,
  UserStory,
  ProjectUsers,
};

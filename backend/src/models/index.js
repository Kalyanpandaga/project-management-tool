const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const Comment = require("./Comment");
const UserStory = require("./UserStory");
const ProjectUsers = require("./ProjectUsers");

// Associations
User.hasMany(Task, { foreignKey: "assignedTo" });
Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignedToUser" });

User.hasMany(Comment);
Comment.belongsTo(User);

Task.hasMany(Comment);
Comment.belongsTo(Task);

Project.hasMany(Task, { foreignKey: "projectId" });
Task.belongsTo(Project, { foreignKey: "projectId" });

Project.hasMany(UserStory);
UserStory.belongsTo(Project);

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

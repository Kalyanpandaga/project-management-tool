const { Op } = require("sequelize");
const { Task, Project } = require("../models");
const createError = require("../utils/createError");

const getTaskCountByStatus = async (req, res, next) => {
  try {
    const [toDo, inProgress, done] = await Promise.all([
      Task.count({ where: { status: "To Do" } }),
      Task.count({ where: { status: "In Progress" } }),
      Task.count({ where: { status: "Done" } }),
    ]);
    res.status(200).json({ toDo, inProgress, done });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getOverdueTasks = async (req, res, next) => {
  try {
    const now = new Date();
    const overdueTasks = await Task.findAll({
      where: {
        deadline: { [Op.lt]: now },
        status: { [Op.ne]: "Done" },
      },
    });
    res.status(200).json({ overdueTasks });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getProjectProgress = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId);
    if (!project)
      return next(createError(404, "PROJECT_NOT_FOUND", "Project not found"));

    const totalTasks = await Task.count({ where: { projectId } });
    const doneTasks = await Task.count({
      where: { projectId, status: "Done" },
    });
    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    res.status(200).json({ projectId, completionPercentage });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = { getTaskCountByStatus, getOverdueTasks, getProjectProgress };

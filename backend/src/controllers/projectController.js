const { Project, User } = require("../models");
const createError = require("../utils/createError");

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json({ projects });
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "role", "email"],
          through: { attributes: [] },
        },
      ],
    });
    if (!project)
      return next(createError(404, "PROJECT_NOT_FOUND", "Project not found"));
    res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return next(createError(404, "PROJECT_NOT_FOUND", "Project not found"));

    if (name) project.name = name;
    if (description) project.description = description;
    await project.save();

    res.status(200).json({ updatedProject: project });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return next(createError(404, "PROJECT_NOT_FOUND", "Project not found"));
    await project.destroy();
    console.log("Project deleted successfully");
    res.status(204).json({ message: "Project deleted" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const assignTeamMembers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return next(createError(404, "PROJECT_NOT_FOUND", "Project not found"));

    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      return next(
        createError(400, "USER_NOT_FOUND", "One or more users not found")
      );
    }
    await project.setUsers(users); // or addUsers(users) to append
    res.status(200).json({ message: "Team members assigned" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamMembers,
};

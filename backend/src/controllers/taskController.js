const { Task, Project, User, Comment } = require("../models");
const createError = require("../utils/createError");

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, deadline, projectId, assignedTo } =
      req.body;
    const project = await Project.findByPk(projectId);
    if (!project)
      return next(createError(404, "PROJECT_NOT_FOUND", "Project not found"));

    const user = await User.findByPk(assignedTo);
    if (!user)
      return next(
        createError(404, "USER_NOT_FOUND", "Assigned user not found")
      );

    console.log(projectId);

    const task = await Task.create({
      title,
      description,
      status: status || "To Do",
      deadline,
      projectId,
      assignedTo,
    });
    console.log(task);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: Project,
          attributes: ["id", "name", "description"],
        },
        {
          model: User,
          as: "assignedToUser",
          attributes: ["id", "name", "role", "email"],
          foreignKey: "assignedTo",
        },
      ],
    });

    // Map the response to match the desired output
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline,
      project: task.Project
        ? {
            id: task.Project.id,
            name: task.Project.name,
            description: task.Project.description,
          }
        : null,
      assignedTo: task.assignedToUser
        ? {
            id: task.assignedToUser.id,
            name: task.assignedToUser.name,
            role: task.assignedToUser.role,
            email: task.assignedToUser.email,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    res.status(200).json({ tasks: formattedTasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "assignedToUser",
          attributes: ["id", "name", "role", "email"],
          foreignKey: "assignedTo",
        },
        {
          model: Project,
          attributes: ["id", "name", "description"],
        },
        {
          model: Comment,
          attributes: ["id", "content"],
          include: [
            { model: User, attributes: ["id", "name", "role", "email"] },
          ],
        },
      ],
    });
    if (!task)
      return next(createError(404, "TASK_NOT_FOUND", "Task not found"));

    // Format the response to match frontend expectations
    res.status(200).json({
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline,
        project: task.Project
          ? {
              id: task.Project.id,
              name: task.Project.name,
              description: task.Project.description,
            }
          : null,
        assignedTo: task.assignedToUser
          ? {
              id: task.assignedToUser.id,
              name: task.assignedToUser.name,
              role: task.assignedToUser.role,
              email: task.assignedToUser.email,
            }
          : null,
        comments:
          task.Comments?.map((c) => ({
            id: c.id,
            content: c.content,
            user: c.User
              ? {
                  id: c.User.id,
                  name: c.User.name,
                  role: c.User.role,
                  email: c.User.email,
                }
              : null,
            createdAt: c.createdAt,
          })) || [],
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, deadline, assignedTo } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task)
      return next(createError(404, "TASK_NOT_FOUND", "Task not found"));

    // Only Admin, Manager, or assigned developer can update
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Manager" &&
      req.user.id !== task.assignedTo
    ) {
      return next(
        createError(403, "FORBIDDEN", "Not allowed to update this task")
      );
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (deadline) task.deadline = deadline;
    if (assignedTo) task.assignedTo = assignedTo;
    await task.save();

    res.status(200).json({ updatedTask: task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task)
      return next(createError(404, "TASK_NOT_FOUND", "Task not found"));

    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return next(
        createError(403, "FORBIDDEN", "Not allowed to delete this task")
      );
    }

    await task.destroy();
    res.status(204).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task)
      return next(createError(404, "TASK_NOT_FOUND", "Task not found"));

    const comment = await Comment.create({
      content,
      taskId: task.id,
      userId: req.user.id,
    });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
  getAllTasks,
  addComment,
};

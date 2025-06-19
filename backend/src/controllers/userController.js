const { User } = require("../models");
const createError = require("../utils/createError");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user)
      return next(createError(404, "USER_NOT_FOUND", "User not found"));
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user)
      return next(createError(404, "USER_NOT_FOUND", "User not found"));

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists)
        return next(createError(400, "EMAIL_EXISTS", "Email already in use"));
    }

    if (email) user.email = email;
    if (name) user.name = name;
    await user.save();

    res.status(201).json({
      updatedUser: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return next(createError(404, "USER_NOT_FOUND", "User not found"));
    await user.destroy();
    res.status(204).json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };

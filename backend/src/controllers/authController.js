const { User } = require("../models");
const createError = require("../utils/createError");

const register = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const errorMsg = "Email already exists";
      const errorCode = "EMAIL_ALREADY_EXISTS";
      return next(createError(400, errorCode, errorMsg));
    }

    const user = await User.create({ email, password, role, name });
    const token = user.getJwt();

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const errorMsg = "Invalid credentials";
      const errorCode = "INVALID_CREDENTIALS";
      return next(createError(400, errorCode, errorMsg));
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      const errorMsg = "Invalid credentials";
      const errorCode = "INVALID_CREDENTIALS";
      return next(createError(400, errorCode, errorMsg));
    }

    const token = user.getJwt();
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getCurrentUser };

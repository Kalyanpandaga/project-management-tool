const validator = require("validator");

const validateUserRegisterData = ({ email, password, role, name }) => {
  if (!name || name.length < 3) {
    throw new Error("Name must be at least 3 characters long");
  }

  if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email is required");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be strong (min 8 chars, upper/lowercase, number, symbol)"
    );
  }

  if (!role || !["Admin", "Manager", "Developer"].includes(role)) {
    throw new Error("Role must be one of Admin, Manager, Developer");
  }
};

const validateUserLoginData = ({ email, password }) => {
  if (!email || !validator.isEmail(email)) {
    throw new Error("A valid email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};

const validateUserUpdateData = ({ email, name }) => {
  if (email && !validator.isEmail(email)) {
    throw new Error("A valid email is required");
  }
  if (name && name.length < 3) {
    throw new Error("Name must be at least 3 characters long");
  }
};

module.exports = {
  validateUserRegisterData,
  validateUserLoginData,
  validateUserUpdateData,
};

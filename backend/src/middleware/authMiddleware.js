const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { JWT_PRIVATE_KEY } = require("../config/constants");
const { User } = require("../models");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(createError(401, "UNAUTHORIZED", "Token missing"));

  const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
  const user = await User.findByPk(decoded.userId, {
    attributes: ["id", "email", "name", "role"],
  });
  if (!user) {
    console.error("user not found: ", decoded);
    const errorMsg = "User not found";
    const errorCode = "USER_NOT_FOUND";
    return next(createError(400, errorCode, errorMsg));
  }
  req.user = user;
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return next(
      createError(
        403,
        "ONLY_ADMIN_ALLOWED",
        "Only admins can perform this action"
      )
    );
  }
  next();
};

const requireAdminOrManager = (req, res, next) => {
  if (!["Admin", "Manager"].includes(req.user?.role)) {
    return next(
      createError(403, "ACCESS_DENIED", "Only Admin or Manager allowed")
    );
  }
  next();
};

const canAccessUserResource = (req, res, next) => {
  // Admins can access any user, others only their own
  if (req.user.role === "Admin" || req.user.id === req.params.id) {
    return next();
  }
  return next(
    createError(403, "FORBIDDEN", "You do not have access to this resource")
  );
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAdminOrManager,
  canAccessUserResource,
};

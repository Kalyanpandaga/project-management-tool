const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  authenticateToken,
  requireAdmin,
  canAccessUserResource,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { validateUserUpdateData } = require("../validations/validateUserData");

// List all users (Admin, Manager)
router.get("/", authenticateToken, requireAdminOrManager, getAllUsers);

// Get user by ID (Admin or self)
router.get("/:id", authenticateToken, canAccessUserResource, getUserById);

// Update user (Admin or self)
router.put(
  "/:id",
  authenticateToken,
  canAccessUserResource,
  validateRequest(validateUserUpdateData),
  updateUser
);

// Delete user (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

module.exports = router;

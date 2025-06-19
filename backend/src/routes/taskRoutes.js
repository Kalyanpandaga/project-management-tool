const express = require("express");
const router = express.Router();
const {
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
  getAllTasks,
  addComment,
} = require("../controllers/taskController");
const {
  authenticateToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  validateTaskCreateData,
  validateTaskUpdateData,
  validateCommentData,
} = require("../validations/validateTaskData");

// Create a task (Admin, Manager)
router.post(
  "/",
  authenticateToken,
  requireAdminOrManager,
  validateRequest(validateTaskCreateData),
  createTask
);

// List all tasks (Authenticated)
router.get("/", authenticateToken, getAllTasks);

// Get task details (Authenticated)
router.get("/:id", authenticateToken, getTaskById);

// Update task (Admin, Manager, Assigned Developer)
router.put(
  "/:id",
  authenticateToken,
  validateRequest(validateTaskUpdateData),
  updateTask
);

// Delete task (Admin, Manager)
router.delete("/:id", authenticateToken, requireAdminOrManager, deleteTask);

// Add comment to task (Authenticated)
router.post(
  "/:id/comments",
  authenticateToken,
  validateRequest(validateCommentData),
  addComment
);

module.exports = router;

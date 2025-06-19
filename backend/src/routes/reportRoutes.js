const express = require("express");
const router = express.Router();
const {
  getTaskCountByStatus,
  getOverdueTasks,
  getProjectProgress,
} = require("../controllers/reportController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/tasks", authenticateToken, getTaskCountByStatus);

router.get("/overdue", authenticateToken, getOverdueTasks);

router.get("/projects/:id/progress", authenticateToken, getProjectProgress);

module.exports = router;

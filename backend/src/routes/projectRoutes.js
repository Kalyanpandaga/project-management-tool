const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamMembers,
} = require("../controllers/projectController");
const {
  authenticateToken,
  requireAdminOrManager,
} = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  validateProjectCreateData,
  validateProjectUpdateData,
  validateAssignTeamData,
} = require("../validations/validateProjectData");

// Create a project (Admin, Manager)
router.post(
  "/",
  authenticateToken,
  requireAdminOrManager,
  validateRequest(validateProjectCreateData),
  createProject
);

// List all projects (Authenticated)
router.get("/", authenticateToken, getAllProjects);

// Get project details (Authenticated)
router.get("/:id", authenticateToken, getProjectById);

// Update project (Admin, Manager)
router.put(
  "/:id",
  authenticateToken,
  requireAdminOrManager,
  validateRequest(validateProjectUpdateData),
  updateProject
);

// Delete project (Admin, Manager)
router.delete("/:id", authenticateToken, requireAdminOrManager, deleteProject);

// Assign team members (Admin, Manager)
router.post(
  "/:id/assign",
  authenticateToken,
  requireAdminOrManager,
  validateRequest(validateAssignTeamData),
  assignTeamMembers
);

module.exports = router;

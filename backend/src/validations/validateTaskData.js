const validator = require("validator");

const validateTaskCreateData = ({
  title,
  status,
  deadline,
  projectId,
  assignedTo,
}) => {
  if (!title || title.length < 3) {
    throw new Error("Task title must be at least 3 characters long");
  }
  if (status && !["To Do", "In Progress", "Done"].includes(status)) {
    throw new Error("Status must be one of: To Do, In Progress, Done");
  }
  if (deadline && !validator.isISO8601(deadline)) {
    throw new Error("Deadline must be a valid ISO8601 date string");
  }
  if (!projectId) {
    throw new Error("projectId is required");
  }
  if (!assignedTo) {
    throw new Error("assignedTo is required");
  }
};

const validateTaskUpdateData = ({ title, status, deadline }) => {
  if (title && title.length < 3) {
    throw new Error("Task title must be at least 3 characters long");
  }
  if (status && !["To Do", "In Progress", "Done"].includes(status)) {
    throw new Error("Status must be one of: To Do, In Progress, Done");
  }
  if (deadline && !validator.isISO8601(deadline)) {
    throw new Error("Deadline must be a valid ISO8601 date string");
  }
};

const validateCommentData = ({ content }) => {
  if (!content || content.length < 1) {
    throw new Error("Comment content is required");
  }
};

module.exports = {
  validateTaskCreateData,
  validateTaskUpdateData,
  validateCommentData,
};

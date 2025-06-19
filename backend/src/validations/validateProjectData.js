const validator = require("validator");

const validateProjectCreateData = ({ name }) => {
  if (!name || name.length < 3) {
    throw new Error("Project name must be at least 3 characters long");
  }
};

const validateProjectUpdateData = ({ name }) => {
  if (name && name.length < 3) {
    throw new Error("Project name must be at least 3 characters long");
  }
};

const validateAssignTeamData = ({ userIds }) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds must be a non-empty array");
  }
  if (!userIds.every((id) => typeof id === "string")) {
    throw new Error("Each userId must be a string (UUID)");
  }
};

module.exports = {
  validateProjectCreateData,
  validateProjectUpdateData,
  validateAssignTeamData,
};

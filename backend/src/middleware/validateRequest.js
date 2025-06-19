const createError = require("../utils/createError");

const validateRequest = (validateFn) => {
  return (req, res, next) => {
    try {
      validateFn(req.body);
      next();
    } catch (error) {
      next(createError(400, "INVALID_INPUT_DATA", error.message));
    }
  };
};

module.exports = validateRequest;

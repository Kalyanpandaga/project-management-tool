function createError(status, resStatus, message) {
  const err = new Error(message);
  err.status = status;
  err.resStatus = resStatus;
  return err;
}

module.exports = createError;

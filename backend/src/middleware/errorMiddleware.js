const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const resStatus = err.resStatus || "INTERNAL_SERVER_ERROR";
  const message = err.message || "Something went wrong";

  res.status(status).json({
    http_status_code: status,
    res_status: resStatus,
    response: message,
  });
};

module.exports = errorMiddleware;

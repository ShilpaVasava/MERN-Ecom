const AppError = require("./AppError");

const handleError = (err, res) => {
  console.error("Error caught:", err);

  let statusCode = 500;
  let message = "Internal Server Error";
  let errors = [];

  if (err.name === "ValidationError" && err.inner) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.inner.map((e) => ({ field: e.path, message: e.message }));
  } else if (
    ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
      err.name
    )
  ) {
    statusCode = 400;
    message = "Database validation failed";
    errors = err.errors?.map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = err.statusCode || 400;
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length ? { errors } : {}),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = handleError;

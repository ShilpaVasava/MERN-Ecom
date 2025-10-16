module.exports = (err, req, res, next) => {
  console.error("Error caught:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  let details = [];
  if (err.name === "ValidationError" && err.inner) {
    details = err.inner.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.errors && Array.isArray(err.errors)) {
    details = err.errors.map((e) => e.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details.length ? { details } : {}),
  });
};

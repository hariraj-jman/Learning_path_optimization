// backend/src/middlewares/errorHandler.js

/**
 * @desc    Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific Prisma errors
  if (err.code === "P2002") {
    // Unique constraint failed
    statusCode = 409;
    message = "Duplicate field value entered.";
  }

  res.status(statusCode).json({ error: message });
};

module.exports = { errorHandler };

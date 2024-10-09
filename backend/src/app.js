// src/app.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const learningPathRoutes = require("./routes/learningPathRoutes"); // Importing learningPathRoutes
const assignmentRoutes = require("./routes/assignment");
const progressRoutes = require("./routes/progressRoutes"); // Importing progressRoutes
const errorMiddleware = require("./middlewares/errorMiddleware");
const userSkillController = require("./routes/userSkillRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // Update to your frontend's URL
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("combined")); // HTTP request logger

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/learning-paths", learningPathRoutes); // Using learningPathRoutes
app.use("/api/progress", progressRoutes);
app.use("/api/skills", userSkillController);
// Using progressRoutes
// Add more routes as needed

// Error Handling Middleware
app.use(errorMiddleware.errorHandler);

module.exports = app;

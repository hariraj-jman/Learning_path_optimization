// backend/src/routes/progressRoutes.js

const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Apply authentication middleware to all progress routes
router.use(authMiddleware);

// POST /api/progress - Create a new CourseProgress (Admin only)
router.post(
  "/",
  authorizeRoles("ADMIN"),
  progressController.createCourseProgress
);

// GET /api/progress/user/:userId - Get all CourseProgress for a user (Admin and the user themselves)
router.get(
  "/user/:userId",
  authorizeRoles("ADMIN", "EMPLOYEE"),
  progressController.getCourseProgressByUser
);

// GET /api/progress/assignment/:assignmentId/course/:courseId - Get CourseProgress by assignment and course (Admin and the user)
router.get(
  "/assignment/:assignmentId/course/:courseId",
  authorizeRoles("ADMIN", "EMPLOYEE"),
  progressController.getCourseProgressByAssignmentCourse
);

// PUT /api/progress/:id - Update CourseProgress (Admin and the user themselves)
router.put(
  "/:id",
  authorizeRoles("ADMIN", "EMPLOYEE"),
  progressController.updateCourseProgress
);

// GET /api/progress - Get all CourseProgress records (Admin only)
router.get(
  "/",
  authorizeRoles("ADMIN", "EMPLOYEE"),
  progressController.getAllCourseProgress
);

module.exports = router;

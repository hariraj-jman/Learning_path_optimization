// backend/src/routes/learningPathRoutes.js

const express = require("express");
const router = express.Router();
const learningPathController = require("../controllers/learningPathController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Apply authentication middleware to all learning path routes
router.use(authMiddleware);

// POST /api/learning-paths - Create a new learning path (Admin only)
router.post(
  "/",
  authorizeRoles("ADMIN"),
  learningPathController.createLearningPath
);

// GET /api/learning-paths - Get all learning paths (Admin and Employee)
router.get(
  "/",
  authorizeRoles("ADMIN", "EMPLOYEE"),
  learningPathController.getLearningPaths
);

// GET /api/learning-paths/:id - Get a learning path by ID (Admin and Employee)
router.get(
  "/:id",
  authorizeRoles("ADMIN", "EMPLOYEE"),
  learningPathController.getLearningPathById
);

// PUT /api/learning-paths/:id - Update a learning path by ID (Admin only)
router.put(
  "/:id",
  authorizeRoles("ADMIN"),
  learningPathController.updateLearningPath
);

// DELETE /api/learning-paths/:id - Delete a learning path by ID (Admin only)
router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  learningPathController.deleteLearningPath
);

// POST /api/learning-paths/:id/courses - Add courses to a learning path (Admin only)
router.post(
  "/:id/courses",
  authorizeRoles("ADMIN"),
  learningPathController.addCoursesToLearningPath
);

// DELETE /api/learning-paths/:learningPathId/courses/:courseId - Remove a course from a learning path (Admin only)
router.delete(
  "/:learningPathId/courses/:courseId",
  authorizeRoles("ADMIN"),
  learningPathController.removeCourseFromLearningPath
);

module.exports = router;

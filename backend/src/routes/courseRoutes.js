// src/routes/courseRoutes.js

const express = require('express');
const { createCourse, getAllCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Protected
 */
router.get('/', getAllCourses);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Protected (Admin only)
 */
router.post('/', createCourse);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update a course
 * @access  Protected (Admin only)
 */
router.put('/:id', updateCourse);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Protected (Admin only)
 */
router.delete('/:id', deleteCourse);

module.exports = router;

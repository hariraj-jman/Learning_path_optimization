// src/routes/assignmentRoutes.js

const express = require("express");
const {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByEmployee, // Import the new controller
} = require("../controllers/assignmentsController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

/**
 * @route   GET /api/assignments
 * @desc    Get all assignments
 * @access  Protected
 */
router.get("/", getAllAssignments);

/**
 * @route   GET /api/assignments/employee/:employeeId
 * @desc    Get assignments for a specific employee by employeeId
 * @access  Protected
 */
router.get("/employee/:employeeId", getAssignmentsByEmployee);

/**
 * @route   POST /api/assignments
 * @desc    Create a new assignment
 * @access  Protected (Admin only)
 */
router.post("/", authorizeRoles("ADMIN"), createAssignment);

/**
 * @route   PUT /api/assignments/:id
 * @desc    Update an assignment
 * @access  Protected (Admin only)
 */
router.put("/:id", authorizeRoles("ADMIN"), updateAssignment);

/**
 * @route   DELETE /api/assignments/:id
 * @desc    Delete an assignment
 * @access  Protected (Admin only)
 */
router.delete("/:id", authorizeRoles("ADMIN"), deleteAssignment);

module.exports = router;

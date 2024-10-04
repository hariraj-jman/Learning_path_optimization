// src/routes/userRoutes.js

const express = require('express');
const {
  getCurrentUser,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/userController');
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

/**
 * @route   GET /api/users/me
 * @desc    Get current user
 * @access  Protected
 */
router.get('/me', getCurrentUser);

/**
 * @route   GET /api/users
 * @desc    Get all employees (Admin only)
 * @access  Protected
 */
router.get('/', getAllEmployees);

/**
 * @route   POST /api/users
 * @desc    Create a new employee (Admin only)
 * @access  Protected
 */
router.post('/', createEmployee);

/**
 * @route   PUT /api/users/:id
 * @desc    Update an employee (Admin only)
 * @access  Protected
 */
router.put('/:id', updateEmployee);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete an employee (Admin only)
 * @access  Protected
 */
router.delete('/:id', deleteEmployee);

module.exports = router;

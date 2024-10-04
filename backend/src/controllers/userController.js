// src/controllers/userController.js


const bcrypt = require('bcrypt');
const prisma = require("../../prismaClient");

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get all employees (Admin only)
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Create a new employee (Admin only)
 */
const createEmployee = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'EMPLOYEE',
      },
    });

    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Update an employee (Admin only)
 */
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const updateData = { name, email, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Delete an employee (Admin only)
 */
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  getCurrentUser,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

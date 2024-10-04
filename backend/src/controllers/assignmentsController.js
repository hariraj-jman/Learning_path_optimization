// src/controllers/assignmentsController.js

const prisma = require("../../prismaClient");

/**
 * Create a new assignment
 */
const createAssignment = async (req, res) => {
  const { employeeId, courseId, learningPathId } = req.body;

  // Validate employeeId
  if (!employeeId) {
    return res.status(400).json({ error: "employeeId is required." });
  }

  try {
    // Create new assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        user: { connect: { id: Number(employeeId) } }, // Connect the user using employeeId
        ...(courseId ? { course: { connect: { id: Number(courseId) } } } : {}), // Conditionally include course connection
        ...(learningPathId
          ? { learningPath: { connect: { id: Number(learningPathId) } } }
          : {}), // Conditionally include learningPath connection
      },
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get all assignments
 */
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        course: true,
        learningPath: true,
        user: true,
        // assignedAt: true,
        // Including user information as well if needed
      },
    });
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Update an assignment
 */
const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { userId, courseId, learningPathId } = req.body;

  try {
    const updatedAssignment = await prisma.assignment.update({
      where: { id: parseInt(id) },
      data: { userId, courseId, learningPathId },
    });

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete an assignment
 */
const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.assignment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
};

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

  let newAssignments = [];
  try {
    if (learningPathId) {
      // Assign the learning path to the employee
      const existingLearningPathAssignment = await prisma.assignment.findFirst({
        where: {
          userId: Number(employeeId),
          learningPathId: Number(learningPathId),
        },
      });

      if (!existingLearningPathAssignment) {
        await prisma.assignment.create({
          data: {
            user: { connect: { id: Number(employeeId) } },
            learningPath: { connect: { id: Number(learningPathId) } },
          },
        });
      }

      // Get all courses in the learning path
      const coursesInLearningPath = await prisma.learningPathCourse.findMany({
        where: { learningPathId: Number(learningPathId) },
        select: { courseId: true },
      });

      // Assign each course to the employee if not already assigned
      for (const course of coursesInLearningPath) {
        const existingCourseAssignment = await prisma.assignment.findFirst({
          where: {
            userId: Number(employeeId),
            courseId: course.courseId,
          },
        });

        if (!existingCourseAssignment) {
          const newAssignment = await prisma.assignment.create({
            data: {
              user: { connect: { id: Number(employeeId) } },
              course: { connect: { id: course.courseId } },
            },
          });
          newAssignments.push(newAssignment);
        }
      }
    } else if (courseId) {
      // Check if the course is already assigned to the employee
      const existingCourseAssignment = await prisma.assignment.findFirst({
        where: {
          userId: Number(employeeId),
          courseId: Number(courseId),
        },
      });

      if (!existingCourseAssignment) {
        // Assign the course directly if it is not already assigned
        const newAssignment = await prisma.assignment.create({
          data: {
            user: { connect: { id: Number(employeeId) } },
            course: { connect: { id: Number(courseId) } },
          },
        });
        newAssignments.push(newAssignment);
      } else {
        return res
          .status(400)
          .json({ message: "Course is already assigned to the employee." });
      }
    }

    res
      .status(201)
      .json({ message: "Assignments created successfully.", newAssignments });
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

/**
 * Get assignments for a particular employee
 */
const getAssignmentsByEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch assignments where courseId is not null (i.e., only course assignments)
    const assignments = await prisma.assignment.findMany({
      where: {
        userId: Number(employeeId),
        courseId: { not: null }, // Only fetch assignments related to courses
      },
      include: {
        course: true, // Include course information
        courseProgress: true, // Include course progress if any
      },
    });

    // Check if no assignments are found
    if (!assignments.length) {
      return res
        .status(404)
        .json({ message: "No course assignments found for this employee." });
    }

    // Return the filtered assignments with course details and progress
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments for employee:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByEmployee,
};

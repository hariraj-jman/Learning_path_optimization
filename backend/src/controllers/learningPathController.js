// src/controllers/learningPathController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new Learning Path (Admin only)
 */
const createLearningPath = async (req, res) => {
  const { title, description, courseIds } = req.body;

  try {
    const newLearningPath = await prisma.learningPath.create({
      data: {
        title,
        description,
        learningPathCourses: {
          create: courseIds.map((courseId, index) => ({
            courseId,
            order: index + 1,
          })),
        },
      },
    });

    res.status(201).json(newLearningPath);
  } catch (error) {
    console.error("Error creating learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get all Learning Paths (Admin and Employee)
 */

const getLearningPaths = async (req, res) => {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        learningPathCourses: {
          include: {
            course: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    res.status(200).json(learningPaths);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get a Learning Path by ID (Admin and Employee)
 */
const getLearningPathById = async (req, res) => {
  const { id } = req.params;

  try {
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        learningPathCourses: {
          // Correct field name
          include: {
            course: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!learningPath) {
      return res.status(404).json({ error: "Learning path not found." });
    }

    res.status(200).json(learningPath);
  } catch (error) {
    console.error("Error fetching learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Update a Learning Path by ID (Admin only)
 */
const updateLearningPath = async (req, res) => {
  const { id } = req.params;
  const { title, description, courseIds } = req.body;

  try {
    const updatedLearningPath = await prisma.learningPath.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        learningPathCourses: {
          deleteMany: {}, // Remove existing associations
          create: courseIds.map((courseId, index) => ({
            courseId,
            order: index + 1,
          })),
        },
      },
    });

    res.status(200).json(updatedLearningPath);
  } catch (error) {
    console.error("Error updating learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete a Learning Path by ID (Admin only)
 */
const deleteLearningPath = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.learningPath.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Learning path deleted successfully." });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Add Courses to a Learning Path (Admin only)
 */
const addCoursesToLearningPath = async (req, res) => {
  const { id } = req.params;
  const { courseIds } = req.body;

  try {
    const updatedLearningPath = await prisma.learningPath.update({
      where: { id: parseInt(id) },
      data: {
        LearningPathCourse: {
          create: courseIds.map((courseId, index) => ({
            courseId,
            order: index + 1,
          })),
        },
      },
    });

    res.status(200).json(updatedLearningPath);
  } catch (error) {
    console.error("Error adding courses to learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Remove a Course from a Learning Path (Admin only)
 */
const removeCourseFromLearningPath = async (req, res) => {
  const { learningPathId, courseId } = req.params;

  try {
    await prisma.learningPathCourse.deleteMany({
      where: {
        learningPathId: parseInt(learningPathId),
        courseId: parseInt(courseId),
      },
    });

    res
      .status(200)
      .json({ message: "Course removed from learning path successfully." });
  } catch (error) {
    console.error("Error removing course from learning path:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createLearningPath,
  getLearningPaths,
  getLearningPathById,
  updateLearningPath,
  deleteLearningPath,
  addCoursesToLearningPath,
  removeCourseFromLearningPath,
};

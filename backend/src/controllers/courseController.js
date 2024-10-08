// src/controllers/courseController.js
const prisma = require("../../prismaClient");
/**
 * Create a new course (Admin only)
 */
const createCourse = async (req, res) => {
  const { title, duration, difficultyLevel } = req.body;

  try {
    // Check if course already exists
    const existingCourse = await prisma.course.findUnique({
      where: { title },
    });

    if (existingCourse) {
      return res
        .status(400)
        .json({ error: "Course with this title already exists." });
    }

    // Create new course
    const newCourse = await prisma.course.create({
      data: {
        title,
        duration,
        difficultyLevel,
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Get all courses
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Update a course (Admin only)
 */
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, duration, difficultyLevel } = req.body;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, duration, difficultyLevel },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * Delete a course (Admin only)
 */
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
};

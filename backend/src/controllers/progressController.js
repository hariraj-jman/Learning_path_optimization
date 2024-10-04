// src/controllers/progressController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new CourseProgress (Admin only)
 */
const createCourseProgress = async (req, res) => {
  const { userId, courseId, assignmentId, progress } = req.body;

  try {
    const newProgress = await prisma.courseProgress.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        assignmentId: parseInt(assignmentId),
        progress,
      },
    });

    res.status(201).json(newProgress);
  } catch (error) {
    console.error('Error creating course progress:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get all CourseProgress for a user (Admin and the user themselves)
 */
const getCourseProgressByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const progressRecords = await prisma.courseProgress.findMany({
      where: { userId: parseInt(userId) },
      include: {
        course: true,
        assignment: true,
      },
    });

    res.status(200).json(progressRecords);
  } catch (error) {
    console.error('Error fetching course progress by user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get CourseProgress by Assignment and Course (Admin and the user)
 */
const getCourseProgressByAssignmentCourse = async (req, res) => {
  const { assignmentId, courseId } = req.params;

  try {
    const progressRecord = await prisma.courseProgress.findUnique({
      where: {
        assignmentId_courseId: {
          assignmentId: parseInt(assignmentId),
          courseId: parseInt(courseId),
        },
      },
      include: {
        course: true,
        assignment: true,
      },
    });

    if (!progressRecord) {
      return res.status(404).json({ error: 'Course progress not found.' });
    }

    res.status(200).json(progressRecord);
  } catch (error) {
    console.error('Error fetching course progress by assignment and course:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Update CourseProgress (Admin and the user themselves)
 */
const updateCourseProgress = async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  try {
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: parseInt(id) },
      data: { progress },
    });

    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Get all CourseProgress records (Admin only)
 */
const getAllCourseProgress = async (req, res) => {
  try {
    const allProgress = await prisma.courseProgress.findMany({
      include: {
        user: true,
        course: true,
        assignment: true,
      },
    });

    res.status(200).json(allProgress);
  } catch (error) {
    console.error('Error fetching all course progress:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  createCourseProgress,
  getCourseProgressByUser,
  getCourseProgressByAssignmentCourse,
  updateCourseProgress,
  getAllCourseProgress,
};

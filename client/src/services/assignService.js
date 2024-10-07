// src/services/assignService.js

import axios from "./api";

export const assignCourseToEmployee = async (employeeId, courseId) => {
  try {
    console.log(employeeId, courseId);
    const response = await axios.post(`/assignments`, {
      employeeId,
      courseId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const assignLearningPathToEmployee = async (
  employeeId,
  learningPathId
) => {
  try {
    const response = await axios.post(`/assignments`, {
      employeeId,
      learningPathId,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// New function to get the assignments
export const getAssignments = async () => {
  try {
    const response = await axios.get(`/assignments`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

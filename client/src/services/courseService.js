// src/services/courseService.js

import axios from './api';

export const getAllCourses = async () => {
  try {
    const response = await axios.get('/courses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ... other course-related functions

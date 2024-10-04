// src/services/learningPathService.js

import axios from "./api";

export const getAllLearningPaths = async () => {
  try {
    const response = await axios.get("/learning-paths");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ... other learning path-related functions

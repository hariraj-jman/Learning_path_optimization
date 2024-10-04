// src/services/userService.js

import axios from './api';

export const getAllEmployees = async () => {
  try {
    const response = await axios.get('/users'); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ... other user-related functions

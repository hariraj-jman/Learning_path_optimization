// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

console.log("URL", api)

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

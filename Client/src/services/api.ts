import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // Assuming your API is served from the same origin under /api
  withCredentials: true // Important for cookies
});

export default api;

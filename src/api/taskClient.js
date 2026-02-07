import axios from 'axios';

const API_BASE_URL =  'http://localhost:8000/api';

const taskClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
taskClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
taskClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default taskClient;
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Test endpoints
export const testAPI = {
  getAllTests: (params) => api.get('/tests', { params }),
  getTestById: (id) => api.get(`/tests/${id}`),
  createTest: (testData) => api.post('/tests', testData),
  updateTest: (id, testData) => api.patch(`/tests/${id}`, testData),
  deleteTest: (id) => api.delete(`/tests/${id}`),
  submitTest: (id, answers) => api.post(`/tests/${id}/submit`, { answers }),
};

// User endpoints
export const userAPI = {
  getMyAttempts: () => api.get('/users/my-attempts'),
  getAllUsers: () => api.get('/users'),
  getUserAttempts: (params) => api.get('/users/attempts', { params }),
  getUserStats: () => api.get('/users/stats'),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
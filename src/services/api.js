import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add timestamp to prevent caching of GET requests in development
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
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
      sessionStorage.clear(); // Clear any session storage as well
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden access
      console.error('Access forbidden:', error.response.data.message);
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data.message);
    } else if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      // Network error or timeout
      console.error('Network error or timeout:', error.message);
    }

    // Return error with more detailed information
    return Promise.reject({
      ...error,
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
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

// Media endpoints
export const mediaAPI = {
  uploadFile: (formData) => api.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Analytics endpoints
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
  getUserAnalytics: () => api.get('/analytics/user'),
  getTestAnalytics: () => api.get('/analytics/tests')
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getApiUrl = () => API_BASE_URL;

export default api;
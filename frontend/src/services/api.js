import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // Shorter timeout so demo mode doesn't hang waiting for the API
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartcare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we have a real (non-demo) token
    if (error.response?.status === 401) {
      const token = localStorage.getItem('smartcare_token');
      if (token && token !== 'demo-jwt-token-smartcare-2026') {
        localStorage.removeItem('smartcare_token');
        localStorage.removeItem('smartcare_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

// Use the environment variable if available, otherwise fallback to Render URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tripvault-omrt.onrender.com/api'
});

// Automatically attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
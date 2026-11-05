import axios from 'axios';

const api = axios.create({
  // This automatically uses your live Render URL on Vercel, and localhost when testing on your computer
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default api;
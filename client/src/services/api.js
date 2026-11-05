import axios from 'axios';

const api = axios.create({
  // This automatically uses your Render URL when deployed on Vercel, and localhost for local testing
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default api;
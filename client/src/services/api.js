
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://financial-tracker-app-ypkt.onrender.com',
});

export default API;

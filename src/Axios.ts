import axios from 'axios';
import type { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://vervoer-backend2.onrender.com/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosInstance;
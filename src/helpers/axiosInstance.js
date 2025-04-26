import axios from 'axios';
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_EXPRESS_URL,
  withCredentials: true,
});

import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

// IMPORTANT: This needs to be the URL of your DEPLOYED backend later.
// For local development, it can be http://localhost:8080


const api = axios.create({
    baseURL: '/api',
});

// This is the magic. Before any request is sent, this function runs.
api.interceptors.request.use(config => {
    // It gets the token from our global state...
    const token = useAuthStore.getState().token;
    // And if the token exists, it adds it to the 'Authorization' header.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// We also handle automatic logout if the token is expired (401 error)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, log the user out
      useAuthStore.getState().logout();
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);


export default api;
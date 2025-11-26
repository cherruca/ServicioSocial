import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header automatically from localStorage token when available
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token && config && config.headers && !config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            // ignore localStorage errors
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;

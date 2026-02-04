import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
    baseURL: '/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and 401 Unauthorized
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const config = error.config;
        const isLoginRequest = config?.url?.includes('/support/login');
        const isRegisterRequest = config?.url?.includes('/support/users') && config?.method === 'post';

        // ONLY redirect to login if it's a 401 AND it's not an auth-related request (login/register)
        if (error.response?.status === 401 && !isLoginRequest && !isRegisterRequest) {
            console.warn('Unauthorized access detected, redirecting to login...');
            useAuthStore.getState().logout();
            // Using window.location.href as a fallback if navigate isn't available
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

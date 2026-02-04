import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_OFFYBOX_API_URL || 'https://api.offybox.com/v1';

const apiClient = axios.create({
    baseURL: BASE_URL,
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

/**
 * apiRequest provides backward compatibility with the legacy fetch-based utility.
 * It now uses the apiClient (axios) under the hood.
 */
export async function apiRequest<T>(
    endpoint: string,
    options: any = {}
): Promise<T> {
    const { method = 'GET', body, headers, ...config } = options;

    // Normalize endpoint to remove leading slash if present, 
    // as baseURL usually includes it or axios handles it.
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await apiClient({
        url,
        method,
        data: body ? JSON.parse(body) : undefined,
        headers,
        ...config
    });

    return response.data;
}

export default apiClient;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    expires_at: number | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            expires_at: null,
            isAuthenticated: false,
            login: async (email: string, password: string) => {
                console.log('🔐 [Login] Attempting login for:', email);
                try {
                    const response = await axios.post('https://api.offybox.com/v1/support/login', {
                        email,
                        password,
                    }, {
                        headers: { 'Content-Type': 'application/json' }
                    });

                    console.log('✅ [Login] Success! Response:', response.data);
                    const { token, expires_at, user } = response.data;

                    set({
                        user,
                        token,
                        expires_at,
                        isAuthenticated: true
                    });

                    return true;
                } catch (error: any) {
                    console.error('❌ [Login] Failed:', error.response?.data || error.message);
                    if (error.response) {
                        const errorMessage = error.response.data.error || error.response.data.message || 'Login failed';
                        throw new Error(errorMessage);
                    } else {
                        throw new Error('An error occurred during login');
                    }
                }
            },
            register: async (userData: any) => {
                console.log('📝 [Register] Starting registration for:', userData.email);
                try {
                    const payload = {
                        id: "",
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        phone: userData.phone,
                        password: userData.password,
                        status: 'ACTIVE'
                    };

                    console.log('📤 [Register] Sending payload:', payload);

                    const response = await axios.post('https://api.offybox.com/v1/support/users', payload, {
                        headers: { 'Content-Type': 'application/json' }
                    });

                    console.log('✅ [Register] SUCCESS! Server response:', response.data);
                    console.log('🆔 [Register] Generated ID:', response.data.id);
                    console.log('👤 [Register] User Info:', {
                        id: response.data.id,
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        email: response.data.email,
                        status: response.data.status,
                        created_at: response.data.created_at
                    });

                    return !!response.data;
                } catch (error: any) {
                    console.error('❌ [Register] FAILED!');
                    console.error('Error Status:', error.response?.status);
                    console.error('Error Data:', error.response?.data);
                    console.error('Full Error:', error);

                    if (error.response) {
                        const errorMessage = error.response.data.error || error.response.data.message || 'Registration failed';
                        throw new Error(errorMessage);
                    } else {
                        throw new Error('An error occurred during registration');
                    }
                }
            },
            forgotPassword: async (email: string) => {
                try {
                    const response = await axios.post('https://api.offybox.com/v1/support/forgot-password', {
                        email,
                    });
                    return !!response.data;
                } catch (error: any) {
                    if (error.response) {
                        const errorMessage = error.response.data.error || error.response.data.message || 'Failed to process request';
                        throw new Error(errorMessage);
                    } else {
                        throw new Error('An error occurred. Please try again.');
                    }
                }
            },
            logout: () => {
                set({ user: null, token: null, expires_at: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

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
            logout: () => {
                set({ user: null, token: null, expires_at: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

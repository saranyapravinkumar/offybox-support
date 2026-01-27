import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: async (email: string, _password: string) => {
                // Mock login - in a real app, this would call an API
                await new Promise((resolve) => setTimeout(resolve, 500));

                const user: User = {
                    id: '1',
                    email: email,
                    name: email.split('@')[0],
                };

                set({ user, isAuthenticated: true });
                return true;
            },
            logout: () => {
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

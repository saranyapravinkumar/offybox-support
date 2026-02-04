import { create } from 'zustand';
import type { SupportUser } from '../services/userApi';
import { userApi } from '../services/userApi';

interface UserState {
    users: SupportUser[];
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    addUser: (userData: any) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    fetchUsers: async () => {
        console.log('🔄 [UserStore] Starting fetchUsers...');
        set({ isLoading: true, error: null });
        try {
            console.log('📡 [UserStore] Calling userApi.fetchSupportUsers()...');
            const users = await userApi.fetchSupportUsers();
            console.log('✅ [UserStore] Users fetched successfully:', users);
            set({ users, isLoading: false });
        } catch (error: any) {
            console.error('❌ [UserStore] Error fetching users:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch users';
            set({
                error: errorMessage,
                isLoading: false
            });
        }
    },
    addUser: async (userData) => {
        console.log('🔄 [UserStore] Starting addUser...');
        set({ isLoading: true, error: null });
        try {
            console.log('📡 [UserStore] Calling userApi.createUser() with:', userData);
            const newUser = await userApi.createUser(userData);
            console.log('✅ [UserStore] User created successfully:', newUser);
            set({
                users: [newUser, ...get().users],
                isLoading: false
            });
            return true;
        } catch (error: any) {
            console.error('❌ [UserStore] Error creating user:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create user';
            set({
                error: errorMessage,
                isLoading: false
            });
            return false;
        }
    },
}));

import { create } from 'zustand';
import type { SupportUser } from '../services/userApi';
import { userApi } from '../services/userApi';

interface UserState {
    users: SupportUser[];
    currentUser: SupportUser | null;
    isLoading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    fetchUserById: (id: string) => Promise<void>;
    addUser: (userData: any) => Promise<boolean>;
    updateUser: (id: string, userData: any) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    currentUser: null,
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
    fetchUserById: async (id: string) => {
        console.log('🔄 [UserStore] Starting fetchUserById:', id);
        set({ isLoading: true, error: null, currentUser: null });
        try {
            console.log('📡 [UserStore] Calling userApi.getUserById()...');
            const user = await userApi.getUserById(id);
            console.log('✅ [UserStore] User fetched successfully:', user);
            set({ currentUser: user, isLoading: false });
        } catch (error: any) {
            console.error('❌ [UserStore] Error fetching user:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch user';
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
    updateUser: async (id: string, userData: any) => {
        console.log('🔄 [UserStore] Starting updateUser:', id);
        set({ isLoading: true, error: null });
        try {
            console.log('📡 [UserStore] Calling userApi.updateUser() with:', userData);
            const updatedUser = await userApi.updateUser(id, userData);
            console.log('✅ [UserStore] User updated successfully:', updatedUser);
            set({
                users: get().users.map(u => u.id === id ? updatedUser : u),
                isLoading: false
            });
            return true;
        } catch (error: any) {
            console.error('❌ [UserStore] Error updating user:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update user';
            set({
                error: errorMessage,
                isLoading: false
            });
            return false;
        }
    },
}));

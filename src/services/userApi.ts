import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export interface SupportUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

const BASE_URL = 'https://api.offybox.com/v1';

export const userApi = {
    async fetchSupportUsers(): Promise<SupportUser[]> {
        const token = useAuthStore.getState().token;

        console.log('🔐 [UserAPI] Fetching users with token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

        if (!token) {
            console.error('❌ [UserAPI] No authentication token found!');
            throw new Error('Please login first to view users');
        }

        try {
            console.log('📡 [UserAPI] Making GET request to:', `${BASE_URL}/support/users`);
            const response = await axios.get(`${BASE_URL}/support/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ [UserAPI] Response received:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ [UserAPI] Request failed:', error.response?.status, error.response?.data);
            throw error;
        }
    },

    async createUser(userData: any): Promise<SupportUser> {
        const token = useAuthStore.getState().token;
        const payload = {
            id: userData.id || "",
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            status: userData.status || 'ACTIVE'
        };

        console.log('🔐 [UserAPI] Creating user with token:', token ? 'Present' : 'NO TOKEN');
        console.log('📝 [UserAPI] Payload:', payload);

        try {
            const response = await axios.post(`${BASE_URL}/support/users`, payload, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ [UserAPI] User created:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ [UserAPI] Create user failed:', error.response?.status, error.response?.data);
            throw error;
        }
    },

    async getUserById(id: string): Promise<SupportUser> {
        const token = useAuthStore.getState().token;

        console.log('🔐 [UserAPI] Fetching user by ID:', id);

        if (!token) {
            console.error('❌ [UserAPI] No authentication token found!');
            throw new Error('Please login first to view user details');
        }

        try {
            console.log('📡 [UserAPI] Making GET request to:', `${BASE_URL}/support/users/${id}`);
            const response = await axios.get(`${BASE_URL}/support/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ [UserAPI] User fetched:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ [UserAPI] Request failed:', error.response?.status, error.response?.data);
            throw error;
        }
    },

    async updateUser(id: string, userData: any): Promise<SupportUser> {
        const token = useAuthStore.getState().token;
        const payload = {
            id: id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password || undefined,
            status: userData.status || 'ACTIVE'
        };

        console.log('🔐 [UserAPI] Updating user with token:', token ? 'Present' : 'NO TOKEN');
        console.log('📝 [UserAPI] Update Payload:', payload);

        try {
            const response = await axios.post(`${BASE_URL}/support/users`, payload, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ [UserAPI] User updated:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ [UserAPI] Update user failed:', error.response?.status, error.response?.data);
            throw error;
        }
    },

    async toggleUserStatus(id: string, currentStatus: string): Promise<SupportUser> {
        const token = useAuthStore.getState().token;
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        const response = await axios.patch(`${BASE_URL}/support/users/${id}`,
            { status: newStatus },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }
};

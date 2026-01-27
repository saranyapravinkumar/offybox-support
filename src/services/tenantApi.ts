import type { Tenant, TenantMapping } from '../store/tenantStore';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const tenantApi = {
    async fetchTenants(): Promise<Tenant[]> {
        await delay(500);
        // In a real app, this would fetch from an API
        // For now, we use the Zustand store directly
        return [];
    },

    async createTenant(tenant: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
        await delay(300);
        return {
            ...tenant,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
        };
    },

    async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
        await delay(300);
        return { id, ...updates } as Tenant;
    },

    async deleteTenant(id: string): Promise<void> {
        await delay(300);
        console.log(`Deleted tenant ${id}`);
    },

    async fetchMappings(): Promise<TenantMapping[]> {
        await delay(500);
        return [];
    },

    async createMapping(mapping: Omit<TenantMapping, 'id'>): Promise<TenantMapping> {
        await delay(300);
        return {
            ...mapping,
            id: Date.now().toString(),
        };
    },

    async deleteMapping(id: string): Promise<void> {
        await delay(300);
        console.log(`Deleted mapping ${id}`);
    },
};

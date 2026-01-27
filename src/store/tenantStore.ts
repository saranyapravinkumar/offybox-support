import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tenant {
    id: string;
    name: string;
    domain: string;
    description: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface TenantMapping {
    id: string;
    tenantId: string;
    tenantName: string;
    resourceType: string;
    resourceId: string;
    resourceName: string;
}

interface TenantState {
    tenants: Tenant[];
    mappings: TenantMapping[];
    addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt'>) => void;
    updateTenant: (id: string, updates: Partial<Tenant>) => void;
    deleteTenant: (id: string) => void;
    addMapping: (mapping: Omit<TenantMapping, 'id'>) => void;
    deleteMapping: (id: string) => void;
}

export const useTenantStore = create<TenantState>()(
    persist(
        (set) => ({
            tenants: [
                {
                    id: '1',
                    name: 'Acme Corporation',
                    domain: 'acme.example.com',
                    description: 'Primary enterprise tenant',
                    status: 'active',
                    createdAt: '2024-01-15',
                },
                {
                    id: '2',
                    name: 'TechStart Inc',
                    domain: 'techstart.example.com',
                    description: 'Startup tenant',
                    status: 'active',
                    createdAt: '2024-02-20',
                },
                {
                    id: '3',
                    name: 'Global Services',
                    domain: 'global.example.com',
                    description: 'International services tenant',
                    status: 'inactive',
                    createdAt: '2024-03-10',
                },
            ],
            mappings: [
                {
                    id: '1',
                    tenantId: '1',
                    tenantName: 'Acme Corporation',
                    resourceType: 'Database',
                    resourceId: 'db-001',
                    resourceName: 'Production DB',
                },
                {
                    id: '2',
                    tenantId: '1',
                    tenantName: 'Acme Corporation',
                    resourceType: 'Storage',
                    resourceId: 'st-001',
                    resourceName: 'File Storage',
                },
                {
                    id: '3',
                    tenantId: '2',
                    tenantName: 'TechStart Inc',
                    resourceType: 'Database',
                    resourceId: 'db-002',
                    resourceName: 'Dev Database',
                },
            ],
            addTenant: (tenant) =>
                set((state) => ({
                    tenants: [
                        ...state.tenants,
                        {
                            ...tenant,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString().split('T')[0],
                        },
                    ],
                })),
            updateTenant: (id, updates) =>
                set((state) => ({
                    tenants: state.tenants.map((t) =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                })),
            deleteTenant: (id) =>
                set((state) => ({
                    tenants: state.tenants.filter((t) => t.id !== id),
                    mappings: state.mappings.filter((m) => m.tenantId !== id),
                })),
            addMapping: (mapping) =>
                set((state) => ({
                    mappings: [
                        ...state.mappings,
                        { ...mapping, id: Date.now().toString() },
                    ],
                })),
            deleteMapping: (id) =>
                set((state) => ({
                    mappings: state.mappings.filter((m) => m.id !== id),
                })),
        }),
        {
            name: 'tenant-storage',
        }
    )
);

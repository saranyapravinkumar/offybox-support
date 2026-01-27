import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Module {
    id: string;
    name: string;
    code: string;
    description: string;
    status: 'active' | 'inactive';
    icon?: string;
}

interface ModuleState {
    modules: Module[];
    addModule: (module: Omit<Module, 'id'>) => void;
    updateModule: (id: string, updates: Partial<Module>) => void;
    deleteModule: (id: string) => void;
}

export const useModuleStore = create<ModuleState>()(
    persist(
        (set) => ({
            modules: [
                { id: '1', name: 'User Management', code: 'USER_MGMT', description: 'Manage users and roles', status: 'active' },
                { id: '2', name: 'Tenant Management', code: 'TENANT_MGMT', description: 'Manage tenant organizations', status: 'active' },
                { id: '3', name: 'Location Management', code: 'LOC_MGMT', description: 'Manage countries, states and cities', status: 'active' },
                { id: '4', name: 'Billing & Subscriptions', code: 'BILLING', description: 'Manage billing and payments', status: 'active' },
            ],
            addModule: (module) =>
                set((state) => ({
                    modules: [...state.modules, { ...module, id: Date.now().toString() }],
                })),
            updateModule: (id, updates) =>
                set((state) => ({
                    modules: state.modules.map((m) => (m.id === id ? { ...m, ...updates } : m)),
                })),
            deleteModule: (id) =>
                set((state) => ({
                    modules: state.modules.filter((m) => m.id !== id),
                })),
        }),
        { name: 'module-storage' }
    )
);

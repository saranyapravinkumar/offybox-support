import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ticket {
    id: string;
    subject: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tenantId: string;
    tenantName: string;
    createdAt: string;
    updatedAt: string;
}

interface TicketState {
    tickets: Ticket[];
    addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTicket: (id: string, updates: Partial<Ticket>) => void;
    deleteTicket: (id: string) => void;
}

export const useTicketStore = create<TicketState>()(
    persist(
        (set) => ({
            tickets: [
                {
                    id: '1',
                    subject: 'Database connection issue',
                    description: 'Unable to connect to the secondary database instance.',
                    status: 'open',
                    priority: 'high',
                    tenantId: '1',
                    tenantName: 'Acme Corp',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    subject: 'Login slow for some users',
                    description: 'Reports of login taking up to 10 seconds in the EU region.',
                    status: 'in-progress',
                    priority: 'medium',
                    tenantId: '2',
                    tenantName: 'Global Tech',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ],
            addTicket: (ticket) =>
                set((state) => ({
                    tickets: [
                        ...state.tickets,
                        {
                            ...ticket,
                            id: Date.now().toString(),
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ],
                })),
            updateTicket: (id, updates) =>
                set((state) => ({
                    tickets: state.tickets.map((t) =>
                        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
                    ),
                })),
            deleteTicket: (id) =>
                set((state) => ({
                    tickets: state.tickets.filter((t) => t.id !== id),
                })),
        }),
        { name: 'ticket-storage' }
    )
);

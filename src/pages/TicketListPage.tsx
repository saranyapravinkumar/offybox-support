import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket as TicketIcon, Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { useTicketStore } from '../store/ticketStore';

export function TicketListPage() {
    const tickets = useTicketStore((state) => state.tickets);
    const deleteTicket = useTicketStore((state) => state.deleteTicket);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');
    const navigate = useNavigate();

    const filteredTickets = tickets.filter((t) => {
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: string, subject: string) => {
        if (window.confirm(`Are you sure you want to delete ticket "${subject}"?`)) {
            deleteTicket(id);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Tickets</h1>
                    <p>Manage and track support requests</p>
                </div>
                <button onClick={() => navigate('/tickets/create')} className="primary-button">
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    <span>Create Ticket</span>
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-input-container" style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by subject or tenant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Filter size={18} style={{ color: 'var(--text-muted)' }} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subject</th>
                            <th>Tenant</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="empty-state">
                                    No tickets found
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="code" style={{ fontSize: '0.75rem' }}>#{ticket.id}</td>
                                    <td className="tenant-name">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <TicketIcon size={18} style={{ color: 'var(--text-muted)' }} />
                                            <span>{ticket.subject}</span>
                                        </div>
                                    </td>
                                    <td>{ticket.tenantName}</td>
                                    <td>
                                        <span className={`status-badge ${ticket.status}`}>
                                            {ticket.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            color: getPriorityColor(ticket.priority)
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getPriorityColor(ticket.priority) }}></div>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                                            className="action-button edit"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ticket.id, ticket.subject)}
                                            className="action-button delete"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

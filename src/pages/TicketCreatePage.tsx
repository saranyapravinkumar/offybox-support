import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useTicketStore } from '../store/ticketStore';
import { useTenantStore } from '../store/tenantStore';

export function TicketCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const tickets = useTicketStore((state) => state.tickets);
    const addTicket = useTicketStore((state) => state.addTicket);
    const updateTicket = useTicketStore((state) => state.updateTicket);
    const tenants = useTenantStore((state) => state.tenants);

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        status: 'open' as any,
        priority: 'medium' as any,
        tenantId: '',
        tenantName: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            const ticket = tickets.find((t) => t.id === id);
            if (ticket) {
                setFormData({
                    subject: ticket.subject,
                    description: ticket.description,
                    status: ticket.status,
                    priority: ticket.priority,
                    tenantId: ticket.tenantId,
                    tenantName: ticket.tenantName,
                });
            } else {
                navigate('/tickets');
            }
        }
    }, [id, isEditMode, tickets, navigate]);

    const handleTenantChange = (tenantId: string) => {
        const tenant = tenants.find((t) => t.id === tenantId);
        setFormData({ ...formData, tenantId, tenantName: tenant?.name || '' });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.tenantId) newErrors.tenantId = 'Tenant is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEditMode && id) {
            updateTicket(id, formData);
        } else {
            addTicket(formData);
        }
        navigate('/tickets');
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/tickets" className="back-link">
                        <ArrowLeft size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        <span>Back to Tickets</span>
                    </Link>
                    <h1>{isEditMode ? 'Edit Ticket' : 'Create Ticket'}</h1>
                    <p>{isEditMode ? 'Update support ticket details' : 'Submit a new support request'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Tenant *</label>
                    <select
                        value={formData.tenantId}
                        onChange={(e) => handleTenantChange(e.target.value)}
                        className={errors.tenantId ? 'error' : ''}
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    {errors.tenantId && <span className="error-text">{errors.tenantId}</span>}
                </div>

                <div className="form-group">
                    <label>Subject *</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Help with billing..."
                        className={errors.subject ? 'error' : ''}
                    />
                    {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>

                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the issue in detail"
                        rows={5}
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/tickets')} className="secondary-button">
                        <X size={16} style={{ marginRight: '8px' }} />
                        <span>Cancel</span>
                    </button>
                    <button type="submit" className="primary-button">
                        <Save size={16} style={{ marginRight: '8px' }} />
                        <span>{isEditMode ? 'Update' : 'Create'} Ticket</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

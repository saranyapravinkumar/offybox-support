import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTenantStore } from '../store/tenantStore';

export function TenantCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const tenants = useTenantStore((state) => state.tenants);
    const addTenant = useTenantStore((state) => state.addTenant);
    const updateTenant = useTenantStore((state) => state.updateTenant);

    const [formData, setFormData] = useState({
        name: '',
        domain: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            const tenant = tenants.find((t) => t.id === id);
            if (tenant) {
                setFormData({
                    name: tenant.name,
                    domain: tenant.domain,
                    description: tenant.description,
                    status: tenant.status,
                });
            } else {
                navigate('/tenants');
            }
        }
    }, [id, isEditMode, tenants, navigate]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.domain.trim()) {
            newErrors.domain = 'Domain is required';
        } else if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(formData.domain)) {
            newErrors.domain = 'Invalid domain format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (isEditMode && id) {
            updateTenant(id, formData);
        } else {
            addTenant(formData);
        }

        setIsSubmitting(false);
        navigate('/tenants');
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/tenants" className="back-link">← Back to Tenants</Link>
                    <h1>{isEditMode ? 'Edit Tenant' : 'Create Tenant'}</h1>
                    <p>{isEditMode ? 'Update tenant information' : 'Add a new tenant organization'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="name">Tenant Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter tenant name"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="domain">Domain *</label>
                    <input
                        type="text"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        placeholder="e.g., company.example.com"
                        className={errors.domain ? 'error' : ''}
                    />
                    {errors.domain && <span className="error-text">{errors.domain}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter tenant description"
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/tenants')} className="secondary-button">
                        Cancel
                    </button>
                    <button type="submit" className="primary-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Tenant' : 'Create Tenant'}
                    </button>
                </div>
            </form>
        </div>
    );
}

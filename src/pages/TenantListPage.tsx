import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTenantStore } from '../store/tenantStore';

export function TenantListPage() {
    const tenants = useTenantStore((state) => state.tenants);
    const deleteTenant = useTenantStore((state) => state.deleteTenant);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const navigate = useNavigate();

    const filteredTenants = tenants.filter((tenant) => {
        const matchesSearch =
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteTenant(id);
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Tenants</h1>
                    <p>Manage your tenant organizations</p>
                </div>
                <button onClick={() => navigate('/tenants/create')} className="primary-button">
                    + Create Tenant
                </button>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Search tenants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="filter-select"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Domain</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTenants.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="empty-state">
                                    No tenants found
                                </td>
                            </tr>
                        ) : (
                            filteredTenants.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td className="tenant-name">{tenant.name}</td>
                                    <td>{tenant.domain}</td>
                                    <td>{tenant.description}</td>
                                    <td>
                                        <span className={`status-badge ${tenant.status}`}>
                                            {tenant.status}
                                        </span>
                                    </td>
                                    <td>{tenant.createdAt}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => navigate(`/tenants/${tenant.id}/edit`)}
                                            className="action-button edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tenant.id, tenant.name)}
                                            className="action-button delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="page-footer">
                <Link to="/tenants/mapping" className="secondary-button">
                    View Tenant Mappings
                </Link>
            </div>
        </div>
    );
}

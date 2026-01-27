import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useTenantStore } from '../store/tenantStore';

export function TenantMappingPage() {
    const tenants = useTenantStore((state) => state.tenants);
    const mappings = useTenantStore((state) => state.mappings);
    const addMapping = useTenantStore((state) => state.addMapping);
    const deleteMapping = useTenantStore((state) => state.deleteMapping);

    const [tenantFilter, setTenantFilter] = useState<string>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMapping, setNewMapping] = useState({
        tenantId: '',
        resourceType: '',
        resourceId: '',
        resourceName: '',
    });

    const filteredMappings = mappings.filter(
        (m) => tenantFilter === 'all' || m.tenantId === tenantFilter
    );

    const handleAddMapping = (e: React.FormEvent) => {
        e.preventDefault();

        const tenant = tenants.find((t) => t.id === newMapping.tenantId);
        if (!tenant) return;

        addMapping({
            ...newMapping,
            tenantName: tenant.name,
        });

        setNewMapping({
            tenantId: '',
            resourceType: '',
            resourceId: '',
            resourceName: '',
        });
        setShowAddForm(false);
    };

    const handleDeleteMapping = (id: string) => {
        if (window.confirm('Are you sure you want to delete this mapping?')) {
            deleteMapping(id);
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/tenants" className="back-link">
                        <ArrowLeft size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        <span>Back to Tenants</span>
                    </Link>
                    <h1>Tenant Mappings</h1>
                    <p>Manage resource mappings for tenants</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="primary-button">
                    {showAddForm ? 'Cancel' : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={18} />
                            <span>Add Mapping</span>
                        </div>
                    )}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddMapping} className="inline-form">
                    <select
                        value={newMapping.tenantId}
                        onChange={(e) => setNewMapping({ ...newMapping, tenantId: e.target.value })}
                        required
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <select
                        value={newMapping.resourceType}
                        onChange={(e) => setNewMapping({ ...newMapping, resourceType: e.target.value })}
                        required
                    >
                        <option value="">Resource Type</option>
                        <option value="Database">Database</option>
                        <option value="Storage">Storage</option>
                        <option value="Compute">Compute</option>
                        <option value="Network">Network</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Resource ID"
                        value={newMapping.resourceId}
                        onChange={(e) => setNewMapping({ ...newMapping, resourceId: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Resource Name"
                        value={newMapping.resourceName}
                        onChange={(e) => setNewMapping({ ...newMapping, resourceName: e.target.value })}
                        required
                    />
                    <button type="submit" className="primary-button">Add</button>
                </form>
            )}

            <div className="filters-bar">
                <select
                    value={tenantFilter}
                    onChange={(e) => setTenantFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Tenants</option>
                    {tenants.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Tenant</th>
                            <th>Resource Type</th>
                            <th>Resource ID</th>
                            <th>Resource Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMappings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="empty-state">
                                    No mappings found
                                </td>
                            </tr>
                        ) : (
                            filteredMappings.map((mapping) => (
                                <tr key={mapping.id}>
                                    <td className="tenant-name">{mapping.tenantName}</td>
                                    <td>
                                        <span className={`resource-badge ${mapping.resourceType.toLowerCase()}`}>
                                            {mapping.resourceType}
                                        </span>
                                    </td>
                                    <td className="code">{mapping.resourceId}</td>
                                    <td>{mapping.resourceName}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleDeleteMapping(mapping.id)}
                                            className="action-button delete"
                                            title="Remove mapping"
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

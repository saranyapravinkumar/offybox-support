import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Trash2, Edit2, Search } from 'lucide-react';
import { useModuleStore } from '../store/moduleStore';

export function ModuleListPage() {
    const modules = useModuleStore((state) => state.modules);
    const deleteModule = useModuleStore((state) => state.deleteModule);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredModules = modules.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the module "${name}"?`)) {
            deleteModule(id);
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Modules</h1>
                    <p>Manage application features and service modules</p>
                </div>
                <button onClick={() => navigate('/modules/create')} className="primary-button">
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    <span>Add Module</span>
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-input-container" style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Module Name</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredModules.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="empty-state">
                                    No modules found
                                </td>
                            </tr>
                        ) : (
                            filteredModules.map((module) => (
                                <tr key={module.id}>
                                    <td className="tenant-name">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Package size={18} className="nav-icon" style={{ color: 'var(--text-muted)' }} />
                                            <span>{module.name}</span>
                                        </div>
                                    </td>
                                    <td className="code">{module.code}</td>
                                    <td>{module.description}</td>
                                    <td>
                                        <span className={`status-badge ${module.status}`}>
                                            {module.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => navigate(`/modules/${module.id}/edit`)}
                                            className="action-button edit"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(module.id, module.name)}
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

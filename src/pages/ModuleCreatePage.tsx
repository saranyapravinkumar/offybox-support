import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useModuleStore } from '../store/moduleStore';

export function ModuleCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const modules = useModuleStore((state) => state.modules);
    const addModule = useModuleStore((state) => state.addModule);
    const updateModule = useModuleStore((state) => state.updateModule);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            const module = modules.find((m) => m.id === id);
            if (module) {
                setFormData({
                    name: module.name,
                    code: module.code,
                    description: module.description,
                    status: module.status,
                });
            } else {
                navigate('/modules');
            }
        }
    }, [id, isEditMode, modules, navigate]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.code.trim()) newErrors.code = 'Code is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (isEditMode && id) {
            updateModule(id, formData);
        } else {
            addModule(formData);
        }
        navigate('/modules');
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/modules" className="back-link">
                        <ArrowLeft size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        <span>Back to Modules</span>
                    </Link>
                    <h1>{isEditMode ? 'Edit Module' : 'Create Module'}</h1>
                    <p>{isEditMode ? 'Update module settings' : 'Define a new application module'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Module Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. User Management"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Module Code *</label>
                    <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g. USER_MGMT"
                        className={errors.code ? 'error' : ''}
                    />
                    {errors.code && <span className="error-text">{errors.code}</span>}
                </div>

                <div className="form-group">
                    <label>Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Briefly describe what this module does"
                        rows={3}
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/modules')} className="secondary-button">
                        <X size={16} style={{ marginRight: '8px' }} />
                        <span>Cancel</span>
                    </button>
                    <button type="submit" className="primary-button">
                        <Save size={16} style={{ marginRight: '8px' }} />
                        <span>{isEditMode ? 'Update' : 'Create'} Module</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

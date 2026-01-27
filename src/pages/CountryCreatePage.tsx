import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function CountryCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const countries = useLocationStore((state) => state.countries);
    const addCountry = useLocationStore((state) => state.addCountry);
    const updateCountry = useLocationStore((state) => state.updateCountry);

    const [formData, setFormData] = useState({ name: '', code: '', status: 'active' as 'active' | 'inactive' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            const country = countries.find((c) => c.id === id);
            if (country) setFormData({ name: country.name, code: country.code, status: country.status });
            else navigate('/countries');
        }
    }, [id, isEditMode, countries, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.code.trim()) newErrors.code = 'Code is required';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        if (isEditMode && id) updateCountry(id, formData);
        else addCountry(formData);
        navigate('/countries');
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/countries" className="back-link">← Back to Countries</Link>
                    <h1>{isEditMode ? 'Edit Country' : 'Add Country'}</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Country Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'error' : ''} />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Country Code *</label>
                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className={errors.code ? 'error' : ''} maxLength={3} />
                    {errors.code && <span className="error-text">{errors.code}</span>}
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/countries')} className="secondary-button">Cancel</button>
                    <button type="submit" className="primary-button">{isEditMode ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}

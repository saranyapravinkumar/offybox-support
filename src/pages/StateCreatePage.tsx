import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function StateCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const states = useLocationStore((state) => state.states);
    const countries = useLocationStore((state) => state.countries);
    const addState = useLocationStore((state) => state.addState);
    const updateState = useLocationStore((state) => state.updateState);

    const [formData, setFormData] = useState({ name: '', countryId: '', countryName: '', status: 'active' as 'active' | 'inactive' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            const state = states.find((s) => s.id === id);
            if (state) setFormData({ name: state.name, countryId: state.countryId, countryName: state.countryName, status: state.status });
            else navigate('/states');
        }
    }, [id, isEditMode, states, navigate]);

    const handleCountryChange = (countryId: string) => {
        const country = countries.find((c) => c.id === countryId);
        setFormData({ ...formData, countryId, countryName: country?.name || '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.countryId) newErrors.countryId = 'Country is required';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        if (isEditMode && id) updateState(id, formData);
        else addState(formData);
        navigate('/states');
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/states" className="back-link">← Back to States</Link>
                    <h1>{isEditMode ? 'Edit State' : 'Add State'}</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Country *</label>
                    <select value={formData.countryId} onChange={(e) => handleCountryChange(e.target.value)} className={errors.countryId ? 'error' : ''}>
                        <option value="">Select Country</option>
                        {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.countryId && <span className="error-text">{errors.countryId}</span>}
                </div>
                <div className="form-group">
                    <label>State Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'error' : ''} />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/states')} className="secondary-button">Cancel</button>
                    <button type="submit" className="primary-button">{isEditMode ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}

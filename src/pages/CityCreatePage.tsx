import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function CityCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const cities = useLocationStore((state) => state.cities);
    const states = useLocationStore((state) => state.states);
    const addCity = useLocationStore((state) => state.addCity);
    const updateCity = useLocationStore((state) => state.updateCity);

    const [formData, setFormData] = useState({ name: '', stateId: '', stateName: '', status: 'active' as 'active' | 'inactive' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            const city = cities.find((c) => c.id === id);
            if (city) setFormData({ name: city.name, stateId: city.stateId, stateName: city.stateName, status: city.status });
            else navigate('/cities');
        }
    }, [id, isEditMode, cities, navigate]);

    const handleStateChange = (stateId: string) => {
        const state = states.find((s) => s.id === stateId);
        setFormData({ ...formData, stateId, stateName: state?.name || '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.stateId) newErrors.stateId = 'State is required';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        if (isEditMode && id) updateCity(id, formData);
        else addCity(formData);
        navigate('/cities');
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/cities" className="back-link">← Back to Cities</Link>
                    <h1>{isEditMode ? 'Edit City' : 'Add City'}</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>State *</label>
                    <select value={formData.stateId} onChange={(e) => handleStateChange(e.target.value)} className={errors.stateId ? 'error' : ''}>
                        <option value="">Select State</option>
                        {states.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.countryName})</option>)}
                    </select>
                    {errors.stateId && <span className="error-text">{errors.stateId}</span>}
                </div>
                <div className="form-group">
                    <label>City Name *</label>
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
                    <button type="button" onClick={() => navigate('/cities')} className="secondary-button">Cancel</button>
                    <button type="submit" className="primary-button">{isEditMode ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}

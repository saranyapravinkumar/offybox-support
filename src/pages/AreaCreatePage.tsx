import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function AreaCreatePage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const areas = useLocationStore((state) => state.areas);
    const cities = useLocationStore((state) => state.cities);
    const addArea = useLocationStore((state) => state.addArea);
    const updateArea = useLocationStore((state) => state.updateArea);

    const [formData, setFormData] = useState({ name: '', cityId: '', cityName: '', pincode: '', status: 'active' as 'active' | 'inactive' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && id) {
            const area = areas.find((a) => a.id === id);
            if (area) setFormData({ name: area.name, cityId: area.cityId, cityName: area.cityName, pincode: area.pincode, status: area.status });
            else navigate('/areas');
        }
    }, [id, isEditMode, areas, navigate]);

    const handleCityChange = (cityId: string) => {
        const city = cities.find((c) => c.id === cityId);
        setFormData({ ...formData, cityId, cityName: city?.name || '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.cityId) newErrors.cityId = 'City is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        if (isEditMode && id) updateArea(id, formData);
        else addArea(formData);
        navigate('/areas');
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <Link to="/areas" className="back-link">← Back to Areas</Link>
                    <h1>{isEditMode ? 'Edit Area' : 'Add Area'}</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>City *</label>
                    <select value={formData.cityId} onChange={(e) => handleCityChange(e.target.value)} className={errors.cityId ? 'error' : ''}>
                        <option value="">Select City</option>
                        {cities.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.stateName})</option>)}
                    </select>
                    {errors.cityId && <span className="error-text">{errors.cityId}</span>}
                </div>
                <div className="form-group">
                    <label>Area Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'error' : ''} />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Pincode *</label>
                    <input type="text" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className={errors.pincode ? 'error' : ''} />
                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/areas')} className="secondary-button">Cancel</button>
                    <button type="submit" className="primary-button">{isEditMode ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function AreaListPage() {
    const areas = useLocationStore((state) => state.areas);
    const cities = useLocationStore((state) => state.cities);
    const deleteArea = useLocationStore((state) => state.deleteArea);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('all');
    const navigate = useNavigate();

    const filteredAreas = areas.filter((a) => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.pincode.includes(searchTerm);
        const matchesCity = cityFilter === 'all' || a.cityId === cityFilter;
        return matchesSearch && matchesCity;
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) deleteArea(id);
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Areas</h1>
                    <p>Manage area list</p>
                </div>
                <button onClick={() => navigate('/areas/create')} className="primary-button">+ Add Area</button>
            </div>

            <div className="filters-bar">
                <input type="text" placeholder="Search areas or pincode..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="filter-select">
                    <option value="all">All Cities</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.stateName})</option>)}
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr><th>Name</th><th>City</th><th>Pincode</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredAreas.length === 0 ? (
                            <tr><td colSpan={5} className="empty-state">No areas found</td></tr>
                        ) : (
                            filteredAreas.map((a) => (
                                <tr key={a.id}>
                                    <td className="tenant-name">{a.name}</td>
                                    <td>{a.cityName}</td>
                                    <td className="code">{a.pincode}</td>
                                    <td><span className={`status-badge ${a.status}`}>{a.status}</span></td>
                                    <td className="actions-cell">
                                        <button onClick={() => navigate(`/areas/${a.id}/edit`)} className="action-button edit">Edit</button>
                                        <button onClick={() => handleDelete(a.id, a.name)} className="action-button delete">Delete</button>
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

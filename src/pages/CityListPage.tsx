import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function CityListPage() {
    const cities = useLocationStore((state) => state.cities);
    const states = useLocationStore((state) => state.states);
    const deleteCity = useLocationStore((state) => state.deleteCity);
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('all');
    const navigate = useNavigate();

    const filteredCities = cities.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = stateFilter === 'all' || c.stateId === stateFilter;
        return matchesSearch && matchesState;
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) deleteCity(id);
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Cities</h1>
                    <p>Manage city list</p>
                </div>
                <button onClick={() => navigate('/cities/create')} className="primary-button">+ Add City</button>
            </div>

            <div className="filters-bar">
                <input type="text" placeholder="Search cities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="filter-select">
                    <option value="all">All States</option>
                    {states.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.countryName})</option>)}
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr><th>Name</th><th>State</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredCities.length === 0 ? (
                            <tr><td colSpan={4} className="empty-state">No cities found</td></tr>
                        ) : (
                            filteredCities.map((c) => (
                                <tr key={c.id}>
                                    <td className="tenant-name">{c.name}</td>
                                    <td>{c.stateName}</td>
                                    <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                                    <td className="actions-cell">
                                        <button onClick={() => navigate(`/cities/${c.id}/edit`)} className="action-button edit">Edit</button>
                                        <button onClick={() => handleDelete(c.id, c.name)} className="action-button delete">Delete</button>
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function StateListPage() {
    const states = useLocationStore((state) => state.states);
    const countries = useLocationStore((state) => state.countries);
    const deleteState = useLocationStore((state) => state.deleteState);
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('all');
    const navigate = useNavigate();

    const filteredStates = states.filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = countryFilter === 'all' || s.countryId === countryFilter;
        return matchesSearch && matchesCountry;
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) deleteState(id);
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>States</h1>
                    <p>Manage state list</p>
                </div>
                <button onClick={() => navigate('/states/create')} className="primary-button">+ Add State</button>
            </div>

            <div className="filters-bar">
                <input type="text" placeholder="Search states..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="filter-select">
                    <option value="all">All Countries</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr><th>Name</th><th>Country</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filteredStates.length === 0 ? (
                            <tr><td colSpan={4} className="empty-state">No states found</td></tr>
                        ) : (
                            filteredStates.map((s) => (
                                <tr key={s.id}>
                                    <td className="tenant-name">{s.name}</td>
                                    <td>{s.countryName}</td>
                                    <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                                    <td className="actions-cell">
                                        <button onClick={() => navigate(`/states/${s.id}/edit`)} className="action-button edit">Edit</button>
                                        <button onClick={() => handleDelete(s.id, s.name)} className="action-button delete">Delete</button>
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

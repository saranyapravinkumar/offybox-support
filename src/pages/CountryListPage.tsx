import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '../store/locationStore';

export function CountryListPage() {
    const countries = useLocationStore((state) => state.countries);
    const isLoading = useLocationStore((state) => state.isLoading);
    const error = useLocationStore((state) => state.error);
    const fetchCountries = useLocationStore((state) => state.fetchCountries);
    const deleteCountry = useLocationStore((state) => state.deleteCountry);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const filteredCountries = countries.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            await deleteCountry(id);
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Countries</h1>
                    <p>Manage country list</p>
                </div>
                <button onClick={() => navigate('/countries/create')} className="primary-button">
                    + Add Country
                </button>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-container">
                {isLoading ? (
                    <div className="loading-state">Loading countries...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCountries.length === 0 ? (
                                <tr><td colSpan={4} className="empty-state">No countries found</td></tr>
                            ) : (
                                filteredCountries.map((c) => (
                                    <tr key={c.id}>
                                        <td className="tenant-name">{c.name}</td>
                                        <td>{c.code}</td>
                                        <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                                        <td className="actions-cell">
                                            <button onClick={() => navigate(`/countries/${c.id}/edit`)} className="action-button edit">Edit</button>
                                            <button onClick={() => handleDelete(c.id, c.name)} className="action-button delete">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

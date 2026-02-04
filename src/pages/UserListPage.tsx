import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { User, Mail, Phone, Calendar, ShieldCheck, UserMinus, Plus } from 'lucide-react';

export function UserListPage() {
    const { users, isLoading, error, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>Support Users</h1>
                    <p>Manage and monitor your support team members.</p>
                </div>
                <Link to="/users/create" className="primary-button" style={{ textDecoration: 'none' }}>
                    <Plus size={20} />
                    Add User
                </Link>
            </div>

            {error && (
                <div className="error-message" style={{ marginBottom: '24px' }}>
                    {error}
                </div>
            )}

            <div className="table-container">
                {isLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Fetching users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        <User size={48} className="empty-icon" />
                        <h3>No users found</h3>
                        <p>Start by adding your first support team member.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact Information</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info-cell">
                                            <div className="user-avatar-small">
                                                {user.first_name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="tenant-name">{user.first_name || 'New'} {user.last_name || 'User'}</div>
                                                <div className="code">#{user.id?.slice(0, 8) || '......'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contact-info">
                                            <div className="info-item">
                                                <Mail size={14} />
                                                <span>{user.email || 'N/A'}</span>
                                            </div>
                                            <div className="info-item">
                                                <Phone size={14} />
                                                <span>{user.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                                            {user.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="info-item">
                                            <Calendar size={14} />
                                            <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                                            <button className="action-button edit" title="Edit Permissions">
                                                <ShieldCheck size={16} />
                                            </button>
                                            <button className="action-button delete" title="Disable User">
                                                <UserMinus size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Save, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function UserCreatePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const addUser = useUserStore((state) => state.addUser);
    const updateUser = useUserStore((state) => state.updateUser);
    const fetchUsers = useUserStore((state) => state.fetchUsers);
    const users = useUserStore((state) => state.users);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        status: 'ACTIVE'
    });

    // Check if user is authenticated
    useEffect(() => {
        if (!isAuthenticated || !token) {
            console.error('❌ Not authenticated! Redirecting to login...');
            alert('Please login first to add users');
            navigate('/login');
        }
    }, [isAuthenticated, token, navigate]);

    // Fetch users if in edit mode and list is empty
    useEffect(() => {
        if (isEditMode && users.length === 0) {
            console.log('📋 Edit mode but no users loaded, fetching users list...');
            fetchUsers();
        }
    }, [isEditMode, users.length, fetchUsers]);

    // Load user data from the users list when in edit mode
    useEffect(() => {
        if (isEditMode && id && users.length > 0) {
            console.log('📝 Edit mode detected, finding user with ID:', id);
            const currentUser = users.find(u => u.id === id);

            if (currentUser) {
                console.log('✅ Found user, populating form:', currentUser);
                setFormData({
                    first_name: currentUser.first_name || '',
                    last_name: currentUser.last_name || '',
                    email: currentUser.email || '',
                    phone: currentUser.phone || '',
                    password: '', // Never populate password for security
                    status: currentUser.status || 'ACTIVE'
                });
            } else {
                console.warn('⚠️ User not found in list, ID:', id);
            }
        }
    }, [isEditMode, id, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Double-check authentication
        if (!isAuthenticated || !token) {
            alert('Please login first to add users');
            navigate('/login');
            return;
        }

        let success = false;
        if (isEditMode && id) {
            console.log('🔄 Updating user:', id);
            success = await updateUser(id, formData);
        } else {
            console.log('➕ Creating new user');
            success = await addUser(formData);
        }

        if (success) {
            navigate('/users');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Don't render if not authenticated
    if (!isAuthenticated || !token) {
        return (
            <div className="content-container">
                <div className="error-message">
                    <AlertCircle size={20} />
                    Please login first to add users. Redirecting...
                </div>
            </div>
        );
    }

    return (
        <div className="content-container">
            <div className="content-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/users" className="back-link-icon">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1>{isEditMode ? 'Edit Support User' : 'Add Support User'}</h1>
                        <p>{isEditMode ? 'Update support team member information.' : 'Create a new account for a support team member.'}</p>
                    </div>
                </div>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="premium-form">
                    {error && (
                        <div className="error-message" style={{ marginBottom: '24px' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="John"
                                required
                                className="premium-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Doe"
                                required
                                className="premium-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john.doe@loadmin.com"
                            required
                            className="premium-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            required
                            className="premium-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required={!isEditMode}
                                className="premium-input"
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#64748b'
                                }}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Account Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="premium-select"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div className="form-actions" style={{ marginTop: '32px' }}>
                        <Link to="/users" className="secondary-button" style={{ textDecoration: 'none' }}>
                            Cancel
                        </Link>
                        <button type="submit" className="primary-button" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={18} /> {isEditMode ? 'Updating...' : 'Saving...'}</>
                            ) : (
                                <><Save size={18} /> {isEditMode ? 'Update User' : 'Save User'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

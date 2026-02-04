import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, User, Mail, Phone, Lock, Save, Loader2, AlertCircle } from 'lucide-react';

export function UserCreatePage() {
    const navigate = useNavigate();
    const addUser = useUserStore((state) => state.addUser);
    const isLoading = useUserStore((state) => state.isLoading);
    const error = useUserStore((state) => state.error);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Double-check authentication
        if (!isAuthenticated || !token) {
            alert('Please login first to add users');
            navigate('/login');
            return;
        }

        const success = await addUser(formData);
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
                        <h1>Add Support User</h1>
                        <p>Create a new account for a support team member.</p>
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
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john.doe@loadmin.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone className="input-icon" size={18} />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
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
                                <><Loader2 className="animate-spin" size={18} /> Saving...</>
                            ) : (
                                <><Save size={18} /> Save User</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

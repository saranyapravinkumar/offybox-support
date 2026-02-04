import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const register = useAuthStore((state) => state.register);
    const login = useAuthStore((state) => state.login);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    // Check if already logged in as admin
    useEffect(() => {
        if (!isAuthenticated) {
            setError('⚠️ You must be logged in as an admin to add new users. Please login first.');
        }
    }, [isAuthenticated]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');

        const { first_name, last_name, email, phone, password } = formData;
        if (!first_name || !last_name || !email || !phone || !password) {
            setError('Please fill in all fields to create your account');
            return;
        }

        setIsLoading(true);

        try {
            setStatusMessage('📝 Creating user account...');
            console.log('🚀 [Register] Starting registration for:', email);

            const result = await register(formData);

            if (result) {
                console.log('✅ [Register] Registration successful!');
                setStatusMessage('✅ User created successfully! Logging in...');

                // Wait a moment then auto-login with the same credentials
                await new Promise(resolve => setTimeout(resolve, 1000));

                try {
                    setStatusMessage('🔐 Logging in with your new credentials...');
                    const loginSuccess = await login(email, password);

                    if (loginSuccess) {
                        console.log('✅ [Register] Auto-login successful!');
                        setSuccess(true);
                        setStatusMessage('🎉 Success! Redirecting to dashboard...');
                        setTimeout(() => navigate('/dashboard'), 1500);
                    } else {
                        setSuccess(true);
                        setStatusMessage('✅ Account created! Please login manually.');
                        setTimeout(() => navigate('/login'), 2000);
                    }
                } catch (loginErr: any) {
                    console.warn('⚠️ [Register] Auto-login failed:', loginErr.message);
                    setSuccess(true);
                    setStatusMessage('✅ Account created! Redirecting to login page...');
                    setTimeout(() => navigate('/login'), 2000);
                }
            }
        } catch (err: any) {
            console.error('❌ [Register] Registration failed:', err.message);
            setError(err.message || 'Registration failed. Please check your admin permissions.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <Building2 size={32} />
                    </div>
                    <h1>Add New User</h1>
                    <p>Create a new support member account for Offybox.</p>
                </div>

                {success ? (
                    <div className="success-message" style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        padding: '24px',
                        borderRadius: '16px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>🎉 Welcome Aboard!</div>
                        <p style={{ fontSize: '0.95rem', marginBottom: '16px' }}>Account has been successfully created!</p>
                        <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{statusMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {statusMessage && !error && (
                            <div style={{
                                background: '#eff6ff',
                                border: '1px solid #93c5fd',
                                color: '#1e40af',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                fontSize: '14px'
                            }}>
                                {statusMessage}
                            </div>
                        )}

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                    disabled={isLoading}
                                    required
                                    style={{ paddingLeft: '16px' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                    disabled={isLoading}
                                    required
                                    style={{ paddingLeft: '16px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">User ID / Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Choose User ID or Email"
                                disabled={isLoading}
                                required
                                style={{ paddingLeft: '16px' }}
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
                                placeholder="Enter contact number"
                                disabled={isLoading}
                                required
                                style={{ paddingLeft: '16px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    disabled={isLoading}
                                    required
                                    style={{ paddingLeft: '16px', paddingRight: '45px' }}
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
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="login-button" disabled={isLoading || !isAuthenticated}>
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> {statusMessage || 'Processing...'}</>
                            ) : 'Create User & Login'}
                        </button>

                        {!isAuthenticated && (
                            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: '#dc2626' }}>
                                <Link to="/login" style={{ color: '#dc2626', fontWeight: '600', textDecoration: 'underline' }}>
                                    Please login as admin first
                                </Link>
                            </div>
                        )}

                        <div className="login-footer">
                            Already have an account? <Link to="/login" style={{ color: '#0f766e', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
                        </div>
                    </form>
                )}

                <Link to="/login" className="back-link" style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', textDecoration: 'none' }}>
                    <ArrowLeft size={16} />
                    Return to Login
                </Link>
            </div>
        </div>
    );
}

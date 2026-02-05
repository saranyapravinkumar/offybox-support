import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter your Email Address and Password');
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid Email Address or Password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Panel - Brand */}
            <div className="login-left-panel">
                <div className="login-panel-content">
                    <h1>Welcome to<br />Offybox Support</h1>
                    <p>Streamline your office operations with powerful management tools designed for modern businesses.</p>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '40px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.9rem' }}>Inventory</span>
                        <span style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.9rem' }}>Scheduling</span>
                        <span style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '0.9rem' }}>Analytics</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="login-right-panel">
                <div className="login-card">
                    <div className="login-header">
                        <div style={{ color: 'var(--primary-color)', fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Building2 size={40} />
                            <span>Offybox</span>
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', color: '#1e293b' }}>Sign In</h2>
                        <p style={{ color: '#64748b' }}>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    required
                                    className="premium-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label htmlFor="password" style={{ fontWeight: '600' }}>Password</label>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    required
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
                                        color: '#94a3b8'
                                    }}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#64748b' }}>
                                <input type="checkbox" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
                                <span>Remember me</span>
                            </label>
                            <a href="#" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</a>
                        </div>

                        <button type="submit" className="login-button" disabled={isLoading} style={{ marginTop: '10px' }}>
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Sign In...</>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

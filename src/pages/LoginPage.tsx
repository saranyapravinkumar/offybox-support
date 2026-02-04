import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            setError('Please enter your User ID/Email and Password');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Sending login request for ID:', email);
            const success = await login(email, password);
            if (success) {
                console.log('Login successful! Navigating to dashboard...');
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Login form caught error:', err.message);
            setError(err.message || 'Invalid User ID or Password. Please try again.');
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
                    <h1>Offybox</h1>
                    <p>Enter your credentials to access the portal.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">User ID / Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your ID or email"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
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

                    <div className="login-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Keep me signed in</span>
                        </label>
                        <Link to="/forgot-password" style={{ color: '#0f766e', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</Link>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="animate-spin" size={20} /> Authenticating...</>
                        ) : 'Sign In'}
                    </button>

                    <div className="login-footer">
                        Need an account? <Link to="/register" style={{ color: '#0f766e', fontWeight: '600', textDecoration: 'none' }}>Create Account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

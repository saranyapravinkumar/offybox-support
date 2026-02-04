import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const forgotPassword = useAuthStore((state) => state.forgotPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
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
                    <h1>Forgot Password?</h1>
                    <p>No worries, we'll send you reset instructions.</p>
                </div>

                {submitted ? (
                    <div className="success-message" style={{
                        textAlign: 'center',
                        padding: '24px 0'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#ecfdf5',
                            color: '#059669',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Check your email</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                            We've sent a password reset link to <br /><strong>{email}</strong>
                        </p>
                        <Link to="/login" className="login-button" style={{ textDecoration: 'none' }}>
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="error-message">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email / User ID</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Sending Instructions...</>
                            ) : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="login-footer" style={{ marginTop: '32px' }}>
                    <Link to="/login" className="back-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', textDecoration: 'none' }}>
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function DebugRegistrationPage() {
    const [formData, setFormData] = useState({
        first_name: 'sara',
        last_name: 'Praveen',
        email: 'sarany@infopack.co.in',
        phone: '9342093321',
        password: 'Saran@1996',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const testRegistration = async () => {
        setIsLoading(true);
        setResult(null);
        setError(null);

        const payload = {
            id: "",
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            status: 'ACTIVE'
        };

        console.log('🧪 [DEBUG] Testing API with payload:', payload);

        try {
            const response = await axios.post('https://api.offybox.com/v1/support/users', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('✅ [DEBUG] SUCCESS!', response.data);
            setResult(response.data);
        } catch (err: any) {
            console.error('❌ [DEBUG] FAILED!', err);
            setError({
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="content-container">
            <div className="content-header">
                <div>
                    <h1>🧪 Registration API Debug Tool</h1>
                    <p>Test the /support/users API directly</p>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="form-container">
                    <div className="premium-form">
                        <h3 style={{ marginBottom: '20px' }}>Test Data</h3>

                        <div className="form-group">
                            <label>First Name</label>
                            <input name="first_name" value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} />
                        </div>

                        <button
                            onClick={testRegistration}
                            className="primary-button"
                            disabled={isLoading}
                            style={{ marginTop: '20px' }}
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={18} /> Testing API...</>
                            ) : '🧪 Test API Call'}
                        </button>
                    </div>
                </div>

                {result && (
                    <div style={{
                        marginTop: '24px',
                        padding: '24px',
                        background: '#ecfdf5',
                        border: '2px solid #10b981',
                        borderRadius: '12px'
                    }}>
                        <h3 style={{ color: '#059669', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={24} />
                            ✅ SUCCESS! API Response:
                        </h3>
                        <pre style={{
                            background: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            overflow: 'auto',
                            fontSize: '14px',
                            border: '1px solid #a7f3d0'
                        }}>
                            {JSON.stringify(result, null, 2)}
                        </pre>
                        <div style={{ marginTop: '16px', padding: '12px', background: 'white', borderRadius: '8px' }}>
                            <strong style={{ color: '#059669' }}>🆔 Generated ID:</strong>
                            <code style={{
                                marginLeft: '8px',
                                padding: '4px 8px',
                                background: '#f0fdf4',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}>
                                {result.id || 'NO ID FOUND!'}
                            </code>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{
                        marginTop: '24px',
                        padding: '24px',
                        background: '#fef2f2',
                        border: '2px solid #ef4444',
                        borderRadius: '12px'
                    }}>
                        <h3 style={{ color: '#dc2626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={24} />
                            ❌ ERROR! API Failed:
                        </h3>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                            <strong>Status:</strong> {error.status} - {error.statusText}
                        </div>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
                            <strong>Message:</strong> {error.message}
                        </div>
                        <pre style={{
                            background: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            overflow: 'auto',
                            fontSize: '14px',
                            border: '1px solid #fecaca'
                        }}>
                            {JSON.stringify(error.data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}

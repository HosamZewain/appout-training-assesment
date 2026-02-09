'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/admin/dashboard');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-20">
            <div className="max-w-md mx-auto fade-in">
                <h1 className="text-4xl font-bold text-center mb-3">Admin Login</h1>
                <p className="text-center text-secondary mb-8">Access the applicant management dashboard</p>

                <div className="glass-card">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email" className="input-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="input-field"
                                placeholder="admin@appout.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password" className="input-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-6"
                        >
                            {loading ? <span className="spinner"></span> : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-sm text-center text-secondary">
                        <p>Default credentials:</p>
                        <p>Email: admin@appout.com</p>
                        <p>Password: admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

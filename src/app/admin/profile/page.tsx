'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, Lock, Check, AlertCircle, Save, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: session?.user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!formData.currentPassword) {
            setError('Current password is required to make changes');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword || undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setSuccessMessage(data.message);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));

            // If email changed, update session
            if (formData.email !== session?.user?.email) {
                await update({ ...session, user: { ...session?.user, email: formData.email } });
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                        <User className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>
                        <p className="text-slate-500">Manage your account settings and security</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status Messages */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-600">
                            <Check size={20} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Email Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
                            Contact Information
                        </h3>
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            leftIcon={<Mail size={18} />}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">
                            Security
                        </h3>

                        <div className="grid gap-4">
                            <Input
                                label="Current Password (Required)"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                leftIcon={<Lock size={18} />}
                                placeholder="Enter current password to save changes"
                                required
                            />

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    leftIcon={<Lock size={18} />}
                                    placeholder="Leave blank to keep current"
                                />
                                <Input
                                    label="Confirm New Password"
                                    name="confirmNewPassword"
                                    type="password"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    leftIcon={<Lock size={18} />}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            isLoading={isLoading}
                            leftIcon={<Save size={18} />}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

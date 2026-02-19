'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ApplyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        residenceCity: '',
        residenceGovernorate: '',
        canAttendTanta: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const egyptGovernates = [
        'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira', 'Fayoum',
        'Gharbia', 'Ismailia', 'Monufia', 'Minya', 'Qalyubia', 'Kafr El Sheikh',
        'Luxor', 'Qena', 'Sohag', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said',
        'Damietta', 'Zagazig', 'Sharqia', 'Suez', 'North Sinai', 'South Sinai',
        'New Valley', 'Matruh'
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName || formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Full name must be at least 3 characters';
        }

        if (!formData.mobile || !/^01[0-1,2,5][0-9]{8}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid Egyptian mobile number (e.g., 010...)';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.residenceCity.trim()) {
            newErrors.residenceCity = 'City is required';
        }

        if (!formData.residenceGovernorate) {
            newErrors.residenceGovernorate = 'Governorate is required';
        }

        if (!formData.canAttendTanta) {
            newErrors.canAttendTanta = 'Please select an option';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const tempFormData = {
                ...formData,
                canAttendTanta: formData.canAttendTanta === 'yes'
            };

            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tempFormData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit application');
            }

            // Store application ID for assessment
            sessionStorage.setItem('applicationId', data.id);
            router.push('/assessment');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-12 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Start Your Journey
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Tell us a bit about yourself. It only takes 2 minutes.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-card text-card-foreground p-8 border border-border rounded-xl shadow-sm"
                >
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 overflow-hidden"
                            >
                                <span className="text-xl">⚠️</span>
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            placeholder="e.g. Ahmed Mohamed"
                            leftIcon={<User className="w-5 h-5" />}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Mobile Number"
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                error={errors.mobile}
                                placeholder="01XXXXXXXXX"
                                maxLength={11}
                                leftIcon={<Phone className="w-5 h-5" />}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                placeholder="you@example.com"
                                leftIcon={<Mail className="w-5 h-5" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label htmlFor="residenceGovernorate" className="block text-sm font-medium text-slate-600 ml-1">
                                    Governorate <span className="text-red-400">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <select
                                        id="residenceGovernorate"
                                        name="residenceGovernorate"
                                        value={formData.residenceGovernorate}
                                        onChange={handleChange}
                                        className={`w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 appearance-none ${errors.residenceGovernorate ? 'border-red-500/50' : ''}`}
                                    >
                                        <option value="">Select Governorate</option>
                                        {egyptGovernates.map(gov => (
                                            <option key={gov} value={gov} className="bg-white">{gov}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        ▼
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {errors.residenceGovernorate && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mt-1.5 ml-1 text-sm text-red-400"
                                        >
                                            {errors.residenceGovernorate}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Input
                                label="City"
                                id="residenceCity"
                                name="residenceCity"
                                value={formData.residenceCity}
                                onChange={handleChange}
                                error={errors.residenceCity}
                                placeholder="e.g. Nasr City"
                                leftIcon={<Building2 className="w-5 h-5" />}
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="block text-sm font-medium text-slate-600 ml-1">
                                Can you attend 2 days per week in Tanta, Gharbia? <span className="text-red-400">*</span>
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['yes', 'no'].map((option) => (
                                    <label
                                        key={option}
                                        className={`
                                            cursor-pointer relative flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                                            ${formData.canAttendTanta === option
                                                ? 'bg-primary/10 border-primary text-primary'
                                                : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted/60 hover:border-muted-foreground/50'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="canAttendTanta"
                                            value={option}
                                            checked={formData.canAttendTanta === option}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="capitalize font-medium text-lg">{option}</span>
                                        {formData.canAttendTanta === option && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                            <AnimatePresence>
                                {errors.canAttendTanta && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="ml-1 text-sm text-red-400"
                                    >
                                        {errors.canAttendTanta}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            fullWidth
                            size="lg"
                            className="mt-8 text-lg py-6"
                        >
                            Continue to Assessment
                        </Button>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}

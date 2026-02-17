'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
    default: {
        bg: 'from-slate-800/50 to-slate-900/50',
        border: 'border-slate-700/50',
        iconBg: 'bg-slate-700/50',
        iconColor: 'text-slate-300',
    },
    primary: {
        bg: 'from-indigo-500/10 to-purple-500/10',
        border: 'border-indigo-500/20',
        iconBg: 'bg-indigo-500/20',
        iconColor: 'text-indigo-400',
    },
    success: {
        bg: 'from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-500/20',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
    },
    warning: {
        bg: 'from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/20',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
    },
    danger: {
        bg: 'from-red-500/10 to-rose-500/10',
        border: 'border-red-500/20',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
    },
};

export function StatsCard({ title, value, icon, trend, variant = 'default' }: StatsCardProps) {
    const styles = variantStyles[variant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
            className={`
                relative overflow-hidden rounded-2xl p-6
                bg-gradient-to-br ${styles.bg}
                border ${styles.border}
                backdrop-blur-xl
            `}
        >
            {/* Background glow effect */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />

            <div className="relative flex items-start justify-between">
                <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>

                    {trend && (
                        <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                            <span className="text-slate-500">vs last week</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

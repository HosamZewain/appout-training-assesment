'use client';

import { motion } from 'framer-motion';

interface ScoreRingProps {
    score: number;
    maxScore?: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
}

const sizeConfig = {
    sm: { size: 80, strokeWidth: 6, fontSize: 'text-lg' },
    md: { size: 120, strokeWidth: 8, fontSize: 'text-2xl' },
    lg: { size: 160, strokeWidth: 10, fontSize: 'text-4xl' },
};

export function ScoreRing({ score, maxScore = 100, size = 'md', showLabel = true, label }: ScoreRingProps) {
    const config = sizeConfig[size];
    const percentage = Math.min((score / maxScore) * 100, 100);
    const radius = (config.size - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Color based on score
    const getColor = () => {
        if (percentage >= 80) return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' }; // emerald
        if (percentage >= 60) return { stroke: '#6366f1', glow: 'rgba(99, 102, 241, 0.3)' }; // indigo
        if (percentage >= 40) return { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' }; // amber
        return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' }; // red
    };

    const colors = getColor();

    return (
        <div className="relative inline-flex flex-col items-center">
            <svg
                width={config.size}
                height={config.size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={config.size / 2}
                    cy={config.size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={config.strokeWidth}
                    className="text-slate-800"
                />

                {/* Animated progress circle */}
                <motion.circle
                    cx={config.size / 2}
                    cy={config.size / 2}
                    r={radius}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth={config.strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                        filter: `drop-shadow(0 0 8px ${colors.glow})`,
                    }}
                />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`${config.fontSize} font-bold text-white`}>
                    {score.toFixed(1)}%
                </span>
            </div>

            {/* Label */}
            {showLabel && label && (
                <span className="mt-2 text-sm text-slate-400">{label}</span>
            )}
        </div>
    );
}

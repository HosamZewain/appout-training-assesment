import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, wrapperClassName, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className={cn('w-full', wrapperClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300 mb-1.5 ml-1"
                    >
                        {label} {props.required && <span className="text-red-400">*</span>}
                    </label>
                )}

                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all duration-200',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1.5 ml-1 text-sm text-red-400"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';

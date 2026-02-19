'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, Clock, Code2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
                <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center text-center"
                >
                    {/* Hero Section */}
                    <div className="mb-16 max-w-4xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-sm font-semibold">Now accepting applications</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                            Full-Stack Developer <br /> Training Program
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Master the modern web stack. Join our elite training program and launch your career as a professional developer.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/apply">
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-shadow"
                                >
                                    Start Application
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold text-lg border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16"
                    >
                        {[
                            { value: '8+', label: 'Technology Areas' },
                            { value: '20-30', label: 'Minutes to Complete' },
                            { value: '48h', label: 'Review Time' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Main CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="max-w-3xl w-full p-8 md:p-12 relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
                    >
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/50 to-transparent rounded-full -mr-20 -mt-20" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4">
                                <Code2 className="w-4 h-4" />
                                Technical Assessment
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                                Ready to Prove Your Skills?
                            </h2>
                            <p className="text-slate-500 mb-8 text-lg leading-relaxed max-w-xl">
                                Our assessment covers the full spectrum of modern web development, from semantic HTML to scalable backend architecture.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                                {[
                                    { text: "HTML5 & CSS3 Mastery", color: "text-orange-500", bg: "bg-orange-50" },
                                    { text: "JavaScript & TypeScript", color: "text-yellow-600", bg: "bg-yellow-50" },
                                    { text: "React & Next.js", color: "text-cyan-600", bg: "bg-cyan-50" },
                                    { text: "Node.js & Databases", color: "text-emerald-600", bg: "bg-emerald-50" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100"
                                    >
                                        <div className={`p-1.5 rounded-lg ${item.bg}`}>
                                            <CheckCircle2 className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Approx. 20-30 minutes</span>
                                </div>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Instant scoring</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features Grid */}
                    <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                        {[
                            {
                                icon: <FileText className="w-7 h-7" />,
                                title: "Simple Application",
                                desc: "Quick and easy application process with basic personal information designed to get you started fast.",
                                gradient: "from-blue-500 to-cyan-500",
                                bg: "bg-blue-50",
                                border: "hover:border-blue-300"
                            },
                            {
                                icon: <Zap className="w-7 h-7" />,
                                title: "Comprehensive Test",
                                desc: "Challenge yourself with questions across 8 key technology areas designed to evaluate your true potential.",
                                gradient: "from-purple-500 to-pink-500",
                                bg: "bg-purple-50",
                                border: "hover:border-purple-300"
                            },
                            {
                                icon: <ArrowRight className="w-7 h-7" />,
                                title: "Fast Review",
                                desc: "Our HR team reviews applications daily. Successful candidates are contacted within 48 hours.",
                                gradient: "from-indigo-500 to-blue-500",
                                bg: "bg-indigo-50",
                                border: "hover:border-indigo-300"
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                whileHover={{ y: -6 }}
                                className={`bg-white text-left p-8 border border-slate-200 ${feature.border} transition-all rounded-2xl shadow-sm hover:shadow-lg group`}
                            >
                                <div className={`mb-6 p-3.5 rounded-2xl ${feature.bg} w-fit inline-flex`}>
                                    <div className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-20 text-center"
                    >
                        <p className="text-slate-500 mb-6 text-lg">Ready to take the first step?</p>
                        <Link href="/apply">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-shadow"
                            >
                                Apply Now
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

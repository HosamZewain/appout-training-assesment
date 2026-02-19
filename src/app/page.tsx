'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
    return (
        <div className="container py-20 relative z-10">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-sm font-medium">Now accepting applications</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight" style={{
                        background: 'var(--color-gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Full-Stack Developer <br /> Training Program
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Master the modern web stack. Join our elite training program and launch your career as a professional developer.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/apply">
                            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                Start Application
                            </Button>
                        </Link>
                        <Button variant="secondary" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                            Learn More
                        </Button>
                    </div>
                </div>

                {/* Main CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="bg-card text-card-foreground max-w-3xl w-full p-8 md:p-12 relative overflow-hidden group rounded-xl border border-border shadow-sm"
                >
                    <div className="absolute top-0 right-0 p-12 bg-primary/20 blur-3xl rounded-full -mr-20 -mt-20 transition-all duration-1000 group-hover:bg-accent/20"></div>

                    <h2 className="text-3xl font-bold mb-6 relative z-10">Ready to Prove Your Skills?</h2>
                    <p className="text-muted-foreground mb-8 text-lg relative z-10">
                        Our assessment covers the full spectrum of modern web development, from semantic HTML to scalable backend architecture.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                        {[
                            "HTML5 & CSS3 Mastery",
                            "JavaScript & TypeScript",
                            "React & Next.js",
                            "Node.js & Databases"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-foreground">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Approx. 20-30 minutes</span>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {[
                        {
                            icon: <FileText className="w-8 h-8 text-blue-400" />,
                            title: "Simple Application",
                            desc: "Quick and easy application process with basic personal information designed to get you started fast."
                        },
                        {
                            icon: <CheckCircle2 className="w-8 h-8 text-purple-400" />,
                            title: "Comprehensive Test",
                            desc: "Challenge yourself with questions across 8 key technology areas designed to evaluate your true potential."
                        },
                        {
                            icon: <ArrowRight className="w-8 h-8 text-pink-400" />,
                            title: "Fast Review",
                            desc: "Our HR team reviews applications daily. Successful candidates are contacted within 48 hours."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            whileHover={{ y: -5 }}
                            className="bg-card text-card-foreground text-left p-8 border border-border hover:border-primary/50 transition-colors rounded-xl shadow-sm"
                        >
                            <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit inline-block">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

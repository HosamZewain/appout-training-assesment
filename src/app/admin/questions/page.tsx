'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Search,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
} from 'lucide-react';

interface Option {
    id?: string;
    text: string;
    isCorrect: boolean;
    orderIndex: number;
}

interface Question {
    id: string;
    category: string;
    text: string;
    type: string;
    difficulty: string;
    points: number;
    orderIndex: number;
    options: Option[];
}

const CATEGORIES = ['HTML', 'CSS', 'JAVASCRIPT', 'REACT', 'ANGULAR', 'NODE', 'MONGODB', 'MYSQL', 'GENERAL'];
const TYPES = ['MCQ', 'SHORT_ANSWER'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

const categoryColors: Record<string, string> = {
    HTML: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400',
    CSS: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    JAVASCRIPT: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400',
    REACT: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    ANGULAR: 'from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400',
    NODE: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    MONGODB: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
    MYSQL: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400',
    GENERAL: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400',
};

const difficultyColors: Record<string, string> = {
    EASY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    HARD: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const emptyQuestion = {
    category: 'HTML',
    text: '',
    type: 'MCQ',
    difficulty: 'EASY',
    points: 1,
    options: [
        { text: '', isCorrect: true, orderIndex: 0 },
        { text: '', isCorrect: false, orderIndex: 1 },
        { text: '', isCorrect: false, orderIndex: 2 },
        { text: '', isCorrect: false, orderIndex: 3 },
    ],
};

export default function QuestionsPage() {
    const { status: authStatus } = useSession();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [formData, setFormData] = useState(emptyQuestion);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }
        if (authStatus === 'authenticated') {
            fetchQuestions();
        }
    }, [authStatus, router]);

    useEffect(() => {
        if (authStatus === 'authenticated') {
            fetchQuestions();
        }
    }, [categoryFilter, authStatus]);

    const fetchQuestions = async () => {
        try {
            const params = new URLSearchParams();
            if (categoryFilter) params.append('category', categoryFilter);
            const response = await fetch(`/api/admin/questions?${params}`);
            const data = await response.json();
            setQuestions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingQuestion(null);
        setFormData({ ...emptyQuestion, options: emptyQuestion.options.map(o => ({ ...o })) });
        setShowModal(true);
    };

    const openEditModal = (question: Question) => {
        setEditingQuestion(question);
        setFormData({
            category: question.category,
            text: question.text,
            type: question.type,
            difficulty: question.difficulty,
            points: question.points,
            options: question.type === 'MCQ' && question.options.length > 0
                ? question.options.map(o => ({ text: o.text, isCorrect: o.isCorrect, orderIndex: o.orderIndex }))
                : emptyQuestion.options.map(o => ({ ...o })),
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.text.trim()) return;
        setSaving(true);

        try {
            const payload = {
                ...formData,
                options: formData.type === 'MCQ' ? formData.options.filter(o => o.text.trim()) : [],
                ...(editingQuestion ? { id: editingQuestion.id } : {}),
            };

            const response = await fetch('/api/admin/questions', {
                method: editingQuestion ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowModal(false);
                setSuccessMsg(editingQuestion ? 'Question updated!' : 'Question created!');
                setTimeout(() => setSuccessMsg(''), 3000);
                fetchQuestions();
            }
        } catch (error) {
            console.error('Error saving question:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await fetch(`/api/admin/questions?id=${deleteId}`, { method: 'DELETE' });
            setDeleteId(null);
            setSuccessMsg('Question deleted!');
            setTimeout(() => setSuccessMsg(''), 3000);
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const updateOption = (index: number, field: string, value: string | boolean) => {
        const newOptions = [...formData.options];
        if (field === 'isCorrect' && value === true) {
            // Only one correct answer
            newOptions.forEach((o, i) => { o.isCorrect = i === index; });
        } else {
            (newOptions[index] as Record<string, string | boolean | number>)[field] = value;
        }
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: '', isCorrect: false, orderIndex: formData.options.length }],
        });
    };

    const removeOption = (index: number) => {
        if (formData.options.length <= 2) return;
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const filtered = questions.filter(q =>
        !search || q.text.toLowerCase().includes(search.toLowerCase())
    );

    if (authStatus === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-500">Loading questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success Toast */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl backdrop-blur-xl"
                    >
                        <CheckCircle2 size={18} />
                        {successMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-slate-800">Questions</h1>
                    <p className="text-slate-500 mt-1">Manage assessment questions across all categories</p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
                >
                    <Plus size={18} />
                    Add Question
                </motion.button>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all cursor-pointer min-w-[180px]"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 text-sm text-slate-500"
            >
                <span>Showing <span className="text-slate-800 font-medium">{filtered.length}</span> questions</span>
                <span>•</span>
                <span>MCQ: <span className="text-slate-800 font-medium">{filtered.filter(q => q.type === 'MCQ').length}</span></span>
                <span>•</span>
                <span>Short Answer: <span className="text-slate-800 font-medium">{filtered.filter(q => q.type === 'SHORT_ANSWER').length}</span></span>
            </motion.div>

            {/* Questions List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
            >
                {filtered.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                        <HelpCircle size={48} className="mx-auto mb-4 text-slate-600" />
                        <p className="text-slate-500">No questions found</p>
                        <p className="text-slate-600 text-sm mt-1">Try adjusting your filters or add a new question</p>
                    </div>
                ) : (
                    filtered.map((question, idx) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * idx }}
                            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border bg-gradient-to-r ${categoryColors[question.category] || categoryColors.GENERAL}`}>
                                            {question.category}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${difficultyColors[question.difficulty]}`}>
                                            {question.difficulty}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                            {question.type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                                            {question.points} pts
                                        </span>
                                    </div>

                                    {/* Question Text */}
                                    <p className="text-slate-800 leading-relaxed">{question.text}</p>

                                    {/* Options Preview */}
                                    {question.type === 'MCQ' && question.options.length > 0 && (
                                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {question.options.map((opt) => (
                                                <div
                                                    key={opt.id || opt.orderIndex}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${opt.isCorrect
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                                                        }`}
                                                >
                                                    {opt.isCorrect && <CheckCircle2 size={14} />}
                                                    <span className="truncate">{opt.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(question)}
                                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(question.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h2 className="text-xl font-semibold text-slate-800">
                                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* Row: Category, Type, Difficulty, Points */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-600 block mb-1.5">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-600 block mb-1.5">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            {TYPES.map(t => <option key={t} value={t}>{t === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-600 block mb-1.5">Difficulty</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-600 block mb-1.5">Points</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={formData.points}
                                            onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div>
                                    <label className="text-sm text-slate-600 block mb-1.5">Question Text</label>
                                    <textarea
                                        rows={3}
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        placeholder="Enter the question text..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                    />
                                </div>

                                {/* Options (MCQ only) */}
                                {formData.type === 'MCQ' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm text-slate-600">Answer Options</label>
                                            <button
                                                onClick={addOption}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                            >
                                                <Plus size={14} /> Add Option
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.options.map((opt, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateOption(idx, 'isCorrect', true)}
                                                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect
                                                            ? 'border-emerald-500 bg-emerald-500/20'
                                                            : 'border-slate-600 hover:border-slate-500'
                                                            }`}
                                                    >
                                                        {opt.isCorrect && <CheckCircle2 size={14} className="text-emerald-400" />}
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={(e) => updateOption(idx, 'text', e.target.value)}
                                                        placeholder={`Option ${idx + 1}`}
                                                        className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                    />
                                                    {formData.options.length > 2 && (
                                                        <button
                                                            onClick={() => removeOption(idx)}
                                                            className="shrink-0 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Click the circle to mark the correct answer</p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !formData.text.trim()}
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                                >
                                    {saving ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <AlertCircle size={20} className="text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">Delete Question</h3>
                            </div>
                            <p className="text-slate-500 mb-6">Are you sure you want to delete this question? This action cannot be undone and will also remove all associated answers.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

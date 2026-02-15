import React, { useState } from 'react';
import { UserRegistration } from '../types/api';
import { userService } from '../services/userService';
import { motion } from 'framer-motion';
import { X, User, Phone, GraduationCap, Github, Linkedin, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface RegisterFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    user: any;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onCancel, user }) => {
    const [formData, setFormData] = useState<UserRegistration>({
        name: user?.name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        college_or_university: user?.college_or_university || '',
        course: user?.course || '',
        year: user?.year || 1,
        gender: user?.gender || 'M',
        github_profile: user?.github_profile || '',
        linkedin_profile: user?.linkedin_profile || '',
    });

    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                phone_number: user.phone_number || prev.phone_number,
                college_or_university: user.college_or_university || prev.college_or_university,
                course: user.course || prev.course,
                year: user.year || prev.year,
                gender: user.gender || prev.gender,
                github_profile: user.github_profile || prev.github_profile,
                linkedin_profile: user.linkedin_profile || prev.linkedin_profile,
            }));
        }
    }, [user]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateUrl = (url: string) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.github_profile && !validateUrl(formData.github_profile)) {
            setError('Please enter a valid GitHub profile URL');
            setLoading(false);
            return;
        }
        if (formData.linkedin_profile && !validateUrl(formData.linkedin_profile)) {
            setError('Please enter a valid LinkedIn profile URL');
            setLoading(false);
            return;
        }

        try {
            await userService.register({
                ...formData,
                email: formData.email || user?.email
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) : value
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto selection:bg-primary/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#050505] border border-white/10 rounded-[2rem] w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] my-8"
            >
                <div className="relative px-8 py-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <button
                        onClick={onCancel}
                        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <h2 className="text-3xl font-bold text-white mb-2">Initialize Profile</h2>
                    <p className="text-white/40 text-sm font-light tracking-wide">Complete your synchronization with Synapse 2026.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    disabled
                                    value={user?.email || formData.email}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white/30 text-sm cursor-not-allowed"
                                />
                                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative">
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                                    placeholder="John Doe"
                                />
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                            <div className="relative">
                                <input
                                    required
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                                    placeholder="+91 9876543210"
                                />
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">College / University</label>
                            <div className="relative">
                                <input
                                    required
                                    name="college_or_university"
                                    value={formData.college_or_university}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                                    placeholder="Your University"
                                />
                                <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Course</label>
                            <input
                                required
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                                placeholder="e.g. B.Tech CSE"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Year of Study</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all appearance-none"
                            >
                                <option value={1} className="bg-black">1st Year</option>
                                <option value={2} className="bg-black">2nd Year</option>
                                <option value={3} className="bg-black">3rd Year</option>
                                <option value={4} className="bg-black">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Gender Identification</label>
                        <div className="flex gap-4">
                            {['M', 'F', 'O'].map((g) => (
                                <label key={g} className="flex-1">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={formData.gender === g}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={cn(
                                        "px-4 py-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer",
                                        formData.gender === g
                                            ? "bg-white text-black border-white"
                                            : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                                    )}>
                                        {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">GitHub Profile (Optional)</label>
                            <div className="relative">
                                <input
                                    name="github_profile"
                                    value={formData.github_profile}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                                    placeholder="https://github.com/..."
                                />
                                <Github className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">LinkedIn Profile (Optional)</label>
                            <div className="relative">
                                <input
                                    name="linkedin_profile"
                                    value={formData.linkedin_profile}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all"
                                    placeholder="https://linkedin.com/..."
                                />
                                <Linkedin className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold text-sm rounded-2xl px-8 py-4 shadow-[0_10px_30px_rgba(5,121,199,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <span>Complete Registration</span>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterForm;

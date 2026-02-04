import React, { useState } from 'react';
import { UserRegistration } from '../types/api';
import { userService } from '../services/userService';

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
            setError('Please enter a valid GitHub profile URL (e.g. https://github.com/username)');
            setLoading(false);
            return;
        }
        if (formData.linkedin_profile && !validateUrl(formData.linkedin_profile)) {
            setError('Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)');
            setLoading(false);
            return;
        }

        try {
            await userService.register({
                ...formData,
                email: formData.email || user?.email // Ensure email is sent even if state update lagged
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-background-dark border border-[#213a4a] rounded-lg w-full max-w-md overflow-hidden shadow-2xl my-4 sm:my-8">
                <div className="bg-primary/10 border-b border-[#213a4a] px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-bold text-base sm:text-lg">Complete Registration</h2>
                        <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-widest font-mono">Join Synapse 2026</p>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <input
                            disabled
                            value={user?.email || formData.email}
                            className="w-full bg-[#1a262f] border border-[#213a4a] rounded-lg px-4 py-2 text-slate-400 text-sm cursor-not-allowed opacity-70"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <input
                                required
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">College / University</label>
                        <input
                            required
                            name="college_or_university"
                            value={formData.college_or_university}
                            onChange={handleChange}
                            className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                            placeholder="Your University Name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course</label>
                            <input
                                required
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="B.Tech CS"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year</label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors appearance-none"
                            >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                        <div className="flex gap-4">
                            {['M', 'F', 'O'].map((g) => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={formData.gender === g}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`size-4 rounded-full border-2 flex items-center justify-center transition-colors ${formData.gender === g ? 'border-primary bg-primary/20' : 'border-[#213a4a] group-hover:border-slate-500'}`}>
                                        {formData.gender === g && <div className="size-1.5 rounded-full bg-primary" />}
                                    </div>
                                    <span className="text-sm text-slate-300">{g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Other'}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub (Optional)</label>
                            <input
                                name="github_profile"
                                value={formData.github_profile}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn (Optional)</label>
                            <input
                                name="linkedin_profile"
                                value={formData.linkedin_profile}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-2.5 rounded-lg border border-[#213a4a] text-slate-400 font-bold text-sm hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg px-6 py-2.5 shadow-[0_0_20px_rgba(5,121,199,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                                    Registering...
                                </>
                            ) : (
                                'Complete Signup'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;

import React, { useState } from 'react';
import { UserRegistration } from '../types/api';
import { userService } from '../services/userService';

interface ProfileModalProps {
    onClose: () => void;
    user: any;
    onUpdate: () => void;
    onNotify: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, user, onUpdate, onNotify }) => {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await userService.updateDetails(formData);
            onNotify('Profile updated successfully!', 'success');
            onUpdate();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Failed to update profile. Please try again.';
            setError(errorMessage);
            onNotify(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl selection:bg-primary/30">
            <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="relative px-8 py-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
                    <p className="text-white/40 text-sm font-light tracking-wide">Update your information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl flex items-center gap-3">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">Full Name *</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">Email *</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all opacity-50 cursor-not-allowed placeholder:text-white/20"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">Phone Number *</label>
                            <input
                                required
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                placeholder="+91 9876543210"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">College / University *</label>
                            <input
                                required
                                type="text"
                                name="college_or_university"
                                value={formData.college_or_university}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                placeholder="Institution name"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">Course *</label>
                            <input
                                required
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                placeholder="B.Tech CSE, MBA, etc."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">Year *</label>
                            <select
                                required
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">Gender *</label>
                            <select
                                required
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">GitHub Profile (Optional)</label>
                            <input
                                type="url"
                                name="github_profile"
                                value={formData.github_profile}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1 mb-2 block">LinkedIn Profile (Optional)</label>
                            <input
                                type="url"
                                name="linkedin_profile"
                                value={formData.linkedin_profile}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-black hover:text-white font-bold text-sm rounded-2xl px-6 py-4 transition-all transform active:scale-95"
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;

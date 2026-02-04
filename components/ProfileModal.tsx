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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-background-dark border border-[#213a4a] rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl my-4 sm:my-8">
                <div className="bg-primary/10 border-b border-[#213a4a] px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-white font-bold text-base sm:text-lg">Profile Settings</h2>
                        <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-widest font-mono">Update your information</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Full Name *</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Email *</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors opacity-50 cursor-not-allowed"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Phone Number *</label>
                            <input
                                required
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="+91 9876543210"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">College / University *</label>
                            <input
                                required
                                type="text"
                                name="college_or_university"
                                value={formData.college_or_university}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="Institution name"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Course *</label>
                            <input
                                required
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="B.Tech CSE, MBA, etc."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Year *</label>
                            <select
                                required
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                            >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">Gender *</label>
                            <select
                                required
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">GitHub Profile</label>
                            <input
                                type="url"
                                name="github_profile"
                                value={formData.github_profile}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5 block">LinkedIn Profile</label>
                            <input
                                type="url"
                                name="linkedin_profile"
                                value={formData.linkedin_profile}
                                onChange={handleChange}
                                className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-lg px-4 py-2 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>

                    <div className="pt-3 flex gap-3 border-t border-[#213a4a] mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-[#213a4a] text-slate-400 font-bold text-xs sm:text-sm hover:bg-slate-800 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg transition-all"
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

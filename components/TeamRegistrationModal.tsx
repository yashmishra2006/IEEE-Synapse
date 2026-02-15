import React, { useState } from 'react';
import { userService } from '../services/userService';

interface TeamRegistrationModalProps {
    eventId: string;
    eventName: string;
    onSuccess: (team: any) => void;
    onCancel: () => void;
}

const TeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({ eventId, eventName, onSuccess, onCancel }) => {
    const [teamName, setTeamName] = useState('');
    const [mode, setMode] = useState<'CREATE' | 'JOIN'>('JOIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate inputs
        if (!eventId || !teamName.trim()) {
            setError('Event ID and team code are required');
            setLoading(false);
            return;
        }

        try {
            // Perform action - backend now returns complete team details
            let teamData;
            if (mode === 'CREATE') {
                console.log('Creating team with data:', { eventId, teamName });
                teamData = await userService.registerTeam(eventId, teamName, []);
            } else {
                teamData = await userService.joinTeam(eventId, teamName); // teamName holds the code in JOIN mode
            }

            console.log('Team operation successful, data:', teamData);
            // Pass the team data directly to onSuccess
            onSuccess(teamData);

        } catch (err: any) {
            console.error('Team registration error:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error response detail:', err.response?.data?.detail);
            let errorMessage = `Failed to ${mode.toLowerCase()} team.`;
            if (err.response?.data?.detail) {
                if (Array.isArray(err.response.data.detail)) {
                    // Validation errors from FastAPI
                    errorMessage = err.response.data.detail.map((e: any) =>
                        `${e.loc?.join(' > ') || 'Field'}: ${e.msg}`
                    ).join(', ');
                } else {
                    errorMessage = err.response.data.detail;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl selection:bg-primary/30">
            <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="relative px-8 py-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <button
                        onClick={onCancel}
                        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <h2 className="text-3xl font-bold text-white mb-2">Team Registration</h2>
                    <p className="text-white/40 text-sm font-light tracking-wide">{eventName}</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/10 mb-6">
                        <button
                            onClick={() => setMode('CREATE')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'CREATE' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Create Team
                        </button>
                        <button
                            onClick={() => setMode('JOIN')}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'JOIN' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Join Team
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl flex items-center gap-3">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">
                                {mode === 'CREATE' ? "Team Name" : "Team Code"}
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">
                                    {mode === 'CREATE' ? "groups" : "key"}
                                </span>
                                <input
                                    required
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder={mode === 'CREATE' ? "Enter a unique team name" : "Enter the 5-digit team code"}
                                />
                            </div>
                            <p className="text-[10px] text-white/30 mt-2 px-1 font-light">
                                {mode === 'CREATE'
                                    ? "Create a team and get a code to share with teammates. Team size will be enforced based on the event."
                                    : "Enter the code shared by your Team Leader."}
                            </p>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !teamName.trim()}
                                className="flex-[2] bg-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-black hover:text-white font-bold text-sm rounded-2xl px-6 py-4 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                                        {mode === 'CREATE' ? 'Creating Team...' : 'Joining...'}
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-sm">{mode === 'CREATE' ? 'check_circle' : 'login'}</span>
                                        {mode === 'CREATE' ? 'Register Team' : 'Join Team'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamRegistrationModal;

import React, { useState } from 'react';
import { userService } from '../services/userService';

interface TeamRegistrationModalProps {
    eventId: string;
    eventName: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const TeamRegistrationModal: React.FC<TeamRegistrationModalProps> = ({ eventId, eventName, onSuccess, onCancel }) => {
    const [teamName, setTeamName] = useState('');
    const [createdTeamCode, setCreatedTeamCode] = useState<string | null>(null);
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
            if (mode === 'CREATE') {
                console.log('Creating team with data:', { eventId, teamName });
                const res = await userService.registerTeam(eventId, teamName, []);
                console.log('Team created successfully:', res);
                setCreatedTeamCode(res.team_code);
            } else {
                await userService.joinTeam(eventId, teamName); // teamName holds the code in JOIN mode
                onSuccess();
            }
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

    const handleCopyCode = () => {
        if (createdTeamCode) {
            navigator.clipboard.writeText(createdTeamCode);
        }
    };

    if (createdTeamCode) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                <div className="bg-[#1a262f] border border-[#213a4a] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn text-center p-6 sm:p-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                    </div>
                    <h2 className="text-white font-bold text-2xl mb-2">Team Registered!</h2>
                    <p className="text-slate-400 text-sm mb-6">Your team has been successfully created. Share this code with your teammates so they can join.</p>

                    <div className="bg-[#0f1b23] border border-[#213a4a] rounded-xl p-4 mb-6 relative group cursor-pointer" onClick={handleCopyCode}>
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Team Code</p>
                        <p className="text-3xl font-mono font-bold text-primary tracking-wider">{createdTeamCode}</p>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <span className="text-white text-xs font-bold">Click to Copy</span>
                        </div>
                    </div>

                    <button
                        onClick={onSuccess}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl px-6 py-3 shadow-lg transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-[#1a262f] border border-[#213a4a] rounded-lg w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn my-4 sm:my-8">
                <div className="bg-primary/10 border-b border-[#213a4a] px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-white font-bold text-base sm:text-lg">Team Registration</h2>
                        <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-widest font-mono truncate max-w-[180px] sm:max-w-[250px]">{eventName}</p>
                    </div>
                    <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex bg-[#0f1b23] p-1 rounded-lg border border-[#213a4a] mb-6">
                        <button
                            onClick={() => setMode('CREATE')}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'CREATE' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Create Team
                        </button>
                        <button
                            onClick={() => setMode('JOIN')}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'JOIN' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Join Team
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                {mode === 'CREATE' ? "Team Name" : "Team Code"}
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-primary transition-colors">
                                    {mode === 'CREATE' ? "groups" : "key"}
                                </span>
                                <input
                                    required
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full bg-[#0f1b23] border border-[#213a4a] rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
                                    placeholder={mode === 'CREATE' ? "Enter a unique team name" : "Enter the 5-digit team code"}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 px-1">
                                {mode === 'CREATE'
                                    ? "Create a team and get a code to share with teammates. Team size will be enforced based on the event."
                                    : "Enter the code shared by your Team Leader."}
                            </p>
                        </div>

                        <div className="pt-4 flex gap-3 border-t border-[#213a4a] mt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 rounded-xl border border-[#213a4a] text-slate-400 font-bold text-sm hover:bg-slate-800 hover:text-white transition-all underline-offset-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !teamName.trim()}
                                className="flex-[2] bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl px-6 py-3 shadow-[0_10px_30px_rgba(5,121,199,0.3)] hover:shadow-[0_15px_40px_rgba(5,121,199,0.4)] transition-all flex items-center justify-center gap-2"
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

import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, Copy, Check, Shield } from 'lucide-react';

interface ViewTeamModalProps {
    team: {
        team_name: string;
        team_code: string;
        members: any[];
    };
    onClose: () => void;
}

const ViewTeamModal: React.FC<ViewTeamModalProps> = ({ team, onClose }) => {
    const [copied, setCopied] = React.useState(false);

    // Safety check if team is undefined
    if (!team) return null;

    const teamCode = team.team_code || 'PENDING...';
    const teamName = team.team_name || 'Team';
    const members = Array.isArray(team.members) ? team.members : [];

    const handleCopy = () => {
        if (teamCode !== 'PENDING...') {
            navigator.clipboard.writeText(teamCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl selection:bg-primary/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#050505] border border-white/10 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="relative px-8 py-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <h2 className="text-3xl font-bold text-white mb-2">Team Sync</h2>
                    <p className="text-white/40 text-sm font-light tracking-wide">{teamName} | Event Details</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Team Code Section */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Access Protocol (Team Code)</label>
                        <div
                            onClick={handleCopy}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.05] transition-all"
                        >
                            <span className="text-3xl font-mono font-bold text-primary tracking-[0.3em]">{teamCode}</span>
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-white/40" />}
                            </div>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Synchronized Entities</label>
                            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">{members.length} Members</span>
                        </div>

                        <div className="space-y-3">
                            {members.map((member, idx) => {
                                const isObj = typeof member === 'object' && member !== null;
                                // Handle case where member might be just an ID string or an object
                                const name = isObj ? (member.name || member.user_name || 'Anonymous User') : 'Member (Syncing...)';
                                const email = isObj ? (member.email || '') : 'DETAILS HIDDEN';

                                return (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/5 font-bold text-xs">
                                                {name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white/80">{name}</p>
                                                {email && <p className="text-[10px] text-white/20 font-mono italic">{email}</p>}
                                            </div>
                                        </div>
                                        {isObj && member.role === 'leader' && (
                                            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center" title="Team Leader">
                                                <Shield className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ViewTeamModal;

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

    const handleCopy = () => {
        navigator.clipboard.writeText(team.team_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                    <p className="text-white/40 text-sm font-light tracking-wide">{team.team_name} | Event Details</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Team Code Section */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Access Protocol (Team Code)</label>
                        <div
                            onClick={handleCopy}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.05] transition-all"
                        >
                            <span className="text-3xl font-mono font-bold text-primary tracking-[0.3em]">{team.team_code}</span>
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-white/40" />}
                            </div>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Synchronized Entities</label>
                            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">{team.members.length} Members</span>
                        </div>

                        <div className="space-y-3">
                            {team.members.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/5 font-bold text-xs">
                                            {member.name?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white/80">{member.name || 'Anonymous User'}</p>
                                            <p className="text-[10px] text-white/20 font-mono italic">{member.email}</p>
                                        </div>
                                    </div>
                                    {idx === 0 && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                            <Shield className="h-3 w-3 text-primary" />
                                            <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">Leader</span>
                                        </div>
                                    )}
                                </div>
                            ))}
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

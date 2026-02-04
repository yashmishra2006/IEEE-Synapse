import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

interface RegistrationItem {
    event_id: string;
    event_name: string;
    registered_for_event_on: string;
    team_id?: string | null;
    team_name?: string | null;
    team_created_on?: string | null;
    role?: 'leader' | 'member' | null;
}

interface MyRegistrationsProps {
    onClose: () => void;
    onUpdate: () => void;
    onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const MyRegistrations: React.FC<MyRegistrationsProps> = ({ onClose, onUpdate, onNotify }) => {
    const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
    const [teamDetails, setTeamDetails] = useState<any>({});

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await userService.getRegistered();
            const regs = response.registered_event || [];
            setRegistrations(regs);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleUnregisterEvent = async (eventId: string, eventName: string) => {
        const confirmed = window.confirm(`Are you sure you want to unregister from "${eventName}"?`);
        if (!confirmed) return;

        try {
            setActionLoading(eventId);
            await userService.unregisterEvent(eventId);
            await fetchRegistrations();
            onUpdate();
            onNotify?.('Successfully unregistered from event', 'success');
        } catch (err: any) {
            onNotify?.(err.response?.data?.detail || 'Failed to unregister from event', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleLeaveTeam = async (eventId: string, teamName: string) => {
        const confirmed = window.confirm(`Are you sure you want to leave team "${teamName}"?`);
        if (!confirmed) return;

        try {
            setActionLoading(`${eventId}-leave`);
            await userService.leaveTeam(eventId, teamName);
            await fetchRegistrations();
            onUpdate();
            onNotify?.('Successfully left the team', 'success');
        } catch (err: any) {
            onNotify?.(err.response?.data?.detail || 'Failed to leave team', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteTeam = async (eventId: string, teamName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete team "${teamName}"?\n\nThis will remove all team members and cannot be undone.`
        );
        if (!confirmed) return;

        try {
            setActionLoading(`${eventId}-delete`);
            await userService.deleteTeam(eventId, teamName);
            await fetchRegistrations();
            onUpdate();
            onNotify?.('Successfully deleted team', 'success');
        } catch (err: any) {
            onNotify?.(err.response?.data?.detail || 'Failed to delete team', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const toggleTeamDetails = async (teamId: string) => {
        if (expandedTeam === teamId) {
            setExpandedTeam(null);
            return;
        }

        setExpandedTeam(teamId);

        if (!teamDetails[teamId]) {
            try {
                const response = await userService.getTeam(teamId);
                setTeamDetails(prev => ({ ...prev, [teamId]: response.data }));
            } catch (err: any) {
                onNotify?.(err.response?.data?.detail || 'Failed to fetch team details', 'error');
            }
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-[#1a262f] border border-[#213a4a] rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn my-4 sm:my-8">
                <div className="bg-primary/10 border-b border-[#213a4a] px-4 py-3 flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-white font-bold text-lg">My Registrations</h2>
                        <p className="text-slate-400 text-[10px] mt-0.5 uppercase tracking-widest font-mono">
                            Manage your events and teams
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 max-h-[65vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded flex items-center gap-2">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    ) : registrations.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4 block">event_busy</span>
                            <p className="text-slate-400">You haven't registered for any events yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {registrations.map((reg) => (
                                <div
                                    key={reg.event_id}
                                    className="bg-[#0f1b23] border border-[#213a4a] rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-lg mb-1">{reg.event_name}</h3>
                                                <p className="text-slate-500 text-xs flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    Registered on {formatDate(reg.registered_for_event_on)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleUnregisterEvent(reg.event_id, reg.event_name)}
                                                disabled={actionLoading === reg.event_id}
                                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading === reg.event_id ? (
                                                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                                )}
                                                Unregister
                                            </button>
                                        </div>

                                        {reg.team_id && reg.team_name && (
                                            <div className="mt-4 pt-4 border-t border-[#213a4a]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-primary/20 rounded-full size-8 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-primary text-sm">groups</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold text-sm">{reg.team_name}</p>
                                                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                                                {reg.role === 'leader' ? (
                                                                    <>
                                                                        <span className="material-symbols-outlined text-xs text-yellow-500">star</span>
                                                                        Team Leader
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="material-symbols-outlined text-xs">person</span>
                                                                        Team Member
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => toggleTeamDetails(reg.team_id!)}
                                                            className="bg-[#1a262f] hover:bg-[#213a4a] text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">
                                                                {expandedTeam === reg.team_id ? 'expand_less' : 'expand_more'}
                                                            </span>
                                                            Details
                                                        </button>
                                                        {reg.role === 'leader' ? (
                                                            <button
                                                                onClick={() => handleDeleteTeam(reg.event_id, reg.team_name!)}
                                                                disabled={actionLoading === `${reg.event_id}-delete`}
                                                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                {actionLoading === `${reg.event_id}-delete` ? (
                                                                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                )}
                                                                Delete Team
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleLeaveTeam(reg.event_id, reg.team_name!)}
                                                                disabled={actionLoading === `${reg.event_id}-leave`}
                                                                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                {actionLoading === `${reg.event_id}-leave` ? (
                                                                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-sm">logout</span>
                                                                )}
                                                                Leave Team
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {expandedTeam === reg.team_id && teamDetails[reg.team_id] && (
                                                    <div className="mt-3 bg-[#1a262f] rounded-lg p-4">
                                                        {teamDetails[reg.team_id].team_code && (
                                                            <div className="mb-4 bg-primary/10 border border-primary/30 rounded-lg p-3">
                                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Team Code</p>
                                                                <p className="text-2xl font-mono font-bold text-primary tracking-wider">{teamDetails[reg.team_id].team_code}</p>
                                                                <p className="text-xs text-slate-500 mt-1">Share this code with members to join</p>
                                                            </div>
                                                        )}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event</p>
                                                                <p className="text-white text-sm">{teamDetails[reg.team_id].event_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Created On</p>
                                                                <p className="text-white text-sm">{formatDate(teamDetails[reg.team_id].team_created_on)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Leader</p>
                                                                <p className="text-white text-sm">{teamDetails[reg.team_id].leader_name}</p>
                                                                <p className="text-slate-500 text-xs">{teamDetails[reg.team_id].leader_email}</p>
                                                            </div>
                                                        </div>

                                                        {teamDetails[reg.team_id].members && teamDetails[reg.team_id].members.length > 0 && (
                                                            <div>
                                                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Team Members ({teamDetails[reg.team_id].members.length})</p>
                                                                <div className="space-y-2">
                                                                    {teamDetails[reg.team_id].members.map((member: any, idx: number) => (
                                                                        <div key={idx} className="bg-[#0f1b23] rounded-lg p-3 flex items-center gap-3">
                                                                            <div className="bg-slate-700 rounded-full size-8 flex items-center justify-center shrink-0">
                                                                                <span className="material-symbols-outlined text-slate-300 text-sm">person</span>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-white text-sm font-medium truncate">{member.name}</p>
                                                                                <p className="text-slate-500 text-xs truncate">{member.email}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-[#213a4a] p-3 sm:p-4 bg-[#0f1b23]">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyRegistrations;

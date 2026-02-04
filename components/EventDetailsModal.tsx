import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

interface EventDetailsModalProps {
    eventId: string;
    onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ eventId, onClose }) => {
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setLoading(true);
                const response = await userService.getEventDetails(eventId);
                setEventDetails(response.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-[#1a262f] border border-[#213a4a] rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn my-4 sm:my-8">
                <div className="bg-primary/10 border-b border-[#213a4a] px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-white font-bold text-base sm:text-lg">Event Details</h2>
                        <p className="text-slate-400 text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-widest font-mono">
                            Registration Information
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded flex items-center gap-2">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    ) : eventDetails ? (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4 sm:p-6">
                                <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{eventDetails.event_name}</h3>
                                {eventDetails.event_description && (
                                    <p className="text-slate-300 text-xs sm:text-sm">{eventDetails.event_description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {eventDetails.event_date && (
                                    <div className="bg-[#0f1b23] border border-[#213a4a] rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Date</p>
                                                <p className="text-white font-medium">{formatDate(eventDetails.event_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {eventDetails.event_time && (
                                    <div className="bg-[#0f1b23] border border-[#213a4a] rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Time</p>
                                                <p className="text-white font-medium">{eventDetails.event_time}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {eventDetails.duration && (
                                    <div className="bg-[#0f1b23] border border-[#213a4a] rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">hourglass_empty</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Duration</p>
                                                <p className="text-white font-medium">{eventDetails.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {eventDetails.venue && (
                                    <div className="bg-[#0f1b23] border border-[#213a4a] rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Venue</p>
                                                <p className="text-white font-medium">{eventDetails.venue}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {eventDetails.event_capacity && (
                                    <div className="bg-[#0f1b23] border border-[#213a4a] rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-lg">group</span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider">Capacity</p>
                                                <p className="text-white font-medium">{eventDetails.event_capacity} participants</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {eventDetails.event_team_allowed && (
                                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">groups</span>
                                        <p className="text-white font-bold">Team Event</p>
                                    </div>
                                    {eventDetails.event_team_size && (
                                        <p className="text-slate-400 text-sm">
                                            Maximum team size: <span className="text-white font-medium">{eventDetails.event_team_size} members</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {eventDetails.event_prizes && (
                                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-yellow-500/20 rounded-full size-10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-yellow-500 text-lg">emoji_events</span>
                                        </div>
                                        <p className="text-white font-bold text-lg">Prizes</p>
                                    </div>
                                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{eventDetails.event_prizes}</p>
                                </div>
                            )}

                        </div>
                    ) : null}
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

export default EventDetailsModal;

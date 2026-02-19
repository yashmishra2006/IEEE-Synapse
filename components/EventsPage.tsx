import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Trophy,
    Users,
    Clock,
    Zap,
    ChevronRight,
    Search,
    Filter,
    CheckCircle2,
    User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EVENTS } from '../constants/events';
import { Spotlight } from './ui/Spotlight';
import FlickeringGrid from './ui/FlickeringGrid';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RegisterForm from './RegisterForm';

import TeamRegistrationModal from './TeamRegistrationModal';
import ViewTeamModal from './ViewTeamModal';
import ProfileModal from './ProfileModal';

const EventsPage: React.FC = () => {
    const {
        user,
        handleRegisterEvent,
        handleUnregisterEvent,
        registeredEventIds,
        userTeams,
        showRegisterForm,
        setShowRegisterForm,
        fetchProfile,
        refreshRegistrationData,
        showTeamModal,
        setShowTeamModal,
        showViewTeamModal,
        setShowViewTeamModal,
        selectedTeam,
        setSelectedTeam,
        registeringFor,
        availableEvents,
        addTeam
    } = useAuth();
    const { showToast } = useToast();
    const event = registeringFor ? availableEvents.find(e => e.id === registeringFor) : null;
    const eventName = event?.event_name || 'Event';
    const isHackathon = eventName.toLowerCase().includes('hackathon');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDay, setSelectedDay] = useState<'All' | '23 Feb' | '24 Feb' | '25 Feb' | '26 Feb' | '27 Feb'>('All');
    const [showProfileModal, setShowProfileModal] = useState(false);

    const filteredEvents = EVENTS.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.remarks.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDay = selectedDay === 'All' || event.date === selectedDay;
        // Show all events including Inauguration and Closing Ceremony
        return matchesSearch && matchesDay;
    });

    const days = ['All', '23 Feb', '24 Feb', '25 Feb', '26 Feb', '27 Feb'];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-display selection:bg-primary/30 overflow-x-hidden">
            {showRegisterForm && (
                <RegisterForm
                    user={user}
                    onSuccess={() => {
                        setShowRegisterForm(false);
                        fetchProfile();
                        if (registeringFor) handleRegisterEvent(registeringFor);
                    }}
                    onCancel={() => {
                        setShowRegisterForm(false);
                    }}
                />
            )}

            {showTeamModal && registeringFor && (
                <TeamRegistrationModal
                    eventId={registeringFor}
                    eventName={eventName}
                    onSuccess={async (team) => {
                        // First refresh to get latest data from backend
                        await refreshRegistrationData();
                        // Then update local state with the new team (in case refresh was slow)
                        addTeam(registeringFor, team);
                        setSelectedTeam(team);
                        setShowTeamModal(false);
                        setShowViewTeamModal(true);
                        showToast('Team registered successfully!', 'success');
                    }}
                    onCancel={() => {
                        setShowTeamModal(false);
                        // Only unregister if user doesn't have a team yet
                        // Check userTeams state to see if they completed team creation
                        if (!isHackathon && !userTeams[registeringFor]) {
                            handleUnregisterEvent(registeringFor);
                            showToast('Team is mandatory for this event. You have been unregistered.', 'info');
                        }
                    }}
                />
            )}

            {showViewTeamModal && selectedTeam && (
                <ViewTeamModal
                    team={selectedTeam}
                    onClose={() => setShowViewTeamModal(false)}
                />
            )}

            {showProfileModal && user && (
                <ProfileModal
                    user={user}
                    onClose={() => setShowProfileModal(false)}
                    onUpdate={fetchProfile}
                    onNotify={(message, type) => showToast(message, type)}
                />
            )}
            <div className="fixed inset-0 z-0">
                <FlickeringGrid
                    squareSize={4}
                    gridGap={6}
                    color="rgb(5, 121, 199)"
                    flickerChance={0.1}
                    maxOpacity={0.1}
                />
            </div>

            <Spotlight className="-top-40 left-0" fill="white" />

            <div className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 py-4 px-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link to="/" className="flex items-center gap-2 group text-white/60 hover:text-white transition-colors">
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
                            </Link>

                            {user && (
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="flex items-center justify-center gap-2 bg-white text-black h-9 w-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">My Profile</span>
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col items-end">
                            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">All Events</h1>
                            <p className="text-[9px] font-mono text-primary tracking-[0.3em] uppercase mt-1">IEEE USICT | 2026</p>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-20">
                    <div className="mb-16">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
                        >
                            EXPLORE THE<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">MULTIVERSE</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl font-bold text-white/60 mb-8 uppercase tracking-widest"
                        >
                            Total Prize Pool: <span className="text-primary italic">Rs. 80,000+</span>
                        </motion.p>

                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Search events, keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:bg-white/10 outline-none transition-all"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {days.map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day as any)}
                                        className={cn(
                                            "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                                            selectedDay === day
                                                ? "bg-white text-black"
                                                : "bg-white/5 border border-white/10 text-white/40 hover:border-white/20"
                                        )}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((event, idx) => (
                                <motion.div
                                    layout
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group relative h-full"
                                >
                                    <div className="h-full p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <Zap className="h-24 w-24 text-primary" />
                                        </div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full">
                                                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{event.date}</span>
                                                </div>
                                                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">ID: 00{event.id}</span>
                                            </div>

                                            <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors pr-10">
                                                {event.name}
                                            </h3>

                                            <p className="text-white/40 text-base font-light leading-relaxed mb-8 flex-grow">
                                                {event.remarks}
                                            </p>

                                            <div className="space-y-4 pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <MapPin className="h-4 w-4 text-white/40" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs uppercase tracking-widest text-white/20 font-bold">Venue</p>
                                                        <p className="text-sm text-white/80">{event.venue}</p>
                                                    </div>
                                                </div>

                                                {event.prizes && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <Trophy className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs uppercase tracking-widest text-primary/60 font-bold">Prizes</p>
                                                            <p className="text-sm text-white/80">{event.prizes}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {(() => {
                                                    const eventId = event.projectId || event.id.toString();
                                                    const meta = availableEvents.find(e => e.id === eventId);
                                                    const isTeamEvent = meta?.event_team_allowed;

                                                    return (
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                                <Users className="h-4 w-4 text-white/40" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs uppercase tracking-widest text-white/20 font-bold">Participation</p>
                                                                <p className="text-sm text-white/80">
                                                                    {event.teamSize
                                                                        ? `Team Size: ${event.teamSize}`
                                                                        : (isTeamEvent
                                                                            ? `Team Size: ${meta?.min_team_size || 1} - ${meta?.max_team_size || 4}`
                                                                            : 'Individual')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {(() => {
                                                const eventId = event.projectId || event.id.toString();
                                                const isRegistered = registeredEventIds.includes(eventId);
                                                const team = userTeams[eventId];
                                                const hasTeam = !!team;
                                                const meta = availableEvents.find(e => e.id === eventId);
                                                const needsTeam = meta?.event_team_allowed && !meta.event_name.toLowerCase().includes('hackathon');

                                                if (isRegistered) {
                                                    if (hasTeam) {
                                                        return (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTeam(team);
                                                                    setShowViewTeamModal(true);
                                                                }}
                                                                className="mt-8 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/30"
                                                            >
                                                                <Users className="h-4 w-4" />
                                                                View Team Details
                                                            </button>
                                                        );
                                                    }

                                                    if (needsTeam) {
                                                        return (
                                                            <button
                                                                onClick={() => handleRegisterEvent(eventId)}
                                                                className="mt-8 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30 animate-pulse"
                                                            >
                                                                <Users className="h-4 w-4" />
                                                                Complete Registration
                                                            </button>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            disabled
                                                            className="mt-8 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-500/50 border border-emerald-500/10 cursor-default"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            Registered
                                                        </button>
                                                    );
                                                }

                                                if (event.id === 1 || event.id === 10) {
                                                    return (
                                                        <button
                                                            disabled
                                                            className="mt-8 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-white/5 text-white/20 border border-white/5 cursor-default"
                                                        >
                                                            No Registration Required
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        onClick={() => {
                                                            if (event.name.toLowerCase().includes('locked in')) {
                                                                window.open('https://unstop.com/p/locked-in-university-school-of-information-communication-and-technology-usict-ggs-indraprastha-university-ggsipu-new-d-1639028', '_blank');
                                                                return;
                                                            }
                                                            handleRegisterEvent(eventId);
                                                        }}
                                                        className="mt-8 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-white text-black hover:bg-primary hover:text-white"
                                                    >
                                                        {event.name.toLowerCase().includes('locked in') ? (
                                                            <>
                                                                Register on Unstop
                                                                <ChevronRight className="h-4 w-4" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Register Interest
                                                                <ChevronRight className="h-4 w-4" />
                                                            </>
                                                        )}
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredEvents.length === 0 && (
                        <div className="py-40 text-center">
                            <p className="text-white/20 font-mono text-sm tracking-widest uppercase">No temporal anomalies found in this sector.</p>
                        </div>
                    )}
                </main>

                <footer className="py-20 border-t border-white/5 text-center">
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">Transcend Boundaries | USICT 2026</p>
                </footer>
            </div>
        </div>
    );
};

export default EventsPage;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { userService } from '../services/userService';
import { User, Event } from '../types/api';

interface AuthContextType {
    user: any;
    isLoading: boolean;
    availableEvents: Event[];
    registeredEventIds: string[];
    userTeams: Record<string, any>;
    handleLoginSuccess: (credentialResponse: any) => Promise<void>;
    handleLogout: () => void;
    handleRegisterEvent: (eventId: string) => Promise<void>;
    handleUnregisterEvent: (eventId: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
    refreshRegistrationData: () => Promise<void>;
    triggerLogin: () => void;
    showRegisterForm: boolean;
    setShowRegisterForm: (show: boolean) => void;
    registeringFor: string | null;
    setRegisteringFor: (id: string | null) => void;
    showTeamModal: boolean;
    setShowTeamModal: (show: boolean) => void;
    showViewTeamModal: boolean;
    setShowViewTeamModal: (show: boolean) => void;
    selectedTeam: any;
    setSelectedTeam: (team: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
    const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
    const [userTeams, setUserTeams] = useState<Record<string, any>>({});
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showViewTeamModal, setShowViewTeamModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [registeringFor, setRegisteringFor] = useState<string | null>(null);
    const [pendingEventId, setPendingEventId] = useState<string | null>(null);

    const triggerLogin = () => {
        const loginBtn = document.querySelector('#global-login-trigger [role="button"]') as HTMLElement;
        if (loginBtn) {
            loginBtn.click();
        } else {
            console.error('Login trigger button not found');
        }
    };

    const fetchProfile = async () => {
        const token = localStorage.getItem('synapse_auth_token');
        if (!token) return;

        try {
            const profileRes = await userService.getProfile();
            const profile = profileRes.data || profileRes;

            if (!profile.email) {
                const decoded: any = jwtDecode(token);
                setUser({ ...profile, email: decoded.email, isLoggedIn: true });
            } else {
                setUser({ ...profile, isLoggedIn: true });
            }
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            handleLogout();
        }
    };

    const refreshRegistrationData = async () => {
        try {
            const [registered, events] = await Promise.all([
                userService.getRegistered(),
                userService.getAllEvents()
            ]);

            // Normalizing events
            let eventsArray: any[] = [];
            if (Array.isArray(events)) {
                eventsArray = events;
            } else if (events && typeof events === 'object') {
                eventsArray = events.events || events.data || events.items || [];
            }
            const normalizedEvents = eventsArray.map((e: any) => ({
                ...e,
                id: e.id || e._id || (typeof e === 'string' ? e : null)
            })).filter((e: any) => e.id);
            setAvailableEvents(normalizedEvents);

            // Normalizing registrations
            let regArray: any[] = [];
            let teamsObj: Record<string, any> = {};

            if (registered && typeof registered === 'object') {
                regArray = registered.registered_event || registered.registered || registered.data || registered.items || [];
                const teamsArray = registered.registered_team || registered.teams || [];
                teamsArray.forEach((t: any) => {
                    if (t.event_id) teamsObj[t.event_id] = t;
                });
            } else if (Array.isArray(registered)) {
                regArray = registered;
            }

            setUserTeams(teamsObj);
            setRegisteredEventIds(regArray.map((r: any) => {
                if (typeof r === 'string') return r;
                return r.event_id || r.id || r._id || (r.event ? (r.event.id || r.event._id) : null);
            }).filter(Boolean));
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
    };

    const handleLoginSuccess = async (credentialResponse: any) => {
        if (credentialResponse.credential) {
            try {
                setIsLoading(true);
                const synapseToken = await userService.authenticate(credentialResponse.credential);
                localStorage.setItem('synapse_auth_token', synapseToken);

                await fetchProfile();
                await refreshRegistrationData();
            } catch (err) {
                console.error('Auth error:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem('synapse_auth_token');
        setUser(null);
        setRegisteredEventIds([]);
        setAvailableEvents([]);
        setUserTeams({});
        setPendingEventId(null);
    };

    const handleUnregisterEvent = async (eventId: string) => {
        try {
            setIsLoading(true);
            await userService.unregisterEvent(eventId);
            await refreshRegistrationData();
        } catch (err) {
            console.error('Failed to unregister:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterEvent = async (eventId: string) => {
        if (!user) {
            setPendingEventId(eventId);
            triggerLogin();
            return;
        }

        try {
            const profileRes = await userService.getProfile();
            const profile = profileRes.data || profileRes;
            setUser(profile);

            if (!profile.name || !profile.phone_number || !profile.college_or_university) {
                setRegisteringFor(eventId);
                setShowRegisterForm(true);
                return;
            }
        } catch (err) {
            console.warn("Could not refresh profile, using cached data.");
        }

        try {
            setIsLoading(true);

            if (!registeredEventIds.includes(eventId)) {
                await userService.registerEvent(eventId);
                await refreshRegistrationData();
            }

            const eventMetadata = availableEvents.find(e => e.id === eventId);
            if (eventMetadata?.event_team_allowed) {
                // If it's a team event and user isn't in a team, show modal
                if (!userTeams[eventId]) {
                    setRegisteringFor(eventId);
                    setShowTeamModal(true);
                } else {
                    alert('Successfully registered!');
                }
            } else {
                alert('Successfully registered for ' + (eventMetadata?.event_name || 'event') + '!');
            }
            setPendingEventId(null);
        } catch (err: any) {
            console.error('Registration error:', err);
            alert(err.response?.data?.detail || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && pendingEventId) {
            handleRegisterEvent(pendingEventId);
        }
    }, [user]);

    useEffect(() => {
        const token = localStorage.getItem('synapse_auth_token');
        if (token) {
            fetchProfile();
            refreshRegistrationData();
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            availableEvents,
            registeredEventIds,
            userTeams,
            handleLoginSuccess,
            handleLogout,
            handleRegisterEvent,
            handleUnregisterEvent,
            fetchProfile,
            refreshRegistrationData,
            triggerLogin,
            showRegisterForm,
            setShowRegisterForm,
            registeringFor,
            setRegisteringFor,
            showTeamModal,
            setShowTeamModal,
            showViewTeamModal,
            setShowViewTeamModal,
            selectedTeam,
            setSelectedTeam
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

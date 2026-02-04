import api from '../utils/api';
import { User, UserRegistration, Event } from '../types/api';

export const userService = {
    // Authenticate with Google Token to get Backend Token
    authenticate: async (googleToken: string) => {
        const response = await api.post('/auth/user', { token: googleToken });
        // The backend might return { "token": "..." } or { "access_token": "..." } or just the string
        const data = response.data;
        if (typeof data === 'string') return data;
        return data.token || data.access_token || data;
    },

    // Signup User
    register: async (userData: UserRegistration) => {
        const response = await api.patch('/users/register', userData);
        return response.data;
    },

    // Update User Details
    updateDetails: async (userData: Partial<UserRegistration>) => {
        const response = await api.patch('/users/change-details', userData);
        return response.data;
    },

    // Register for an Event
    registerEvent: async (eventId: string) => {
        const response = await api.patch(`/users/register-event?event_id=${eventId}`);
        return response.data;
    },

    // Unregister from an Event
    unregisterEvent: async (eventId: string) => {
        const response = await api.delete(`/users/unregister-event?event_id=${eventId}`);
        return response.data;
    },

    // Get User Profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Get Registered Events and Teams
    getRegistered: async () => {
        const response = await api.get('/users/registered');
        return response.data;
    },

    // Get details of a specific registered event
    getEventDetails: async (eventId: string) => {
        const response = await api.get(`/users/event?event_id=${eventId}`);
        return response.data;
    },

    // Get team details
    getTeam: async (teamId: string) => {
        const response = await api.get(`/users/team?team_id=${teamId}`);
        return response.data;
    },

    // Get all session events
    getAllEvents: async () => {
        const response = await api.get('/users/events');
        return response.data;
    },

    // Get archived events
    getArchive: async () => {
        const response = await api.get('/users/archive');
        return response.data;
    },

    // Register a Team
    registerTeam: async (eventId: string, teamName: string, members: any[]) => {
        // Backend now expects a JSON body matching TeamRegister schema
        const payload = {
            event_id: eventId,
            team_name: teamName,
            members: members
        };
        console.log('Registering team with payload:', payload);
        const response = await api.post('/team/register', payload);
        console.log('Team registration response:', response.data);
        return response.data;
    },

    // Join a Team
    joinTeam: async (eventId: string, teamCode: string) => {
        const response = await api.patch(`/team/join?event_id=${eventId}&team_code=${encodeURIComponent(teamCode)}`);
        return response.data;
    },

    // Leave a Team
    leaveTeam: async (eventId: string, teamName: string) => {
        const response = await api.patch(`/team/leave?event_id=${eventId}&team_name=${encodeURIComponent(teamName)}`);
        return response.data;
    },

    // Delete a Team (Leader only)
    deleteTeam: async (eventId: string, teamName: string) => {
        const response = await api.delete(`/team/delete?event_id=${eventId}&team_name=${encodeURIComponent(teamName)}`);
        return response.data;
    },

    // Get image of current year
    getImage: async (imageId: string) => {
        const response = await api.get(`/users/image/${imageId}`);
        return response.data;
    },

    // Get image from archive
    getArchivedImage: async (year: string, imageId: string) => {
        const response = await api.get(`/users/image/${year}/${imageId}`);
        return response.data;
    }
};

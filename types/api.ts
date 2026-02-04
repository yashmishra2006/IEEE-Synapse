export interface User {
    name: string;
    email: string;
    phone_number: string;
    college_or_university: string;
    course: string;
    year: number;
    gender: 'M' | 'F' | 'O';
    github_profile?: string;
    linkedin_profile?: string;
}

export interface UserRegistration extends User { }

export interface Event {
    id: string;
    event_name: string;
    event_description?: string;
    event_date?: string;
    event_time?: string;
    duration?: string;
    last_date_to_register?: string;
    event_capacity?: number;
    event_type?: 'Free' | 'Paid';
    event_team_allowed?: boolean;
    event_team_size?: number;
    venue?: string;
    person_incharge?: string;
    event_status?: 'Ongoing' | 'Completed';
}

export interface Team {
    id: string;
    team_name: string;
    event_id: string;
    leader_id: string;
    members: string[]; // array of user IDs or emails
}

export interface AuthToken {
    user_id: string;
    email: string;
    exp: number;
}

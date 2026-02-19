export interface Event {
    id: number;
    projectId?: string; // MongoDB _id for backend reference
    name: string;
    date: string;
    venue: string;
    prizes?: string;
    participants?: number;
    teamSize?: string;
    remarks: string;
}

export const EVENTS: Event[] = [
    {
        id: 1,
        name: "Inauguration Day",
        date: "23 Feb",
        venue: "E Block Seminar Hall",
        remarks: "Lamp Lighting Ceremony & Inauguration Day",
        participants: 100
    },
    {
        id: 12,
        projectId: "69823eaf8914fa0818cfff96",
        name: "Treasure Hunt",
        date: "23 Feb",
        venue: "TnP Room",
        prizes: "Rs. 2,000",
        participants: 100,
        teamSize: "3",
        remarks: "Problem-solving activity"
    },
    {
        id: 5,
        projectId: "69823eaf8914fa0818cfff8f",
        name: "Designathon",
        date: "23 Feb",
        venue: "TnP Room",
        prizes: "Rs. 3,000",
        participants: 60,
        teamSize: "2",
        remarks: "UI/UX design competition"
    },
    {
        id: 6,
        projectId: "69823eaf8914fa0818cfff90",
        name: "Gaming Event",
        date: "23-27 Feb",
        venue: "TnP Room",
        prizes: "Rs. 3,000",
        participants: 60,
        remarks: "Gaming Event Begins - Continues on all 5 days"
    },
    {
        id: 11,
        projectId: "69823eaf8914fa0818cfff95",
        name: "IPL Auction",
        date: "24 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Rs. 3,000",
        participants: 90,
        teamSize: "5",
        remarks: "Auction simulation for strategy skills - 1pm Onwards"
    },
    {
        id: 3,
        projectId: "69823eaf8914fa0818cfff8d",
        name: "Podcast",
        date: "25 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Rs. 4,000",
        participants: 100,
        remarks: "WIE Day - 11am Onwards"
    },
    {
        id: 8,
        projectId: "69823eaf8914fa0818cfff92",
        name: "FrameSync",
        date: "25 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Rs. 5,000",
        remarks: "WIE Day - 11am Onwards"
    },
    {
        id: 9,
        projectId: "69823eaf8914fa0818cfff93",
        name: "Spin the Wheel",
        date: "25 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Rs. 8,000",
        participants: 60,
        remarks: "WIE Day - 11am Onwards"
    },
    {
        id: 2,
        projectId: "69823eaf8914fa0818cfff8c",
        name: "Locked In Hackathon",
        date: "26 Feb",
        venue: "AIC",
        prizes: "Rs. 12,000",
        participants: 60,
        remarks: "8-hour hackathon for innovative tech solutions - 9am to 5pm"
    },
    {
        id: 10,
        name: "Closing Ceremony",
        date: "27 Feb",
        venue: "E Block Seminar Hall",
        remarks: "Winner Announcements, Certificates & Prizes"
    },
    {
        id: 7,
        projectId: "69823eaf8914fa0818cfff91",
        name: "EarthWear - Coming Soon",
        date: "Coming Soon",
        venue: "Amphi Theatre",
        remarks: "WIE Day celebration event"
    }
];

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
        name: "Inauguration",
        date: "23 Feb",
        venue: "E Block Seminar Hall",
        remarks: "Lamp Lighting Ceremony",
        participants: 100
    },
    {
        id: 2,
        projectId: "69823eaf8914fa0818cfff8c",
        name: "Locked In Hackathon",
        date: "23 Feb",
        venue: "AIC/TnP",
        prizes: "Rs. 12,000",
        participants: 60,
        remarks: "8-hour hackathon for innovative tech solutions"
    },
    {
        id: 3,
        projectId: "69823eaf8914fa0818cfff8d",
        name: "Podcast",
        date: "23 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Rs. 4,000",
        participants: 100,
        remarks: "Interactive session on technology and careers"
    },
    {
        id: 4,
        projectId: "69823eaf8914fa0818cfff8e",
        name: "Imagium – Photo Event",
        date: "23 Feb",
        venue: "—",
        prizes: "Rs. 2,000",
        participants: 100,
        remarks: "Photography competition"
    },
    {
        id: 5,
        projectId: "69823eaf8914fa0818cfff8f",
        name: "Designathon",
        date: "24 Feb",
        venue: "AIC/TnP",
        prizes: "Rs. 3,000",
        participants: 60,
        teamSize: "2",
        remarks: "UI/UX design competition"
    },
    {
        id: 6,
        projectId: "69823eaf8914fa0818cfff90",
        name: "Gaming Event",
        date: "24 Feb",
        venue: "AIC",
        prizes: "Rs. 3,000",
        participants: 60,
        remarks: "Multiplayer gaming rounds"
    },
    {
        id: 7,
        projectId: "69823eaf8914fa0818cfff91",
        name: "EarthWear",
        date: "25 Feb",
        venue: "Amphi Theatre",
        prizes: "Rs. 14,200",
        participants: 64,
        teamSize: "3",
        remarks: "WIE Day celebration event"
    },
    {
        id: 8,
        projectId: "69823eaf8914fa0818cfff92",
        name: "FrameSync",
        date: "25 Feb",
        venue: "College Campus",
        prizes: "Rs. 5,000",
        remarks: "Photography & video editing challenge"
    },
    {
        id: 9,
        projectId: "69823eaf8914fa0818cfff93",
        name: "Spin the Wheel",
        date: "25 Feb",
        venue: "Amphi Theatre",
        prizes: "Rs. 8,000",
        participants: 60,
        remarks: "Interactive tech challenge"
    },
    {
        id: 10,
        projectId: "69823eaf8914fa0818cfff94",
        name: "IEEE Startup Sprint",
        date: "26 Feb",
        venue: "AIC",
        prizes: "Rs. 22,500",
        participants: 60,
        teamSize: "3",
        remarks: "Startup pitching with AIC support"
    },
    {
        id: 11,
        projectId: "69823eaf8914fa0818cfff95",
        name: "IPL Auction",
        date: "26 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Rs. 3,000",
        participants: 90,
        teamSize: "5",
        remarks: "Auction simulation for strategy skills"
    },
    {
        id: 12,
        projectId: "69823eaf8914fa0818cfff96",
        name: "Treasure Hunt",
        date: "27 Feb",
        venue: "TnP",
        prizes: "Rs. 2,000",
        participants: 100,
        teamSize: "3",
        remarks: "Problem-solving activity"
    },
    {
        id: 13,
        projectId: "69823eaf8914fa0818cfff97",
        name: "Stock Trading",
        date: "27 Feb",
        venue: "TnP",
        prizes: "Rs. 3,000",
        participants: 60,
        remarks: "Paper trading simulation"
    }
];

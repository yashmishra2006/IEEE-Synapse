export interface Event {
    id: number;
    projectId?: string; // MongoDB _id for backend reference
    name: string;
    date: string;
    venue: string;
    prizes?: string;
    participants?: number;
    remarks: string;
}

export const EVENTS: Event[] = [
    {
        id: 1,
        name: "Inauguration",
        date: "16 Feb",
        venue: "E Block Seminar Hall",
        remarks: "Lamp Lighting Ceremony",
        participants: 100
    },
    {
        id: 2,
        projectId: "69823eaf8914fa0818cfff8c",
        name: "Locked In Hackathon",
        date: "16 Feb",
        venue: "AIC/TnP",
        prizes: "Rs. 12,000",
        participants: 60,
        remarks: "24-hour hackathon for innovative tech solutions"
    },
    {
        id: 3,
        projectId: "69823eaf8914fa0818cfff8d",
        name: "Podcast",
        date: "16 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Gifts: Rs. 4,000",
        participants: 100,
        remarks: "Interactive session on technology and careers"
    },
    {
        id: 4,
        projectId: "69823eaf8914fa0818cfff8e",
        name: "Imagium – Photo Event",
        date: "16 Feb",
        venue: "—",
        prizes: "Rs. 2,000 (2 winners)",
        participants: 100,
        remarks: "Photography competition"
    },
    {
        id: 5,
        projectId: "69823eaf8914fa0818cfff8f",
        name: "Designathon",
        date: "17 Feb",
        venue: "AIC/TnP",
        prizes: "1st: Rs. 1,500, 2nd: Rs. 1,000, 3rd: Rs. 500",
        participants: 60,
        remarks: "UI/UX design competition"
    },
    {
        id: 6,
        projectId: "69823eaf8914fa0818cfff90",
        name: "Gaming Event",
        date: "17 Feb",
        venue: "AIC",
        prizes: "Rs. 3,000",
        participants: 60,
        remarks: "Multiplayer gaming rounds"
    },
    {
        id: 7,
        projectId: "69823eaf8914fa0818cfff91",
        name: "EarthWear",
        date: "18 Feb",
        venue: "Amphi Theatre",
        prizes: "Prizes: Rs. 7,000, Gifts: Rs. 7,200",
        participants: 64,
        remarks: "WIE Day celebration event"
    },
    {
        id: 8,
        projectId: "69823eaf8914fa0818cfff92",
        name: "FrameSync",
        date: "18 Feb",
        venue: "—",
        prizes: "1st: Rs. 2,500, 2nd: Rs. 1,500, 3rd: Rs. 1,000",
        remarks: "Photography & video editing challenge"
    },
    {
        id: 9,
        projectId: "69823eaf8914fa0818cfff93",
        name: "Spin the Wheel",
        date: "18 Feb",
        venue: "Amphi Theatre",
        prizes: "Gifts: Rs. 7,500, Stationary: Rs. 500",
        participants: 60,
        remarks: "Interactive tech challenge"
    },
    {
        id: 10,
        projectId: "69823eaf8914fa0818cfff94",
        name: "IEEE Startup Sprint",
        date: "19 Feb",
        venue: "AIC",
        prizes: "Prizes: Rs. 22,500",
        participants: 60,
        remarks: "Startup pitching with AIC support"
    },
    {
        id: 11,
        projectId: "69823eaf8914fa0818cfff95",
        name: "IPL Auction",
        date: "19 Feb",
        venue: "E Block Seminar Hall",
        prizes: "Prize: Rs. 3,000",
        participants: 90,
        remarks: "Auction simulation for strategy skills"
    },
    {
        id: 12,
        projectId: "69823eaf8914fa0818cfff96",
        name: "Treasure Hunt",
        date: "20 Feb",
        venue: "TnP",
        prizes: "Prize: Rs. 2,000",
        participants: 100,
        remarks: "Problem-solving activity"
    },
    {
        id: 13,
        projectId: "69823eaf8914fa0818cfff97",
        name: "Stock Trading",
        date: "20 Feb",
        venue: "TnP",
        prizes: "1st: Rs. 1,500, 2nd: Rs. 1,000, 3rd: Rs. 500",
        participants: 60,
        remarks: "Paper trading simulation"
    },
    {
        id: 14,
        name: "Closing Ceremony",
        date: "20 Feb",
        venue: "E Block Seminar Hall",
        participants: 100,
        remarks: "Session by IEEE mentors"
    },
    {
        id: 15,
        name: "Printables & Merch",
        date: "—",
        venue: "—",
        remarks: "Event branding materials"
    }
];
